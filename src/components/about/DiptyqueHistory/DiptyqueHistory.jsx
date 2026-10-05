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
    const opening = title.closest('.diptyque-history__opening');
    let cancelled = false;
    let fontsReady = false;
    let inView = false;
    let played = false;
    let writingTimer;
    let scrollLocked = true;
    let touchY = null;
    const animations = [];
    const letters = [...title.querySelectorAll('.diptyque-history__title-letter')];
    const unlockScroll = () => {
      scrollLocked = false;
      touchY = null;
    };
    const isInteractive = (target) => target instanceof Element
      && Boolean(target.closest('input, textarea, select, button, a, [contenteditable="true"]'));
    const onWheel = (event) => {
      if (scrollLocked && event.deltaY > 0 && event.cancelable) event.preventDefault();
    };
    const onTouchStart = (event) => {
      touchY = event.touches.length === 1 ? event.touches[0].clientY : null;
    };
    const onTouchMove = (event) => {
      if (!scrollLocked || touchY === null || event.touches.length !== 1) return;
      if (event.touches[0].clientY < touchY && event.cancelable) event.preventDefault();
    };
    const onKeyDown = (event) => {
      if (!scrollLocked || isInteractive(event.target)) return;
      const movesDown = ['ArrowDown', 'PageDown', 'End'].includes(event.key)
        || (event.key === ' ' && !event.shiftKey);
      if (movesDown) event.preventDefault();
    };
    const holdOpening = () => {
      if (!scrollLocked) return;
      const limit = opening.offsetTop;
      if (window.scrollY > limit) window.scrollTo({ top: limit, behavior: 'instant' });
    };
    const startWhenVisible = () => {
      if (cancelled || played || !fontsReady || !inView || document.hidden) return;
      const intro = document.querySelector('.intro-video');
      if (intro && getComputedStyle(intro).display !== 'none') return;
      played = true;
      title.dataset.writing = 'waiting';

      letters.forEach((letter) => {
        animations.push(letter.animate(
          ([{ opacity: 0, clipPath: 'inset(0 100% 0 0)' },
              { opacity: 1, clipPath: 'inset(0 0 0 0)' }]),
          {
            delay: 140 + Number(letter.dataset.letterIndex) * 23,
            duration: 210,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'both',
          },
        ));
      });
      writingTimer = window.setTimeout(() => {
        title.dataset.writing = 'writing';
      }, 140);
      Promise.all(animations.map((animation) => animation.finished)).then(() => {
        if (cancelled) return;
        letters.forEach((letter) => {
          letter.style.opacity = '1';
          letter.style.clipPath = 'none';
        });
        animations.forEach((animation) => animation.cancel());
        title.dataset.writing = 'complete';
        unlockScroll();
      }).catch(() => {
        if (!cancelled) unlockScroll();
      });
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
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('scroll', holdOpening, { passive: true });
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
      window.removeEventListener('wheel', onWheel, true);
      window.removeEventListener('touchstart', onTouchStart, true);
      window.removeEventListener('touchmove', onTouchMove, true);
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('scroll', holdOpening);
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
