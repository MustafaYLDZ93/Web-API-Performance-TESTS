tests/web/
├── pages/                          ← Page Object sınıfları
│   ├── BasePage.ts                 ← Ortak metodlar (goto, getTitle, waitForIdle...)
│   ├── PlaywrightHomePage.ts       ← playwright.dev ana sayfa
│   ├── PlaywrightDocsPage.ts       ← playwright.dev/docs
│   └── JsonPlaceholderPage.ts      ← API fetch + mock metodları
│
├── pom-homepage.spec.ts            ← PlaywrightHomePage kullanan testler
├── pom-docs.spec.ts                ← PlaywrightDocsPage kullanan testler
└── pom-api.spec.ts                 ← JsonPlaceholderPage kullanan testler
