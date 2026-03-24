# Test Komutları

## Tüm Testler

```bash
# Hepsini çalıştır (Web + API + Perf)
npm test
# veya
bash scripts/run-all.sh
```

---

## Web Testleri (Playwright)

```bash
# Tüm web testleri
npm run test:web
npx playwright test

# Belirli bir dosya
npx playwright test tests/web/homepage.spec.ts
npx playwright test tests/web/form.spec.ts
npx playwright test tests/web/api-mock.spec.ts

# Belirli bir test adıyla
npx playwright test -g "sayfa başlığı doğru yükleniyor"

# Browser görünür modda
npm run test:web:headed
npx playwright test --headed

# Sadece Chromium
npx playwright test --project=chromium

# Sadece Firefox
npx playwright test --project=firefox

# Debug modu
npm run test:web:debug
npx playwright test --debug

# İnteraktif UI
npm run test:web:ui

# Raporu aç
npm run report
npx playwright show-report reports/playwright
```

---

## API Testleri (Hurl)

```bash
# Tüm API testleri
npm run test:api
hurl --test --glob 'tests/api/**/*.hurl'

# Belirli bir dosya
hurl --test tests/api/posts.hurl
hurl --test tests/api/users.hurl
hurl --test tests/api/auth.hurl

# Verbose (detaylı çıktı)
npm run test:api:verbose
hurl --test --verbose tests/api/posts.hurl

# HTML rapor üret
npm run test:api:report
hurl --test --glob 'tests/api/**/*.hurl' --report-html reports/api

# Birden fazla dosya
hurl --test tests/api/posts.hurl tests/api/users.hurl

# Sadece belirli HTTP metodu içerenleri çalıştır
hurl --test --glob 'tests/api/posts.hurl'
```

---

## Performans Testleri (k6)

> Her test bitişinde `reports/k6/<test-adı>-report.html` ve `.json` otomatik üretilir.
> Canlı izleme için: `K6_WEB_DASHBOARD=true k6 run ...` → tarayıcıda `http://127.0.0.1:5665` aç

```bash
# Tüm performans testleri (sırayla)
npm run test:perf
node scripts/k6-runner.mjs

# Tekil test çalıştır
k6 run tests/performance/load-test.js
k6 run tests/performance/stress-test.js
k6 run tests/performance/spike-test.js

# VU (Virtual User) ve süre belirterek
k6 run --vus 20 --duration 30s tests/performance/load-test.js

# Çıktıyı JSON'a kaydet
k6 run --out json=reports/k6-results.json tests/performance/load-test.js

# Özet rapor (terminal)
k6 run --summary-trend-stats="avg,min,med,max,p(90),p(95),p(99)" tests/performance/load-test.js

# Canlı web dashboard (tarayıcıda http://127.0.0.1:5665)
K6_WEB_DASHBOARD=true k6 run tests/performance/load-test.js

# Dashboard + raporu kaydet
K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=reports/k6/dashboard.html k6 run tests/performance/load-test.js

# Raporları aç
open reports/k6/load-test-report.html
open reports/k6/stress-test-report.html
open reports/k6/spike-test-report.html
```

---

## Tag / Grep ile Filtreleyerek Çalıştırma

### Playwright — `--grep` (regex destekli)

```bash
# Sadece @smoke tag'li testler
npx playwright test --grep "@smoke"

# Sadece @regression tag'li testler
npx playwright test --grep "@regression"

# Hem @smoke hem @critical olanlar (AND)
npx playwright test --grep "(?=.*@smoke)(?=.*@critical)"

# @smoke VEYA @ui olanlar (OR)
npx playwright test --grep "@smoke|@ui"

# @regression hariç hepsi
npx playwright test --grep-invert "@regression"

# Test adında "navigasyon" geçenler
npx playwright test --grep "navigasyon"

# describe adıyla filtrele
npx playwright test --grep "Homepage Tests"
```

Mevcut tag'ler: `@smoke` `@critical` `@regression` `@ui` `@network`

---

### k6 — `--tags` (metrik filtreleme)

k6'da tag'ler test seçimi için değil, metrik/sonuç filtreleme içindir. Test seçimi dosya adıyla yapılır:

```bash
# Tekil çalıştırma
k6 run tests/performance/load-test.js
k6 run tests/performance/stress-test.js
k6 run tests/performance/spike-test.js

# Not: --tag sadece metrik output'u etiketler, test seçimi yapmaz
k6 run --tag env=staging tests/performance/load-test.js
```

---

### Hurl — `--glob` ile dosya bazlı filtreleme

Hurl'de tag yoktur, filtreleme dosya adı veya glob pattern ile yapılır:

```bash
# Sadece posts testleri
hurl --test tests/api/posts.hurl

# posts ve users birlikte
hurl --test tests/api/posts.hurl tests/api/users.hurl

# Glob ile tüm api testleri
hurl --test --glob 'tests/api/**/*.hurl'

# İsme göre glob (örn: auth içerenler)
hurl --test --glob 'tests/api/*auth*.hurl'
```

---

## Tip Bazında Çalıştırma

| Komut | Ne Çalışır |
|-------|-----------|
| `npm run test:web` | Sadece Playwright testleri |
| `npm run test:api` | Sadece Hurl API testleri |
| `npm run test:perf` | Sadece k6 perf testleri |
| `npm test` | Hepsi sırayla |
