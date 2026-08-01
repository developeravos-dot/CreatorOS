import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  Channel,
  ContentItem,
  ContentPlatform,
  DashboardState,
  Platform,
  creatorApi,
} from "./api";
import "./styles.css";

type Page = "dashboard" | "youtube" | "tiktok" | "factory" | "settings";

const navigation: Array<{ id: Page; icon: string; label: string }> = [
  { id: "dashboard", icon: "⌂", label: "لوحة التحكم" },
  { id: "youtube", icon: "▶", label: "قنوات YouTube" },
  { id: "tiktok", icon: "♪", label: "حسابات TikTok" },
  { id: "factory", icon: "✦", label: "مصنع المحتوى" },
  { id: "settings", icon: "⚙", label: "الإعدادات" },
];

const contentStageNames: Record<ContentItem["status"], string> = {
  idea: "الفكرة",
  research: "البحث",
  script: "السكربت",
  voice: "الصوت",
  video: "الفيديو",
  thumbnail: "الصورة المصغرة",
  scheduled: "مجدول",
  published: "منشور",
};

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal-card"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [data, setData] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  const [modal, setModal] = useState<"channel" | "content" | null>(null);

  const [channelName, setChannelName] = useState("");
  const [channelPlatform, setChannelPlatform] =
    useState<Platform>("YouTube");
  const [channelCategory, setChannelCategory] = useState("");

  const [contentTitle, setContentTitle] = useState("");
  const [contentPlatform, setContentPlatform] =
    useState<ContentPlatform>("YouTube");
  const [contentFormat, setContentFormat] = useState("فيديو طويل");

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const result = await creatorApi.getDashboard();
      setData(result);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "تعذر الاتصال بالخادم.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  const youtubeChannels = useMemo(
    () => data?.channels.filter((item) => item.platform === "YouTube") || [],
    [data],
  );

  const tiktokChannels = useMemo(
    () => data?.channels.filter((item) => item.platform === "TikTok") || [],
    [data],
  );

  async function submitChannel(event: React.FormEvent) {
    event.preventDefault();

    if (!channelName.trim()) return;

    setWorking(true);
    setError("");

    try {
      await creatorApi.addChannel({
        name: channelName.trim(),
        platform: channelPlatform,
        category: channelCategory.trim() || "عام",
      });

      setChannelName("");
      setChannelCategory("");
      setModal(null);
      await loadDashboard();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "تعذر إضافة القناة.",
      );
    } finally {
      setWorking(false);
    }
  }

  async function submitContent(event: React.FormEvent) {
    event.preventDefault();

    if (!contentTitle.trim()) return;

    setWorking(true);
    setError("");

    try {
      await creatorApi.addContent({
        title: contentTitle.trim(),
        platform: contentPlatform,
        format: contentFormat,
      });

      setContentTitle("");
      setModal(null);
      setPage("factory");
      await loadDashboard();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "تعذر إنشاء المحتوى.",
      );
    } finally {
      setWorking(false);
    }
  }

  async function advanceContent(id: string) {
    setWorking(true);

    try {
      await creatorApi.advanceContent(id);
      await loadDashboard();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "تعذر تحديث المحتوى.",
      );
    } finally {
      setWorking(false);
    }
  }

  async function deleteContent(id: string) {
    if (!confirm("هل تريد حذف هذا المحتوى؟")) return;

    setWorking(true);

    try {
      await creatorApi.removeContent(id);
      await loadDashboard();
    } finally {
      setWorking(false);
    }
  }

  async function deleteChannel(id: string) {
    if (!confirm("هل تريد حذف هذه القناة أو الحساب؟")) return;

    setWorking(true);

    try {
      await creatorApi.removeChannel(id);
      await loadDashboard();
    } finally {
      setWorking(false);
    }
  }

  function openChannel(platform: Platform) {
    setChannelPlatform(platform);
    setModal("channel");
  }

  function renderChannels(channels: Channel[], platform: Platform) {
    return (
      <section className="section-panel">
        <div className="section-heading">
          <div>
            <span className="section-label">CONNECTED ACCOUNTS</span>
            <h2>
              {platform === "YouTube"
                ? "قنوات YouTube"
                : "حسابات TikTok"}
            </h2>
          </div>

          <button
            className="primary-button compact"
            type="button"
            onClick={() => openChannel(platform)}
          >
            ＋ إضافة
          </button>
        </div>

        {channels.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              {platform === "YouTube" ? "▶" : "♪"}
            </div>
            <h3>لا توجد حسابات متصلة</h3>
            <p>أضف أول قناة أو حساب ليبدأ النظام في جمع البيانات.</p>
          </div>
        ) : (
          <div className="data-grid">
            {channels.map((channel) => (
              <article className="data-card" key={channel.id}>
                <div className="data-card-icon">
                  {channel.platform === "YouTube" ? "▶" : "♪"}
                </div>

                <div>
                  <h3>{channel.name}</h3>
                  <p>{channel.category}</p>
                </div>

                <div className="card-actions">
                  <span className="status-badge">
                    {channel.status === "connected" ? "متصل" : "قيد الإعداد"}
                  </span>

                  <button
                    className="danger-button"
                    type="button"
                    onClick={() => void deleteChannel(channel.id)}
                  >
                    حذف
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  }

  function renderFactory() {
    const items = data?.content || [];

    return (
      <section className="section-panel">
        <div className="section-heading">
          <div>
            <span className="section-label">PRODUCTION PIPELINE</span>
            <h2>مسار إنتاج المحتوى</h2>
          </div>

          <button
            className="primary-button compact"
            type="button"
            onClick={() => setModal("content")}
          >
            ＋ إنشاء محتوى
          </button>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">▣</div>
            <h3>لا يوجد محتوى قيد الإنتاج</h3>
            <p>أنشئ أول محتوى لبدء خط الإنتاج.</p>
          </div>
        ) : (
          <div className="pipeline-list">
            {items.map((item) => (
              <article className="production-card" key={item.id}>
                <div className="production-header">
                  <div>
                    <span className="status-badge">
                      {contentStageNames[item.status]}
                    </span>
                    <h3>{item.title}</h3>
                    <p>
                      {item.platform === "Both"
                        ? "YouTube + TikTok"
                        : item.platform}
                      {" · "}
                      {item.format}
                    </p>
                  </div>

                  <strong>{item.progress}%</strong>
                </div>

                <div className="production-progress">
                  <span style={{ width: `${item.progress}%` }} />
                </div>

                <div className="production-actions">
                  <button
                    className="secondary-button"
                    type="button"
                    disabled={working || item.status === "published"}
                    onClick={() => void advanceContent(item.id)}
                  >
                    {item.status === "published"
                      ? "اكتمل الإنتاج"
                      : "نقل للمرحلة التالية"}
                  </button>

                  <button
                    className="danger-button"
                    type="button"
                    disabled={working}
                    onClick={() => void deleteContent(item.id)}
                  >
                    حذف
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    );
  }

  function renderDashboard() {
    return (
      <>
        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon">▶</span>
              <span className="stat-status">API</span>
            </div>
            <strong className="stat-value">{youtubeChannels.length}</strong>
            <h3>قنوات YouTube</h3>
            <p>بيانات محفوظة في الخادم</p>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon">♪</span>
              <span className="stat-status">API</span>
            </div>
            <strong className="stat-value">{tiktokChannels.length}</strong>
            <h3>حسابات TikTok</h3>
            <p>بيانات محفوظة في الخادم</p>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon">▣</span>
              <span className="stat-status">API</span>
            </div>
            <strong className="stat-value">
              {data?.content.length || 0}
            </strong>
            <h3>المحتوى</h3>
            <p>عناصر خط الإنتاج الحالية</p>
          </article>

          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon">✦</span>
              <span className="stat-status">مباشر</span>
            </div>
            <strong className="stat-value">
              {data?.system.api === "operational" ? "جاهز" : "غير متصل"}
            </strong>
            <h3>الخادم الخلفي</h3>
            <p>CreatorOS Backend API</p>
          </article>
        </section>

        <section className="workspace-grid">
          <div className="section-panel">
            <div className="section-heading">
              <div>
                <span className="section-label">QUICK ACTIONS</span>
                <h2>مركز العمليات</h2>
              </div>
            </div>

            <div className="actions-grid">
              <button
                className="action-card"
                type="button"
                onClick={() => setModal("content")}
              >
                <span className="action-icon">＋</span>
                <span className="action-copy">
                  <strong>إنشاء محتوى</strong>
                  <small>إضافة محتوى إلى خط الإنتاج</small>
                </span>
                <span>←</span>
              </button>

              <button
                className="action-card"
                type="button"
                onClick={() => openChannel("YouTube")}
              >
                <span className="action-icon">▶</span>
                <span className="action-copy">
                  <strong>إضافة قناة YouTube</strong>
                  <small>حفظ قناة في قاعدة بيانات النظام</small>
                </span>
                <span>←</span>
              </button>

              <button
                className="action-card"
                type="button"
                onClick={() => openChannel("TikTok")}
              >
                <span className="action-icon">♪</span>
                <span className="action-copy">
                  <strong>إضافة حساب TikTok</strong>
                  <small>حفظ حساب في قاعدة بيانات النظام</small>
                </span>
                <span>←</span>
              </button>

              <button
                className="action-card"
                type="button"
                onClick={() => void loadDashboard()}
              >
                <span className="action-icon">↻</span>
                <span className="action-copy">
                  <strong>تحديث البيانات</strong>
                  <small>جلب أحدث البيانات من الخادم</small>
                </span>
                <span>←</span>
              </button>
            </div>
          </div>

          <aside className="section-panel intelligence-panel">
            <span className="section-label">LIVE SYSTEM</span>
            <h2>حالة الاتصال</h2>

            <div className="ai-message">
              <span>✦</span>
              <p>
                الواجهة متصلة الآن بالخادم الخلفي، والبيانات لا تختفي عند
                تحديث الصفحة.
              </p>
            </div>

            <div className="readiness">
              <div className="readiness-row">
                <span>Backend API</span>
                <strong>متصل</strong>
              </div>
              <div className="progress">
                <span style={{ width: "100%" }} />
              </div>

              <div className="readiness-row">
                <span>محرك السكربت</span>
                <strong>جاهز</strong>
              </div>
              <div className="progress">
                <span style={{ width: "100%" }} />
              </div>

              <div className="readiness-row">
                <span>محرك الإنتاج</span>
                <strong>جاهز</strong>
              </div>
              <div className="progress">
                <span style={{ width: "100%" }} />
              </div>
            </div>
          </aside>
        </section>

        {renderFactory()}
      </>
    );
  }

  function renderSettings() {
    return (
      <section className="section-panel settings-grid">
        <div className="setting-card">
          <h3>عنوان Backend API</h3>
          <p>العنوان المستخدم حاليًا للاتصال.</p>

          <input
            id="api-url"
            defaultValue={
              localStorage.getItem("creatoros-api-url") ||
              "http://localhost:3000"
            }
          />

          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              const input = document.getElementById(
                "api-url",
              ) as HTMLInputElement;

              localStorage.setItem(
                "creatoros-api-url",
                input.value.trim(),
              );

              location.reload();
            }}
          >
            حفظ وإعادة الاتصال
          </button>
        </div>

        <div className="setting-card">
          <h3>حالة قاعدة البيانات</h3>
          <p>يتم حفظ البيانات في ملف JSON داخل Backend.</p>
          <strong>apps/api/data/creator-dashboard.json</strong>
        </div>
      </section>
    );
  }

  if (loading && !data) {
    return <div className="startup-screen">جاري الاتصال بـ CreatorOS API...</div>;
  }

  const headings: Record<Page, [string, string, string]> = {
    dashboard: [
      "CREATOR COMMAND CENTER",
      "لوحة تحكم المحتوى",
      "الواجهة متصلة الآن بالخادم الخلفي الحقيقي.",
    ],
    youtube: [
      "YOUTUBE NETWORK",
      "قنوات YouTube",
      "إدارة القنوات المحفوظة داخل النظام.",
    ],
    tiktok: [
      "TIKTOK NETWORK",
      "حسابات TikTok",
      "إدارة حسابات TikTok داخل النظام.",
    ],
    factory: [
      "CONTENT FACTORY",
      "مصنع المحتوى",
      "إدارة تقدم كل محتوى عبر مراحل الإنتاج.",
    ],
    settings: [
      "SYSTEM SETTINGS",
      "الإعدادات",
      "إدارة الاتصال بين الواجهة والخادم.",
    ],
  };

  const heading = headings[page];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">C</div>
          <div>
            <strong>CreatorOS</strong>
            <span>AI MEDIA OPERATING SYSTEM</span>
          </div>
        </div>

        <nav className="navigation">
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              className={page === item.id ? "nav-item active" : "nav-item"}
              onClick={() => setPage(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="system-card">
          <span className="system-light" />
          <div>
            <strong>Backend API متصل</strong>
            <small>البيانات محفوظة في الخادم</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">{heading[0]}</span>
            <h1>{heading[1]}</h1>
            <p>{heading[2]}</p>
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={() => setModal("content")}
          >
            ＋ إنشاء محتوى جديد
          </button>
        </header>

        {error && (
          <div className="api-error">
            <strong>خطأ في الاتصال:</strong>
            <span>{error}</span>
            <button type="button" onClick={() => void loadDashboard()}>
              إعادة المحاولة
            </button>
          </div>
        )}

        {page === "dashboard" && renderDashboard()}
        {page === "youtube" &&
          renderChannels(youtubeChannels, "YouTube")}
        {page === "tiktok" &&
          renderChannels(tiktokChannels, "TikTok")}
        {page === "factory" && renderFactory()}
        {page === "settings" && renderSettings()}
      </main>

      {modal === "channel" && (
        <Modal
          title={
            channelPlatform === "YouTube"
              ? "إضافة قناة YouTube"
              : "إضافة حساب TikTok"
          }
          onClose={() => setModal(null)}
        >
          <form className="modal-form" onSubmit={submitChannel}>
            <label>
              اسم القناة أو الحساب
              <input
                autoFocus
                value={channelName}
                onChange={(event) => setChannelName(event.target.value)}
                placeholder="اسم القناة"
                required
              />
            </label>

            <label>
              المنصة
              <select
                value={channelPlatform}
                onChange={(event) =>
                  setChannelPlatform(event.target.value as Platform)
                }
              >
                <option value="YouTube">YouTube</option>
                <option value="TikTok">TikTok</option>
              </select>
            </label>

            <label>
              التصنيف
              <input
                value={channelCategory}
                onChange={(event) =>
                  setChannelCategory(event.target.value)
                }
                placeholder="تقنية، قصص، تعليم..."
              />
            </label>

            <button
              className="primary-button modal-submit"
              type="submit"
              disabled={working}
            >
              {working ? "جاري الحفظ..." : "حفظ في الخادم"}
            </button>
          </form>
        </Modal>
      )}

      {modal === "content" && (
        <Modal
          title="إنشاء محتوى جديد"
          onClose={() => setModal(null)}
        >
          <form className="modal-form" onSubmit={submitContent}>
            <label>
              عنوان أو فكرة المحتوى
              <textarea
                autoFocus
                value={contentTitle}
                onChange={(event) =>
                  setContentTitle(event.target.value)
                }
                placeholder="اكتب فكرة الفيديو..."
                required
              />
            </label>

            <label>
              منصة النشر
              <select
                value={contentPlatform}
                onChange={(event) =>
                  setContentPlatform(
                    event.target.value as ContentPlatform,
                  )
                }
              >
                <option value="YouTube">YouTube</option>
                <option value="TikTok">TikTok</option>
                <option value="Both">YouTube + TikTok</option>
              </select>
            </label>

            <label>
              نوع المحتوى
              <select
                value={contentFormat}
                onChange={(event) =>
                  setContentFormat(event.target.value)
                }
              >
                <option>فيديو طويل</option>
                <option>Short / Reel</option>
                <option>فيديو قصصي</option>
                <option>فيديو تعليمي</option>
                <option>سلسلة فيديوهات</option>
              </select>
            </label>

            <button
              className="primary-button modal-submit"
              type="submit"
              disabled={working}
            >
              {working ? "جاري الإنشاء..." : "بدء الإنتاج"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);