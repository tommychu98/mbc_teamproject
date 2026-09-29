import { useCallback, useEffect, useRef, useState } from 'react';
import loadingVideo from './assets/Loading.mp4';
import useIntroSession from './useIntroSession';
import './IntroVideo.css';

const DEFAULT_FALLBACK_MS = 3000;
const DEFAULT_FADE_MS = 320;

export default function IntroVideo({
  videoSrc = loadingVideo,
  mobileVideoSrc,
  onComplete,
  fallbackMs = DEFAULT_FALLBACK_MS,
  fadeDuration = DEFAULT_FADE_MS,
  className = '',
}) {
  const { shouldPlay, markPlayed } = useIntroSession();
  const [rendered, setRendered] = useState(shouldPlay);
  const [exiting, setExiting] = useState(false);
  const videoRef = useRef(null);
  const exitStartedRef = useRef(false);
  const completionTimerRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  const fadeDurationRef = useRef(fadeDuration);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    fadeDurationRef.current = fadeDuration;
  }, [fadeDuration, onComplete]);

  useEffect(() => {
    if (!rendered) return undefined;

    const root = document.documentElement;
    const body = document.body;
    const previousStyles = {
      rootOverflow: root.style.overflow,
      rootOverscroll: root.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyOverscroll: body.style.overscrollBehavior,
    };

    root.style.overflow = 'hidden';
    root.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';

    return () => {
      root.style.overflow = previousStyles.rootOverflow;
      root.style.overscrollBehavior = previousStyles.rootOverscroll;
      body.style.overflow = previousStyles.bodyOverflow;
      body.style.overscrollBehavior = previousStyles.bodyOverscroll;
    };
  }, [rendered]);

  const finish = useCallback(() => {
    if (exitStartedRef.current) return;
    exitStartedRef.current = true;
    setExiting(true);

    completionTimerRef.current = window.setTimeout(() => {
      setRendered(false);
      onCompleteRef.current?.();
    }, fadeDurationRef.current);
  }, []);

  useEffect(() => {
    if (!shouldPlay) return undefined;

    markPlayed();
    const fallbackTimer = window.setTimeout(finish, fallbackMs);
    const playPromise = videoRef.current?.play();
    playPromise?.catch(finish);

    return () => {
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(completionTimerRef.current);
    };
  }, [fallbackMs, finish, markPlayed, shouldPlay]);

  if (!rendered) return null;

  return (
    <div
      className={`intro-video${exiting ? ' intro-video--exiting' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--intro-fade-duration': `${fadeDuration}ms` }}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className="intro-video__media"
        autoPlay
        muted
        playsInline
        loop={false}
        preload="auto"
        tabIndex={-1}
        onEnded={finish}
        onError={finish}
      >
        {mobileVideoSrc && (
          <source
            src={mobileVideoSrc}
            media="(max-width: 767px), (max-height: 767px) and (orientation: landscape)"
          />
        )}
        <source src={videoSrc} />
      </video>
    </div>
  );
}
