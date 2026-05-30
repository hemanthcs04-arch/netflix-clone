import { useEffect, useRef } from 'react';
import { youtubeEmbedUrl } from '../api/youtube';

/** Single YouTube embed — stops playback when videoId changes or component unmounts */
export default function YoutubePlayer({ videoId, title }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    return () => {
      const iframe = iframeRef.current;
      if (iframe) {
        iframe.src = 'about:blank';
      }
    };
  }, []);

  if (!videoId) return null;

  return (
    <iframe
      ref={iframeRef}
      key={videoId}
      title={title}
      src={youtubeEmbedUrl(videoId)}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
