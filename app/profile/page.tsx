'use client';

import { useState, useEffect } from 'react';
import { validateProfile, getErrorMessage } from '@/lib/validation';
import { mockApiService, mockUsers } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import MainNav from '../components/MainNav';

export default function ProfilePage() {
  const { user, updateUser, setLineBound } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [profile, setProfile] = useState({
    name: user?.name || '測試會員',
    phone: user?.phone || '0912-345-678',
    email: user?.email || 'test@example.com',
    birthDate: user?.birthDate || '1990-01-01',
    gender: user?.gender || 'female',
    address: user?.address || '台北市信義區',
  });

  const [showLineBindingModal, setShowLineBindingModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [lineStatus, setLineStatus] = useState(false); // 假設未綁定

  // 當用戶數據變化時更新表單
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        phone: user.phone,
        email: user.email || '',
        birthDate: user.birthDate || '',
        gender: user.gender || 'female',
        address: user.address || '',
      });
    }
  }, [user]);

  // 檢查URL參數，如果有showLineBinding=true則自動打開LINE綁定視窗
  useEffect(() => {
    if (searchParams.get('showLineBinding') === 'true') {
      setShowLineBindingModal(true);
      // 清除URL參數
      router.replace('/profile');
    }
  }, [searchParams, router]);

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setFieldErrors({});

    // 驗證表單
    const validation = validateProfile({
      name: profile.name,
      phone: profile.phone,
      email: profile.email,
    });

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      // 更新後端數據
      const result = await mockApiService.updateUser(user?.id || 'USER-001', profile);
      if (result) {
        // 更新 AuthContext 中的用戶數據
        updateUser(profile);
        setSuccess('個人資料更新成功');
        setIsEditing(false);
      } else {
        setError('更新失敗，請稍後再試');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLineBinding = () => {
    // 在實際應用中，這裡會跳轉到 LINE 授權頁面
    setError('');
    setShowLineBindingModal(true);
  };

  const handlePasswordChange = () => {
    setError('');
    setPasswordError('');
    setShowPasswordModal(true);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handlePasswordSubmit = () => {
    setError('');
    setPasswordError('');
    
    // 基本驗證
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('請填寫所有密碼欄位');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('新密碼與確認密碼不一致');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('新密碼長度至少需要 6 個字符');
      return;
    }

    // 在實際應用中，這裡會調用 API 更新密碼
    setSuccess('密碼修改成功');
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

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
            onClick={() => {
              // 使用 AuthContext 的 logout
              window.location.href = '/auth/login';
            }}
            className="text-[#637082] hover:text-[#087e74] transition"
          >
            登出
          </button>
        </div>
      </header>

      <MainNav />

      <div className="mx-auto w-full max-w-[1540px] px-5 pb-8 md:px-8">
        <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-8 mt-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#0f2240] mb-2">個人資料</h1>
              <p className="text-[#637082]">管理您的會員資訊</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                編輯資料
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  姓名
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] ${
                        fieldErrors.name ? 'border-red-300' : 'border-[#d9e7e5]'
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="text-sm text-red-600 mt-1">{fieldErrors.name}</p>
                    )}
                  </>
                ) : (
                  <p className="text-[#0f2240] py-3">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  手機號碼
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] ${
                        fieldErrors.phone ? 'border-red-300' : 'border-[#d9e7e5]'
                      }`}
                    />
                    {fieldErrors.phone && (
                      <p className="text-sm text-red-600 mt-1">{fieldErrors.phone}</p>
                    )}
                  </>
                ) : (
                  <p className="text-[#0f2240] py-3">{profile.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  電子郵件
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] ${
                        fieldErrors.email ? 'border-red-300' : 'border-[#d9e7e5]'
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>
                    )}
                  </>
                ) : (
                  <p className="text-[#0f2240] py-3">{profile.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  出生日期
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profile.birthDate}
                    onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                ) : (
                  <p className="text-[#0f2240] py-3">{profile.birthDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  性別
                </label>
                {isEditing ? (
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  >
                    <option value="male">男性</option>
                    <option value="female">女性</option>
                    <option value="other">其他</option>
                  </select>
                ) : (
                  <p className="text-[#0f2240] py-3">
                    {profile.gender === 'male' ? '男性' : profile.gender === 'female' ? '女性' : '其他'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  地址
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                ) : (
                  <p className="text-[#0f2240] py-3">{profile.address}</p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-4 mt-8 pt-6 border-t border-[#d9e7e5]">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-[#008f83] to-[#006d67] text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '儲存中...' : '儲存變更'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
                className="px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                取消
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-8 mt-8">
          <h2 className="text-2xl font-bold text-[#0f2240] mb-6">帳號設定</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#f8fbfa] rounded-lg">
              <div>
                <h3 className="font-semibold text-[#0f2240]">LINE 綁定</h3>
                <p className="text-sm text-[#637082]">接收關懷回覆、提醒與追蹤通知</p>
              </div>
              <button 
                onClick={handleLineBinding}
                className="px-4 py-2 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                {lineStatus ? '已綁定' : '綁定 LINE'}
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#f8fbfa] rounded-lg">
              <div>
                <h3 className="font-semibold text-[#0f2240]">密碼修改</h3>
                <p className="text-sm text-[#637082]">定期更新密碼以保護帳號安全</p>
              </div>
              <button 
                onClick={handlePasswordChange}
                className="px-4 py-2 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                修改密碼
              </button>
            </div>
          </div>
        </div>

        {/* LINE 綁定模態框 */}
        {showLineBindingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-[#0f2240] mb-4">LINE 綁定</h2>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#06C755] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">LINE</span>
                  </div>
                  <p className="text-[#637082] mb-4">
                    掃描 QR Code 或點擊下方按鈕完成 LINE 綁定
                  </p>
                  <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-[#637082]">QR Code (模擬)</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLineBindingModal(false)}
                  className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    setLineStatus(true);
                    setShowLineBindingModal(false);
                    setLineBound(true); // 設置 LINE 綁定狀態
                    setSuccess('LINE 綁定成功');
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#008f83] to-[#006d67] text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  確認綁定
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 密碼修改模態框 */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-[#0f2240] mb-4">修改密碼</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                    當前密碼
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="請輸入當前密碼"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                    新密碼
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="請輸入新密碼（至少6個字符）"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                    確認新密碼
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="請再次輸入新密碼"
                    className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                  />
                </div>
                {/* 密碼修改模態框內的錯誤顯示 */}
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{passwordError}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  取消
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#008f83] to-[#006d67] text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  確認修改
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}