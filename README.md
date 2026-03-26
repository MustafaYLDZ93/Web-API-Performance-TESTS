# Web-API-Performance-TESTS

[![GitHub Pages](https://img.shields.io/badge/Guide-Live%20%F0%9F%93%96-brightgreen)](https://mustafayldz93.github.io/Web-API-Performance-TESTS/)
[![Playwright](https://img.shields.io/badge/Playwright-1.58.2-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev)
[![Hurl](https://img.shields.io/badge/Hurl-7.1.0-FF6B35?logo=curl&logoColor=white)](https://hurl.dev)
[![k6](https://img.shields.io/badge/k6-Performance-7D64FF?logo=k6&logoColor=white)](https://k6.io)
[![CI](https://github.com/MustafaYLDZ93/Web-API-Performance-TESTS/actions/workflows/tests.yml/badge.svg)](https://github.com/MustafaYLDZ93/Web-API-Performance-TESTS/actions/workflows/tests.yml)
[![Jenkins](https://img.shields.io/badge/Jenkins-Local%20CI-D24939?logo=jenkins&logoColor=white)](http://localhost:8080/job/All-Test-Types/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

Tek repo altında üç farklı test tipi: **Playwright** (web) · **Hurl** (API) · **k6** (performans)

---

## Teknolojiler

| Test Tipi | Araç | Versiyon |
|-----------|------|----------|
| Web (UI) | Playwright | 1.58.2 |
| API | Hurl | 7.1.0 |
| Performans / Yük | k6 | latest |

---

## Klasör Yapısı

```
├── .github/workflows/tests.yml     # GitHub Actions (workflow_dispatch)
├── tests/
│   ├── web/                        # Playwright testleri
│   │   ├── pages/                  # Page Object Model sınıfları
│   │   │   ├── BasePage.ts
│   │   │   ├── PlaywrightHomePage.ts
│   │   │   ├── PlaywrightDocsPage.ts
│   │   │   └── JsonPlaceholderPage.ts
│   │   ├── homepage.spec.ts
│   │   ├── form.spec.ts
│   │   ├── api-mock.spec.ts
│   │   ├── pom-homepage.spec.ts
│   │   ├── pom-docs.spec.ts
│   │   └── pom-api.spec.ts
│   ├── api/                        # Hurl testleri
│   │   ├── posts.hurl
│   │   ├── users.hurl
│   │   └── auth.hurl
│   └── performance/                # k6 testleri
│       ├── load-test.js
│       ├── stress-test.js
│       ├── spike-test.js
│       └── summary.js
├── scripts/
│   ├── run-all.sh
│   └── k6-runner.mjs
├── playwright.config.ts
└── package.json
```

---

## Kurulum

```bash
npm install
npx playwright install chromium
brew install hurl
brew install k6
```

---

## Çalıştırma

```bash
# Tüm testler
npm test

# Sadece web
npm run test:web

# Sadece API
npm run test:api

# Sadece performans
npm run test:perf
```

### Playwright — tag ile filtreleme

```bash
npx playwright test --grep "@smoke"
npx playwright test --grep "@regression"
npx playwright test --grep-invert "@regression"
npx playwright test --project=chromium
```

### Hurl — glob ile filtreleme

```bash
hurl --test --glob 'tests/api/**/*.hurl'
hurl --test tests/api/posts.hurl
```

### k6 — test seçimi

```bash
k6 run tests/performance/load-test.js
k6 run tests/performance/stress-test.js
k6 run tests/performance/spike-test.js
```

---

## Jenkins (Local CI)

Local Jenkins pipeline — GitHub Actions ile aynı parametre yapısı.

```
http://localhost:8080/job/All-Test-Types/
```

**Başlatma:** Jenkins → All-Test-Types → Parametrelerle Çalıştır

| Parametre | Seçenekler |
|-----------|-----------|
| `TEST_SUITE` | all / web / api / performance |
| `PLAYWRIGHT_TAG` | @smoke, @regression, @ui, @network, @critical |
| `PLAYWRIGHT_PROJECT` | all / chromium / firefox / mobile-safari |
| `PLAYWRIGHT_FILE` | belirli .spec.ts dosyası |
| `HURL_GLOB` | glob pattern seçimi |
| `HURL_VERBOSE` | detaylı çıktı |
| `K6_TEST` | all / load-test / stress-test / spike-test |
| `K6_VUS` | Virtual User sayısı override |
| `K6_DURATION` | süre override (örn: 30s) |

> Raporlar build sonunda **Artifacts** olarak arşivlenir.

---

## GitHub Actions

Manuel çalıştırma: **Actions → Run workflow**

| Input | Açıklama |
|-------|----------|
| `test_suite` | all / web / api / performance |
| `playwright_tag` | @smoke, @regression, @ui, @network, @critical |
| `playwright_project` | chromium / firefox / mobile-safari / all |
| `playwright_file` | belirli .spec.ts dosyası |
| `hurl_glob` | glob pattern seçimi |
| `hurl_verbose` | detaylı çıktı |
| `k6_test` | load-test / stress-test / spike-test / all |
| `k6_vus` | Virtual User sayısı override |
| `k6_duration` | süre override (örn: 30s) |

### Container'lar

| Job | Image |
|-----|-------|
| Web Tests | `mcr.microsoft.com/playwright:v1.58.2-jammy` |
| API Tests | `ubuntu-latest` + Hurl binary |
| Perf Tests | `grafana/k6:latest` |

Test raporları her run sonunda artifact olarak 30 gün saklanır.
