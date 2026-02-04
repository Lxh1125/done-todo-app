# Cloudflare Pages 部署指南

## 方案概述

使用 Cloudflare KV 作为数据持久化方案，通过 Cloudflare Functions 提供 API 服务。

## 部署步骤

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

### 3. 创建 KV 命名空间

```bash
# 创建生产环境 KV
wrangler kv:namespace create "TODO_KV"

# 创建开发环境 KV（可选）
wrangler kv:namespace create "TODO_KV" --env development
```

执行后会输出类似：
```
{ binding = "TODO_KV", id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" }
```

### 4. 更新 wrangler.toml

将上一步获取的 id 更新到 `wrangler.toml` 文件中：

```toml
[[env.production.kv_namespaces]]
binding = "TODO_KV"
id = "你的实际-kv-namespace-id"
```

### 5. 构建项目

```bash
npm run build
```

### 6. 部署到 Cloudflare Pages

#### 方式一：通过 Wrangler CLI 部署

```bash
# 部署到生产环境
wrangler pages deploy dist --project-name done-todo-app

# 或者部署时绑定 KV
wrangler pages deploy dist --project-name done-todo-app --binding TODO_KV=你的kv-id
```

#### 方式二：通过 GitHub 集成自动部署

1. 将代码推送到 GitHub 仓库
2. 登录 Cloudflare Dashboard
3. 进入 Pages > Create a project
4. 选择 GitHub 仓库
5. 配置构建设置：
   - Build command: `npm run build`
   - Build output directory: `dist`
6. 添加环境变量和 KV 绑定
7. 点击 Deploy

### 7. 配置 KV 绑定（Dashboard 方式）

如果使用 Dashboard 部署，需要手动绑定 KV：

1. 进入 Cloudflare Dashboard > Pages
2. 选择你的项目
3. 点击 Settings > Functions
4. 在 "KV namespace bindings" 中添加：
   - Variable name: `TODO_KV`
   - KV namespace: 选择你创建的命名空间

## 项目结构

```
ToDoList/
├── functions/           # Cloudflare Functions
│   └── api/
│       ├── tasks.js     # 任务 API (GET/POST/PUT/DELETE)
│       └── tasks/
│           └── batch.js # 批量更新 API
├── src/
│   ├── api.js          # 前端 API 服务
│   ├── App.jsx         # 主应用组件
│   └── ...
├── wrangler.toml       # Wrangler 配置
└── DEPLOY.md           # 本部署指南
```

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/tasks` | 获取所有任务 |
| POST | `/api/tasks` | 添加新任务 |
| PUT | `/api/tasks` | 更新任务 |
| DELETE | `/api/tasks` | 删除任务 |
| POST | `/api/tasks/batch` | 批量更新任务 |

## 数据备份

虽然使用 KV 存储，但代码仍然保留了 LocalStorage 作为备份：
- 如果 API 调用失败，数据会保存到 LocalStorage
- 下次加载时，如果 API 失败，会从 LocalStorage 恢复

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 使用 Wrangler 本地测试 Functions
wrangler pages dev dist --binding TODO_KV=你的kv-id
```

## 注意事项

1. **KV 延迟**：Cloudflare KV 是最终一致性的，写入后可能需要几秒钟才能在全球同步
2. **免费额度**：
   - 读取：每天 10 万次
   - 写入：每天 1 万次
   - 删除：每天 1 万次
3. **数据限制**：单个值最大 25MB，但建议保持较小以提高性能

## 故障排除

### API 返回 500 错误
- 检查 KV 命名空间是否正确绑定
- 查看 Functions 日志：`wrangler tail`

### 数据没有持久化
- 确认 KV 绑定名称是 `TODO_KV`
- 检查浏览器控制台是否有 API 错误

### CORS 错误
- API 已配置 CORS，如果还有问题检查域名是否匹配
