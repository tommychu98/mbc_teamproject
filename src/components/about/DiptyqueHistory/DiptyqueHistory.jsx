import { useEffect, useRef } from 'react';
import './DiptyqueHistory.css';
import HistoryFabric from './HistoryFabric';
import HistoryFabricMobile from './HistoryFabricMobile';
import HistoryObjects from './HistoryObjects';
import HistoryObjectsMobile from './HistoryObjectsMobile';
import HistoryCollectTransform from './HistoryCollectTransform';
import HistoryCollectMobile from './HistoryCollectMobile';
import HistoryScent from './HistoryScent';
import HistoryScentMobile from './HistoryScentMobile';
import HistoryMaison from './HistoryMaison';

const OPENING_TEXT = 'BEFORE SCENT, THERE WAS CREATION.';
const OPENING_WORDS = [...OPENING_TEXT.matchAll(/\S+/g)];

export default function DiptyqueHistory() {
  const titleRef = useRef(null);
  useEffect(() => {
    const title = titleRef.current;
    let cancelled = false;
    let fontsReady = false;
    let inView = false;
    let played = false;
    let writingTimer;
    const animations = [];
    const letters = [...title.querySelectorAll('.diptyque-history__title-letter')];
    const startWhenVisible = () => {
      if (cancelled || played || !fontsReady || !inView || document.hidden) return;
      const intro = document.querySelector('.intro-video');
      if (intro && getComputedStyle(intro).display !== 'none') return;
      played = true;
      title.dataset.writing = 'waiting';
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      letters.forEach((letter) => {
        animations.push(letter.animate(
          reduced
            ? [{ opacity: 0 }, { opacity: 1 }]
            : [{ opacity: 0, clipPath: 'inset(0 100% 0 0)' },
              { opacity: 1, clipPath: 'inset(0 0 0 0)' }],
          {
            delay: 900 + Number(letter.dataset.letterIndex) * 60,
            duration: 280,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'both',
          },
        ));
      });
      writingTimer = window.setTimeout(() => {
        title.dataset.writing = 'writing';
      }, 900);
      Promise.all(animations.map((animation) => animation.finished)).then(() => {
        if (cancelled) return;
        letters.forEach((letter) => {
          letter.style.opacity = '1';
          letter.style.clipPath = 'none';
        });
        animations.forEach((animation) => animation.cancel());
        title.dataset.writing = 'complete';
      }).catch(() => { /* Unmount/StrictMode cancels the pending sequence. */ });
      mutations.disconnect();
      intersection.disconnect();
    };
    const mutations = new MutationObserver(startWhenVisible);
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      startWhenVisible();
    }, { threshold: .6 });
    mutations.observe(document.body, { childList: true, subtree: true });
    intersection.observe(title);
    document.addEventListener('visibilitychange', startWhenVisible);
    document.fonts.ready.then(() => {
      fontsReady = true;
      startWhenVisible();
    });
    return () => {
      cancelled = true;
      window.clearTimeout(writingTimer);
      animations.forEach((animation) => animation.cancel());
      letters.forEach((letter) => {
        letter.style.removeProperty('opacity');
        letter.style.removeProperty('clip-path');
      });
      mutations.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', startWhenVisible);
      delete title.dataset.writing;
    };
  }, []);
  return (
    <main className="diptyque-history" aria-labelledby="history-opening-title">
      <section className="diptyque-history__opening">
        <h1 ref={titleRef} id="history-opening-title" className="diptyque-history__title" aria-label={OPENING_TEXT}>
          {OPENING_WORDS.map((match, wordIndex) => (
            <span key={match.index} aria-hidden="true">
              {wordIndex === 2 ? <><br className="diptyque-history__mobile-break" /><span className="diptyque-history__desktop-space"> </span></> : wordIndex > 0 ? ' ' : null}
              <span className="diptyque-history__title-word">
                {[...match[0]].map((letter, index) => (
                  <span
                    key={index}
                    className={`diptyque-history__title-letter${letter === ',' ? ' diptyque-history__desktop-comma' : ''}`}
                    data-letter-index={match.index + index}
                  >{letter}</span>
                ))}
              </span>
            </span>
          ))}
        </h1>
      </section>
      <HistoryFabricMobile />
      <HistoryFabric />
      <div className="diptyque-history__fabric-transition" aria-hidden="true">
        <img
          src="/images/history/fabric/history-fabric-transition.png"
          alt=""
          loading="eager"
          decoding="async"
        />
      </div>
      <HistoryObjectsMobile />
      <HistoryObjects />
      <HistoryCollectMobile />
      <HistoryScentMobile />
      <div className="diptyque-history__scent-transition">
        <HistoryCollectTransform />
        <HistoryScent />
      </div>
      <HistoryMaison />
    </main>
  );
}
