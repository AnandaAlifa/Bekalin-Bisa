import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { ApiError } from '../services/api';
import Avatar from '../components/common/Avatar';
import './ProfilPage.css';

export default function ProfilPage() {
  const { user, updateUser, updateProfile } = useAuth();
  const { showNotification } = useNotification();
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const trimmedUsername = username.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trimmedUsername.length < 3) {
      showNotification(
        'Username Terlalu Pendek',
        'Username minimal 3 karakter.',
        'error',
      );
      return;
    }
    setIsSaving(true);
    try {
      await updateProfile({ username: trimmedUsername, bio });
      updateUser({ name });
      showNotification('Profil Diperbarui', 'Perubahan profil berhasil disimpan.', 'success');
    } catch (err) {
      showNotification(
        'Gagal Menyimpan Profil',
        err instanceof ApiError ? err.message : 'Terjadi kesalahan tak terduga.',
        'error',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-container profil-page">
      <div className="bekalin-box profil-card animate-pop-in">
        <div className="profil-header">
          <Avatar name={user.name} size={80} />
          <div>
            <h1 className="profil-name">{user.name}</h1>
            <p className="profil-meta">
              {user.email} • <span className="profil-role">{user.role}</span>
            </p>
          </div>
        </div>

        <form className="profil-form" onSubmit={handleSubmit}>
          <div>
            <label className="form-label" htmlFor="prof-name">
              Nama Lengkap
            </label>
            <input
              id="prof-name"
              type="text"
              required
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="prof-username">
              Username
            </label>
            <input
              id="prof-username"
              type="text"
              required
              minLength={3}
              maxLength={100}
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="prof-bio">
              Bio / Deskripsi Diri
            </label>
            <textarea
              id="prof-bio"
              rows={3}
              maxLength={500}
              className="form-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bekalin-button profil-submit"
            disabled={isSaving}
          >
            {isSaving ? 'Menyimpan…' : 'Simpan Perubahan Profil'}
          </button>
        </form>
      </div>
    </div>
  );
}
