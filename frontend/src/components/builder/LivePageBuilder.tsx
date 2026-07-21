import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { useBuilder } from '../../lib/builderStore';
import { PAGE_NAMES } from '../../lib/builderTypes';
import BuilderPanel from './BuilderPanel';
import BuilderGuide from './BuilderGuide';

/* ================================================================== */
/*  Error Boundary                                                     */
/* ================================================================== */

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class BuilderErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Woodex Builder] Rendering error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(10,10,10,0.95)',
            cursor: 'pointer',
          }}
          onClick={this.handleReset}
        >
          <div
            style={{
              background: '#111110',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: 12,
              padding: '40px 48px',
              textAlign: 'center',
              maxWidth: 480,
            }}
          >
            <div
              style={{
                fontSize: 40,
                marginBottom: 16,
                color: '#C9A84C',
              }}
            >
              &#9888;
            </div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 24,
                fontWeight: 600,
                color: '#C9A84C',
                margin: 0,
                marginBottom: 12,
              }}
            >
              Builder Error
            </h2>
            <p
              style={{
                fontFamily: "'Montserrat', system-ui, sans-serif",
                fontSize: 13,
                color: '#8A8073',
                lineHeight: 1.5,
                margin: 0,
                marginBottom: 24,
              }}
            >
              {this.state.error?.message ||
                'An unexpected rendering error occurred.'}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                this.handleReset();
              }}
              style={{
                fontFamily: "'Montserrat', system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 500,
                padding: '10px 24px',
                background: '#C9A84C',
                color: '#0A0A0A',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Click to Reset
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

const BUILDER_STYLE_ID = 'woodex-builder-injected-styles';
const GUIDE_SEEN_KEY = 'woodex-builder-guide-seen';

const BUILDER_CSS = `
[data-wpi-path] {
  cursor: pointer;
  position: relative;
}
[data-wpi-path]:hover {
  outline: 2px dashed rgba(201,168,76,0.5);
  outline-offset: 3px;
}
[data-wpi-selected] {
  outline: 2px solid #C9A84C !important;
  outline-offset: 3px;
}
[data-wpi-section] {
  position: relative;
  padding-top: 24px;
}
[data-wpi-section]::before {
  content: '⋮⋮';
  position: absolute;
  top: 2px;
  left: 2px;
  font-size: 12px;
  line-height: 1;
  color: #C9A84C;
  background: rgba(17,17,16,0.9);
  border: 1px solid rgba(201,168,76,0.3);
  border-radius: 4px;
  padding: 3px 8px;
  cursor: grab;
  z-index: 20;
  opacity: 0;
  transition: opacity 0.2s ease;
  user-select: none;
}
[data-wpi-section]:hover::before {
  opacity: 1;
}
[data-wpi-section]::after {
  content: attr(data-wpi-label);
  position: absolute;
  top: 2px;
  left: 36px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #C9A84C;
  background: #111110;
  padding: 3px 8px;
  border: 1px solid rgba(201,168,76,0.3);
  z-index: 10;
  pointer-events: none;
  line-height: 1.2;
}
[data-wpi-dragging] {
  opacity: 0.4;
}
[data-wpi-drop-target] {
  outline: 2px solid #C9A84C !important;
  outline-offset: -2px;
}
`;

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

function GoldToggle({ onClick, active }: { onClick: () => void; active: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle Live Builder"
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 90,
        width: 48,
        height: 48,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#C9A84C',
        color: '#0A0A0A',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        transform: 'rotate(45deg)',
        boxShadow: active
          ? '0 0 20px rgba(201,168,76,0.6), 0 0 40px rgba(201,168,76,0.3)'
          : '0 2px 10px rgba(0,0,0,0.3)',
        animation: active ? 'woodex-pulse 2s ease-in-out infinite' : 'none',
        transition: 'transform 0.2s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(45deg) scale(1.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(45deg) scale(1)';
      }}
    >
      <span
        style={{
          display: 'block',
          transform: 'rotate(-45deg)',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 20,
          fontWeight: 700,
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        W
      </span>
    </button>
  );
}

function LoginModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { login } = useBuilder();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      // Small delay to simulate validation feel
      setTimeout(() => {
        const ok = login(password);
        if (ok) {
          onSuccess();
        } else {
          setError('Invalid password. Please try again.');
          setLoading(false);
        }
      }, 150);
    },
    [password, login, onSuccess],
  );

  // Focus input on mount
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10,10,10,0.85)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#111110',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: 12,
          padding: '36px 40px',
          width: 360,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 22,
            fontWeight: 600,
            color: '#C9A84C',
            textAlign: 'center',
            margin: '0 0 28px',
          }}
        >
          Builder Login
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Password field */}
          <label
            style={{
              display: 'block',
              fontFamily: "'Montserrat', system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 500,
              color: '#8A8073',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 8,
            }}
          >
            Password
          </label>
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Enter builder password"
            disabled={loading}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              fontFamily: "'Montserrat', system-ui, sans-serif",
              fontSize: 14,
              padding: '12px 14px',
              background: '#0A0A0A',
              color: '#D4C5A9',
              border: error
                ? '1px solid rgba(220,38,38,0.5)'
                : '1px solid rgba(201,168,76,0.2)',
              borderRadius: 8,
              outline: 'none',
              marginBottom: error ? 4 : 20,
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => {
              if (!error) {
                (e.target as HTMLInputElement).style.borderColor =
                  'rgba(201,168,76,0.5)';
              }
            }}
            onBlur={(e) => {
              if (!error) {
                (e.target as HTMLInputElement).style.borderColor =
                  'rgba(201,168,76,0.2)';
              }
            }}
          />

          {/* Error message */}
          {error && (
            <p
              style={{
                fontFamily: "'Montserrat', system-ui, sans-serif",
                fontSize: 12,
                color: '#DC2626',
                margin: '0 0 16px',
              }}
            >
              {error}
            </p>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, marginTop: error ? 12 : 0 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                fontFamily: "'Montserrat', system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 500,
                padding: '11px 0',
                background: 'transparent',
                color: '#8A8073',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'rgba(201,168,76,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  'rgba(201,168,76,0.2)';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !password}
              style={{
                flex: 1,
                fontFamily: "'Montserrat', system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                padding: '11px 0',
                background: loading || !password ? 'rgba(201,168,76,0.4)' : '#C9A84C',
                color: '#0A0A0A',
                border: 'none',
                borderRadius: 8,
                cursor: loading || !password ? 'not-allowed' : 'pointer',
                letterSpacing: '0.03em',
                transition: 'background 0.2s ease',
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TopBar({ onExit }: { onExit: () => void }) {
  const { currentPage } = useBuilder();

  const pageLabel =
    PAGE_NAMES[currentPage] ||
    currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 48,
        zIndex: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        background: '#111110',
        borderBottom: '1px solid rgba(201,168,76,0.3)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        fontFamily: "'Montserrat', system-ui, sans-serif",
      }}
    >
      {/* Left — Brand */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          minWidth: 180,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#0A0A0A',
            background: '#C9A84C',
            padding: '2px 6px',
            borderRadius: 3,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Live
        </span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#C9A84C',
            letterSpacing: '0.03em',
          }}
        >
          Builder
        </span>
      </div>

      {/* Center — Page name */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: '#D4C5A9',
          letterSpacing: '0.02em',
        }}
      >
        {pageLabel}
      </div>

      {/* Right — Exit */}
      <div style={{ minWidth: 180, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onExit}
          style={{
            fontFamily: "'Montserrat', system-ui, sans-serif",
            fontSize: 12,
            fontWeight: 500,
            padding: '7px 16px',
            background: 'transparent',
            color: '#8A8073',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 6,
            cursor: 'pointer',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.color = '#C9A84C';
            btn.style.borderColor = 'rgba(201,168,76,0.5)';
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.color = '#8A8073';
            btn.style.borderColor = 'rgba(201,168,76,0.2)';
          }}
        >
          Exit Builder
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export default function LivePageBuilder({ children }: { children: ReactNode }) {
  const {
    isAdmin,
    builderEnabled,
    currentPage: _currentPage,
    state,
    toggleBuilder,
    selectElement,
    setPanel,
    undo,
    redo,
  } = useBuilder();

  const [showLogin, setShowLogin] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const { isActive, panel } = state;

  // Show BuilderGuide on first builder activation
  const prevActive = useRef(isActive);
  useEffect(() => {
    if (isActive && !prevActive.current) {
      const seen = sessionStorage.getItem(GUIDE_SEEN_KEY);
      if (!seen) {
        setShowGuide(true);
        sessionStorage.setItem(GUIDE_SEEN_KEY, 'true');
      }
    }
    prevActive.current = isActive;
  }, [isActive]);

  /* ─── 6. Global style injection ──────────────────────── */
  useEffect(() => {
    if (!isActive) {
      // Remove injected styles
      const existing = document.getElementById(BUILDER_STYLE_ID);
      if (existing) existing.remove();
      return;
    }

    // Inject styles
    let styleEl = document.getElementById(BUILDER_STYLE_ID) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = BUILDER_STYLE_ID;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = BUILDER_CSS;

    return () => {
      const el = document.getElementById(BUILDER_STYLE_ID);
      if (el) el.remove();
    };
  }, [isActive]);

  /* ─── Pulse keyframes injection (once) ────────────────── */
  useEffect(() => {
    const keyframeId = 'woodex-pulse-keyframes';
    if (document.getElementById(keyframeId)) return;

    const style = document.createElement('style');
    style.id = keyframeId;
    style.textContent = `
      @keyframes woodex-pulse {
        0%, 100% { box-shadow: 0 0 20px rgba(201,168,76,0.5), 0 0 40px rgba(201,168,76,0.2); }
        50%      { box-shadow: 0 0 28px rgba(201,168,76,0.7), 0 0 56px rgba(201,168,76,0.35); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById(keyframeId);
      if (el) el.remove();
    };
  }, []);

  /* ─── 7. Document-level click handler ─────────────────── */
  useEffect(() => {
    if (!isActive) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const pathEl = target.closest('[data-wpi-path]') as HTMLElement | null;
      if (pathEl) {
        const path = pathEl.getAttribute('data-wpi-path');
        if (path) {
          selectElement(path);
        }
      } else {
        // Clicked outside any editable element
        selectElement(null);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [isActive, selectElement]);

  /* ─── 8. Keyboard shortcuts ───────────────────────────── */
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      // Cmd/Ctrl + Shift + B — toggle builder
      if (isMod && e.shiftKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        e.stopPropagation();
        toggleBuilder();
        return;
      }

      // Cmd/Ctrl + Z — undo
      if (isMod && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        e.stopPropagation();
        undo();
        return;
      }

      // Cmd/Ctrl + Shift + Z — redo
      if (isMod && e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        e.stopPropagation();
        redo();
        return;
      }

      // Escape — deselect and close panel
      if (e.key === 'Escape') {
        selectElement(null);
        setPanel(null);
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [isActive, toggleBuilder, undo, redo, selectElement, setPanel]);

  /* ─── Toggle handler ──────────────────────────────────── */
  const handleToggleClick = useCallback(() => {
    if (isAdmin) {
      toggleBuilder();
    } else {
      setShowLogin(true);
    }
  }, [isAdmin, toggleBuilder]);

  const handleLoginSuccess = useCallback(() => {
    setShowLogin(false);
    toggleBuilder();
  }, [toggleBuilder]);

  const handleExit = useCallback(() => {
    selectElement(null);
    setPanel(null);
    toggleBuilder();
  }, [selectElement, setPanel, toggleBuilder]);

  /* ─── Render ──────────────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* 11. Content container with optional top padding */}
      <div
        style={{
          paddingTop: isActive ? 48 : 0,
          transition: 'padding-top 0.3s ease',
        }}
      >
        {/* 2 & 10. Wrap children with error boundary */}
        <BuilderErrorBoundary onReset={() => window.location.reload()}>
          {children}
        </BuilderErrorBoundary>
      </div>

      {/* 5. Top bar — only when active */}
      {isActive && <TopBar onExit={handleExit} />}

      {/* 3. Gold cube toggle button — only when admin enables from dashboard */}
      {builderEnabled && <GoldToggle onClick={handleToggleClick} active={isActive} />}

      {/* 9. Builder panel — positioned fixed right */}
      {isActive && panel !== null && (
        <div
          style={{
            position: 'fixed',
            top: 48,
            right: 0,
            bottom: 0,
            zIndex: 79,
            width: 360,
          }}
        >
          <BuilderPanel />
        </div>
      )}

      {/* 4. Builder Guide overlay — shows on first activation */}
      {showGuide && (
        <BuilderGuide open={showGuide} onClose={() => setShowGuide(false)} />
      )}

      {/* 5. Login modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}
