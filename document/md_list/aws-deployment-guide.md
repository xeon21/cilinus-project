# AWS 수동 배포 가이드

## 1. Backend (NestJS) - EC2 배포

### EC2 인스턴스 설정
```bash
# EC2 인스턴스 생성 (Amazon Linux 2 또는 Ubuntu 20.04 추천)
# 보안 그룹: 포트 3000, 22 오픈

# EC2 접속 후 Node.js 설치
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# PM2 설치 (프로세스 관리)
sudo npm install -g pm2

# Git 설치
sudo yum install -y git
```

### 프로젝트 배포
```bash
# 프로젝트 클론
cd /home/ec2-user
git clone https://github.com/your-username/cilinus-project.git
cd cilinus-project/backend

# 의존성 설치
npm install

# 환경 변수 설정
nano .env
# 필요한 환경 변수 입력:
# DATABASE_HOST=your-rds-endpoint
# DATABASE_PORT=3306
# DATABASE_USER=admin
# DATABASE_PASSWORD=your-password
# DATABASE_NAME=cilinus
# JWT_SECRET=your-jwt-secret
# MONGO_URI=your-mongodb-uri

# 프로젝트 빌드
npm run build

# PM2로 실행
pm2 start dist/main.js --name cilinus-backend
pm2 save
pm2 startup
```

## 2. Frontend (Next.js) 배포 옵션

### 옵션 A: S3 정적 호스팅 (추천)
```bash
# 로컬에서 빌드
cd frontend
npm install
npm run build

# S3 버킷 생성 및 정적 웹사이트 호스팅 활성화
# CloudFront 배포 생성 (선택사항, 성능 개선)

# AWS CLI로 업로드
aws s3 sync out/ s3://your-bucket-name --delete
```

### 옵션 B: EC2 배포
```bash
# EC2 접속 후
cd /home/ec2-user/cilinus-project/frontend
npm install
npm run build

# PM2로 실행
pm2 start npm --name "cilinus-frontend" -- start
```

## 3. 데이터베이스 설정

### RDS MySQL
1. RDS 인스턴스 생성 (MySQL 8.0)
2. 보안 그룹에서 EC2 인스턴스 접근 허용
3. 데이터베이스 생성 및 스키마 실행
```bash
# EC2에서 MySQL 클라이언트 설치
sudo yum install -y mysql

# RDS 접속
mysql -h your-rds-endpoint -u admin -p

# 데이터베이스 생성
CREATE DATABASE cilinus;
USE cilinus;

# backend/src/database/table.sql 실행
```

### MongoDB (선택사항)
- DocumentDB 클러스터 생성 또는
- MongoDB Atlas 사용

## 4. 업데이트 방법
```bash
# EC2 접속
cd /home/ec2-user/cilinus-project

# 최신 코드 가져오기
git pull origin main

# Backend 업데이트
cd backend
npm install
npm run build
pm2 restart cilinus-backend

# Frontend 업데이트
cd ../frontend
npm install
npm run build
pm2 restart cilinus-frontend
# 또는 S3 재업로드
```

## 5. 모니터링
```bash
# PM2 프로세스 확인
pm2 list
pm2 logs
pm2 monit

# 로그 확인
tail -f /home/ec2-user/cilinus-project/backend/logs/app-*.log
```

## 6. 주의사항
- 프로덕션 환경변수 설정 필수
- 보안 그룹 규칙 최소화
- HTTPS 설정 권장 (ALB 또는 Nginx)
- 정기적인 백업 설정