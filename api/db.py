from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from config import DATABASE_URL, DATABASE_PATH


class Base(DeclarativeBase):
    pass


# Ensure data directory exists
DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

engine = create_engine(DATABASE_URL, echo=False)


@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_conn, connection_record):
    cursor = dbapi_conn.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


def get_session():
    """Dependency for route handlers."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def init_db():
    """Create all tables."""
    Base.metadata.create_all(engine)
