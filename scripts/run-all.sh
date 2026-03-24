#!/bin/bash
# ============================================================
# Tüm testleri sırayla çalıştırır
# Kullanım: bash scripts/run-all.sh
# ============================================================
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

passed=0; failed=0

run_step() {
  local name="$1"; shift
  echo -e "\n${YELLOW}━━━ $name ━━━${NC}"
  if "$@"; then
    echo -e "${GREEN}✔ $name PASSED${NC}"
    ((passed++))
  else
    echo -e "${RED}✗ $name FAILED${NC}"
    ((failed++))
  fi
}

run_step "Web Tests (Playwright)"      npx playwright test
run_step "API Tests (Hurl)"            hurl --test --glob 'tests/api/**/*.hurl'
run_step "Performance Tests (k6)"      node scripts/k6-runner.mjs

echo -e "\n${YELLOW}════════════════════════════${NC}"
echo -e "Results: ${GREEN}$passed passed${NC}, ${RED}$failed failed${NC}"
[ "$failed" -eq 0 ] && exit 0 || exit 1
