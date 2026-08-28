// 環境配置範例
// 在實際部署時，請複製此文件並根據環境調整配置

export const config = {
  // 應用配置
  app: {
    name: '957 After-Sales Care',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },

  // 測試模式
  test: {
    enabled: process.env.NEXT_PUBLIC_TEST_MODE === 'true',
    mockApi: process.env.NEXT_PUBLIC_MOCK_API === 'true',
  },

  // 數據庫配置 (生產環境使用)
  database: {
    url: process.env.DATABASE_URL || '',
    // 在生產環境中配置真實的數據庫連接
  },

  // 認證配置 (生產環境使用)
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'test-secret-key',
    nextAuthSecret: process.env.NEXTAUTH_SECRET || 'test-nextauth-secret',
    nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },

  // 第三方服務 (生產環境使用)
  services: {
    line: {
      channelId: process.env.LINE_CHANNEL_ID || '',
      channelSecret: process.env.LINE_CHANNEL_SECRET || '',
      accessToken: process.env.LINE_ACCESS_TOKEN || '',
      webhookUrl: process.env.LINE_WEBHOOK_URL || '',
      enabled: process.env.LINE_ENABLED === 'true',
    },
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
      enabled: process.env.TWILIO_ENABLED === 'true',
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.OPENAI_MODEL || 'gpt-4',
      enabled: process.env.OPENAI_ENABLED === 'true',
    },
  },

  // Cloudflare 配置
  cloudflare: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
    apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
  },
};

// 驗證配置
export const validateConfig = () => {
  const errors: string[] = [];

  if (!config.test.enabled && !config.database.url) {
    errors.push('DATABASE_URL is required in production mode');
  }

  if (!config.test.enabled && !config.auth.jwtSecret) {
    errors.push('JWT_SECRET is required in production mode');
  }

  if (errors.length > 0) {
    console.error('Configuration errors:', errors);
    throw new Error('Invalid configuration');
  }

  return true;
};

export default config;