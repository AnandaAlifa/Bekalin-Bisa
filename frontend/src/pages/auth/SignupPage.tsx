import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { ApiError } from '../../services/api';
import { apiRegister } from '../../services/auth';
import './AuthPages.css';

const EMOJI_REGEX = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u;

function deriveUsername(fullName: string, email: string): string {
  const slug = fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const fallback = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  let username = slug || fallback || 'siswa';
  if (username.length < 3) username = `${username}123`;
  return username.slice(0, 100);
}

export default function SignupPage() {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [className, setClassName] = useState('Kelas 11 IPA');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (name.trim().length < 3) {
      showNotification('Validasi Nama', 'Nama lengkap minimal 3 karakter.', 'error');
      return;
    }
    if (EMOJI_REGEX.test(pass)) {
      showNotification('Validasi Sandi', 'Kata sandi tidak boleh mengandung emoji!', 'error');
      return;
    }
    if (pass.length < 8 || pass.length > 72) {
      showNotification('Validasi Sandi', 'Kata sandi harus 8–72 karakter.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await apiRegister({
        email: email.trim(),
        password: pass,
        username: deriveUsername(name, email.trim()),
      });
      showNotification(
        'Registrasi Berhasil',
        'Akun Anda berhasil dibuat. Silakan masuk dengan email dan kata sandi baru.',
        'success',
        () => navigate('/login'),
      );
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        showNotification(
          'Email Terdaftar',
          'Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.',
          'error',
        );
      } else if (err instanceof ApiError) {
        showNotification('Pendaftaran Gagal', err.message, 'error');
      } else {
        showNotification('Pendaftaran Gagal', 'Terjadi kesalahan tak terduga. Coba lagi.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page bekalin-gradient animate-fade-in">
      <div className="auth-card animate-pop-in">
        <div className="auth-header-text">
          <h2 className="auth-title">Daftar Akun Bekalin Bisa</h2>
          <p className="auth-subtitle">Platform Pembelajaran Digital</p>
        </div>
        <form className="auth-form auth-form--compact" onSubmit={handleSubmit} aria-busy={isSubmitting}>
          <div>
            <label className="form-label" htmlFor="su-name">
              Nama Lengkap
            </label>
            <input
              id="su-name"
              type="text"
              required
              minLength={3}
              autoComplete="name"
              placeholder="Nama Lengkap"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
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
              autoComplete="email"
              placeholder="nama@student.sch.id"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="su-pass">
              Kata Sandi
            </label>
            <div className="auth-password">
              <input
                id="su-pass"
                type={showPass ? 'text' : 'password'}
                required
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                placeholder="Minimal 8 karakter"
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
              disabled={isSubmitting}
            >
              <option value="Kelas 10 IPA">Kelas 10 SMA</option>
              <option value="Kelas 11 IPA">Kelas 11 SMA</option>
              <option value="Kelas 12 SMK">Kelas 12 SMK</option>
            </select>
          </div>
          <button
            type="submit"
            className="bekalin-button auth-submit"
            style={{ marginTop: '0.5rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'MENDAFTARKAN…' : 'DAFTAR SEKARANG'}
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
