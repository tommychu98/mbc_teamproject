import { useEffect, useRef } from 'react';

const base = '/images/history/objects/';

export default function ObjectsMobileClock({ style }) {
  const ref = useRef(null);
  const played = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || played.current) return;
      played.current = true;
      ref.current.dataset.played = 'true';
      observer.disconnect();
    }, { threshold: .5, rootMargin: '-52px 0px 0px 0px' });
    if (!played.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="objects-mobile-clock" style={style} aria-label="장식 시계">
    <img className="objects-mobile-clock__face" src={`${base}objects-detail-visual-01.png`} alt="" />
    <img className="objects-mobile-clock__hour" src={`${base}objects-detail-visual-03.png`} alt="" />
    <img className="objects-mobile-clock__minute" src={`${base}objects-detail-visual-02.png`} alt="" />
    <img className="objects-mobile-clock__cap" src={`${base}objects-detail-visual-01.png`} alt="" />
  </div>;
}
