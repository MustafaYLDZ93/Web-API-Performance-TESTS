All-Test-Types/
│
├── .github/workflows/tests.yml      ← GitHub Actions
├── .gitignore
│
├── tests/
│   ├── web/                         ← Playwright (7 spec)
│   │   ├── pages/                   ← POM sınıfları (4 dosya)
│   │   │   ├── BasePage.ts
│   │   │   ├── PlaywrightHomePage.ts
│   │   │   ├── PlaywrightDocsPage.ts
│   │   │   └── JsonPlaceholderPage.ts
│   │   ├── homepage.spec.ts         ← normal test
│   │   ├── form.spec.ts             ← normal test
│   │   ├── api-mock.spec.ts         ← normal test
│   │   ├── pom-homepage.spec.ts     ← POM test
│   │   ├── pom-docs.spec.ts         ← POM test
│   │   └── pom-api.spec.ts          ← POM test
│   │
│   ├── api/                         ← Hurl (3 dosya)
│   │   ├── posts.hurl
│   │   ├── users.hurl
│   │   └── auth.hurl
│   │
│   └── performance/                 ← k6 (3 + helper)
│       ├── load-test.js
│       ├── stress-test.js
│       ├── spike-test.js
│       └── summary.js               ← HTML/JSON rapor üretici
│
├── scripts/
│   ├── run-all.sh                   ← bash ile hepsini çalıştır
│   └── k6-runner.mjs               ← tüm k6 testlerini iterate eder
│
├── playwright.config.ts             ← sadece chromium 
├── package.json                     ← @playwright/test: 1.58.2
└── package-lock.json


Trigger: Sadece workflow_dispatch (manuel)

Job	            -     Container	                                   
🌐 Web Tests	- mcr.microsoft.com/playwright:v1.58.2-jammy	
🔗 API Tests	- ubuntu-latest (runner)	
⚡ Perf Tests	- grafana/k6:latest + --entrypoint /bin/sh	
