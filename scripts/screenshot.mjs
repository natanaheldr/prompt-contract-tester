import puppeteer from 'puppeteer';
import { createServer } from 'vite';
import { setTimeout } from 'node:timers/promises';
import { mkdirSync } from 'node:fs';

async function main() {
  const server = await createServer({ configFile: './vite.config.ts' });
  await server.listen();
  console.log('Dev server started');

  mkdirSync('./screenshots', { recursive: true });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Taking screenshot...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await setTimeout(3000);
  await page.screenshot({ path: './screenshots/app-full.png', fullPage: true });

  console.log('Screenshot saved to screenshots/app-full.png');
  await browser.close();
  await server.close();
  console.log('Done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
