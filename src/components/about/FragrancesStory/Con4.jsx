import man from './assets/con4-man.png';
import cabinet from './assets/con4-cabinet.png';
import clock from './assets/con4-clock.png';
import drawing1 from './assets/con4-drawing1.png';
import drawing2 from './assets/con4-drawing2.png';
import cloth from './assets/con4-cloth.png';
import './Con4.css';

export default function Con4() {
  return (
    <section className="fragrances-con4" aria-labelledby="fragrances-con4-title">
      <div className="fragrances-con4__scene">
        <p className="fragrances-con4__text fragrances-con4__text--body1">
          오 드 퍼퓸은 34번가의 기억을 더욱 깊이 담아냅니다.<br />
          바닐라와 앰버 우드가 풍성한 온기를 더하며,<br />
          오래된 부티크의 따스한 분위기를 그립니다.
        </p>
        <p className="fragrances-con4__text fragrances-con4__text--body2">
          문이 닫힌 뒤에도 향은 그 자리에 남아,<br />
          당신의 향취와 함께 34번가의 기억을 불러옵니다.
        </p>
        <div className="fragrances-con4__intro">
          <h3 className="fragrances-con4__subtitle">BEFORE FRAGRANCE, THERE WAS A PLACE</h3>
          <p className="fragrances-con4__text">
            34번가의 문이 처음 열리던 날,<br />
            그 공간을 가득 채운 향에서 이야기는 시작됩니다.
          </p>
        </div>
        <h2 className="fragrances-con4__title" id="fragrances-con4-title">
          <span className="fragrances-con4__title-the">The </span>
          <span className="fragrances-con4__title-34">34</span>
        </h2>
        <p className="fragrances-con4__chapter">Chapter II</p>

        <img className="fragrances-con4__man" src={man} alt="꽃무늬 직물을 살펴보는 남성과 도안, 가위, 책이 놓인 작업 테이블" width="1920" height="1543" draggable="false" />
        <div className="fragrances-con4__cabinet">
          <img className="fragrances-con4__cabinet-image" src={cabinet} alt="" width="1050" height="1498" draggable="false" />
        </div>
        <div className="fragrances-con4__clock">
          <img className="fragrances-con4__clock-image" src={clock} alt="" width="1024" height="1536" draggable="false" />
        </div>
        <div className="fragrances-con4__drawing fragrances-con4__drawing--second">
          <img className="fragrances-con4__drawing-image fragrances-con4__drawing-image--second" src={drawing2} alt="" width="1536" height="1024" draggable="false" />
        </div>
        <div className="fragrances-con4__drawing fragrances-con4__drawing--first">
          <img className="fragrances-con4__drawing-image fragrances-con4__drawing-image--first" src={drawing1} alt="" width="1536" height="1024" draggable="false" />
        </div>
        <img className="fragrances-con4__cloth" src={cloth} alt="" width="791" height="973" draggable="false" />
      </div>
    </section>
  );
}
