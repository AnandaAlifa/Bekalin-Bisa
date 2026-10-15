import { useState } from 'react';
import { BrowserRouter, Link, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AppHeader from './components/layout/AppHeader';
import AppSidebar from './components/layout/AppSidebar';
import AppBottomNav from './components/layout/AppBottomNav';
import AppMobileMore from './components/layout/AppMobileMore';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPage from './pages/auth/ForgotPage';
import SubjectsPage from './pages/SubjectsPage';
import ChaptersPage from './pages/ChaptersPage';
import LessonPage from './pages/LessonPage';
import PracticePage from './pages/PracticePage';
import LabPage from './pages/LabPage';
import UjianPage from './pages/UjianPage';
import JadwalPage from './pages/JadwalPage';
import KonsulPage from './pages/KonsulPage';
import ProfilPage from './pages/ProfilPage';
import TeacherPage from './pages/TeacherPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner" aria-hidden="true" />
        <p>Memuat BEKALIN…</p>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppLayout() {
  const [moreOpen, setMoreOpen] = useState(false);
  return (
    <div className="app-shell">
      <AppHeader />
      <div className="app-shell__body">
        <AppSidebar />
        <main className="app-shell__main bekalin-gradient animate-fade-in">
          <Outlet />
        </main>
      </div>
      <AppBottomNav onMoreClick={() => setMoreOpen((o) => !o)} moreActive={moreOpen} />
      <AppMobileMore isOpen={moreOpen} onClose={() => setMoreOpen(false)} />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="page-container">
      <h1 className="page-title">Halaman tidak ditemukan</h1>
      <p className="page-subtitle">
        Kembali ke <Link to="/subjects">daftar mata pelajaran</Link>.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot" element={<ForgotPage />} />

            <Route
              element={
                <RequireAuth>
                  <AppLayout />
                </RequireAuth>
              }
            >
              <Route path="/" element={<Navigate to="/subjects" replace />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/subjects/:subjectId" element={<ChaptersPage />} />
              <Route path="/lessons/:lessonId" element={<LessonPage />} />
              <Route path="/lessons/:lessonId/practice" element={<PracticePage />} />
              <Route path="/lab" element={<LabPage />} />
              <Route path="/ujian" element={<UjianPage />} />
              <Route path="/jadwal" element={<JadwalPage />} />
              <Route path="/konsul" element={<KonsulPage />} />
              <Route path="/profil" element={<ProfilPage />} />
              <Route path="/teacher" element={<TeacherPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
