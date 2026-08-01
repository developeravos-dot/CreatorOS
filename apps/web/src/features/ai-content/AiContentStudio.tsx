import { FormEvent, useMemo, useState } from 'react';
import {
  createProductionPackage,
  Platform,
  ProductionPackageResponse,
} from './ai-content-api';

type ActiveTab =
  | 'script'
  | 'scenes'
  | 'production'
  | 'optimization'
  | 'quality';

const panelStyle: React.CSSProperties = {
  border: '1px solid #26324a',
  borderRadius: 16,
  padding: 20,
  background: '#101827',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: 10,
  border: '1px solid #34435f',
  background: '#0a1020',
  color: '#f5f7ff',
  padding: '12px 14px',
  fontSize: 15,
};

const buttonStyle: React.CSSProperties = {
  border: 0,
  borderRadius: 10,
  padding: '12px 18px',
  cursor: 'pointer',
  fontWeight: 700,
};

function copyText(value: string): void {
  void navigator.clipboard.writeText(value);
}

export function AiContentStudio() {
  const [topic, setTopic] = useState(
    'How artificial intelligence is changing education',
  );
  const [audience, setAudience] = useState(
    'Students and young professionals interested in technology',
  );
  const [platform, setPlatform] = useState<Platform>('YouTube');
  const [tone, setTone] = useState('professional');
  const [durationSeconds, setDurationSeconds] = useState(360);
  const [result, setResult] =
    useState<ProductionPackageResponse | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('script');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fullScript = useMemo(() => {
    if (!result) return '';

    return [
      result.script.title,
      '',
      `Hook: ${result.script.hook}`,
      '',
      result.script.introduction,
      '',
      ...result.script.sections.flatMap((section, index) => [
        `${index + 1}. ${section.heading}`,
        section.narration,
        `Visual: ${section.visualDirection}`,
        `On screen: ${section.onScreenText}`,
        '',
      ]),
      `CTA: ${result.script.callToAction}`,
    ].join('\n');
  }, [result]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!topic.trim() || !audience.trim()) {
      setError('اكتب الموضوع والجمهور المستهدف.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await createProductionPackage({
        topic: topic.trim(),
        audience: audience.trim(),
        platform,
        tone: tone.trim() || 'professional',
        durationSeconds,
      });

      setResult(response);
      setActiveTab('script');
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'حدث خطأ غير معروف.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top, #19243b 0%, #090e19 48%, #050811 100%)',
        color: '#f4f7ff',
        padding: 28,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1450, margin: '0 auto' }}>
        <header style={{ marginBottom: 24 }}>
          <div style={{ color: '#6ea8ff', fontWeight: 800 }}>
            CreatorOS
          </div>
          <h1 style={{ margin: '8px 0', fontSize: 38 }}>
            AI Content Studio
          </h1>
          <p style={{ color: '#a9b5ca', margin: 0 }}>
            إنشاء فكرة وسيناريو وخطة مشاهد وإنتاج وتحسين نشر من طلب واحد.
          </p>
        </header>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 390px) minmax(0, 1fr)',
            gap: 22,
            alignItems: 'start',
          }}
        >
          <form onSubmit={handleSubmit} style={panelStyle}>
            <h2 style={{ marginTop: 0 }}>إعداد المحتوى</h2>

            <label>
              <div style={{ marginBottom: 8 }}>الموضوع</div>
              <textarea
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                maxLength={200}
                rows={4}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </label>

            <label style={{ display: 'block', marginTop: 16 }}>
              <div style={{ marginBottom: 8 }}>الجمهور المستهدف</div>
              <textarea
                value={audience}
                onChange={(event) => setAudience(event.target.value)}
                maxLength={200}
                rows={4}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </label>

            <label style={{ display: 'block', marginTop: 16 }}>
              <div style={{ marginBottom: 8 }}>المنصة</div>
              <select
                value={platform}
                onChange={(event) =>
                  setPlatform(event.target.value as Platform)
                }
                style={inputStyle}
              >
                <option value="YouTube">YouTube</option>
                <option value="TikTok">TikTok</option>
                <option value="Both">YouTube + TikTok</option>
              </select>
            </label>

            <label style={{ display: 'block', marginTop: 16 }}>
              <div style={{ marginBottom: 8 }}>الأسلوب</div>
              <input
                value={tone}
                onChange={(event) => setTone(event.target.value)}
                style={inputStyle}
              />
            </label>

            <label style={{ display: 'block', marginTop: 16 }}>
              <div style={{ marginBottom: 8 }}>
                المدة بالثواني: {durationSeconds}
              </div>
              <input
                type="range"
                min={30}
                max={900}
                step={30}
                value={durationSeconds}
                onChange={(event) =>
                  setDurationSeconds(Number(event.target.value))
                }
                style={{ width: '100%' }}
              />
            </label>

            {error && (
              <div
                style={{
                  marginTop: 16,
                  padding: 12,
                  background: '#4a1722',
                  borderRadius: 10,
                  color: '#ffb5c0',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                width: '100%',
                marginTop: 20,
                background: loading ? '#45516a' : '#2563eb',
                color: '#fff',
              }}
            >
              {loading ? 'جارٍ إنشاء الحزمة...' : 'إنشاء حزمة الإنتاج'}
            </button>
          </form>

          <section style={{ minWidth: 0 }}>
            {!result ? (
              <div
                style={{
                  ...panelStyle,
                  minHeight: 420,
                  display: 'grid',
                  placeItems: 'center',
                  textAlign: 'center',
                  color: '#9caac1',
                }}
              >
                <div>
                  <div style={{ fontSize: 52, marginBottom: 14 }}>✦</div>
                  <h2 style={{ color: '#eef3ff' }}>
                    حزمة الإنتاج ستظهر هنا
                  </h2>
                  <p>
                    أدخل الموضوع والجمهور والمنصة ثم اضغط إنشاء.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div style={{ ...panelStyle, marginBottom: 18 }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: 12,
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <div style={{ color: '#71e2a9', fontWeight: 700 }}>
                        {result.provider} · {result.model}
                      </div>
                      <h2 style={{ marginBottom: 8 }}>{result.title}</h2>
                      <p style={{ color: '#b7c2d5' }}>{result.hook}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        copyText(JSON.stringify(result, null, 2))
                      }
                      style={{
                        ...buttonStyle,
                        background: '#25324a',
                        color: '#fff',
                        height: 44,
                      }}
                    >
                      نسخ JSON
                    </button>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 8,
                      marginTop: 14,
                    }}
                  >
                    {[result.platform, result.contentType, `${result.duration}s`].map(
                      (value) => (
                        <span
                          key={value}
                          style={{
                            background: '#1d2940',
                            borderRadius: 999,
                            padding: '7px 12px',
                            color: '#c9d4e8',
                          }}
                        >
                          {value}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <nav
                  style={{
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                    marginBottom: 16,
                  }}
                >
                  {(
                    [
                      ['script', 'السيناريو'],
                      ['scenes', 'المشاهد'],
                      ['production', 'الإنتاج'],
                      ['optimization', 'SEO والنشر'],
                      ['quality', 'الجودة'],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveTab(id)}
                      style={{
                        ...buttonStyle,
                        background:
                          activeTab === id ? '#2563eb' : '#172238',
                        color: '#fff',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </nav>

                {activeTab === 'script' && (
                  <div style={panelStyle}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <h2 style={{ marginTop: 0 }}>السيناريو</h2>
                      <button
                        type="button"
                        onClick={() => copyText(fullScript)}
                        style={{
                          ...buttonStyle,
                          background: '#25324a',
                          color: '#fff',
                        }}
                      >
                        نسخ السيناريو
                      </button>
                    </div>

                    <p style={{ color: '#c7d1e3' }}>
                      {result.script.introduction}
                    </p>

                    {result.script.sections.map((section, index) => (
                      <article
                        key={`${section.heading}-${index}`}
                        style={{
                          marginTop: 16,
                          padding: 16,
                          background: '#0b1322',
                          borderRadius: 12,
                        }}
                      >
                        <h3>
                          {index + 1}. {section.heading}
                        </h3>
                        <p>{section.narration}</p>
                        <p style={{ color: '#7fb3ff' }}>
                          التوجيه البصري: {section.visualDirection}
                        </p>
                        <small style={{ color: '#9cabc1' }}>
                          النص الظاهر: {section.onScreenText} ·{' '}
                          {section.durationSeconds} ثانية
                        </small>
                      </article>
                    ))}

                    <div
                      style={{
                        marginTop: 18,
                        padding: 14,
                        borderRadius: 12,
                        background: '#172d25',
                        color: '#aef0cc',
                      }}
                    >
                      CTA: {result.script.callToAction}
                    </div>
                  </div>
                )}

                {activeTab === 'scenes' && (
                  <div style={panelStyle}>
                    <h2 style={{ marginTop: 0 }}>خطة المشاهد</h2>
                    {result.scenePlan.map((scene) => (
                      <article
                        key={scene.sceneNumber}
                        style={{
                          padding: 16,
                          marginTop: 14,
                          borderRadius: 12,
                          background: '#0b1322',
                        }}
                      >
                        <h3>
                          المشهد {scene.sceneNumber}: {scene.heading}
                        </h3>
                        <p><strong>Voice-over:</strong> {scene.voiceOver}</p>
                        <p style={{ color: '#7fb3ff' }}>
                          <strong>Visual prompt:</strong>{' '}
                          {scene.visualPrompt}
                        </p>
                        <p>
                          <strong>المونتاج:</strong>{' '}
                          {scene.editingDirection}
                        </p>
                        <small style={{ color: '#9cabc1' }}>
                          {scene.music} · {scene.soundEffects} ·{' '}
                          {scene.durationSeconds}s
                        </small>
                      </article>
                    ))}
                  </div>
                )}

                {activeTab === 'production' && (
                  <div style={panelStyle}>
                    <h2 style={{ marginTop: 0 }}>خطة الإنتاج</h2>
                    <p><strong>الأسلوب البصري:</strong> {result.productionPlan.visualStyle}</p>
                    <p><strong>الصوت:</strong> {result.productionPlan.voiceStyle}</p>
                    <p><strong>الموسيقى:</strong> {result.productionPlan.musicStyle}</p>
                    <p><strong>المونتاج:</strong> {result.productionPlan.editingStyle}</p>

                    <h3>Prompt الصورة المصغرة</h3>
                    <div
                      style={{
                        padding: 14,
                        background: '#0b1322',
                        borderRadius: 12,
                        color: '#a9c9ff',
                      }}
                    >
                      {result.productionPlan.thumbnailPrompt}
                    </div>

                    <h3>الأصول المطلوبة</h3>
                    <ul>
                      {result.productionPlan.requiredAssets.map((asset) => (
                        <li key={asset}>{asset}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'optimization' && (
                  <div style={panelStyle}>
                    <h2 style={{ marginTop: 0 }}>SEO والتحسين</h2>
                    <h3>{result.optimization.title}</h3>
                    <p>{result.optimization.description}</p>

                    <h3>Tags</h3>
                    <p>{result.optimization.tags.join(' · ')}</p>

                    <h3>Hashtags</h3>
                    <p style={{ color: '#78aaff' }}>
                      {result.optimization.hashtags.join(' ')}
                    </p>

                    <h3>Keywords</h3>
                    <p>{result.optimization.keywords.join(' · ')}</p>
                  </div>
                )}

                {activeTab === 'quality' && (
                  <div style={panelStyle}>
                    <h2 style={{ marginTop: 0 }}>قائمة الجودة</h2>
                    {result.qualityChecklist.map((item) => (
                      <div
                        key={item}
                        style={{
                          padding: 13,
                          marginTop: 10,
                          background: '#10261e',
                          borderRadius: 10,
                          color: '#b6f2d1',
                        }}
                      >
                        ✓ {item}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default AiContentStudio;
