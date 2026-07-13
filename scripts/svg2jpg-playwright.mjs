// 把資料夾內所有 .svg 用 Playwright（2x）轉成 .jpg 後刪除 .svg。
// 用法：node scripts/svg2jpg-playwright.mjs blog-drafts/XX-slug/images [寬] [高]
// 中文 SVG 一律走這支（sharp/librsvg 直轉中文會空白）。
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dir = path.resolve(process.argv[2] || '.');
const width = Number(process.argv[3]) || 1200;
const height = Number(process.argv[4]) || 700;
const svgs = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));
if (!svgs.length) {
  console.log('no .svg in', dir);
  process.exit(0);
}

const browser = await chromium.launch();
for (const f of svgs) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  await page.goto('file:///' + path.join(dir, f).replace(/\\/g, '/'));
  const png = await page.screenshot({ type: 'png' });
  await page.close();
  const out = path.join(dir, f.replace(/\.svg$/, '.jpg'));
  await sharp(png).flatten({ background: '#ffffff' }).jpeg({ quality: 90, chromaSubsampling: '4:4:4' }).toFile(out);
  fs.unlinkSync(path.join(dir, f));
  console.log('ok', f, '->', path.basename(out));
}
await browser.close();
