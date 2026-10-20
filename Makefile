BACKEND  := backend
VENV_BIN := .venv/bin
COMPOSE  := docker compose
VERSIONS := $(BACKEND)/migrations/versions

API_PORT := $(shell sed -n 's/^API_PORT=//p' .env 2>/dev/null | tail -1)
API_PORT := $(if $(API_PORT),$(API_PORT),58000)

REQUIRE_ENV = @test -f .env \
	|| { echo "error: .env is missing. Run: cp .env.example .env"; exit 1; }
REQUIRE_VENV = @test -x $(BACKEND)/$(VENV_BIN)/pytest \
	|| { echo "error: $(BACKEND)/.venv is missing or incomplete. Run:"; \
	     echo "  python -m venv $(BACKEND)/.venv"; \
	     echo "  $(BACKEND)/$(VENV_BIN)/pip install -r $(BACKEND)/requirements-dev.txt"; \
	     exit 1; }

REQUIRE_ENV_KEYS = @missing=$$(awk -F= 'FNR==NR{if(/^[A-Za-z_][A-Za-z0-9_]*=/) want[$$1]=1; next} /^[A-Za-z_][A-Za-z0-9_]*=/{have[$$1]=1} END{for(k in want) if(!(k in have)) print k}' .env.example .env | sort); \
	test -z "$$missing" \
	|| { echo "error: .env is missing keys that .env.example defines:"; \
	     echo "$$missing" | sed 's/^/  /'; \
	     echo "Append them (the example values are dev-safe) with:"; \
	     echo "  grep -E '^($$(echo "$$missing" | paste -sd'|' -))=' .env.example >> .env"; \
	     exit 1; }

REQUIRE_ONE_HEAD = @heads=$$(awk '/^revision/{n=split($$0,a,/[\047\042]/); if(n>=3) rev[a[2]]=1} /^down_revision/{n=split($$0,a,/[\047\042]/); for(i=2;i<n;i+=2) down[a[i]]=1} END{for(r in rev) if(!(r in down)) print r}' $(VERSIONS)/*.py | sort); \
	test $$(echo "$$heads" | wc -l) -eq 1 \
	|| { echo "error: migrations have multiple heads -- alembic upgrade head will fail:"; \
	     echo "$$heads" | sed 's/^/  /'; \
	     echo "Rebase your migration's down_revision onto the other head, or merge them:"; \
	     echo "  cd $(BACKEND) && $(VENV_BIN)/alembic merge heads -m \"merge heads\""; \
	     exit 1; }

.PHONY: dev test lint check

dev:
	$(REQUIRE_ENV)
	$(REQUIRE_ENV_KEYS)
	$(REQUIRE_ONE_HEAD)
	$(COMPOSE) up -d --build --wait
	$(COMPOSE) exec -T api alembic upgrade head
	@echo
	@echo "API      http://localhost:$(API_PORT)"
	@echo "Docs     http://localhost:$(API_PORT)/docs"
	@echo
	@echo "Logs     $(COMPOSE) logs -f api"
	@echo "Seed     $(COMPOSE) exec api python -m app.commands.seed"

test:
	$(REQUIRE_VENV)
	# Model/migration drift is invisible to the suite, which builds its schema
	# with create_all -- so it is checked here rather than only in `make check`.
	cd $(BACKEND) && $(VENV_BIN)/alembic check
	cd $(BACKEND) && $(VENV_BIN)/pytest

lint:
	$(REQUIRE_VENV)
	cd $(BACKEND) && $(VENV_BIN)/ruff check .

check:
	$(REQUIRE_VENV)
	cd $(BACKEND) && $(VENV_BIN)/python -m compileall -q app tests
	cd $(BACKEND) && $(VENV_BIN)/ruff check .
	cd $(BACKEND) && $(VENV_BIN)/alembic check
	cd $(BACKEND) && $(VENV_BIN)/pytest
