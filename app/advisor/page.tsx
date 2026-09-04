'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockApiService, mockAdvisorCases } from '@/lib/mock-data';
import { validateAdvisorCase, getErrorMessage } from '@/lib/validation';
import MainNav from '../components/MainNav';

export default function AdvisorPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState(mockAdvisorCases);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newCase, setNewCase] = useState({
    type: '',
    subject: '',
    description: '',
    priority: 'normal',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // 加載用戶顧問案件
  useEffect(() => {
    if (user) {
      loadAdvisorCases();
    }
  }, [user]);

  const loadAdvisorCases = async () => {
    setIsLoading(true);
    try {
      const userCases = await mockApiService.getAdvisorCases(user?.id);
      setCases(userCases);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitCase = async () => {
    setError('');
    setSuccess('');
    setFieldErrors({});

    // 驗證表單
    const validation = validateAdvisorCase(newCase);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await mockApiService.createAdvisorCase({
        userId: user?.id,
        ...newCase,
      });

      if (result) {
        setSuccess('諮詢案件提交成功');
        setShowNewCaseModal(false);
        // 重新載入案件
        await loadAdvisorCases();
        // 重置表單
        setNewCase({
          type: '',
          subject: '',
          description: '',
          priority: 'normal',
        });
      } else {
        setError('提交失敗，請稍後再試');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
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
</div>
      </header>

      <MainNav />

      <div className="mx-auto w-full max-w-[1540px] px-5 pb-8 md:px-8">
        <div className="flex justify-between items-center mt-8 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#0f2240] mb-2">顧問諮詢</h1>
            <p className="text-[#637082]">專業顧問一對一諮詢服務</p>
          </div>
          <button
            onClick={() => setShowNewCaseModal(true)}
            className="px-6 py-3 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            新增諮詢案件
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

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#dff4f0] rounded-full flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#0f2240]">總案件數</h3>
                <p className="text-3xl font-bold text-[#087e74]">2</p>
              </div>
            </div>
            <p className="text-sm text-[#637082]">您的歷史諮詢記錄</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#dff4f0] rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#0f2240]">處理中</h3>
                <p className="text-3xl font-bold text-[#087e74]">1</p>
              </div>
            </div>
            <p className="text-sm text-[#637082]">正在處理的案件</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#dff4f0] rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#0f2240]">已完成</h3>
                <p className="text-3xl font-bold text-[#087e74]">1</p>
              </div>
            </div>
            <p className="text-sm text-[#637082]">已解決的案件</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] overflow-hidden">
          <div className="p-6 border-b border-[#d9e7e5]">
            <h2 className="text-xl font-bold text-[#0f2240]">諮詢案件記錄</h2>
          </div>
          <div className="overflow-x-auto md:overflow-visible">
            <table className="w-full mobile-card-table">
              <thead className="bg-[#f8fbfa] border-b border-[#d9e7e5] hidden md:table-header-group">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">案件編號</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">日期</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">類型</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">主旨</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">優先級</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">負責顧問</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">狀態</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">操作</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((caseItem) => (
                  <tr key={caseItem.id} className="border-b border-[#d9e7e5] hover:bg-gray-50 md:table-row">
                    <td data-label="案件編號" className="px-6 py-4 text-sm text-[#0f2240] font-medium">{caseItem.id}</td>
                    <td data-label="日期" className="px-6 py-4 text-sm text-[#637082]">{caseItem.date}</td>
                    <td data-label="類型" className="px-6 py-4 text-sm text-[#0f2240]">{caseItem.type}</td>
                    <td data-label="主旨" className="px-6 py-4 text-sm text-[#0f2240] max-w-xs truncate md:max-w-xs md:truncate">{caseItem.subject}</td>
                    <td data-label="優先級" className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        caseItem.priority === '高' 
                          ? 'bg-[#fff7ed] text-[#c45b2b]' 
                          : 'bg-[#e7f1fa] text-[#32617f]'
                      }`}>
                        {caseItem.priority}
                      </span>
                    </td>
                    <td data-label="負責顧問" className="px-6 py-4 text-sm text-[#637082]">{caseItem.advisor}</td>
                    <td data-label="狀態" className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        caseItem.status === '處理中' 
                          ? 'bg-[#fff7ed] text-[#c45b2b]' 
                          : caseItem.status === '已完成'
                          ? 'bg-[#e7f1fa] text-[#32617f]'
                          : 'bg-[#fef3c7] text-[#92400e]'
                      }`}>
                        {caseItem.status}
                      </span>
                    </td>
                    <td data-label="操作" className="px-6 py-4">
                      <button className="text-[#087e74] font-semibold hover:underline text-sm">
                        查看詳情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-8 mt-8">
          <h2 className="text-2xl font-bold text-[#0f2240] mb-4">什麼時候需要顧問諮詢？</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-[#f8fbfa] rounded-lg">
              <h3 className="font-semibold text-[#0f2240] mb-2">💊 用藥相關</h3>
              <p className="text-sm text-[#637082]">正在服用其他藥物，擔心相互作用或有用藥疑問。</p>
            </div>
            <div className="p-4 bg-[#f8fbfa] rounded-lg">
              <h3 className="font-semibold text-[#0f2240] mb-2">⚠️ 使用後不適</h3>
              <p className="text-sm text-[#637082]">服用後出現任何不適症狀，需要專業建議。</p>
            </div>
            <div className="p-4 bg-[#f8fbfa] rounded-lg">
              <h3 className="font-semibold text-[#0f2240] mb-2">🏥 特殊疾病</h3>
              <p className="text-sm text-[#637082]">有特殊疾病或健康狀況，需要個別化建議。</p>
            </div>
            <div className="p-4 bg-[#f8fbfa] rounded-lg">
              <h3 className="font-semibold text-[#0f2240] mb-2">📋 報告異常</h3>
              <p className="text-sm text-[#637082]">健康檢查報告有異常，希望專業解讀。</p>
            </div>
          </div>
        </div>
      </div>

      {showNewCaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#0f2240] mb-4">新增諮詢案件</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  案件類型
                </label>
                <select
                  value={newCase.type}
                  onChange={(e) => setNewCase({ ...newCase, type: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] ${
                    fieldErrors.type ? 'border-red-300' : 'border-[#d9e7e5]'
                  }`}
                >
                  <option value="">請選擇案件類型</option>
                  <option value="discomfort">使用後不適</option>
                  <option value="medication">用藥疑問</option>
                  <option value="disease">特殊疾病諮詢</option>
                  <option value="report">報告異常</option>
                  <option value="other">其他問題</option>
                </select>
                {fieldErrors.type && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  主旨
                </label>
                <input
                  type="text"
                  value={newCase.subject}
                  onChange={(e) => setNewCase({ ...newCase, subject: e.target.value })}
                  placeholder="簡單描述您的問題"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] ${
                    fieldErrors.subject ? 'border-red-300' : 'border-[#d9e7e5]'
                  }`}
                />
                {fieldErrors.subject && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.subject}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  詳細描述
                </label>
                <textarea
                  value={newCase.description}
                  onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                  placeholder="請詳細描述您的情況、症狀或疑問"
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] ${
                    fieldErrors.description ? 'border-red-300' : 'border-[#d9e7e5]'
                  }`}
                />
                {fieldErrors.description && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  優先級
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="low"
                      checked={newCase.priority === 'low'}
                      onChange={(e) => setNewCase({ ...newCase, priority: e.target.value })}
                      className="mr-2"
                    />
                    <span className="text-sm text-[#0f2240]">低</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="normal"
                      checked={newCase.priority === 'normal'}
                      onChange={(e) => setNewCase({ ...newCase, priority: e.target.value })}
                      className="mr-2"
                    />
                    <span className="text-sm text-[#0f2240]">中</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="high"
                      checked={newCase.priority === 'high'}
                      onChange={(e) => setNewCase({ ...newCase, priority: e.target.value })}
                      className="mr-2"
                    />
                    <span className="text-sm text-[#0f2240]">高</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowNewCaseModal(false)}
                disabled={isLoading}
                className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                取消
              </button>
              <button
                onClick={handleSubmitCase}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#008f83] to-[#006d67] text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '提交中...' : '提交案件'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}