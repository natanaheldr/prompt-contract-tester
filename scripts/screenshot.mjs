import puppeteer from 'puppeteer';
import { createServer } from 'vite';

async function main() {
  const server = await createServer({ configFile: './vite.config.ts' });
  await server.listen();
  console.log('Dev server started');

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Taking 16:9 screenshot...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: './screenshots/app-full.png' });

  console.log('Screenshot saved');
  await browser.close();
  await server.close();
  console.log('Done');
}

main().catch((err) => { console.error(err); process.exit(1); });
