// Favicons and app icons, drawn from the tokens and the vector mark.
//   python3 tools/build_tokens.py && node tools/make_icons.mjs
// Writes img/favicon.svg, img/icon-{48,96,192,180,512}.png and favicon.ico
// (16/32/48) at the site root, which Google and browsers look for.
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(ROOT, 'css/tokens.css'), 'utf8');
const tok = (n) => css.match(new RegExp(`--${n}: ([^;]+);`))[1].trim();
const resolve = (v) => (v.startsWith('var(') ? resolve(tok(v.slice(6, -1))) : v);
const ground = resolve(tok('purple-tint')), ring = resolve(tok('purple-line')), ink = resolve(tok('brand-ink'));
const mark = readFileSync(join(ROOT, 'img/brand/follow-me-therapy-mark.svg'), 'utf8');
const vb = mark.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
const body = mark.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>[\s\S]*?<\/title>/, '').replace(/fill="#[0-9a-fA-F]+"/g, `fill="${ink}"`);
// The mark fills ~64% of the height, centred, inside a lilac disc Google crops to a circle anyway.
const S = 512, h = S * 0.64, w = h * vb[2] / vb[3];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}"><circle cx="256" cy="256" r="256" fill="${ground}"/><circle cx="256" cy="256" r="244" fill="none" stroke="${ring}" stroke-width="16"/><g transform="translate(${(S - w) / 2} ${(S - h) / 2 + 4}) scale(${h / vb[3]})">${body}</g></svg>\n`;
writeFileSync(join(ROOT, 'img/favicon.svg'), svg);
const b = await chromium.launch(); const p = await b.newPage();
const png = async (size) => { await p.setViewportSize({ width: size, height: size });
  await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  return p.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } }); };
const out = {};
for (const s of [16, 32, 48, 96, 180, 192, 512]) out[s] = await png(s);
await b.close();
for (const s of [32, 48, 96, 180, 192, 512]) writeFileSync(join(ROOT, `img/icon-${s}.png`), out[s]);
// favicon.ico holding PNG images (supported by every current browser and by Google).
const imgs = [16, 32, 48].map((s) => [s, out[s]]);
const head = Buffer.alloc(6 + 16 * imgs.length); head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(imgs.length, 4);
let off = head.length;
imgs.forEach(([s, buf], i) => { const e = 6 + 16 * i; head[e] = s; head[e + 1] = s; head[e + 2] = 0; head[e + 3] = 0;
  head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6); head.writeUInt32LE(buf.length, e + 8); head.writeUInt32LE(off, e + 12); off += buf.length; });
writeFileSync(join(ROOT, 'favicon.ico'), Buffer.concat([head, ...imgs.map(([, buf]) => buf)]));
console.log('icons written: favicon.svg, favicon.ico, icon-32/48/96/180/192/512.png');
