import { useEffect, useRef, useState } from 'react';
import { singlePlayGif } from './FabricPickupOnce';

export default function ObjectsWalkingOnce({ src, style, className }) {
  const ref = useRef(null);
  const timer = useRef();
  const [playback, setPlayback] = useState(null);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    let started = false, disposed = false, url;
    const abort = new AbortController();
    const observer = new IntersectionObserver(async ([entry]) => {
      if (started || !entry.isIntersecting || entry.intersectionRatio < .1) return;
      started = true;
      observer.disconnect();
      try {
        const response = await fetch(src, { signal: abort.signal });
        if (!response.ok) throw new Error('Cannot load Objects animation');
        const result = singlePlayGif(await response.arrayBuffer());
        if (disposed) return;
        url = URL.createObjectURL(result.blob);
        setPlayback({ url, duration: result.duration });
      } catch (error) {
        if (!disposed) { console.error(error); setFinished(true); }
      }
    }, { threshold: [.1] });
    observer.observe(ref.current);
    return () => {
      disposed = true;
      observer.disconnect();
      abort.abort();
      clearTimeout(timer.current);
      if (url) URL.revokeObjectURL(url);
    };
  }, [src]);
  return <div ref={ref} className={className} style={style} aria-hidden="true"
    data-objects-playback={finished ? 'finished' : playback ? 'playing' : 'waiting'}>
    {playback && !finished && <img src={playback.url} alt="" style={{ display: 'block', width: '100%', height: '100%' }}
      onLoad={() => { clearTimeout(timer.current); timer.current = setTimeout(() => setFinished(true), playback.duration); }}
      onError={() => setFinished(true)} />}
  </div>;
}
