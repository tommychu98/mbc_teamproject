import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Match Con5's viewport-based scroll distance and pin lifecycle.
const pinDuration = 2.75;

export default function useCon8Pin(sectionRef) {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const media = gsap.matchMedia();
    media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 768px)' }, ({ conditions }) => {
      if (!conditions.motion || !conditions.desktop) return;
      // Preserve the existing scene height; pinSpacing reserves the hold distance.
      let disposed = false;
      let trigger;
      let resizeFrame;
      let refreshFrame;
      let builtWidth;
      let builtHeight;
      const setup = async () => {
        const images = [...section.querySelectorAll('.fragrances-con8__card-artwork img')];
        // Retain Con8's existing refresh after preceding image-dependent pins.
        for (let sibling = section.previousElementSibling; sibling; sibling = sibling.previousElementSibling) {
          images.push(...sibling.querySelectorAll('img'));
        }
        try { await Promise.all(images.map(image => image.decode())); } catch { return; }
        if (disposed) return;
        builtWidth = window.innerWidth;
        builtHeight = window.innerHeight;
        trigger?.kill();
        trigger = ScrollTrigger.create({
          id: 'fragrances-con8-pin',
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * pinDuration)}`,
          pin: true,
          pinSpacing: true,
        });
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => {
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        });
      };
      setup();
      const onResize = () => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
          // A pinned element can retain its old pixel width until it is rebuilt.
          if (trigger && (Math.abs(window.innerWidth - builtWidth) > 1 || window.innerHeight !== builtHeight)) setup();
          else trigger?.refresh();
        });
      };
      const resize = new ResizeObserver(onResize);
      window.addEventListener('resize', onResize);
      resize.observe(section);
      for (let sibling = section.previousElementSibling; sibling; sibling = sibling.previousElementSibling) resize.observe(sibling);
      return () => {
        disposed = true;
        resize.disconnect();
        window.removeEventListener('resize', onResize);
        cancelAnimationFrame(resizeFrame);
        cancelAnimationFrame(refreshFrame);
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
        spacer.style.setProperty('--con8-spacer-correction', `${-remainder}px`);
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
      spacer?.style.removeProperty('--con8-spacer-correction');
    };
  }, [sectionRef]);
}
