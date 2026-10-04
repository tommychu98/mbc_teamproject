const u = px => `${px/4.3}cqw`;
const layers = [
 ['mobile/46d9b',-114,0,639,1136],
 ['story-01-atmosphere-visual',-478,392,1474,1474],
 ['mobile/38c59',191,276,282,375,true],
 ['mobile/dcfee',240,491,322.667,242],
 ['story-01-candle-object-02',85,583,201,201],
 ['mobile/05030',-200,184,425,567],
];
export default function HistoryCandleMobile() {
 return <section className="history-candle-mobile" aria-labelledby="history-candle-mobile-title">
  <div className="history-candle-mobile__stage">
   {layers.map(([name,x,y,w,h,flip])=><img key={name} className="history-candle-mobile__image" src={`/images/history/scent/${name}.png`} alt="" style={{left:u(x),top:`calc(${u(y-52)} + 52px)`,width:u(w),height:u(h),transform:flip?'scaleX(-1)':undefined}} />)}
   <div className="history-candle-mobile__light" aria-hidden="true">
    <span className="history-candle-mobile__halo" />
    <span className="history-scent-mobile__flame"><span /></span>
   </div>
   <article className="history-candle-mobile__copy">
    <h2 id="history-candle-mobile-title">THE<br />CANDLE</h2>
    <p>1963년, 첫 향초는 딥디크의 세계에<br />새로운 감각을 더했습니다.</p>
    <p>향이 더해지면서 딥디크의 세계는<br />시각과 촉각을 넘어<br />후각으로 확장되었습니다.</p>
    <p>불을 밝히는 순간,<br />형태를 넘어 공간 전체의 분위기를<br />변화시키기 시작했습니다.</p>
   </article>
  </div>
 </section>;
}
