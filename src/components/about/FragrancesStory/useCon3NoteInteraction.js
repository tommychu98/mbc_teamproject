import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import ingredientSource from './assets/con3-ingredients.png';

const inactiveBrightness = 0.85;
const inactiveSaturation = 0.50;

const centers = [[0.24, 0.6], [0.64, 0.3], [0.79, 0.79]];
function inside(x, y, points) {
  let result = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i], [xj, yj] = points[j];
    if ((yi > y) !== (yj > y) && x < (xj-xi) * (y-yi) / (yj-yi) + xi) result = !result;
  }
  return result;
}

// Partition the existing PNG pixels. Tone and saturation affect RGB only;
// original alpha, texture and geometry are preserved throughout.
function ingredientLayers(image, buttons, bottleImage, cleanIngredients) {
  const source = document.createElement('canvas');
  const mobile = window.matchMedia('(width < 768px)').matches;
  // Keep mobile compositing at the rendered Retina resolution, not full export size.
  source.width = mobile ? Math.min(image.naturalWidth, Math.ceil(image.clientWidth * Math.min(window.devicePixelRatio || 1, 2))) : image.naturalWidth;
  source.height = Math.round(image.naturalHeight * source.width / image.naturalWidth);
  const ctx = source.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, source.width, source.height);
  const pixels = ctx.getImageData(0, 0, source.width, source.height);
  // The mobile export includes the product. Use the existing isolated bottle's
  // alpha silhouette to exclude it from ingredient tone changes, including edges.
  let bottleMask;
  let productCanvas;
  if (mobile) {
    const mask = document.createElement('canvas');
    mask.width = source.width; mask.height = source.height;
    const maskCtx = mask.getContext('2d', { willReadFrequently: true });
    // Align the isolated source crop with its slot in the 1024 × 549 composite.
    maskCtx.drawImage(bottleImage, 586, 24, 552, 876,
      419 / 1024 * source.width, 153 / 549 * source.height,
      186 / 1024 * source.width, 297 / 549 * source.height);
    bottleMask = maskCtx.getImageData(0, 0, source.width, source.height).data;
    productCanvas = document.createElement('canvas');
    productCanvas.width = source.width; productCanvas.height = source.height;
    productCanvas.className = 'fragrances-con3__mobile-product';
    productCanvas.setAttribute('aria-hidden', 'true');
    const product = ctx.createImageData(source.width, source.height);
    const clean = document.createElement('canvas');
    clean.width = source.width; clean.height = source.height;
    clean.getContext('2d').drawImage(cleanIngredients, 0, 0, source.width, source.height);
    const behind = clean.getContext('2d').getImageData(0, 0, source.width, source.height);
    for (let p = 0; p < pixels.data.length; p += 4) {
      if (!bottleMask[p+3]) continue;
      product.data.set(pixels.data.subarray(p, p+4), p);
      pixels.data.set(behind.data.subarray(p, p+4), p);
    }
    productCanvas.getContext('2d').putImageData(product, 0, 0);
  }
  const layers = Array.from({ length: 4 }, (_, index) => {
    const canvas = document.createElement('canvas');
    canvas.width = source.width; canvas.height = source.height;
    canvas.className = 'fragrances-con3__ingredient-layer';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.dataset.ingredientLayer = buttons[index]?.dataset.ingredient || 'bottle';
    return { canvas, pixels: ctx.createImageData(source.width, source.height) };
  });
  const polygons = buttons.map(button => getComputedStyle(button).clipPath.match(/[\d.]+/g)
    .reduce((points, value, i, values) => i % 2 ? points : [...points, [+value / 100, +values[i+1] / 100]], []));
  for (let y = 0; y < source.height; y++) {
    for (let x = 0; x < source.width; x++) {
      const p = (y * source.width + x) * 4;
      if (!pixels.data[p+3]) continue;
      const nx = x / source.width, ny = y / source.height;
      let region = polygons.findIndex(points => inside(nx, ny, points));
      if (region < 0) {
        const distances = centers.map(([cx, cy]) => ((nx-cx)/.3)**2 + ((ny-cy)/.4)**2);
        region = distances.indexOf(Math.min(...distances));
      }
      layers[region].pixels.data.set(pixels.data.subarray(p, p+4), p);
    }
  }
  // Feather only region weights, never the artwork itself. One compositing
  // surface avoids seams and reconstructs the exact original alpha at rest.
  const weights = layers.map(({ canvas, pixels: data }) => {
    const mask = document.createElement('canvas');
    mask.width = source.width; mask.height = source.height;
    canvas.getContext('2d').putImageData(data, 0, 0);
    const maskCtx = mask.getContext('2d', { willReadFrequently: true });
    maskCtx.filter = `blur(${14 * source.width / image.naturalWidth}px)`; maskCtx.drawImage(canvas, 0, 0);
    return maskCtx.getImageData(0, 0, source.width, source.height).data;
  });
  const canvas = layers[0].canvas;
  canvas.removeAttribute('data-ingredient-layer');
  const output = new ImageData(new Uint8ClampedArray(pixels.data), source.width, source.height);
  const levels = { bergamot: 1, iris: 1, ambrettes: 1, bottle: 1 };
  const keys = Object.keys(levels);
  const render = () => {
    const values = keys.map(key => levels[key]);
    for (let p = 3; p < pixels.data.length; p += 4) {
      if (!pixels.data[p]) continue;
      const sum = weights[0][p] + weights[1][p] + weights[2][p] + weights[3][p];
      const brightness = sum ? (weights[0][p]*values[0] + weights[1][p]*values[1] + weights[2][p]*values[2] + weights[3][p]) / sum : 1;
      // The same feathered focus blend drives tone and color continuously.
      // Preserve alpha; mute RGB toward luminance without losing fine detail.
      const saturation = 1 - (1 - brightness) / (1 - inactiveBrightness) * (1 - inactiveSaturation);
      const red = pixels.data[p-3], green = pixels.data[p-2], blue = pixels.data[p-1];
      const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
      output.data[p-3] = (luminance + (red - luminance) * saturation) * brightness;
      output.data[p-2] = (luminance + (green - luminance) * saturation) * brightness;
      output.data[p-1] = (luminance + (blue - luminance) * saturation) * brightness;
    }
    canvas.getContext('2d').putImageData(output, 0, 0);
    canvas.dataset.focusLevels = JSON.stringify(Object.fromEntries(keys.map(key => [key, levels[key]])));
  };
  render();
  return { canvas, levels, render, productCanvas, mobile };
}

export default function useCon3NoteInteraction(sceneRef) {
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;
    const image = scene.querySelector('.fragrances-con3__perfume');
    const bottleImage = scene.querySelector('.fragrances-con3__main-perfume-image');
    const cleanIngredients = new Image();
    cleanIngredients.src = ingredientSource;
    const targets = scene.querySelector('.fragrances-con3__ingredient-targets');
    const buttons = [...targets.querySelectorAll('button')];
    const notes = [...scene.querySelectorAll('.fragrances-con3__note')];
    const typography = notes.flatMap(note => [...note.querySelectorAll('dt, dd')]);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let artwork, source = '', active = -1, hovered = -1, focused = -1;
    let disposed = false, generation = 0, leaveFrame;
    let sweep;
    const restore = () => {
      active = -1; sweep?.kill(); buttons.forEach(button => button.setAttribute('aria-pressed', 'false'));
      if (artwork) gsap.to(artwork.levels, { bergamot: 1, iris: 1, ambrettes: 1, duration: 0.65, ease: 'sine.inOut', overwrite: true, onUpdate: artwork.render,
        onComplete: () => { if (active === -1 && !artwork.mobile) { image.style.removeProperty('opacity'); artwork.canvas.style.visibility = 'hidden'; } } });
      gsap.to(notes, { '--note-light-opacity': 0, duration: 0.65, overwrite: true });
      if (!window.matchMedia('(width < 768px)').matches) typography.forEach(text => gsap.to(text, { color: text.closest('.fragrances-con3__note').dataset.originalColor,
        textShadow: 'none', duration: 0.65, ease: 'sine.inOut', overwrite: true }));
    };
    const activate = (index, replay = false) => {
      cancelAnimationFrame(leaveFrame);
      if (active === index && !replay) return;
      active = index; sweep?.kill(); buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      if (artwork) {
        artwork.canvas.style.visibility = 'visible';
        gsap.to(artwork.levels, { bergamot: index === 0 ? 1 : inactiveBrightness, iris: index === 1 ? 1 : inactiveBrightness, ambrettes: index === 2 ? 1 : inactiveBrightness,
          duration: 0.65, ease: 'sine.inOut', overwrite: true, onUpdate: artwork.render });
        image.style.opacity = '0';
      }
      const mobile = window.matchMedia('(width < 768px)').matches;
      // Mobile typography follows aria-pressed in CSS; keep desktop GSAP intact.
      if (!mobile) notes.forEach((note, i) => {
        const selected = i === index;
        for (const [selector, isName] of [['dt', false], ['dd', true]]) {
          gsap.to(note.querySelector(selector), {
            color: selected ? (mobile ? (isName ? '#76532f' : '#493b2e') : (isName ? '#fffdf5' : '#fff9ed')) : note.dataset.originalColor,
            textShadow: selected ? (isName
              ? '0 2px 5px rgba(38,27,17,0.47), 0 4px 10px rgba(38,27,17,0.22)'
              : '0 1px 3px rgba(38,27,17,0.25)') : 'none',
            duration: 0.55, ease: 'sine.inOut', overwrite: true,
          });
        }
      });
      const note = notes[index];
      gsap.set(notes.filter((_, i) => i !== index), { '--note-light-opacity': 0 });
      // Mobile keeps the note emphasis steady rather than sweeping light across it.
      if (mobile) return;
      sweep = gsap.timeline()
        .to(note, { '--note-light-opacity': 0, duration: 0.1 })
        .set(note, { '--note-light-position': motion.matches ? '50%' : '150%' })
        .to(note, { '--note-light-opacity': 0.95, duration: 0.3, ease: 'sine.inOut' })
        .to(note, { '--note-light-position': motion.matches ? '50%' : '-50%', duration: motion.matches ? 0 : 0.85, ease: 'sine.inOut' }, 0.25)
        .to(note, { '--note-light-opacity': 0, duration: 0.35 }, 1.0);
    };
    let nearViewport = false;
    const place = async () => {
      if (!nearViewport || disposed) return;
      const box = image.getBoundingClientRect(), parent = scene.getBoundingClientRect();
      Object.assign(targets.style, { left: `${box.left-parent.left}px`, top: `${box.top-parent.top}px`, width: `${box.width}px`, height: `${box.height}px` });
      const current = image.currentSrc || image.src;
      if (source === current) return;
      const version = ++generation;
      try {
        await image.decode();
        if (window.matchMedia('(width < 768px)').matches) {
          await bottleImage.decode();
          await cleanIngredients.decode();
        }
      } catch { return; }
      if (disposed || version !== generation) return;
      const next = ingredientLayers(image, buttons, bottleImage, cleanIngredients);
      if (artwork) { gsap.killTweensOf(artwork.levels); artwork.canvas.remove(); artwork.productCanvas?.remove(); }
      artwork = next; source = current;
      ['bergamot','iris','ambrettes'].forEach((key, i) => { artwork.levels[key] = active < 0 || i === active ? 1 : inactiveBrightness; });
      artwork.render(); artwork.canvas.style.visibility = active < 0 && !artwork.mobile ? 'hidden' : 'visible'; targets.prepend(artwork.canvas);
      if (artwork.productCanvas) bottleImage.parentElement.append(artwork.productCanvas);
      if (active >= 0 || artwork.mobile) image.style.opacity = '0';
      else image.style.removeProperty('opacity');
    };
    notes.forEach(note => { note.dataset.originalColor = getComputedStyle(note).color; });
    const handlers = buttons.map((button, index) => {
      const enter = event => { if (event.pointerType === 'mouse') { hovered = index; activate(index); } };
      const leave = event => {
        if (event.pointerType !== 'mouse') return;
        hovered = -1;
        // A direct move to another ingredient cancels this reset before paint.
        leaveFrame = requestAnimationFrame(() => { if (hovered < 0) { focused = -1; restore(); } });
      };
      const focus = () => { if (button.matches(':focus-visible')) { focused = index; activate(index); } };
      const blur = () => { focused = -1; if (hovered < 0) restore(); };
      const click = () => activate(index, true);
      for (const [event, handler] of [['pointerenter',enter],['pointerleave',leave],['focus',focus],['blur',blur],['click',click]]) button.addEventListener(event,handler);
      return () => { for (const [event, handler] of [['pointerenter',enter],['pointerleave',leave],['focus',focus],['blur',blur],['click',click]]) button.removeEventListener(event,handler); };
    });
    const outside = event => { if (!event.target.closest('.fragrances-con3__ingredient')) { hovered = focused = -1; restore(); } };
    const escape = event => { if (event.key === 'Escape') { hovered = focused = -1; restore(); } };
    const resetOnExit = new IntersectionObserver(entries => { if (!entries[0].isIntersecting && active >= 0 && focused < 0) restore(); });
    resetOnExit.observe(scene);
    document.addEventListener('pointerdown', outside); scene.addEventListener('keydown', escape);
    let previousMobile = window.matchMedia('(width < 768px)').matches;
    const resize = new ResizeObserver(() => {
      const mobile = window.matchMedia('(width < 768px)').matches;
      if (mobile !== previousMobile) {
        restore(); gsap.killTweensOf(typography);
        typography.forEach(text => { text.style.removeProperty('color'); text.style.removeProperty('text-shadow'); });
        previousMobile = mobile;
      }
      source = ''; notes.forEach(note => { const color = note.style.color; note.style.removeProperty('color'); note.dataset.originalColor = getComputedStyle(note).color; note.style.color = color; }); place(); });
    // Prepare the expensive pixel partitions before this scene approaches view,
    // rather than blocking the Hero's first frames on initial page load.
    const preparation = new IntersectionObserver(([entry]) => {
      nearViewport = entry.isIntersecting;
      if (nearViewport) place();
    }, { rootMargin: '100% 0px' });
    preparation.observe(scene);
    resize.observe(scene); resize.observe(image); image.addEventListener('load', place); place();
    return () => {
      disposed = true; generation++; cancelAnimationFrame(leaveFrame); sweep?.kill();
      gsap.killTweensOf(notes); gsap.killTweensOf(typography); if (artwork) gsap.killTweensOf(artwork.levels); handlers.forEach(cleanup => cleanup());
      preparation.disconnect(); resize.disconnect(); resetOnExit.disconnect(); image.removeEventListener('load', place);
      document.removeEventListener('pointerdown', outside); scene.removeEventListener('keydown', escape);
      artwork?.canvas.remove(); artwork?.productCanvas?.remove(); image.style.removeProperty('opacity'); targets.removeAttribute('style');
      typography.forEach(text => text.removeAttribute('style'));
      notes.forEach(note => { note.removeAttribute('style'); delete note.dataset.originalColor; });
      buttons.forEach(button => button.setAttribute('aria-pressed', 'false'));
    };
  }, [sceneRef]);
}
