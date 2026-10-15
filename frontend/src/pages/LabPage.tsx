import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import './LabPage.css';

type LabId = 'fisika' | 'biologi' | 'kimia' | 'astronomi';

const LABS: Array<{ id: LabId; label: string; title: string }> = [
  { id: 'fisika', label: 'Fisika', title: 'Hukum Newton & Dinamika Gerak' },
  { id: 'biologi', label: 'Biologi', title: 'Biologi Sel & Mikroskop' },
  { id: 'kimia', label: 'Kimia', title: 'Reaksi Stoikiometri & Titrasi' },
  { id: 'astronomi', label: 'Astronomi', title: 'Mekanika Orbit & Tata Surya' },
];

const PARAM_LABELS: Record<LabId, Array<{ label: string; unit: string; min: number; max: number; value: number }>> = {
  fisika: [
    { label: 'Parameter Massa (kg)', unit: 'kg', min: 1, max: 50, value: 10 },
    { label: 'Parameter Kecepatan (m/s)', unit: 'm/s', min: 0, max: 100, value: 25 },
  ],
  biologi: [
    { label: 'Pembesaran Mikroskop (x)', unit: 'x', min: 40, max: 400, value: 100 },
    { label: 'Intensitas Cahaya (%)', unit: '%', min: 10, max: 100, value: 60 },
  ],
  kimia: [
    { label: 'Volume Larutan (mL)', unit: 'mL', min: 10, max: 500, value: 100 },
    { label: 'Konsentrasi (M)', unit: 'M', min: 1, max: 10, value: 5 },
  ],
  astronomi: [
    { label: 'Jarak Orbit (AU)', unit: 'AU', min: 1, max: 30, value: 1 },
    { label: 'Kecepatan Orbital (km/s)', unit: 'km/s', min: 1, max: 50, value: 30 },
  ],
};

export default function LabPage() {
  const [searchParams] = useSearchParams();
  const initial = searchParams.get('subject');
  const [selectedLab, setSelectedLab] = useState<LabId>(
    LABS.some((l) => l.id === initial) ? (initial as LabId) : 'fisika',
  );
  const [params, setParams] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const lab of LABS) {
      PARAM_LABELS[lab.id].forEach((p, i) => {
        init[`${lab.id}-${i}`] = p.value;
      });
    }
    return init;
  });
  const { showNotification } = useNotification();

  const lab = LABS.find((l) => l.id === selectedLab)!;
  const labels = PARAM_LABELS[selectedLab];

  const handleSave = () => {
    showNotification('Praktikum Disimpan', 'Hasil catatan praktikum Anda berhasil disimpan.', 'success');
  };

  return (
    <div className="page-container lab-page">
      <div className="bekalin-box lab-header animate-pop-in">
        <div>
          <h1 className="page-title">PRAKTIKIN — Laboratorium Sains</h1>
          <p className="page-subtitle lab-header__sub">
            Simulasi digital terpandu untuk Fisika, Biologi, Kimia, dan Astronomi.
          </p>
        </div>
        <div className="lab-tabs" role="tablist" aria-label="Pilih lab">
          {LABS.map((l) => (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={selectedLab === l.id}
              className={`lab-tab${selectedLab === l.id ? ' lab-tab--active' : ''}`}
              onClick={() => setSelectedLab(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lab-panel animate-pop-in stagger-2">
        <h2 className="lab-panel__title">Simulasi Aktif: {lab.title}</h2>
        <p className="lab-panel__subtitle">Gunakan kontrol di bawah untuk mengubah parameter praktikum.</p>

        <div className="lab-stage">
          <div className="lab-stage__orb">
            <i className="fa-solid fa-atom lab-stage__icon" />
          </div>
          <p className="lab-stage__status">Simulasi Berjalan Real-Time</p>
          <p className="lab-stage__hint">Model tervalidasi kurikulum merdeka.</p>
        </div>

        <div className="lab-controls">
          {labels.map((p, i) => {
            const key = `${selectedLab}-${i}`;
            const val = params[key] ?? p.value;
            return (
              <div key={key} className="lab-control">
                <label className="lab-control__label" htmlFor={key}>
                  {p.label}
                </label>
                <input
                  id={key}
                  type="range"
                  min={p.min}
                  max={p.max}
                  value={val}
                  className="lab-control__slider"
                  onChange={(e) =>
                    setParams((prev) => ({ ...prev, [key]: Number(e.target.value) }))
                  }
                />
                <span className="lab-control__value">
                  {val} {p.unit}
                </span>
              </div>
            );
          })}
          <div className="lab-control lab-control--action">
            <button type="button" className="bekalin-button lab-save" onClick={handleSave}>
              Simpan Hasil Praktikum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
