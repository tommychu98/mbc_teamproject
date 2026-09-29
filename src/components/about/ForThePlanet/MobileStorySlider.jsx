import { Children, useEffect, useRef } from 'react';

export default function MobileStorySlider({ children, className = '', label }) {
  const rootRef = useRef(null);
  const dragRef = useRef(null);
  const slides = Children.toArray(children);

  useEffect(() => {
    const root = rootRef.current;
    const stage = root.querySelector('.ftp-mobile-story__stage');
    const track = root.querySelector('.ftp-mobile-story__track');
    const panels = [...root.querySelectorAll('.ftp-mobile-ambition__panel')];
    const mobile = window.matchMedia('(max-width: 899px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!mobile.matches || reducedMotion.matches) {
        stage.style.setProperty('--story-scale', stage.clientWidth / 430);
        root.style.removeProperty('height');
        track.style.removeProperty('transform');
        panels.forEach(panel => panel.parentElement.classList.add('ftp-slide-visible'));
        return;
      }
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (!width || !height) return;
      stage.style.setProperty('--story-scale', Math.min(width / 430, height / 935));
      // After the last panel, release the pinned stage into the next section.
      const travel = (panels.length - 1) * height;
      root.style.height = `${height + travel + height * 0.25}px`;
      const offset = Math.max(0, -root.getBoundingClientRect().top);
      const position = Math.min(panels.length - 1, offset / height);
      track.style.transform = `translate3d(${-position * width}px, 0, 0)`;
      panels.forEach((panel, index) => {
        panel.parentElement.classList.toggle('ftp-slide-visible', Math.abs(index - position) < 0.85);
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(stage);
    panels.forEach(panel => observer.observe(panel));
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    mobile.addEventListener('change', schedule);
    reducedMotion.addEventListener('change', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      mobile.removeEventListener('change', schedule);
      reducedMotion.removeEventListener('change', schedule);
    };
  }, []);

  const finishDrag = () => { dragRef.current = null; };
  return <div ref={rootRef} className={`ftp-mobile-ambition ${className}`}>
    <div className="ftp-mobile-story__stage" role="region" aria-label={label} tabIndex={0}
      onPointerDown={event => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        dragRef.current = { x: event.clientX, y: event.clientY, scroll: window.scrollY };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={event => {
        const drag = dragRef.current;
        if (!drag) return;
        const dx = drag.x - event.clientX;
        const dy = drag.y - event.clientY;
        window.scrollTo({ top: drag.scroll + (Math.abs(dx) > Math.abs(dy) ? dx : dy), behavior: 'instant' });
      }}
      onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag}
      onDragStart={event => event.preventDefault()}
      onKeyDown={event => {
        if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return;
        event.preventDefault();
        window.scrollBy({ top: event.currentTarget.clientHeight * (event.key === 'ArrowRight' ? 1 : -1), behavior: 'instant' });
      }}>
      <div className="ftp-mobile-story__track">
        {slides.map((child, index) => <div className="ftp-mobile-story__slide ftp-slide-visible" key={child.key ?? index} role="group" aria-label={`${index + 1} / ${slides.length}`}>{child}</div>)}
      </div>
    </div>
  </div>;
}
