import './AppFooter.css';

export default function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="page-container app-footer__inner">
        <p className="app-footer__brand">BEKALIN</p>
        <p className="app-footer__tagline">Belajar, Bertumbuh, Berprestasi</p>
        <p className="app-footer__note">
          Platform pembelajaran — materi dan latihan soal dengan penilaian backend.
        </p>
      </div>
    </footer>
  );
}
