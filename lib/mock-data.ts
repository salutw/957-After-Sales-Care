// 模擬數據服務 - 用於內部測試

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  status: 'active' | 'pending' | 'inactive';
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  product: string;
  quantity: number;
  amount: number;
  status: 'linked' | 'pending' | 'cancelled';
  platform: '蝦皮' | 'Momo' | 'PChome' | '官方網站';
  orderNumber: string;
}

export interface HealthRecord {
  id: string;
  userId: string;
  date: string;
  type: 'daily' | 'weekly' | 'initial' | 'advisory';
  status: 'stable' | 'concern' | 'improving' | 'completed';
  sleep?: string;
  energy?: string;
  digestion?: string;
  discomfort?: string;
  notes?: string;
}

export interface AdvisorCase {
  id: string;
  userId: string;
  date: string;
  type: 'discomfort' | 'medication' | 'disease' | 'report' | 'other';
  subject: string;
  description: string;
  priority: 'low' | 'normal' | 'high';
  status: 'pending' | 'processing' | 'completed' | 'closed';
  advisorId?: string;
  advisorName?: string;
}

// 模擬用戶數據
export const mockUsers: User[] = [
  {
    id: 'USER-001',
    name: '測試會員',
    phone: '0912-345-678',
    email: 'test@example.com',
    birthDate: '1990-01-01',
    gender: 'female',
    address: '台北市信義區',
    status: 'active',
    createdAt: '2024-08-15',
  },
  {
    id: 'USER-002',
    name: '王大明',
    phone: '0923-456-789',
    email: 'wang@example.com',
    status: 'active',
    createdAt: '2024-08-18',
  },
  {
    id: 'USER-003',
    name: '李小美',
    phone: '0934-567-890',
    status: 'pending',
    createdAt: '2024-08-20',
  },
];

// 模擬訂單數據
export const mockOrders: Order[] = [
  {
    id: 'SF957-2408150930',
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
    id: 'SF957-2408201415',
    userId: 'USER-001',
    date: '2024-08-20',
    product: '957 牛樟芝精華膠囊',
    quantity: 1,
    amount: 1490,
    status: 'pending',
    platform: '官方網站',
    orderNumber: 'WEB20240820001',
  },
  {
    id: 'SF957-2408181030',
    userId: 'USER-002',
    date: '2024-08-18',
    product: '957 牛樟芝精華膠囊',
    quantity: 3,
    amount: 4470,
    status: 'linked',
    platform: 'Momo',
    orderNumber: 'MM20240818001',
  },
];

// 模擬健康記錄數據
export const mockHealthRecords: HealthRecord[] = [
  {
    id: 'HEALTH-001',
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
    id: 'HEALTH-002',
    userId: 'USER-001',
    date: '2024-08-19',
    type: 'daily',
    status: 'stable',
    sleep: 'excellent',
    energy: 'good',
    digestion: 'good',
    notes: '按時服用，無不適',
  },
  {
    id: 'HEALTH-003',
    userId: 'USER-001',
    date: '2024-08-18',
    type: 'initial',
    status: 'completed',
    notes: '建立基礎健康檔案',
  },
];

// 模擬顧問案件數據
export const mockAdvisorCases: AdvisorCase[] = [
  {
    id: 'CASE-2024-001',
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
  {
    id: 'CASE-2024-002',
    userId: 'USER-002',
    date: '2024-08-18',
    type: 'medication',
    subject: '詢問與其他藥物的相互作用',
    description: '目前正在服用降血壓藥物，想了解是否可以同時服用牛樟芝',
    priority: 'normal',
    status: 'pending',
  },
];

// 模擬 API 服務
export const mockApiService = {
  // 用戶相關
  getUser: async (userId: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUsers.find(user => user.id === userId) || null;
  },

  getUsers: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUsers;
  },

  createUser: async (userData: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = {
      id: `USER-${Date.now()}`,
      name: userData.name || '',
      phone: userData.phone || '',
      email: userData.email,
      birthDate: userData.birthDate,
      gender: userData.gender,
      address: userData.address,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    mockUsers.push(newUser);
    return newUser;
  },

  updateUser: async (userId: string, userData: Partial<User>): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = mockUsers.findIndex(user => user.id === userId);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...userData };
      return mockUsers[index];
    }
    return null;
  },

  // 訂單相關
  getOrders: async (userId?: string): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 從 localStorage 載入訂單資料
    let orders = [...mockOrders];
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          orders = JSON.parse(savedOrders);
        }
      }
    } catch (error) {
      console.error('Failed to load orders from localStorage:', error);
    }
    
    if (userId) {
      return orders.filter(order => order.userId === userId);
    }
    return orders;
  },

  createOrder: async (orderData: Partial<Order>): Promise<Order> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 從 localStorage 載入現有訂單
    let orders = [...mockOrders];
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          orders = JSON.parse(savedOrders);
        }
      }
    } catch (error) {
      console.error('Failed to load orders from localStorage:', error);
    }
    
    // 生成系統序號：SF957-YYMMDDHHMM
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // 取年份後兩位
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份，補零
    const day = String(now.getDate()).padStart(2, '0'); // 日期，補零
    const hours = String(now.getHours()).padStart(2, '0'); // 小時，補零
    const minutes = String(now.getMinutes()).padStart(2, '0'); // 分鐘，補零
    const systemSerial = `SF957-${year}${month}${day}${hours}${minutes}`;
    
    const newOrder: Order = {
      id: systemSerial,
      userId: orderData.userId || '',
      date: orderData.date || new Date().toISOString().split('T')[0],
      product: orderData.product || '957 牛樟芝精華膠囊',
      quantity: orderData.quantity || 1,
      amount: orderData.amount || 1490,
      status: orderData.status || 'pending',
      platform: orderData.platform || '官方網站',
      orderNumber: orderData.orderNumber || '',
    };
    
    orders.push(newOrder);
    
    // 保存到 localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('orders', JSON.stringify(orders));
      }
    } catch (error) {
      console.error('Failed to save orders to localStorage:', error);
    }
    
    return newOrder;
  },

  linkOrder: async (orderId: string, userId: string): Promise<Order | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // 從 localStorage 載入訂單
    let orders = [...mockOrders];
    if (typeof window !== 'undefined') {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        try {
          orders = JSON.parse(savedOrders);
        } catch (error) {
          console.error('Failed to parse saved orders:', error);
        }
      }
    }
    
    const index = orders.findIndex(order => order.id === orderId);
    if (index !== -1) {
      orders[index].userId = userId;
      orders[index].status = 'linked';
      
      // 保存到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('orders', JSON.stringify(orders));
      }
      
      return orders[index];
    }
    return null;
  },

  deleteOrder: async (orderId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // 從 localStorage 載入訂單
    let orders = [...mockOrders];
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
          orders = JSON.parse(savedOrders);
        }
      }
    } catch (error) {
      console.error('Failed to load orders from localStorage:', error);
    }
    
    const index = orders.findIndex(order => order.id === orderId);
    if (index !== -1) {
      orders.splice(index, 1);
      
      // 保存到 localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('orders', JSON.stringify(orders));
      }
      
      return true;
    }
    return false;
  },

  // 健康記錄相關
  getHealthRecords: async (userId: string): Promise<HealthRecord[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockHealthRecords.filter(record => record.userId === userId);
  },

  createHealthRecord: async (recordData: Partial<HealthRecord>): Promise<HealthRecord> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRecord: HealthRecord = {
      id: `HEALTH-${Date.now()}`,
      userId: recordData.userId || '',
      date: new Date().toISOString().split('T')[0],
      type: recordData.type || 'daily',
      status: recordData.status || 'stable',
      sleep: recordData.sleep,
      energy: recordData.energy,
      digestion: recordData.digestion,
      discomfort: recordData.discomfort,
      notes: recordData.notes,
    };
    mockHealthRecords.push(newRecord);
    return newRecord;
  },

  // 顧問案件相關
  getAdvisorCases: async (userId?: string): Promise<AdvisorCase[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // 從 localStorage 載入案件資料
    let cases = [...mockAdvisorCases];
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedCases = localStorage.getItem('advisorCases');
        if (savedCases) {
          cases = JSON.parse(savedCases);
        }
      }
    } catch (error) {
      console.error('Failed to load advisor cases from localStorage:', error);
    }
    
    if (userId) {
      return cases.filter(caseItem => caseItem.userId === userId);
    }
    return cases;
  },

  createAdvisorCase: async (caseData: Partial<AdvisorCase>): Promise<AdvisorCase> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 從 localStorage 載入現有案件
    let cases = [...mockAdvisorCases];
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedCases = localStorage.getItem('advisorCases');
        if (savedCases) {
          cases = JSON.parse(savedCases);
        }
      }
    } catch (error) {
      console.error('Failed to load advisor cases from localStorage:', error);
    }
    
    const newCase: AdvisorCase = {
      id: `CASE-${Date.now()}`,
      userId: caseData.userId || '',
      date: new Date().toISOString().split('T')[0],
      type: caseData.type || 'other',
      subject: caseData.subject || '',
      description: caseData.description || '',
      priority: caseData.priority || 'normal',
      status: 'pending',
    };
    
    cases.push(newCase);
    
    // 保存到 localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('advisorCases', JSON.stringify(cases));
      }
    } catch (error) {
      console.error('Failed to save advisor cases to localStorage:', error);
    }
    
    return newCase;
  },

  updateAdvisorCase: async (caseId: string, caseData: Partial<AdvisorCase>): Promise<AdvisorCase | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // 從 localStorage 載入案件
    let cases = [...mockAdvisorCases];
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedCases = localStorage.getItem('advisorCases');
        if (savedCases) {
          cases = JSON.parse(savedCases);
        }
      }
    } catch (error) {
      console.error('Failed to load advisor cases from localStorage:', error);
    }
    
    const index = cases.findIndex(caseItem => caseItem.id === caseId);
    if (index !== -1) {
      cases[index] = { ...cases[index], ...caseData };
      
      // 保存到 localStorage
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('advisorCases', JSON.stringify(cases));
        }
      } catch (error) {
        console.error('Failed to save advisor cases to localStorage:', error);
      }
      
      return cases[index];
    }
    return null;
  },
};

// 認證相關模擬
export const mockAuthService = {
  login: async (phone: string, code: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 測試模式：任意6位數字都通過
    if (code.length === 6) {
      const user = mockUsers.find(u => u.phone === phone);
      if (user) {
        return { success: true, user };
      } else {
        // 如果找不到用戶，創建一個新的
        const newUser = await mockApiService.createUser({
          phone,
          name: '新用戶',
        });
        return { success: true, user: newUser };
      }
    }
    
    return { success: false, error: '驗證碼錯誤' };
  },

  sendVerificationCode: async (phone: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (!validatePhone(phone)) {
      return { success: false, error: '手機號碼格式不正確' };
    }
    
    return { success: true };
  },

  register: async (userData: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const existingUser = mockUsers.find(u => u.phone === userData.phone);
    if (existingUser) {
      return { success: false, error: '此手機號碼已經註冊' };
    }
    
    const newUser = await mockApiService.createUser(userData);
    return { success: true, user: newUser };
  },
};

// 輔助函數
function validatePhone(phone: string): boolean {
  const phoneRegex = /^09\d{2}-?\d{3}-?\d{3}$/;
  return phoneRegex.test(phone.replace(/-/g, ''));
}