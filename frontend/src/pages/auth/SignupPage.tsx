import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import './AuthPages.css';

export default function SignupPage() {
  const { user, signup } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [className, setClassName] = useState('Kelas 11 IPA');

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signup({ name, email, pass, className });
    if (result.ok) {
      showNotification(
        'Registrasi Berhasil',
        'Akun Anda berhasil didaftarkan. Selamat datang!',
        'success',
        () => navigate('/'),
      );
    } else {
      showNotification('Validasi Sandi', result.error || 'Pendaftaran gagal.', 'error');
    }
  };

  return (
    <div className="auth-page bekalin-gradient animate-fade-in">
      <div className="auth-card animate-pop-in">
        <div className="auth-header-text">
          <h2 className="auth-title">Daftar Akun Bekalin</h2>
          <p className="auth-subtitle">Platform Pembelajaran Digital</p>
        </div>
        <form className="auth-form auth-form--compact" onSubmit={handleSubmit}>
          <div>
            <label className="form-label" htmlFor="su-name">
              Nama Lengkap
            </label>
            <input
              id="su-name"
              type="text"
              required
              placeholder="Nama Lengkap"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="su-email">
              Email Sekolah
            </label>
            <input
              id="su-email"
              type="email"
              required
              placeholder="nama@student.sch.id"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="su-pass">
              Kata Sandi
            </label>
            <input
              id="su-pass"
              type="password"
              required
              placeholder="••••••••"
              className="form-input"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="su-class">
              Kelas / Rombel
            </label>
            <select
              id="su-class"
              className="form-input"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            >
              <option value="Kelas 10 IPA">Kelas 10 SMA</option>
              <option value="Kelas 11 IPA">Kelas 11 SMA</option>
              <option value="Kelas 12 SMK">Kelas 12 SMK</option>
            </select>
          </div>
          <button type="submit" className="bekalin-button auth-submit" style={{ marginTop: '0.5rem' }}>
            DAFTAR SEKARANG
          </button>
        </form>
        <div className="auth-footer-link">
          <Link to="/login" className="auth-link">
            Kembali ke Halaman Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
