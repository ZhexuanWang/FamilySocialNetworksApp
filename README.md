# Family Social Network App (FSNA)

家族关系管理、族谱记录与拓展、家族成员展示与成就记录平台。

## 快速开始

### 环境要求

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16（也可通过 Docker Compose 启动）

### 1. 启动数据库

```bash
docker compose up -d postgres redis
```

### 2. 后端

```bash
cd backend

# 安装依赖
npm install

# 复制环境变量
cp .env.example .env

# 启动开发服务器
npm run start:dev
```

### 3. 前端

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 4. 访问

- 前端：http://localhost:5173
- 后端 API：http://localhost:3000/api
- API 健康检查：http://localhost:3000/api/health

## 项目架构

详见 [FSNA-progress.md](./FSNA-progress.md)

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React + TypeScript + Vite + Tailwind CSS |
| 后端 | Nest.js + TypeScript |
| ORM | TypeORM |
| 数据库 | PostgreSQL |
| 缓存 | Redis |
| 认证 | JWT + Passport |
| 测试 | Jest + Vitest |
| 容器化 | Docker + Docker Compose |
