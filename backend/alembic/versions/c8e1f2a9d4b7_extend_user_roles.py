"""extend user roles to teacher and school_admin

Revision ID: c8e1f2a9d4b7
Revises: 0bfcf7c5549f
Create Date: 2026-10-15 21:30:00.000000
"""

from alembic import op

revision = "c8e1f2a9d4b7"
down_revision = "0bfcf7c5549f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("UPDATE users SET role = 'school_admin' WHERE role = 'admin'")
    op.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS ck_users_role")
    op.execute(
        "ALTER TABLE users ADD CONSTRAINT ck_users_role "
        "CHECK (role IN ('student', 'teacher', 'school_admin'))"
    )


def downgrade() -> None:
    op.execute(
        "UPDATE users SET role = 'admin' "
        "WHERE role IN ('teacher', 'school_admin')"
    )
    op.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS ck_users_role")
    op.execute(
        "ALTER TABLE users ADD CONSTRAINT ck_users_role "
        "CHECK (role IN ('student', 'admin'))"
    )
