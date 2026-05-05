# ============================================================
# EC2 instances — 2× t3.micro behind ALB
# Includes: TLS keypair (saved as .pem), AWS keypair, IAM
# instance profile with SecretsManager + S3 + CloudWatch read.
# ============================================================

# ---- SSH keypair (generated locally, .pem written to disk) ----
resource "tls_private_key" "ec2" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "ec2" {
  key_name   = "${local.name_prefix}-ec2-key"
  public_key = tls_private_key.ec2.public_key_openssh

  tags = { Name = "${local.name_prefix}-ec2-key" }
}

resource "local_sensitive_file" "ec2_pem" {
  filename        = "${path.module}/${local.name_prefix}-ec2-key.pem"
  content         = tls_private_key.ec2.private_key_pem
  file_permission = "0400"
}

# ---- Latest Amazon Linux 2023 AMI ----
data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023*-x86_64"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# ---- IAM role + instance profile ----
data "aws_iam_policy_document" "ec2_assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "app" {
  name               = "${local.name_prefix}-app-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume_role.json

  tags = { Name = "${local.name_prefix}-app-role" }
}

# Inline policy: read DB secret, read/write S3 buckets, write CloudWatch logs
data "aws_iam_policy_document" "app_inline" {
  statement {
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
    ]
    resources = [aws_secretsmanager_secret.db.arn]
  }

  statement {
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
    ]
    resources = [
      aws_s3_bucket.uploads.arn,
      "${aws_s3_bucket.uploads.arn}/*",
      aws_s3_bucket.assets.arn,
      "${aws_s3_bucket.assets.arn}/*",
    ]
  }

  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogStreams",
    ]
    resources = ["${aws_cloudwatch_log_group.system.arn}:*"]
  }
}

resource "aws_iam_role_policy" "app" {
  name   = "${local.name_prefix}-app-inline"
  role   = aws_iam_role.app.id
  policy = data.aws_iam_policy_document.app_inline.json
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.app.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "app" {
  name = "${local.name_prefix}-app-profile"
  role = aws_iam_role.app.name
}

# ---- User-data template ----
locals {
  user_data = templatefile("${path.module}/user_data.sh.tpl", {
    region         = var.region
    db_secret_arn  = aws_secretsmanager_secret.db.arn
    db_endpoint    = aws_db_instance.main.address
    db_name        = var.rds_db_name
    db_username    = var.rds_username
    redis_endpoint = aws_elasticache_cluster.main.cache_nodes[0].address
    redis_port     = aws_elasticache_cluster.main.cache_nodes[0].port
    uploads_bucket = aws_s3_bucket.uploads.bucket
    assets_bucket  = aws_s3_bucket.assets.bucket
    app_port       = var.app_port
    log_group      = aws_cloudwatch_log_group.system.name
  })
}

# ---- App instances ----
resource "aws_instance" "app" {
  count                       = var.ec2_count
  ami                         = data.aws_ami.al2023.id
  instance_type               = var.ec2_instance_type
  subnet_id                   = aws_subnet.public[count.index % length(aws_subnet.public)].id
  vpc_security_group_ids      = [aws_security_group.app.id]
  key_name                    = aws_key_pair.ec2.key_name
  iam_instance_profile        = aws_iam_instance_profile.app.name
  associate_public_ip_address = true
  user_data                   = local.user_data
  user_data_replace_on_change = false

  root_block_device {
    volume_type           = "gp3"
    volume_size           = var.ec2_root_volume_gb
    delete_on_termination = true
    encrypted             = true
  }

  metadata_options {
    http_tokens                 = "required"
    http_endpoint               = "enabled"
    http_put_response_hop_limit = 2
  }

  tags = {
    Name = "${local.name_prefix}-app-${count.index + 1}"
    Role = "app"
  }

  depends_on = [
    aws_db_instance.main,
    aws_elasticache_cluster.main,
  ]
}
