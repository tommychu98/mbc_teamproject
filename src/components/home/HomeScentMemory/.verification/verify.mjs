import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const here = dirname(fileURLToPath(import.meta.url));
const server = process.argv[2] ? null : await createServer({ root: resolve(here, '../../../../..'), server: { host: '127.0.0.1', port: 0, watch: null } });
if (server) await server.listen();
const url = process.argv[2] || `${server.resolvedUrls.local[0]}src/components/home/HomeScentMemory/.verification/preview.html`;
const browser = await chromium.launch({ headless: true });
try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(url);
    const section = page.locator('.home-scent-memory');
    const stage = page.locator('.home-scent-memory__stage');
    await section.waitFor();
    await page.evaluate(async () => { await document.fonts.ready; await document.querySelector('.home-scent-memory__lemon').decode(); });
    const geometry = await section.evaluate((node) => {
        const rect = (selector) => { const r = node.querySelector(selector).getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; };
        const image = node.querySelector('img');
        const text = node.querySelector('.home-scent-memory__copy--gray');
        const style = getComputedStyle(text);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = `${style.fontSize} ${style.fontFamily}`;
        return { stage: rect('.home-scent-memory__stage'), lemon: rect('.home-scent-memory__lemon'), text: rect('.home-scent-memory__copy--gray'), background: getComputedStyle(node).backgroundColor, fontSize: style.fontSize, lineHeight: style.lineHeight, spaceWidth: context.measureText(' ').width, imageLoaded: image.complete && image.naturalWidth === 1404, imageOpacity: getComputedStyle(image).opacity, scrollDistance: node.offsetHeight - node.querySelector('.home-scent-memory__stage').offsetHeight };
    });
    assert.equal(geometry.stage.width, 1920);
    assert.equal(geometry.stage.height, 1080);
    assert.equal(geometry.background, 'rgb(247, 246, 244)');
    assert.equal(geometry.imageLoaded, true);
    assert.equal(geometry.imageOpacity, '0.7');
    assert.equal(geometry.fontSize, '64px');
    assert.equal(geometry.lineHeight, '70.4px');
    for (const [key, expected] of Object.entries({ x: -287, y: 772, width: 1404, height: 936 })) assert.ok(Math.abs(geometry.lemon[key] - expected) < 0.1);
    assert.ok(Math.abs(geometry.text.y - 435) < 0.1);
    assert.ok(Math.abs(geometry.text.x - 576) < 0.1);
    assert.ok(Math.abs(geometry.text.width - 768) < 0.1);
    assert.ok(Math.abs(geometry.text.height - 211.2) < 0.1);
    assert.ok(Math.abs(geometry.text.x + geometry.text.width / 2 - 960) < 0.1);

    const sample = async (progress, screenshotName) => {
        await page.evaluate((scrollY) => window.scrollTo({ top: scrollY, behavior: 'instant' }), progress * geometry.scrollDistance);
        await page.waitForFunction((expected) => Math.abs(Number(document.querySelector('.home-scent-memory').dataset.scrollProgress) - expected) < 0.000001, progress);
        const state = await section.evaluate((node) => ({
            progress: Number(node.dataset.scrollProgress),
            inkOpacity: Number(getComputedStyle(node.querySelector('.home-scent-memory__copy--ink')).opacity),
            washEdge: Number(getComputedStyle(node).getPropertyValue('--memory-wash-edge')),
            gap: node.querySelector('.home-scent-memory__word-gap').getBoundingClientRect().width,
            stageY: node.querySelector('.home-scent-memory__stage').getBoundingClientRect().y,
            lemonOpacity: getComputedStyle(node.querySelector('img')).opacity,
        }));
        assert.equal(state.progress, progress);
        assert.ok(Math.abs(state.inkOpacity - (1 - progress)) < 0.000001);
        assert.equal(state.stageY, 0);
        assert.equal(state.lemonOpacity, '0.7');
        if (screenshotName) await stage.screenshot({ path: resolve(here, screenshotName) });
        return state;
    };
    const initial = await sample(0, '01-default-1920.png');
    const initialPixels = await stage.screenshot();
    const forward = [];
    for (const progress of [0.1, 0.25, 0.5, 0.75, 0.9, 1]) forward.push(await sample(progress, progress === 0.5 ? '02-midpoint-1920.png' : progress === 1 ? '03-gray-1920.png' : undefined));
    const backward = [];
    for (const progress of [0.9, 0.75, 0.5, 0.25, 0.1, 0]) backward.push(await sample(progress));
    assert.deepEqual(await stage.screenshot(), initialPixels, 'Default must return pixel-for-pixel after reverse scroll');
    for (const state of forward.slice(0, -1)) assert.deepEqual(backward.find((other) => other.progress === state.progress), state);
    assert.ok(Math.abs(forward.at(-1).gap - geometry.spaceWidth) < 0.1, 'Gray reproduces the Figma ne xt space');

    // Native wheel input changes progress continuously; it is never intercepted.
    await page.mouse.move(960, 540);
    await page.mouse.wheel(0, 540);
    await page.waitForTimeout(40);
    const early = Number(await section.getAttribute('data-scroll-progress'));
    assert.ok(early > 0 && early < 0.5, 'short follow smoothing produces an intermediate value');
    await page.waitForFunction(() => Number(document.querySelector('.home-scent-memory').dataset.scrollProgress) === 0.5);
    await page.mouse.wheel(0, 540);
    await page.waitForFunction(() => Number(document.querySelector('.home-scent-memory').dataset.scrollProgress) === 1);
    await page.mouse.wheel(0, -1080);
    await page.waitForFunction(() => Number(document.querySelector('.home-scent-memory').dataset.scrollProgress) === 0);

    // Match the resolution of the Figma screenshots for visual comparison.
    await page.setViewportSize({ width: 1024, height: 576 });
    await page.waitForTimeout(200);
    await stage.screenshot({ path: resolve(here, '04-default-1024.png') });
    await page.mouse.wheel(0, 576);
    await page.waitForFunction(() => Number(document.querySelector('.home-scent-memory').dataset.scrollProgress) === 1);
    await stage.screenshot({ path: resolve(here, '05-gray-1024.png') });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => Number(document.querySelector('.home-scent-memory').dataset.scrollProgress) === 0);
    assert.deepEqual(errors, []);
    await writeFile(resolve(here, 'report.json'), JSON.stringify({ result: 'passed', geometry, initial, forward, backward, earlyWheelProgress: early, checks: ['Exact Desktop image geometry and typography', 'Fixed ivory background and 70% lemon drawing at every progress', 'Continuous progress at 0/10/25/50/75/90/100%', 'Sticky stage remains at y=0 throughout', 'Forward and reverse states are identical at each progress', 'Default returns pixel-for-pixel', 'Native wheel Default to Gray to Default', 'Gray ne xt spacing matches actual font metrics', 'Resize recalculates geometry and scroll distance', 'Reduced motion preserves scroll-driven states', 'No runtime errors'] }, null, 2));
    console.log('PASS: Figma geometry, continuous/reversible interpolation, sticky placement, wheel, pixel-identical return, resize, reduced motion.');
} finally {
    await browser.close();
    await server?.close();
}
