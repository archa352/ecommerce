#!/bin/sh
# Run the backend test suite against a throwaway PostgreSQL and Redis.
#
# Usage: backend/scripts/test.sh [pytest args...]
#
# Every run gets its own PostgreSQL and Redis containers on a private,
# internal Docker network, with PostgreSQL's data held in memory (tmpfs).
# The tests run in the API image on that network only, so they cannot reach
# the application's database server at all. Everything the run created is
# removed when it ends -- passed, failed or interrupted -- so no test
# database, schema or container outlives it.
set -eu

BACKEND=$(cd "$(dirname "$0")/.." && pwd)
IMAGE=${TEST_IMAGE:-tws-ecommerce-core-api}

RUN=zeen-test-$(date +%s)-$$
NETWORK=$RUN
POSTGRES=$RUN-postgres
REDIS=$RUN-redis

PASSWORD=$(openssl rand -hex 16)
MARKER=$(openssl rand -hex 16)

cleanup() {
    # -v also removes the anonymous volumes the images declare (redis's /data);
    # without it every run would leave one behind.
    docker rm -f -v "$POSTGRES" "$REDIS" >/dev/null 2>&1 || true
    docker network rm "$NETWORK" >/dev/null 2>&1 || true
}
trap cleanup EXIT
trap 'exit 130' INT TERM

docker image inspect "$IMAGE" >/dev/null 2>&1 \
    || { echo "error: image $IMAGE is missing. Run: docker compose build api" >&2; exit 1; }

docker network create --internal "$NETWORK" >/dev/null
docker run -d --name "$POSTGRES" --network "$NETWORK" \
    --tmpfs /var/lib/postgresql/data --shm-size 256m \
    -e POSTGRES_USER=zeen_test -e POSTGRES_PASSWORD="$PASSWORD" -e POSTGRES_DB=zeen_test \
    postgres:16 >/dev/null
docker run -d --name "$REDIS" --network "$NETWORK" \
    redis:7-alpine redis-server --save '' --appendonly no >/dev/null

ready=0
for _ in $(seq 1 60); do
    if docker exec "$POSTGRES" pg_isready -U zeen_test -d zeen_test -h 127.0.0.1 >/dev/null 2>&1 \
        && docker exec "$REDIS" redis-cli ping >/dev/null 2>&1; then
        ready=1
        break
    fi
    sleep 1
done
[ "$ready" = 1 ] || { echo "error: test PostgreSQL/Redis did not start" >&2; exit 1; }

docker exec "$REDIS" redis-cli set zeen:test:instance-id "$MARKER" >/dev/null
POSTGRES_ADDR=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' "$POSTGRES")

# DATABASE_URL / REDIS_URL name hosts that do not exist on this network: the
# app's own database is never a target, and conftest refuses to run if the
# test database were ever the same as it.
docker run --rm --network "$NETWORK" \
    -v "$BACKEND:/app" -w /app \
    -e PYTHONDONTWRITEBYTECODE=1 \
    -e ENVIRONMENT=test \
    -e JWT_SECRET=test-only-access-secret-not-used-anywhere-else \
    -e JWT_REFRESH_SECRET=test-only-refresh-secret-not-used-anywhere-else \
    -e CORS_ORIGINS=http://localhost:3000 \
    -e STORAGE_LOCAL_PATH=/tmp/zeen-test-uploads \
    -e DATABASE_URL="postgresql+asyncpg://none:none@no-app-database:5432/no_app_database" \
    -e REDIS_URL="redis://no-app-redis:6379/0" \
    -e TEST_DATABASE_URL="postgresql+asyncpg://zeen_test:$PASSWORD@$POSTGRES:5432/zeen_test" \
    -e TEST_DATABASE_ALLOWED_HOST="$POSTGRES" \
    -e TEST_DATABASE_ALLOWED_PORT=5432 \
    -e TEST_DATABASE_ALLOWED_NAME=zeen_test \
    -e TEST_DATABASE_ALLOWED_SERVER_ADDR="$POSTGRES_ADDR" \
    -e TEST_DATABASE_ALLOWED_SERVER_PORT=5432 \
    -e TEST_REDIS_URL="redis://$REDIS:6379/0" \
    -e TEST_REDIS_ALLOWED_HOST="$REDIS" \
    -e TEST_REDIS_ALLOWED_PORT=6379 \
    -e TEST_REDIS_ALLOWED_DB=0 \
    -e TEST_REDIS_INSTANCE_ID="$MARKER" \
    "$IMAGE" python -m pytest -p no:cacheprovider "$@"
