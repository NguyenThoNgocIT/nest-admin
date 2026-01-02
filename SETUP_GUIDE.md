# 🚀 HƯỚNG DẪN SETUP VÀ CHẠY DỰ ÁN NEST-ADMIN

## 📋 Yêu cầu hệ thống

| Phần mềm | Phiên bản yêu cầu | Trạng thái |
|----------|-------------------|------------|
| **Node.js** | >= 20.0.0 | ✅ Đã cài |
| **pnpm** | >= 9.0.0 | ✅ Đã cài (v9.1.0) |
| **Docker Desktop** | >= 20.x | ❌ Chưa chạy |
| **MySQL** | >= 8.x | ❌ Chưa chạy (Port 13307) |
| **Redis** | Latest | ❌ Chưa chạy (Port 6379) |

---

## 🔧 PHƯƠNG PHÁP 1: SETUP BẰNG DOCKER (Khuyến nghị ⭐)

### Bước 1: Khởi động Docker Desktop
```powershell
# Mở Docker Desktop hoặc chạy từ terminal
start "Docker Desktop"
```

### Bước 2: Khởi động MySQL và Redis
```powershell
cd "D:\New folder\nest-admin"

# Khởi động chỉ MySQL và Redis (không build app)
docker compose --env-file .env --env-file .env.development up -d mysql redis
```

### Bước 3: Kiểm tra services đã chạy
```powershell
docker ps
```
Kết quả mong đợi:
```
CONTAINER ID   IMAGE          PORTS                    NAMES
xxxxx          mysql:latest   0.0.0.0:13307->3306/tcp  nest-admin-mysql
xxxxx          redis:alpine   0.0.0.0:6379->6379/tcp   nest-admin-redis
```

### Bước 4: Chạy migrations (Tạo database schema)
```powershell
pnpm build
pnpm migration:run
```

### Bước 5: Khởi động app
```powershell
pnpm dev
```

### Bước 6: Truy cập ứng dụng
- **API Docs**: http://localhost:7001/api-docs/
- **API Base**: http://localhost:7001/api/

---

## 🔧 PHƯƠNG PHÁP 2: SETUP LOCAL (Không dùng Docker)

### Bước 1: Cài đặt MySQL
1. Download MySQL 8.x từ https://dev.mysql.com/downloads/installer/
2. Cài đặt và thiết lập:
   - Port: 13307
   - Username: root
   - Password: root
   - Database: nest_admin

### Bước 2: Cài đặt Redis
1. **Windows**: Sử dụng WSL hoặc Redis for Windows
   ```powershell
   # Option A: Sử dụng Chocolatey
   choco install redis-64

   # Option B: Download từ https://github.com/microsoftarchive/redis/releases
   ```

2. **Cấu hình Redis**:
   - Port: 6379
   - Password: 123456

### Bước 3: Import database
```powershell
# Sử dụng MySQL Workbench hoặc command line
mysql -h 127.0.0.1 -P 13307 -u root -p nest_admin < "D:\New folder\nest-admin\deploy\sql\nest_admin.sql"
```

### Bước 4: Chạy app
```powershell
pnpm dev
```

---

## 🐛 TROUBLESHOOTING - XỬ LÝ LỖI

### ❌ Lỗi: "Cannot connect to MySQL"
**Nguyên nhân**: MySQL chưa chạy hoặc sai port

**Giải pháp**:
```powershell
# Kiểm tra MySQL đang chạy
Test-NetConnection -ComputerName 127.0.0.1 -Port 13307

# Nếu False, khởi động MySQL
docker compose --env-file .env --env-file .env.development up -d mysql
```

### ❌ Lỗi: "Redis connection failed"
**Nguyên nhân**: Redis chưa chạy

**Giải pháp**:
```powershell
# Kiểm tra Redis
Test-NetConnection -ComputerName 127.0.0.1 -Port 6379

# Nếu False, khởi động Redis
docker compose --env-file .env --env-file .env.development up -d redis
```

### ❌ Lỗi: "Docker is not running"
**Giải pháp**:
```powershell
# Mở Docker Desktop
start "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Đợi 30 giây để Docker khởi động, sau đó chạy lại
```

### ❌ Lỗi: "Port already in use"
**Giải pháp**:
```powershell
# Kiểm tra process đang dùng port
Get-NetTCPConnection -LocalPort 7001 | Select-Object OwningProcess
Get-NetTCPConnection -LocalPort 13307 | Select-Object OwningProcess
Get-NetTCPConnection -LocalPort 6379 | Select-Object OwningProcess

# Kill process (thay <PID> bằng số Process ID)
Stop-Process -Id <PID> -Force
```

### ❌ Lỗi: "Migration failed"
**Giải pháp**:
```powershell
# 1. Build lại project
pnpm build

# 2. Drop database và tạo lại
# Sử dụng MySQL Workbench hoặc:
mysql -h 127.0.0.1 -P 13307 -u root -proot -e "DROP DATABASE IF EXISTS nest_admin; CREATE DATABASE nest_admin;"

# 3. Chạy migration
pnpm migration:run
```

---

## 📊 KIẾN TRÚC HỆ THỐNG

### Flow khởi động ứng dụng
```
┌─────────────────────────────────────────────────────────────┐
│ 1. Load Environment Variables (.env + .env.development)     │
└───────────────────┬─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Bootstrap NestJS Application                             │
│    - Create FastifyAdapter                                   │
│    - Initialize AppModule                                    │
└───────────────────┬─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Connect to Databases                                      │
│    - MySQL (TypeORM): Port 13307                            │
│    - Redis: Port 6379                                        │
│    - Prisma Client (PostgreSQL): For advanced queries       │
└───────────────────┬─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Initialize Modules                                        │
│    - AuthModule (JWT, Passport strategies)                  │
│    - SystemModule (Users, Roles, Menus)                     │
│    - ShopifyModule (with Bull Queue)                        │
│    - TiktokModule, WooCommerceModule, PrintifyModule        │
│    - RedisModule (Cache, Pub/Sub)                           │
│    - SocketModule (WebSocket with Redis adapter)            │
└───────────────────┬─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Setup Middleware & Guards                                │
│    - CORS enabled                                            │
│    - Helmet security                                         │
│    - ValidationPipe                                          │
│    - JwtAuthGuard, RbacGuard, ThrottlerGuard                │
│    - TransformInterceptor, TimeoutInterceptor                │
└───────────────────┬─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Setup Swagger Documentation                               │
│    - Path: /api-docs                                         │
│    - JWT Bearer authentication                               │
└───────────────────┬─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Start Fastify Server                                      │
│    - Listen on 0.0.0.0:7001                                 │
│    - PM2 cluster mode (production)                          │
└───────────────────┬─────────────────────────────────────────┘
                    ↓
                  READY ✅
```

### Database Schema (TypeORM)
```
sys_user ─────┐
              ├─── sys_user_roles ─── sys_role ─── sys_role_menu ─── sys_menu
              │
sys_dept ─────┘

sys_dict, sys_config, sys_log_login, sys_log_task
sys_online, sys_captcha_log, sys_task
sys_access_token, sys_refresh_token
```

### Redis Keys Pattern
```
SETTING_*           # System settings cache
USER_TOKEN_*        # JWT tokens
CAPTCHA_*           # Captcha codes
ONLINE_USER_*       # Online users
LOCK_*              # Distributed locks
QUEUE:*             # Bull queue jobs
```

### Bull Queues
```
shopify-product     # Shopify product sync jobs
email               # Email sending jobs
http-request        # HTTP request jobs
log-cleanup         # Log cleanup jobs
```

---

## 🎯 CÁC LỆNH QUAN TRỌNG

### Development
```powershell
pnpm dev                    # Chạy dev mode với hot-reload
pnpm dev:debug             # Chạy với debugger
pnpm repl                  # REPL mode để test
```

### Build & Production
```powershell
pnpm build                 # Build production
pnpm start:prod           # Chạy production (Node.js)
pnpm prod                 # Chạy với PM2 cluster
pnpm prod:pm2             # Restart PM2
pnpm prod:stop            # Dừng PM2
```

### Database
```powershell
pnpm migration:run        # Chạy migrations
pnpm migration:revert     # Rollback migration
pnpm migration:generate   # Tạo migration mới
pnpm typeorm              # TypeORM CLI
```

### Docker
```powershell
pnpm docker:build         # Build Docker image
pnpm docker:up            # Start containers
pnpm docker:down          # Stop containers
pnpm docker:logs          # Xem logs
pnpm docker:rmi           # Remove image
```

### Testing & Code Quality
```powershell
pnpm test                 # Run tests
pnpm test:watch          # Watch mode
pnpm lint                # ESLint check
pnpm lint:fix            # Auto fix
pnpm doc                 # Generate docs
```

---

## 🔐 THÔNG TIN ĐĂNG NHẬP MẶC ĐỊNH

### Admin Account
```
Username: admin
Password: a123456
```

### Database Credentials
```
MySQL:
  Host: 127.0.0.1
  Port: 13307
  Database: nest_admin
  Username: root
  Password: root

Redis:
  Host: 127.0.0.1
  Port: 6379
  Password: 123456
  DB: 0
```

---

## 📁 CẤU TRÚC FILE QUAN TRỌNG

```
nest-admin/
├── .env                          # ⭐ Biến môi trường chung
├── .env.development              # ⭐ Biến môi trường dev
├── .env.production               # ⭐ Biến môi trường production
├── docker-compose.yml            # ⭐ Docker setup
├── ecosystem.config.js           # ⭐ PM2 config
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── nest-cli.json                 # NestJS config
│
├── prisma/
│   └── schema.prisma             # ⭐ Prisma schema (PostgreSQL)
│
├── deploy/
│   └── sql/
│       └── nest_admin.sql        # ⭐ Database seed data
│
├── src/
│   ├── main.ts                   # ⭐ Entry point
│   ├── app.module.ts             # ⭐ Root module
│   ├── setup-swagger.ts          # Swagger setup
│   │
│   ├── config/                   # ⭐ Configuration
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── security.config.ts
│   │   └── swagger.config.ts
│   │
│   ├── modules/                  # Feature modules
│   │   ├── auth/                 # Authentication
│   │   ├── system/               # System management
│   │   ├── shopify/              # Shopify integration
│   │   ├── tiktok/               # TikTok Shop
│   │   ├── woocommerce/          # WooCommerce
│   │   └── printify/             # Printify
│   │
│   ├── shared/                   # Shared modules
│   │   ├── database/             # TypeORM config
│   │   ├── redis/                # Redis config
│   │   └── logger/               # Winston logger
│   │
│   ├── common/                   # Common utilities
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   │
│   └── migrations/               # ⭐ Database migrations
│       └── 1707996695540-initData.ts
│
└── docs/                         # Documentation
    ├── queue-simple-guide.md
    └── redis/
```

---

## 🎓 KIẾN THỨC CẦN BIẾT

### 1. NestJS Architecture
- **Modules**: Đóng gói features
- **Controllers**: Handle HTTP requests
- **Services**: Business logic
- **Guards**: Authentication/Authorization
- **Interceptors**: Request/Response transformation
- **Pipes**: Validation & transformation

### 2. TypeORM vs Prisma
- **TypeORM**: Dùng cho MySQL, migrations, complex queries
- **Prisma**: Dùng cho PostgreSQL, type-safe queries

### 3. Redis Usage
- **Cache**: System settings, user sessions
- **Queue**: Background jobs (Bull)
- **Pub/Sub**: Real-time events
- **Locks**: Distributed locking

### 4. Fastify vs Express
- Fastify nhanh hơn ~2x
- Built-in schema validation
- Better async support

### 5. PM2 Cluster Mode
- Tự động scale theo CPU cores
- Zero-downtime reload
- Process monitoring

---

## 🔗 LINKS QUAN TRỌNG

- **NestJS Docs**: https://docs.nestjs.com
- **TypeORM Docs**: https://typeorm.io
- **Prisma Docs**: https://www.prisma.io/docs
- **Bull Docs**: https://docs.bullmq.io
- **Fastify Docs**: https://www.fastify.io
- **Shopify API**: https://shopify.dev/api
- **TikTok Shop API**: https://partner.tiktokshop.com/doc

---

## ✅ CHECKLIST TRƯỚC KHI CHẠY

- [ ] Docker Desktop đang chạy
- [ ] File `.env` tồn tại và đầy đủ
- [ ] MySQL container running (port 13307)
- [ ] Redis container running (port 6379)
- [ ] Dependencies đã cài: `pnpm install`
- [ ] Database đã migrate: `pnpm migration:run`
- [ ] Port 7001 chưa bị chiếm

---

## 🆘 HỖ TRỢ

Nếu gặp vấn đề, hãy:
1. Check logs: `docker compose logs -f`
2. Check app logs: `tail -f logs/*.log`
3. Check database: MySQL Workbench
4. Check Redis: Redis Commander hoặc `redis-cli`

---

**Good luck! 🚀**
