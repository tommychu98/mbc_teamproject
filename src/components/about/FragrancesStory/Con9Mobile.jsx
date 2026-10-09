import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import background from './assets/mobile-con3-background.png';
import table from './assets/mobile-con3-notes-table.png';
import galbanum from './assets/mobile-con9-galbanum.png';
import jasmine from './assets/mobile-con9-jasmine.png';
import tonka from './assets/mobile-con9-tonka.png';
import bottle from './assets/mobile-con9-bottle.png';
import tonkaBottle from './assets/mobile-con9-tonka-bottle-v2.png';

const notes = [
  { node: '4997:7922', label: 'I. TOP NOTE', name: 'GALBANUM', image: galbanum, bottle },
  { node: '4997:7923', label: 'II. MIDDLE NOTE', name: 'JASMINE', image: jasmine, bottle },
  { node: '4997:7924', label: 'III. BASE NOTE', name: 'TONKA BEAN', image: tonka, bottle: tonkaBottle },
];

function Chevron() {
  return (
    <svg className="fragrances-con9__mobile-chevron" width="9" height="17" viewBox="-4.5 -8.5 9 17" fill="none" aria-hidden="true" focusable="false">
      <path d="M-3.4 -7.4 L3.4 0 L-3.4 7.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Con9Mobile() {
  const sceneRef = useRef(null);
  const timelineRef = useRef(null);
  const transitioning = useRef(false);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useLayoutEffect(() => () => timelineRef.current?.kill(), []);

  const select = (target) => {
    if (target < 0 || target >= notes.length) return;
    const index = target;
    if (transitioning.current || index === activeRef.current) return;
    const scene = sceneRef.current;
    const layers = [...scene.querySelectorAll('[data-note-layer]')];
    const outgoing = layers[activeRef.current];
    const incoming = layers[index];
    const outgoingImage = outgoing.querySelector('img');
    const incomingImage = incoming.querySelector('img');
    const outgoingText = [...outgoing.querySelectorAll('[data-note-copy]')];
    const incomingText = [...incoming.querySelectorAll('[data-note-copy]')];
    const commit = () => { activeRef.current = index; setActive(index); };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(outgoing, { visibility: 'hidden' });
      gsap.set(incoming, { visibility: 'visible' });
      commit();
      return;
    }
    transitioning.current = true;
    // Only changing artwork and copy enter this timeline. The bottle is a sibling.
    timelineRef.current = gsap.timeline({ onComplete: () => { transitioning.current = false; } })
      .to(outgoingImage, { opacity: 0, x: -8, duration: .2, ease: 'power2.out' }, 0)
      .to(outgoingText, { opacity: 0, y: -6, duration: .2, ease: 'power2.out' }, 0)
      .set(outgoing, { visibility: 'hidden' })
      .call(commit)
      .set(incoming, { visibility: 'visible' })
      .set(incomingImage, { opacity: 0, x: 8 })
      .set(incomingText, { opacity: 0, y: 6 })
      .to(incomingImage, { opacity: 1, x: 0, duration: .34, ease: 'power2.out' })
      .to(incomingText, { opacity: 1, y: 0, duration: .32, ease: 'power2.out' }, '<')
      .set([outgoingImage, ...outgoingText, incomingImage, ...incomingText], { clearProps: 'opacity,transform' });
  };

  return (
    <>
      <div ref={sceneRef} className="fragrances-con9__scene fragrances-con9__mobile-scene" data-figma-node={notes[active].node}>
        <img className="fragrances-con9__mobile-background" src={background} alt="" draggable="false" />
        <img className="fragrances-con9__mobile-table" src={table} alt="" draggable="false" />
        {notes.map((note, index) => (
          <div key={note.name} className="fragrances-con9__mobile-state" data-note-layer data-note-name={note.name.toLowerCase()} data-initial-hidden={index !== 0} aria-hidden={active !== index}>
            <div className="fragrances-con9__mobile-note-copy">
              <p className="fragrances-con9__mobile-note-label" data-note-copy>{note.label}</p>
              <h2 className="fragrances-con9__mobile-note-name" data-note-copy>{note.name}</h2>
            </div>
            <div className="fragrances-con9__mobile-plant-shadow" aria-hidden="true" />
            <img className="fragrances-con9__mobile-ingredient" src={note.image} alt={`${note.name} 향 원료`} draggable="false" />
          </div>
        ))}
        <div className="fragrances-con9__mobile-bottle-shadow" aria-hidden="true" />
        {[bottle, tonkaBottle].map(source => <img key={source} className="fragrances-con9__mobile-bottle" src={source} hidden={source !== notes[active].bottle} alt="Orphéon 오 드 퍼퓸" draggable="false" />)}
        <button type="button" className="fragrances-con9__mobile-arrow fragrances-con9__mobile-arrow--previous" aria-label="이전 향 노트" hidden={active === 0} onClick={() => select(activeRef.current - 1)}><Chevron /></button>
        <button type="button" className="fragrances-con9__mobile-arrow fragrances-con9__mobile-arrow--next" aria-label="다음 향 노트" hidden={active === notes.length - 1} onClick={() => select(activeRef.current + 1)}><Chevron /></button>
        <div className="fragrances-con9__mobile-dots" role="group" aria-label="향 노트 선택">
          {notes.map((note, index) => <button key={note.name} type="button" aria-label={note.name} aria-pressed={active === index} onClick={() => select(index)} />)}
        </div>
        <p className="sr-only" aria-live="polite" aria-atomic="true">{notes[active].label}: {notes[active].name}</p>
      </div>
    </>
  );
}
