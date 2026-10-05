import { useEffect, useRef } from 'react';
import { createDampedValue } from '../../../utils/scrollMotion';
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

        let frameId = 0;
        let renderedProgress = null;
        const motion = createDampedValue({ maxLag: 0.06 });

        const paint = (now) => {
            frameId = 0;
            const distance = Math.max(0, section.offsetHeight - stage.offsetHeight);
            const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
            const progress = distance > 0 ? clamp((stickyTop - section.getBoundingClientRect().top) / distance) : 0;
            renderedProgress = motion.update(progress, now, false);
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

        measure();

        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            window.removeEventListener('scroll', schedulePaint);
            window.removeEventListener('resize', measure);

        };
    }, []);

    return (
        <section className="home-scent-memory" ref={sectionRef} aria-label="Every scent begins as a memory" data-scroll-progress="0">
            <div className="home-scent-memory__stage" ref={stageRef}>
                <img loading="lazy" decoding="async" fetchPriority="low" className="home-scent-memory__lemon" src={lemonDrawing} alt="" width="1404" height="936" draggable="false" />
                <p className="home-scent-memory__copy"><MemoryLines /></p>
            </div>
        </section>
    );
}
