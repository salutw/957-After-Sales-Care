'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 初始化預設管理員帳號
  useEffect(() => {
    const savedAdmins = localStorage.getItem('adminAccounts');
    if (!savedAdmins) {
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
      localStorage.setItem('adminAccounts', JSON.stringify([defaultAdmin]));
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // 從 localStorage 載入管理員帳號
    const savedAdmins = localStorage.getItem('adminAccounts');
    const adminAccounts = savedAdmins ? JSON.parse(savedAdmins) : [];

    // 檢查帳號密碼
    const admin = adminAccounts.find(
      (account) => account.id === formData.id && account.password === formData.password && account.status === 'active'
    );

    if (admin) {
      // 保存登入資訊
      localStorage.setItem('currentAdmin', JSON.stringify(admin));
      router.push('/admin');
    } else {
      setError('帳號或密碼錯誤，或帳號已被停用');
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fbfa] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0f2240] mb-2">珈明國際</h1>
          <p className="text-[#637082]">957 After-Sales Care - 管理後台</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#0f2240] mb-2">管理員 ID</label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="請輸入管理員 ID"
              className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0f2240] mb-2">密碼</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="請輸入密碼"
                className="w-full px-4 py-3 pr-12 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#637082] hover:text-[#0f2240] focus:outline-none"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-[#fff7ed] border border-[#c45b2b] text-[#c45b2b] px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-[#008f83] to-[#006d67] text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            登入
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-[#087e74] hover:underline text-sm"
          >
            返回前台
          </button>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800 text-center">
            ⚠️ 測試帳號：ADMIN-001 / 123456
          </p>
        </div>
      </div>
    </main>
  );
}
