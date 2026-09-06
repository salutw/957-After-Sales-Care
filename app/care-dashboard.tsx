'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type Panel = 'none' | 'intake' | 'health' | 'advisor';
type ChatMessage = { role: 'user' | 'ai'; text: string };

type ProductData = {
  name?: string;
  image?: string;
  usage?: {
    suggestedTime?: string;
    dosage?: string;
    interval?: string;
    dailyMax?: string;
  };
  storage?: {
    location?: string;
    temperature?: string;
    humidity?: string;
  };
  warnings?: string[];
};

const navItems = [
  { label: '首頁', href: '/', icon: 'home' },
  { label: '訂單管理', href: '/orders', icon: 'clipboard' },
  { label: '健康記錄', href: '/health', icon: 'pulse' },
  { label: '顧問諮詢', href: '/advisor', icon: 'chat' },
  { label: '個人資料', href: '/profile', icon: 'user' },
  { label: '管理後台', href: '/admin', icon: 'grid' },
];

const intakeQuestions = [
  '目前主要保養目標是什麼？',
  '最近睡眠、精神與日常作息狀況如何？',
  '是否有固定用藥、特殊疾病或希望顧問留意的狀況？',
];

const aiQuestions = [
  '最近 7 天是否都有依建議使用？',
  '睡眠、精神或腸胃狀況有明顯變化嗎？',
  '是否出現任何不適，或希望顧問優先協助的問題？',
];

const assistantAnswer =
  '可以的。關於 957 牛樟芝，AI 小助理會先依商品資料庫提供一般食用方式，例如建議使用時段、每日建議量與注意事項。進階使用會參考會員訂單、使用天數、近期健康回報與生活作息，整理成個人化參考建議；若涉及搭配商品，正式版會由後台商品資料與 AI 分析規則比對你的需求後回覆。';

const dashboardTools = [
  { icon: 'pill', title: '服用提醒', desc: '不漏掉每日目標' },
  { icon: 'chart', title: '計畫追蹤', desc: '掌握每日狀況' },
  { icon: 'doc', title: '數據記錄', desc: '累積健康資料' },
  { icon: 'heart', title: '專業關懷', desc: '顧問全程陪伴' },
];

function Icon({ name, className = '' }: { name: string; className?: string }) {
  const base = `dashboard-icon ${className}`.trim();

  switch (name) {
    case 'home':
      return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 10 9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></svg>;
    case 'clipboard':
      return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3h6l1 2h3v16H5V5h3l1-2Z" /><path d="M9 10h6M9 14h6M9 18h4" /></svg>;
    case 'pulse':
      return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h4l2-6 4 12 2-6h6" /></svg>;
    case 'chat':
      return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5h16v11H8l-4 4V5Z" /><path d="M8 9h8M8 13h5" /></svg>;
    case 'user':
      return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
    case 'grid':
      return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" /></svg>;
    case 'bell':
      return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></svg>;
    case 'line':
      return <svg className={base} viewBox="0 0 24 24" fill="none"><path d="M12 3C6.48 3 2 6.72 2 11.3c0 4.1 3.58 7.54 8.42 8.2.32.07.76.22.87.5.1.25.07.64.03.9l-.14.86c-.04.25-.2.98.86.53 1.06-.44 5.7-3.36 7.78-5.76A7.38 7.38 0 0 0 22 11.3C22 6.72 17.52 3 12 3Z" fill="currentColor" /><path d="M7 9.3v4h2.5M11 9.3v4M13 13.3v-4l3 4v-4M18 9.3h-2.2v4H18M15.8 11.3h1.8" stroke="white" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>;
    case 'phone':
      return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="7" y="2" width="10" height="20" rx="2.5" /><path d="M11 18h2" /></svg>;
    case 'doc':
      return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v5h5M9 13h6M9 17h5" /></svg>;
    case 'ai':
      return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="7" width="14" height="11" rx="4" /><path d="M12 7V4M8 4h8" /><circle cx="10" cy="12" r="1" fill="currentColor" /><circle cx="14" cy="12" r="1" fill="currentColor" /><path d="M10 16h4" /></svg>;
    case 'shield':
      return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3 5 6v5c0 4.7 2.8 8.9 7 10 4.2-1.1 7-5.3 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>;
    case 'leaf':
      return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 4C12 4 6 9 5 20c7-1 13-7 15-16Z" /><path d="M5 20c4-6 8-9 15-16" /></svg>;
    case 'heart':
      return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.8 5.8a5.5 5.5 0 0 0-7.8 0L12 6.8l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z" /></svg>;
    case 'pill':
      return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.5 20.5 20.5 10.5a5 5 0 1 0-7-7l-10 10a5 5 0 1 0 7 7Z" /><path d="m8 16 8-8" /></svg>;
    case 'chart':
      return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19V5" /><path d="M8 17v-5M13 17V8M18 17v-8" /><path d="M4 19h17" /></svg>;
    case 'send':
      return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></svg>;
    case 'headset':
      return <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 13a8 8 0 0 1 16 0" /><path d="M4 13v4a2 2 0 0 0 2 2h2v-8H6a2 2 0 0 0-2 2ZM20 13v4a2 2 0 0 1-2 2h-2v-8h2a2 2 0 0 1 2 2Z" /><path d="M14 21h-3" /></svg>;
    default:
      return null;
  }
}

function BrandMark() {
  return <div className="site-brand-mark" aria-hidden="true"><span /></div>;
}

function ProductVisual({ imageUrl, compact = false }: { imageUrl?: string; compact?: boolean }) {
  if (imageUrl) {
    return (
      <div className={compact ? 'product-display compact' : 'product-display'}>
        <img src={imageUrl} alt="957 牛樟芝產品" />
      </div>
    );
  }

  return (
    <div className={compact ? 'product-display compact' : 'product-display'} aria-label="957 牛樟芝產品示意">
      <div className="product-pack pack-one">
        <div className="pack-logo">957</div>
        <strong>牛樟芝</strong>
        <small>菌絲體膠囊</small>
      </div>
      <div className="product-pack pack-two">
        <div className="pack-logo small">957</div>
        <strong>健康守護</strong>
        <small>30 caps</small>
      </div>
      <div className="capsule-piece" />
    </div>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  const safeProgress = Math.max(0, Math.min(100, progress));
  const circumference = 2 * Math.PI * 48;
  const offset = circumference - (safeProgress / 100) * circumference;

  return (
    <div className="progress-ring" aria-label={`啟用進度 ${safeProgress}%`}>
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="48" className="ring-bg" />
        <circle cx="60" cy="60" r="48" className="ring-value" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div>
        <strong>{safeProgress}%</strong>
        <span>{safeProgress === 100 ? '已完成' : `已完成 ${safeProgress / 25}/4`}</span>
      </div>
    </div>
  );
}

export default function CareDashboard() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading,
    isPhoneVerified,
    isLineBound,
    isOrderLinked,
    isAiAssessed,
    setAiAssessed,
  } = useAuth();

  const [panel, setPanel] = useState<Panel>('none');
  const [homepageImage, setHomepageImage] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'user', text: '我想了解 957 牛樟芝怎麼使用？' },
    { role: 'ai', text: assistantAnswer },
  ]);

  useEffect(() => {
    const loadHomepageContent = () => {
      const savedImage = localStorage.getItem('homepageProductImage');
      if (savedImage) setHomepageImage(savedImage);

      const savedProducts = localStorage.getItem('products');
      if (!savedProducts) return;

      try {
        const products = JSON.parse(savedProducts) as ProductData[];
        if (products.length > 0) {
          setProductData(products[0]);
          if (products[0].image) setProductImage(products[0].image);
        }
      } catch (error) {
        console.error('Failed to parse products:', error);
      }
    };

    loadHomepageContent();
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const stepStates = useMemo(
    () => [
      {
        title: '綁定 LINE',
        text: '接收專屬訊息、提醒與追蹤狀態綁定',
        status: isLineBound,
        icon: 'line',
        tone: 'line',
        action: () => {
          if (!isLineBound) window.location.href = '/profile?showLineBinding=true';
        },
      },
      {
        title: '手機驗證',
        text: '驗證購買人身份，保護會員權益',
        status: isPhoneVerified,
        icon: 'phone',
        tone: 'phone',
        action: () => {
          if (!isPhoneVerified) window.location.href = '/auth/login';
        },
      },
      {
        title: '訂單歸戶',
        text: '比對購買記錄並啟用售後服務',
        status: isOrderLinked,
        icon: 'doc',
        tone: 'order',
        action: () => {
          if (!isOrderLinked) window.location.href = '/orders?showAddModal=true';
        },
      },
      {
        title: 'AI 初始評估',
        text: '建立個人健康檔案，提供專屬保健建議',
        status: isAiAssessed,
        icon: 'ai',
        tone: 'ai',
        action: () => {
          if (!isAiAssessed) setPanel('intake');
        },
      },
    ],
    [isAiAssessed, isLineBound, isOrderLinked, isPhoneVerified],
  );

  const effectiveCompleted = stepStates.filter((step) => step.status).length;
  const progress = effectiveCompleted * 25;
  const isActivated = effectiveCompleted >= 4;

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages((messages) => [...messages, { role: 'user', text: chatInput.trim() }]);
    setChatInput('');
    window.setTimeout(() => {
      setChatMessages((messages) => [...messages, { role: 'ai', text: assistantAnswer }]);
    }, 450);
  };

  if (isLoading || !isAuthenticated) return null;

  return (
    <main className="care-home">
      <header className="care-header">
        <div className="header-brand" onClick={() => router.push('/')}>
          <BrandMark />
          <div>
            <strong>957 After-Sales Care</strong>
            <span>用關心，陪你更健康</span>
          </div>
        </div>

        <nav className="care-nav" aria-label="主要導覽">
          {navItems.map((item) => (
            <a className={item.href === '/' ? 'active' : ''} href={item.href} key={item.href}>
              <Icon name={item.icon} />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button className="notify-button" aria-label="查看通知">
            <Icon name="bell" />
            <span />
          </button>
          <button className="member-button" onClick={() => router.push('/profile')}>
            <span className="member-avatar">{user?.name?.charAt(0) || '會'}</span>
            <strong>{user?.name || '測試會員'}</strong>
            <span className="chevron">⌄</span>
          </button>
        </div>
      </header>

      <div className="care-container">
        <section className="new-hero">
          <div className="hero-copy">
            <p className="hero-eyebrow">CARE EVERYDAY, A BETTER TOMORROW</p>
            <h1>你的售後健康服務<br />我們一直都在</h1>
            <p>完成身份綁定與服務設定，這裡會整理由你使用方式、每日計畫、健康追蹤與專屬關懷服務。</p>
            <div className="hero-buttons">
              <button className="primary-action" onClick={() => router.push('/profile')}>開始設定 <span>→</span></button>
              <button className="secondary-action" onClick={() => setPanel('intake')}>了解更多 <span className="play-dot">▶</span></button>
            </div>
            <div className="hero-trust">
              <div><Icon name="shield" /><strong>專業團隊把關</strong><span>安心有保障</span></div>
              <div><Icon name="heart" /><strong>持續關懷服務</strong><span>陪伴每一天</span></div>
              <div><Icon name="leaf" /><strong>用科學守護健康</strong><span>打造更好的自己</span></div>
            </div>
          </div>

          <div className="hero-product">
            <div className="hand-note">小小的堅持<br />成就健康的你</div>
            <div className="product-stage">
              <ProductVisual imageUrl={homepageImage || productImage} />
            </div>
            <div className="benefit-tags">
              <span>調節機能</span>
              <span>增強保護力</span>
              <span>每日健康守護</span>
            </div>
            <div className="hero-dots"><span className="active" /><span /><span /></div>
          </div>

          <aside className="activation-card">
            <div className="card-label"><Icon name="shield" />啟用進度</div>
            <ProgressRing progress={progress} />
            <h2>{isActivated ? '太棒了！' : '完成步驟即可啟用'}</h2>
            <p>{isActivated ? '你的售後健康服務已準備就緒，我們會持續關注你的狀態。' : `目前已完成 ${effectiveCompleted}/4，完成後會開啟完整售後健康服務。`}</p>
            <button onClick={() => router.push('/profile')}>查看我的設定 <span>→</span></button>
          </aside>
        </section>

        <section className="onboarding-grid" aria-label="啟用步驟">
          {stepStates.map((step, index) => (
            <button className={`onboarding-card ${step.status ? 'completed' : ''} ${step.tone}`} key={step.title} onClick={step.action}>
              <div className="step-icon-wrap"><Icon name={step.icon} /></div>
              <div>
                <span className="step-index">{String(index + 1).padStart(2, '0')}</span>
                <h2>{step.title}</h2>
                <p>{step.text}</p>
                <span className="step-status">{step.status ? '已完成' : '待完成'}</span>
              </div>
              <span className="step-arrow">›</span>
            </button>
          ))}
        </section>

        {isActivated && (
          <>
            <section className="top-dashboard">
              <article className="recommended-card">
                <div className="section-tag"><Icon name="shield" />精選商品｜RECOMMENDED</div>
                <div className="recommended-body">
                  <div className="product-photo-panel">
                    <ProductVisual imageUrl={productImage || homepageImage} compact />
                    <span className="stamp-text">Natural Health<br />Better Life</span>
                  </div>
                  <div className="recommended-copy">
                    <span className="status-chip">已完成啟用</span>
                    <h2>{productData?.name || '957 牛樟芝精華膠囊'}</h2>
                    <p>已為你整理出相關健康保健建議，完成歸戶後即可開始。</p>
                    <div className="benefit-row">
                      <span><Icon name="leaf" />日常保健</span>
                      <span><Icon name="shield" />調節機能</span>
                      <span><Icon name="heart" />增強保護力</span>
                    </div>
                    <div className="usage-summary">
                      <div><small>建議時機</small><strong>{productData?.usage?.suggestedTime || '早餐後、晚餐後'}</strong></div>
                      <div><small>建議用量</small><strong>{productData?.usage?.interval || '至少 120 分鐘'}</strong></div>
                    </div>
                    <button className="primary-action compact" onClick={() => setShowUsageModal(true)}>查看使用方式 <span>→</span></button>
                  </div>
                </div>
              </article>

              <article className="daily-card">
                <div>
                  <div className="section-tag">今日計畫</div>
                  <h2>每日使用提醒</h2>
                  <p>設定開始使用日期，今日計畫會自動產生。讓健康成為一種習慣！</p>
                  <button className="primary-action compact" onClick={() => router.push('/health')}>查看今日計畫 <span>→</span></button>
                </div>
                <div className="daily-visual"><span>健康生活<br />從今天開始</span></div>
                <div className="tool-grid">
                  {dashboardTools.map((tool) => (
                    <div key={tool.title}><Icon name={tool.icon} /><strong>{tool.title}</strong><span>{tool.desc}</span></div>
                  ))}
                </div>
              </article>
            </section>

            <section className="lower-dashboard">
              <article className="assistant-intro">
                <div className="section-tag">AI 商品小助手</div>
                <h2>想了解商品<br />怎麼使用？</h2>
                <p>使用者可以直接詢問商品問題，由 AI 小助手在回覆中說明一般食用方式，並結合官方資料提供完整、正確的建議。</p>
                <div className="query-topics" aria-label="可詢問主題">
                  <span>一般食用方式</span>
                  <span>適合族群</span>
                  <span>搭配建議</span>
                  <span>進階搭配商品</span>
                </div>
              </article>

              <article className="chat-card">
                <div className="chat-title"><span><Icon name="ai" /></span><h2>AI 智能問答</h2></div>
                <div className="chat-window">
                  {chatMessages.map((message, index) => (
                    <div className={`chat-line ${message.role}`} key={`${message.role}-${index}`}>
                      {message.role === 'ai' && <span className="bot-dot"><Icon name="ai" /></span>}
                      <p>{message.text}</p>
                    </div>
                  ))}
                </div>
                <div className="chat-input">
                  <input
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') handleSendMessage();
                    }}
                    placeholder="輸入你的問題..."
                  />
                  <button aria-label="送出問題" onClick={handleSendMessage}><Icon name="send" /></button>
                </div>
              </article>

              <article className="tracking-card">
                <div className="section-tag">7 Day 健康追蹤</div>
                <h2>最近 7 天，<br />您的狀況如何？</h2>
                <p>持續紀錄有助於我們提供更精準的關懷與建議。</p>
                <div className="line-chart" aria-label="7 天健康趨勢">
                  <svg viewBox="0 0 420 150" preserveAspectRatio="none">
                    <path d="M20 110 C78 90 102 90 150 70 S235 104 280 58 355 48 400 22" />
                    {[20, 85, 150, 215, 280, 340, 400].map((x, index) => (
                      <circle key={x} cx={x} cy={[110, 92, 70, 86, 58, 44, 22][index]} r="6" />
                    ))}
                  </svg>
                  <div>{['週一', '週二', '週三', '週四', '週五', '週六', '週日'].map((day) => <span key={day}>{day}</span>)}</div>
                  <strong>Day 7</strong>
                </div>
                <div className="health-actions">
                  <button className="good" onClick={() => router.push('/health')}><span>✓</span><strong>狀況穩定</strong><small>一切都很好</small></button>
                  <button className="help" onClick={() => router.push('/health')}><span>♡</span><strong>我有不適</strong><small>需要協助</small></button>
                </div>
              </article>
            </section>

            <section className="advisor-strip">
              <div className="advisor-main">
                <span><Icon name="headset" /></span>
                <div>
                  <h2>需要專人協助嗎？</h2>
                  <p>若有用藥、特殊疾病，或在使用上有任何不適，請透過此處聯繫顧問，我們將盡快為您服務。</p>
                  <button className="primary-action compact" onClick={() => setPanel('advisor')}>送出顧問諮詢 <span>→</span></button>
                </div>
              </div>
              <div className="advisor-points">
                <div><Icon name="chat" /><strong>專業顧問團隊</strong><span>一對一個人化建議</span></div>
                <div><Icon name="user" /><strong>隱私保護</strong><span>資料安全有保障</span></div>
                <div><Icon name="shield" /><strong>貼心服務</strong><span>讓你健康安心</span></div>
              </div>
            </section>
          </>
        )}

        {!isActivated && (
          <section className="locked-note">
            <Icon name="shield" />
            <div>
              <strong>完成四個步驟後，系統會開啟完整健康服務首頁。</strong>
              <p>商品建議、每日計畫、AI 商品小助理、健康追蹤與顧問諮詢會在啟用後顯示。</p>
            </div>
          </section>
        )}

        <footer className="care-footer">
          <div><BrandMark /><div><strong>957 After-Sales Care</strong><span>用關心，陪你更健康</span></div></div>
          <nav>
            <a href="#">關於我們</a>
            <a href="#">隱私權政策</a>
            <a href="#">服務條款</a>
            <a href="#">聯絡我們</a>
          </nav>
          <p>© 2026 957 After-Sales Care. 版權所有</p>
        </footer>
      </div>

      <aside className={panel === 'none' ? 'floating-panel hidden' : 'floating-panel'}>
        <button className="close-button" onClick={() => setPanel('none')} aria-label="關閉">×</button>
        {panel === 'intake' ? (
          <>
            <div className="section-pill">AI 初始評估</div>
            <h2>建立基礎檔案</h2>
            <p>Demo 版先呈現 AI 問答流程。正式版會將回覆寫入會員基礎檔案，供商品建議、健康追蹤與顧問派單使用。</p>
            <div className="question-stack">
              {intakeQuestions.map((question, index) => (
                <label key={question}><span>{index + 1}. {question}</span><input placeholder="請輸入回覆" /></label>
              ))}
            </div>
            <button className="primary-button full" onClick={() => { setPanel('none'); setAiAssessed(true); }}>完成評估並啟用服務</button>
          </>
        ) : panel === 'health' ? (
          <>
            <div className="section-pill">AI 健康問答表單</div>
            <h2>健康回報</h2>
            <p>Demo 版先呈現問答流程，正式版會寫入會員健康紀錄並觸發顧問派單規則。</p>
            <div className="question-stack">
              {aiQuestions.map((question, index) => (
                <label key={question}><span>{index + 1}. {question}</span><input placeholder="請輸入回覆" /></label>
              ))}
            </div>
            <button className="primary-button full" onClick={() => setPanel('none')}>送出回報</button>
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
            <button className="primary-button full" onClick={() => setPanel('none')}>建立諮詢案件</button>
          </>
        )}
      </aside>

      {showUsageModal && (
        <div className="usage-modal" role="dialog" aria-modal="true" aria-labelledby="usage-title">
          <div>
            <h2 id="usage-title">{productData?.name || '957 牛樟芝精華膠囊'}使用方式</h2>
            <section>
              <h3>基本資訊</h3>
              <div className="usage-modal-grid">
                <div><small>建議使用時段</small><p>{productData?.usage?.suggestedTime || '早餐後、晚餐後'}</p></div>
                <div><small>每次用量</small><p>{productData?.usage?.dosage || '1-2 顆'}</p></div>
                <div><small>用藥間隔</small><p>{productData?.usage?.interval || '至少 120 分鐘'}</p></div>
                <div><small>每日總量</small><p>{productData?.usage?.dailyMax || '不超過 4 顆'}</p></div>
              </div>
            </section>
            <section>
              <h3>使用注意事項</h3>
              <ul>
                {(productData?.warnings || ['請用溫開水送服，避免空腹服用', '建議飯後 30 分鐘內服用', '與其他藥物間隔至少 2 小時', '孕期、哺乳期或特殊疾病者請諮詢醫師', '避免與咖啡、茶、酒精同時服用']).map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3>儲存方式</h3>
              <ul>
                <li>存放地點：{productData?.storage?.location || '陰涼乾燥處'}</li>
                <li>溫度要求：{productData?.storage?.temperature || '常溫'}</li>
                <li>濕度要求：{productData?.storage?.humidity || '避免高濕度'}</li>
              </ul>
            </section>
            <p className="usage-reminder">本產品為保健食品，無法替代正規醫療。如有任何健康疑問，請諮詢專業醫師。</p>
            <button onClick={() => setShowUsageModal(false)}>關閉</button>
          </div>
        </div>
      )}
    </main>
  );
}
