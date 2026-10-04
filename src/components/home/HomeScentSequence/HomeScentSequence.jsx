import { Fragment, useLayoutEffect, useRef } from 'react';
import './HomeScentSequence.css';


const scenes = [
    { id: '2863:8192', text: 'See the scent.' },
    { id: '2863:8526', text: 'Follow your senses.' },
    { id: '2863:8528', text: 'Find your fragrance.' },
];

export default function HomeScentSequence() {
    const rootRef = useRef(null);

    useLayoutEffect(() => {
        const root = rootRef.current;
        const stage = root.querySelector('.scent-sequence__stage');
        const lines = [...root.querySelectorAll('.scent-sequence__line')];
        const letters = lines.map(line => [...line.querySelectorAll('.scent-sequence__char')]);
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        const clamp = value => Math.max(0, Math.min(1, value));
        const ease = value => {
            const t = clamp(value);
            return t * t * (3 - 2 * t);
        };
        let frame = 0;
        let previousTime = 0;
        let current = null;

        const render = now => {
            frame = 0;
            // Measure live geometry: upstream pins, media and responsive layouts
            // cannot leave this sequence using stale document coordinates.
            const distance = Math.max(1, root.offsetHeight - stage.offsetHeight);
            const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
            const target = clamp((stickyTop - root.getBoundingClientRect().top) / distance);
            const elapsed = previousTime ? Math.min(64, now - previousTime) : 16;
            previousTime = now;
            if (current === null || reduced.matches) current = target;
            else current += (target - current) * (1 - Math.exp(-elapsed / 110));
            const time = current * 9.45;

            letters.forEach((characters, scene) => {
                const entry = [0, 3.5, 7.1][scene];
                const exit = [2.1, 5.7, Infinity][scene];
                lines[scene].style.visibility = 'visible';
                characters.forEach((character, index) => {
                    const order = index / Math.max(1, characters.length - 1);
                    const written = ease((time - entry - order * 0.8) / 0.65);
                    const erased = ease((time - exit - (1 - order) * 0.65) / 0.65);
                    const opacity = written * (1 - erased);
                    character.style.opacity = opacity.toFixed(4);
                    const x = reduced.matches ? 0 : erased * (7 + Math.sin(index * 1.7) * 3);
                    const y = reduced.matches ? 0 : (1 - written) * 5 - erased * (4 + index % 3 * 2);
                    character.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
                    character.style.filter = reduced.matches ? 'none' : 'blur(' + ((1 - written) * 4 + erased * 6) + 'px)';
                });
            });
            if (Math.abs(target - current) > 0.00005) frame = requestAnimationFrame(render);
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(render);
        };
        const observer = new ResizeObserver(schedule);
        [...root.parentElement.children].forEach(section => observer.observe(section));
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        reduced.addEventListener('change', schedule);
        schedule();
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            reduced.removeEventListener('change', schedule);
        };
    }, []);

    return (
        <section ref={rootRef} className="scent-sequence" data-node-id="2863:8191" aria-label="Discover your fragrance">
            <div className="scent-sequence__stage">
                <div className="scent-sequence__canvas">
                    {scenes.map(({ id, text }, index) => (
                        <p key={id} className="scent-sequence__line" data-node-id={id} data-scene={index} aria-label={text}>
                            <span aria-hidden="true">
                                {Array.from(text).map((char, i) => {
                                    const mobileBreak = index > 0 && i === text.lastIndexOf(' ');
                                    return <Fragment key={i}>
                                        {mobileBreak && <br className="scent-sequence__mobile-break" />}
                                        <span className={`scent-sequence__char${mobileBreak ? ' scent-sequence__desktop-space' : ''}`}>{char === ' ' ? '\u00a0' : char}</span>
                                    </Fragment>;
                                })}
                            </span>
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}
