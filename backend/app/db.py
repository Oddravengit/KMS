from collections.abc import Iterator

from fastapi import Request
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import Settings


class Base(DeclarativeBase):
    pass


def build_engine(settings: Settings):
    return create_engine(
        str(settings.database_url), pool_pre_ping=True, connect_args={"connect_timeout": 3}
    )


def get_session(request: Request) -> Iterator[Session]:
    """Use with Depends; each request gets a session and rolls back uncommitted work."""
    with request.app.state.session_factory() as session:
        yield session


def build_session_factory(engine):
    return sessionmaker(bind=engine, expire_on_commit=False)
