import './JadwalPage.css';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export default function JadwalPage() {
  return (
    <div className="page-container jadwal-page">
      <div className="bekalin-box animate-pop-in" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">JADWAL BELAJAR</h1>
        <p className="page-subtitle" style={{ marginBottom: 0 }}>
          Agenda harian dan mingguan kegiatan pembelajaran Bekalin.
        </p>
      </div>

      <div className="jadwal-list">
        {DAYS.map((day, idx) => (
          <div key={day} className={`bekalin-box jadwal-day animate-pop-in stagger-${(idx % 5) + 1}`}>
            <h3 className="jadwal-day__title">{day}</h3>
            <div className="jadwal-day__slots">
              <div className="jadwal-slot jadwal-slot--pink">
                <span>08.00 - 09.30: Pembelajaran & Praktik {day}</span>
                <span className="jadwal-slot__badge jadwal-slot__badge--pink">Aktif</span>
              </div>
              <div className="jadwal-slot jadwal-slot--indigo">
                <span>10.00 - 11.30: Sesi Tanya Jawab & Konsultasi BK</span>
                <span className="jadwal-slot__badge jadwal-slot__badge--indigo">Terjadwal</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
