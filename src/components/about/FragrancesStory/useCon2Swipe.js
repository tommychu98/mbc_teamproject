import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Con2 alone opts into controlled touch settling; artwork transforms stay owned by reveal.
export default function useCon2Swipe(railRef) {
  const nextRef = useRef(null);

  useEffect(() => {
    const rail = railRef.current;
    const media = window.matchMedia('(width < 768px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let gesture = null;
    let settling;
    const step = () => rail.children[1].offsetLeft - rail.children[0].offsetLeft;
    const limit = () => rail.scrollWidth - rail.clientWidth;
    const index = () => Math.round(rail.scrollLeft / step());
    const settle = (target) => {
      settling?.kill();
      settling = gsap.to(rail, {
        scrollLeft: Math.max(0, Math.min(limit(), target * step())),
        duration: reduced.matches ? 0 : 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };
    const down = (event) => {
      if (!media.matches || event.pointerType === 'mouse' || !event.isPrimary) return;
      settling?.kill();
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY,
        start: rail.scrollLeft, index: index(), lastX: event.clientX,
        time: event.timeStamp, velocity: 0, axis: null };
    };
    const move = (event) => {
      if (!gesture || event.pointerId !== gesture.id) return;
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      if (!gesture.axis && Math.max(Math.abs(dx), Math.abs(dy)) >= 8) {
        gesture.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (gesture.axis === 'x') rail.setPointerCapture(event.pointerId);
      }
      if (gesture.axis !== 'x') return;
      const elapsed = event.timeStamp - gesture.time;
      if (elapsed > 0) gesture.velocity = (event.clientX - gesture.lastX) / elapsed;
      gesture.lastX = event.clientX;
      gesture.time = event.timeStamp;
      // Scroll bounds clamp at the first/last card without rubber-band or looping.
      rail.scrollLeft = Math.max(0, Math.min(limit(), gesture.start - dx));
    };
    const finish = (event) => {
      if (!gesture || event.pointerId !== gesture.id) return;
      const current = gesture;
      gesture = null;
      if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
      if (current.axis !== 'x') return;
      const dx = event.clientX - current.x;
      const fast = event.timeStamp - current.time < 100 && Math.abs(current.velocity) >= 0.5 && Math.abs(dx) >= 24;
      const advance = event.type !== 'pointercancel' && (Math.abs(dx) >= step() * 0.2 || fast);
      settle(Math.max(0, Math.min(rail.children.length - 1, current.index + (advance ? (dx < 0 ? 1 : -1) : 0))));
    };
    const configure = () => {
      gesture = null;
      settling?.kill();
    };
    nextRef.current = () => {
      if (media.matches) settle((index() + 1) % rail.children.length);
    };
    rail.addEventListener('pointerdown', down);
    rail.addEventListener('pointermove', move);
    rail.addEventListener('pointerup', finish);
    rail.addEventListener('pointercancel', finish);
    media.addEventListener('change', configure);
    return () => {
      configure();
      nextRef.current = null;
      rail.removeEventListener('pointerdown', down);
      rail.removeEventListener('pointermove', move);
      rail.removeEventListener('pointerup', finish);
      rail.removeEventListener('pointercancel', finish);
      media.removeEventListener('change', configure);
    };
  }, [railRef]);

  return () => nextRef.current?.();
}
