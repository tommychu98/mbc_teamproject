import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createBackdropSampler } from "./topButtonBackdrop";

export default function BackToTop() {
  const buttonRef = useRef(null);
  const [darkBackdrop, setDarkBackdrop] = useState(false);

  useEffect(() => {
    const page = document.querySelector(".for-the-planet");
    if (!page || !buttonRef.current) return;
    const sample = createBackdropSampler(document.body, buttonRef.current);
    let frame;
    let lastSample = -Infinity;
    const update = (time) => {
      // Scenes animate after scrolling, so keep checking their rendered backdrop.
      if (time - lastSample >= 100) {
        lastSample = time;
        const luminance = sample();
        setDarkBackdrop((wasDark) => luminance < (wasDark ? 0.22 : 0.18));
      }
      frame = window.requestAnimationFrame(update);
    };
    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return createPortal(
    <button
      ref={buttonRef}
      className="ftp-back-to-top"
      data-backdrop={darkBackdrop ? "dark" : "light"}
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
      <span className="ftp-back-to-top__arrow" aria-hidden="true" />
      <span aria-hidden="true">TOP</span>
    </button>,
    document.body,
  );
}
