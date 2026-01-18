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

## Step 4: Setup Domain & SSL (Optional but Recommended)

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
