import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// Mirror Con2 typography timing and settle detection without changing its hook.
export default function useCon5Typography(railRef, cards) {
  const copyRef = useRef(null);
  const [active, setActive] = useState(1);

  useEffect(() => {
    const rail = railRef.current;
    const copy = copyRef.current;
    const media = window.matchMedia('(width < 768px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const elements = [...copy.querySelectorAll('[data-copy-part]')];
    let timer;
    let dragging = false;
    let committed = 1;
    let animation;
    const replace = (index) => {
      const card = cards[index - 1];
      elements[0].textContent = card.number;
      elements[1].textContent = card.title;
      [...elements[2].children].forEach((line, i) => { line.textContent = card.lines[i]; });
      setActive(index);
    };
    const settle = () => {
      if (!media.matches || dragging) return;
      const step = rail.children[1].offsetLeft - rail.children[0].offsetLeft;
      if (!step) return;
      const index = Math.max(1, Math.min(cards.length, Math.round(rail.scrollLeft / step) + 1));
      if (Math.abs(rail.scrollLeft - (index - 1) * step) > 1 || index === committed) return;
      committed = index;
      animation?.kill();
      if (reduced.matches) {
        replace(index);
        gsap.set(elements, { clearProps: 'opacity,transform' });
        return;
      }
      animation = gsap.timeline()
        .to(elements, { opacity: 0, y: -6, duration: .2, ease: 'power2.out' })
        .call(() => replace(index))
        .set(elements, { opacity: 0, y: 7 })
        .to(elements, { opacity: 1, y: 0, duration: .32, stagger: .05, ease: 'power2.out' })
        .set(elements, { clearProps: 'opacity,transform' });
    };
    const schedule = () => {
      clearTimeout(timer);
      if (media.matches && !dragging) timer = setTimeout(settle, 100);
    };
    const start = () => { dragging = true; clearTimeout(timer); };
    const finish = () => { dragging = false; schedule(); };
    const configure = () => {
      clearTimeout(timer);
      animation?.kill();
      dragging = false;
      committed = 1;
      replace(1);
      gsap.set(elements, { clearProps: 'opacity,transform' });
      schedule();
    };
    rail.addEventListener('scroll', schedule, { passive: true });
    rail.addEventListener('pointerdown', start);
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
    media.addEventListener('change', configure);
    const resize = new ResizeObserver(schedule);
    resize.observe(rail);
    return () => {
      clearTimeout(timer);
      animation?.kill();
      gsap.set(elements, { clearProps: 'opacity,transform' });
      rail.removeEventListener('scroll', schedule);
      rail.removeEventListener('pointerdown', start);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
      media.removeEventListener('change', configure);
      resize.disconnect();
    };
  }, [railRef, cards]);

  return { copyRef, active };
}
