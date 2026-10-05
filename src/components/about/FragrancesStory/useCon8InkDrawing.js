import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Several feathered ink islands grow inside each illustration, rather than a wipe.
function inkMask(progress, points) {
  if (progress <= 0) return 'linear-gradient(transparent, transparent)';
  if (progress >= 0.999) return 'none';
  const radius = progress * 145;
  return points.map(([x, y], i) => {
    const spread = Math.max(0, radius - i * 7);
    return `radial-gradient(ellipse at ${x}% ${y}%, #000 ${Math.max(0, spread - 20)}%, transparent ${spread + 1}%)`;
  }).join(',');
}

// Sample the existing rendered crop. No new artwork or vector paths are created.
function makeLines(frame, image, namespace) {
  const bounds = frame.getBoundingClientRect();
  const imageBounds = image.getBoundingClientRect();
  const canvas = document.createElement('canvas');
  canvas.className = `${namespace}__ink-lines`;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = Math.round(bounds.width * Math.min(window.devicePixelRatio || 1, 2));
  canvas.height = Math.round(bounds.height * Math.min(window.devicePixelRatio || 1, 2));
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const ratio = canvas.width / bounds.width;
  ctx.drawImage(image, (imageBounds.left - bounds.left) * ratio, 0,
    imageBounds.width * ratio, imageBounds.height * ratio);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const output = ctx.createImageData(canvas.width, canvas.height);
  const luminance = new Float32Array(canvas.width * canvas.height);
  for (let i = 0; i < luminance.length; i++) {
    const p = i * 4;
    const alpha = pixels.data[p + 3] / 255;
    luminance[i] = (pixels.data[p] * 0.2126 + pixels.data[p + 1] * 0.7152 + pixels.data[p + 2] * 0.0722) * alpha + 255 * (1 - alpha);
  }
  const w = canvas.width;
  for (let y = 1; y < canvas.height - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const gx = -luminance[i-w-1] + luminance[i-w+1] - 2*luminance[i-1] + 2*luminance[i+1] - luminance[i+w-1] + luminance[i+w+1];
      const gy = -luminance[i-w-1] - 2*luminance[i-w] - luminance[i-w+1] + luminance[i+w-1] + 2*luminance[i+w] + luminance[i+w+1];
      const p = i * 4;
      output.data[p] = 78; output.data[p+1] = 65; output.data[p+2] = 52;
      output.data[p+3] = Math.min(170, Math.max(0, Math.hypot(gx, gy) - 18) * 0.95);
    }
  }
  ctx.putImageData(output, 0, 0);
  return canvas;
}

const namespace = "fragrances-con8";
const focalPoints = [[[48, 45], [66, 58], [37, 72], [43, 24]], [[47, 72], [43, 49], [51, 28], [70, 63]], [[42, 46], [45, 65], [70, 73], [67, 28]]];

export default function useCon8InkDrawing(sectionRef) {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const media = gsap.matchMedia();
    media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 768px)' }, ({ conditions }) => {
      if (!conditions.motion) return;
      const desktop = conditions.desktop;
      let disposed = false;
      let sequence;
      let trigger;
      let states = [];
      let resizeFrame;
      let builtWidth;
      const frames = [...section.querySelectorAll(`.${namespace}__card-artwork`)];
      const cleanLayers = () => {
        states.forEach(({ original, trace, lines }) => {
          original.style.removeProperty('mask-image');
          original.style.removeProperty('opacity');
          original.style.removeProperty('filter');
          trace.remove(); lines.remove();
        });
        states = [];
      };
      const setup = async () => {
        const images = frames.map(frame => frame.querySelector('img'));
        try { await Promise.all(images.map(image => image.decode())); } catch { return; }
        if (disposed) return;
        builtWidth = section.clientWidth;
        const oldProgress = sequence?.progress();
        const wasReversed = sequence?.reversed();
        trigger?.kill(); sequence?.kill(); cleanLayers();
        states = frames.map((frame, index) => {
          const original = frame.querySelector(`.${namespace}__ink-original`);
          const trace = original.cloneNode(true);
          trace.className = `${namespace}__ink-trace`;
          trace.setAttribute('aria-hidden', 'true');
          const lines = makeLines(frame, images[index], namespace);
          frame.append(trace, lines);
          return { original, trace, lines, edge: 0, tone: 0, density: 0, color: 0, finish: 0 };
        });
        const render = () => states.forEach((state, index) => {
          const done = state.density === 1 && state.color === 1 && state.finish === 1;
          state.original.style.maskImage = inkMask(state.tone, focalPoints[index]);
          // The mask discovers detail; density develops separately so a newly
          // exposed region never arrives at almost full color in one pass.
          state.original.style.opacity = String(state.density);
          state.original.style.filter = done ? 'none' : `saturate(${0.65 + state.color * 0.35})`;
          state.lines.style.maskImage = inkMask(state.edge, focalPoints[index]);
          state.lines.style.opacity = String((1 - state.finish) * 0.7);
          state.trace.style.opacity = String((1 - state.finish) * 0.1);
        });
        sequence = gsap.timeline({ paused: true, onUpdate: render });
        states.forEach((state, index) => {
          const start = index * 0.25;
          sequence.to(state, { edge: 1, duration: 0.7, ease: 'power1.out' }, start)
            .to(state, { tone: 1, duration: 1.1, ease: 'sine.inOut' }, start + 0.35)
            .to(state, { density: 1, duration: 1.8, ease: 'sine.inOut' }, start + 0.45)
            .to(state, { color: 1, duration: 1.5, ease: 'sine.inOut' }, start + 0.75)
            .to(state, { finish: 1, duration: 1.5, ease: 'sine.inOut' }, start + 0.75);
        });
        sequence.progress(oldProgress ?? 0).reversed(wasReversed ?? false).pause();
        render();
        trigger = ScrollTrigger.create({
          id: `${namespace}-ink-drawing`, trigger: section,
          ...(desktop ? {
            start: 'top top',
            end: () => `+=${Math.round(window.innerHeight * sequence.duration())}`,
            animation: sequence,
            pin: section.querySelector('.fragrances-con8__pin-stage'),
            pinSpacing: true,
            scrub: true,
            refreshPriority: 0,
            onUpdate: render,
            onRefresh: render,
          } : {
            start: 'top 55%', end: 'bottom top', animation: sequence,
            toggleActions: 'play none none reverse',
            onRefresh: self => {
              if (self.scroll() >= self.start) sequence.play();
              else sequence.reverse();
            },
          }),
        });
        if (desktop) {
          // Measure downstream pins after this spacer, in document scroll order.
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
          sequence.progress(trigger.progress);
          render();
        }
      };
      setup();
      const resize = new ResizeObserver(() => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
          if (states.length && (desktop ? Math.abs(section.clientWidth - builtWidth) > 1 : states.some(state => Math.abs(state.lines.clientWidth - state.lines.width / Math.min(window.devicePixelRatio || 1, 2)) > 1))) setup();
          else trigger?.refresh();
        });
      });
      resize.observe(section);
      for (let sibling = section.previousElementSibling; sibling; sibling = sibling.previousElementSibling) resize.observe(sibling);
      return () => {
        disposed = true; resize.disconnect(); cancelAnimationFrame(resizeFrame);
        trigger?.kill(); sequence?.kill(); cleanLayers();
      };
    });
    return () => media.revert();
  }, [sectionRef]);
}
