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

        let isVisible = false;
        const loadSource = () => {
            if (video.getAttribute('src')) return;
            video.poster = '/videos/home-main-poster.png';
            video.preload = 'metadata';
            video.src = '/videos/home-main.mp4';
        };

        const syncPlayback = () => {
            if ((!isVisible)) {
                video.pause();
                return;
            }
            loadSource();
            video.play().catch(() => {});
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
                syncPlayback();
            },
            { threshold: 0.1 }
        );

        const preload = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            loadSource();
            preload.disconnect();
        }, { rootMargin: '900px' });
        preload.observe(video);
        observer.observe(video);

        return () => {
            observer.disconnect();
            preload.disconnect();

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
                        muted
                        playsInline
                        loop
                        preload="none"
                        aria-hidden="true"
                    />
                    <img loading="lazy" decoding="async" fetchPriority="low"
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
