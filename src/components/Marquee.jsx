import React, { useEffect, useRef } from 'react';

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const lerp = (a, b, t) => a + (b - a) * t;

export default function Marquee({ scrollRef }) {
  const marqueeRef = useRef(null);

  useEffect(() => {
    let animId;
    let skew = 0;

    const updateSkew = () => {
      animId = requestAnimationFrame(updateSkew);
      const vel = scrollRef?.current?.vel || 0;
      skew = lerp(skew, clamp(vel * 0.12, -9, 9), 0.1);
      if (marqueeRef.current) {
        marqueeRef.current.style.transform = `skewY(${(-2 + skew).toFixed(2)}deg)`;
      }
    };
    animId = requestAnimationFrame(updateSkew);

    return () => cancelAnimationFrame(animId);
  }, [scrollRef]);

  const row1Items = ['React', 'Django', 'Python', 'Docker', 'PostgreSQL', 'React Native', 'MERN'];
  const row2Items = ['TanStack Query', 'WebSocket', 'Tailwind CSS', 'REST APIs', 'MongoDB', 'Vite', 'Vitest'];

  return (
    <div
      ref={marqueeRef}
      id="marquee"
      aria-hidden="true"
      className="my-[clamp(3rem,8vh,6rem)] -mx-[4vw] py-[clamp(1.2rem,3vh,2rem)] border-y border-line bg-bg/50 backdrop-blur-md overflow-hidden select-none will-change-transform"
      style={{ transform: 'skewY(-2deg)' }}
    >
      {/* Row 1 - Forward */}
      <div className="flex w-max animate-marquee">
        {[0, 1].map((copyIndex) => (
          <span
            key={copyIndex}
            className="flex items-center gap-[clamp(1.2rem,3vw,2.6rem)] pr-[clamp(1.2rem,3vw,2.6rem)] font-unbounded font-extrabold text-[clamp(2rem,6vw,5rem)] tracking-[-0.03em] whitespace-nowrap"
          >
            {row1Items.map((tech, i) => (
              <React.Fragment key={i}>
                <b className={i % 2 === 1 ? 'text-transparent [-webkit-text-stroke:1.5px_#EEEAFF]' : 'text-ink'}>
                  {tech}
                </b>
                <span className="inline-block w-[0.34em] h-[0.34em] bg-pink rotate-45 flex-none" />
              </React.Fragment>
            ))}
          </span>
        ))}
      </div>

      {/* Row 2 - Reverse */}
      <div className="flex w-max animate-marquee-rev mt-2">
        {[0, 1].map((copyIndex) => (
          <span
            key={copyIndex}
            className="flex items-center gap-[clamp(1.2rem,3vw,2.6rem)] pr-[clamp(1.2rem,3vw,2.6rem)] font-unbounded font-extrabold text-[clamp(2rem,6vw,5rem)] tracking-[-0.03em] whitespace-nowrap"
          >
            {row2Items.map((tech, i) => (
              <React.Fragment key={i}>
                <b className={i % 2 === 1 ? 'text-transparent [-webkit-text-stroke:1.5px_#EEEAFF]' : 'text-ink'}>
                  {tech}
                </b>
                <span className="inline-block w-[0.34em] h-[0.34em] bg-cyan rotate-45 flex-none" />
              </React.Fragment>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
