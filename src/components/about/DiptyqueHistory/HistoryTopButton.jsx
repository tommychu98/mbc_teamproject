import './HistoryTopButton.css';

export default function HistoryTopButton() {
  const scrollToTop = () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
  };

  return (
    <button
      className="diptyque-history__top"
      type="button"
      aria-label="페이지 맨 위로 이동"
      onClick={scrollToTop}
    >
      <span className="diptyque-history__top-arrow" aria-hidden="true" />
      <span aria-hidden="true">TOP</span>
    </button>
  );
}
