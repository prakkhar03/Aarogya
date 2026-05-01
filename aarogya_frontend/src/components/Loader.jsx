import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import './Loader.css';

const Loader = ({ onComplete }) => {
  const overlayRef = useRef(null);
  const boxRef     = useRef(null);
  const textRef    = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out the whole overlay, then signal completion
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: onComplete,
        });
      },
    });

    // Rotate the logo box
    tl.fromTo(
      boxRef.current,
      { rotate: 0, scale: 0.6, borderRadius: '20%', opacity: 0 },
      { rotate: 180, scale: 1, borderRadius: '50%', opacity: 1, duration: 1, ease: 'power3.inOut' }
    )
    .fromTo(
      boxRef.current,
      { borderRadius: '50%' },
      { borderRadius: '20%', rotate: 360, duration: 0.8, ease: 'power3.inOut' }
    )
    // Fade in text
    .fromTo(
      textRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.4'
    );
  }, [onComplete]);

  return (
    <div className="loader-overlay" ref={overlayRef}>
      <div className="loader-container">
        <div className="loader-logo-box" ref={boxRef}>
          <div className="loader-inner-circle" />
        </div>
        <h2 className="loader-text" ref={textRef}>Aarogya AI</h2>
      </div>
    </div>
  );
};

export default Loader;
