import { useEffect, useRef, useState } from 'react';
import { topButtonThemes } from './topButtonThemes';
import { createBackdropSampler } from './topButtonBackdrop';
import heroCircle from './assets/top-hero-circle.svg';
import './StoryTopButton.css';

export default function StoryTopButton() {
  const buttonRef = useRef(null);
  const [variant, setVariant] = useState('wh');

  useEffect(() => {
    const button = buttonRef.current;
    const page = button.closest('.fragrances-story');
    const mobile = window.matchMedia('(width < 768px)');
    const sampleBackdrop = createBackdropSampler(page, button);
    const regions = topButtonThemes.flatMap(({ selector, theme, darkSurface }) =>
      [...page.querySelectorAll(selector)].map(node => ({ node, theme,
        surface: darkSurface ? node.querySelector(darkSurface) : null })));
    let frame;
    const overlap = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
      * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    const update = () => {
      frame = undefined;
      if (mobile.matches) {
        const luminance = sampleBackdrop();
        // Contrast crossover for the existing Figma ink/ivory variants, with
        // a dead band so textured backgrounds don't flicker while scrolling.
        setVariant(current => luminance > .20 ? 'bk' : luminance < .16 ? 'wh' : current);
        return;
      }
      const area = button.getBoundingClientRect();
      let light = 0, dark = 0;
      for (const { node, theme, surface } of regions) {
        const box = node.getBoundingClientRect();
        const amount = overlap(area, box);
        if (theme === 'dark') dark += amount;
        else {
          const surfaceBox = surface?.getBoundingClientRect();
          const shaded = surfaceBox ? overlap(area, {
            left: Math.max(box.left, surfaceBox.left), right: Math.min(box.right, surfaceBox.right),
            top: Math.max(box.top, surfaceBox.top), bottom: Math.min(box.bottom, surfaceBox.bottom),
          }) : 0;
          light += amount - shaded;
          dark += shaded;
        }
      }
      if (!light && !dark) return;
      // Use the real button footprint, with a small dead band at section seams.
      const lightShare = light / (light + dark);
      setVariant(current => lightShare > .55 ? 'bk' : lightShare < .45 ? 'wh' : current);
    };
    const schedule = () => { if (frame === undefined) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    regions.forEach(({ node }) => resize.observe(node));
    resize.observe(button);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    page.addEventListener('load', schedule, true);
    // Existing GSAP entrances/parallax can move the actual backdrop even
    // between scroll events. Only resample changes under the mobile button.
    const artwork = new MutationObserver(records => {
      if (!mobile.matches) return;
      const area = button.getBoundingClientRect();
      if (records.some(({ target }) => {
        if (target === button || button.contains(target)) return false;
        const box = target.getBoundingClientRect();
        return overlap(area, box) > 0;
      })) schedule();
    });
    artwork.observe(page, { subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      artwork.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      page.removeEventListener('load', schedule, true);
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`fragrances-story__top fragrances-story__top--${variant}`}
      type="button"
      aria-label="Fragrances Story 맨 위로 이동"
      data-variant={variant}
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}
    >
      <span className="fragrances-story__top-desktop" aria-hidden="true">
        <img className="fragrances-story__top-circle" src={heroCircle} alt="" />
        <span className="fragrances-story__top-stem" />
        <span className="fragrances-story__top-chevron" />
      </span>
      <span className="fragrances-story__top-mobile" aria-hidden="true">
        <span className="fragrances-story__top-icon" />
      </span>
      <span className="fragrances-story__top-label" aria-hidden="true">TOP</span>
    </button>
  );
}
