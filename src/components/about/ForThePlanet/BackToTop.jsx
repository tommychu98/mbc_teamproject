import { createPortal } from "react-dom";

export default function BackToTop() {
  return createPortal(
    <button
      className="ftp-back-to-top"
      type="button"
      aria-label="페이지 맨 위로 이동"
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      }}
    >
      <picture aria-hidden="true">
        <source media="(max-width: 899px)" srcSet="/ForThePlanet/top-mobile.svg" />
        <img src="/ForThePlanet/top-desktop.svg" alt="" />
      </picture>
      <span aria-hidden="true">TOP</span>
    </button>,
    document.body,
  );
}
