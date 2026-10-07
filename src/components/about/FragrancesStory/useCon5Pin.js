import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Match Con2's viewport-based scroll distance as well as its pin lifecycle.
const pinDuration = 2.75;

export default function useCon5Pin(sectionRef) {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const media = gsap.matchMedia();
    media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 768px)' }, ({ conditions }) => {
      if (!conditions.motion || !conditions.desktop) return;
      gsap.set(section, { minHeight: '100vh' });
      let disposed = false;
      let trigger;
      let resizeFrame;
      let builtWidth;
      const setup = async () => {
        const images = [...section.querySelectorAll('.fragrances-con5__card-artwork img')];
        try { await Promise.all(images.map(image => image.decode())); } catch { return; }
        if (disposed) return;
        builtWidth = section.clientWidth;
        trigger?.kill();
        trigger = ScrollTrigger.create({
          id: 'fragrances-con5-pin',
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * pinDuration)}`,
          pin: true,
          pinSpacing: true,
        });
      };
      setup();
      const resize = new ResizeObserver(() => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
          if (trigger && Math.abs(section.clientWidth - builtWidth) > 1) setup();
          else trigger?.refresh();
        });
      });
      resize.observe(section);
      for (let sibling = section.previousElementSibling; sibling; sibling = sibling.previousElementSibling) resize.observe(sibling);
      return () => {
        disposed = true;
        resize.disconnect();
        cancelAnimationFrame(resizeFrame);
        trigger?.kill();
      };
    });
    return () => media.revert();
  }, [sectionRef]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const parent = section.parentElement;
    let spacer;
    let frame;
    const correctSpacer = () => {
      const candidate = section.parentElement;
      if (!candidate.classList.contains('pin-spacer')) return;
      spacer = candidate;
      // The fixed pin has a rounded height too. Measure only its natural height
      // before pinning or after release.
      if (getComputedStyle(section).position === 'fixed') return;
      const reservedHeight = parseFloat(spacer.style.height) - parseFloat(spacer.style.paddingBottom || '0');
      const remainder = reservedHeight - section.getBoundingClientRect().height;
      if (Number.isFinite(remainder) && Math.abs(remainder) < 1) {
        spacer.style.setProperty('--con5-spacer-correction', `${-remainder}px`);
      }
    };
    const scheduleCorrection = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(correctSpacer);
    };
    // Keep layout writes out of ResizeObserver delivery and pin refreshes.
    const resize = new ResizeObserver(scheduleCorrection);
    resize.observe(section);
    const insertion = new MutationObserver(scheduleCorrection);
    insertion.observe(parent, { childList: true });
    ScrollTrigger.addEventListener('refresh', scheduleCorrection);
    correctSpacer();
    return () => {
      resize.disconnect();
      insertion.disconnect();
      cancelAnimationFrame(frame);
      ScrollTrigger.removeEventListener('refresh', scheduleCorrection);
      spacer?.style.removeProperty('--con5-spacer-correction');
    };
  }, [sectionRef]);
}
