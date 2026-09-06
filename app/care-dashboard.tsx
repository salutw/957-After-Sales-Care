'use client';

import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const onboardingSteps = [
  {
    title: '綁定 LINE',
    text: '接收關懷回覆、提醒與追蹤通知。',
    action: '開始綁定',
    icon: 'LINE',
    color: '#06c755',
  },
  {
    title: '手機驗證',
    text: '確認購買人身份，保護會員權益。',
    action: '手機驗證',
    icon: 'TEL',
    color: '#008f7a',
  },
  {
    title: '訂單歸戶',
    text: '比對購買記錄並啟用售後服務。',
    action: '訂單歸戶',
    icon: 'DOC',
    color: '#ff8a5c',
  },
  {
    title: 'AI 初始評估',
    text: '建立基礎健康檔案，協助後續關懷與建議。',
    action: '開始評估',
    icon: 'AI',
    color: '#8b5cf6',
  },
];

const timeline = ['服用提醒', '計畫追蹤', '數據記錄', '專業關懷'];
const aiQuestions = [
  '最近 7 天是否都有依建議服用？',
  '睡眠、精神或腸胃狀況有明顯變化嗎？',
  '是否出現任何不適，或希望顧問優先協助的問題？',
];
const intakeQuestions = [
  '目前主要保養目標是什麼？',
  '最近睡眠、精神與日常作息狀況如何？',
  '是否有固定用藥、特殊疾病或希望顧問留意的狀況？',
];
const assistantExamples = ['一般食用方式', '進階使用方式', '建議搭配商品'];
const assistantAnswer =
  '可以的。關於 957 牛樟芝，AI 小助理會先依商品資料庫提供一般食用方式，例如建議服用時段、每日建議量與注意事項；若你想了解進階使用，會再參考會員訂單、使用天數、近期健康回報與生活作息，整理更貼近你的使用建議。若問題涉及搭配商品，正式版會由後台商品資料與 AI 分析規則比對你的需求，提供可參考的搭配方向。';

function ProductScene({ compact = false, imageUrl }: { compact?: boolean; imageUrl?: string }) {
  if (imageUrl) {
    return (
      <div className={compact ? 'product-image-container compact' : 'product-image-container'}>
        <img src={imageUrl} alt="產品圖" className="uploaded-product-image" />
        <div className="image-glow" />
      </div>
    );
  }
  return (
    <div className={compact ? 'product-scene compact' : 'product-scene'}>
      <div className="marble-stand" />
      <div className="product-box">
        <span>957</span>
        <small>牛樟芝</small>
      </div>
      <div className="product-bottle">
        <div className="cap" />
        <span>957</span>
        <small>牛樟芝</small>
      </div>
      <i className="leaf leaf-one" />
      <i className="leaf leaf-two" />
    </div>
  );
}

function PillIcon({ label }: { label: string }) {
  return <span className="pill-icon">{label}</span>;
}

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isPhoneVerified, isLineBound, isOrderLinked, isAiAssessed, setAiAssessed } = useAuth();
  
  const [completed, setCompleted] = useState(0);
  const [panel, setPanel] = useState<'none' | 'intake' | 'health' | 'advisor'>('none');
  const [assistantQuery, setAssistantQuery] = useState('我想了解 957 牛樟芝怎麼使用？');
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [homepageImage, setHomepageImage] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productData, setProductData] = useState<any>(null);
  const [homepageTitle, setHomepageTitle] = useState('你的售後健康服務已準備好');
  const [homepageSubtitle, setHomepageSubtitle] = useState('完成身份與訂單確認後，這裡會整理商品使用方式、每日計畫、健康追蹤與顧問服務。');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'user', text: '我想了解 957 牛樟芝怎麼使用？' },
    { role: 'ai', text: '可以的，關於 957 牛樟芝，AI 小助理會先依商品資料庫提供一般食用方式、進階使用方式與建議搭配商品。' },
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    const savedImage = localStorage.getItem('homepageProductImage');
    const savedTitle = localStorage.getItem('homepageTitle');
    const savedSubtitle = localStorage.getItem('homepageSubtitle');
    if (savedImage) setHomepageImage(savedImage);
    if (savedTitle) setHomepageTitle(savedTitle);
    if (savedSubtitle) setHomepageSubtitle(savedSubtitle);

    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        const products = JSON.parse(savedProducts);
        if (products.length > 0) {
          setProductData(products[0]);
          if (products[0].image) {
            setProductImage(products[0].image);
          }
        }
      } catch (error) {
        console.error('Failed to parse products:', error);
      }
    }
  }, []);
  
  // 計算完成進度，根據各個步驟的完成狀態
  const effectiveCompleted = useMemo(() => {
    let count = 0;
    if (isPhoneVerified) count++;
    if (isLineBound) count++;
    if (isOrderLinked) count++;
    if (isAiAssessed) count++;
    return count;
  }, [isPhoneVerified, isLineBound, isOrderLinked, isAiAssessed]);
  
  const progress = useMemo(() => effectiveCompleted * 25, [effectiveCompleted]);
  const isActivated = effectiveCompleted >= 4;

  // 如果用戶未認證，重定向到登入頁面
  if (!isLoading && !isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  const handlePrimaryStart = () => {
    window.location.href = '/profile';
  };

  const handleStepClick = (index: number) => {
    if (index === 0) {
      if (isLineBound) return;
      window.location.href = '/profile?showLineBinding=true';
      return;
    }
    if (index === 1) {
      if (isPhoneVerified) return;
      window.location.href = '/auth/login';
      return;
    }
    if (index === 2) {
      if (isOrderLinked) return;
      window.location.href = '/orders?showAddModal=true';
      return;
    }
    if (index === 3) {
      if (isAiAssessed) return;
      setCompleted((value) => Math.max(value, 4));
      setPanel('intake');
      return;
    }
    setCompleted((value) => Math.max(value, index + 1));
  };

  const handleShowUsage = () => {
    setShowUsageModal(true);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { role: 'user', text: chatInput }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'ai', text: assistantAnswer }]);
    }, 500);
  };

  const getStepStatus = (index: number) => {
    switch (index) {
      case 0: return isLineBound;
      case 1: return isPhoneVerified;
      case 2: return isOrderLinked;
      case 3: return isAiAssessed;
      default: return false;
    }
  };

  return (
    <main className="min-h-screen bg-[#f7fbfa] text-[#0f2240]">
      {/* Header */}
      <header className="bg-white border-b border-[#d9e7e5] sticky top-0 z-50">
        <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#008f7a] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">957</span>
            </div>
            <div>
              <strong className="text-xl font-bold text-[#063b59]">957 After-Sales Care</strong>
              <p className="text-xs text-[#637082]">用關心，陪你更健康</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: '首頁', href: '/' },
              { label: '訂單管理', href: '/orders' },
              { label: '健康記錄', href: '/health' },
              { label: '顧問諮詢', href: '/advisor' },
              { label: '個人資料', href: '/profile' },
              { label: '管理後台', href: '/admin' },
            ].map((item) => {
              const isActive = item.href === '/' ? true : false;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold transition ${
                    isActive
                      ? 'text-[#008f7a]'
                      : 'text-[#637082] hover:text-[#008f7a]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-[#f8fbfa] border border-[#d9e7e5] flex items-center justify-center text-[#637082] hover:bg-[#dff4f0] transition">
              <span className="text-lg">🔔</span>
            </button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = '/profile'}>
              <div className="w-10 h-10 bg-[#008f7a] rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || '會'}
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-[#0f2240]">{user?.name || '會員'}</span>
              <span className="text-[#637082]">⌄</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 pb-8 md:px-8">

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f7fbfa] via-white to-[#e8f8f3] border border-[#d9e7e5]">
          <div className="grid lg:grid-cols-3 gap-8 p-8 md:p-12">
            {/* Left Content */}
            <div className="lg:col-span-1 flex flex-col justify-center">
              <p className="text-sm font-semibold text-[#008f7a] tracking-wider mb-2">CARE EVERYDAY, A BETTER TOMORROW</p>
              <h1 className="text-4xl md:text-5xl font-bold text-[#063b59] mb-4 leading-tight">
                你的售後健康服務<br />我們一直都在
              </h1>
              <p className="text-lg text-[#637082] mb-8 leading-relaxed">
                完成身份綁定與服務設定，這裡會整理由你你使用方式、<br />
                每日計畫、健康追蹤與專屬關懷服務。
              </p>
              <div className="flex gap-4 mb-8">
                <button
                  className="px-8 py-4 bg-[#008f7a] text-white rounded-xl font-semibold text-lg hover:opacity-90 transition flex items-center gap-2 shadow-lg"
                  onClick={handlePrimaryStart}
                >
                  開始設定 <span>→</span>
                </button>
                <button className="px-8 py-4 border-2 border-[#008f7a] text-[#008f7a] rounded-xl font-semibold text-lg hover:bg-[#dff4f0] transition flex items-center gap-2">
                  了解更多 <span className="w-5 h-5 rounded-full bg-[#008f7a] text-white flex items-center justify-center text-xs">▶</span>
                </button>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#dff4f0] flex items-center justify-center text-[#008f7a]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#063b59]">專業團隊把關</p>
                    <p className="text-xs text-[#637082]">安心有保障</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#dff4f0] flex items-center justify-center text-[#008f7a]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#063b59]">持續關懷服務</p>
                    <p className="text-xs text-[#637082]">陪伴每一天</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#dff4f0] flex items-center justify-center text-[#008f7a]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#063b59]">用科學守護健康</p>
                    <p className="text-xs text-[#637082]">打造更好的自己</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle - Product Image */}
            <div className="lg:col-span-1 relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-[#e8f8f3] to-white rounded-full opacity-60" />
              </div>
              {homepageImage ? (
                <div className="relative z-10 flex flex-col items-center">
                  <img src={homepageImage} alt="產品圖" className="max-h-72 object-contain rounded-2xl shadow-2xl mb-4" />
                  <div className="bg-white/80 backdrop-blur rounded-full px-4 py-2 shadow-lg flex flex-wrap justify-center gap-3">
                    <span className="text-xs font-semibold text-[#008f7a] flex items-center gap-1">✓ 調節機能</span>
                    <span className="text-xs font-semibold text-[#008f7a] flex items-center gap-1">✓ 增強保護力</span>
                    <span className="text-xs font-semibold text-[#008f7a] flex items-center gap-1">✓ 每日健康守護</span>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 product-scene">
                  <div className="marble-stand" />
                  <div className="product-box">
                    <span>957</span>
                    <small>牛樟芝</small>
                  </div>
                  <div className="product-bottle">
                    <div className="cap" />
                    <span>957</span>
                    <small>牛樟芝</small>
                  </div>
                  <i className="leaf leaf-one" />
                  <i className="leaf leaf-two" />
                </div>
              )}
            </div>

            {/* Right - Progress Card */}
            <div className="lg:col-span-1 flex items-center">
              <div className="bg-white rounded-3xl border border-[#d9e7e5] p-6 w-full shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#e8f8f3] flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#008f7a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <span className="font-semibold text-[#063b59]">啟用進度</span>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="#e8f8f3" strokeWidth="12" fill="none" />
                      <circle cx="64" cy="64" r="56" stroke="#008f7a" strokeWidth="12" fill="none" strokeDasharray={`${2 * Math.PI * 56}`} strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-[#063b59]">{progress}%</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-[#637082] mb-2">
                  {isActivated ? '已完成' : `已完成 ${effectiveCompleted}/4 個步驟`}
                </p>
                <p className="text-center text-sm font-semibold text-[#063b59] mb-4">
                  {isActivated ? '太棒了！你的售後健康服務已準備就緒' : '完成步驟即可啟用服務'}
                </p>
                <button className="w-full py-3 border-2 border-[#008f7a] text-[#008f7a] rounded-xl font-semibold hover:bg-[#dff4f0] transition">
                  查看我的設定 →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Onboarding Steps */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {onboardingSteps.map((step, index) => {
            const isStepCompleted = getStepStatus(index);
            const iconColors = ['bg-[#06c755]', 'bg-[#3b82f6]', 'bg-[#ff8a5c]', 'bg-[#8b5cf6]'];
            const iconBgs = ['bg-[#e7f9f0]', 'bg-[#eff6ff]', 'bg-[#fff7ed]', 'bg-[#f3f0ff]'];
            return (
              <article 
                className={`bg-white rounded-2xl border-2 p-6 cursor-pointer transition hover:shadow-lg ${
                  isStepCompleted ? 'border-[#008f7a] bg-[#f0faf8]' : 'border-[#d9e7e5]'
                }`}
                key={step.title}
                onClick={() => handleStepClick(index)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${iconBgs[index]} flex items-center justify-center`}>
                    <span className={`text-lg font-bold ${iconColors[index].replace('bg-', 'text-')}`}>{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  {isStepCompleted && (
                    <span className="w-6 h-6 rounded-full bg-[#008f7a] text-white flex items-center justify-center text-sm">✓</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#063b59] mb-2">{step.title}</h3>
                <p className="text-sm text-[#637082] mb-4">{step.text}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${isStepCompleted ? 'text-[#008f7a]' : 'text-[#637082]'}`}>
                    {isStepCompleted ? '已完成' : '待完成'}
                  </span>
                  {!isStepCompleted && (
                    <span className="text-sm text-[#008f7a] font-semibold">{step.action} →</span>
                  )}
                </div>
              </article>
            );
          })}
        </section>

        {/* Product & Daily Plan */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* Product Card */}
          <article className="bg-white rounded-3xl border border-[#d9e7e5] p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-[#e8f8f3] text-[#008f7a] rounded-full text-xs font-semibold">我的商品</span>
            </div>
            <div className="flex gap-6">
              <div className="w-32 h-32 flex-shrink-0">
                {productImage ? (
                  <img src={productImage} alt="商品圖" className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <div className="w-full h-full bg-[#e8f8f3] rounded-xl flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <span className="inline-block px-2 py-1 bg-[#e8f8f3] text-[#008f7a] rounded text-xs font-semibold mb-2">已完成啟用</span>
                <h3 className="text-xl font-bold text-[#063b59] mb-2">{productData?.name || '957 牛樟芝精華膠囊'}</h3>
                <p className="text-sm text-[#637082] mb-4">已為你整理由相關健康保健建議，完成帳戶後即可開始。</p>
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-1 text-xs text-[#637082]">
                    <span className="w-4 h-4 rounded-full bg-[#e8f8f3] flex items-center justify-center text-[#008f7a]">✓</span>
                    日常保健
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#637082]">
                    <span className="w-4 h-4 rounded-full bg-[#e8f8f3] flex items-center justify-center text-[#008f7a]">✓</span>
                    調節機能
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#637082]">
                    <span className="w-4 h-4 rounded-full bg-[#e8f8f3] flex items-center justify-center text-[#008f7a]">✓</span>
                    增強保護力
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#f8fbfa] rounded-lg p-3">
                    <small className="text-xs text-[#637082]">建議時機</small>
                    <p className="text-sm font-semibold text-[#063b59]">{productData?.usage?.suggestedTime || '早餐後、晚餐後'}</p>
                  </div>
                  <div className="bg-[#f8fbfa] rounded-lg p-3">
                    <small className="text-xs text-[#637082]">間隔時間</small>
                    <p className="text-sm font-semibold text-[#063b59]">{productData?.usage?.interval || '至少 120 分鐘'}</p>
                  </div>
                </div>
                <button className="w-full py-3 bg-[#008f7a] text-white rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2" onClick={handleShowUsage}>
                  查看使用方式 →
                </button>
              </div>
            </div>
          </article>

          {/* Daily Plan Card */}
          <article className="bg-white rounded-3xl border border-[#d9e7e5] p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-[#e8f8f3] text-[#008f7a] rounded-full text-xs font-semibold">今日計畫</span>
            </div>
            <h3 className="text-xl font-bold text-[#063b59] mb-2">每日使用提醒</h3>
            <p className="text-sm text-[#637082] mb-6">設定開始使用日後，今日計畫會自動產生。</p>
            <button className="w-full py-3 bg-[#008f7a] text-white rounded-xl font-semibold hover:opacity-90 transition mb-6 flex items-center justify-center gap-2">
              查看今日計畫 →
            </button>
            <div className="grid grid-cols-4 gap-3">
              {timeline.map((item) => (
                <div key={item} className="text-center">
                  <div className="w-12 h-12 mx-auto bg-[#e8f8f3] rounded-xl flex items-center justify-center mb-2">
                    <span className="text-lg">⏰</span>
                  </div>
                  <p className="text-xs font-semibold text-[#063b59]">{item}</p>
                  <p className="text-xs text-[#637082] mt-1">
                    {item === '服用提醒' ? '不錯過每日進度' : 
                     item === '計畫追蹤' ? '掌握每日狀況' :
                     item === '數據記錄' ? '記錄健康數據' : '顧問全程陪伴'}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* AI Assistant & Chat & Health Tracking */}
        <section className="grid md:grid-cols-3 gap-6">
          {/* AI Product Assistant */}
          <article className="bg-white rounded-3xl border border-[#d9e7e5] p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-[#e8f8f3] text-[#008f7a] rounded-full text-xs font-semibold">AI 商品小助手</span>
            </div>
            <h3 className="text-xl font-bold text-[#063b59] mb-2">想了解商品<br />怎麼使用？</h3>
            <p className="text-sm text-[#637082] mb-6">使用者可以直接詢問商品問題，由 AI 小助手在回覆中說明一般食用方式，並結合官方資料提供完整說明。</p>
            <div className="flex flex-wrap gap-2">
              {assistantExamples.map((example) => (
                <span key={example} className="px-4 py-2 bg-[#e8f8f3] text-[#008f7a] rounded-full text-sm font-semibold cursor-pointer hover:bg-[#d0ede5] transition">
                  {example}
                </span>
              ))}
            </div>
          </article>

          {/* AI Chat */}
          <article className="bg-white rounded-3xl border border-[#d9e7e5] p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#008f7a] flex items-center justify-center text-white font-bold text-sm">AI</div>
              <h3 className="text-lg font-bold text-[#063b59]">AI 智能問答</h3>
            </div>
            <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-[#008f7a] text-white' 
                      : 'bg-[#f8fbfa] text-[#0f2240]'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="輸入你的問題..."
                className="flex-1 px-4 py-3 border border-[#d9e7e5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008f7a]"
              />
              <button 
                onClick={handleSendMessage}
                className="w-12 h-12 bg-[#008f7a] text-white rounded-xl flex items-center justify-center hover:opacity-90 transition"
              >
                →
              </button>
            </div>
          </article>

          {/* Health Tracking */}
          <article className="bg-white rounded-3xl border border-[#d9e7e5] p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-[#e8f8f3] text-[#008f7a] rounded-full text-xs font-semibold">7 Day 健康追蹤</span>
            </div>
            <h3 className="text-xl font-bold text-[#063b59] mb-2">最近 7 天，<br />您的狀況如何？</h3>
            <p className="text-sm text-[#637082] mb-6">持續回報有助於我們提供更精準的關懷與建議。</p>
            
            {/* Simple Chart */}
            <div className="h-32 mb-6 flex items-end justify-between gap-1">
              {[40, 60, 45, 70, 55, 80, 65].map((height, idx) => (
                <div key={idx} className="flex-1 bg-gradient-to-t from-[#008f7a] to-[#00a896] rounded-t-lg" style={{ height: `${height}%` }} />
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                className="py-4 bg-[#e8f8f3] text-[#008f7a] rounded-xl font-semibold hover:bg-[#d0ede5] transition flex flex-col items-center gap-1"
                onClick={() => { setPanel('health'); setTimeout(() => window.location.href = '/health', 500); }}
              >
                <span className="text-lg">✓</span>
                <span>狀況穩定</span>
                <span className="text-xs font-normal">一切都很好</span>
              </button>
              <button 
                className="py-4 bg-[#fff7ed] text-[#c45b2b] rounded-xl font-semibold hover:bg-[#ffe8d6] transition flex flex-col items-center gap-1"
                onClick={() => { setPanel('health'); setTimeout(() => window.location.href = '/health', 500); }}
              >
                <span className="text-lg">♡</span>
                <span>我有不適</span>
                <span className="text-xs font-normal">需要協助</span>
              </button>
            </div>
          </article>
        </section>

        {/* Consultant CTA */}
        <section className="bg-gradient-to-br from-[#008f7a] to-[#006d67] rounded-3xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">需要專人協助嗎？</h2>
              <p className="text-[#cff3e8] mb-6 leading-relaxed">
                若有用藥、特殊疾病、報告異常或使用後不適，<br />
                建議透過此處聯繫顧問，我們將盡快為您服務。
              </p>
              <button 
                className="px-8 py-4 bg-white text-[#008f7a] rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2"
                onClick={() => setPanel('advisor')}
              >
                送出顧問諮詢 →
              </button>
            </div>
            <div className="flex justify-end gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">👨‍⚕️</span>
                </div>
                <p className="font-semibold">專業顧問團隊</p>
                <p className="text-sm text-[#cff3e8]">一對一個人化建議</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">🔒</span>
                </div>
                <p className="font-semibold">隱私保護</p>
                <p className="text-sm text-[#cff3e8]">資料安全有保障</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">❤️</span>
                </div>
                <p className="font-semibold">貼心服務</p>
                <p className="text-sm text-[#cff3e8]">讓您健康安心</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white rounded-3xl border border-[#d9e7e5] p-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#008f7a] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">957</span>
              </div>
              <div>
                <p className="font-bold text-[#063b59]">957 After-Sales Care</p>
                <p className="text-sm text-[#637082]">用關心，陪你更健康</p>
              </div>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-[#637082] hover:text-[#008f7a] transition">關於我們</a>
              <a href="#" className="text-[#637082] hover:text-[#008f7a] transition">隱私權政策</a>
              <a href="#" className="text-[#637082] hover:text-[#008f7a] transition">服務條款</a>
              <a href="#" className="text-[#637082] hover:text-[#008f7a] transition">聯絡我們</a>
            </div>
            <p className="text-sm text-[#637082]">© 2026 957 After-Sales Care. 版權所有</p>
          </div>
        </footer>
      </div>

      {/* Floating Panel */}
      <aside className={panel === 'none' ? 'floating-panel hidden' : 'floating-panel'}>
        <button className="close-button" onClick={() => setPanel('none')} aria-label="關閉">
          ×
        </button>
        {panel === 'intake' ? (
          <>
            <div className="section-pill">AI 初始評估</div>
            <h2>建立基礎檔案</h2>
            <p>Demo 版先呈現 AI 問答流程。正式版會將回覆寫入會員基礎檔案，供商品建議、健康追蹤與顧問派單使用。</p>
            <div className="question-stack">
              {intakeQuestions.map((question, index) => (
                <label key={question}>
                  <span>{index + 1}. {question}</span>
                  <input placeholder="請輸入回覆" />
                </label>
              ))}
            </div>
            <button
              className="primary-button full"
              onClick={() => {
                setCompleted(4);
                setPanel('none');
                setAiAssessed(true);
              }}
            >
              完成評估並啟用服務
            </button>
          </>
        ) : panel === 'health' ? (
          <>
            <div className="section-pill">AI 健康問答表單</div>
            <h2>健康回報</h2>
            <p>Demo 版先呈現問答流程，正式版會寫入會員健康紀錄並觸發顧問派單規則。</p>
            <div className="question-stack">
              {aiQuestions.map((question, index) => (
                <label key={question}>
                  <span>{index + 1}. {question}</span>
                  <input placeholder="請輸入回覆" />
                </label>
              ))}
            </div>
            <button className="primary-button full">送出回報</button>
          </>
        ) : (
          <>
            <div className="section-pill">後台派單預覽</div>
            <h2>顧問諮詢</h2>
            <p>提交後可形成後台案件，依產品、症狀、緊急程度與會員資料分派給顧問。</p>
            <div className="ticket-preview">
              <span>案件類型：使用後不適 / 用藥疑問</span>
              <span>會員來源：隨貨 QR-code</span>
              <span>資料來源：蝦皮訂單 Excel 匯入</span>
            </div>
            <button className="primary-button full">建立諮詢案件</button>
          </>
        )}
      </aside>

      {/* Usage Modal */}
      {showUsageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#0f2240] mb-4">{productData?.name || '957 牛樟芝精華膠囊'}使用方式</h2>
            
            <div className="space-y-6">
              <div className="bg-[#f8fbfa] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2240] mb-3">基本資訊</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#637082] mb-1">建議使用時段</label>
                    <p className="text-[#0f2240]">{productData?.usage?.suggestedTime || '早餐後、晚餐後'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#637082] mb-1">每次用量</label>
                    <p className="text-[#0f2240]">{productData?.usage?.dosage || '1-2 顆'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#637082] mb-1">用藥間隔</label>
                    <p className="text-[#0f2240]">{productData?.usage?.interval || '至少 120 分鐘'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#637082] mb-1">每日總量</label>
                    <p className="text-[#0f2240]">{productData?.usage?.dailyMax || '不超過 4 顆'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#f8fbfa] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2240] mb-3">使用注意事項</h3>
                <ul className="space-y-2 text-[#0f2240]">
                  {productData?.warnings?.map((warning: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#008f7a] mt-1">•</span>
                      <span>{warning}</span>
                    </li>
                  )) || (
                    <>
                      <li className="flex items-start gap-2">
                        <span className="text-[#008f7a] mt-1">•</span>
                        <span>請用溫開水送服，避免空腹服用</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#008f7a] mt-1">•</span>
                        <span>建議飯後 30 分鐘內服用</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#008f7a] mt-1">•</span>
                        <span>與其他藥物間隔至少 2 小時</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#008f7a] mt-1">•</span>
                        <span>孕期、哺乳期或特殊疾病者請諮詢醫師</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#008f7a] mt-1">•</span>
                        <span>避免與咖啡、茶、酒精同時服用</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div className="bg-[#f8fbfa] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-[#0f2240] mb-3">儲存方式</h3>
                <ul className="space-y-2 text-[#0f2240]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#008f7a] mt-1">•</span>
                    <span>存放地點：{productData?.storage?.location || '陰涼乾燥處'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#008f7a] mt-1">•</span>
                    <span>溫度要求：{productData?.storage?.temperature || '常溫'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#008f7a] mt-1">•</span>
                    <span>濕度要求：{productData?.storage?.humidity || '避免高濕度'}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#dff4f0] rounded-lg p-6 border border-[#008f7a]">
                <h3 className="text-lg font-semibold text-[#0f2240] mb-3">溫馨提醒</h3>
                <p className="text-[#0f2240]">
                  本產品為保健食品，無法替代正規醫療。如有任何健康疑問，請諮詢專業醫師。
                  持續使用建議搭配健康的生活作息和均衡飲食，效果更佳。
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowUsageModal(false)}
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
