import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { ApiError } from '../../services/api';
import { apiLogin, saveAccessToken } from '../../services/auth';
import './AuthPages.css';

export default function LoginPage() {
  const { user, login, loginWithBackendUser } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = (): string => {
    const from = (location.state as { from?: string } | null)?.from;
    return from && from !== '/login' ? from : '/';
  };

  if (user) return <Navigate to={redirectTo()} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (pass.length < 8) {
      showNotification('Validasi Sandi', 'Kata sandi minimal 8 karakter.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await apiLogin(email.trim(), pass);
      saveAccessToken(result.access_token);
      loginWithBackendUser(result.user);
      navigate(redirectTo(), { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401 && login(email.trim(), pass)) {
        navigate(redirectTo(), { replace: true });
        return;
      }
      const message =
        err instanceof ApiError ? err.message : 'Terjadi kesalahan tak terduga. Coba lagi.';
      showNotification('Gagal Masuk', message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page bekalin-gradient animate-fade-in">
      <div className="auth-card auth-card--login animate-pop-in">
        <div className="auth-brand">
          <div className="auth-brand__circle">
            <h1 className="auth-brand__welcome">WELCOME</h1>
            <span className="auth-brand__name">
              BEKAL<span className="auth-brand__accent">in</span>
            </span>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
          <div>
            <label className="form-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              placeholder="contoh: budi@student.sch.id"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="login-pass">
              Kata Sandi
            </label>
            <div className="auth-password">
              <input
                id="login-pass"
                type={showPass ? 'text' : 'password'}
                required
                minLength={8}
                autoComplete="current-password"
                placeholder="••••••••"
                className="form-input"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="auth-password__toggle"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                aria-pressed={showPass}
                disabled={isSubmitting}
              >
                <i className={showPass ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} aria-hidden="true" />
              </button>
            </div>
            <div className="auth-link-right">
              <Link to="/forgot" className="auth-link">
                Lupa Kata Sandi?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="bekalin-button auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'MEMPROSES…' : 'LOGIN'}
          </button>
        </form>

        <div className="auth-divider">
          <Link to="/signup" className="auth-signup-btn">
            SIGN UP
          </Link>
        </div>

        <div className="auth-demo">
          <p className="auth-demo__title">Akun Demo Bekalin Bisa:</p>
          <p>
            Siswa: <code className="auth-demo__code">budi@student.sch.id</code> /{' '}
            <code className="auth-demo__code">siswa123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
