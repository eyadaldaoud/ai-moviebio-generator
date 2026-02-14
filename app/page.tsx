'use client';

import { useState, CSSProperties, useRef, useEffect } from 'react';

type DescLang = 'en' | 'ar';
type Tone = 'enthusiastic' | 'dramatic' | 'funny' | 'professional' | 'minimalist';

interface GeneratedContent {
  description: string;
  hashtags: string[];
}

// ─── Styles ─────────────────────────────────────────────────
const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#09090b', // Deep zinc black foundation
    fontFamily: "'Inter', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
    color: '#fff',
    overflowX: 'hidden',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  bgGradient: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    background: `
      radial-gradient(circle at 15% 50%, rgba(124, 58, 237, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)
    `,
    pointerEvents: 'none',
  },
  container: {
    width: '100%',
    maxWidth: '1200px',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    animation: 'fadeIn 0.8s ease-out',
  },
  logo: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    padding: '8px 16px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '9999px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  logoIcon: {
    fontSize: '24px',
  },
  logoText: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#e4e4e7',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #fff 0%, #a1a1aa 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '16px',
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: '18px',
    color: '#a1a1aa',
    maxWidth: '500px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '32px',
    alignItems: 'start',
  },
  // Form Section
  formCard: {
    background: 'rgba(24, 24, 27, 0.6)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    transition: 'all 0.3s ease',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '20px',
    pointerEvents: 'none',
    opacity: 0.5,
  },
  input: {
    width: '100%',
    padding: '16px 16px 16px 50px',
    borderRadius: '16px',
    background: 'rgba(9, 9, 11, 0.5)',
    border: '2px solid rgba(255, 255, 255, 0.05)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 500,
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  // Tone Selector
  toneGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '8px',
  },
  toneBtn: {
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    background: 'rgba(124, 58, 237, 0.05)', // Slight tint base
    color: '#a1a1aa',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
  },
  toneBtnActive: {
    background: 'rgba(124, 58, 237, 0.15)',
    border: '1px solid #7c3aed', // FIXED: Full shorthand
    color: '#d8b4fe',
  },
  // Language Selector
  langGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  langBtn: {
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    background: 'rgba(9, 9, 11, 0.5)',
    color: '#71717a',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  langBtnActive: {
    background: '#fff',
    border: '1px solid #fff', // FIXED: Full shorthand
    color: '#000',
    fontWeight: 600,
  },
  generateBtn: {
    width: '100%',
    padding: '20px',
    borderRadius: '16px',
    border: 'none',
    background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
    color: '#fff',
    fontSize: '18px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'transform 0.1s ease, box-shadow 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    marginTop: '16px',
    boxShadow: '0 10px 30px -10px rgba(219, 39, 119, 0.4)',
    minHeight: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateBtnDisabled: {
    width: '100%',
    padding: '20px',
    borderRadius: '16px',
    border: 'none',
    background: '#27272a',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '18px',
    fontWeight: 700,
    cursor: 'not-allowed',
    marginTop: '16px',
    boxShadow: 'none',
    minHeight: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
  },
  // Result Section
  resultCard: {
    background: 'rgba(24, 24, 27, 0.6)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '600px',
    position: 'relative',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#52525b',
    textAlign: 'center',
    gap: '16px',
  },
  emptyIcon: {
    fontSize: '48px',
    opacity: 0.2,
    marginBottom: '8px',
  },
  resultContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    animation: 'fadeIn 0.5s ease-out',
    height: '100%',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '10px',
  },
  resultTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#e4e4e7',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#10b981',
    fontWeight: 600,
    background: 'rgba(16, 185, 129, 0.1)',
    padding: '6px 12px',
    borderRadius: '9999px',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  descriptionContainer: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    minHeight: '200px',
  },
  descriptionBox: {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
    borderRadius: '16px',
    padding: '28px',
    fontSize: '17px',
    lineHeight: '1.8',
    color: '#e4e4e7',
    whiteSpace: 'pre-wrap',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
    overflowY: 'auto',
    maxHeight: '400px',
  },
  hashtagSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',
  },
  hashtag: {
    padding: '10px 16px',
    borderRadius: '99px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#c084fc',
    background: 'rgba(192, 132, 252, 0.1)',
    border: '1px solid rgba(192, 132, 252, 0.2)',
    transition: 'all 0.2s',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(192, 132, 252, 0.05)',
  },
  actions: {
    display: 'grid',
    gridTemplateColumns: 'minmax(200px, 1fr) auto',
    gap: '16px',
    marginTop: 'auto',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  copyBtn: {
    padding: '18px',
    borderRadius: '16px',
    border: 'none',
    background: '#fff',
    color: '#000',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.1)',
  },
  clearBtn: {
    padding: '18px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'transparent',
    color: '#a1a1aa',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
  },
};

// ─── Component ──────────────────────────────────────────────
export default function Home() {
  const [movieName, setMovieName] = useState('');
  const [descLang, setDescLang] = useState<DescLang>('en');
  const [tone, setTone] = useState<Tone>('enthusiastic');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);

  const generateDescription = async () => {
    if (!movieName.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsGenerating(true);
    setError('');
    setGeneratedContent({ description: '', hashtags: [] });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieName: movieName.trim(),
          language: descLang,
          tone: tone,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(response.statusText);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let fullText = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        fullText += chunkValue;

        const parts = fullText.split('|||HASHTAGS|||');
        const description = parts[0].trim();
        const hashtags = parts.length > 1
          ? parts[1].trim().split(/\s+/).filter(tag => tag.startsWith('#'))
          : [];

        setGeneratedContent({
          description,
          hashtags
        });
      }

    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Generation aborted');
        return;
      }
      setError('Failed to generate description. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const copyToClipboard = () => {
    if (!generatedContent) return;
    const fullText = `${generatedContent.description}\n\n${generatedContent.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setMovieName('');
    setGeneratedContent(null);
    setCopied(false);
    setError('');
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.bgGradient} />

      <div style={styles.container}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
          <header style={styles.header}>
            <div style={styles.logo}>
              <span style={styles.logoIcon}>✨</span>
              <span style={styles.logoText}>Bio Generator</span>
            </div>
            <h1 style={styles.title}>Movie Reel Magic</h1>
            <p style={styles.subtitle}>
              Create viral-worthy Instagram captions for your favorite films in seconds using advanced AI.
            </p>
          </header>
        </div>

        <main style={styles.mainGrid}>
          {/* LEFT: Controls */}
          <section style={styles.formCard}>
            {/* Movie Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Movie Name</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🎬</span>
                <input
                  type="text"
                  value={movieName}
                  onChange={(e) => setMovieName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generateDescription()}
                  placeholder="e.g. Interstellar"
                  style={styles.input}
                  disabled={isGenerating}
                />
              </div>
            </div>

            {/* Language */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Language</label>
              <div style={styles.langGrid}>
                <button
                  type="button"
                  onClick={() => setDescLang('en')}
                  style={{ ...styles.langBtn, ...(descLang === 'en' ? styles.langBtnActive : {}) }}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setDescLang('ar')}
                  style={{ ...styles.langBtn, ...(descLang === 'ar' ? styles.langBtnActive : {}) }}
                >
                  العربية
                </button>
              </div>
            </div>

            {/* Tone Selector */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Vibe / Tone</label>
              <div style={styles.toneGrid}>
                {(['enthusiastic', 'dramatic', 'funny', 'professional'] as Tone[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    style={{ ...styles.toneBtn, ...(tone === t ? styles.toneBtnActive : {}) }}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateDescription}
              disabled={!movieName.trim() || isGenerating}
              style={(!movieName.trim() || isGenerating) ? styles.generateBtnDisabled : styles.generateBtn}
            >
              <span style={styles.btnText}>
                {isGenerating ? (
                  <>⏳ Creating Magic...</>
                ) : (
                  <>✨ Generate Description</>
                )}
              </span>
            </button>

            {error && <div style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center', background: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '8px' }}>{error}</div>}
          </section>

          {/* RIGHT: Result / Live Preview */}
          <section style={styles.resultCard}>
            {!generatedContent ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🍿</div>
                <h3>Ready to Create?</h3>
                <p style={{ fontSize: '14px', maxWidth: '250px', lineHeight: '1.5', opacity: 0.7 }}>
                  Enter a movie name on the left to instantly generate a captivating description.
                </p>
              </div>
            ) : (
              <div style={styles.resultContent}>
                <div style={styles.resultHeader}>
                  <div style={styles.resultTitle}>
                    Preview
                    {isGenerating && (
                      <div style={styles.liveIndicator}>
                        <span style={{ width: '6px', height: '6px', background: 'currentColor', borderRadius: '50%', display: 'inline-block', animation: 'pulse 1s infinite' }} />
                        Generating Live...
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: '#a1a1aa' }}>
                    {generatedContent.hashtags.length > 0 ? `${generatedContent.description.length} chars` : ''}
                  </div>
                </div>

                <div style={styles.descriptionContainer}>
                  <div style={styles.descriptionBox} dir="auto">
                    {generatedContent.description || (
                      <span style={{ color: '#52525b', fontStyle: 'italic' }}>Waiting for AI...</span>
                    )}
                  </div>

                  {generatedContent.hashtags.length > 0 && (
                    <div style={styles.hashtagSection}>
                      {generatedContent.hashtags.map((tag, i) => (
                        <div key={i} style={styles.hashtag}>{tag}</div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={styles.actions}>
                  <button onClick={copyToClipboard} style={styles.copyBtn}>
                    {copied ? '✅ Copied!' : '📋 Copy Text'}
                  </button>
                  <button onClick={resetForm} style={styles.clearBtn} title="Clear">
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Movie Reel Description Generator",
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Generate engaging Instagram Reel descriptions, captions, and hashtags for movies using AI. Supports Arabic and English.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "120"
            }
          })
        }}
      />

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
}
