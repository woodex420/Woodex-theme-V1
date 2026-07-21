import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login, isAuthenticated } from '@/lib/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated()) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) { setError('Please enter username and password.'); return; }
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      window.location.href = '/dashboard';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 border border-[#C9A84C] rotate-45 flex items-center justify-center mx-auto mb-6">
            <span className="font-display text-[#C9A84C] text-3xl -rotate-45 font-semibold">W</span>
          </div>
          <h1 className="font-display text-3xl text-white mb-2">
            Woodex <span className="text-gold-grad font-semibold">Admin</span>
          </h1>
          <p className="text-[#8A8073] font-light text-sm">Sign in to manage your site</p>
        </div>

        {/* Login Form */}
        <form onSubmit={onSubmit} className="bg-[#111110] border border-[rgba(201,168,76,0.25)] p-8 lg:p-10">
          {error && (
            <div className="flex items-center gap-3 bg-[rgba(220,38,38,0.12)] border border-[rgba(220,38,38,0.3)] px-4 py-3 mb-7">
              <AlertCircle size={16} className="text-[#DC2626] shrink-0" />
              <span className="text-sm text-[#DC2626]">{error}</span>
            </div>
          )}

          <div className="mb-6">
            <label className="label-lux" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-lux"
              placeholder="Enter username"
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="mb-8">
            <label className="label-lux" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-lux w-full pr-11"
                placeholder="Enter password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A8073] hover:text-[#C9A84C] transition-colors"
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-lux btn-gold w-full justify-center text-[0.68rem] font-semibold tracking-[0.22em] uppercase py-4 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <span className="w-4 h-4 border border-white/40 border-t-white rounded-full animate-spin" />
                Signing in…
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <LogIn size={15} /> Sign In
              </span>
            )}
          </button>

          {/* Demo credentials hint */}
          <div className="mt-8 pt-6 border-t border-[rgba(201,168,76,0.2)]">
            <p className="text-[0.6rem] tracking-[0.25em] uppercase text-[#8A8073] text-center mb-3">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-3 text-[0.65rem] font-mono">
              <div className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.15)] p-3 text-center">
                <div className="text-[#C9A84C] font-semibold">admin</div>
                <div className="text-[#8A8073] mt-0.5">woodex2024</div>
              </div>
              <div className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.15)] p-3 text-center">
                <div className="text-[#C9A84C] font-semibold">demo</div>
                <div className="text-[#8A8073] mt-0.5">demo123</div>
              </div>
            </div>
          </div>
        </form>

        {/* Back to site */}
        <div className="text-center mt-8">
          <a href="/" className="text-[0.65rem] tracking-[0.22em] uppercase text-[#8A8073] hover:text-[#C9A84C] transition-colors">
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}
