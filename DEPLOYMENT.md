# AWS EC2 Deployment Guide

Deploy your portfolio to AWS EC2 with Docker - demonstrates real AWS infrastructure skills.

## Prerequisites

- AWS Account (Free Tier eligible)
- Domain name (optional but recommended)
- SSH key pair

---

## Step 1: Launch EC2 Instance

1. **Go to EC2 Dashboard** → Launch Instance

2. **Configure:**
   | Setting | Value |
   |---------|-------|
   | Name | `personal-website` |
   | AMI | Amazon Linux 2023 |
   | Instance Type | `t3.micro` (Free Tier) |
   | Key Pair | Create new or use existing |
   | Security Group | Allow SSH (22), HTTP (80), HTTPS (443) |
   | Storage | 20 GB gp3 (Free Tier) |

3. **Launch** and note your Public IP

---

## Step 2: Connect & Install Docker

```bash
# SSH into your instance
ssh -i your-key.pem ec2-user@<YOUR_EC2_IP>

# Update system
sudo dnf update -y

# Install Docker
sudo dnf install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Log out and back in for group changes
exit
```

---

## Step 3: Deploy Application

```bash
# SSH back in
ssh -i your-key.pem ec2-user@<YOUR_EC2_IP>

# Clone your repo
git clone https://github.com/YOUR_USERNAME/personal-website.git
cd personal-website

# Build and run
docker-compose up -d --build

# Check status
docker-compose ps
docker-compose logs -f web
```

Your site is now live at `http://<YOUR_EC2_IP>:3000`

---

## TLS / HTTPS — Actual Stack (Envoy + Certbot)

> This is what is **actually deployed** (`docker-compose.yml`). The Nginx / CloudFront
> options in Step 4 below are alternatives kept for reference and are **not** in use.

The stack terminates TLS in **Envoy** and renews the Let's Encrypt cert with a
**certbot** sidecar:

- `envoy` — TLS termination on :443, ACME challenge passthrough + HTTP→HTTPS redirect on :80.
  Reads the cert from `/etc/letsencrypt/live/shivangchheda.dev/{fullchain,privkey}.pem`.
- `acme-server` (nginx) — serves the `/.well-known/acme-challenge/` webroot.
- `certbot` — loops `certbot renew` every 12h.

### ⚠️ Critical: Envoy does not hot-reload certs

Envoy reads its TLS cert from the static `filename:` in `envoy.yaml` **once at startup**
and never re-reads the file. So renewing the cert on disk is **not enough** — Envoy keeps
serving the old in-memory cert until it is restarted. If this step is missing, the cert
silently expires every ~90 days and the site breaks in browsers (`NET::ERR_CERT_DATE_INVALID`)
even though the app is healthy.

**Fix in place:** the `certbot` service runs with `--deploy-hook "docker restart envoy"`.
The deploy-hook fires **only when a cert is actually renewed**, restarting Envoy so it loads
the fresh cert. This requires:

- a custom certbot image (`Dockerfile.certbot` = `certbot/certbot` + `docker-cli`),
- the host Docker socket mounted into the certbot container
  (`/var/run/docker.sock` — root-equivalent host access; acceptable on this single-tenant box),
- the envoy service pinned to `container_name: envoy`.

### Manual operations

```bash
# Check cert expiry as Envoy sees it
docker compose exec envoy openssl x509 -enddate -noout \
  -in /etc/letsencrypt/live/shivangchheda.dev/fullchain.pem

# Force a renewal now (then Envoy auto-restarts via the deploy-hook)
docker compose run --rm certbot renew --webroot -w /var/www/certbot --force-renewal
docker compose restart envoy   # only needed if you bypass the deploy-hook

# Verify externally
curl -sSI https://shivangchheda.dev | head -1   # expect HTTP/2 200
echo | openssl s_client -servername shivangchheda.dev \
  -connect shivangchheda.dev:443 2>/dev/null | openssl x509 -noout -dates

# Confirm the deploy-hook fired on a real renewal
docker compose logs certbot | grep -i "deploy-hook\|restart"
```

---

## Step 4: Setup Domain & SSL (Optional but Recommended)

> Reference only — superseded by the Envoy + Certbot stack documented above.

### Option A: Nginx Reverse Proxy + Let's Encrypt

```bash
# Install Nginx
sudo dnf install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Certbot
sudo dnf install certbot python3-certbot-nginx -y
```

Create Nginx config:

```bash
sudo nano /etc/nginx/conf.d/portfolio.conf
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option B: AWS Route 53 + CloudFront + ACM

For production-grade setup with AWS CDN:

1. Create hosted zone in Route 53
2. Request SSL certificate in ACM
3. Create CloudFront distribution pointing to EC2
4. Add A record in Route 53 pointing to CloudFront

---

## Step 5: Auto-Deployment (CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to EC2

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to EC2
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ec2-user
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/personal-website
            git pull origin main
            docker-compose up -d --build
            docker system prune -f
```

Add GitHub Secrets:

- `EC2_HOST`: Your EC2 public IP or domain
- `EC2_SSH_KEY`: Your private SSH key content

---

## Useful Commands

```bash
# View logs
docker-compose logs -f web

# Restart services
docker-compose restart

# Rebuild and deploy
docker-compose up -d --build

# Stop all services
docker-compose down

# Clean up unused images
docker system prune -a
```

---

## Cost Estimate (Free Tier)

| Resource      | Free Tier                | After Free Tier |
| ------------- | ------------------------ | --------------- |
| EC2 t3.micro  | 750 hrs/mo for 12 months | ~$8/mo          |
| EBS 20GB      | 30 GB/mo for 12 months   | ~$2/mo          |
| Data Transfer | 100 GB/mo                | ~$0.09/GB       |

**Total after free tier: ~$10-15/mo**

---

## Troubleshooting

### Container won't start

```bash
docker-compose logs web
docker-compose down && docker-compose up -d --build
```

### Port already in use

```bash
sudo lsof -i :3000
docker-compose down
```

### Out of disk space

```bash
docker system prune -a
df -h
```
