// WCAG 2.2 AAA audit of every page, desktop and phone, with the pop-ups open.
//   npm install && npx playwright install chromium   (once)
//   python3 -m http.server 8765 &  then  npm run a11y
// Exits non-zero if axe finds any violation.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright'); // CommonJS lookup, so a global install works too
const axe = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = process.env.BASE || 'http://localhost:8765/';
const PAGES = ['index.html', 'telehealth-occupational-therapy.html', 'esdm-melbourne.html', 'ndis-occupational-therapy.html',
  'occupational-therapy-north-western-melbourne.html', 'privacy.html', '404.html'];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const browser = await chromium.launch(); let failures = 0;
for (const page of PAGES) for (const width of [1400, 390]) {
  const p = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  await p.goto(BASE + page); await p.evaluate(() => document.fonts.ready);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } scrollTo(0, 0); });
  await p.addScriptTag({ content: axe });
  const check = async (label) => {
    const r = await p.evaluate(t => axe.run(document, { runOnly: { type: 'tag', values: t }, resultTypes: ['violations'] }), TAGS);
    for (const v of r.violations) for (const n of v.nodes) { failures++; console.log(`✗ ${label}  ${v.id}  ${n.target.join(' ')}\n    ${(n.any[0] || n.all[0] || n.none[0] || {}).message || v.help}`); }
  };
  await check(`${page} @${width}`);
  const triggers = await p.$$eval('[data-service],[data-funding],[data-open-contact],#contactUsButton', els => els.map((e, i) => i));
  for (const i of triggers) {
    await p.evaluate(i => document.querySelectorAll('[data-service],[data-funding],[data-open-contact],#contactUsButton')[i].click(), i);
    await p.waitForTimeout(600); await check(`${page} @${width} pop-up ${i + 1}`);
    await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  }
  await p.close();
}
await browser.close();
console.log(failures ? `${failures} violation(s)` : 'AAA audit: no violations');
process.exit(failures ? 1 : 0);
