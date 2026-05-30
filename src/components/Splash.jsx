import { useEffect, useState } from 'react';
import './Splash.css';

const DURATION_MS = 2800;

export default function Splash({ onFinish }) {
  const [phase, setPhase] = useState('in');

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase('out'), DURATION_MS - 600);
    const endTimer = setTimeout(() => onFinish?.(), DURATION_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [onFinish]);

  return (
    <div className={`splash splash--${phase}`} role="presentation" aria-hidden="true">
      <div className="splash__glow" />
      <div className="splash__content">
        <div className="splash__logo-wrap">
          <img
            src="/netflux-logo.png"
            alt=""
            className="splash__logo"
            width={220}
            height={220}
          />
          <span className="splash__bolt" aria-hidden="true" />
        </div>
        <p className="splash__tagline">Stream movies &amp; TV</p>
      </div>
    </div>
  );
}
