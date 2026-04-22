# Family Social Network App (FSNA)

家族关系管理、族谱记录与可视化、家族成员展示与成就记录平台。

[在线演示](http://localhost) · [API 文档](#api) · [项目进度](./FSNA-progress.md)

---

## 功能特性

- **族谱可视化**：基于力导向图的家族关系展示，点击节点查看成员详情
- **家族管理**：创建家族、浏览家族列表、管理成员
- **成员档案**：个人简介、成就记录、出生日期、辈分代数
- **关系网络**：支持父母/子女/配偶/兄弟姐妹等 9 种关系类型
- **用户认证**：JWT 安全认证，支持注册和登录

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Vite + Tailwind CSS |
| 族谱可视化 | react-force-graph-2d (D3.js) |
| 状态管理 | Zustand (持久化) |
| 后端 | Nest.js + TypeScript |
| ORM | TypeORM |
| 数据库 | PostgreSQL 16 |
| 认证 | JWT + Passport |
| 测试 | Jest + Vitest + Supertest |
| 容器化 | Docker + Docker Compose |

---

## 快速开始

### 环境要求

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16（通过 Docker Compose 自动启动）

### 1. 克隆并启动数据库

```bash
git clone https://github.com/ZhexuanWang/FamilySocialNetworksApp.git
cd FamilySocialNetworkApp

# 启动 PostgreSQL + Redis
docker compose up -d postgres redis
```

### 2. 后端

```bash
cd backend

# 安装依赖
npm install

# 复制环境变量（开发）
cp .env.example .env

# 启动开发服务器（热重载）
npm run start:dev

# API 运行在 http://localhost:3000/api
```

### 3. 前端

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 前端运行在 http://localhost:5173
# 代理 /api 请求到后端
```

### 4. 访问

- 前端：http://localhost:5173
- 后端 API：http://localhost:3000/api
- API 健康检查：http://localhost:3000/api/health

---

## Docker 部署（生产）

```bash
# 构建并启动所有服务
DB_PASSWORD=your_secure_password JWT_SECRET=your_secure_jwt_secret docker compose -f docker-compose.prod.yml up -d

# 查看日志
docker compose -f docker-compose.prod.yml logs -f

# 停止所有服务
docker compose -f docker-compose.prod.yml down
```

---

## 测试

```bash
# 后端单元测试
cd backend && npm test

# 后端 E2E 测试（需要数据库）
cd backend && npm run test:e2e

# 前端测试
cd frontend && npm run test

# 前端构建验证
cd frontend && npm run build
```

---

## API 端点

所有端点以 `/api` 为前缀。

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /auth/register | 注册用户 | 否 |
| POST | /auth/login | 用户登录 | 否 |
| GET | /families | 获取所有家族 | 否 |
| POST | /families | 创建家族 | 是 |
| GET | /families/:id | 获取家族详情 | 否 |
| PATCH | /families/:id | 更新家族 | 是 |
| DELETE | /families/:id | 删除家族 | 是 |
| GET | /members/family/:familyId | 获取家族成员 | 是 |
| POST | /members | 添加成员 | 是 |
| GET | /members/:id | 获取成员详情 | 是 |
| PATCH | /members/:id | 更新成员 | 是 |
| DELETE | /members/:id | 删除成员 | 是 |
| GET | /relationships/family/:familyId | 获取家族关系 | 是 |
| POST | /relationships | 添加关系 | 是 |
| DELETE | /relationships/:id | 删除关系 | 是 |
| GET | /achievements/member/:memberId | 获取成就列表 | 是 |
| POST | /achievements | 添加成就 | 是 |
| PATCH | /achievements/:id | 更新成就 | 是 |
| DELETE | /achievements/:id | 删除成就 | 是 |
| POST | /introductions | 创建/更新自我介绍 | 是 |
| GET | /introductions/member/:memberId | 获取自我介绍 | 是 |

---

## 项目结构

详见 [FSNA-progress.md](./FSNA-progress.md)

---

## 许可证

MIT
