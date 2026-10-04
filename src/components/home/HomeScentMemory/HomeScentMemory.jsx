import { useEffect, useRef } from 'react';
import lemonDrawing from './assets/top-lemon.png';
import './HomeScentMemory.css';
import '../connectedLemon.css';

const MEMORY_LINES = [
    'Every scent begins as a memory,',
    'the ones we choose to carry',
    'into what comes next.',
];
const CHARACTER_COUNT = MEMORY_LINES.join('').replaceAll(' ', '').length;
const clamp = (value) => Math.min(1, Math.max(0, value));
const INK_SPREAD = 8;
const INK_LERP = 0.045;
const INK_START_PROGRESS = 0.2;
const INK_END_PROGRESS = 0.95;
// Preserve the existing transition distance (2.295 viewports × 94%),
// extend it by 1.9, and fit it between the opening hold and final hold.
const SCROLL_RANGE_MULTIPLIER = (2.295 * 0.94 * 1.9) / (INK_END_PROGRESS - INK_START_PROGRESS);
const smoothstep = (value) => value * value * (3 - 2 * value);

function MemoryLines() {
    let characterIndex = 0;

    return MEMORY_LINES.map((line, lineIndex) => (
        <span className="home-scent-memory__line" key={lineIndex}>
            {Array.from(line, (character) => {
                if (character === ' ') return character;

                const index = characterIndex++;
                return <span className="home-scent-memory__character" data-character-index={index} key={index}>{character}</span>;
            })}
        </span>
    ));
}

export default function HomeScentMemory() {
    const sectionRef = useRef(null);
    const stageRef = useRef(null);

    useEffect(() => {
        const section = sectionRef.current;
        const stage = stageRef.current;
        const characters = section.querySelectorAll('.home-scent-memory__character');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frameId = 0;
        let renderedProgress = null;
        let previousTime = 0;

        const paint = (now) => {
            frameId = 0;
            const distance = Math.max(0, section.offsetHeight - stage.offsetHeight);
            const progress = distance > 0 ? clamp(-section.getBoundingClientRect().top / distance) : 0;
            const elapsed = previousTime ? Math.min(64, now - previousTime) : 1000 / 60;
            previousTime = now;
            // Frame-rate independent inertia continues briefly after scrolling
            // stops. The same interpolation also handles reverse scrolling.
            const damping = 1 - Math.pow(1 - INK_LERP, elapsed / (1000 / 60));
            if (renderedProgress === null || reducedMotion.matches) renderedProgress = progress;
            else renderedProgress += (progress - renderedProgress) * damping;
            if (Math.abs(progress - renderedProgress) < 0.00001) renderedProgress = progress;
            // Hold grey for the first 20%, then reveal ink slowly in either
            // direction, leaving a short black hold before sticky releases.
            const inkProgress = clamp((renderedProgress - INK_START_PROGRESS) / (INK_END_PROGRESS - INK_START_PROGRESS));
            const position = inkProgress * (CHARACTER_COUNT - 1 + INK_SPREAD);

            characters.forEach((character, index) => {
                // Overlapping character ramps let the feather travel through
                // each glyph while its neighbours gradually absorb the ink.
                const inkAmount = smoothstep(clamp((position - index) / INK_SPREAD));
                character.style.setProperty('--ink-edge', `${(-45 + inkAmount * 190).toFixed(3)}%`);
            });
            section.dataset.scrollProgress = progress.toFixed(6);
            section.dataset.renderProgress = renderedProgress.toFixed(6);
            if (renderedProgress !== progress) frameId = requestAnimationFrame(paint);
            else previousTime = 0;
        };

        const schedulePaint = () => {
            if (!frameId) frameId = requestAnimationFrame(paint);
        };

        const measure = () => {
            const stageHeight = stage.offsetHeight;
            section.style.setProperty('--memory-stage-height', `${stageHeight}px`);
            section.style.setProperty('--memory-scroll-distance', `${Math.max(window.innerHeight, stageHeight) * SCROLL_RANGE_MULTIPLIER}px`);
            schedulePaint();
        };

        const observer = new ResizeObserver(measure);
        observer.observe(stage);
        window.addEventListener('scroll', schedulePaint, { passive: true });
        window.addEventListener('resize', measure);
        reducedMotion.addEventListener('change', schedulePaint);
        measure();

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            window.removeEventListener('scroll', schedulePaint);
            window.removeEventListener('resize', measure);
            reducedMotion.removeEventListener('change', schedulePaint);
        };
    }, []);

    return (
        <section className="home-scent-memory" ref={sectionRef} aria-label="Every scent begins as a memory" data-scroll-progress="0">
            <div className="home-scent-memory__stage" ref={stageRef}>
                <img className="home-scent-memory__lemon" src={lemonDrawing} alt="" width="1404" height="936" draggable="false" />
                <p className="home-scent-memory__copy"><MemoryLines /></p>
            </div>
        </section>
    );
}
