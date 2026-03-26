// ============================================================
// 🧪 All Test Types — Jenkins Pipeline
// GitHub Actions YAML ile aynı parametre yapısı
// ============================================================

pipeline {
    agent any

    // ── Parametreler (GitHub Actions inputs ile birebir) ────
    parameters {

        // Genel
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'web', 'api', 'performance'],
            description: '🎯 Çalıştırılacak test suite'
        )

        // ── Playwright ─────────────────────────────────────
        string(
            name: 'PLAYWRIGHT_TAG',
            defaultValue: '',
            description: '🏷️  Playwright tag (@smoke | @regression | @ui | @network | @critical)'
        )
        string(
            name: 'PLAYWRIGHT_GREP_INVERT',
            defaultValue: '',
            description: '🚫 Playwright — hariç tutulacak tag (örn: @regression)'
        )
        choice(
            name: 'PLAYWRIGHT_PROJECT',
            choices: ['all', 'chromium', 'firefox', 'mobile-safari'],
            description: '🌐 Playwright browser projesi'
        )
        string(
            name: 'PLAYWRIGHT_FILE',
            defaultValue: '',
            description: '📄 Belirli Playwright dosyası (örn: tests/web/homepage.spec.ts)'
        )

        // ── Hurl ───────────────────────────────────────────
        choice(
            name: 'HURL_GLOB',
            choices: [
                'tests/api/**/*.hurl',
                'tests/api/posts.hurl',
                'tests/api/users.hurl',
                'tests/api/auth.hurl',
                'tests/api/*auth*.hurl',
                'tests/api/posts.hurl tests/api/users.hurl'
            ],
            description: '🔗 Hurl glob pattern'
        )
        booleanParam(
            name: 'HURL_VERBOSE',
            defaultValue: false,
            description: '📢 Hurl verbose output'
        )

        // ── k6 ─────────────────────────────────────────────
        choice(
            name: 'K6_TEST',
            choices: ['all', 'load-test', 'stress-test', 'spike-test'],
            description: '⚡ k6 test dosyası'
        )
        string(
            name: 'K6_VUS',
            defaultValue: '',
            description: '👥 k6 Virtual Users sayısı override (örn: 10)'
        )
        string(
            name: 'K6_DURATION',
            defaultValue: '',
            description: '⏱️  k6 süre override (örn: 30s, 1m)'
        )
    }

    // ── Ortam değişkenleri ───────────────────────────────────
    environment {
        REPO_DIR      = '/Users/musti/Desktop/All-Test-Types'
        REPORT_DIR    = "${REPO_DIR}/reports"
        NODE_PATH     = '/opt/homebrew/bin'
        PATH          = "/opt/homebrew/bin:${env.PATH}"
    }

    // ── Seçenekler ───────────────────────────────────────────
    options {
        timestamps()
        ansiColor('xterm')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    // ========================================================
    stages {
    // ========================================================

        // ── Kaynak Kodunu Çek ────────────────────────────────
        stage('📥 Checkout') {
            steps {
                echo '📥 GitHub\'dan kaynak kod çekiliyor...'
                dir("${REPO_DIR}") {
                    sh 'git pull origin main'
                }
            }
        }

        // ── Bağımlılıkları Yükle ─────────────────────────────
        stage('📦 Install Dependencies') {
            when {
                expression { params.TEST_SUITE == 'all' || params.TEST_SUITE == 'web' }
            }
            steps {
                dir("${REPO_DIR}") {
                    echo '📦 npm bağımlılıkları yükleniyor...'
                    sh 'npm ci'
                    echo '🎭 Playwright browser\'ları yükleniyor...'
                    sh 'npx playwright install --with-deps chromium firefox webkit'
                }
            }
        }

        // ── Rapor Klasörleri Oluştur ─────────────────────────
        stage('📁 Prepare Reports') {
            steps {
                dir("${REPO_DIR}") {
                    sh 'mkdir -p reports/playwright reports/playwright-results reports/api reports/k6'
                }
            }
        }

        // ────────────────────────────────────────────────────
        // JOB 1 — Web Tests (Playwright)
        // ────────────────────────────────────────────────────
        stage('🌐 Web Tests — Playwright') {
            when {
                expression { params.TEST_SUITE == 'all' || params.TEST_SUITE == 'web' }
            }
            steps {
                dir("${REPO_DIR}") {
                    script {
                        def cmd = 'npx playwright test'

                        // Browser project filtresi
                        if (params.PLAYWRIGHT_PROJECT && params.PLAYWRIGHT_PROJECT != 'all') {
                            cmd += " --project=${params.PLAYWRIGHT_PROJECT}"
                        }

                        // Tag grep filtresi
                        if (params.PLAYWRIGHT_TAG?.trim()) {
                            cmd += " --grep '${params.PLAYWRIGHT_TAG}'"
                        }

                        // Grep-invert filtresi
                        if (params.PLAYWRIGHT_GREP_INVERT?.trim()) {
                            cmd += " --grep-invert '${params.PLAYWRIGHT_GREP_INVERT}'"
                        }

                        // Belirli dosya
                        if (params.PLAYWRIGHT_FILE?.trim()) {
                            cmd += " ${params.PLAYWRIGHT_FILE}"
                        }

                        echo "▶ ${cmd}"
                        sh cmd
                    }
                }
            }
            post {
                always {
                    echo '📊 Playwright raporu arşivleniyor...'
                    archiveArtifacts(
                        artifacts: 'reports/playwright/**/*',
                        allowEmptyArchive: true
                    )
                }
            }
        }

        // ────────────────────────────────────────────────────
        // JOB 2 — API Tests (Hurl)
        // ────────────────────────────────────────────────────
        stage('🔗 API Tests — Hurl') {
            when {
                expression { params.TEST_SUITE == 'all' || params.TEST_SUITE == 'api' }
            }
            steps {
                dir("${REPO_DIR}") {
                    script {
                        def verboseFlag = params.HURL_VERBOSE ? '--verbose' : ''
                        def glob        = params.HURL_GLOB ?: 'tests/api/**/*.hurl'

                        // Çoklu dosya (boşlukla ayrılmış) veya glob
                        def hurlCmd
                        if (glob.contains(' ')) {
                            // Çoklu dosya: posts.hurl users.hurl
                            hurlCmd = "hurl --test ${verboseFlag} ${glob} --report-html reports/api"
                        } else if (glob.contains('*')) {
                            // Glob pattern
                            hurlCmd = "hurl --test ${verboseFlag} --glob '${glob}' --report-html reports/api"
                        } else {
                            // Tekil dosya
                            hurlCmd = "hurl --test ${verboseFlag} ${glob} --report-html reports/api"
                        }

                        echo "▶ ${hurlCmd}"
                        sh hurlCmd
                    }
                }
            }
            post {
                always {
                    echo '📊 Hurl raporu arşivleniyor...'
                    archiveArtifacts(
                        artifacts: 'reports/api/**/*',
                        allowEmptyArchive: true
                    )
                }
            }
        }

        // ────────────────────────────────────────────────────
        // JOB 3 — Performance Tests (k6)
        // ────────────────────────────────────────────────────
        stage('⚡ Performance Tests — k6') {
            when {
                expression { params.TEST_SUITE == 'all' || params.TEST_SUITE == 'performance' }
            }
            steps {
                dir("${REPO_DIR}") {
                    script {
                        def args = ''
                        if (params.K6_VUS?.trim())      args += " --vus ${params.K6_VUS}"
                        if (params.K6_DURATION?.trim()) args += " --duration ${params.K6_DURATION}"

                        def testFiles = []

                        if (params.K6_TEST == 'all' || params.K6_TEST == 'load-test') {
                            testFiles << 'tests/performance/load-test.js'
                        }
                        if (params.K6_TEST == 'all' || params.K6_TEST == 'stress-test') {
                            testFiles << 'tests/performance/stress-test.js'
                        }
                        if (params.K6_TEST == 'all' || params.K6_TEST == 'spike-test') {
                            testFiles << 'tests/performance/spike-test.js'
                        }

                        testFiles.each { testFile ->
                            echo "▶ k6 run${args} ${testFile}"
                            sh "k6 run${args} ${testFile}"
                        }
                    }
                }
            }
            post {
                always {
                    echo '📊 k6 raporu arşivleniyor...'
                    archiveArtifacts(
                        artifacts: 'reports/k6/**/*',
                        allowEmptyArchive: true
                    )
                }
            }
        }

    // ========================================================
    } // end stages
    // ========================================================

    // ── Pipeline sonuç bildirimleri ──────────────────────────
    post {
        success {
            echo '✅ Tüm testler başarıyla tamamlandı!'
        }
        failure {
            echo '❌ Testlerde hata oluştu. Raporları kontrol edin.'
        }
        unstable {
            echo '⚠️  Bazı testler başarısız oldu (unstable build).'
        }
        always {
            echo "📁 Raporlar: ${REPORT_DIR}"
        }
    }
}
