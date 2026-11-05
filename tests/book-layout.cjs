// Requires Playwright and an installed Chrome; uses only temporary classroom data.
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const temporary = fs.mkdtempSync(path.join(process.env.BOOK_TEST_WORK || os.tmpdir(), 'bestiarium-layout-'));
const output = process.env.BOOK_TEST_OUTPUT || path.join(temporary, 'screenshots');
fs.mkdirSync(output, { recursive: true });
const chrome = process.env.BESTIARIUM_CHROME || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : undefined);
const server = http.createServer((request, response) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
  if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
  try {
    const types = { '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.html': 'text/html' };
    response.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    response.end(fs.readFileSync(file));
  } catch { response.writeHead(404).end(); }
});
let browser;
async function main() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launchPersistentContext(path.join(temporary, 'profile'), {
    executablePath: chrome, headless: true, viewport: { width: 1920, height: 1080 }
  });
  const page = browser.pages()[0];
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  const settle = () => page.evaluate(() => bookTests.settle());
  const audit = async () => { await settle(); assert.deepEqual(await page.evaluate(() => bookTests.audit()), []); };
  const read = () => page.evaluate(() => bookTests.readAllPages());
  const expected = id => page.evaluate(id => bookTests.expected(id), id);
  const report = [];
  for (const [width, height] of [[1920, 1080], [1366, 768], [1900, 830]]) {
    for (const zoom of [1, 1.25, 1.5]) {
      // Set real browser zoom in our own disposable profile, not CSS zoom or page scale.
      const settings = await browser.newPage();
      await settings.goto('chrome://settings/appearance');
      await settings.evaluate(zoom => new Promise(resolve => chrome.settingsPrivate.setDefaultZoom(zoom, resolve)), zoom);
      await settings.close();
      await page.setViewportSize({ width, height });
      await page.goto(`${origin}/tests/book-layout.html`);
      await page.waitForFunction(() => document.documentElement.dataset.ready);
      const actual = await page.evaluate(() => ({ width: innerWidth, height: innerHeight, dpr: devicePixelRatio }));
      assert(Math.abs(actual.width - width / zoom) <= 1);
      for (const id of ['niffler', 'pandanaflora', 'wolf', 'bowtruckle', 'wespuin', 'zuckerdornechse']) {
        await page.evaluate(id => bookTests.render(id), id);
        await audit();
        assert.equal((await read())[0], await expected(id));
        if (['niffler', 'pandanaflora'].includes(id)) {
          await page.screenshot({ path: path.join(output, `${id}-${width}x${height}-zoom${zoom * 100}.png`) });
        }
      }
      await page.evaluate(() => bookTests.render()); await audit(); await read();
      await page.locator('[data-entry-id="niffler"]').click(); await audit();
      await page.evaluate(() => { const pair = () => document.querySelector('.book-position').textContent.match(/Seite (\d+) von (\d+)/); while (pair()[1] !== pair()[2]) document.querySelector('.book-edge-right').click(); document.querySelector('.book-edge-right').click(); }); await audit();
      assert.match(await page.locator('#view-title').innerText(), /Pandanaflora/);
      await page.locator('.book-edge-left').click(); await audit();
      assert.match(await page.locator('#view-title').innerText(), /Niffler/);
      for (const detail of ['structure', 'language', 'fantasy', 'revision', 'check']) {
        await page.evaluate(detail => bookTests.render('codex', detail), detail); await audit();
        assert.deepEqual(await read(), await page.evaluate(detail => bookTests.expectedCodex(detail), detail));
      }
      await page.evaluate(() => { bookTests.longSection(true); bookTests.render('niffler'); });
      await audit(); assert.equal((await read())[0], await expected('niffler'));
      await page.evaluate(() => { bookTests.longSection(false); bookTests.render('niffler'); });
      await settle();
      await page.locator('.book-options > summary').click(); await page.getByRole('button', { name: 'Größer', exact: true }).click(); await page.locator('.book-options > summary').click();
      await audit(); assert.equal((await read())[0], await expected('niffler'));
      await page.evaluate(() => bookTests.collection()); await audit();
      assert.equal((await read())[0], await page.evaluate(() => {
        const f = bookTests.fixture;
        return f.first.description;
      }));
      await page.locator('.book-options > summary').click(); await page.getByRole('button', { name: 'Überarbeitet', exact: true }).click(); await page.locator('.book-options > summary').click(); await audit();
      assert.equal((await read())[0], await page.evaluate(() => {
        const f = bookTests.fixture;
        return f.revised.description;
      }));
      assert(await page.evaluate(() => bookTests.unchanged()));
      report.push({ width, height, zoom, actual });
      console.log(`OK ${width}×${height}, ${zoom * 100}%`);
    }
  }
  // Keep the same view mounted while size and font metrics change.
  await page.evaluate(() => bookTests.render('niffler')); await settle();
  await page.setViewportSize({ width: 1900, height: 830 }); await audit();
  await page.evaluate(() => document.documentElement.style.fontSize = '120%'); await audit();
  await page.evaluate(async () => {
    const font = new FontFace('LayoutTest', 'local(Arial)'); await font.load(); document.fonts.add(font);
    document.querySelector('.safe-book-copy').style.fontFamily = 'LayoutTest'; window.dispatchEvent(new Event('resize'));
  });
  await audit(); assert.equal((await read())[0], await expected('niffler'));
  assert.deepEqual(pageErrors, []);
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(report, null, 2));
  console.log(`All text pages and navigation passed. Screenshots: ${output}`);
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  await browser?.close(); server.close();
});
