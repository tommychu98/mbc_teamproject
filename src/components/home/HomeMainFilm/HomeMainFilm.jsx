import { useEffect, useRef } from 'react';
import useFilmTransition from './useFilmTransition';
import './HomeMainFilm.css';

export default function HomeMainFilm() {
    const videoRef = useRef(null);
    const sectionRef = useRef(null);
    const stageRef = useRef(null);
    const frameRef = useRef(null);
    const backdropRef = useRef(null);
    useFilmTransition(sectionRef, stageRef, frameRef, backdropRef);

    useEffect(() => {
        const video = videoRef.current;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let isVisible = false;

        const syncPlayback = () => {
            if (reducedMotion.matches || !isVisible || frameRef.current.dataset.visible !== 'true') {
                video.pause();
                return;
            }
            video.play().catch(() => {});
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
                syncPlayback();
            },
            { threshold: 0.1 }
        );

        observer.observe(video);
        const visibilityObserver = new MutationObserver(syncPlayback);
        visibilityObserver.observe(frameRef.current, { attributes: true, attributeFilter: ['data-visible'] });
        reducedMotion.addEventListener('change', syncPlayback);

        return () => {
            observer.disconnect();
            visibilityObserver.disconnect();
            reducedMotion.removeEventListener('change', syncPlayback);
            video.pause();
        };
    }, []);

    return (
        <section className="home-main-film" ref={sectionRef} aria-label="Diptyque ritual film" data-scroll-progress="0">
            <div className="home-main-film__stage" ref={stageRef}>
                <div className="home-main-film__backdrop" ref={backdropRef} aria-hidden="true" />
                <div className="home-main-film__frame" ref={frameRef} data-visible="false">
                    <video
                        ref={videoRef}
                        className="home-main-film__video"
                        src="/videos/home-main.mp4"
                        poster="/videos/home-main-poster.png"
                        muted
                        playsInline
                        loop
                        preload="none"
                        aria-hidden="true"
                    />
                    <img
                        className="home-main-film__still"
                        src="/videos/home-main-poster.png"
                        alt=""
                        aria-hidden="true"
                    />
                </div>
            </div>
        </section>
    );
}
