import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useMaisonSun(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    const outro = root.querySelector('.history-maison__outro');
    const sun = root.querySelector('.history-maison__story-03-feature');
    const hook = root.querySelector('.history-maison__story-03-accent-01');
    const ring = root.querySelector('.history-maison__story-03-accent-02');
    const rod = root.querySelector('.history-maison__story-02-visual-06-inner');
    const svg = root.querySelector('.history-maison__fishing-line');
    const path = svg.querySelector('path');
    const state = { progress: 0 };
    let geometry;

    const measure = () => {
      const rootBox = root.getBoundingClientRect();
      const rodBox = rod.getBoundingClientRect();
      // The existing inner transform mirrors the original PNG horizontally.
      const rodX = rodBox.left - rootBox.left + rodBox.width * .047;
      const rodY = rodBox.top - rootBox.top + rodBox.height * .027;
      const finalCenter = sun.offsetTop + sun.offsetHeight / 2;
      const rise = Math.max(0, finalCenter - window.innerHeight * .22);
      const start = rootBox.top + window.scrollY + outro.offsetTop - window.innerHeight * .06;
      const end = rootBox.top + window.scrollY + outro.offsetTop + finalCenter - window.innerHeight * .55;
      geometry = {
        rodX, rodY, rise, start, end: Math.max(start + 1, end),
        // Hook eye in the original transparent image, not the image box edge.
        eyeX: hook.offsetLeft + hook.offsetWidth * .59,
        eyeY: outro.offsetTop + hook.offsetTop + hook.offsetHeight * .14,
      };
      svg.setAttribute('viewBox', `0 0 ${root.clientWidth} ${root.clientHeight}`);
    };

    const render = () => {
      const { rodX, rodY, eyeX, eyeY, rise, start, end } = geometry;
      const progress = state.progress;
      const eased = (1 - Math.cos(Math.PI * progress)) / 2;
      const scrollTravel = end - start;
      // Compensate for the moving viewport before easing the visible descent.
      // Easing the document offset alone makes the sun briefly travel upward.
      // Past viewport center, the same continuous offset pays out the taut line;
      // there is no separate draw-on animation or discontinuous length change.
      const shift = -rise + scrollTravel * progress + (rise - scrollTravel) * eased;
      // One shared position keeps the sun, ring, hook and line end inseparable.
      gsap.set([sun, hook, ring], { y: shift });
      const endY = eyeY + shift;
      path.setAttribute('d', `M ${rodX} ${rodY} L ${eyeX} ${endY}`);
    };

    measure();
    const tween = gsap.to(state, {
      progress: 1,
      // Progress stays linear; render applies sine-in-out in viewport space.
      ease: 'none',
      onUpdate: render,
      scrollTrigger: {
        trigger: outro,
        start: () => geometry.start,
        end: () => geometry.end,
        scrub: .45,
        invalidateOnRefresh: true,
        onRefreshInit: measure,
        onRefresh: render,
      },
    });
    render();
    const finale = root.querySelector('.history-maison__finale');
    // Build all children before attaching a trigger. A trigger created on an
    // empty timeline can seek to the end before fromTo adds its hidden state
    // (notably when hot-reloading while already at the bottom of the page).
    const finaleTimeline = gsap.timeline({ paused: true });
    const entrances = [
      { name: 'rock', x: 8, y: 150, at: 0, duration: .85, sway: 0 },
      { name: 'left', x: -110, y: 12, at: .08, duration: 1.15, sway: -.65 },
      { name: 'right', x: 110, y: 5, at: .22, duration: 1.35, sway: .8 },
      { name: 'agave', x: -300, y: 0, at: .38, duration: 1.05, sway: -1.8 },
    ];
    entrances.forEach(({ name, x, y, at, duration, sway }) => {
      const layer = finale.querySelector(`.history-maison__finale-layer--${name}`);
      finaleTimeline.fromTo(layer,
        { xPercent: x, yPercent: y, autoAlpha: 0 },
        { xPercent: 0, yPercent: 0, autoAlpha: 1, duration, ease: 'power3.out' },
        at,
      );
      if (sway && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // A small, damped two-way settle around the rooted base.
        // Timeline values are scroll-derived, so reverse never restarts a loop.
        const img = layer.querySelector('img');
        const settle = at + duration * .55;
        finaleTimeline.fromTo(img, { skewX: 0 },
          { skewX: sway, duration: .22, ease: 'sine.inOut' }, settle)
          .to(img, { skewX: -sway * .45, duration: .24, ease: 'sine.inOut' }, settle + .22)
          .to(img, { skewX: sway * .16, duration: .24, ease: 'sine.inOut' }, settle + .46)
          .to(img, { skewX: 0, duration: .28, ease: 'sine.inOut' }, settle + .7);
      }
    });
    const finaleTrigger = ScrollTrigger.create({
      id: 'maison-finale',
      animation: finaleTimeline,
      trigger: outro,
      start: () => geometry.start + (geometry.end - geometry.start) * .88,
      end: () => Math.max(
        geometry.end + window.innerHeight * .12,
        root.getBoundingClientRect().top + window.scrollY + root.offsetHeight
          - Math.min(window.innerHeight, finale.offsetHeight),
      ),
      scrub: .45,
      onRefresh: (self) => finaleTimeline.totalProgress(self.progress),
    });
    finaleTrigger.refresh();
    finaleTimeline.totalProgress(finaleTrigger.progress);
    const observer = new ResizeObserver(() => ScrollTrigger.refresh());
    observer.observe(root);
    return () => {
      observer.disconnect();
      finaleTrigger.kill();
      finaleTimeline.revert();
      tween.scrollTrigger.kill();
      tween.kill();
      gsap.set([sun, hook, ring], { clearProps: 'transform' });
    };
  }, [rootRef]);
}
