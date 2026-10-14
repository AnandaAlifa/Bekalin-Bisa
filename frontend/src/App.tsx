import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import SubjectsPage from './pages/SubjectsPage';
import ChaptersPage from './pages/ChaptersPage';
import LessonPage from './pages/LessonPage';
import PracticePage from './pages/PracticePage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <div className="page-container app-header__inner">
            <Link className="app-header__brand" to="/subjects">
              PINTARA
            </Link>
            <span className="app-header__tagline">Belajar, Bertumbuh, Berprestasi</span>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/subjects" replace />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/subjects/:subjectId" element={<ChaptersPage />} />
            <Route path="/lessons/:lessonId" element={<LessonPage />} />
            <Route path="/lessons/:lessonId/practice" element={<PracticePage />} />
            <Route
              path="*"
              element={
                <div className="page-container">
                  <h1 className="page-title">Halaman tidak ditemukan</h1>
                  <p className="page-subtitle">
                    Kembali ke <Link to="/subjects">daftar mata pelajaran</Link>.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
