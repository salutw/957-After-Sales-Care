// 測試數據和測試賬號配置

export const TEST_ACCOUNTS = {
  ADMIN: {
    phone: '0912-345-678',
    code: '123456',
    name: '測試管理員',
    role: 'admin',
  },
  REGULAR_USER: {
    phone: '0923-456-789',
    code: '123456',
    name: '測試用戶',
    role: 'user',
  },
  NEW_USER: {
    phone: '0934-567-890',
    code: '123456',
    name: '新用戶',
    role: 'user',
  },
};

export const TEST_DATA = {
  ORDERS: [
    {
      id: 'TEST-ORD-001',
      userId: 'USER-001',
      date: '2024-08-15',
      product: '957 牛樟芝精華膠囊',
      quantity: 2,
      amount: 2980,
      status: 'linked',
      platform: '蝦皮',
      orderNumber: 'SH20240815001',
    },
    {
      id: 'TEST-ORD-002',
      userId: 'USER-001',
      date: '2024-08-20',
      product: '957 牛樟芝精華膠囊',
      quantity: 1,
      amount: 1490,
      status: 'pending',
      platform: '官方網站',
      orderNumber: 'WEB20240820001',
    },
  ],
  
  HEALTH_RECORDS: [
    {
      id: 'TEST-HEALTH-001',
      userId: 'USER-001',
      date: '2024-08-20',
      type: 'daily',
      status: 'stable',
      sleep: 'good',
      energy: 'good',
      digestion: 'excellent',
      notes: '睡眠品質良好，精神狀態佳',
    },
    {
      id: 'TEST-HEALTH-002',
      userId: 'USER-001',
      date: '2024-08-19',
      type: 'daily',
      status: 'stable',
      sleep: 'excellent',
      energy: 'good',
      digestion: 'good',
      notes: '按時服用，無不適',
    },
  ],

  ADVISOR_CASES: [
    {
      id: 'TEST-CASE-001',
      userId: 'USER-001',
      date: '2024-08-20',
      type: 'discomfort',
      subject: '服用後出現輕微胃部不適',
      description: '開始服用後第3天感到輕微胃部不適，想詢問是否正常',
      priority: 'high',
      status: 'processing',
      advisorId: 'ADV-001',
      advisorName: '陳顧問',
    },
  ],
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SEND_CODE: '/api/auth/send-code',
    REGISTER: '/api/auth/register',
  },
  USERS: {
    LIST: '/api/users',
    DETAIL: (id: string) => `/api/users/${id}`,
  },
  ORDERS: {
    LIST: '/api/orders',
    LINK: (id: string) => `/api/orders/${id}/link`,
  },
  HEALTH: {
    LIST: '/api/health',
    CREATE: '/api/health',
  },
  ADVISOR: {
    LIST: '/api/advisor',
    DETAIL: (id: string) => `/api/advisor/${id}`,
  },
};

export const TEST_SCENARIOS = {
  USER_ONBOARDING: {
    name: '用戶啟用流程測試',
    steps: [
      '訪問 /auth/login 進行登入',
      '輸入測試手機號碼 0912-345-678',
      '輸入驗證碼 123456',
      '完成四個啟用步驟',
      '驗證儀表板功能正常',
    ],
  },

  ORDER_MANAGEMENT: {
    name: '訂單管理測試',
    steps: [
      '登入系統',
      '訪問 /orders 頁面',
      '測試訂單歸戶功能',
      '驗證訂單狀態更新',
    ],
  },

  HEALTH_TRACKING: {
    name: '健康追蹤測試',
    steps: [
      '登入系統',
      '訪問 /health 頁面',
      '提交健康回報',
      '驗證記錄正確保存',
    ],
  },

  ADVISOR_SERVICE: {
    name: '顧問服務測試',
    steps: [
      '登入系統',
      '訪問 /advisor 頁面',
      '創建諮詢案件',
      '驗證案件提交成功',
    ],
  },

  ADMIN_PANEL: {
    name: '管理後台測試',
    steps: [
      '使用管理員帳號登入',
      '訪問 /admin 頁面',
      '測試各個管理功能',
      '驗證數據統計正確',
    ],
  },
};

export const getTestAccount = (role: 'admin' | 'user' | 'new') => {
  switch (role) {
    case 'admin':
      return TEST_ACCOUNTS.ADMIN;
    case 'user':
      return TEST_ACCOUNTS.REGULAR_USER;
    case 'new':
      return TEST_ACCOUNTS.NEW_USER;
    default:
      return TEST_ACCOUNTS.REGULAR_USER;
  }
};

export const resetTestData = () => {
  // 重置測試數據的函數
  console.log('測試數據已重置');
  // 在實際應用中，這裡會重置數據庫或模擬數據
};