'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { mockApiService, mockOrders } from '@/lib/mock-data';
import { validateOrderLink, getErrorMessage } from '@/lib/validation';

export default function OrdersPage() {
  const { user, setOrderLinked } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [orders, setOrders] = useState(mockOrders);
  const [isLoading, setIsLoading] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [linkData, setLinkData] = useState({
    platform: '',
    orderNumber: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [newOrderData, setNewOrderData] = useState({
    product: '957 牛樟芝精華膠囊',
    quantity: 1,
    amount: 1490,
    platform: '蝦皮',
    orderNumber: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');

  // 檢查URL參數，如果有showAddModal=true則自動打開新增視窗
  useEffect(() => {
    const showAddModal = searchParams.get('showAddModal');
    if (showAddModal === 'true') {
      setShowAddOrderModal(true);
      // 重置表單數據
      setNewOrderData({
        product: '957 牛樟芝精華膠囊',
        quantity: 1,
        amount: 1490,
        platform: '蝦皮',
        orderNumber: '',
        date: new Date().toISOString().split('T')[0],
      });
      setFieldErrors({});
      // 清除URL參數
      router.replace('/orders');
    }
  }, [searchParams, router]);

  // 加載用戶訂單
  useEffect(() => {
    if (user) {
      loadUserOrders();
    }
  }, [user]);

  const loadUserOrders = async () => {
    setIsLoading(true);
    try {
      const userOrders = await mockApiService.getOrders(user?.id);
      setOrders(userOrders);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkOrder = (order) => {
    setSelectedOrder(order);
    setLinkData({ platform: '', orderNumber: '' });
    setShowLinkModal(true);
    setError('');
    setFieldErrors({});
  };

  const handleLinkSubmit = async () => {
    setError('');
    setFieldErrors({});

    // 驗證表單
    const validation = validateOrderLink(linkData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await mockApiService.linkOrder(selectedOrder.id, user?.id);
      if (result) {
        setSuccess('訂單歸戶成功');
        setShowLinkModal(false);
        // 重新載入訂單
        await loadUserOrders();
        // 設置訂單歸戶狀態
        setOrderLinked(true);
      } else {
        setError('歸戶失敗，請稍後再試');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrder = () => {
    setShowAddOrderModal(true);
    setNewOrderData({
      product: '957 牛樟芝精華膠囊',
      quantity: 1,
      amount: 1490,
      platform: '蝦皮',
      orderNumber: '',
      date: new Date().toISOString().split('T')[0],
    });
    setFieldErrors({});
  };

  const handleAddOrderSubmit = async () => {
    setError('');
    setFieldErrors({});

    // 基本驗證
    if (!newOrderData.orderNumber || newOrderData.orderNumber.length < 5) {
      setFieldErrors({ orderNumber: '請輸入有效的訂單編號' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await mockApiService.createOrder({
        userId: user?.id,
        ...newOrderData,
        status: 'pending',
      });

      if (result) {
        setSuccess('訂單新增成功');
        setShowAddOrderModal(false);
        // 重新載入訂單
        await loadUserOrders();
        // 設置訂單歸戶狀態
        setOrderLinked(true);
      } else {
        setError('新增失敗，請稍後再試');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrderDetail = (order) => {
    setSelectedOrderDetail(order);
    setShowOrderDetailModal(true);
  };

  const filteredOrders = orders.filter((order) => {
    const matchStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchPlatform = platformFilter === 'all' || order.platform === platformFilter;
    return matchStatus && matchPlatform;
  });

  return (
    <main className="min-h-screen bg-[#f8fbfa]">
      <header className="site-header mx-auto flex h-20 w-full max-w-[1540px] items-center justify-between px-5 md:px-8">
        <div className="flex items-center gap-3">
          <div className="brand-mark">
            <span />
          </div>
          <strong className="brand-title text-xl font-bold tracking-normal md:text-2xl">
            957 After-Sales Care
          </strong>
        </div>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <button 
            onClick={() => window.location.href = '/'}
            className="text-[#087e74] hover:underline"
          >
            返回儀表板
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1540px] px-5 pb-8 md:px-8">
        <div className="flex justify-between items-center mt-8 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#0f2240] mb-2">訂單管理</h1>
            <p className="text-[#637082]">查看並歸戶您的購買記錄</p>
          </div>
          <button 
            onClick={handleAddOrder}
            className="px-6 py-3 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            手動新增訂單
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-[#d9e7e5] rounded-lg bg-white text-[#0f2240] text-sm focus:outline-none focus:ring-2 focus:ring-[#087e74]"
          >
            <option value="all">全部狀態</option>
            <option value="已歸戶">已歸戶</option>
            <option value="待歸戶">待歸戶</option>
            <option value="pending">待處理</option>
          </select>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-4 py-2 border border-[#d9e7e5] rounded-lg bg-white text-[#0f2240] text-sm focus:outline-none focus:ring-2 focus:ring-[#087e74]"
          >
            <option value="all">全部平台</option>
            <option value="蝦皮��">蝦皮</option>
            <option value="官網">官網</option>
            <option value="MOMO">MOMO</option>
            <option value="PChome">PChome</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] overflow-hidden">
          <div className="overflow-x-auto md:overflow-visible mobile-table-scroll">
            <table className="w-full mobile-card-table">
              <thead className="bg-[#f8fbfa] border-b border-[#d9e7e5] hidden md:table-header-group">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">系統序號</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">用戶訂單編號</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">日期</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">商品</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">數量</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">金額</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">平台</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">狀態</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[#d9e7e5] hover:bg-gray-50 md:table-row">
                    <td data-label="系統序號" className="px-6 py-4 text-sm text-[#0f2240] font-medium">{order.id}</td>
                    <td data-label="用戶訂單編號" className="px-6 py-4 text-sm text-[#637082]">{order.orderNumber}</td>
                    <td data-label="日期" className="px-6 py-4 text-sm text-[#637082]">{order.date}</td>
                    <td data-label="商品" className="px-6 py-4 text-sm text-[#0f2240]">{order.product}</td>
                    <td data-label="數量" className="px-6 py-4 text-sm text-[#0f2240]">{order.quantity}</td>
                    <td data-label="金額" className="px-6 py-4 text-sm text-[#0f2240]">NT${order.amount.toLocaleString()}</td>
                    <td data-label="平台" className="px-6 py-4 text-sm text-[#637082]">{order.platform}</td>
                    <td data-label="狀態" className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === '已歸戶' 
                          ? 'bg-[#e7f1fa] text-[#32617f]' 
                          : 'bg-[#fff7ed] text-[#c45b2b]'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td data-label="操作" className="px-6 py-4">
                      {order.status === '待歸戶' ? (
                        <button
                          onClick={() => handleLinkOrder(order)}
                          className="text-[#087e74] font-semibold hover:underline text-sm"
                        >
                          歸戶
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleViewOrderDetail(order)}
                          className="text-[#637082] font-semibold hover:underline text-sm"
                        >
                          查看詳情
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-8 mt-8">
          <h2 className="text-2xl font-bold text-[#0f2240] mb-4">如何歸戶訂單？</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#087e74] text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold text-[#0f2240]">掃描商品 QR Code</h3>
                <p className="text-sm text-[#637082]">使用手機掃描產品包裝上的 QR Code</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#087e74] text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold text-[#0f2240]">輸入訂單資訊</h3>
                <p className="text-sm text-[#637082]">填寫購買平台、訂單編號等資訊</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#087e74] text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold text-[#0f2240]">系統驗證</h3>
                <p className="text-sm text-[#637082]">系統會自動比對並啟用售後服務</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-[#0f2240] mb-4">訂單歸戶</h2>
            <p className="text-[#637082] mb-6">
              將訂單 {selectedOrder?.id} 歸戶到您的會員帳號
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  購買平台
                </label>
                <select 
                  value={linkData.platform}
                  onChange={(e) => setLinkData({ ...linkData, platform: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] ${
                    fieldErrors.platform ? 'border-red-300' : 'border-[#d9e7e5]'
                  }`}
                >
                  <option value="">請選擇平台</option>
                  <option value="蝦皮">蝦皮</option>
                  <option value="Momo">Momo</option>
                  <option value="PChome">PChome</option>
                  <option value="官方網站">官方網站</option>
                </select>
                {fieldErrors.platform && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.platform}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  訂單編號
                </label>
                <input
                  type="text"
                  value={linkData.orderNumber}
                  onChange={(e) => setLinkData({ ...linkData, orderNumber: e.target.value })}
                  placeholder="請輸入訂單編號"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] ${
                    fieldErrors.orderNumber ? 'border-red-300' : 'border-[#d9e7e5]'
                  }`}
                />
                {fieldErrors.orderNumber && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.orderNumber}</p>
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowLinkModal(false)}
                disabled={isLoading}
                className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                取消
              </button>
              <button
                onClick={handleLinkSubmit}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#008f83] to-[#006d67] text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '處理中...' : '確認歸戶'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-[#0f2240] mb-4">手動新增訂單</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  商品
                </label>
                <input
                  type="text"
                  value={newOrderData.product}
                  onChange={(e) => setNewOrderData({ ...newOrderData, product: e.target.value })}
                  className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  數量
                </label>
                <input
                  type="number"
                  value={newOrderData.quantity}
                  onChange={(e) => setNewOrderData({ ...newOrderData, quantity: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  金額
                </label>
                <input
                  type="number"
                  value={newOrderData.amount}
                  onChange={(e) => setNewOrderData({ ...newOrderData, amount: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  購買平台
                </label>
                <select
                  value={newOrderData.platform}
                  onChange={(e) => setNewOrderData({ ...newOrderData, platform: e.target.value })}
                  className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                >
                  <option value="蝦皮">蝦皮</option>
                  <option value="Momo">Momo</option>
                  <option value="PChome">PChome</option>
                  <option value="官方網站">官方網站</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  訂單編號
                </label>
                <input
                  type="text"
                  value={newOrderData.orderNumber}
                  onChange={(e) => setNewOrderData({ ...newOrderData, orderNumber: e.target.value })}
                  placeholder="請輸入訂單編號"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] ${
                    fieldErrors.orderNumber ? 'border-red-300' : 'border-[#d9e7e5]'
                  }`}
                />
                {fieldErrors.orderNumber && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.orderNumber}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  購買日期
                </label>
                <input
                  type="date"
                  value={newOrderData.date}
                  onChange={(e) => setNewOrderData({ ...newOrderData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowAddOrderModal(false)}
                disabled={isLoading}
                className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                取消
              </button>
              <button
                onClick={handleAddOrderSubmit}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#008f83] to-[#006d67] text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '新增中...' : '確認新增'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <label className="block text-sm font-semibold text-[#637082] mb-1">購買日期</label>
                  <p className="text-[#0f2240]">{selectedOrderDetail?.date}</p>
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
                  <label className="block text-sm font-semibold text-[#637082] mb-1">購買平台</label>
                  <p className="text-[#0f2240]">{selectedOrderDetail?.platform}</p>
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
    </main>
  );
}