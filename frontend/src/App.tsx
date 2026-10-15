import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import AppHeader from './components/layout/AppHeader';
import AppSidebar from './components/layout/AppSidebar';
import AppBottomNav from './components/layout/AppBottomNav';
import AppFooter from './components/layout/AppFooter';
import DashboardPage from './pages/DashboardPage';
import SubjectsPage from './pages/SubjectsPage';
import ChaptersPage from './pages/ChaptersPage';
import LessonPage from './pages/LessonPage';
import PracticePage from './pages/PracticePage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <AppHeader />
        <div className="app-shell__body">
          <AppSidebar />
          <main className="app-shell__main bekalin-gradient animate-fade-in">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
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
                      Kembali ke <Link to="/">dashboard</Link> atau{' '}
                      <Link to="/subjects">daftar mata pelajaran</Link>.
                    </p>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
        <AppBottomNav />
        <AppFooter />
      </div>
    </BrowserRouter>
  );
}
