import React, { useEffect, useRef } from "react";
import { skills } from "../data/skills";

export default function SkillsRing({ scrollRef }) {
  const ringRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    let animId;
    let radius = 320;

    const measureRing = () => {
      if (itemsRef.current.length > 0) {
        const widths = itemsRef.current.map((el) => el?.offsetWidth || 140);
        const maxW = Math.max(...widths);
        radius = Math.max(
          200,
          (maxW + 28) / 2 / Math.tan(Math.PI / skills.length),
        );
      }
    };

    measureRing();
    window.addEventListener("resize", measureRing);

    let startTime = performance.now();

    const updateRing = (now) => {
      animId = requestAnimationFrame(updateRing);
      const t = (now - startTime) / 1000;
      const y = scrollRef?.current?.smoothY ?? window.scrollY;

      const base = t * 9 + y * 0.12;

      itemsRef.current.forEach((el, i) => {
        if (!el) return;
        const angle = base + (i * 360) / skills.length;
        const rad = (angle * Math.PI) / 180;
        const c = Math.cos(rad);

        el.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`;
        el.style.opacity = (0.1 + 0.9 * ((c + 1) / 2)).toFixed(3);
      });
    };

    animId = requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener("resize", measureRing);
      cancelAnimationFrame(animId);
    };
  }, [scrollRef]);

  return (
    <section
      id="skills"
      data-sec
      className="min-h-[110svh] flex flex-col items-center justify-center text-center py-24 px-[clamp(1.1rem,4vw,3rem)]"
    >
      <h2 className="font-unbounded font-semibold text-[clamp(2rem,5vw,4rem)] tracking-[-0.04em] leading-none">
        Tools of the trade
      </h2>
      <p className="mt-4 text-muted text-base md:text-lg">
        The ring turns as you scroll.
      </p>

      {/* 3D Stage */}
      <div className="skills-stage">
        <div ref={ringRef} className="skills-ring">
          {skills.map((skill, i) => (
            <div
              key={skill}
              ref={(el) => (itemsRef.current[i] = el)}
              className="skill-pill cursor-default hover:border-pink transition-colors"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
