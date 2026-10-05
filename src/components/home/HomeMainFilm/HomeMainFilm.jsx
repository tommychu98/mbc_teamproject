import { useEffect, useRef } from 'react';
import useFilmTransition from './useFilmTransition';
import './HomeMainFilm.css';
import useHomeMobile from '../useHomeMobile';

export default function HomeMainFilm() {
    const mobile = useHomeMobile();
    return mobile ? null : <DesktopMainFilm />;
}

function DesktopMainFilm() {
    const videoRef = useRef(null);
    const sectionRef = useRef(null);
    useFilmTransition(sectionRef);

    useEffect(() => {
        const video = videoRef.current;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let isVisible = false;

        const syncPlayback = () => {
            if (reducedMotion.matches || !isVisible || document.hidden) {
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
            { threshold: 0, rootMargin: '0px 0px -10% 0px' }
        );

        observer.observe(video);
        reducedMotion.addEventListener('change', syncPlayback);
        document.addEventListener('visibilitychange', syncPlayback);

        return () => {
            observer.disconnect();
            reducedMotion.removeEventListener('change', syncPlayback);
            document.removeEventListener('visibilitychange', syncPlayback);
            video.pause();
        };
    }, []);

    return (
        <section className="home-main-film" ref={sectionRef} aria-label="Diptyque ritual film">
            <div className="home-main-film__stage">
                <div className="home-main-film__frame">
                    <video
                        ref={videoRef}
                        className="home-main-film__video"
                        src="/videos/home-main.mp4"
                        poster="/videos/home-main-poster.png"
                        muted
                        playsInline
                        loop
                        preload="metadata"
                        aria-hidden="true"
                    />
                    <img
                        className="home-main-film__still"
                        src="/videos/home-main-poster.png"
                        alt=""
                        aria-hidden="true"
                    />
                    <div className="home-main-film__reveal" aria-hidden="true" />
                    <div className="home-main-film__night-fade" aria-hidden="true" />
                </div>
            </div>
        </section>
    );
}
