import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import './AuthPages.css';

export default function LoginPage() {
  const { user, login } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(id, pass);
    if (ok) {
      navigate('/');
    } else {
      showNotification(
        'Gagal Masuk',
        'Email/username atau kata sandi yang Anda masukkan salah.',
        'error',
      );
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

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label className="form-label" htmlFor="login-id">
              Email / Username
            </label>
            <input
              id="login-id"
              type="text"
              required
              placeholder="contoh: budi@student.sch.id"
              className="form-input"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="login-pass">
              Kata Sandi
            </label>
            <input
              id="login-pass"
              type="password"
              required
              placeholder="••••••••"
              className="form-input"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <div className="auth-link-right">
              <Link to="/forgot" className="auth-link">
                Lupa Kata Sandi?
              </Link>
            </div>
          </div>
          <button type="submit" className="bekalin-button auth-submit">
            LOGIN
          </button>
        </form>

        <div className="auth-divider">
          <Link to="/signup" className="auth-signup-btn">
            SIGN UP
          </Link>
        </div>

        <div className="auth-demo">
          <p className="auth-demo__title">Akun Demo Bekalin:</p>
          <p>
            Siswa: <code className="auth-demo__code">budi@student.sch.id</code> /{' '}
            <code className="auth-demo__code">siswa123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
