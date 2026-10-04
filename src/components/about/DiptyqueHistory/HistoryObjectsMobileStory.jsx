import ObjectsWalkingOnce from './ObjectsWalkingOnce';
import ObjectsMobileClock from './ObjectsMobileClock';

const existing = {
 '04664':'objects-shelf-object-09', '15a6b':'story-01-collected-object-02', '19783':'objects-shelf-object-06',
 '1dcc4':'floating-small-accent-02', '1f620':'objects-shelf-object-05', '251e3':'objects-tall-object-01',
 '2cc9c':'objects-shelf-object-01', '31cab':'objects-shelf-object-02', '31d94':'objects-shelf-object-03',
 '33e97':'objects-shelf-object-04', '3bbe5':'objects-shelf-object-11', '459cd':'objects-outro-background',
 '4a492':'story-01-collected-object-01', '58c05':'floating-framed-image-03', '5df0f':'floating-framed-image-05',
 '660a5':'objects-shelf-background-02', '7c9ff':'story-01-collected-object-04', '83c65':'objects-shelf-object-10',
 '8fc2a':'objects-outro-decorative-object-01', 'a638e':'story-01-collected-object-03', 'a6711':'objects-shelf-object-08',
 'c0467':'objects-shelf-object-07', 'd15b8':'objects-shelf-background-03', 'eaa05':'story-01-feature-visual', 'fe30c':'objects-shelf-background-01',
};
const asset = (name) => `/images/history/objects/${existing[name] || `mobile/${name}`}.png`;
const u = (px) => `${px / 4.3}cqw`;
// One continuous 430 × 2805 scene, not three independently snapping screens.
const layers = [
 ['208f7',-23,581,907,302.333], ['eaa05',2.005,260,378.535,473,'flip'],
 ['4a492',326.998,457,196.142,261.522], ['15a6b',467.568,457,196.142,261.522],
 ['a638e',608.138,459.133,192.942,257.256], ['7c9ff',745.508,459.133,192.942,257.256],
 ['f137e',65,762,396,396], ['58c05',-110,-1,408,306], ['1dcc4',284,755,16,16,'flip'],
 ['5df0f',230,1157,376,282], ['64446',-217,1291,372,279],
 ['459cd',-421,2484,1191,397], ['89150',-91,2389,630,345.917],
 ['3e7ea',-160,2063,307,546], ['1975f',-600,2116,1200,675],
 ['b79ab',-138.005,2361.13,511.275,638.866],
 ['2cc9c',-7.239,2449.24,82.119,88.929], ['31cab',174.077,2582,67.823,94.416],
 ['251e3',-125.91,2330,166.92,232.369], ['fe30c',69.314,2774.14,87.886,50.56],
 ['660a5',144.408,2767.18,76.192,59.7], ['31d94',.087,2590.43,55.413,77.14],
 ['33e97',249.891,2609.11,64.099,64.466], ['1f620',78.839,2593.36,57.111,71.461],
 ['19783',130.086,2566.28,48.716,48.088,-10.57], ['d15b8',254.66,2680.37,61.5,70.734],
 ['c0467',297.145,2424.13,47.235,137.768], ['a6711',223.882,2790.78,84.288,36.244],
 ['04664',-51.919,2632.55,28.629,27.049], ['83c65',-78.662,2602.51,34.142,59.933],
 ['3bbe5',173.705,2706.01,76.185,50.981], ['8fc2a',177.784,2409.12,119.356,149.142,'flip'],
];
export default function HistoryObjectsMobileStory() {
 return <section className="history-objects-mobile-story" aria-label="오브제로 넓어진 딥디크의 세계">
   {layers.map(([name,x,y,w,h,transform],i)=>name === 'f137e'
    ? <ObjectsMobileClock key={i} style={{left:u(x),top:u(y),width:u(w),height:u(h)}} />
    : name === '1975f'
    ? <ObjectsWalkingOnce key={i} src={asset(name)} className="history-objects-mobile-story__image" style={{left:u(x),top:u(y),width:u(w),height:u(h)}} />
    : <img key={i} src={asset(name)} alt="" aria-hidden="true" className="history-objects-mobile-story__image"
    style={{left:u(x),top:u(y),width:u(w),height:u(h),transform:transform==='flip'?'scaleX(-1)':transform?`rotate(${transform}deg)`:undefined}} />)}
   <article className="history-objects-mobile-story__found">
    <h2>FOUND<br />ELSEWHERE</h2>
    <div className="history-objects-mobile-story__found-copy">
     <p>생제르맹의 부티크는<br />점차 다양한 오브제들로<br />채워졌습니다.<br />여행에서 발견한 물건들은 단순한<br />기념품으로 남지 않았습니다.<br />딥디크의 시선을 거치며 새로운<br />맥락과 의미를 가진 오브제로<br />다시 소개되었습니다.</p>
     <p>보고, 만지고, 머무르며<br />새로운 취향을 발견하는 하나의<br />작은 세계에 가까웠습니다.</p>
    </div>
   </article>
   <article className="history-objects-mobile-story__discovery">
    <h2>A SENSE OF<br />DISCOVERY</h2>
    <p>무엇을 발견하게 될지 알 수 없는<br />경험 자체가 부티크의 매력이었습니다.<br />딥디크는 물건을 판배하기보다 새로운<br />감각과 취향을 제안하기 시작했습니다.</p>
    <p>아름답다고 느끼는 것이라면<br />무엇이든 딥디크의 세계 안으로<br />들어올 수 있었습니다.</p>
   </article>
   <img className="history-objects-mobile-story__frame" src={asset('281a2')} alt="" aria-hidden="true" />
 </section>;
}
