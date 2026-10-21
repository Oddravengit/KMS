import os

import pytest
from alembic import command
from alembic.config import Config
from fastapi.testclient import TestClient
from sqlalchemy import text

from app.config import Settings
from app.db import build_engine
from app.main import create_app


@pytest.mark.postgres
def test_real_postgres_migration_and_readiness(monkeypatch):
    url = os.getenv("TEST_DATABASE_URL")
    if not url:
        pytest.skip("Set TEST_DATABASE_URL to a disposable PostgreSQL database")
    monkeypatch.setenv("DATABASE_URL", url)
    config = Config("alembic.ini")
    command.upgrade(config, "head")
    engine = build_engine(Settings(_env_file=None))
    with TestClient(create_app(Settings(_env_file=None), engine)) as client:
        assert client.get("/api/v1/ready").status_code == 200
        with engine.connect() as connection:
            assert (
                connection.execute(text("SELECT version_num FROM alembic_version")).scalar()
                == "0002_customers"
            )
    command.downgrade(config, "base")
    command.upgrade(config, "head")
