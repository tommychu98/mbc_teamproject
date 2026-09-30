import './HistoryCollectTransform.css';

const ASSET_ROOT = '/images/history/collect-transform';

export default function HistoryCollectTransform() {
  return (
    <section
      className="history-collect-transform"
      aria-label="Collect and transform"
    >
      <div className="history-collect-transform__visual history-collect-transform__visual--collect">
        <img
          src={`${ASSET_ROOT}/collect-visual.png`}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="history-collect-transform__visual history-collect-transform__visual--transform">
        <img
          src={`${ASSET_ROOT}/transform-visual.png`}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="history-collect-transform__panel history-collect-transform__panel--collect">
        <div className="history-collect-transform__copy history-collect-transform__copy--collect">
          <h2>TO COLLECT</h2>
          <p className="history-collect-transform__copy-wide">
            창작은 세심하게 바라보는 것에서 시작됩니다.
            <br />
            여행에서 발견한 물건, 자연의 작은 형태, 기억 속의 색.
          </p>
          <p>
            중요한 것은 무엇을 보느냐보다
            <br />
            그것을 어떤 시선으로 기억하는가 였습니다.
          </p>
        </div>
      </div>

      <div className="history-collect-transform__panel history-collect-transform__panel--transform">
        <div className="history-collect-transform__transform-wrapper">
          <div className="history-collect-transform__copy history-collect-transform__copy--transform">
            <h2>TO TRANSFORM</h2>
            <p>
              하나의 풍경은 향이 되고,
              <br />
              하나의 기억은 이미지와 오브제로 다시 나타납니다.
            </p>
            <p>
              형태는 바뀌어도
              <br />
              그 날의 기억과 이야기는 지속됩니다.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
