#!/bin/bash
###############################################################################
# EC2 user-data — bootstrap Amazon Linux 2023 to run a Next.js app.
# Idempotent: safe to re-run via SSM on existing instances.
###############################################################################
set -euxo pipefail

# ---- Base packages ----
dnf -y update
dnf -y install jq tar gzip git nginx awscli amazon-cloudwatch-agent

# ---- Node.js 20 (NodeSource) ----
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
  dnf -y install nodejs
fi

# ---- Working directory ----
mkdir -p /opt/vsolutions/app
chown -R ec2-user:ec2-user /opt/vsolutions

# ---- Pull DB password from Secrets Manager ----
DB_PASSWORD=$(aws secretsmanager get-secret-value \
  --region ${region} \
  --secret-id ${db_secret_arn} \
  --query SecretString --output text | jq -r .password)

# URL-encode the password (random_password may contain # > = etc. that
# break the connection-string parser if embedded raw).
DB_PASSWORD_ENC=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$DB_PASSWORD")
DB_URL="postgresql://${db_username}:$${DB_PASSWORD_ENC}@${db_endpoint}:5432/${db_name}?sslmode=require"

# ---- Write env file consumed by the app ----
cat >/opt/vsolutions/.env <<ENV
NODE_ENV=production
PORT=${app_port}
DATABASE_URL="$${DB_URL}"
DIRECT_URL="$${DB_URL}"
REDIS_URL="redis://${redis_endpoint}:${redis_port}"
S3_UPLOADS_BUCKET=${uploads_bucket}
S3_ASSETS_BUCKET=${assets_bucket}
AWS_REGION=${region}
ENV
chown ec2-user:ec2-user /opt/vsolutions/.env
chmod 0600 /opt/vsolutions/.env

# ---- Placeholder Node server (replaced by real build via deploy-app.sh) ----
cat >/opt/vsolutions/app/server.js <<'JS'
const http = require('http');
const PORT = parseInt(process.env.PORT || '3000', 10);

const server = http.createServer((req, res) => {
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ok: true,
      service: 'vsolutions-placeholder',
      hostname: require('os').hostname(),
      uptime: process.uptime(),
      ts: new Date().toISOString(),
    }));
    return;
  }
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>V Solutions — placeholder</h1><p>Real Next.js build deploys via deploy-app.sh</p>');
});

server.listen(PORT, () => console.log('Placeholder listening on ' + PORT));
JS
chown -R ec2-user:ec2-user /opt/vsolutions/app

# ---- systemd service ----
cat >/etc/systemd/system/vsolutions.service <<'SVC'
[Unit]
Description=V Solutions Next.js App
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/vsolutions/app
EnvironmentFile=/opt/vsolutions/.env
ExecStart=/usr/bin/node /opt/vsolutions/app/server.js
Restart=always
RestartSec=10
MemoryMax=800M
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SVC

systemctl daemon-reload
systemctl enable --now vsolutions

# ---- CloudWatch agent: ship system + app logs ----
cat >/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json <<CFG
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/messages",
            "log_group_name": "${log_group}",
            "log_stream_name": "{instance_id}/system"
          },
          {
            "file_path": "/var/log/cloud-init-output.log",
            "log_group_name": "${log_group}",
            "log_stream_name": "{instance_id}/cloud-init"
          }
        ]
      }
    }
  }
}
CFG

/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
  -s || true

echo "user-data complete: $(date -u)" >>/var/log/vsolutions-bootstrap.log
