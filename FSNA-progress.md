# FSNA-progress.md

> Family Social Network App - 项目进度跟踪文件
> 每次 Version 结束时更新此文件，并随代码一同提交至 GitHub

---

## 项目概述

### 项目名称
Family Social Network App (FSNA)

### 项目定位
一款面向家族群体的社交与记录平台，帮助家族成员管理族谱、记录个人成长、拓展家族关系网络。

### 核心价值
- **族谱可视化**：清晰呈现家族血缘关系树
- **个人展示**：成员自我介绍与成就记录
- **关系拓展**：轻松扩展家族关系网络
- **家族凝聚力**：增强家族成员间的连接与认同感

### 目标用户
- 家族族长/管理者（创建和管理家族空间）
- 家族成员（记录自己、链接家族）
- 家族史研究者（追溯族谱）

---

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | React + TypeScript | 用户界面 |
| 前端 UI | Tailwind CSS / shadcn/ui | 组件库 |
| 前端图表 | D3.js / react-force-graph | 族谱树可视化 |
| 后端 | Nest.js + TypeScript | REST API |
| ORM | TypeORM | 数据库操作 |
| 数据库 | PostgreSQL | 主数据库 |
| 认证 | JWT + Passport | 用户认证 |
| 测试 | Jest | 单元/集成测试 |
| 容器化 | Docker + Docker Compose | 开发/部署环境 |
| 版本控制 | Git | 代码管理 |

---

## 项目结构

```
FamilySocialNetworkApp/
├── backend/                    # Nest.js 后端
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/           # 认证模块
│   │   │   ├── users/          # 用户模块
│   │   │   ├── families/       # 家族模块
│   │   │   ├── members/        # 家族成员模块
│   │   │   ├── relationships/  # 关系模块
│   │   │   ├── achievements/   # 成就模块
│   │   │   └── introductions/  # 自我介绍模块
│   │   ├── common/            # 公共模块（守卫、装饰器、过滤器）
│   │   ├── config/            # 配置文件
│   │   ├── database/          # 数据库初始化
│   │   └── main.ts
│   ├── test/                   # E2E 测试
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
│
├── frontend/                   # React 前端
│   ├── src/
│   │   ├── components/        # 通用组件
│   │   ├── pages/             # 页面
│   │   ├── hooks/             # 自定义 Hooks
│   │   ├── services/          # API 调用
│   │   ├── stores/            # 状态管理
│   │   ├── types/             # TypeScript 类型
│   │   ├── utils/             # 工具函数
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
│
├── docs/                       # 文档
├── .gitignore
├── README.md
├── docker-compose.yml         # 整体编排
└── FSNA-progress.md          # 本文件
```

---

## 数据库设计

### E-R 概览

```
User ──1:1── FamilyMember ──N:N── Relationship ──N:1── FamilyMember
     │                                    │
     │                                    └── relation_type: parent|child|spouse|sibling|...
     │
     └── belongs_to ──1:N── Family
```

### 表结构

#### users（用户表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| email | VARCHAR(255) | 唯一邮箱 |
| password_hash | VARCHAR(255) | 密码哈希 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

#### families（家族表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | VARCHAR(100) | 家族名称 |
| description | TEXT | 家族描述 |
| created_by | UUID | 创建者 FK→users |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

#### family_members（家族成员表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| family_id | UUID | 所属家族 FK→families |
| user_id | UUID | 关联用户 FK→users（可为 NULL，表示非注册成员） |
| name | VARCHAR(100) | 成员姓名 |
| generation | INTEGER | 辈分代数 |
| gender | ENUM | 性别 |
| birth_date | DATE | 出生日期 |
| avatar_url | VARCHAR(500) | 头像 URL |
| bio | TEXT | 简介 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

#### relationships（关系表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| family_id | UUID | 所属家族 FK→families |
| from_member_id | UUID | 成员A FK→family_members |
| to_member_id | UUID | 成员B FK→family_members |
| relation_type | ENUM | 关系类型 |
| created_at | TIMESTAMP | 创建时间 |

> relation_type 枚举值：parent, child, spouse, sibling, grandparent, grandchild, uncle_aunt, nephew_niece, other

#### achievements（成就表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| member_id | UUID | 成员 FK→family_members |
| title | VARCHAR(200) | 成就标题 |
| description | TEXT | 成就描述 |
| date | DATE | 发生日期 |
| category | VARCHAR(50) | 分类（学业/事业/荣誉等） |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

#### self_introductions（自我介绍表）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| member_id | UUID | 成员 FK→family_members |
| content | TEXT | 自我介绍内容 |
| tags | VARCHAR[] | 标签数组 |
| updated_at | TIMESTAMP | 更新时间 |

---

## 版本记录

### v0.01 — 项目初始化与基础设施
**状态**：进行中

#### Phase 1: 项目初始化
- [x] 创建 FSNA-progress.md（本文档）
- [x] 初始化 Git 仓库
- [x] 搭建 Monorepo 目录结构
- [x] 配置 Docker + Docker Compose（PostgreSQL + Redis）
- [x] 初始化 Nest.js 后端项目
- [x] 初始化 React 前端项目
- [x] 配置 GitHub 仓库并推送初始版本

#### Phase 2: 数据库与后端基础
- [x] 实现 TypeORM 实体定义（users/families/family_members/relationships/achievements/self_introductions）
- [x] 实现 Auth 模块（注册/登录/JWT 认证）
- [x] 实现 Families 模块（创建/查询/更新/删除家族）
- [x] 实现 Members 模块（家族成员 CRUD）
- [x] 编写 Jest 单元测试（3 个 service，19 个测试全部通过）

#### Phase 3: 核心功能（当前）
- [x] 实现 Relationships 模块（关系管理，含自关联校验）
- [x] 实现 Achievements 模块（成就 CRUD，按时间降序）
- [x] 实现 SelfIntroductions 模块（自我介绍 upsert 语义）
- [x] 编写 Jest 单元测试（6 个 service，33 个测试全部通过）

#### Phase 4: 前端基础
- [x] React Router 路由配置（ProtectedRoute / PublicRoute）
- [x] TypeScript 类型定义（entities 全覆盖）
- [x] API 服务层（axios + interceptors，自动挂载 JWT）
- [x] Zustand 认证状态管理（持久化到 localStorage）
- [x] 登录/注册页面（含表单验证）
- [x] 家族列表/创建/详情页面
- [x] 成员添加/详情页面
- [x] 个人中心页面
- [x] Vitest 测试配置 + 1 个占位测试
- [x] 前端构建验证通过（tsc + vite build，119 modules）

#### Phase 5: 族谱可视化（当前）
- [ ] 族谱树组件（基于 D3.js / react-force-graph）
- [ ] 成员节点交互（点击查看详情）
- [ ] 家族成员关系图展示

#### Phase 6: 完善与测试
- [ ] 前后端联调
- [ ] Jest + React Testing Library 测试
- [ ] 完善 README.md
- [ ] Docker 部署配置
- [ ] 提交 v0.01 最终版本至 GitHub

---

### v0.02 — 待规划

---

## 设计思路

### 架构设计
- **前后端分离**：RESTful API 通过 JSON 交互
- **模块化**：后端按功能模块划分（Nest.js），前端按页面/组件划分
- **可扩展**：族谱可视化层与核心数据层解耦，便于未来替换可视化方案

### 族谱数据模型设计
- 采用**邻接表模型**（通过 relationships 表）存储家族关系，而非嵌套模型
- 每个关系记录为一对节点 + 关系类型，支持多代家族
- generation 字段辅助确定树层级关系

### 权限设计
- 家族创建者默认为管理员
- 成员可编辑自己的个人信息和成就
- 关系管理需要家族管理员权限

### 前端状态管理
- 使用 React Context 或 Zustand 管理全局状态
- 用户认证状态独立管理
- 族谱数据按需加载，支持懒加载大型家族

---

## 项目约定

1. **版本号格式**：`v0.0x`（x 为数字）
2. **每次新版本开始前**：确保当前版本代码完善，先提交 FSNA-progress.md 更新，再推送 GitHub
3. **Phase 任务**：按计划写入 FSNA-progress.md，完成一个 Phase 再开始下一个
4. **提交规范**：采用语义化提交（feat/fix/docs/style/refactor/test/chore）
5. **分支策略**：主分支 `main`，开发分支 `develop`，功能分支 `feature/xxx`
6. **环境变量**：敏感信息（数据库密码、JWT Secret）通过 `.env` 文件管理，不提交至 Git

---

*最后更新：2026-04-22*
