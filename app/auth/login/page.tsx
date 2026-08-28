'use client';

import { useState } from 'react';
import { validatePhone, formatPhone, validateVerificationCode, getErrorMessage } from '@/lib/validation';
import { mockAuthService } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendCode = async () => {
    setError('');
    setSuccess('');
    
    if (!validatePhone(phone)) {
      setError('請輸入有效的手機號碼 (09xx-xxx-xxx)');
      return;
    }

    setIsLoading(true);
    try {
      const result = await mockAuthService.sendVerificationCode(phone);
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

  const handleVerify = async () => {
    setError('');
    setSuccess('');
    
    if (!validateVerificationCode(verificationCode)) {
      setError('請輸入6位數字驗證碼');
      return;
    }

    setIsLoading(true);
    try {
      const result = await mockAuthService.login(phone, verificationCode);
      if (result.success) {
        setSuccess('登入成功，正在跳轉...');
        // 使用 AuthContext 的 login
        await login(phone, verificationCode);
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setError(result.error || '驗證失敗');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  return (
    <main className="min-h-screen bg-[#f8fbfa] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#d9e7e5]">
          <div className="text-center mb-8">
            <div className="brand-mark mx-auto mb-4">
              <span />
            </div>
            <h1 className="text-2xl font-bold text-[#0f2240] mb-2">會員登入</h1>
            <p className="text-[#637082]">請輸入手機號碼進行驗證</p>
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

          {!showCodeInput ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  手機號碼
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="0912-345-678"
                  maxLength={12}
                  className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSendCode}
                disabled={isLoading || phone.length < 12}
                className="w-full bg-gradient-to-r from-[#008f83] to-[#006d67] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '發送中...' : '發送驗證碼'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  驗證碼
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="請輸入6位驗證碼"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] focus:border-transparent text-center text-2xl tracking-widest"
                />
                <p className="text-sm text-[#637082] mt-2">
                  測試模式：請輸入任意6位數字
                </p>
              </div>
              <button
                onClick={handleVerify}
                disabled={isLoading || verificationCode.length < 6}
                className="w-full bg-gradient-to-r from-[#008f83] to-[#006d67] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '驗證中...' : '驗證登入'}
              </button>
              <button
                onClick={() => {
                  setShowCodeInput(false);
                  setVerificationCode('');
                  setError('');
                  setSuccess('');
                }}
                className="w-full text-[#087e74] py-2 font-semibold hover:underline"
              >
                重新輸入手機號碼
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-[#d9e7e5] text-center">
            <p className="text-sm text-[#637082]">
              還沒有帳號？
              <button 
                onClick={() => window.location.href = '/auth/register'}
                className="text-[#087e74] font-semibold hover:underline ml-1"
              >
                立即註冊
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