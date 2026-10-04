import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';

const inactiveBrightness = 0.85;
const inactiveSaturation = 0.50;

// Con6's single merged Figma asset has a large tuberose bloom left of the
// bottle. Trace its petal footprint, excluding the small juniper blossoms.
const leftTuberose = [[.32,.52],[.36,.57],[.40,.55],[.43,.62],[.42,.72],
  [.44,.79],[.40,.83],[.37,.90],[.32,.88],[.30,.83],[.25,.82],
  [.27,.76],[.24,.72],[.27,.67],[.31,.65],[.30,.58]];
const centers = [[0.23, 0.60], [0.62, 0.35], [0.79, 0.80]];
const bottle = [[.45,.24],[.57,.24],[.58,.42],[.59,.76],[.57,.82],[.45,.82],[.43,.76],[.43,.42]];
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
function ingredientLayers(image, buttons) {
  const source = document.createElement('canvas');
  source.width = image.naturalWidth; source.height = image.naturalHeight;
  const ctx = source.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(image, 0, 0);
  const pixels = ctx.getImageData(0, 0, source.width, source.height);
  const layers = Array.from({ length: 4 }, (_, index) => {
    const canvas = document.createElement('canvas');
    canvas.width = source.width; canvas.height = source.height;
    canvas.className = 'fragrances-con6__ingredient-layer';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.dataset.ingredientLayer = buttons[index]?.dataset.ingredient || 'bottle';
    return { canvas, pixels: ctx.createImageData(source.width, source.height) };
  });
  const polygons = buttons.map(button => getComputedStyle(button).clipPath.match(/[\d.]+/g)
    .reduce((points, value, i, values) => i % 2 ? points : [...points, [+value / 100, +values[i+1] / 100]], []));
  const mobile = window.matchMedia('(width < 768px)').matches;
  for (let y = 0; y < source.height; y++) {
    for (let x = 0; x < source.width; x++) {
      const p = (y * source.width + x) * 4;
      if (!pixels.data[p+3]) continue;
      const nx = x / source.width, ny = y / source.height;
      let region = mobile && inside(nx, ny, bottle) ? 3
        : inside(nx, ny, leftTuberose) ? 1
        : polygons.findIndex(points => inside(nx, ny, points));
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
    maskCtx.filter = 'blur(14px)'; maskCtx.drawImage(canvas, 0, 0);
    return maskCtx.getImageData(0, 0, source.width, source.height).data;
  });
  const canvas = layers[0].canvas;
  canvas.removeAttribute('data-ingredient-layer');
  const output = new ImageData(new Uint8ClampedArray(pixels.data), source.width, source.height);
  const levels = { juniper: 1, tuberose: 1, sandalwood: 1, bottle: 1 };
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
  return { canvas, levels, render };
}

export default function useCon6NoteInteraction(sceneRef) {
  useLayoutEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;
    const image = scene.querySelector('.fragrances-con6__perfume');
    const targets = scene.querySelector('.fragrances-con6__ingredient-targets');
    const buttons = [...targets.querySelectorAll('button')];
    const notes = [...scene.querySelectorAll('.fragrances-con6__note')];
    const typography = notes.flatMap(note => [...note.querySelectorAll('dt, dd')]);
    let artwork, source = '', active = -1, hovered = -1, focused = -1;
    let disposed = false, generation = 0, leaveFrame;
    const restore = () => {
      active = -1; buttons.forEach(button => button.setAttribute('aria-pressed', 'false'));
      if (artwork) gsap.to(artwork.levels, { juniper: 1, tuberose: 1, sandalwood: 1, duration: 0.65, ease: 'sine.inOut', overwrite: true, onUpdate: artwork.render,
        onComplete: () => { if (active === -1) { image.style.removeProperty('opacity'); artwork.canvas.style.visibility = 'hidden'; } } });
      typography.forEach(text => gsap.to(text, { color: text.closest('.fragrances-con6__note').dataset.originalColor,
        textShadow: 'none', duration: 0.65, ease: 'sine.inOut', overwrite: true }));
    };
    const activate = (index, replay = false) => {
      cancelAnimationFrame(leaveFrame);
      if (active === index && !replay) return;
      active = index; buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      if (artwork) {
        artwork.canvas.style.visibility = 'visible';
        gsap.to(artwork.levels, { juniper: index === 0 ? 1 : inactiveBrightness, tuberose: index === 1 ? 1 : inactiveBrightness, sandalwood: index === 2 ? 1 : inactiveBrightness,
          duration: 0.65, ease: 'sine.inOut', overwrite: true, onUpdate: artwork.render });
        image.style.opacity = '0';
      }
      const mobile = window.matchMedia('(width < 768px)').matches;
      notes.forEach((note, i) => {
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

    };
    let nearViewport = false;
    const place = async () => {
      if (!nearViewport || disposed) return;
      const box = image.getBoundingClientRect(), parent = scene.getBoundingClientRect();
      Object.assign(targets.style, { left: `${box.left-parent.left}px`, top: `${box.top-parent.top}px`, width: `${box.width}px`, height: `${box.height}px` });
      const current = image.currentSrc || image.src;
      if (source === current) return;
      const version = ++generation;
      try { await image.decode(); } catch { return; }
      if (disposed || version !== generation) return;
      const next = ingredientLayers(image, buttons);
      if (artwork) { gsap.killTweensOf(artwork.levels); artwork.canvas.remove(); }
      artwork = next; source = current;
      ['juniper','tuberose','sandalwood'].forEach((key, i) => { artwork.levels[key] = active < 0 || i === active ? 1 : inactiveBrightness; });
      artwork.render(); artwork.canvas.style.visibility = active < 0 ? 'hidden' : 'visible'; targets.prepend(artwork.canvas);
      if (active >= 0) image.style.opacity = '0';
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
    const outside = event => { if (!event.target.closest('.fragrances-con6__ingredient')) { hovered = focused = -1; restore(); } };
    const escape = event => { if (event.key === 'Escape') { hovered = focused = -1; restore(); } };
    const resetOnExit = new IntersectionObserver(entries => { if (!entries[0].isIntersecting && active >= 0 && focused < 0) restore(); });
    resetOnExit.observe(scene);
    document.addEventListener('pointerdown', outside); scene.addEventListener('keydown', escape);
    const resize = new ResizeObserver(() => { source = ''; notes.forEach(note => { const color = note.style.color; note.style.removeProperty('color'); note.dataset.originalColor = getComputedStyle(note).color; note.style.color = color; }); place(); });
    // Prepare the expensive pixel partitions before this scene approaches view,
    // rather than blocking the Hero's first frames on initial page load.
    const preparation = new IntersectionObserver(([entry]) => {
      nearViewport = entry.isIntersecting;
      if (nearViewport) place();
    }, { rootMargin: '100% 0px' });
    preparation.observe(scene);
    resize.observe(scene); resize.observe(image); image.addEventListener('load', place); place();
    return () => {
      disposed = true; generation++; cancelAnimationFrame(leaveFrame);
      gsap.killTweensOf(notes); gsap.killTweensOf(typography); if (artwork) gsap.killTweensOf(artwork.levels); handlers.forEach(cleanup => cleanup());
      preparation.disconnect(); resize.disconnect(); resetOnExit.disconnect(); image.removeEventListener('load', place);
      document.removeEventListener('pointerdown', outside); scene.removeEventListener('keydown', escape);
      artwork?.canvas.remove(); image.style.removeProperty('opacity'); targets.removeAttribute('style');
      typography.forEach(text => text.removeAttribute('style'));
      notes.forEach(note => { note.removeAttribute('style'); delete note.dataset.originalColor; });
      buttons.forEach(button => button.setAttribute('aria-pressed', 'false'));
    };
  }, [sceneRef]);
}
