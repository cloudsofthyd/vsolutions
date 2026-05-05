variable "aws_profile" {
  description = "AWS named profile (must be 'vsolutions' per project policy)"
  type        = string
  default     = "vsolutions"
}

variable "region" {
  description = "AWS region (locked to us-east-1 per project policy)"
  type        = string
  default     = "us-east-1"
}

variable "project" {
  description = "Project name prefix used for resource naming"
  type        = string
  default     = "vsolutions"
}

variable "environment" {
  description = "Environment name (prod, staging, etc.)"
  type        = string
  default     = "prod"
}

# ------------------------------------------------------------------ Networking
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDR blocks (one per AZ)"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "Private subnet CIDR blocks (one per AZ) for RDS/Redis"
  type        = list(string)
  default     = ["10.0.11.0/24", "10.0.12.0/24"]
}

variable "ssh_allowed_cidrs" {
  description = "CIDR blocks allowed to SSH to EC2 — TIGHTEN for production"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

# ------------------------------------------------------------------ Domain
variable "domain_name" {
  description = "Apex domain name (registered at GoDaddy, DNS moving to Route 53)"
  type        = string
  default     = "vsolutionsinc.com"
}

# ------------------------------------------------------------------ Compute
variable "ec2_instance_type" {
  description = "EC2 instance type (free-tier-friendly default)"
  type        = string
  default     = "t3.micro"
}

variable "ec2_count" {
  description = "Number of EC2 app instances"
  type        = number
  default     = 2
}

variable "ec2_root_volume_gb" {
  description = "EC2 root volume size in GB"
  type        = number
  default     = 20
}

variable "app_port" {
  description = "Port the Next.js app listens on inside each EC2"
  type        = number
  default     = 3000
}

# ------------------------------------------------------------------ Database
variable "rds_engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "16.4"
}

variable "rds_instance_class" {
  description = "RDS instance class (db.t3.micro is free-tier eligible)"
  type        = string
  default     = "db.t3.micro"
}

variable "rds_allocated_storage" {
  description = "RDS storage in GB (20 is free-tier eligible)"
  type        = number
  default     = 20
}

variable "rds_db_name" {
  description = "Initial database name"
  type        = string
  default     = "vsolutions"
}

variable "rds_username" {
  description = "Master DB username"
  type        = string
  default     = "vsolutions_admin"
}

variable "rds_multi_az" {
  description = "Enable Multi-AZ for RDS (~2x cost; off by default)"
  type        = bool
  default     = false
}

# ------------------------------------------------------------------ Cache
variable "redis_node_type" {
  description = "ElastiCache Redis node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_engine_version" {
  description = "Redis engine version"
  type        = string
  default     = "7.1"
}

# ------------------------------------------------------------------ Tags
variable "extra_tags" {
  description = "Additional tags merged into common_tags"
  type        = map(string)
  default     = {}
}
