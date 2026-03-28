/**
 * generate.js
 * Puppeteer로 wallpaper.html을 1179×2556으로 렌더링하고
 * public/wallpaper.png 로 저장합니다.
 */

const puppeteer = require('puppeteer');
const path      = require('path');
const fs        = require('fs');

(async () => {
  const htmlPath = 'file://' + path.resolve(__dirname, 'wallpaper.html');
  const outDir   = path.resolve(__dirname, 'public');
  const outPath  = path.join(outDir, 'wallpaper.png');

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('🚀 Puppeteer 시작...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
    ],
  });

  const page = await browser.newPage();

  // 정확히 iPhone 15 Pro 해상도
  await page.setViewport({ width: 1179, height: 2556, deviceScaleFactor: 1 });

  // Google Fonts 로딩 대기
  await page.goto(htmlPath, { waitUntil: 'networkidle0', timeout: 30000 });

  // 폰트 렌더링 안정화 대기
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({
    path: outPath,
    type: 'png',
    clip: { x: 0, y: 0, width: 1179, height: 2556 },
  });

  await browser.close();

  const size = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`✅ 저장 완료: ${outPath} (${size} KB)`);
})();
