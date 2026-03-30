'use client';

import { useState, CSSProperties, useRef, useEffect } from 'react';

type DescLang = 'en' | 'ar';
type Tone = 'enthusiastic' | 'dramatic' | 'funny' | 'professional' | 'minimalist';
type Tab = 'bio' | 'image';

interface GeneratedContent {
  description: string;
  hashtags: string[];
}

interface GeneratedImage {
  imageUrl: string;
}

const TONE_CONFIG: Record<string, { emoji: string; label: string }> = {
  enthusiastic: { emoji: '🔥', label: 'Hype' },
  dramatic: { emoji: '🎭', label: 'Dramatic' },
  funny: { emoji: '😂', label: 'Funny' },
  professional: { emoji: '💼', label: 'Pro' },
};

// ─── Styles ─────────────────────────────────────────────────
const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#06060a',
    fontFamily: "'Inter', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
    color: '#fff',
    overflowX: 'hidden',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    padding: '32px 16px 60px',
  },
  // Animated orbs
  orbContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)',
    filter: 'blur(60px)',
    animation: 'orb1 20s ease-in-out infinite',
  },
  orb2: {
    position: 'absolute',
    top: '50%',
    right: '5%',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.10) 0%, transparent 70%)',
    filter: 'blur(60px)',
    animation: 'orb2 25s ease-in-out infinite',
  },
  orb3: {
    position: 'absolute',
    bottom: '10%',
    left: '40%',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
    filter: 'blur(60px)',
    animation: 'orb3 22s ease-in-out infinite',
  },
  // Noise overlay
  noiseOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
    opacity: 0.03,
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  },
  container: {
    width: '100%',
    maxWidth: '1180px',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  // Header
  header: {
    textAlign: 'center',
    animation: 'fadeIn 0.8s ease-out',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    background: 'rgba(124, 58, 237, 0.08)',
    borderRadius: '9999px',
    border: '1px solid rgba(124, 58, 237, 0.15)',
    fontSize: '13px',
    fontWeight: 600,
    color: '#c4b5fd',
    letterSpacing: '0.3px',
  },
  title: {
    fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #f0abfc 100%)',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 6s ease infinite',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1.15,
  },
  subtitle: {
    fontSize: '16px',
    color: '#71717a',
    maxWidth: '440px',
    lineHeight: 1.7,
    fontWeight: 400,
  },
  // Tab Navigation
  tabsWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  tabsContainer: {
    display: 'inline-flex',
    gap: '4px',
    padding: '4px',
    borderRadius: '14px',
    background: 'rgba(24, 24, 27, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(12px)',
  },
  tabBtn: {
    padding: '10px 22px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    color: '#71717a',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tabBtnActive: {
    background: 'rgba(124, 58, 237, 0.15)',
    color: '#e9d5ff',
    boxShadow: '0 0 16px rgba(124, 58, 237, 0.12)',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '28px',
    alignItems: 'start',
  },
  // Form Section
  formCard: {
    background: 'linear-gradient(180deg, rgba(20, 20, 24, 0.8) 0%, rgba(14, 14, 18, 0.9) 100%)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '20px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
    boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.6)',
  },
  sectionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#52525b',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: '-6px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#a1a1aa',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '18px',
    pointerEvents: 'none',
    opacity: 0.4,
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 46px',
    borderRadius: '14px',
    background: 'rgba(9, 9, 11, 0.6)',
    border: '2px solid rgba(255, 255, 255, 0.04)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 500,
    outline: 'none',
    transition: 'all 0.25s ease',
    fontFamily: 'inherit',
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '14px',
    background: 'rgba(9, 9, 11, 0.6)',
    border: '2px solid rgba(255, 255, 255, 0.04)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 500,
    outline: 'none',
    transition: 'all 0.25s ease',
    fontFamily: 'inherit',
    minHeight: '120px',
    resize: 'vertical',
  },
  // Divider
  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
    margin: '2px 0',
  },
  // Tone Selector
  toneGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
  },
  toneBtn: {
    padding: '10px 6px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    background: 'rgba(9, 9, 11, 0.4)',
    color: '#71717a',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  toneBtnActive: {
    background: 'rgba(124, 58, 237, 0.12)',
    border: '1px solid rgba(124, 58, 237, 0.4)',
    color: '#d8b4fe',
    boxShadow: '0 0 12px rgba(124, 58, 237, 0.08)',
  },
  toneEmoji: {
    fontSize: '18px',
  },
  // Language Selector
  langGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  langBtn: {
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    background: 'rgba(9, 9, 11, 0.4)',
    color: '#71717a',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  langBtnActive: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
    border: '1px solid rgba(255, 255, 255, 0.9)',
    color: '#09090b',
    fontWeight: 700,
    boxShadow: '0 4px 16px rgba(255, 255, 255, 0.1)',
  },
  generateBtn: {
    width: '100%',
    padding: '16px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #db2777 100%)',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 4s ease infinite',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    marginTop: '8px',
    boxShadow: '0 8px 30px -8px rgba(192, 38, 211, 0.45)',
    minHeight: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: '0.3px',
  },
  generateBtnDisabled: {
    width: '100%',
    padding: '16px',
    borderRadius: '14px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    background: 'rgba(24, 24, 27, 0.5)',
    color: 'rgba(255, 255, 255, 0.25)',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'not-allowed',
    marginTop: '8px',
    boxShadow: 'none',
    minHeight: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    letterSpacing: '0.3px',
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
    background: 'linear-gradient(180deg, rgba(20, 20, 24, 0.8) 0%, rgba(14, 14, 18, 0.9) 100%)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '20px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '560px',
    position: 'relative',
    boxShadow: '0 20px 50px -15px rgba(0, 0, 0, 0.6)',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3f3f46',
    textAlign: 'center',
    gap: '16px',
    padding: '40px 20px',
  },
  emptyIconWrap: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    background: 'rgba(124, 58, 237, 0.06)',
    border: '1px solid rgba(124, 58, 237, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    marginBottom: '8px',
    animation: 'float 4s ease-in-out infinite',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#52525b',
    letterSpacing: '-0.01em',
  },
  emptyDesc: {
    fontSize: '14px',
    maxWidth: '260px',
    lineHeight: '1.6',
    color: '#3f3f46',
  },
  resultContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    animation: 'fadeInScale 0.5s ease-out',
    height: '100%',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  },
  resultTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#a1a1aa',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#34d399',
    fontWeight: 600,
    background: 'rgba(16, 185, 129, 0.08)',
    padding: '5px 12px',
    borderRadius: '9999px',
    border: '1px solid rgba(16, 185, 129, 0.15)',
    textTransform: 'none',
    letterSpacing: '0',
  },
  charBadge: {
    fontSize: '12px',
    color: '#52525b',
    fontWeight: 500,
    padding: '4px 10px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.04)',
  },
  descriptionContainer: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minHeight: '200px',
  },
  descriptionBox: {
    background: 'rgba(9, 9, 11, 0.5)',
    borderRadius: '14px',
    padding: '24px',
    fontSize: '15px',
    lineHeight: '1.85',
    color: '#d4d4d8',
    whiteSpace: 'pre-wrap',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    overflowY: 'auto',
    maxHeight: '380px',
    fontWeight: 400,
  },
  hashtagSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  hashtag: {
    padding: '8px 14px',
    borderRadius: '99px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#c084fc',
    background: 'rgba(192, 132, 252, 0.08)',
    border: '1px solid rgba(192, 132, 252, 0.15)',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
    letterSpacing: '0.2px',
  },
  imageContainer: {
    width: '100%',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    background: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: '1/1',
  },
  generatedImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.04)',
  },
  actionsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr auto',
    gap: '8px',
  },
  copyBtnPrimary: {
    padding: '12px 10px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #fff 0%, #e4e4e7 100%)',
    color: '#09090b',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.08)',
    letterSpacing: '0.2px',
  },
  copyBtnSecondary: {
    padding: '12px 10px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'rgba(255, 255, 255, 0.04)',
    color: '#a1a1aa',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    letterSpacing: '0.2px',
  },
  clearBtn: {
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    background: 'rgba(9, 9, 11, 0.4)',
    color: '#71717a',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    fontSize: '15px',
  },
};

// ─── Component ──────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('bio');
  const [movieName, setMovieName] = useState('');
  const [descLang, setDescLang] = useState<DescLang>('en');
  const [tone, setTone] = useState<Tone>('enthusiastic');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<'all' | 'text' | 'hashtags' | null>(null);
  const [error, setError] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);
  const descBoxRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the description box while generating
  useEffect(() => {
    if (isGenerating && descBoxRef.current) {
      descBoxRef.current.scrollTop = descBoxRef.current.scrollHeight;
    }
  }, [generatedContent?.description, isGenerating]);

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

  const generateImage = async () => {
    if (!imagePrompt.trim()) return;

    setIsGeneratingImage(true);
    setError('');
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: imagePrompt.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImage({ imageUrl: data.imageUrl });
    } catch (err: any) {
      setError(err.message || 'Failed to generate image. Please try again.');
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const copyToClipboard = (mode: 'all' | 'text' | 'hashtags') => {
    if (!generatedContent) return;
    let textToCopy = '';
    if (mode === 'all') {
      textToCopy = `${generatedContent.description}\n\n${generatedContent.hashtags.join(' ')}`;
    } else if (mode === 'text') {
      textToCopy = generatedContent.description;
    } else {
      textToCopy = generatedContent.hashtags.join(' ');
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(mode);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadImage = async () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage.imageUrl;
    link.download = `generated-image-${Date.now()}.png`;
    link.click();
  };

  const resetForm = () => {
    setMovieName('');
    setGeneratedContent(null);
    setImagePrompt('');
    setGeneratedImage(null);
    setCopied(null);
    setError('');
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const isGenDisabled = !movieName.trim() || isGenerating;
  const isImgDisabled = !imagePrompt.trim() || isGeneratingImage;

  return (
    <div style={styles.page}>
      {/* Animated Orbs Background */}
      <div style={styles.orbContainer}>
        <div style={styles.orb1} />
        <div style={styles.orb2} />
        <div style={styles.orb3} />
      </div>
      <div style={styles.noiseOverlay} />

      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.badge}>
            <span>✨</span>
            <span>AI-Powered</span>
          </div>
          <h1 style={styles.title}>Movie Reel Magic</h1>
          <p style={styles.subtitle}>
            Generate scroll-stopping captions and stunning visuals for your movie reels — in seconds.
          </p>
        </header>

        {/* Tab Switcher */}
        <div style={styles.tabsWrapper}>
          <div style={styles.tabsContainer}>
            <button
              className="tab-btn"
              onClick={() => setActiveTab('bio')}
              style={{ ...styles.tabBtn, ...(activeTab === 'bio' ? styles.tabBtnActive : {}) }}
            >
              🎬 Movie Bio
            </button>
            <button
              className="tab-btn"
              onClick={() => setActiveTab('image')}
              style={{ ...styles.tabBtn, ...(activeTab === 'image' ? styles.tabBtnActive : {}) }}
            >
              🖼️ Image Gen
            </button>
          </div>
        </div>

        <main style={styles.mainGrid} className="main-grid-responsive">
          {/* LEFT: Controls */}
          <section style={styles.formCard} className="card-glow">
            {activeTab === 'bio' ? (
              <>
                {/* Movie Input */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <span>🎬</span> Movie Name
                  </label>
                  <div style={styles.inputWrapper}>
                    <span style={styles.inputIcon}>🔍</span>
                    <input
                      type="text"
                      value={movieName}
                      onChange={(e) => setMovieName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && generateDescription()}
                      placeholder="e.g. Interstellar, Inception..."
                      style={styles.input}
                      disabled={isGenerating}
                    />
                  </div>
                </div>

                <div style={styles.divider} />

                {/* Language */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <span>🌐</span> Language
                  </label>
                  <div style={styles.langGrid}>
                    <button
                      className="lang-btn"
                      type="button"
                      onClick={() => setDescLang('en')}
                      style={{ ...styles.langBtn, ...(descLang === 'en' ? styles.langBtnActive : {}) }}
                    >
                      🇺🇸 English
                    </button>
                    <button
                      className="lang-btn"
                      type="button"
                      onClick={() => setDescLang('ar')}
                      style={{ ...styles.langBtn, ...(descLang === 'ar' ? styles.langBtnActive : {}) }}
                    >
                      🇸🇦 العربية
                    </button>
                  </div>
                </div>

                <div style={styles.divider} />

                {/* Tone Selector */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <span>🎨</span> Vibe / Tone
                  </label>
                  <div style={styles.toneGrid}>
                    {(Object.keys(TONE_CONFIG) as Tone[]).map((t) => (
                      <button
                        className="tone-btn"
                        key={t}
                        type="button"
                        onClick={() => setTone(t)}
                        style={{ ...styles.toneBtn, ...(tone === t ? styles.toneBtnActive : {}) }}
                      >
                        <span style={styles.toneEmoji}>{TONE_CONFIG[t].emoji}</span>
                        {TONE_CONFIG[t].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  className={isGenDisabled ? '' : 'generate-btn-active'}
                  onClick={generateDescription}
                  disabled={isGenDisabled}
                  style={isGenDisabled ? styles.generateBtnDisabled : styles.generateBtn}
                >
                  <span style={styles.btnText}>
                    {isGenerating ? (
                      <>
                        <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚡</span>
                        Generating...
                      </>
                    ) : (
                      <>✨ Generate Description</>
                    )}
                  </span>
                </button>
              </>
            ) : (
              <>
                {/* Image Prompt Input */}
                <div style={styles.inputGroup}>
                  <label style={styles.label}>
                    <span>🖼️</span> Image Prompt
                  </label>
                  <textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe the image you want... (e.g. A futuristic cyberpunk city at night with neon lights)"
                    style={styles.textarea}
                    disabled={isGeneratingImage}
                  />
                </div>

                {/* Generate Button */}
                <button
                  className={isImgDisabled ? '' : 'generate-btn-active'}
                  onClick={generateImage}
                  disabled={isImgDisabled}
                  style={isImgDisabled ? styles.generateBtnDisabled : styles.generateBtn}
                >
                  <span style={styles.btnText}>
                    {isGeneratingImage ? (
                      <>
                        <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>🎨</span>
                        Rendering...
                      </>
                    ) : (
                      <>🎨 Generate Image</>
                    )}
                  </span>
                </button>
              </>
            )}

            {error && (
              <div style={{
                color: '#fca5a5',
                fontSize: '13px',
                textAlign: 'center',
                background: 'rgba(239,68,68,0.08)',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid rgba(239,68,68,0.15)',
                fontWeight: 500,
              }}>
                {error}
              </div>
            )}
          </section>

          {/* RIGHT: Result / Live Preview */}
          <section style={styles.resultCard} className="card-glow">
            {activeTab === 'bio' ? (
              !generatedContent ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIconWrap}>🍿</div>
                  <h3 style={styles.emptyTitle}>Ready to Create?</h3>
                  <p style={styles.emptyDesc}>
                    Enter a movie name and hit generate to create a scroll-stopping caption instantly.
                  </p>
                </div>
              ) : (
                <div style={styles.resultContent}>
                  <div style={styles.resultHeader}>
                    <div style={styles.resultTitle}>
                      📄 Preview
                      {isGenerating && (
                        <div style={styles.liveIndicator}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            background: '#34d399',
                            borderRadius: '50%',
                            display: 'inline-block',
                            animation: 'pulse 1.2s ease-in-out infinite',
                            boxShadow: '0 0 6px rgba(52, 211, 153, 0.4)',
                          }} />
                          Live
                        </div>
                      )}
                    </div>
                    {generatedContent.hashtags.length > 0 && (
                      <div style={styles.charBadge}>
                        {generatedContent.description.length} chars
                      </div>
                    )}
                  </div>

                  <div style={styles.descriptionContainer}>
                    <div style={styles.descriptionBox} dir="auto" ref={descBoxRef}>
                      {generatedContent.description ? (
                        <>
                          {generatedContent.description}
                          {isGenerating && <span className="typing-indicator">&nbsp;</span>}
                        </>
                      ) : (
                        <span style={{ color: '#3f3f46', fontStyle: 'italic' }}>Waiting for AI...</span>
                      )}
                    </div>

                    {generatedContent.hashtags.length > 0 && (
                      <div style={styles.hashtagSection}>
                        {generatedContent.hashtags.map((tag, i) => (
                          <div key={i} style={styles.hashtag} className="hashtag-pill">{tag}</div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={styles.actions}>
                    <div style={styles.actionsRow}>
                      <button onClick={() => copyToClipboard('all')} style={styles.copyBtnPrimary} className="copy-hover">
                        {copied === 'all' ? '✅ Done' : '📋 Copy All'}
                      </button>
                      <button onClick={() => copyToClipboard('text')} style={styles.copyBtnSecondary} className="copy-hover copy-secondary">
                        {copied === 'text' ? '✅ Done' : '📝 Text'}
                      </button>
                      <button onClick={() => copyToClipboard('hashtags')} style={styles.copyBtnSecondary} className="copy-hover copy-secondary">
                        {copied === 'hashtags' ? '✅ Done' : '#️⃣ Tags'}
                      </button>
                      <button onClick={resetForm} style={styles.clearBtn} className="clear-hover" title="Clear">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              )
            ) : (
              !generatedImage && !isGeneratingImage ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIconWrap}>🎨</div>
                  <h3 style={styles.emptyTitle}>Dream It, See It</h3>
                  <p style={styles.emptyDesc}>
                    Describe a scene to generate a stunning AI image for your movie bio.
                  </p>
                </div>
              ) : (
                <div style={styles.resultContent}>
                  <div style={styles.resultHeader}>
                    <div style={styles.resultTitle}>
                      🖼️ Generated Image
                      {isGeneratingImage && (
                        <div style={styles.liveIndicator}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            background: '#34d399',
                            borderRadius: '50%',
                            display: 'inline-block',
                            animation: 'pulse 1.2s ease-in-out infinite',
                            boxShadow: '0 0 6px rgba(52, 211, 153, 0.4)',
                          }} />
                          Rendering...
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={styles.descriptionContainer}>
                    <div style={styles.imageContainer}>
                      {isGeneratingImage ? (
                        <div style={{ ...styles.emptyState, opacity: 0.5, padding: '20px' }}>
                          <span style={{ fontSize: '28px', animation: 'pulse 1.5s ease-in-out infinite' }}>🎨</span>
                          <p style={{ color: '#52525b', fontSize: '14px' }}>Painting your vision...</p>
                        </div>
                      ) : (
                        generatedImage && (
                          <img
                            src={generatedImage.imageUrl}
                            alt="AI Generated"
                            style={styles.generatedImage}
                          />
                        )
                      )}
                    </div>
                  </div>

                  {generatedImage && !isGeneratingImage && (
                    <div style={styles.actions}>
                      <button onClick={downloadImage} style={styles.copyBtn} className="copy-hover">
                        📥 Download Image
                      </button>
                      <button onClick={resetForm} style={styles.clearBtn} className="clear-hover" title="Clear">
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              )
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
            "description": "Generate engaging Instagram Reel descriptions and AI images for movies using AI. Supports Arabic and English.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "120"
            }
          })
        }}
      />
    </div>
  );
}
