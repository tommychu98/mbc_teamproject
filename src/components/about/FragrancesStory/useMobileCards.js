import { useEffect, useRef, useState } from 'react';

// Native touch scrolling, snap points and keyboard access share one card rail.
export default function useMobileCards() {
  const railRef = useRef(null);
  const [active, setActive] = useState(1);

  useEffect(() => {
    const rail = railRef.current;
    const media = window.matchMedia('(width < 768px)');
    const update = () => {
      if (!media.matches || !rail.children.length) return;
      const step = rail.children[1].offsetLeft - rail.children[0].offsetLeft;
      setActive(Math.max(1, Math.min(rail.children.length, Math.round(rail.scrollLeft / step) + 1)));
    };
    const configure = () => {
      if (media.matches) {
        rail.tabIndex = 0;
        rail.setAttribute('role', 'region');
        rail.setAttribute('aria-label', '향 이야기 카드. 좌우로 밀거나 방향키로 이동');
      } else {
        rail.removeAttribute('tabindex');
        rail.removeAttribute('role');
        rail.removeAttribute('aria-label');
        rail.scrollLeft = 0;
      }
      update();
    };
    const keyboard = (event) => {
      if (!media.matches || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const step = rail.children[1].offsetLeft - rail.children[0].offsetLeft;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? step * 2
        : rail.scrollLeft + (event.key === 'ArrowRight' ? step : -step);
      rail.scrollTo({ left: next, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    };
    configure();
    rail.addEventListener('scroll', update, { passive: true });
    rail.addEventListener('keydown', keyboard);
    media.addEventListener('change', configure);
    const resize = new ResizeObserver(update);
    resize.observe(rail);
    return () => {
      rail.removeEventListener('scroll', update);
      rail.removeEventListener('keydown', keyboard);
      media.removeEventListener('change', configure);
      resize.disconnect();
    };
  }, []);

  return { railRef, active };
}
