# ============================================================
# Outputs — naming uses _01_, _02_ prefixes for ordered display.
# Phase 4-7 of the deployment runbook reference these by name.
# ============================================================

output "_01_route53_nameservers" {
  description = "★ ACTION REQUIRED: set these 4 nameservers in GoDaddy"
  value       = aws_route53_zone.main.name_servers
}

output "_02_domain_name" {
  description = "Apex domain"
  value       = var.domain_name
}

output "alb_dns_name" {
  description = "ALB DNS name (works without DNS / for direct testing)"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "ALB hosted zone ID (used by Route 53 alias records)"
  value       = aws_lb.main.zone_id
}

output "ec2_public_ips" {
  description = "Public IPs of the app instances"
  value       = aws_instance.app[*].public_ip
}

output "ec2_instance_ids" {
  description = "EC2 instance IDs"
  value       = aws_instance.app[*].id
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint (host:port)"
  value       = aws_db_instance.main.endpoint
}

output "rds_address" {
  description = "RDS PostgreSQL hostname (no port)"
  value       = aws_db_instance.main.address
}

output "redis_endpoint" {
  description = "Redis primary endpoint"
  value       = aws_elasticache_cluster.main.cache_nodes[0].address
}

output "s3_uploads_bucket" {
  description = "User-uploads bucket name"
  value       = aws_s3_bucket.uploads.bucket
}

output "s3_assets_bucket" {
  description = "Build-artifacts bucket name"
  value       = aws_s3_bucket.assets.bucket
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "vpc_cidr" {
  description = "VPC CIDR block"
  value       = aws_vpc.main.cidr_block
}

output "db_secret_arn" {
  description = "Secrets Manager ARN for DB credentials"
  value       = aws_secretsmanager_secret.db.arn
}

output "ssh_command_instance_1" {
  description = "Ready-to-paste SSH command for instance 1"
  value       = "ssh -i ./${local.name_prefix}-ec2-key.pem ec2-user@${aws_instance.app[0].public_ip}"
}

output "ssh_command_instance_2" {
  description = "Ready-to-paste SSH command for instance 2"
  value       = var.ec2_count > 1 ? "ssh -i ./${local.name_prefix}-ec2-key.pem ec2-user@${aws_instance.app[1].public_ip}" : "(only 1 instance deployed)"
}

output "db_password_command" {
  description = "Run this to fetch the DB master password"
  value       = "aws secretsmanager get-secret-value --profile ${var.aws_profile} --region ${var.region} --secret-id ${aws_secretsmanager_secret.db.name} --query SecretString --output text | jq -r .password"
}
