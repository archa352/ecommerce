"""A database built only from the migration history matches the models, both ways."""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

import pytest_asyncio
from sqlalchemy.ext.asyncio import create_async_engine

BACKEND_DIR = Path(__file__).resolve().parents[2]
TEST_DATABASE_URL = os.environ.get("TEST_DATABASE_URL", "")


def _with_database(url: str, name: str) -> str:
    return urlunsplit(urlsplit(url)._replace(path=f"/{name}"))


MIGRATIONS_DATABASE = f"{urlsplit(TEST_DATABASE_URL).path.lstrip('/')}_migrations"
MIGRATIONS_URL = _with_database(TEST_DATABASE_URL, MIGRATIONS_DATABASE)


async def _admin(statement: str) -> None:
    engine = create_async_engine(
        _with_database(TEST_DATABASE_URL, "postgres"), isolation_level="AUTOCOMMIT"
    )
    async with engine.connect() as connection:
        await connection.exec_driver_sql(statement)
    await engine.dispose()


@pytest_asyncio.fixture(loop_scope="session")
async def migrations_database():
    await _admin(f'DROP DATABASE IF EXISTS "{MIGRATIONS_DATABASE}" WITH (FORCE)')
    await _admin(f'CREATE DATABASE "{MIGRATIONS_DATABASE}"')
    yield MIGRATIONS_URL
    await _admin(f'DROP DATABASE IF EXISTS "{MIGRATIONS_DATABASE}" WITH (FORCE)')


def _alembic(url: str, *args: str) -> subprocess.CompletedProcess:
    return subprocess.run(
        [sys.executable, "-m", "alembic", *args],
        cwd=BACKEND_DIR,
        env={**os.environ, "DATABASE_URL": url},
        capture_output=True,
        text=True,
    )


async def test_the_history_upgrades_to_the_models_and_back(migrations_database):
    for step in (("upgrade", "head"), ("check",), ("downgrade", "-1"), ("upgrade", "head")):
        result = _alembic(migrations_database, *step)
        assert result.returncode == 0, f"alembic {' '.join(step)}:\n{result.stderr}"

    final = _alembic(migrations_database, "check")
    assert final.returncode == 0, final.stderr
