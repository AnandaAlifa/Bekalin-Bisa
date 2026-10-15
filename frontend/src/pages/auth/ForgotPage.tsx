import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';
import './AuthPages.css';

export default function ForgotPage() {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification(
      'Tautan Terkirim',
      'Instruksi pemulihan telah dikirim ke email Anda.',
      'info',
      () => navigate('/login'),
    );
  };

  return (
    <div className="auth-page bekalin-gradient animate-fade-in">
      <div className="auth-card auth-card--center animate-pop-in">
        <h2 className="auth-title auth-title--sm">Pemulihan Kata Sandi</h2>
        <p className="auth-subtitle">
          Masukkan email akun Anda untuk menerima instruksi reset.
        </p>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            required
            placeholder="email@domain.sch.id"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="bekalin-button auth-submit">
            Kirim Instruksi
          </button>
        </form>
        <div className="auth-footer-link">
          <Link to="/login" className="auth-link">
            Batal
          </Link>
        </div>
      </div>
    </div>
  );
}
