import { useEffect, useRef } from 'react';
import lemonDrawing from './assets/top-lemon.png';
import './HomeScentMemory.css';

const MEMORY_LINES = [
    'Every scent begins as a memory,',
    'the ones we choose to carry',
    'into what comes next.',
];
const CHARACTER_COUNT = MEMORY_LINES.join('').replaceAll(' ', '').length;
const clamp = (value) => Math.min(1, Math.max(0, value));

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

        const paint = () => {
            frameId = 0;
            const distance = Math.max(0, section.offsetHeight - stage.offsetHeight);
            const progress = distance > 0 ? clamp(-section.getBoundingClientRect().top / distance) : 0;
            const position = progress * CHARACTER_COUNT;

            characters.forEach((character, index) => {
                const inkAmount = clamp(position - index);
                character.style.color = `rgba(34, 34, 34, ${0.5 + inkAmount * 0.5})`;
            });
            section.dataset.scrollProgress = progress.toFixed(6);
        };

        const schedulePaint = () => {
            if (!frameId) frameId = requestAnimationFrame(paint);
        };

        const measure = () => {
            const stageHeight = stage.offsetHeight;
            section.style.setProperty('--memory-stage-height', `${stageHeight}px`);
            section.style.setProperty('--memory-scroll-distance', `${Math.max(window.innerHeight, stageHeight)}px`);
            paint();
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
                <img className="home-scent-memory__lemon" src={lemonDrawing} alt="" width="1404" height="936" draggable="false" />
                <p className="home-scent-memory__copy"><MemoryLines /></p>
            </div>
        </section>
    );
}
