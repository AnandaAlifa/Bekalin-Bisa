from sqlalchemy import text

from app.db.session import SessionLocal


def test_database_connection() -> None:
    with SessionLocal() as session:
        result = session.execute(text("SELECT 1")).scalar()
    assert result == 1
