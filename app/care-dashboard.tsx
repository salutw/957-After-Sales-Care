'use client';

import { useMemo, useState } from 'react';

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
    title: '開始使用',
    text: '建立每日計畫與健康追蹤。',
    action: '今天開始',
    icon: 'HEART',
  },
];

const timeline = ['服用提醒', '計畫追蹤', '數據記錄', '專業關懷'];
const aiQuestions = [
  '最近 7 天是否都有依建議服用？',
  '睡眠、精神或腸胃狀況有明顯變化嗎？',
  '是否出現任何不適，或希望顧問優先協助的問題？',
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
  const [completed, setCompleted] = useState(0);
  const [panel, setPanel] = useState<'none' | 'health' | 'advisor'>('none');
  const [assistantQuery, setAssistantQuery] = useState('我想了解 957 牛樟芝怎麼使用？');
  const progress = useMemo(() => completed * 25, [completed]);

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
          <div className="member-chip">
            <span className="avatar-dot" />
            <span className="hidden sm:inline">牛樟芝會員</span>
            <span aria-hidden="true">⌄</span>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1540px] flex-col gap-6 px-5 pb-8 md:px-8">
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
                onClick={() => setCompleted((value) => Math.min(value + 1, 4))}
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
            <div className="progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p>近期狀況已更新，我們會依你的狀態調整後續關懷。</p>
          </aside>
        </section>

        <section className="step-grid" aria-label="啟用流程">
          {onboardingSteps.map((step, index) => (
            <article className="step-card" key={step.title}>
              <span className="step-number">{index + 1}</span>
              <PillIcon label={step.icon} />
              <div>
                <h2>{step.title}</h2>
                <p>{step.text}</p>
                <button onClick={() => setCompleted(Math.max(completed, index + 1))}>
                  {step.action} <span>→</span>
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="dashboard-grid">
          <article className="product-card">
            <div className="section-pill">我的商品</div>
            <ProductScene compact />
            <div className="product-copy">
              <span className="status-badge">待訂單歸戶</span>
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
                <button className="primary-button">查看使用方式</button>
                <button className="ghost-button">完成訂單歸戶</button>
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
              <button className="good" onClick={() => setPanel('health')}>
                <span>✓</span>
                <strong>狀況穩定</strong>
                一切都很好
              </button>
              <button className="help" onClick={() => setPanel('health')}>
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

        <aside className={panel === 'none' ? 'floating-panel hidden' : 'floating-panel'}>
          <button className="close-button" onClick={() => setPanel('none')} aria-label="關閉">
            ×
          </button>
          {panel === 'health' ? (
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

        <footer>
          本平台提供之內容僅供參考，非作為醫療診斷或治療依據。如有身體不適，請諮詢醫療專業人員。
        </footer>
      </div>
    </main>
  );
}
