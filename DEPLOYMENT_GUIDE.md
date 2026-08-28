# 內部測試環境部署指南

## 📋 前置要求

- Node.js >= 22.13.0
- npm 或 yarn
- Git

## 🚀 本地開發環境設置

### 1. 克隆項目

```bash
git clone <repository-url>
cd AI顧問
```

### 2. 安裝依賴

```bash
npm install
```

### 3. 配置環境變數

複製配置範例文件：

```bash
cp config.example.ts config.ts
```

根據需要修改 `config.ts` 中的配置。

### 4. 啟動開發服務器

```bash
npm run dev
```

應用將在 http://localhost:3000 啟動。

## 🌐 內部測試部署

### 方案一: Vercel 部署 (推薦)

#### 1. 準備 Vercel 帳號

1. 訪問 https://vercel.com 並註冊帳號
2. 連接你的 GitHub 帳號

#### 2. 部署到 Vercel

```bash
# 安裝 Vercel CLI
npm install -g vercel

# 登入 Vercel
vercel login

# 部署
vercel
```

按照提示進行配置：
- **Project Name**: 957-after-sales-care-test
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

#### 3. 設置環境變數

在 Vercel 專案設置中添加以下環境變數：

```
NEXT_PUBLIC_TEST_MODE=true
NEXT_PUBLIC_MOCK_API=true
NODE_ENV=production
```

#### 4. 自動部署

每次推送到 GitHub 時，Vercel 會自動重新部署。

### 方案二: Cloudflare Workers 部署

#### 1. 準備 Cloudflare 帳號

1. 訪問 https://dash.cloudflare.com 並註冊帳號
2. 獲取 Account ID 和 API Token

#### 2. 安裝 Wrangler CLI

```bash
npm install -g wrangler
```

#### 3. 配置 Wrangler

登入 Cloudflare：

```bash
wrangler login
```

#### 4. 部署

```bash
npm run build
wrangler pages deploy .next
```

### 方案三: Docker 部署

#### 1. 創建 Dockerfile

```dockerfile
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### 2. 構建和運行

```bash
# 構建 Docker 鏡像
docker build -t 957-after-sales-care-test .

# 運行容器
docker run -p 3000:3000 957-after-sales-care-test
```

## 🔍 測試環境驗證

### 1. 功能檢查清單

- [ ] 應用成功啟動
- [ ] 登入功能正常
- [ ] 註冊功能正常
- [ ] 儀表板正確顯示
- [ ] 各個頁面導航正常
- [ ] 表單提交功能正常
- [ ] API 響應正常
- [ ] 響應式設計正常

### 2. 測試帳號驗證

使用測試帳號登入：
- 手機號碼: 0912-345-678
- 驗證碼: 123456

### 3. 性能檢查

- 頁面加載時間 < 3秒
- API 響應時間 < 500ms
- 無控制台錯誤
- 無網絡請求失敗

## 📊 監控和日誌

### Vercel 監控

- 訪問 Vercel 專案儀表板
- 查看 Functions 執行日誌
- 監控網站性能指標

### 本地開發監控

```bash
# 查看構建日誌
npm run build

# 查看運行時日誌
npm run dev
```

## 🔄 持續集成/持續部署 (CI/CD)

### GitHub Actions 配置

創建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '22'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 🛠️ 故障排除

### 常見問題

**1. 構建失敗**
```bash
# 清除緩存並重新安裝
rm -rf node_modules .next
npm install
npm run build
```

**2. 端口衝突**
```bash
# 使用不同端口
PORT=3001 npm run dev
```

**3. 環境變數問題**
```bash
# 檢查環境變數
echo $NEXT_PUBLIC_TEST_MODE
```

**4. 依賴問題**
```bash
# 清除 npm 緩存
npm cache clean --force
npm install
```

## 📞 支援

如遇到部署問題，請：

1. 檢查日誌文件
2. 查看錯誤訊息
3. 參考故障排除指南
4. 聯繫開發團隊

## 🔐 安全注意事項

1. **不要**將敏感信息提交到 Git
2. **不要**在測試環境使用生產數據
3. **定期**更新依賴包
4. **使用**環境變數管理配置
5. **啟用** HTTPS 在生產環境

---

**注意**: 此為內部測試環境部署指南，生產環境部署需要額外的安全性和性能配置。