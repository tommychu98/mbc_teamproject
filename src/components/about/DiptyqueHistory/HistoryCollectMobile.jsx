import { useEffect, useRef } from 'react';
import './HistoryCollectMobile.css';

export default function HistoryCollectMobile() {
  const ref = useRef(null);
  useEffect(() => {
    let frame;
    const update = () => {
      frame = undefined;
      const root = ref.current;
      const panel = root.querySelector('.history-collect-mobile__viewport');
      if (!panel.offsetHeight) return;
      const progress = Math.max(0, Math.min(1, -root.getBoundingClientRect().top / panel.offsetHeight));
      root.style.setProperty('--transform-progress', progress);
      root.style.setProperty('--collect-copy-opacity', Math.max(0, 1 - progress / .45));
      root.style.setProperty('--transform-copy-opacity', Math.max(0, (progress - .45) / .55));
      root.querySelector('.history-collect-mobile__copy--collect').setAttribute('aria-hidden', progress >= .5);
      root.querySelector('.history-collect-mobile__copy--transform').setAttribute('aria-hidden', progress < .5);
    };
    const schedule = () => { if (frame === undefined) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  return <section ref={ref} className="history-collect-mobile" aria-label="Collect and transform">
    <div className="history-collect-mobile__viewport">
    <div className="history-collect-mobile__scene" aria-hidden="true">
      <img src="/images/history/collect-transform/collect-visual.png" alt="" />
    </div>
    <div className="history-collect-mobile__scene history-collect-mobile__scene--transform" aria-hidden="true">
      <img src="/images/history/collect-transform/transform-visual.png" alt="" />
    </div>
    <div className="history-collect-mobile__copy history-collect-mobile__copy--collect">
      <h2 id="history-collect-mobile-title">TO COLLECT</h2>
      <p>창작은 세심하게 바라보는<br />것에서 시작됩니다.</p>
      <p>중요한 것은 무엇을 보느냐보다<br />그것을 어떤 시선으로<br />기억하는가 였습니다.</p>
    </div>
    <div className="history-collect-mobile__copy history-collect-mobile__copy--transform" aria-hidden="true">
      <h2>TO TRANSFORM</h2>
      <p>하나의 풍경은 향이 되고,<br />하나의 기억은 이미지와<br />오브제로 다시 나타납니다.</p>
      <p>형태는 바뀌어도<br />그 날의 기억과 이야기는 지속됩니다.</p>
    </div>
    </div>
  </section>;
}
