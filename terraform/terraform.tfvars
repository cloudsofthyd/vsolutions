aws_profile = "vsolutions"
region      = "us-east-1"
project     = "vsolutions"
environment = "prod"

domain_name = "vsolutionsinc.com"

# Networking
vpc_cidr             = "10.0.0.0/16"
public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnet_cidrs = ["10.0.11.0/24", "10.0.12.0/24"]

# SSH access — 0.0.0.0/0 for initial setup; tighten before real traffic.
ssh_allowed_cidrs = ["0.0.0.0/0"]

# Compute
ec2_instance_type  = "t3.micro"
ec2_count          = 2
ec2_root_volume_gb = 20
app_port           = 3000

# Database
rds_engine_version    = "16.4"
rds_instance_class    = "db.t3.micro"
rds_allocated_storage = 20
rds_db_name           = "vsolutions"
rds_username          = "vsolutions_admin"
rds_multi_az          = false

# Cache
redis_node_type      = "cache.t3.micro"
redis_engine_version = "7.1"

extra_tags = {
  CostCenter = "vsolutions-prod"
}
