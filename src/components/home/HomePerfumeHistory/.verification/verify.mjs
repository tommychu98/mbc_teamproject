import assert from 'node:assert/strict';
import { createServer as createHttpServer } from 'node:http';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';

// An isolated harness: no application route or existing source file is changed.
const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../../../..');
const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' });
const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}.spacer{height:300px}.after{height:1000px}</style></head><body><div class="spacer"></div><div id="root"></div><div class="after"></div><script type="module" src="/src/components/home/HomePerfumeHistory/.verification/preview.jsx"></script></body></html>`;
const server = createHttpServer(async (req, res) => {
    if (req.url === '/__perfume-history__/') {
        res.setHeader('Content-Type', 'text/html');
        res.end(await vite.transformIndexHtml(req.url, html));
    } else vite.middlewares(req, res, () => { res.statusCode = 404; res.end(); });
});
await new Promise((ready) => server.listen(0, '127.0.0.1', ready));
let browser;
try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/__perfume-history__/`);
    const section = page.locator('.home-perfume-history');
    await section.waitFor();
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map((img) => img.decode())); window.scrollTo(0, 300); });
    const index = async () => Number(await section.getAttribute('data-active-index'));
    const assertPair = async (expected) => {
        assert.equal(await index(), expected);
        const pair = await section.evaluate((node) => ({
            photo: node.querySelector('.home-perfume-history__photo-slide[aria-hidden="false"]').dataset.pair,
            logo: node.querySelector('.home-perfume-history__logo-slide[aria-hidden="false"]').dataset.pair,
        }));
        assert.deepEqual(pair, { photo: `3-${expected + 1}`, logo: `3-logo${expected + 1}` });
    };
    const resetScroll = () => page.evaluate(() => window.scrollTo(0, 300));
    const snapshot = async (name) => {
        await resetScroll();
        const rendered = await section.evaluate((node) => {
            const photo = node.querySelector('.home-perfume-history__photo-slide[aria-hidden="false"]');
            const logo = node.querySelector('.home-perfume-history__logo-slide[aria-hidden="false"]');
            const title = photo.querySelector('h2');
            return { photoX: photo.getBoundingClientRect().x, logoX: logo.getBoundingClientRect().x, titleY: title.getBoundingClientRect().y, fontSize: parseFloat(getComputedStyle(title).fontSize), secondLineY: title.lastElementChild?.getBoundingClientRect().y };
        });
        const active = await index();
        assert.ok(Math.abs(rendered.photoX) < 0.1);
        assert.ok(Math.abs(rendered.logoX - 1250) < 0.1);
        assert.ok(Math.abs(rendered.titleY - [765, 709, 768][active]) < 0.1);
        assert.ok(Math.abs(rendered.fontSize - [130, 96, 130][active]) < 0.1);
        if (active === 1) assert.ok(Math.abs(rendered.secondLineY - 797) < 0.1);
        await section.screenshot({ path: resolve(here, `${name}.png`) });
    };
    const geometry = await section.evaluate((node) => {
        const rect = (selector) => { const r = node.querySelector(selector).getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
        return { width: node.clientWidth, height: node.clientHeight, photo: rect('.home-perfume-history__photo'), logo: rect('.home-perfume-history__logo-window'), topText: rect('.home-perfume-history__oval-text--top'), bottomText: rect('.home-perfume-history__oval-text--bottom'), prev: rect('.home-perfume-history__button--prev'), next: rect('.home-perfume-history__button--next'), background: getComputedStyle(node).backgroundColor, images: [...node.querySelectorAll('img')].map((img) => ({ loaded: img.complete && img.naturalWidth > 0, src: img.getAttribute('src') })) };
    });
    assert.equal(geometry.width, 1920);
    assert.equal(geometry.height, 1080);
    assert.equal(geometry.photo.width, 960);
    assert.equal(geometry.background, 'rgb(247, 246, 244)');
    for (const [key, target] of Object.entries({ logo: { x: 1250, y: 299, width: 380, height: 510 }, topText: { x: 1217, y: 244, width: 445.493, height: 283.76 }, bottomText: { x: 1217, y: 559, width: 444.97, height: 277.488 }, prev: { x: 1042, y: 528, width: 67, height: 24 }, next: { x: 1771, y: 528, width: 67, height: 24 } })) {
        for (const [axis, value] of Object.entries(target)) assert.ok(Math.abs(geometry[key][axis] - value) < 0.1, `${key}.${axis}`);
    }
    assert.ok(geometry.images.every((img) => img.loaded && !img.src.startsWith('https:')));
    await assertPair(0);
    await snapshot('01-orpheon');

    // Native scrolling is allowed at the first and last slide.
    await page.mouse.move(480, 500);
    await page.mouse.wheel(0, -120);
    await page.waitForTimeout(250);
    assert.ok(await page.evaluate(() => window.scrollY) < 300);
    await assertPair(0);
    await resetScroll();

    await page.getByRole('button', { name: 'Next perfume', exact: true }).click();
    await page.waitForTimeout(120);
    await assertPair(1);
    const midAnimation = await section.evaluate((node) => ['photo', 'logo'].map((part) => { const style = getComputedStyle(node.querySelector(`.home-perfume-history__${part}-track`)); const matrix = new DOMMatrixReadOnly(style.transform); return { x: matrix.m41, y: matrix.m42, opacity: style.opacity }; }));
    assert.ok(midAnimation[0].x > 0 && midAnimation[0].x < 990);
    assert.ok(midAnimation[1].x < 0 && midAnimation[1].x > -454);
    assert.ok(midAnimation.every((track) => track.y === 0 && track.opacity === '1'));
    await page.waitForTimeout(750);
    await snapshot('02-boulevard');
    await page.getByRole('button', { name: 'Next perfume', exact: true }).click();
    await page.waitForTimeout(850);
    await assertPair(2);
    await snapshot('03-fleur-de-peau');
    await page.mouse.move(1440, 500);
    await page.mouse.wheel(0, 160);
    await page.waitForTimeout(250);
    assert.ok(await page.evaluate(() => window.scrollY) > 300);
    await assertPair(2);
    await resetScroll();

    // Reverse wheel direction works on both logo and photo regions.
    await page.mouse.move(1440, 500);
    await page.mouse.wheel(0, -120);
    await page.waitForTimeout(850);
    await assertPair(1);
    await page.mouse.move(480, 500);
    await page.mouse.wheel(0, -120);
    await page.waitForTimeout(850);
    await assertPair(0);

    const wheel = (deltaY, deltaMode = 0) => page.locator('.home-perfume-history__logo-panel').evaluate((node, values) => {
        const event = new WheelEvent('wheel', { deltaY: values.deltaY, deltaMode: values.deltaMode, bubbles: true, cancelable: true });
        node.dispatchEvent(event);
        return event.defaultPrevented;
    }, { deltaY, deltaMode });
    for (let i = 0; i < 7; i++) assert.equal(await wheel(8), true);
    await assertPair(0);
    assert.equal(await wheel(8), true);
    await assertPair(1);
    // Continue beyond the animation duration to test trackpad momentum suppression.
    for (let i = 0; i < 20; i++) { await wheel(120); await page.waitForTimeout(50); }
    await assertPair(1);
    await page.waitForTimeout(220);
    await page.mouse.move(480, 500);
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(850);
    await assertPair(2);
    assert.equal(await wheel(120), false);
    await page.getByRole('button', { name: 'Previous perfume', exact: true }).click();
    await page.waitForTimeout(850);
    await assertPair(1);
    await page.getByRole('button', { name: 'Previous perfume', exact: true }).click();
    await page.waitForTimeout(850);
    await assertPair(0);
    assert.equal(await wheel(-120), false);
    await page.waitForTimeout(220);
    await wheel(4, 1);
    await assertPair(1);
    await page.waitForTimeout(850);
    await page.waitForTimeout(220);
    await wheel(1, 2);
    await assertPair(2);
    assert.deepEqual(errors, []);
    await mkdir(here, { recursive: true });
    await writeFile(resolve(here, 'report.json'), JSON.stringify({ result: 'passed', geometry, midAnimation, checks: ['Figma desktop geometry and all eight image assets', 'All three synchronized photo-logo pairs', 'Prev and Next in both directions', 'Wheel up/down on both panels', '60px threshold and 720ms animation lock', 'Continuing momentum beyond animation duration', 'Native page scroll at both boundaries', 'Pixel, line, and page wheel delta modes', 'Opposite X-axis animation without fade', 'No browser runtime errors'] }, null, 2));
    console.log('PASS: desktop geometry, all 3 pairs, wheel/threshold/lock/momentum, Prev/Next, boundary page scroll.');
} finally {
    await browser?.close();
    await new Promise((done) => server.close(done));
    await vite.close();
}
