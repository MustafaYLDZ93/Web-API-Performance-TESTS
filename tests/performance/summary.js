/**
 * k6 handleSummary helper — tüm test dosyaları bu modülü import eder.
 * Her test bitişinde reports/k6/<testName>-report.html ve .json üretir.
 */
export function generateSummary(testName) {
  return function (data) {
    return {
      [`reports/k6/${testName}-report.json`]: JSON.stringify(data, null, 2),
      [`reports/k6/${testName}-report.html`]: htmlReport(data, testName),
    };
  };
}

function htmlReport(data, testName) {
  const metrics = data.metrics;
  const passed  = data.state?.testRunDurationMs !== undefined;

  const rows = Object.entries(metrics)
    .map(([name, m]) => {
      const avg = m.values?.avg != null ? m.values.avg.toFixed(2) : '—';
      const p95 = m.values?.['p(95)'] != null ? m.values['p(95)'].toFixed(2) : '—';
      const min = m.values?.min != null ? m.values.min.toFixed(2) : '—';
      const max = m.values?.max != null ? m.values.max.toFixed(2) : '—';
      return `<tr><td>${name}</td><td>${avg}</td><td>${min}</td><td>${max}</td><td>${p95}</td></tr>`;
    })
    .join('\n');

  const thresholdRows = Object.entries(metrics)
    .filter(([, m]) => m.thresholds)
    .map(([name, m]) => {
      const results = Object.entries(m.thresholds)
        .map(([cond, t]) => {
          const ok = !t.ok === false;
          const badge = t.ok
            ? '<span style="color:#22c55e">✔ PASS</span>'
            : '<span style="color:#ef4444">✘ FAIL</span>';
          return `<tr><td>${name}</td><td><code>${cond}</code></td><td>${badge}</td></tr>`;
        })
        .join('');
      return results;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8"/>
  <title>k6 Report — ${testName}</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 24px; }
    h1   { color: #7c3aed; }
    h2   { color: #94a3b8; font-size: 1rem; text-transform: uppercase; letter-spacing: .05em; margin-top: 2rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th   { background: #1e293b; padding: 8px 12px; text-align: left; font-size: .8rem; color: #64748b; }
    td   { padding: 8px 12px; border-bottom: 1px solid #1e293b; font-size: .85rem; }
    tr:hover td { background: #1e293b; }
    code { background: #1e293b; padding: 2px 6px; border-radius: 4px; font-size: .8rem; }
    .badge { padding: 2px 8px; border-radius: 999px; font-size: .75rem; font-weight: 600; }
  </style>
</head>
<body>
  <h1>k6 Performance Report</h1>
  <p><strong>Test:</strong> ${testName} &nbsp;|&nbsp;
     <strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>

  <h2>Threshold Sonuçları</h2>
  <table>
    <tr><th>Metrik</th><th>Koşul</th><th>Sonuç</th></tr>
    ${thresholdRows || '<tr><td colspan="3">Threshold tanımlanmamış</td></tr>'}
  </table>

  <h2>Metrik Özeti</h2>
  <table>
    <tr><th>Metrik</th><th>Avg</th><th>Min</th><th>Max</th><th>p(95)</th></tr>
    ${rows}
  </table>
</body>
</html>`;
}
