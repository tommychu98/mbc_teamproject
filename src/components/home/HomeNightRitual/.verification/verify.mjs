import { chromium } from 'playwright';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const browser = await chromium.launch({
    headless: true,
    channel: 'msedge',
});

try {
    for (const width of [1920, 390]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
        await page.goto('http://127.0.0.1:5173/src/components/home/HomeNightRitual/preview.html', { waitUntil: 'networkidle' });
        const section = page.locator('.home-night-ritual');
        await section.scrollIntoViewIfNeeded();
        await section.screenshot({ path: join(tmpdir(), `home-night-render-${width}.png`) });
        const result = await section.evaluate((element) => ({
            width: element.getBoundingClientRect().width,
            height: element.getBoundingClientRect().height,
            images: [...element.querySelectorAll('img')].map((image) => ({
                src: image.currentSrc.split('/').pop(),
                loaded: image.complete && image.naturalWidth > 0,
                x: Math.round(image.getBoundingClientRect().x - element.getBoundingClientRect().x),
                y: Math.round(image.getBoundingClientRect().y - element.getBoundingClientRect().y),
                width: Math.round(image.getBoundingClientRect().width),
                height: Math.round(image.getBoundingClientRect().height),
            })),
            collection: element.querySelector('a')?.getAttribute('href'),
        }));
        console.log(width, JSON.stringify(result));
        await page.close();
    }
} finally {
    await browser.close();
}
