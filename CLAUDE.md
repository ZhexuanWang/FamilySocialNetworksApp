# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Family Social Network App (FSNA) — 家族关系管理、族谱记录与可视化、家族成员展示平台。

- **GitHub**: https://github.com/ZhexuanWang/FamilySocialNetworksApp.git
- **版本格式**: `v0.0x`，每个 version 分多个 Phase，详见 FSNA-progress.md
- **新 version 开始前**：确保当前版本完善，先更新 FSNA-progress.md，再与代码一同推送 GitHub

## 技术栈

- **前端**: React 18 + TypeScript + Vite + Tailwind CSS + react-force-graph-2d + Zustand
- **后端**: Nest.js + TypeScript + TypeORM
- **数据库**: PostgreSQL 16
- **认证**: JWT + Passport
- **测试**: Jest（后端单元测试）+ Vitest（前端测试）
- **容器化**: Docker + Docker Compose

## 常用命令

### 后端
```bash
cd backend
npm install                    # 安装依赖
npm run start:dev            # 开发模式（热重载）
npm run build                # 构建
npm run start:prod          # 生产模式
npm test                    # 运行所有 Jest 测试
npm run test:e2e            # 运行 E2E 测试
npm run lint                 # ESLint 检查
cp .env.example .env         # 复制环境变量（开发）
```

### 前端
```bash
cd frontend
npm install
npm run dev                  # 开发服务器 localhost:5173
npm run build               # 生产构建
npm run test                # Vitest 测试
npm run lint                # ESLint 检查
```

### 数据库
```bash
docker compose up -d postgres redis   # 启动 PostgreSQL + Redis
docker compose down -v                # 停止并清除数据
```

## 项目架构

### Monorepo 结构
```
FamilySocialNetworkApp/
├── backend/           # Nest.js REST API (端口 3000)
│   └── src/
│       ├── entities/  # TypeORM 实体（User, Family, FamilyMember, Relationship, Achievement, SelfIntroduction）
│       └── modules/   # 功能模块（auth, families, members, relationships, achievements, introductions）
├── frontend/         # React SPA (端口 5173，代理 /api 到 3000)
│   └── src/
│       ├── components/ # FamilyTree, RelationshipManager, Navbar, Layout
│       ├── pages/     # 8 个页面（登录/注册/家族列表/详情等）
│       ├── services/  # axios API 服务层
│       └── stores/    # Zustand 状态（authStore）
└── docker-compose.yml
```

### API 前缀
所有 API 端点以 `/api` 为前缀（如 `/api/auth/login`）

### 认证流程
- JWT Bearer Token，存储于 localStorage（key: `fsna_token`）
- 请求拦截器自动附加 `Authorization: Bearer <token>`
- 401 响应自动清除 token 并跳转登录页

### 族谱数据模型
- 邻接表模型：relationships 表存储成员对之间的关系（from/to/relation_type）
- 关系类型枚举：parent, child, spouse, sibling, grandparent, grandchild, uncle_aunt, nephew_niece, other
- generation 字段辅助确定代数层级

## 版本管理流程

1. 在 FSNA-progress.md 中按 Phase 记录进度
2. 每个 Phase 完成后：更新 checklist → git commit → git push
3. 一个 version 所有 Phase 完成后：更新 FSNA-progress.md → git tag v0.0x → git push --tags
4. 新 version 开始前：创建新分支或直接在 main 开发
