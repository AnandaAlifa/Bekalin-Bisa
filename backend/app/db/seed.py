from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models import Chapter, Lesson, Question, Subject

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


SEED_QUESTIONS = {
    "Pengenalan Bilangan Bulat": [
        {
            "question_text": "Manakah bilangan yang merupakan bilangan bulat negatif?",
            "options": ["3", "-2", "0", "1/2"],
            "correct_option": "B",
            "explanation": "Bilangan bulat negatif diawali tanda minus, misalnya -2.",
        },
        {
            "question_text": "Pada garis bilangan, bilangan mana yang paling kecil?",
            "options": ["-5", "-1", "0", "2"],
            "correct_option": "A",
            "explanation": "Makin ke kiri pada garis bilangan, nilainya semakin kecil.",
        },
        {
            "question_text": "Hasil dari (-3) + 5 adalah…",
            "options": ["-8", "-2", "2", "8"],
            "correct_option": "C",
            "explanation": "Beda tanda: 5 - 3 = 2 dengan tanda dari bilangan absolutnya lebih besar, yaitu positif.",
        },
        {
            "question_text": "Hasil dari (-4) - (-1) adalah…",
            "options": ["-5", "-3", "3", "5"],
            "correct_option": "B",
            "explanation": "Mengurang bilangan negatif seperti menambah: -4 + 1 = -3.",
        },
        {
            "question_text": "Manakah yang BUKAN bilangan bulat?",
            "options": ["-10", "0", "7", "2/3"],
            "correct_option": "D",
            "explanation": "2/3 adalah pecahan, bukan bilangan bulat.",
        },
    ],
}


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


def seed_practice_questions(session: Session) -> int:
    """Isi soal latihan contoh untuk materi tertentu. Idempoten."""
    existing = session.scalar(select(Question.id).limit(1))
    if existing is not None:
        return 0

    total = 0
    for lesson_title, questions in SEED_QUESTIONS.items():
        lesson = session.scalar(select(Lesson).where(Lesson.title == lesson_title))
        if lesson is None:
            continue
        for item in questions:
            session.add(
                Question(
                    lesson_id=lesson.id,
                    question_text=item["question_text"],
                    options=item["options"],
                    correct_option=item["correct_option"],
                    explanation=item["explanation"],
                    is_published=True,
                )
            )
            total += 1
    session.commit()
    return total


def main() -> None:
    with SessionLocal() as session:
        added = seed_learning_content(session)
        if added:
            print(f"Seed selesai: {added} mata pelajaran ditambahkan.")
        else:
            print("Seed dilewati: data mata pelajaran sudah ada.")
        questions = seed_practice_questions(session)
        if questions:
            print(f"Seed soal selesai: {questions} soal ditambahkan.")
        else:
            print("Seed soal dilewati: data soal sudah ada.")


if __name__ == "__main__":
    main()
