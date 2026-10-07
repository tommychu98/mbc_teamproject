import topArrow from './HomeIntro/assets/mobile-top-bk.svg';
import './HomeTopButton.css';

export default function HomeTopButton() {
    return (
        <button
            className="home-top-button"
            type="button"
            aria-label="홈 맨 위로 이동"
            onClick={() => {
                window.dispatchEvent(new CustomEvent('home-reset-interactions'));
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                });
            }}
        >
            <img src={topArrow} alt="" aria-hidden="true" width="13" height="17" />
            <span aria-hidden="true">TOP</span>
        </button>
    );
}
