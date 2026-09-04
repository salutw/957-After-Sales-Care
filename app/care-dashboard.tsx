'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import MainNav from './components/MainNav';

const onboardingSteps = [
  {
    title: '綁定 LINE',
    text: '接收關懷回覆、提醒與追蹤通知。',
    action: '開始綁定',
    icon: 'LINE',
  },
  {
    title: '手機驗證',
    text: '確認購買人身份，保護會員權益。',
    action: '手機驗證',
    icon: 'TEL',
  },
  {
    title: '訂單歸戶',
    text: '比對購買記錄並啟用售後服務。',
    action: '訂單歸戶',
    icon: 'DOC',
  },
  {
    title: 'AI 初始評估',
    text: '建立基礎健康檔案，協助後續關懷與建議。',
    action: '開始評估',
    icon: 'AI',
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

function ProductScene({ compact = false }: { compact?: boolean }) {
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
    // 跳轉到個人資料頁面
    window.location.href = '/profile';
  };

  const handleStepClick = (index: number) => {
    if (index === 0) {
      // 綁定 LINE - 如果已綁定則不跳轉，否則跳轉到個人資料頁面
      if (isLineBound) {
        return; // 已綁定，顯示已完成狀態
      }
      window.location.href = '/profile?showLineBinding=true';
      return;
    }
    if (index === 1) {
      // 手機驗證 - 如果已驗證則不跳轉，否則跳轉到登入頁面
      if (isPhoneVerified) {
        return; // 已驗證，顯示已完成狀態
      }
      window.location.href = '/auth/login';
      return;
    }
    if (index === 2) {
      // 訂單歸戶 - 如果已歸戶則不跳轉，否則跳轉到訂單管理並打開新增視窗
      if (isOrderLinked) {
        return; // 已歸戶，顯示已完成狀態
      }
      window.location.href = '/orders?showAddModal=true';
      return;
    }
    if (index === 3) {
      // AI 初始評估 - 如果已評估則不跳轉，否則打開評估面板
      if (isAiAssessed) {
        return; // 已評估，顯示已完成狀態
      }
      setCompleted((value) => Math.max(value, 4));
      setPanel('intake');
      return;
    }
    // 更新 completed 狀態
    setCompleted((value) => Math.max(value, index + 1));
  };

  const handleShowUsage = () => {
    setShowUsageModal(true);
  };

  return (
    <main className="min-h-screen bg-[#f8fbfa] text-[#0f2240]">
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
          <button className="icon-button" aria-label="通知">
            !
          </button>
          <div className="member-chip cursor-pointer" onClick={() => window.location.href = '/profile'}>
            <span className="avatar-dot" />
            <span className="hidden sm:inline">{user?.name || '會員'}</span>
            <span aria-hidden="true">⌄</span>
          </div>
          <button 
            onClick={() => {
              // 登出功能將在 AuthContext 中實現
              window.location.href = '/auth/login';
            }}
            className="text-[#637082] hover:text-[#087e74] transition"
          >
            登出
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-6 px-5 pb-8 md:px-8">
        <MainNav />

        <section className="hero-shell">
          <div className="hero-plant plant-left" />
          <ProductScene />
          <div className="hero-copy">
            <p className="eyebrow">957 After-Sales Care</p>
            <h1>你的售後健康服務已準備好</h1>
            <p>
              完成身份與訂單確認後，這裡會整理商品使用方式、每日計畫、健康追蹤與顧問服務。
            </p>
            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={handlePrimaryStart}
              >
                開始設定 <span>→</span>
              </button>
              <button className="ghost-button" onClick={() => setPanel('advisor')}>
                了解更多 <span className="info-dot">i</span>
              </button>
            </div>
          </div>

          <aside className="progress-card">
            <div className="card-title">
              <span className="shield-icon">◇</span>
              <strong>啟用進度</strong>
            </div>
            <div className="progress-value">{progress}%</div>
            <p>
              {isActivated
                ? '基礎檔案已建立，我們會依你的狀態調整後續關懷。'
                : `已完成 ${effectiveCompleted}/4 個啟用步驟`}
            </p>
            <div className="progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p>
              {isActivated
                ? '基礎檔案已建立，我們會依你的狀態調整後續關懷。'
                : '完成四個啟用步驟後，將解鎖商品、提醒、AI 助理與顧問服務。'}
            </p>
          </aside>
        </section>

        <section className="step-grid" aria-label="啟用流程">
          {onboardingSteps.map((step, index) => {
            const isStepCompleted = 
              (index === 0 && isLineBound) ||      // 綁定 LINE
              (index === 1 && isPhoneVerified) ||   // 手機驗證
              (index === 2 && isOrderLinked) ||     // 訂單歸戶
              (index === 3 && isAiAssessed);       // AI 初始評估
            
            return (
              <article 
                className={`step-card ${isStepCompleted ? 'completed' : ''}`} 
                key={step.title}
              >
                <span className="step-number">{index + 1}</span>
                <PillIcon label={step.icon} />
                <div>
                  <h2>{step.title}</h2>
                  <p>{step.text}</p>
                  {isStepCompleted ? (
                    <div className="completed-badge">
                      <span className="check-icon">✓</span>
                      已完成
                    </div>
                  ) : (
                    <button onClick={() => handleStepClick(index)}>
                      {step.action} <span>→</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>

        {isActivated ? (
          <>
            <section className="dashboard-grid">
              <article className="product-card">
                <div className="section-pill">我的商品</div>
                <ProductScene compact />
                <div className="product-copy">
                  <span className="status-badge">已完成啟用</span>
                  <h2>957 牛樟芝精華膠囊</h2>
                  <p>已為你整理使用提醒與後續關懷，完成歸戶後即可開始。</p>
                  <div className="usage-boxes">
                    <div>
                      <small>建議使用</small>
                      <strong>早餐後、晚餐後</strong>
                    </div>
                    <div>
                      <small>用藥間隔</small>
                      <strong>至少 120 分鐘</strong>
                    </div>
                  </div>
                  <div className="button-row">
                    <button className="primary-button" onClick={handleShowUsage}>查看使用方式</button>
                  </div>
                </div>
              </article>

              <article className="plan-card">
                <div>
                  <div className="section-pill">今日計畫</div>
                  <h2>每日使用提醒</h2>
                  <p>設定開始使用日後，今日計畫會自動產生。</p>
                  <button className="primary-button small">重新整理計畫</button>
                </div>
                <div className="capsule-scene" aria-hidden="true">
                  <span className="sun">☼</span>
                  <span className="moon">☾</span>
                  <div className="capsule">
                    <span />
                  </div>
                </div>
                <div className="timeline">
                  {timeline.map((item) => (
                    <div key={item}>
                      <span className="line-icon">{item.slice(0, 1)}</span>
                      <strong>{item}</strong>
                      <small>
                        {item === '服用提醒'
                          ? '不錯過每日進度'
                          : item === '專業關懷'
                            ? '顧問全程陪伴'
                            : '掌握每日狀況'}
                      </small>
                    </div>
                  ))}
                </div>
              </article>

              <article className="assistant-card">
                <div className="assistant-copy">
                  <div className="section-pill">AI 商品小助理</div>
                  <h2>想了解商品怎麼使用？</h2>
                  <p>
                    使用者可以直接詢問商品問題，由 AI 小助理在回覆中說明一般食用方式、進階使用方式與建議搭配商品。正式版會串接後台商品資料庫，再依會員狀態整理參考資訊。
                  </p>
                  <div className="assistant-examples" aria-label="AI 小助理可回答的商品資訊">
                    {assistantExamples.map((example) => (
                      <span key={example}>{example}</span>
                    ))}
                  </div>
                </div>
                <div className="assistant-console">
                  <div className="assistant-avatar">AI</div>
                  <label>
                    <span>輸入想查詢的商品問題</span>
                    <input
                      value={assistantQuery}
                      onChange={(event) => setAssistantQuery(event.target.value)}
                      placeholder="例如：我適合什麼時間吃？"
                    />
                  </label>
                  <div className="assistant-answer">
                    <strong>小助理回覆</strong>
                    <p>{assistantAnswer}</p>
                  </div>
                  <small>資料來源預留：商品資料庫、會員訂單、健康回報、AI 分析規則</small>
                </div>
              </article>

              <article className="checkin-card">
                <div className="section-pill">Day 7 關懷追蹤</div>
                <h2>最近 7 天，您的狀況如何？</h2>
                <p>持續回報有助於我們提供更精準的關懷與建議。</p>
                <div className="checkin-actions">
                  <button className="good" onClick={() => { setPanel('health'); setTimeout(() => window.location.href = '/health', 500); }}>
                    <span>✓</span>
                    <strong>狀況穩定</strong>
                    一切都很好
                  </button>
                  <button className="help" onClick={() => { setPanel('health'); setTimeout(() => window.location.href = '/health', 500); }}>
                    <span>♡</span>
                    <strong>我有不適</strong>
                    需要協助
                  </button>
                </div>
              </article>
            </section>

            <section className="advisor-band">
              <div>
                <div className="section-pill">顧問服務</div>
                <h2>需要人員協助嗎？</h2>
                <p>若有用藥、特殊疾病、報告異常或使用後不適，建議送出顧問諮詢。</p>
                <button className="primary-button" onClick={() => setPanel('advisor')}>
                  送出顧問諮詢
                </button>
              </div>
              <div className="advisor-portrait" aria-label="專業顧問">
                <div className="face">
                  <span className="hair" />
                  <span className="coat" />
                </div>
              </div>
              <ul>
                <li>專業顧問團隊</li>
                <li>一對一個人化建議</li>
                <li>隱私保護 安心諮詢</li>
              </ul>
            </section>
          </>
        ) : null}

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
                  setAiAssessed(true); // 設置 AI 評估完成狀態
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

        {isActivated ? (
          <footer>
            本平台提供之內容僅供參考，非作為醫療診斷或治療依據。如有身體不適，請諮詢醫療專業人員。
          </footer>
        ) : null}

        {/* 商品使用方式模態框 */}
        {showUsageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-[#0f2240] mb-4">957 牛樟芝精華膠囊使用方式</h2>
              
              <div className="space-y-6">
                <div className="bg-[#f8fbfa] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#0f2240] mb-3">基本資訊</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#637082] mb-1">建議使用時段</label>
                      <p className="text-[#0f2240]">早餐後、晚餐後</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#637082] mb-1">每次用量</label>
                      <p className="text-[#0f2240]">1-2 顆</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#637082] mb-1">用藥間隔</label>
                      <p className="text-[#0f2240]">至少 120 分鐘</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#637082] mb-1">每日總量</label>
                      <p className="text-[#0f2240]">不超過 4 顆</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f8fbfa] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#0f2240] mb-3">使用注意事項</h3>
                  <ul className="space-y-2 text-[#0f2240]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#087e74] mt-1">•</span>
                      <span>請用溫開水送服，避免空腹服用</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#087e74] mt-1">•</span>
                      <span>建議飯後 30 分鐘內服用</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#087e74] mt-1">•</span>
                      <span>與其他藥物間隔至少 2 小時</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#087e74] mt-1">•</span>
                      <span>孕期、哺乳期或特殊疾病者請諮詢醫師</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#087e74] mt-1">•</span>
                      <span>避免與咖啡、茶、酒精同時服用</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#f8fbfa] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#0f2240] mb-3">儲存方式</h3>
                  <ul className="space-y-2 text-[#0f2240]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#087e74] mt-1">•</span>
                      <span>請置於陰涼乾燥處，避免陽光直射</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#087e74] mt-1">•</span>
                      <span>避免高温、高濕度環境</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#087e74] mt-1">•</span>
                      <span>請置於兒童無法取得之處</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#dff4f0] rounded-lg p-6 border border-[#087e74]">
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
      </div>
    </main>
  );
}
