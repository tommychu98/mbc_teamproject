import { useEffect, useRef } from 'react';
import './HistoryScentMobile.css';
import HistoryCandleMobile from './HistoryCandleMobile';
import HistoryScentSpaceMobile from './HistoryScentSpaceMobile';
import HistoryMaisonMobile from './HistoryMaisonMobile';
import HistoryMaisonWordMobile from './HistoryMaisonWordMobile';
import HistoryMaisonTodayMobile from './HistoryMaisonTodayMobile';

const u = px => `${px / 4.3}cqw`;
const assets = { '323f5':'story-01-decorative-visual-01', '64f23':'background-candle-scene', '87a81':'story-01-decorative-object-01', '8b094':'story-01-feature-collage', '93de3':'background-hero-scene', 'b379b':'story-01-decorative-object-02', 'b86e3':'story-01-atmosphere-visual', 'db2b8':'story-01-decorative-object-03', 'fc744':'story-01-candle-object-02' };
const layers = [
 ['93de3',-373,0,1297,968], ['64f23',66,372,569,564],
 ['323f5',-117,392,290,435], ['b86e3',-131,616,692,692],
 ['87a81',18,700,66,66], ['b379b',196,621,158,158],
 ['db2b8',327,636,96,143], ['8b094',42,502,201,269], ['fc744',158,682,113,113],
];
const smooth = (a,b,v) => { const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t); };
export default function HistoryScentMobile() {
 const ref=useRef(null);
 useEffect(()=>{
   let frame, enteredAt = null;
   const app=document.querySelector('.app--history');
   const render=()=>{
     frame=undefined;
     const root=ref.current, viewport=root.firstElementChild;
     if (!viewport.offsetHeight) { app?.classList.remove('app--scent-mobile'); return; }
     const h=viewport.offsetHeight, top=root.getBoundingClientRect().top;
     // Start as soon as this scene is meaningfully visible; do not rely on
     // reaching an exact scroll coordinate or restart on mobile viewport resize.
     if (top < h * .75 && top + root.offsetHeight > 0 && enteredAt === null) enteredAt = performance.now();
     const elapsed = enteredAt === null ? 0 : performance.now() - enteredAt;
     const text = smooth(180, 500, elapsed);
     // The opening must finish even when the visitor stops scrolling to read.
     // Scroll may gently accelerate lighting, but cannot skip the text-first hold.
     const light = smooth(650, 1650, elapsed);
     root.style.setProperty('--scent-text', text);
     root.style.setProperty('--scent-light', light);
     // One slow, irregular signal drives both the wick and the room lighting.
     const t=performance.now()/1000;
     const flicker=.5 + .28*Math.sin(t*2.3) + .14*Math.sin(t*4.7+.8) + .08*Math.sin(t*7.1);
     root.style.setProperty('--candle-pulse', flicker);
     root.style.setProperty('--candle-lean', `${(flicker-.5)*9}deg`);
     root.style.setProperty('--candle-scale', .9+flicker*.2);
     const next=root.nextElementSibling;
     if(next?.classList.contains('history-candle-mobile')) {
       for(const key of ['--candle-pulse','--candle-lean','--candle-scale']) next.style.setProperty(key,root.style.getPropertyValue(key));
     }
     const space=next?.nextElementSibling;
     const bottom=space?.classList.contains('history-scent-space-mobile') ? space.getBoundingClientRect().bottom : next?.classList.contains('history-candle-mobile') ? next.getBoundingClientRect().bottom : top+root.offsetHeight;
     root.dataset.phase = elapsed < 180 ? 'black' : elapsed < 650 ? 'text' : elapsed < 1650 ? 'light' : 'complete';
     const candleVisible=next?.classList.contains('history-candle-mobile') && next.getBoundingClientRect().top<h && bottom>0;
     if ((enteredAt !== null || candleVisible) && top < h && bottom>0 && !document.hidden) frame=requestAnimationFrame(render);
     app?.classList.toggle('app--scent-mobile',top<=52&&bottom>52);
   };
   const schedule=()=>{if(frame===undefined)frame=requestAnimationFrame(render);};
   render();window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);document.addEventListener('visibilitychange',schedule);
   return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);document.removeEventListener('visibilitychange',schedule);app?.classList.remove('app--scent-mobile');};
 },[]);
 return <><section ref={ref} className="history-scent-mobile" aria-labelledby="history-scent-mobile-title">
  <div className="history-scent-mobile__viewport">
   <div className="history-scent-mobile__stage">
    <div className="history-scent-mobile__art" aria-hidden="true">
     {layers.map(([name,x,y,w,h])=><img key={name} src={`/images/history/scent/${assets[name]}.png`} alt="" style={{left:u(x),top:`calc(${u(y - 52)} + 52px)`,width:u(w),height:u(h)}} />)}
    </div>
    <div className="history-scent-mobile__candle-light" aria-hidden="true">
      <div className="history-scent-mobile__room-shade" />
      <div className="history-scent-mobile__room-glow" />
      <span className="history-scent-mobile__flame"><span /></span>
    </div>
    <div className="history-scent-mobile__copy">
     <h2 id="history-scent-mobile-title">SCENT</h2>
     <img src="/images/history/objects/mobile/39d90.svg" alt="" />
     <p>Then, scent changed everything.<br />The invisible became a new material.</p>
    </div>
   </div>
  </div>
 </section><HistoryCandleMobile /><HistoryScentSpaceMobile /><HistoryMaisonMobile /><HistoryMaisonWordMobile /><HistoryMaisonTodayMobile /></>;
}
