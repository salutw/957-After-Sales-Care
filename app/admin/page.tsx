'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockApiService } from '@/lib/mock-data';

export default function AdminPage() {
  const router = useRouter();
  
  // 檢查登入狀態
  useEffect(() => {
    const currentAdmin = localStorage.getItem('currentAdmin');
    if (!currentAdmin) {
      router.push('/admin/login');
      return;
    }
    
    // 載入當前登入管理員資訊
    try {
      const admin = JSON.parse(currentAdmin);
      setAdminInfo({
        id: admin.id,
        name: admin.name,
        department: admin.department,
        role: admin.role,
        permissions: admin.permissions,
      });
    } catch (error) {
      console.error('Failed to parse admin info:', error);
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('currentAdmin');
    router.push('/admin/login');
  };

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats] = useState({
    totalUsers: 156,
    activeUsers: 89,
    totalOrders: 234,
    pendingCases: 12,
    todayHealthReports: 23,
  });
  const [allOrders, setAllOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // 載入訂單資料
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoadingOrders(true);
      try {
        const orders = await mockApiService.getOrders();
        // 添加用戶名稱以便顯示
        const ordersWithUserNames = orders.map(order => ({
          ...order,
          userName: order.userId === 'USER-001' ? '王大明' : 
                     order.userId === 'USER-002' ? '李小美' : 
                     order.userId === 'USER-003' ? '張志明' : '未知用戶'
        }));
        setAllOrders(ordersWithUserNames);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setIsLoadingOrders(false);
      }
    };
    loadOrders();
  }, []);

  const [allHealthRecords] = useState([
    {
      id: 'HEALTH-001',
      userId: 'USER-001',
      userName: '王大明',
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
      userName: '王大明',
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
      userId: 'USER-002',
      userName: '李小美',
      date: '2024-08-18',
      type: 'initial',
      status: 'completed',
      notes: '建立基礎健康檔案',
    },
  ]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCaseDetailModal, setShowCaseDetailModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState('');
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editingUserData, setEditingUserData] = useState({});
  const [showHealthDetailModal, setShowHealthDetailModal] = useState(false);
  const [selectedHealthRecord, setSelectedHealthRecord] = useState(null);
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [editingOrderData, setEditingOrderData] = useState({});
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    suggestedTime: '',
    dosage: '',
    interval: '',
    dailyMax: '',
    storageLocation: '',
    storageTemperature: '',
    storageHumidity: '',
    warnings: '',
  });
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [importResults, setImportResults] = useState([]);
  const [adminInfo, setAdminInfo] = useState({
    id: '',
    name: '',
    department: '',
    role: 'admin',
    permissions: {
      dashboard: true,
      users: true,
      cases: true,
      advisors: true,
      orders: true,
      health: true,
      products: true,
      api: true,
      admins: true,
    },
  });
  const [adminAccounts, setAdminAccounts] = useState([]);
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  // 從 localStorage 載入管理員帳號
  useEffect(() => {
    const savedAdmins = localStorage.getItem('adminAccounts');
    if (savedAdmins) {
      try {
        setAdminAccounts(JSON.parse(savedAdmins));
      } catch (error) {
        console.error('Failed to parse admin accounts:', error);
      }
    } else {
      // 初始化預設管理員帳號
      const defaultAdmin = {
        id: 'ADMIN-001',
        name: '洪宗彬',
        department: '直播部',
        password: '123456',
        role: 'admin',
        permissions: {
          dashboard: true,
          users: true,
          cases: true,
          advisors: true,
          orders: true,
          health: true,
          products: true,
          api: true,
          admins: true,
        },
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      setAdminAccounts([defaultAdmin]);
      localStorage.setItem('adminAccounts', JSON.stringify([defaultAdmin]));
    }
  }, []);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminForm, setAdminForm] = useState({
    id: '',
    name: '',
    department: '',
    password: '',
    role: 'admin', // admin, advisor, assistant, customer_service
    permissions: {
      dashboard: true,
      users: true,
      cases: true,
      advisors: true,
      orders: true,
      health: true,
      products: true,
      api: false,
      admins: false,
    },
  });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userForm, setUserForm] = useState({
    id: '',
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  const [advisors, setAdvisors] = useState([
    { id: 'ADV-001', name: '陳顧問', phone: '0911-222-333', email: 'chen@example.com', specialty: '一般健康諮詢', status: 'active' },
    { id: 'ADV-002', name: '林顧問', phone: '0922-333-444', email: 'lin@example.com', specialty: '營養健康', status: 'active' },
    { id: 'ADV-003', name: '張顧問', phone: '0933-444-555', email: 'zhang@example.com', specialty: '運動健康', status: 'active' },
  ]);
  const [showAddAdvisorModal, setShowAddAdvisorModal] = useState(false);
  const [advisorForm, setAdvisorForm] = useState({
    id: '',
    name: '',
    phone: '',
    email: '',
    specialty: '',
  });
  const [caseReplies, setCaseReplies] = useState({
    'CASE-2024-001': [
      { id: 1, author: '顧問小助理', message: '您好，關於您提到的胃部不適問題，建議您可以嘗試在飯後30分鐘再服用，並配合溫開水送服。如果症狀持續，請立即停止使用並諮詢醫生。', timestamp: '2024-08-20 14:30', isAnonymous: true },
    ],
    'CASE-2024-002': [],
  });
  const [newReply, setNewReply] = useState('');

  // 從 localStorage 加載商品資料
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Failed to parse saved products:', error);
      }
    } else {
      // 使用預設商品資料
      const defaultProducts = [
        {
          id: 'PROD-001',
          name: '957 牛樟芝精華膠囊',
          description: '高純度牛樟芝精華，有效助益體健康',
          image: '',
          status: 'active',
          usage: {
            suggestedTime: '早上飯後、晚上飯後',
            dosage: '1-2 顆',
            interval: '至少120分鐘',
            dailyMax: '不超過 4 顆',
          },
          storage: {
            location: '陰涼乾燥處',
            temperature: '常溫',
            humidity: '避免高濕度',
          },
          warnings: [
            '請用溫開水送服，避免空腹服用',
            '建議飯後 30 分鐘內服用',
            '與其他藥物間隔至少 2 小時',
            '孕期、哺乳期或特殊疾病者請諮詢醫師',
            '避免與咖啡、茶、酒精同時服用',
          ],
        },
      ];
      setProducts(defaultProducts);
      localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
  }, []);
  const [apiConfig, setApiConfig] = useState({
    line: {
      channelId: '',
      channelSecret: '',
      accessToken: '',
      webhookUrl: '',
      enabled: false,
    },
    ai: {
      provider: 'openai',
      apiKey: '',
      model: 'gpt-4',
      enabled: false,
    },
    sms: {
      provider: 'twilio',
      accountSid: '',
      authToken: '',
      fromNumber: '',
      enabled: false,
    },
  });
  const [activeApiTab, setActiveApiTab] = useState('line');
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});

  const handleAssignAdvisor = (caseItem) => {
    setSelectedCase(caseItem);
    setSelectedAdvisor('');
    setShowAssignModal(true);
  };

  const handleAssignSubmit = () => {
    // 在實際應用中，這裡會調用 API 分配顧問
    console.log('分配顧問:', selectedCase.id, 'to', selectedAdvisor);
    setShowAssignModal(false);
    // 這裡應該更新案件狀態和顧問信息
  };

  const handleViewCaseDetail = (caseItem) => {
    setSelectedCase(caseItem);
    setShowCaseDetailModal(true);
  };

  const handleViewUserDetail = (user) => {
    setSelectedUser(user);
    setEditingUserData({ ...user });
    setShowUserDetailModal(true);
    setIsEditingUser(false);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditingUserData({ ...user });
    setShowUserDetailModal(true);
    setIsEditingUser(true);
  };

  const handleSaveUser = () => {
    // 在實際應用中，這裡會調用 API 更新用戶資料
    console.log('保存用戶資料:', editingUserData);
    setShowUserDetailModal(false);
    setIsEditingUser(false);
    // 這裡應該更新用戶列表
  };

  const handleViewHealthDetail = (record) => {
    setSelectedHealthRecord(record);
    setShowHealthDetailModal(true);
  };

  const handleExportOrders = () => {
    // 在實際應用中，這裡會調用 API 匯出訂單報告
    console.log('匯出訂單報告');
    alert('訂單報告匯出功能開發中...');
  };

  const handleViewOrderDetail = (order) => {
    setSelectedOrderDetail(order);
    setShowOrderDetailModal(true);
  };

  const handleDeleteOrder = async (orderId) => {
    if (confirm('確定要刪除此訂單嗎？此操作無法復原。')) {
      try {
        const success = await mockApiService.deleteOrder(orderId);
        if (success) {
          // 重新載入訂單
          const orders = await mockApiService.getOrders();
          const ordersWithUserNames = orders.map(order => ({
            ...order,
            userName: order.userId === 'USER-001' ? '王大明' : 
                       order.userId === 'USER-002' ? '李小美' : 
                       order.userId === 'USER-003' ? '張志明' : '未知用戶'
          }));
          setAllOrders(ordersWithUserNames);
          alert('訂單刪除成功');
        } else {
          alert('訂單刪除失敗');
        }
      } catch (error) {
        console.error('Failed to delete order:', error);
        alert('訂單刪除失敗');
      }
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrderData({ ...order });
    setShowEditOrderModal(true);
  };

  const handleSaveOrder = () => {
    // 在實際應用中，這裡會調用 API 更新訂單資料
    console.log('保存訂單資料:', editingOrderData);
    setShowEditOrderModal(false);
    // 這裡應該更新訂單列表
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      suggestedTime: product.usage.suggestedTime,
      dosage: product.usage.dosage,
      interval: product.usage.interval,
      dailyMax: product.usage.dailyMax,
      storageLocation: product.storage.location,
      storageTemperature: product.storage.temperature,
      storageHumidity: product.storage.humidity,
      warnings: product.warnings.join('\n'),
    });
    setShowProductModal(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      suggestedTime: '',
      dosage: '',
      interval: '',
      dailyMax: '',
      storageLocation: '',
      storageTemperature: '',
      storageHumidity: '',
      warnings: '',
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      // 編輯現有商品
      const updatedProducts = products.map(prod => 
        prod.id === editingProduct.id 
          ? {
              ...prod,
              name: productForm.name,
              description: productForm.description,
              usage: {
                suggestedTime: productForm.suggestedTime,
                dosage: productForm.dosage,
                interval: productForm.interval,
                dailyMax: productForm.dailyMax,
              },
              storage: {
                location: productForm.storageLocation,
                temperature: productForm.storageTemperature,
                humidity: productForm.storageHumidity,
              },
              warnings: productForm.warnings.split('\n').filter(w => w.trim()),
            }
          : prod
      );
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    } else {
      // 新增商品
      const newProduct = {
        id: `PROD-${Date.now()}`,
        name: productForm.name,
        description: productForm.description,
        image: '',
        status: 'active',
        usage: {
          suggestedTime: productForm.suggestedTime,
          dosage: productForm.dosage,
          interval: productForm.interval,
          dailyMax: productForm.dailyMax,
        },
        storage: {
          location: productForm.storageLocation,
          temperature: productForm.storageTemperature,
          humidity: productForm.storageHumidity,
        },
        warnings: productForm.warnings.split('\n').filter(w => w.trim()),
      };
      setProducts([...products, newProduct]);
      localStorage.setItem('products', JSON.stringify([...products, newProduct]));
    }
    setShowProductModal(false);
    alert('商品資料已保存');
  };

  const handleBulkImport = async (file) => {
    setUploadingFile(true);
    setImportResults([]);
    
    try {
      // 這裡應該使用 Excel 解析庫，如 xlsx 或 sheetjs
      // 由於這是內部測試版本，我們模擬解析過程
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const text = e.target.result;
        // 模擬 Excel 解析 - 在實際應用中應該使用 xlsx.parse
        // 這裡假設 CSV 格式
        const lines = text.split('\n');
        const results = [];
        
        // 跳過標題行，從第二行開始
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          // 假設 CSV 格式：名稱,描述,建議使用時段,每次用量,用藥間隔,每日總量
          const parts = line.split(',');
          if (parts.length >= 6) {
            const newProduct = {
              id: `PROD-${Date.now()}-${i}`,
              name: parts[0]?.trim() || '',
              description: parts[1]?.trim() || '',
              image: '',
              status: 'active',
              usage: {
                suggestedTime: parts[2]?.trim() || '早上飯後、晚上飯後',
                dosage: parts[3]?.trim() || '1-2 顆',
                interval: parts[4]?.trim() || '至少120分鐘',
                dailyMax: parts[5]?.trim() || '不超過 4 顆',
              },
              storage: {
                location: '陰涼乾燥處',
                temperature: '常溫',
                humidity: '避免高濕度',
              },
              warnings: ['請用溫開水送服，避免空腹服用'],
            };
            
            results.push({
              success: true,
              product: newProduct,
              message: `成功匯入: ${newProduct.name}`
            });
          }
        }
        
        // 批量新增商品
        const successfulProducts = results.filter(r => r.success).map(r => r.product);
        if (successfulProducts.length > 0) {
          setProducts([...products, ...successfulProducts]);
          localStorage.setItem('products', JSON.stringify([...products, ...successfulProducts]));
        }
        
        setImportResults(results);
        setUploadingFile(false);
        
        alert(`成功匯入 ${successfulProducts.length} 個商品`);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('檔案解析失敗:', error);
      alert('檔案解析失敗，請檢查檔案格式');
      setUploadingFile(false);
    }
  };

  const handleApiConfigChange = (service: string, field: string, value: any) => {
    setApiConfig((prev) => ({
      ...prev,
      [service]: {
        ...prev[service as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleTestApiConnection = async (service: string) => {
    setTestResults((prev) => ({
      ...prev,
      [service]: { success: false, message: '測試中...' },
    }));

    // 模擬 API 連接測試
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const config = apiConfig[service as keyof typeof apiConfig];
    const hasRequiredFields = service === 'line' 
      ? config.channelId && config.channelSecret && config.accessToken
      : service === 'ai'
      ? config.apiKey
      : service === 'sms'
      ? config.accountSid && config.authToken
      : false;

    if (hasRequiredFields) {
      setTestResults((prev) => ({
        ...prev,
        [service]: { success: true, message: '連接測試成功！' },
      }));
    } else {
      setTestResults((prev) => ({
        ...prev,
        [service]: { success: false, message: '連接測試失敗：請檢查配置信息' },
      }));
    }
  };

  const handleSaveApiConfig = () => {
    // 在實際應用中，這裡會調用 API 保存配置
    console.log('保存API配置:', apiConfig);
    alert('API配置已保存（測試版本）');
  };

  const [recentUsers] = useState([
    { id: 1, name: '王大明', phone: '0912-345-678', registerDate: '2024-08-20', status: '已啟用' },
    { id: 2, name: '李小美', phone: '0923-456-789', registerDate: '2024-08-19', status: '待啟用' },
    { id: 3, name: '張志明', phone: '0934-567-890', registerDate: '2024-08-18', status: '已啟用' },
  ]);

  const [pendingCases, setPendingCases] = useState([]);

  // 載入案件資料
  useEffect(() => {
    const loadCases = async () => {
      try {
        const cases = await mockApiService.getAdvisorCases();
        // 轉換格式以符合後台顯示需求
        const formattedCases = cases.map(caseItem => ({
          id: caseItem.id,
          user: caseItem.userId === 'USER-001' ? '王大明' : 
                 caseItem.userId === 'USER-002' ? '李小美' : 
                 caseItem.userId === 'USER-003' ? '張志明' : '未知用戶',
          type: caseItem.type,
          priority: caseItem.priority === 'high' ? '高' : caseItem.priority === 'normal' ? '中' : '低',
          submitDate: caseItem.date,
          subject: caseItem.subject,
          description: caseItem.description,
        }));
        setPendingCases(formattedCases);
      } catch (error) {
        console.error('Failed to load cases:', error);
      }
    };
    loadCases();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fbfa] flex">
      {/* 左側選單 */}
      <aside className="w-64 bg-white shadow-lg border-r border-[#d9e7e5] p-6 flex flex-col">
        {/* 公司標題 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0f2240]">珈明國際</h1>
          <p className="text-sm text-[#637082] mt-1">957 After-Sales Care</p>
        </div>

        {/* 管理員資訊 */}
        <div className="bg-[#f8fbfa] rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[#087e74] rounded-full flex items-center justify-center text-white font-bold">
              {adminInfo.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-[#0f2240]">{adminInfo.name}</p>
              <p className="text-xs text-[#637082]">ID: {adminInfo.id}</p>
              <p className="text-xs text-[#637082]">{adminInfo.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#637082]">角色：</span>
            <select
              value={adminInfo.role}
              onChange={(e) => setAdminInfo({ ...adminInfo, role: e.target.value })}
              className="text-xs px-2 py-1 border border-[#d9e7e5] rounded focus:outline-none focus:ring-2 focus:ring-[#087e74]"
            >
              <option value="admin">管理員</option>
              <option value="advisor">顧問</option>
              <option value="assistant">小幫手</option>
              <option value="customer_service">行政客服</option>
            </select>
          </div>
        </div>

        {/* 選單項目 */}
        <nav className="flex-1 space-y-2">
          {[
            { id: 'dashboard', label: '儀表板', icon: '📊' },
            { id: 'users', label: '用戶管理', icon: '👥' },
            { id: 'cases', label: '案件管理', icon: '📋' },
            { id: 'advisors', label: '顧問管理', icon: '👨‍⚕️' },
            { id: 'orders', label: '訂單管理', icon: '📦' },
            { id: 'health', label: '健康數據', icon: '💊' },
            { id: 'products', label: '商品管理', icon: '🏪' },
            { id: 'api', label: 'API設定', icon: '⚙️' },
            { id: 'admins', label: '管理員管理', icon: '👤' },
          ]
          .filter(item => adminInfo.permissions[item.id])
          .map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-semibold transition ${
                activeTab === item.id
                  ? 'bg-[#087e74] text-white'
                  : 'text-[#0f2240] hover:bg-[#f8fbfa]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <span>›</span>
            </button>
          ))}
        </nav>

        {/* 登出按鈕 */}
        <div className="mt-auto pt-6 border-t border-[#d9e7e5]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#637082] hover:text-[#0f2240] transition"
          >
            <span>←</span>
            <span>登出</span>
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full flex items-center gap-3 px-4 py-3 text-[#637082] hover:text-[#0f2240] transition"
          >
            <span>↪</span>
            <span>返回前台</span>
          </button>
        </div>
      </aside>

      {/* 主要內容區 */}
      <div className="flex-1 p-8">
        <div className="max-w-[1400px] mx-auto">

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-5 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
                <h3 className="text-sm font-semibold text-[#637082] mb-2">總用戶數</h3>
                <p className="text-3xl font-bold text-[#087e74]">{stats.totalUsers}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
                <h3 className="text-sm font-semibold text-[#637082] mb-2">活躍用戶</h3>
                <p className="text-3xl font-bold text-[#087e74]">{stats.activeUsers}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
                <h3 className="text-sm font-semibold text-[#637082] mb-2">總訂單數</h3>
                <p className="text-3xl font-bold text-[#087e74]">{stats.totalOrders}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
                <h3 className="text-sm font-semibold text-[#637082] mb-2">待處理案件</h3>
                <p className="text-3xl font-bold text-[#c45b2b]">{stats.pendingCases}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
                <h3 className="text-sm font-semibold text-[#637082] mb-2">今日健康回報</h3>
                <p className="text-3xl font-bold text-[#087e74]">{stats.todayHealthReports}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
                <h2 className="text-xl font-bold text-[#0f2240] mb-4">最新註冊用戶</h2>
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-[#f8fbfa] rounded-lg">
                      <div>
                        <p className="font-semibold text-[#0f2240]">{user.name}</p>
                        <p className="text-sm text-[#637082]">{user.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#637082]">{user.registerDate}</p>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.status === '已啟用' 
                            ? 'bg-[#e7f1fa] text-[#32617f]' 
                            : 'bg-[#fff7ed] text-[#c45b2b]'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
                <h2 className="text-xl font-bold text-[#0f2240] mb-4">待處理案件</h2>
                <div className="space-y-3">
                  {pendingCases.map((caseItem) => (
                    <div key={caseItem.id} className="flex items-center justify-between p-3 bg-[#f8fbfa] rounded-lg">
                      <div>
                        <p className="font-semibold text-[#0f2240]">{caseItem.user}</p>
                        <p className="text-sm text-[#637082]">{caseItem.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#637082]">{caseItem.submitDate}</p>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          caseItem.priority === '高' 
                            ? 'bg-[#fff7ed] text-[#c45b2b]' 
                            : 'bg-[#e7f1fa] text-[#32617f]'
                        }`}>
                          {caseItem.priority}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleAssignAdvisor(caseItem)}
                          className="px-3 py-1 bg-[#087e74] text-white rounded text-sm font-semibold hover:opacity-90 transition"
                        >
                          分配顧問
                        </button>
                        <button 
                          onClick={() => handleViewCaseDetail(caseItem)}
                          className="px-3 py-1 border border-[#d9e7e5] text-[#0f2240] rounded text-sm font-semibold hover:bg-gray-50 transition"
                        >
                          查看詳情
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0f2240]">用戶管理</h2>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="搜尋用戶..."
                  className="px-4 py-2 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                />
                <button 
                  onClick={() => {
                    setUserForm({ id: '', name: '', phone: '', email: '', password: '' });
                    setShowAddUserModal(true);
                  }}
                  className="px-4 py-2 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  手動新增用戶
                </button>
                <button className="px-4 py-2 border border-[#087e74] text-[#087e74] rounded-lg font-semibold hover:bg-[#dff4f0] transition">
                  匯出用戶資料
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f8fbfa] border-b border-[#d9e7e5]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">姓名</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">手機</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">註冊日期</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">狀態</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-[#d9e7e5] hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-[#0f2240]">{user.id}</td>
                      <td className="px-4 py-3 text-sm text-[#0f2240]">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-[#637082]">{user.phone}</td>
                      <td className="px-4 py-3 text-sm text-[#637082]">{user.registerDate}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.status === '已啟用' 
                            ? 'bg-[#e7f1fa] text-[#32617f]' 
                            : 'bg-[#fff7ed] text-[#c45b2b]'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => handleViewUserDetail(user)}
                          className="text-[#087e74] font-semibold hover:underline text-sm mr-2"
                        >
                          查看
                        </button>
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-[#637082] font-semibold hover:underline text-sm"
                        >
                          編輯
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0f2240]">案件管理</h2>
              <div className="flex gap-4">
                <select className="px-4 py-2 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]">
                  <option>所有狀態</option>
                  <option>待處理</option>
                  <option>處理中</option>
                  <option>已完成</option>
                </select>
                <button className="px-4 py-2 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition">
                  匯出案件報告
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {pendingCases.map((caseItem) => (
                <div key={caseItem.id} className="p-4 border border-[#d9e7e5] rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-[#0f2240]">{caseItem.id}</h3>
                      <p className="text-sm text-[#637082]">{caseItem.user} - {caseItem.type}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        caseItem.priority === '高' 
                          ? 'bg-[#fff7ed] text-[#c45b2b]' 
                          : 'bg-[#e7f1fa] text-[#32617f]'
                      }`}>
                        {caseItem.priority}
                      </span>
                      <span className="text-sm text-[#637082]">{caseItem.submitDate}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button 
                      onClick={() => handleAssignAdvisor(caseItem)}
                      className="px-3 py-1 bg-[#087e74] text-white rounded text-sm font-semibold hover:opacity-90 transition"
                    >
                      分配顧問
                    </button>
                    <button 
                      onClick={() => handleViewCaseDetail(caseItem)}
                      className="px-3 py-1 border border-[#d9e7e5] text-[#0f2240] rounded text-sm font-semibold hover:bg-gray-50 transition"
                    >
                      查看詳情
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'advisors' && (
          <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0f2240]">顧問管理</h2>
              <button 
                onClick={() => {
                  setAdvisorForm({ id: '', name: '', phone: '', email: '', specialty: '' });
                  setShowAddAdvisorModal(true);
                }}
                className="px-4 py-2 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                新增顧問
              </button>
            </div>

            <div className="space-y-4">
              {advisors.map((advisor) => (
                <div key={advisor.id} className="flex items-center justify-between p-4 bg-[#f8fbfa] rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#087e74] rounded-full flex items-center justify-center text-white font-bold">
                      {advisor.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0f2240]">{advisor.name}</h3>
                      <p className="text-sm text-[#637082]">ID: {advisor.id}</p>
                      <p className="text-sm text-[#637082]">專長: {advisor.specialty}</p>
                      <p className="text-sm text-[#637082]">電話: {advisor.phone}</p>
                      <p className="text-sm text-[#637082]">信箱: {advisor.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      advisor.status === 'active' 
                        ? 'bg-[#e7f1fa] text-[#32617f]' 
                        : 'bg-[#fff7ed] text-[#c45b2b]'
                    }`}>
                      {advisor.status === 'active' ? '已啟用' : '已停用'}
                    </span>
                    <button 
                      onClick={() => {
                        if (confirm(`確定要刪除顧問 ${advisor.name} 嗎？`)) {
                          setAdvisors(advisors.filter(a => a.id !== advisor.id));
                          alert('顧問刪除成功');
                        }
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:opacity-90 transition"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0f2240]">訂單管理</h2>
              <div className="flex gap-4">
                <select className="px-4 py-2 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]">
                  <option>所有狀態</option>
                  <option>已歸戶</option>
                  <option>待歸戶</option>
                </select>
                <button 
                  onClick={handleExportOrders}
                  className="px-4 py-2 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  匯出訂單報告
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f8fbfa] border-b border-[#d9e7e5]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">系統序號</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">用戶訂單編號</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">用戶</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">日期</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">商品</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">數量</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">金額</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">平台</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">狀態</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[#d9e7e5] hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-[#0f2240] font-medium">{order.id}</td>
                      <td className="px-4 py-3 text-sm text-[#637082]">{order.orderNumber}</td>
                      <td className="px-4 py-3 text-sm text-[#637082]">{order.userName}</td>
                      <td className="px-4 py-3 text-sm text-[#637082]">{order.date}</td>
                      <td className="px-4 py-3 text-sm text-[#0f2240]">{order.product}</td>
                      <td className="px-4 py-3 text-sm text-[#0f2240]">{order.quantity}</td>
                      <td className="px-4 py-3 text-sm text-[#0f2240]">NT${order.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-[#637082]">{order.platform}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.status === 'linked' 
                            ? 'bg-[#e7f1fa] text-[#32617f]' 
                            : 'bg-[#fff7ed] text-[#c45b2b]'
                        }`}>
                          {order.status === 'linked' ? '已歸戶' : '待歸戶'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => handleViewOrderDetail(order)}
                          className="text-[#087e74] font-semibold hover:underline text-sm mr-2"
                        >
                          查看詳情
                        </button>
                        <button 
                          onClick={() => handleEditOrder(order)}
                          className="text-[#637082] font-semibold hover:underline text-sm mr-2"
                        >
                          編輯
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 font-semibold hover:underline text-sm"
                        >
                          刪除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0f2240]">健康數據分析</h2>
              <div className="flex gap-4">
                <select className="px-4 py-2 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]">
                  <option>所有記錄</option>
                  <option>每日回報</option>
                  <option>初始評估</option>
                  <option>健康問答</option>
                </select>
                <button className="px-4 py-2 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition">
                  匯出健康報告
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#f8fbfa] rounded-lg p-4">
                <h3 className="text-sm font-semibold text-[#637082] mb-2">總記錄數</h3>
                <p className="text-2xl font-bold text-[#087e74]">156</p>
              </div>
              <div className="bg-[#f8fbfa] rounded-lg p-4">
                <h3 className="text-sm font-semibold text-[#637082] mb-2">今日回報</h3>
                <p className="text-2xl font-bold text-[#087e74]">23</p>
              </div>
              <div className="bg-[#f8fbfa] rounded-lg p-4">
                <h3 className="text-sm font-semibold text-[#637082] mb-2">狀況穩定</h3>
                <p className="text-2xl font-bold text-[#087e74]">89%</p>
              </div>
              <div className="bg-[#f8fbfa] rounded-lg p-4">
                <h3 className="text-sm font-semibold text-[#637082] mb-2">需要關注</h3>
                <p className="text-2xl font-bold text-[#c45b2b]">11%</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f8fbfa] border-b border-[#d9e7e5]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">記錄ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">用戶</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">日期</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">類型</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">睡眠</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">精神</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">腸胃</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">狀態</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#0f2240]">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {allHealthRecords.map((record) => (
                    <tr key={record.id} className="border-b border-[#d9e7e5] hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-[#0f2240] font-medium">{record.id}</td>
                      <td className="px-4 py-3 text-sm text-[#637082]">{record.userName}</td>
                      <td className="px-4 py-3 text-sm text-[#637082]">{record.date}</td>
                      <td className="px-4 py-3 text-sm text-[#0f2240]">
                        {record.type === 'daily' ? '每日回報' : record.type === 'initial' ? '初始評估' : '健康問答'}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#0f2240]">
                        {record.sleep === 'excellent' ? '非常好' : record.sleep === 'good' ? '良好' : record.sleep === 'fair' ? '普通' : '不佳'}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#0f2240]">
                        {record.energy === 'excellent' ? '非常有精神' : record.energy === 'good' ? '精神良好' : record.energy === 'fair' ? '普通' : '疲勞'}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#0f2240]">
                        {record.digestion === 'excellent' ? '正常' : record.digestion === 'good' ? '良好' : record.digestion === 'fair' ? '輕微不適' : '明顯不適'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          record.status === 'stable' || record.status === 'completed'
                            ? 'bg-[#e7f1fa] text-[#32617f]' 
                            : 'bg-[#fff7ed] text-[#c45b2b]'
                        }`}>
                          {record.status === 'stable' ? '穩定' : record.status === 'completed' ? '已完成' : '需關注'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => handleViewHealthDetail(record)}
                          className="text-[#087e74] font-semibold hover:underline text-sm"
                        >
                          查看詳情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0f2240]">商品管理</h2>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowBulkImportModal(true)}
                  className="px-4 py-2 border border-[#087e74] text-[#087e74] rounded-lg font-semibold hover:bg-[#dff4f0] transition"
                >
                  批量新增
                </button>
                <button 
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  新增商品
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-[#f8fbfa] rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#dff4f0] rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0f2240]">{product.name}</h3>
                      <p className="text-sm text-[#637082]">{product.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs text-[#637082]">建議使用: {product.usage.suggestedTime}</span>
                        <span className="text-xs text-[#637082]">每次用量: {product.usage.dosage}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditProduct(product)}
                      className="px-3 py-1 bg-[#087e74] text-white rounded text-sm font-semibold hover:opacity-90 transition"
                    >
                      編輯
                    </button>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      product.status === 'active' 
                        ? 'bg-[#e7f1fa] text-[#32617f]' 
                        : 'bg-[#fff7ed] text-[#c45b2b]'
                    }`}>
                      {product.status === 'active' ? '已啟用' : '已停用'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 商品編輯模態框 */}
        {showProductModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-[#0f2240] mb-4">
                {editingProduct ? '編輯商品' : '新增商品'}
              </h2>
              
              <div className="space-y-6">
                {/* 基本資訊 */}
                <div className="bg-[#f8fbfa] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#0f2240] mb-4">基本資訊</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#0f2240] mb-2">商品名稱</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#0f2240] mb-2">商品描述</label>
                      <input
                        type="text"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                      />
                    </div>
                  </div>
                </div>

                {/* 使用方式 */}
                <div className="bg-[#f8fbfa] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#0f2240] mb-4">使用方式</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#0f2240] mb-2">建議使用時段</label>
                      <select
                        value={productForm.suggestedTime}
                        onChange={(e) => setProductForm({ ...productForm, suggestedTime: e.target.value })}
                        className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                      >
                        <option value="">請選擇使用時段</option>
                        <option value="早上飯前">早上飯前</option>
                        <option value="早上飯後">早上飯後</option>
                        <option value="中午飯前">中午飯前</option>
                        <option value="中午飯後">中午飯後</option>
                        <option value="晚上飯前">晚上飯前</option>
                        <option value="晚上飯後">晚上飯後</option>
                        <option value="睡前">睡前</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#0f2240] mb-2">每次用量</label>
                      <input
                        type="text"
                        value={productForm.dosage}
                        onChange={(e) => setProductForm({ ...productForm, dosage: e.target.value })}
                        placeholder="例如：1-2 顆"
                        className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#0f2240] mb-2">用藥間隔</label>
                      <select
                        value={productForm.interval}
                        onChange={(e) => setProductForm({ ...productForm, interval: e.target.value })}
                        className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                      >
                        <option value="">請選擇用藥間隔</option>
                        <option value="至少30分鐘">至少30分鐘</option>
                        <option value="至少60分鐘">至少60分鐘</option>
                        <option value="至少120分鐘">至少120分鐘</option>
                        <option value="不用間隔">不用間隔</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#0f2240] mb-2">每日總量</label>
                      <input
                        type="text"
                        value={productForm.dailyMax}
                        onChange={(e) => setProductForm({ ...productForm, dailyMax: e.target.value })}
                        placeholder="例如：不超過 4 顆"
                        className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                      />
                    </div>
                  </div>
                </div>

                {/* 儲存方式 */}
                <div className="bg-[#f8fbfa] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#0f2240] mb-4">儲存方式</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#0f2240] mb-2">存放地點</label>
                      <input
                        type="text"
                        value={productForm.storageLocation}
                        onChange={(e) => setProductForm({ ...productForm, storageLocation: e.target.value })}
                        placeholder="例如：陰涼乾燥處"
                        className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#0f2240] mb-2">溫度要求</label>
                      <input
                        type="text"
                        value={productForm.storageTemperature}
                        onChange={(e) => setProductForm({ ...productForm, storageTemperature: e.target.value })}
                        placeholder="例如：常溫"
                        className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#0f2240] mb-2">濕度要求</label>
                      <input
                        type="text"
                        value={productForm.storageHumidity}
                        onChange={(e) => setProductForm({ ...productForm, storageHumidity: e.target.value })}
                        placeholder="例如：避免高濕度"
                        className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                      />
                    </div>
                  </div>
                </div>

                {/* 注意事項 */}
                <div className="bg-[#f8fbfa] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#0f2240] mb-4">使用注意事項</h3>
                  <div>
                    <label className="block text-sm font-semibold text-[#0f2240] mb-2">注意事項</label>
                    <textarea
                      value={productForm.warnings}
                      onChange={(e) => setProductForm({ ...productForm, warnings: e.target.value })}
                      placeholder="每行一條注意事項，例如：&#10;請用溫開水送服，避免空腹服用&#10;建議飯後 30 分鐘內服用"
                      rows={5}
                      className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveProduct}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#008f83] to-[#006d67] text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  {editingProduct ? '儲存變更' : '新增商品'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 批量新增模態框 */}
        {showBulkImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-[#0f2240] mb-4">批量新增商品</h2>
              
              <div className="space-y-6">
                <div className="bg-[#f8fbfa] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#0f2240] mb-4">上傳檔案</h3>
                  <div className="border-2 border-dashed border-[#d9e7e5] rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleBulkImport(file);
                        }
                      }}
                      disabled={uploadingFile}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer"
                    >
                      <div className="text-4xl mb-2">📁</div>
                      <p className="text-[#637082] mb-2">
                        {uploadingFile ? '處理中...' : '點擊上傳檔案'}
                      </p>
                      <p className="text-xs text-[#637082]">
                        支援 CSV、Excel 格式
                      </p>
                    </label>
                  </div>
                </div>

                <div className="bg-[#f8fbfa] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#0f2240] mb-4">檔案格式說明</h3>
                  <div className="text-sm text-[#637082] space-y-2">
                    <p><strong>CSV 格式：</strong></p>
                    <p>商品名稱,商品描述,建議使用時段,每次用量,用藥間隔,每日總量</p>
                    <p className="mt-2"><strong>範例：</strong></p>
                    <p className="bg-white p-2 rounded text-xs">957牛樟膠囊,高純度牛樟芝精華,早上飯後、晚上飯後,1-2顆,至少120分鐘,不超過4顆</p>
                  </div>
                </div>

                {importResults.length > 0 && (
                  <div className="bg-[#f8fbfa] rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-[#0f2240] mb-4">匯入結果</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {importResults.map((result, index) => (
                        <div key={index} className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                          {result.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowBulkImportModal(false);
                    setImportResults([]);
                  }}
                  disabled={uploadingFile}
                  className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 分配顧問模態框 */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-[#0f2240] mb-4">分配顧問</h2>
            <p className="text-[#637082] mb-6">
              案件 {selectedCase?.id} - {selectedCase?.subject}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  選擇顧問
                </label>
                <select
                  value={selectedAdvisor}
                  onChange={(e) => setSelectedAdvisor(e.target.value)}
                  className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                >
                  <option value="">請選擇顧問</option>
                  {advisors.map((advisor) => (
                    <option key={advisor.id} value={advisor.id}>
                      {advisor.name} - {advisor.specialty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                取消
              </button>
              <button
                onClick={handleAssignSubmit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#008f83] to-[#006d67] text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                確認分配
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 案件詳情模態框 */}
      {showCaseDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#0f2240] mb-4">案件詳情</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">案件編號</label>
                  <p className="text-[#0f2240]">{selectedCase?.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">提交日期</label>
                  <p className="text-[#0f2240]">{selectedCase?.submitDate}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">用戶</label>
                  <p className="text-[#0f2240]">{selectedCase?.user}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">案件類型</label>
                  <p className="text-[#0f2240]">{selectedCase?.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">優先級</label>
                  <p className="text-[#0f2240]">{selectedCase?.priority}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">狀態</label>
                  <p className="text-[#0f2240]">{selectedCase?.status}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#637082] mb-1">主旨</label>
                <p className="text-[#0f2240]">{selectedCase?.subject}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#637082] mb-1">詳細描述</label>
                <p className="text-[#0f2240] bg-[#f8fbfa] p-4 rounded-lg">
                  {selectedCase?.description || '暫無詳細描述'}
                </p>
              </div>

              {/* 顧問回覆區域 */}
              <div className="border-t border-[#d9e7e5] pt-4 mt-4">
                <h3 className="text-lg font-semibold text-[#0f2240] mb-4">顧問回覆</h3>
                
                {/* 回覆歷史 */}
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {caseReplies[selectedCase?.id]?.length > 0 ? (
                    caseReplies[selectedCase?.id].map((reply) => (
                      <div key={reply.id} className="bg-[#f8fbfa] p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#0f2240]">{reply.author}</span>
                            {reply.isAnonymous && (
                              <span className="text-xs px-2 py-1 bg-[#e7f1fa] text-[#32617f] rounded">管理員代回</span>
                            )}
                          </div>
                          <span className="text-xs text-[#637082]">{reply.timestamp}</span>
                        </div>
                        <p className="text-[#0f2240]">{reply.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[#637082] text-center py-4">尚無回覆</p>
                  )}
                </div>

                {/* 新增回覆 */}
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">新增回覆</label>
                  <textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder={adminInfo.role === 'advisor' ? "請輸入回覆內容..." : "僅顧問角色可以回覆案件"}
                    rows={4}
                    disabled={adminInfo.role !== 'advisor'}
                    className={`w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] resize-none ${
                      adminInfo.role !== 'advisor' ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                  <button
                    onClick={() => {
                      if (newReply.trim()) {
                        const now = new Date();
                        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                        
                        // 只有顧問角色顯示真實姓名，其他角色顯示「顧問小助理」
                        const displayName = adminInfo.role === 'advisor' ? adminInfo.name : '顧問小助理';
                        
                        const newReplyObj = {
                          id: Date.now(),
                          author: displayName,
                          message: newReply,
                          timestamp: timestamp,
                          isAnonymous: adminInfo.role !== 'advisor',
                        };
                        
                        setCaseReplies({
                          ...caseReplies,
                          [selectedCase.id]: [...(caseReplies[selectedCase.id] || []), newReplyObj],
                        });
                        setNewReply('');
                        alert('回覆已發送');
                      }
                    }}
                    disabled={!newReply.trim() || adminInfo.role !== 'advisor'}
                    className="mt-2 px-4 py-2 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {adminInfo.role === 'advisor' ? '發送回覆' : '僅顧問可回覆'}
                  </button>
                  {adminInfo.role !== 'advisor' && (
                    <p className="text-xs text-[#c45b2b] mt-2">※ 只有顧問角色可以回覆案件</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowCaseDetailModal(false)}
                className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 用戶詳情/編輯模態框 */}
      {showUserDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-[#0f2240] mb-4">
              {isEditingUser ? '編輯用戶' : '用戶詳情'}
            </h2>
            <div className="space-y-4">
              {isEditingUser ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-[#0f2240] mb-2">姓名</label>
                    <input
                      type="text"
                      value={editingUserData.name}
                      onChange={(e) => setEditingUserData({ ...editingUserData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0f2240] mb-2">手機</label>
                    <input
                      type="tel"
                      value={editingUserData.phone}
                      onChange={(e) => setEditingUserData({ ...editingUserData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0f2240] mb-2">電子郵件</label>
                    <input
                      type="email"
                      value={editingUserData.email}
                      onChange={(e) => setEditingUserData({ ...editingUserData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0f2240] mb-2">狀態</label>
                    <select
                      value={editingUserData.status}
                      onChange={(e) => setEditingUserData({ ...editingUserData, status: e.target.value })}
                      className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                    >
                      <option value="active">已啟用</option>
                      <option value="pending">待啟用</option>
                      <option value="inactive">已停用</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#637082] mb-1">用戶ID</label>
                      <p className="text-[#0f2240]">{selectedUser?.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#637082] mb-1">註冊日期</label>
                      <p className="text-[#0f2240]">{selectedUser?.registerDate}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#637082] mb-1">姓名</label>
                    <p className="text-[#0f2240]">{selectedUser?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#637082] mb-1">手機</label>
                    <p className="text-[#0f2240]">{selectedUser?.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#637082] mb-1">電子郵件</label>
                    <p className="text-[#0f2240]">{selectedUser?.email || '未填寫'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#637082] mb-1">狀態</label>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      selectedUser?.status === 'active' 
                        ? 'bg-[#e7f1fa] text-[#32617f]' 
                        : selectedUser?.status === 'pending'
                        ? 'bg-[#fff7ed] text-[#c45b2b]'
                        : 'bg-[#f3f4f6] text-[#6b7280]'
                    }`}>
                      {selectedUser?.status === 'active' ? '已啟用' : selectedUser?.status === 'pending' ? '待啟用' : '已停用'}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowUserDetailModal(false)}
                className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                {isEditingUser ? '取消' : '關閉'}
              </button>
              {isEditingUser && (
                <button
                  onClick={handleSaveUser}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#008f83] to-[#006d67] text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  儲存變更
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 健康記錄詳情模態框 */}
      {showHealthDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#0f2240] mb-4">健康記錄詳情</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">記錄ID</label>
                  <p className="text-[#0f2240]">{selectedHealthRecord?.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">用戶</label>
                  <p className="text-[#0f2240]">{selectedHealthRecord?.userName}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">日期</label>
                  <p className="text-[#0f2240]">{selectedHealthRecord?.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">類型</label>
                  <p className="text-[#0f2240]">
                    {selectedHealthRecord?.type === 'daily' ? '每日回報' : selectedHealthRecord?.type === 'initial' ? '初始評估' : '健康問答'}
                  </p>
                </div>
              </div>
              
              {selectedHealthRecord?.type === 'daily' && (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#637082] mb-1">睡眠狀況</label>
                      <p className="text-[#0f2240]">
                        {selectedHealthRecord?.sleep === 'excellent' ? '非常好' : selectedHealthRecord?.sleep === 'good' ? '良好' : selectedHealthRecord?.sleep === 'fair' ? '普通' : '不佳'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#637082] mb-1">精神狀態</label>
                      <p className="text-[#0f2240]">
                        {selectedHealthRecord?.energy === 'excellent' ? '非常有精神' : selectedHealthRecord?.energy === 'good' ? '精神良好' : selectedHealthRecord?.energy === 'fair' ? '普通' : '疲勞'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#637082] mb-1">腸胃狀況</label>
                      <p className="text-[#0f2240]">
                        {selectedHealthRecord?.digestion === 'excellent' ? '正常' : selectedHealthRecord?.digestion === 'good' ? '良好' : selectedHealthRecord?.digestion === 'fair' ? '輕微不適' : '明顯不適'}
                      </p>
                    </div>
                  </div>
                </>
              )}
              
              {selectedHealthRecord?.notes && (
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">備註</label>
                  <p className="text-[#0f2240] bg-[#f8fbfa] p-4 rounded-lg">
                    {selectedHealthRecord?.notes}
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-[#637082] mb-1">整體狀態</label>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  selectedHealthRecord?.status === 'stable' || selectedHealthRecord?.status === 'completed'
                    ? 'bg-[#e7f1fa] text-[#32617f]' 
                    : 'bg-[#fff7ed] text-[#c45b2b]'
                }`}>
                  {selectedHealthRecord?.status === 'stable' ? '穩定' : selectedHealthRecord?.status === 'completed' ? '已完成' : '需關注'}
                </span>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowHealthDetailModal(false)}
                className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 訂單詳情模態框 */}
      {showOrderDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-[#0f2240] mb-4">訂單詳情</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">系統序號</label>
                  <p className="text-[#0f2240]">{selectedOrderDetail?.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">用戶</label>
                  <p className="text-[#0f2240]">{selectedOrderDetail?.userName}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">日期</label>
                  <p className="text-[#0f2240]">{selectedOrderDetail?.date}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">購買平台</label>
                  <p className="text-[#0f2240]">{selectedOrderDetail?.platform}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">商品</label>
                  <p className="text-[#0f2240]">{selectedOrderDetail?.product}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">數量</label>
                  <p className="text-[#0f2240]">{selectedOrderDetail?.quantity}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">金額</label>
                  <p className="text-[#0f2240]">NT${selectedOrderDetail?.amount?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">用戶訂單編號</label>
                  <p className="text-[#0f2240]">{selectedOrderDetail?.orderNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#637082] mb-1">歸戶狀態</label>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    selectedOrderDetail?.status === 'linked' 
                      ? 'bg-[#e7f1fa] text-[#32617f]' 
                      : 'bg-[#fff7ed] text-[#c45b2b]'
                  }`}>
                    {selectedOrderDetail?.status === 'linked' ? '已歸戶' : '待歸戶'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowOrderDetailModal(false)}
                className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 訂單編輯模態框 */}
      {showEditOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-[#0f2240] mb-4">編輯訂單</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">訂單編號</label>
                <input
                  type="text"
                  value={editingOrderData.id}
                  disabled
                  className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg bg-gray-100 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">商品</label>
                <input
                  type="text"
                  value={editingOrderData.product}
                  onChange={(e) => setEditingOrderData({ ...editingOrderData, product: e.target.value })}
                  className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">數量</label>
                <input
                  type="number"
                  value={editingOrderData.quantity}
                  onChange={(e) => setEditingOrderData({ ...editingOrderData, quantity: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">金額</label>
                <input
                  type="number"
                  value={editingOrderData.amount}
                  onChange={(e) => setEditingOrderData({ ...editingOrderData, amount: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">購買平台</label>
                <select
                  value={editingOrderData.platform}
                  onChange={(e) => setEditingOrderData({ ...editingOrderData, platform: e.target.value })}
                  className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                >
                  <option value="蝦皮">蝦皮</option>
                  <option value="Momo">Momo</option>
                  <option value="PChome">PChome</option>
                  <option value="官方網站">官方網站</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">訂單編號</label>
                <input
                  type="text"
                  value={editingOrderData.orderNumber}
                  onChange={(e) => setEditingOrderData({ ...editingOrderData, orderNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">歸戶狀態</label>
                <select
                  value={editingOrderData.status}
                  onChange={(e) => setEditingOrderData({ ...editingOrderData, status: e.target.value })}
                  className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                >
                  <option value="linked">已歸戶</option>
                  <option value="pending">待歸戶</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowEditOrderModal(false)}
                className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                取消
              </button>
              <button
                onClick={handleSaveOrder}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#008f83] to-[#006d67] text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                儲存變更
              </button>
            </div>
          </div>
        </div>
      )}

        {activeTab === 'api' && (
          <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0f2240]">API 設定</h2>
              <button 
                onClick={handleSaveApiConfig}
                className="px-4 py-2 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                儲存配置
              </button>
            </div>

            <div className="flex gap-4 mb-6 border-b border-[#d9e7e5]">
              {['line', 'ai', 'sms'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveApiTab(tab)}
                  className={`px-4 py-3 font-semibold transition ${
                    activeApiTab === tab
                      ? 'text-[#087e74] border-b-2 border-[#087e74]'
                      : 'text-[#637082] hover:text-[#0f2240]'
                  }`}
                >
                  {tab === 'line' ? 'LINE API' : tab === 'ai' ? 'AI 服務' : 'SMS 服務'}
                </button>
              ))}
            </div>

            {activeApiTab === 'line' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#f8fbfa] rounded-lg">
                  <div>
                    <h3 className="font-semibold text-[#0f2240]">LINE Messaging API</h3>
                    <p className="text-sm text-[#637082]">配置 LINE 通知和訊息功能</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={apiConfig.line.enabled}
                      onChange={(e) => handleApiConfigChange('line', 'enabled', e.target.checked)}
                      className="w-5 h-5 text-[#087e74] rounded focus:ring-[#087e74]"
                    />
                    <span className="text-sm font-semibold text-[#0f2240]">啟用</span>
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0f2240] mb-2">Channel ID</label>
                    <input
                      type="text"
                      value={apiConfig.line.channelId}
                      onChange={(e) => handleApiConfigChange('line', 'channelId', e.target.value)}
                      placeholder="輸入 LINE Channel ID"
                      className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0f2240] mb-2">Channel Secret</label>
                    <input
                      type="password"
                      value={apiConfig.line.channelSecret}
                      onChange={(e) => handleApiConfigChange('line', 'channelSecret', e.target.value)}
                      placeholder="輸入 LINE Channel Secret"
                      className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0f2240] mb-2">Access Token</label>
                    <input
                      type="password"
                      value={apiConfig.line.accessToken}
                      onChange={(e) => handleApiConfigChange('line', 'accessToken', e.target.value)}
                      placeholder="輸入 LINE Access Token"
                      className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0f2240] mb-2">Webhook URL</label>
                    <input
                      type="text"
                      value={apiConfig.line.webhookUrl}
                      onChange={(e) => handleApiConfigChange('line', 'webhookUrl', e.target.value)}
                      placeholder="https://your-domain.com/api/line/webhook"
                      className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleTestApiConnection('line')}
                    className="px-4 py-2 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    測試連接
                  </button>
                  {testResults.line && (
                    <span className={`text-sm font-semibold ${
                      testResults.line.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {testResults.line.message}
                    </span>
                  )}
                </div>
              </div>
            )}

            {activeApiTab === 'ai' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#f8fbfa] rounded-lg">
                  <div>
                    <h3 className="font-semibold text-[#0f2240]">AI 服務配置</h3>
                    <p className="text-sm text-[#637082]">配置 AI 助理和健康分析服務</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={apiConfig.ai.enabled}
                      onChange={(e) => handleApiConfigChange('ai', 'enabled', e.target.checked)}
                      className="w-5 h-5 text-[#087e74] rounded focus:ring-[#087e74]"
                    />
                    <span className="text-sm font-semibold text-[#0f2240]">啟用</span>
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0f2240] mb-2">AI 提供商</label>
                    <select
                      value={apiConfig.ai.provider}
                      onChange={(e) => handleApiConfigChange('ai', 'provider', e.target.value)}
                      className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                    >
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic</option>
                      <option value="google">Google AI</option>
                      <option value="azure">Azure OpenAI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0f2240] mb-2">API Key</label>
                    <input
                      type="password"
                      value={apiConfig.ai.apiKey}
                      onChange={(e) => handleApiConfigChange('ai', 'apiKey', e.target.value)}
                      placeholder="輸入 API Key"
                      className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0f2240] mb-2">模型選擇</label>
                    <select
                      value={apiConfig.ai.model}
                      onChange={(e) => handleApiConfigChange('ai', 'model', e.target.value)}
                      className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                    >
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="claude-3">Claude 3</option>
                      <option value="gemini-pro">Gemini Pro</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleTestApiConnection('ai')}
                    className="px-4 py-2 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    測試連接
                  </button>
                  {testResults.ai && (
                    <span className={`text-sm font-semibold ${
                      testResults.ai.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {testResults.ai.message}
                    </span>
                  )}
                </div>
              </div>
            )}

            {activeApiTab === 'sms' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#f8fbfa] rounded-lg">
                  <div>
                    <h3 className="font-semibold text-[#0f2240]">SMS 服務配置</h3>
                    <p className="text-sm text-[#637082]">配置簡訊通知和驗證碼發送功能</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={apiConfig.sms.enabled}
                      onChange={(e) => handleApiConfigChange('sms', 'enabled', e.target.checked)}
                      className="w-5 h-5 text-[#087e74] rounded focus:ring-[#087e74]"
                    />
                    <span className="text-sm font-semibold text-[#0f2240]">啟用</span>
                  </label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#0f2240] mb-2">SMS 提供商</label>
                    <select
                      value={apiConfig.sms.provider}
                      onChange={(e) => handleApiConfigChange('sms', 'provider', e.target.value)}
                      className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                    >
                      <option value="twilio">Twilio</option>
                      <option value="nexmo">Nexmo</option>
                      <option value="aws-sns">AWS SNS</option>
                      <option value="every8d">Every8D (台灣)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0f2240] mb-2">Account SID</label>
                    <input
                      type="text"
                      value={apiConfig.sms.accountSid}
                      onChange={(e) => handleApiConfigChange('sms', 'accountSid', e.target.value)}
                      placeholder="輸入 Account SID"
                      className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0f2240] mb-2">Auth Token</label>
                    <input
                      type="password"
                      value={apiConfig.sms.authToken}
                      onChange={(e) => handleApiConfigChange('sms', 'authToken', e.target.value)}
                      placeholder="輸入 Auth Token"
                      className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0f2240] mb-2">發送號碼</label>
                    <input
                      type="text"
                      value={apiConfig.sms.fromNumber}
                      onChange={(e) => handleApiConfigChange('sms', 'fromNumber', e.target.value)}
                      placeholder="+886900000000"
                      className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleTestApiConnection('sms')}
                    className="px-4 py-2 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    測試連接
                  </button>
                  {testResults.sms && (
                    <span className={`text-sm font-semibold ${
                      testResults.sms.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {testResults.sms.message}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'admins' && (
          <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0f2240]">管理員管理</h2>
              <button 
                onClick={() => {
                  setAdminForm({
                    id: '',
                    name: '',
                    department: '',
                    password: '',
                    role: 'admin',
                    permissions: {
                      dashboard: true,
                      users: true,
                      cases: true,
                      advisors: true,
                      orders: true,
                      health: true,
                      products: true,
                      api: false,
                      admins: false,
                    },
                  });
                  setShowAdminModal(true);
                }}
                className="px-4 py-2 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                新增管理員
              </button>
            </div>

            <div className="space-y-4">
              {/* 當前登入管理員 */}
              <div className="flex items-center justify-between p-4 bg-[#dff4f0] rounded-lg border-2 border-[#087e74]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#087e74] rounded-full flex items-center justify-center text-white font-bold">
                    {adminInfo.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0f2240]">{adminInfo.name}</h3>
                    <p className="text-sm text-[#637082]">ID: {adminInfo.id}</p>
                    <p className="text-sm text-[#637082]">{adminInfo.department}</p>
                    <p className="text-sm text-[#637082]">角色: {adminInfo.role}</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-xs font-semibold bg-[#087e74] text-white">
                  當前登入
                </span>
              </div>

              {/* 其他管理員帳號 */}
              {adminAccounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 bg-[#f8fbfa] rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#637082] rounded-full flex items-center justify-center text-white font-bold">
                      {account.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0f2240]">{account.name}</h3>
                      <p className="text-sm text-[#637082]">ID: {account.id}</p>
                      <p className="text-sm text-[#637082]">{account.department}</p>
                      <p className="text-sm text-[#637082]">角色: {account.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingAdmin({ ...account });
                        setShowEditAdminModal(true);
                      }}
                      className="px-3 py-1 bg-[#087e74] text-white rounded text-sm font-semibold hover:opacity-90 transition"
                    >
                      編輯
                    </button>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      account.status === 'active' 
                        ? 'bg-[#e7f1fa] text-[#32617f]' 
                        : 'bg-[#fff7ed] text-[#c45b2b]'
                    }`}>
                      {account.status === 'active' ? '已啟用' : '已停用'}
                    </span>
                    <button 
                      onClick={() => {
                        if (confirm(`確定要刪除管理員 ${account.name} 嗎？`)) {
                          const updatedAccounts = adminAccounts.filter(a => a.id !== account.id);
                          setAdminAccounts(updatedAccounts);
                          localStorage.setItem('adminAccounts', JSON.stringify(updatedAccounts));
                          alert('管理員刪除成功');
                        }
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold hover:opacity-90 transition"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 新增管理員模態框 */}
        {showAdminModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-[#0f2240] mb-4">新增管理員</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">管理員 ID</label>
                  <input
                    type="text"
                    value={adminForm.id}
                    onChange={(e) => setAdminForm({ ...adminForm, id: e.target.value })}
                    placeholder="例如：ADMIN-002"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">姓名</label>
                  <input
                    type="text"
                    value={adminForm.name}
                    onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                    placeholder="請輸入姓名"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">部門</label>
                  <input
                    type="text"
                    value={adminForm.department}
                    onChange={(e) => setAdminForm({ ...adminForm, department: e.target.value })}
                    placeholder="例如：直播部"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">角色</label>
                  <select
                    value={adminForm.role}
                    onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value })}
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  >
                    <option value="admin">管理員</option>
                    <option value="advisor">顧問</option>
                    <option value="assistant">小幫手</option>
                    <option value="customer_service">行政客服</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">密碼</label>
                  <input
                    type="password"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    placeholder="請輸入密碼"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>

                {/* 權限設定 */}
                <div className="bg-[#f8fbfa] rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-[#0f2240] mb-4">功能權限</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'dashboard', label: '儀表板' },
                      { key: 'users', label: '用戶管理' },
                      { key: 'cases', label: '案件管理' },
                      { key: 'advisors', label: '顧問管理' },
                      { key: 'orders', label: '訂單管理' },
                      { key: 'health', label: '健康數據' },
                      { key: 'products', label: '商品管理' },
                      { key: 'api', label: 'API設定' },
                      { key: 'admins', label: '管理員管理' },
                    ].map((permission) => (
                      <label key={permission.key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={adminForm.permissions[permission.key]}
                          onChange={(e) => setAdminForm({
                            ...adminForm,
                            permissions: {
                              ...adminForm.permissions,
                              [permission.key]: e.target.checked
                            }
                          })}
                          className="w-4 h-4 text-[#087e74] rounded focus:ring-[#087e74]"
                        />
                        <span className="text-sm text-[#0f2240]">{permission.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    // 驗證必填欄位
                    if (!adminForm.id || !adminForm.name || !adminForm.password) {
                      alert('請填寫所有必填欄位');
                      return;
                    }

                    // 新增管理員帳號
                    const newAdmin = {
                      id: adminForm.id,
                      name: adminForm.name,
                      department: adminForm.department,
                      password: adminForm.password,
                      role: adminForm.role,
                      permissions: adminForm.permissions,
                      status: 'active',
                      createdAt: new Date().toISOString(),
                    };

                    // 保存到 localStorage
                    const updatedAccounts = [...adminAccounts, newAdmin];
                    setAdminAccounts(updatedAccounts);
                    localStorage.setItem('adminAccounts', JSON.stringify(updatedAccounts));

                    alert('管理員新增成功');
                    setShowAdminModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#008f83] to-[#006d67] text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  新增管理員
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 編輯管理員模態框 */}
        {showEditAdminModal && editingAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-[#0f2240] mb-4">編輯管理員</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">管理員 ID</label>
                  <input
                    type="text"
                    value={editingAdmin.id}
                    disabled
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg bg-gray-100 text-[#637082]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">姓名</label>
                  <input
                    type="text"
                    value={editingAdmin.name}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                    placeholder="請輸入姓名"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">部門</label>
                  <input
                    type="text"
                    value={editingAdmin.department}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, department: e.target.value })}
                    placeholder="例如：直播部"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">角色</label>
                  <select
                    value={editingAdmin.role}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, role: e.target.value })}
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  >
                    <option value="admin">管理員</option>
                    <option value="advisor">顧問</option>
                    <option value="assistant">小幫手</option>
                    <option value="customer_service">行政客服</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">密碼</label>
                  <input
                    type="password"
                    value={editingAdmin.password || ''}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, password: e.target.value })}
                    placeholder="留空則不修改密碼"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">帳號狀態</label>
                  <select
                    value={editingAdmin.status}
                    onChange={(e) => setEditingAdmin({ ...editingAdmin, status: e.target.value })}
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  >
                    <option value="active">已啟用</option>
                    <option value="inactive">已停用</option>
                  </select>
                </div>

                {/* 權限設定 */}
                <div className="bg-[#f8fbfa] rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-[#0f2240] mb-4">功能權限</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'dashboard', label: '儀表板' },
                      { key: 'users', label: '用戶管理' },
                      { key: 'cases', label: '案件管理' },
                      { key: 'advisors', label: '顧問管理' },
                      { key: 'orders', label: '訂單管理' },
                      { key: 'health', label: '健康數據' },
                      { key: 'products', label: '商品管理' },
                      { key: 'api', label: 'API設定' },
                      { key: 'admins', label: '管理員管理' },
                    ].map((permission) => (
                      <label key={permission.key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingAdmin.permissions?.[permission.key] || false}
                          onChange={(e) => setEditingAdmin({
                            ...editingAdmin,
                            permissions: {
                              ...editingAdmin.permissions,
                              [permission.key]: e.target.checked
                            }
                          })}
                          className="w-4 h-4 text-[#087e74] rounded focus:ring-[#087e74]"
                        />
                        <span className="text-sm text-[#0f2240]">{permission.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowEditAdminModal(false);
                    setEditingAdmin(null);
                  }}
                  className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    // 驗證必填欄位
                    if (!editingAdmin.id || !editingAdmin.name) {
                      alert('請填寫所有必填欄位');
                      return;
                    }

                    // 更新管理員帳號
                    const updatedAccounts = adminAccounts.map((account) =>
                      account.id === editingAdmin.id
                        ? {
                            ...editingAdmin,
                            // 如果密碼為空則保留原密碼
                            password: editingAdmin.password || account.password,
                          }
                        : account
                    );

                    setAdminAccounts(updatedAccounts);
                    localStorage.setItem('adminAccounts', JSON.stringify(updatedAccounts));

                    // 如果編輯的是當前登入帳號，同步更新 adminInfo
                    if (editingAdmin.id === adminInfo.id) {
                      setAdminInfo({
                        id: editingAdmin.id,
                        name: editingAdmin.name,
                        department: editingAdmin.department,
                        role: editingAdmin.role,
                        permissions: editingAdmin.permissions,
                      });
                      localStorage.setItem('currentAdmin', JSON.stringify({
                        ...editingAdmin,
                        password: editingAdmin.password || adminInfo.password,
                      }));
                    }

                    alert('管理員編輯成功');
                    setShowEditAdminModal(false);
                    setEditingAdmin(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#008f83] to-[#006d67] text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  儲存變更
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 新增用戶模態框 */}
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-[#0f2240] mb-4">手動新增用戶</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">用戶 ID</label>
                  <input
                    type="text"
                    value={userForm.id}
                    onChange={(e) => setUserForm({ ...userForm, id: e.target.value })}
                    placeholder="例如：USER-004"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">姓名</label>
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    placeholder="請輸入姓名"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">手機號碼</label>
                  <input
                    type="text"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    placeholder="例如：0912-345-678"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">電子郵件</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="例如：user@example.com"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">密碼</label>
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    placeholder="請輸入密碼"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    // 在實際應用中，這裡會調用 API 新增用戶
                    alert('用戶新增成功（測試版本）');
                    setShowAddUserModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#008f83] to-[#006d67] text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  新增用戶
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 新增顧問模態框 */}
        {showAddAdvisorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-[#0f2240] mb-4">新增顧問</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">顧問 ID</label>
                  <input
                    type="text"
                    value={advisorForm.id}
                    onChange={(e) => setAdvisorForm({ ...advisorForm, id: e.target.value })}
                    placeholder="例如：ADV-004"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">姓名</label>
                  <input
                    type="text"
                    value={advisorForm.name}
                    onChange={(e) => setAdvisorForm({ ...advisorForm, name: e.target.value })}
                    placeholder="請輸入姓名"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">手機號碼</label>
                  <input
                    type="text"
                    value={advisorForm.phone}
                    onChange={(e) => setAdvisorForm({ ...advisorForm, phone: e.target.value })}
                    placeholder="例如：0911-222-333"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">電子郵件</label>
                  <input
                    type="email"
                    value={advisorForm.email}
                    onChange={(e) => setAdvisorForm({ ...advisorForm, email: e.target.value })}
                    placeholder="例如：advisor@example.com"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">專長</label>
                  <input
                    type="text"
                    value={advisorForm.specialty}
                    onChange={(e) => setAdvisorForm({ ...advisorForm, specialty: e.target.value })}
                    placeholder="例如：營養諮詢"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowAddAdvisorModal(false)}
                  className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    const newAdvisor = {
                      id: advisorForm.id || `ADV-${Date.now()}`,
                      name: advisorForm.name,
                      phone: advisorForm.phone,
                      email: advisorForm.email,
                      specialty: advisorForm.specialty,
                      status: 'active',
                    };
                    setAdvisors([...advisors, newAdvisor]);
                    alert('顧問新增成功（測試版本）');
                    setShowAddAdvisorModal(false);
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#008f83] to-[#006d67] text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  新增顧問
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}