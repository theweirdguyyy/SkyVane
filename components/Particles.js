"use client";

import { useEffect, useState } from "react";

export default function Particles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generated = [];
    for (let i = 0; i < 22; i++) {
      const size = Math.random() * 3 + 1;
      generated.push({
        id: i,
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 20 + 18}s`,
        animationDelay: `-${Math.random() * 25}s`,
      });
    }
    setParticles(generated);
  }, []);

  return (
    <div className="particles" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.width,
            height: p.height,
            left: p.left,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
          }}
        />
      ))}
    </div>
  );
}
