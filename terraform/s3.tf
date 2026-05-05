# ============================================================
# S3 — uploads bucket (user content) + assets bucket (build artifacts)
# Private, versioned, encrypted with SSE-S3.
# ============================================================

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# Uploads bucket — application file uploads
resource "aws_s3_bucket" "uploads" {
  bucket        = "${local.name_prefix}-uploads-${random_id.bucket_suffix.hex}"
  force_destroy = true

  tags = {
    Name    = "${local.name_prefix}-uploads"
    Purpose = "user-uploads"
  }
}

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket                  = aws_s3_bucket.uploads.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Assets bucket — build artifacts staged for deploys
resource "aws_s3_bucket" "assets" {
  bucket        = "${local.name_prefix}-assets-${random_id.bucket_suffix.hex}"
  force_destroy = true

  tags = {
    Name    = "${local.name_prefix}-assets"
    Purpose = "build-artifacts"
  }
}

resource "aws_s3_bucket_public_access_block" "assets" {
  bucket                  = aws_s3_bucket.assets.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Lifecycle: keep last 5 build versions only on assets bucket
resource "aws_s3_bucket_lifecycle_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id

  rule {
    id     = "expire-old-builds"
    status = "Enabled"

    filter {
      prefix = "builds/"
    }

    noncurrent_version_expiration {
      noncurrent_days = 30
    }

    expiration {
      days = 60
    }
  }
}
