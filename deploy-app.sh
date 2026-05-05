#!/bin/bash
###############################################################################
# Deploy the Next.js app (standalone bundle) to both EC2 instances.
# Usage: ./deploy-app.sh
#
# Requirements:
#   - terraform/ directory with applied state
#   - terraform/<prefix>-ec2-key.pem present
#   - pnpm + node 20+ on this box
#   - aws cli configured with profile=vsolutions
###############################################################################
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
TF_DIR="$PROJECT_ROOT/terraform"
PROFILE="vsolutions"
REGION="us-east-1"
KEY_FILE="$TF_DIR/vsolutions-prod-ec2-key.pem"

# ---- Read Terraform outputs -------------------------------------------------
cd "$TF_DIR"
ASSETS_BUCKET=$(terraform output -raw s3_assets_bucket)
mapfile -t INSTANCE_IPS < <(terraform output -json ec2_public_ips | jq -r '.[]')
cd "$PROJECT_ROOT"

if [ ${#INSTANCE_IPS[@]} -eq 0 ]; then
  echo "✗ No EC2 instances in terraform output — aborting"
  exit 1
fi

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BUNDLE_NAME="app-build-$TIMESTAMP.tar.gz"
BUNDLE_PATH="/tmp/$BUNDLE_NAME"

echo "▶ Building Next.js (standalone)…"
pnpm --filter @vsi/db prisma:generate >/dev/null
pnpm --filter web build >/dev/null

echo "▶ Assembling deploy bundle…"
STAGING="/tmp/vsolutions-deploy-$TIMESTAMP"
rm -rf "$STAGING"
mkdir -p "$STAGING"

# Layout the standalone server + static + public for /opt/vsolutions/app/
cp -a apps/web/.next/standalone/. "$STAGING/"
mkdir -p "$STAGING/apps/web/.next"
cp -a apps/web/.next/static "$STAGING/apps/web/.next/static"
cp -a apps/web/public "$STAGING/apps/web/public"

# Include Prisma schema + migrations so we can run `prisma migrate deploy`
mkdir -p "$STAGING/packages/db/prisma"
cp -a packages/db/prisma/. "$STAGING/packages/db/prisma/"

tar -C "$STAGING" -czf "$BUNDLE_PATH" .
BUNDLE_SIZE=$(du -h "$BUNDLE_PATH" | cut -f1)
echo "  bundle: $BUNDLE_PATH ($BUNDLE_SIZE)"

echo "▶ Uploading to s3://$ASSETS_BUCKET/builds/$BUNDLE_NAME …"
aws s3 cp "$BUNDLE_PATH" "s3://$ASSETS_BUCKET/builds/$BUNDLE_NAME" \
  --profile "$PROFILE" --region "$REGION" --only-show-errors

# ---- Per-instance deploy ----------------------------------------------------
FIRST_IP="${INSTANCE_IPS[0]}"

for IP in "${INSTANCE_IPS[@]}"; do
  IS_FIRST="false"
  [ "$IP" = "$FIRST_IP" ] && IS_FIRST="true"

  echo ""
  echo "▶ Deploying to $IP (first=$IS_FIRST)…"

  ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null \
      -i "$KEY_FILE" "ec2-user@$IP" \
      ASSETS_BUCKET="$ASSETS_BUCKET" \
      BUNDLE_NAME="$BUNDLE_NAME" \
      REGION="$REGION" \
      IS_FIRST="$IS_FIRST" \
      bash -se <<'EOF'
set -euo pipefail
sudo mkdir -p /opt/vsolutions/app /opt/vsolutions/releases
sudo chown -R ec2-user:ec2-user /opt/vsolutions

# Pull artifact
aws s3 cp "s3://$ASSETS_BUCKET/builds/$BUNDLE_NAME" /tmp/build.tar.gz --region "$REGION"

# Stage new release
RELEASE_DIR="/opt/vsolutions/releases/$(date +%s)"
mkdir -p "$RELEASE_DIR"
tar -xzf /tmp/build.tar.gz -C "$RELEASE_DIR"
rm /tmp/build.tar.gz

# Run Prisma migrations on the first instance only
if [ "$IS_FIRST" = "true" ]; then
  echo "  - running prisma migrate deploy"
  set +e
  DATABASE_URL=$(grep '^DATABASE_URL=' /opt/vsolutions/.env | cut -d= -f2- | tr -d '"' || true)
  if [ -n "$DATABASE_URL" ]; then
    cd "$RELEASE_DIR/packages/db"
    DATABASE_URL="$DATABASE_URL" \
      "$RELEASE_DIR/node_modules/.bin/prisma" migrate deploy --schema prisma/schema.prisma || true
    cd -
  fi
  set -e
fi

# Atomic swap
sudo systemctl stop vsolutions || true
sudo rm -rf /opt/vsolutions/app
sudo ln -sfn "$RELEASE_DIR" /opt/vsolutions/app
sudo chown -R ec2-user:ec2-user /opt/vsolutions

# Update systemd unit to run the standalone server
sudo tee /etc/systemd/system/vsolutions.service >/dev/null <<'SVC'
[Unit]
Description=V Solutions Next.js App (standalone)
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/vsolutions/app/apps/web
EnvironmentFile=/opt/vsolutions/.env
ExecStart=/usr/bin/node /opt/vsolutions/app/apps/web/server.js
Restart=always
RestartSec=10
MemoryMax=900M
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SVC

sudo systemctl daemon-reload
sudo systemctl restart vsolutions
sleep 4
sudo systemctl is-active vsolutions

# Keep last 3 releases only
ls -1dt /opt/vsolutions/releases/* | tail -n +4 | xargs -r sudo rm -rf
EOF

  echo "✓ $IP deployed"
done

# Cleanup
rm -f "$BUNDLE_PATH"
rm -rf "$STAGING"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "✓ Deployed to ${#INSTANCE_IPS[@]} instance(s)"
echo "  Test: curl https://vsolutionsinc.com/api/health"
echo "═══════════════════════════════════════════════════════"
