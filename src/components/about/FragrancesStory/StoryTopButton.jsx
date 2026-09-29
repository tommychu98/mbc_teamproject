import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { createBackdropSampler } from './topButtonBackdrop';
import topWh from './assets/top-wh.svg';
import topBk from './assets/top-bk.svg';
import mobileTopWh from './assets/mobile-top-wh.svg';
import mobileTopBk from './assets/mobile-top-bk.svg';
import './StoryTopButton.css';

export default function StoryTopButton() {
  const buttonRef = useRef(null);
  const [variant, setVariant] = useState('wh');

  useEffect(() => {
    const button = buttonRef.current;
    const page = button.closest('.fragrances-story');
    const sample = createBackdropSampler(page, button);
    let lastSample = -1;
    let activeUntil = performance.now() + 5000;
    // Continue through Con13's 3.45s entrance and the scrub settling time.
    const wake = () => { activeUntil = performance.now() + 5000; };
    const update = (time) => {
      if (document.hidden || performance.now() > activeUntil || time - lastSample < 0.1) return;
      lastSample = time;
      const luminance = sample();
      // A small dead band prevents flicker over textured wood and section seams.
      setVariant((current) => luminance > 0.24 ? 'bk' : luminance < 0.18 ? 'wh' : current);
    };
    const resize = new ResizeObserver(wake);
    resize.observe(page);
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('resize', wake);
    document.addEventListener('visibilitychange', wake);
    page.addEventListener('load', wake, true);
    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
      resize.disconnect();
      window.removeEventListener('scroll', wake);
      window.removeEventListener('resize', wake);
      document.removeEventListener('visibilitychange', wake);
      page.removeEventListener('load', wake, true);
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
      <picture>
        <source media="(width < 768px)" srcSet={variant === 'wh' ? mobileTopWh : mobileTopBk} />
        <img className="fragrances-story__top-icon" src={variant === 'wh' ? topWh : topBk} alt="" aria-hidden="true" />
      </picture>
      <span className="fragrances-story__top-label" aria-hidden="true">TOP</span>
    </button>
  );
}
