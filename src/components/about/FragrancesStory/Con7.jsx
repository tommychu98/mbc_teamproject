import musicians from './assets/con7-musicians.png';
import dancers from './assets/con7-dancers.png';
import furniture from './assets/con7-furniture.png';
import chandelier from './assets/con7-chandelier.png';
import plant from './assets/con7-plant.png';
import './Con7.css';

export default function Con7() {
  return (
    <section className="fragrances-con7" aria-labelledby="fragrances-con7-title">
      <div className="fragrances-con7__scene">
        <img className="fragrances-con7__musicians" src={musicians} alt="" width="787" height="452" draggable="false" />
        <h2 className="fragrances-con7__title" id="fragrances-con7-title">Orphéon</h2>
        <p className="fragrances-con7__chapter">Chapter III</p>
        <div className="fragrances-con7__intro">
          <h3 className="fragrances-con7__subtitle">PARIS AS NIGHT FALLS</h3>
          <p className="fragrances-con7__text">
            파리 재즈 클럽의 기억에서 태어난 오르페옹은<br />
            음악과 웃음, 사람들의 온기로 가득했던 밤을 담아내며, 화려했던 그 시절의 풍경과 설렘을 다시 불러옵니다.
          </p>
        </div>
        <p className="fragrances-con7__text fragrances-con7__text--body">
          주니퍼베리와 시더, 통카빈의 깊고 따스한 향은<br />
          음악이 멈춘 뒤에도 잔잔한 선율처럼 공간에 머물며,<br />
          지나간 밤의 기억과 그날의 여운을 오래도록 남깁니다.
        </p>
        <img className="fragrances-con7__dancers" src={dancers} alt="파리 재즈 클럽에서 서로 마주 보며 춤추는 세 쌍의 남녀" width="966" height="1286" draggable="false" />
        <img className="fragrances-con7__furniture" src={furniture} alt="" width="1255" height="1115" draggable="false" />
        <img className="fragrances-con7__chandelier" src={chandelier} alt="" width="970" height="647" draggable="false" />
        <img className="fragrances-con7__plant" src={plant} alt="" width="425" height="638" draggable="false" />
      </div>
    </section>
  );
}
