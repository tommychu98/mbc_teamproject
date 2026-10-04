import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookSequenceContext } from './BookSequenceContext';
import './BookSequence.css';

gsap.registerPlugin(ScrollTrigger);
const query = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';
const subscribe = (callback) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};
const snapshot = () => window.matchMedia(query).matches;

function HorizontalBooks({ children }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [sequence, setSequence] = useState({ animation: null });
  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const travel = () => track.scrollWidth - viewport.clientWidth;
    const panels = [...track.children];
    const hold = 0.6 / panels.length;
    const transition = 0.4 / (panels.length - 1);
    const ease = gsap.parseEase('power2.inOut');
    const offset = panel => Math.min(panel.offsetLeft, travel());
    const context = gsap.context(() => {
      const animation = gsap.timeline({
        scrollTrigger: {
          id: 'fragrances-book-sequence', trigger: viewport,
          start: 'top top', end: () => `+=${travel() * 1.6}`,
          pin: true, scrub: 1, invalidateOnRefresh: true,
        },
      });
      panels.forEach((panel, index) => {
        if (index) animation.fromTo(track,
          { x: () => -offset(panels[index - 1]) },
          { x: () => -offset(panel), duration: transition,
            ease: 'power2.inOut', immediateRender: false });
        // Empty tweens reserve scroll progress, rather than a real-time pause.
        animation.to({}, { duration: hold });
      });
      const scrollPosition = (trigger, rightEdge, viewportFraction) => {
        const panel = trigger.closest('section');
        const distance = offset(panel) + (rightEdge ? panel.offsetWidth : 0)
          - viewport.clientWidth * viewportFraction;
        let progress = distance <= 0 ? 0 : 1;
        for (let index = 1; index < panels.length; index += 1) {
          const from = offset(panels[index - 1]);
          const to = offset(panels[index]);
          if (distance > from && distance <= to) {
            const ratio = (distance - from) / (to - from);
            let low = 0, high = 1;
            // Invert the transition easing so scene triggers follow actual X.
            for (let step = 0; step < 24; step += 1) {
              const middle = (low + high) / 2;
              if (ease(middle) < ratio) low = middle;
              else high = middle;
            }
            progress = index * hold + (index - 1) * transition
              + (low + high) / 2 * transition;
            break;
          }
        }
        const parent = animation.scrollTrigger;
        return parent.start + progress * (parent.end - parent.start);
      };
      const holdPosition = (trigger) => {
        const index = panels.indexOf(trigger.closest('section'));
        const progress = index * (hold + transition);
        const parent = animation.scrollTrigger;
        return parent.start + progress * (parent.end - parent.start);
      };
      const holdEndPosition = trigger => holdPosition(trigger)
        + hold * (animation.scrollTrigger.end - animation.scrollTrigger.start);
      setSequence({ animation, scrollPosition, holdPosition, holdEndPosition });
    }, viewport);
    const refresh = () => ScrollTrigger.refresh();
    const images = [...track.querySelectorAll('img')];
    images.forEach(image => image.addEventListener('load', refresh));
    return () => {
      images.forEach(image => image.removeEventListener('load', refresh));
      context.revert();
    };
  }, []);
  return (
    <BookSequenceContext.Provider value={sequence}>
      <div ref={viewportRef} className="fragrances-book-sequence" aria-label="Scent Stories book archive">
        <div ref={trackRef} className="fragrances-book-sequence__track">{children}</div>
      </div>
    </BookSequenceContext.Provider>
  );
}

export default function BookSequence({ children }) {
  const horizontal = useSyncExternalStore(subscribe, snapshot, () => false);
  // Mobile and reduced motion retain the original direct section hierarchy.
  return horizontal ? <HorizontalBooks>{children}</HorizontalBooks> : children;
}
