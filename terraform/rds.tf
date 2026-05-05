# ============================================================
# RDS PostgreSQL 16 + Secrets Manager
# ============================================================

resource "random_password" "db" {
  length  = 32
  special = true
  # Avoid characters that confuse PostgreSQL connection strings.
  override_special = "!#$%^*()-_=+[]{}<>?"
}

resource "aws_secretsmanager_secret" "db" {
  name                    = "${local.name_prefix}-db-credentials"
  description             = "PostgreSQL master credentials for ${local.name_prefix}"
  recovery_window_in_days = 0

  tags = { Name = "${local.name_prefix}-db-credentials" }
}

resource "aws_secretsmanager_secret_version" "db" {
  secret_id = aws_secretsmanager_secret.db.id
  secret_string = jsonencode({
    username = var.rds_username
    password = random_password.db.result
    engine   = "postgres"
    host     = aws_db_instance.main.address
    port     = 5432
    dbname   = var.rds_db_name
  })
}

resource "aws_db_subnet_group" "main" {
  name       = "${local.name_prefix}-db-subnets"
  subnet_ids = aws_subnet.private[*].id

  tags = { Name = "${local.name_prefix}-db-subnets" }
}

resource "aws_db_parameter_group" "main" {
  name   = "${local.name_prefix}-pg16"
  family = "postgres16"

  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_disconnections"
    value = "1"
  }

  tags = { Name = "${local.name_prefix}-pg16" }
}

resource "aws_db_instance" "main" {
  identifier              = "${local.name_prefix}-db"
  engine                  = "postgres"
  engine_version          = var.rds_engine_version
  instance_class          = var.rds_instance_class
  allocated_storage       = var.rds_allocated_storage
  storage_type            = "gp3"
  storage_encrypted       = true
  db_name                 = var.rds_db_name
  username                = var.rds_username
  password                = random_password.db.result
  port                    = 5432
  multi_az                = var.rds_multi_az
  publicly_accessible     = false
  db_subnet_group_name    = aws_db_subnet_group.main.name
  vpc_security_group_ids  = [aws_security_group.rds.id]
  parameter_group_name    = aws_db_parameter_group.main.name
  # Free-tier RDS allows backup retention 0 only.
  # Bump to 7+ once you upgrade to a paid plan.
  backup_retention_period = 0
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:30-sun:05:30"
  auto_minor_version_upgrade = true
  copy_tags_to_snapshot   = true

  # Production hardening — flip these to true before real traffic
  deletion_protection = false
  skip_final_snapshot = true

  performance_insights_enabled = false

  tags = { Name = "${local.name_prefix}-db" }
}
