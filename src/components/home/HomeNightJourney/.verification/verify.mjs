import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

const browser = await chromium.launch({ channel: 'msedge', headless: true });

try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    await page.locator('.intro-video').waitFor({ state: 'hidden', timeout: 12000 });

    const journey = page.locator('.night-journey');
    const stage = page.locator('.night-journey__stage');
    const start = await journey.evaluate((element) => window.scrollY + element.getBoundingClientRect().top);
    const width = 1920;
    const height = await journey.evaluate((element) => element.getBoundingClientRect().height);
    assert.equal(height, 1080 + 4 * width);
    assert.equal(await journey.locator('[data-scene]').count(), 5);
    assert.equal(await journey.locator('[data-night-particle]').count(), 49);
    assert.equal(await journey.locator('.night-journey__category a').count(), 8); // desktop and mobile markup

    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), start - 900);
    await page.waitForTimeout(350);
    await page.mouse.move(800, 550);
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(350);
    const entry = await journey.evaluate((element) => ({
        top: Math.round(element.getBoundingClientRect().top),
        sceneOneLeft: Math.round(element.querySelector('[data-scene="Con7-1"]').getBoundingClientRect().left),
        headerHidden: document.querySelector('.header')?.classList.contains('header--hidden'),
    }));
    assert.equal(entry.top, 0);
    assert.equal(entry.sceneOneLeft, width);
    assert.ok(entry.headerHidden);
    console.log('night to Con6', JSON.stringify(entry));

    const checkpoint = async (index) => {
        await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), start + index * width);
        await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        await stage.screenshot({ path: join(tmpdir(), `night-journey-${index}.png`) });
        const result = await journey.evaluate((element) => ({
            scrollY: Math.round(window.scrollY),
            scrollX: window.scrollX,
            stageTop: Math.round(element.querySelector('.night-journey__stage').getBoundingClientRect().top),
            transform: element.querySelector('.night-journey__track').style.transform,
            activeScene: [...element.querySelectorAll('[data-scene]')].map((node) => node.getBoundingClientRect().left),
            loaded: [...element.querySelectorAll('.night-journey__stage img')].every((image) => image.complete && image.naturalWidth > 0),
        }));
        assert.equal(result.scrollX, 0);
        assert.equal(result.stageTop, 0);
        assert.ok(result.loaded);
        assert.ok(Math.abs(result.activeScene[index]) <= 1);
        console.log(`scene ${index}`, JSON.stringify(result));
    };

    for (let index = 0; index < 5; index += 1) await checkpoint(index);

    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), start + width / 2);
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await stage.screenshot({ path: join(tmpdir(), 'night-journey-between-con6-con7.png') });
    const drifting = await journey.locator('[data-night-particle]').evaluateAll((nodes) => nodes.filter((node) => Number(node.style.opacity) > 0.05 && node.style.transform.includes('translate3d')).length);
    assert.ok(drifting > 5);
    console.log('drifting particles', drifting);

    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), start);
    await page.mouse.move(800, 550);
    const wheelPositions = [];
    for (let step = 0; step < 8; step += 1) {
        await page.mouse.wheel(0, 420);
        await page.waitForTimeout(80);
        wheelPositions.push(await journey.evaluate((element) => ({
            scrollY: Math.round(window.scrollY),
            stageTop: Math.round(element.querySelector('.night-journey__stage').getBoundingClientRect().top),
            sceneOneLeft: Math.round(element.querySelector('[data-scene="Con7-1"]').getBoundingClientRect().left),
            particles: [...element.querySelectorAll('[data-night-particle]')].slice(0, 4).map((node) => [node.style.transform, node.style.opacity]),
        })));
    }
    assert.ok(wheelPositions.every((item) => item.stageTop === 0));
    assert.ok(wheelPositions.every((item, index) => index === 0 || item.sceneOneLeft < wheelPositions[index - 1].sceneOneLeft));
    assert.ok(wheelPositions[0].particles[0][0] !== wheelPositions.at(-1).particles[0][0]);
    console.log('wheel', JSON.stringify(wheelPositions.map(({ scrollY, sceneOneLeft }) => ({ scrollY, sceneOneLeft }))));

    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), start + 4 * width + 400);
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const released = await stage.evaluate((element) => Math.round(element.getBoundingClientRect().top));
    assert.ok(released < 0);
    console.log('released', released);

    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), start + 2 * width);
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.locator('[data-scene="Con7-2"] .night-journey__view-more').click();
    assert.equal(new URL(page.url()).searchParams.get('category'), 'candles-home');
    console.log('category link', page.url());

    await page.close();

    const compact = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    await compact.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    await compact.locator('.intro-video').waitFor({ state: 'hidden', timeout: 12000 });
    const compactJourney = compact.locator('.night-journey');
    const compactStart = await compactJourney.evaluate((element) => window.scrollY + element.getBoundingClientRect().top);
    await compact.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), compactStart + 2 * 1440);
    await compact.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const compactResult = await compactJourney.evaluate((element) => ({
        height: Math.round(element.getBoundingClientRect().height),
        stageTop: Math.round(element.querySelector('.night-journey__stage').getBoundingClientRect().top),
        sceneTwoLeft: Math.round(element.querySelector('[data-scene="Con7-2"]').getBoundingClientRect().left),
    }));
    assert.equal(compactResult.height, 900 + 4 * 1440);
    assert.equal(compactResult.stageTop, 0);
    assert.ok(Math.abs(compactResult.sceneTwoLeft) <= 1);
    console.log('compact desktop', JSON.stringify(compactResult));
    await compact.close();

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    await mobile.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    await mobile.locator('.intro-video').waitFor({ state: 'hidden', timeout: 12000 });
    const mobileJourney = mobile.locator('.night-journey');
    await mobileJourney.screenshot({ path: join(tmpdir(), 'night-journey-mobile.png') });
    const mobileResult = await mobileJourney.evaluate((element) => ({
        height: Math.round(element.getBoundingClientRect().height),
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        visibleCategories: [...element.querySelectorAll('.night-journey__mobile-panel')].length,
        loaded: [...element.querySelectorAll('.night-journey__mobile img')].every((image) => image.complete && image.naturalWidth > 0),
    }));
    assert.equal(mobileResult.visibleCategories, 4);
    assert.ok(mobileResult.loaded);
    assert.equal(mobileResult.documentWidth, mobileResult.viewportWidth);
    console.log('mobile', JSON.stringify(mobileResult));
    await mobile.close();
} finally {
    await browser.close();
}
