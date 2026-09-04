'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockApiService, mockHealthRecords } from '@/lib/mock-data';
import { validateHealthReport, getErrorMessage } from '@/lib/validation';
import MainNav from '../components/MainNav';

export default function HealthPage() {
  const { user } = useAuth();
  const [healthRecords, setHealthRecords] = useState(mockHealthRecords);
  const [isLoading, setIsLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reportData, setReportData] = useState({
    sleep: '',
    energy: '',
    digestion: '',
    discomfort: '',
    notes: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // 加載用戶健康記錄
  useEffect(() => {
    if (user) {
      loadHealthRecords();
    }
  }, [user]);

  const loadHealthRecords = async () => {
    setIsLoading(true);
    try {
      const records = await mockApiService.getHealthRecords(user?.id);
      setHealthRecords(records);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReport = async () => {
    setError('');
    setSuccess('');
    setFieldErrors({});

    // 驗證表單
    const validation = validateHealthReport(reportData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await mockApiService.createHealthRecord({
        userId: user?.id,
        type: 'daily',
        status: 'stable',
        ...reportData,
        notes: reportData.notes || `${reportData.sleep}睡眠, ${reportData.energy}精神, ${reportData.digestion}腸胃`,
      });

      if (result) {
        setSuccess('健康回報提交成功');
        setShowReportModal(false);
        // 重新載入記錄
        await loadHealthRecords();
        // 重置表單
        setReportData({
          sleep: '',
          energy: '',
          digestion: '',
          discomfort: '',
          notes: '',
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
            <h1 className="text-3xl font-bold text-[#0f2240] mb-2">健康記錄</h1>
            <p className="text-[#637082]">追蹤您的健康狀況與使用進度</p>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="px-6 py-3 bg-[#087e74] text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            新增健康回報
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
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#0f2240]">連續服用天數</h3>
                <p className="text-3xl font-bold text-[#087e74]">7 天</p>
              </div>
            </div>
            <p className="text-sm text-[#637082]">持續服用有助於達到最佳效果</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#dff4f0] rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#0f2240]">今日狀態</h3>
                <p className="text-xl font-bold text-[#087e74]">穩定良好</p>
              </div>
            </div>
            <p className="text-sm text-[#637082]">最近7天狀況穩定</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#dff4f0] rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#0f2240]">健康目標</h3>
                <p className="text-xl font-bold text-[#087e74]">提升免疫力</p>
              </div>
            </div>
            <p className="text-sm text-[#637082]">根據初始評估設定</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-[#d9e7e5] overflow-hidden">
          <div className="p-6 border-b border-[#d9e7e5]">
            <h2 className="text-xl font-bold text-[#0f2240]">健康回報記錄</h2>
          </div>
          <div className="overflow-x-auto md:overflow-visible">
            <table className="w-full mobile-card-table">
              <thead className="bg-[#f8fbfa] border-b border-[#d9e7e5] hidden md:table-header-group">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">日期</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">類型</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">狀態</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">備註</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0f2240]">操作</th>
                </tr>
              </thead>
              <tbody>
                {healthRecords.map((record) => (
                  <tr key={record.id} className="border-b border-[#d9e7e5] hover:bg-gray-50 md:table-row">
                    <td data-label="日期" className="px-6 py-4 text-sm text-[#0f2240]">{record.date}</td>
                    <td data-label="類型" className="px-6 py-4 text-sm text-[#637082]">{record.type}</td>
                    <td data-label="狀態" className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        record.status === '穩定' || record.status === '已完成'
                          ? 'bg-[#e7f1fa] text-[#32617f]' 
                          : 'bg-[#fff7ed] text-[#c45b2b]'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td data-label="備註" className="px-6 py-4 text-sm text-[#637082] max-w-xs truncate md:max-w-xs md:truncate">{record.notes}</td>
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
          <h2 className="text-2xl font-bold text-[#0f2240] mb-4">健康追蹤建議</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-[#f8fbfa] rounded-lg">
              <h3 className="font-semibold text-[#0f2240] mb-2">📅 定期回報</h3>
              <p className="text-sm text-[#637082]">建議每週至少回報一次健康狀況，讓我們更好地了解您的使用效果。</p>
            </div>
            <div className="p-4 bg-[#f8fbfa] rounded-lg">
              <h3 className="font-semibold text-[#0f2240] mb-2">💊 按時服用</h3>
              <p className="text-sm text-[#637082]">持續按時服用有助於達到最佳保健效果，建議設定每日提醒。</p>
            </div>
            <div className="p-4 bg-[#f8fbfa] rounded-lg">
              <h3 className="font-semibold text-[#0f2240] mb-2">🥗 生活作息</h3>
              <p className="text-sm text-[#637082]">良好的睡眠、飲食和運動習慣能增強保健效果。</p>
            </div>
            <div className="p-4 bg-[#f8fbfa] rounded-lg">
              <h3 className="font-semibold text-[#0f2240] mb-2">🩺 專業諮詢</h3>
              <p className="text-sm text-[#637082]">如有任何不適或疑問，隨時可以聯繫我們的專業顧問。</p>
            </div>
          </div>
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#0f2240] mb-4">新增健康回報</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  睡眠品質
                </label>
                <select
                  value={reportData.sleep}
                  onChange={(e) => setReportData({ ...reportData, sleep: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] ${
                    fieldErrors.sleep ? 'border-red-300' : 'border-[#d9e7e5]'
                  }`}
                >
                  <option value="">請選擇</option>
                  <option value="excellent">非常好</option>
                  <option value="good">良好</option>
                  <option value="fair">普通</option>
                  <option value="poor">不佳</option>
                </select>
                {fieldErrors.sleep && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.sleep}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  精神狀態
                </label>
                <select
                  value={reportData.energy}
                  onChange={(e) => setReportData({ ...reportData, energy: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] ${
                    fieldErrors.energy ? 'border-red-300' : 'border-[#d9e7e5]'
                  }`}
                >
                  <option value="">請選擇</option>
                  <option value="excellent">非常有精神</option>
                  <option value="good">精神良好</option>
                  <option value="fair">普通</option>
                  <option value="poor">疲勞</option>
                </select>
                {fieldErrors.energy && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.energy}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  腸胃狀況
                </label>
                <select
                  value={reportData.digestion}
                  onChange={(e) => setReportData({ ...reportData, digestion: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74] ${
                    fieldErrors.digestion ? 'border-red-300' : 'border-[#d9e7e5]'
                  }`}
                >
                  <option value="">請選擇</option>
                  <option value="excellent">正常</option>
                  <option value="good">良好</option>
                  <option value="fair">輕微不適</option>
                  <option value="poor">明顯不適</option>
                </select>
                {fieldErrors.digestion && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.digestion}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  是否有不適症狀
                </label>
                <textarea
                  value={reportData.discomfort}
                  onChange={(e) => setReportData({ ...reportData, discomfort: e.target.value })}
                  placeholder="如有不適請詳細描述"
                  rows={3}
                  className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0f2240] mb-2">
                  其他備註
                </label>
                <textarea
                  value={reportData.notes}
                  onChange={(e) => setReportData({ ...reportData, notes: e.target.value })}
                  placeholder="其他想分享的狀況或問題"
                  rows={3}
                  className="w-full px-4 py-3 border border-[#d9e7e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087e74]"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowReportModal(false)}
                disabled={isLoading}
                className="flex-1 px-6 py-3 border border-[#d9e7e5] text-[#0f2240] rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                取消
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#008f83] to-[#006d67] text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '提交中...' : '提交回報'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}