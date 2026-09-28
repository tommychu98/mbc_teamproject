import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourceDir = path.join(root, 'tmp', 'home-decor-reference');
const outputDir = path.join(root, 'public', 'images', 'products', 'home-decor-hover');
const manifestPath = path.join(sourceDir, 'hover-manifest.json');
const sourceDataPath = path.join(root, 'src', 'data', 'products', 'homeDecorProducts.js');
const inputDir = path.join(sourceDir, 'generation-inputs');

const listFiles = [
  'diffuser-list.html',
  'freshener-list.html',
  'spray-list.html',
];

const toAbsoluteImageUrl = (url) => url.replaceAll('&amp;', '&').replace(/\?.*$/, '');

const getListProducts = async () => {
  const products = [];

  for (const file of listFiles) {
    const html = await readFile(path.join(sourceDir, file), 'utf8');
    const units = html.split('<div class="v-product-unit');

    for (const unit of units.slice(1)) {
      const goodsNo = unit.match(/data-goods-no="(\d+)"/)?.[1];
      const image = unit.match(/src="(https:\/\/image\.shinsegaev\.com\/upload\/C00001\/s3\/goods\/org\/[^"?]+)(?:\?[^"<]*)?"/)?.[1];
      const name = unit.match(/alt="DIPTYQUE ([^"]+?) \| 신세계V"/)?.[1];

      if (goodsNo && image && name) products.push({ goodsNo, image, name });
    }
  }

  return products;
};

const fetchText = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.text();
};

const fetchBuffer = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return Buffer.from(await response.arrayBuffer());
};

const getGalleryImages = (html) => {
  const galleryEnd = html.indexOf('<div class="v-product-info');
  const galleryHtml = galleryEnd > 0 ? html.slice(0, galleryEnd) : html.slice(0, 120_000);
  return [...galleryHtml.matchAll(/data-large-image="([^"]+)"/g)]
    .map((match) => toAbsoluteImageUrl(match[1]))
    .filter((url, index, urls) => urls.indexOf(url) === index);
};

const runPool = async (items, limit, worker) => {
  let cursor = 0;
  const results = new Array(items.length);

  const runner = async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  };

  await Promise.all(Array.from({ length: limit }, runner));
  return results;
};

await mkdir(outputDir, { recursive: true });
await mkdir(inputDir, { recursive: true });

const sourceData = await readFile(sourceDataPath, 'utf8');
const sourceProducts = [...sourceData.matchAll(/\['HOME DECOR', '([^']+)', \d+, '(https:\/\/image\.shinsegaev\.com\/[^']+)'/g)]
  .map(([, name, image]) => ({ name, image }));

await runPool(sourceProducts, 5, async ({ name, image }) => {
  const fileName = path.basename(new URL(image).pathname);
  await writeFile(path.join(inputDir, fileName), await fetchBuffer(image));
  return { name, image, fileName };
});

const products = await getListProducts();
const manifest = await runPool(products, 5, async (product) => {
  const detailUrl = `https://www.shinsegaev.com/goods/initDetailGoods.siv?goods_no=${product.goodsNo}`;

  try {
    const detailHtml = await fetchText(detailUrl);
    const galleryImages = getGalleryImages(detailHtml);
    const alternates = galleryImages.filter((url) => url !== product.image);
    const hoverSource = alternates.at(-1);

    if (!hoverSource) {
      return { ...product, detailUrl, status: 'missing-alternate', galleryImages };
    }

    const sourceStem = path.basename(product.image, path.extname(product.image));
    const extension = path.extname(new URL(hoverSource).pathname).toLowerCase() || '.jpg';
    const fileName = `${sourceStem}-hover${extension}`;
    const localFile = path.join(outputDir, fileName);
    await writeFile(localFile, await fetchBuffer(hoverSource));

    return {
      ...product,
      detailUrl,
      hoverSource,
      hoverImage: `/images/products/home-decor-hover/${fileName}`,
      status: 'downloaded',
      galleryImages,
    };
  } catch (error) {
    return { ...product, detailUrl, status: 'error', error: error.message };
  }
});

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

const counts = Object.groupBy(manifest, ({ status }) => status);
console.log(`Products: ${manifest.length}`);
for (const [status, entries] of Object.entries(counts)) console.log(`${status}: ${entries.length}`);
console.log(`Manifest: ${manifestPath}`);
