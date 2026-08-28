'use client';

import { useState } from 'react';
import { validatePhone, formatPhone, validateEmail, validateVerificationCode, validateProfile, getErrorMessage } from '@/lib/validation';
import { mockAuthService } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    verificationCode: '',
  });
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSendCode = async () => {
    setError('');
    setSuccess('');
    setFieldErrors({});
    
    if (!validatePhone(formData.phone)) {
      setFieldErrors({ phone: '請輸入有效的手機號碼 (09xx-xxx-xxx)' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await mockAuthService.sendVerificationCode(formData.phone);
      if (result.success) {
        setShowCodeInput(true);
        setSuccess('驗證碼已發送 (測試模式：請輸入任意6位數字)');
      } else {
        setError(result.error || '發送驗證碼失敗');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    setFieldErrors({});

    // 驗證表單
    const validation = validateProfile({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
    });

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    if (showCodeInput && !validateVerificationCode(formData.verificationCode)) {
      setFieldErrors({ verificationCode: '請輸入6位數字驗證碼' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await mockAuthService.register({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
      });

      if (result.success) {
        setSuccess('註冊成功，正在跳轉...');
        // 自動登入
        await login(formData.phone, formData.verificationCode || '123456');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setError(result.error || '註冊失敗');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  return (
    <main className="min-h-screen bg-[#f8fbfa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#d9e7e5]">
          <div className="text-center mb-8">
            <div className="brand-mark mx-auto mb-4">
              <span />
            </div>
            <h1 className="text-2xl font-bold text-[#0f2240] mb-2">會員註冊</h1>
            <p className="text-[#637082]">建立您的健康服務帳號</p>
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

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                姓名
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="請輸入真實姓名"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] focus:border-transparent ${
                  fieldErrors.name ? 'border-red-300' : 'border-[#d9e7e5]'
                }`}
              />
              {fieldErrors.name && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                手機號碼
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="0912-345-678"
                  disabled={showCodeInput}
                  maxLength={12}
                  className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] focus:border-transparent disabled:bg-gray-100 ${
                    fieldErrors.phone ? 'border-red-300' : 'border-[#d9e7e5]'
                  }`}
                />
                {!showCodeInput && (
                  <button
                    onClick={handleSendCode}
                    disabled={isLoading || formData.phone.length < 12}
                    className="px-4 py-3 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isLoading ? '發送中' : '發送驗證碼'}
                  </button>
                )}
              </div>
              {fieldErrors.phone && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.phone}</p>
              )}
            </div>

            {showCodeInput && (
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  驗證碼
                </label>
                <input
                  type="text"
                  value={formData.verificationCode}
                  onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                  placeholder="請輸入6位驗證碼"
                  maxLength={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] focus:border-transparent text-center text-2xl tracking-widest ${
                    fieldErrors.verificationCode ? 'border-red-300' : 'border-[#d9e7e5]'
                  }`}
                />
                {fieldErrors.verificationCode && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.verificationCode}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                電子郵件 (選填)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] focus:border-transparent ${
                  fieldErrors.email ? 'border-red-300' : 'border-[#d9e7e5]'
                }`}
              />
              {fieldErrors.email && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <button
              onClick={handleRegister}
              disabled={isLoading || !formData.name || !formData.phone || (showCodeInput && formData.verificationCode.length < 6)}
              className="w-full bg-gradient-to-r from-[#008f83] to-[#006d67] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '註冊中...' : '完成註冊'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-[#d9e7e5] text-center">
            <p className="text-sm text-[#637082]">
              已經有帳號？
              <button 
                onClick={() => window.location.href = '/auth/login'}
                className="text-[#087e74] font-semibold hover:underline ml-1"
              >
                立即登入
              </button>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-[#637082]">
            內部測試版本 - 僅供公司內部使用
          </p>
        </div>
      </div>
    </main>
  );
}