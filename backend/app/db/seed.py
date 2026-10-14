from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models import Chapter, Lesson, Subject

SEED_SUBJECTS = [
    {
        "name": "Matematika",
        "description": "Materi dasar matematika untuk latihan dan penguatan konsep.",
        "chapters": [
            {
                "title": "Bilangan Bulat",
                "lessons": [
                    {
                        "title": "Pengenalan Bilangan Bulat",
                        "content": (
                            "Bilangan bulat terdiri dari bilangan positif, nol, dan bilangan negatif. "
                            "Pada garis bilangan, nilai semakin besar ke kanan dan semakin kecil ke kiri."
                        ),
                        "note": "Ingat: -3 lebih kecil dari -2.",
                    },
                    {
                        "title": "Operasi Hitung Bilangan Bulat",
                        "content": (
                            "Penjumlahan bilangan bulat dengan tanda sama menghasilkan nilai absolut "
                            "berjumlah selisihnya, sedangkan beda tanda menghasilkan selisih dengan tanda "
                            "dari bilangan yang absolutnya lebih besar."
                        ),
                        "note": None,
                    },
                ],
            },
            {
                "title": "Pecahan",
                "lessons": [
                    {
                        "title": "Pengenalan Pecahan",
                        "content": (
                            "Pecahan menyatakan bagian dari keseluruhan, ditulis a/b dengan b ≠ 0. "
                            "Pecahan senilai memiliki nilai yang sama meski bentuk berbeda."
                        ),
                        "note": None,
                    },
                    {
                        "title": "Operasi Pecahan",
                        "content": (
                            "Untuk mengalikan pecahan, kalikan penyebut dengan penyebut dan pembilang "
                            "dengan pembilang. Untuk membagi, kalikan dengan kebalikan dari pecahan pembagi."
                        ),
                        "note": "Sederhanakan hasil ke bentuk paling sederhana.",
                    },
                ],
            },
        ],
    },
    {
        "name": "Fisika",
        "description": "Materi fisika dasar dengan fokus pada konsep dan penerapan.",
        "chapters": [
            {
                "title": "Besaran dan Satuan",
                "lessons": [
                    {
                        "title": "Besaran Pokok dan Turunan",
                        "content": (
                            "Besaran pokok contohnya massa (kg), panjang (m), waktu (s), dan suhu (K). "
                            "Besaran turunan dibentuk dari kombinasi besaran pokok, misalnya kecepatan (m/s)."
                        ),
                        "note": None,
                    },
                    {
                        "title": "Satuan dan Simbol",
                        "content": (
                            "Satuan ditulis dengan simbol baku. Contoh: newton untuk gaya (N), joule "
                            "untuk energi (J), dan watt untuk daya (W)."
                        ),
                        "note": "Perhatikan huruf besar/kecil pada simbol satuan.",
                    },
                ],
            },
            {
                "title": "Gerak Lurus",
                "lessons": [
                    {
                        "title": "Jarak dan Perpindahan",
                        "content": (
                            "Jarak adalah panjang lintasan yang ditempuh, sedangkan perpindahan adalah "
                            "perubahan posisi beserta arahnya sehingga bersifat vektor."
                        ),
                        "note": None,
                    },
                    {
                        "title": "Kecepatan dan Laju",
                        "content": (
                            "Kecepatan adalah perpindahan per satuan waktu (vektor), sedangkan laju adalah "
                            "jarak per satuan waktu (skalar). Rata-rata laju = jarak / waktu."
                        ),
                        "note": "Latihan soal: hitung laju rata-rata dari data perjalanan sederhana.",
                    },
                ],
            },
        ],
    },
]


def seed_learning_content(session: Session) -> int:
    """Isi data materi contoh jika tabel masih kosong. Idempoten."""
    existing = session.scalar(select(Subject.id).limit(1))
    if existing is not None:
        return 0

    for subject_data in SEED_SUBJECTS:
        subject = Subject(
            name=subject_data["name"],
            description=subject_data["description"],
            is_published=True,
        )
        for chapter_order, chapter_data in enumerate(subject_data["chapters"], start=1):
            chapter = Chapter(
                title=chapter_data["title"],
                sort_order=chapter_order,
                is_published=True,
            )
            for lesson_order, lesson_data in enumerate(chapter_data["lessons"], start=1):
                chapter.lessons.append(
                    Lesson(
                        title=lesson_data["title"],
                        content=lesson_data["content"],
                        note=lesson_data["note"],
                        sort_order=lesson_order,
                        is_published=True,
                    )
                )
            subject.chapters.append(chapter)
        session.add(subject)

    session.commit()
    return len(SEED_SUBJECTS)


def main() -> None:
    with SessionLocal() as session:
        added = seed_learning_content(session)
        if added:
            print(f"Seed selesai: {added} mata pelajaran ditambahkan.")
        else:
            print("Seed dilewati: data mata pelajaran sudah ada.")


if __name__ == "__main__":
    main()
