import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import './AnimatedDNA.css';

const PAIR_COUNT = 16;

const AnimatedDNA = () => {
  const dnaRef = useRef(null);

  useEffect(() => {
    const pairs = dnaRef.current?.querySelectorAll('.dna-pair');
    if (!pairs) return;

    pairs.forEach((pair, i) => {
      const dotL = pair.querySelector('.helix-dot-l');
      const dotR = pair.querySelector('.helix-dot-r');
      const bar  = pair.querySelector('.helix-bar');

      const offset = i * (360 / PAIR_COUNT);

      // Left dot oscillates x position & scale (simulates 3D depth)
      gsap.to(dotL, {
        x: 55,
        scale: 0.5,
        opacity: 0.4,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.12,
      });

      // Right dot oscillates opposite direction
      gsap.to(dotR, {
        x: -55,
        scale: 0.5,
        opacity: 0.4,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.12,
      });

      // The connecting bar scales with the rotation
      gsap.to(bar, {
        scaleX: 0.1,
        opacity: 0.15,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.12,
      });
    });

    // Slow continuous vertical drift
    gsap.to(dnaRef.current, {
      y: -20,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      gsap.killTweensOf(dnaRef.current);
      pairs.forEach(pair => {
        gsap.killTweensOf(pair.querySelector('.helix-dot-l'));
        gsap.killTweensOf(pair.querySelector('.helix-dot-r'));
        gsap.killTweensOf(pair.querySelector('.helix-bar'));
      });
    };
  }, []);

  return (
    <div className="dna-scene" ref={dnaRef}>
      <div className="dna-helix">
        {Array.from({ length: PAIR_COUNT }).map((_, i) => (
          <div className="dna-pair" key={i}>
            <div className="helix-dot-l" />
            <div className="helix-bar" />
            <div className="helix-dot-r" />
          </div>
        ))}
      </div>

      {/* Glow backdrop */}
      <div className="dna-glow" />
    </div>
  );
};

export default AnimatedDNA;
