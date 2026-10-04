import React, { useEffect, useRef } from "react";
import { MapPin, Briefcase, GraduationCap, Github } from "lucide-react";

export default function Hero() {
  const line1 = "Aaron";
  const line2 = "Shasankar";
  const btnWorkRef = useRef(null);
  const btnContactRef = useRef(null);

  // Magnetic button effect
  useEffect(() => {
    const attachMagnetic = (el) => {
      if (!el) return;
      const handleMove = (e) => {
        if (e.pointerType === "touch") return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate(${x * 0.22}px, ${y * 0.32}px)`;
      };
      const handleLeave = () => {
        el.style.transform = "";
      };
      el.addEventListener("pointermove", handleMove);
      el.addEventListener("pointerleave", handleLeave);
      return () => {
        el.removeEventListener("pointermove", handleMove);
        el.removeEventListener("pointerleave", handleLeave);
      };
    };

    const cleanup1 = attachMagnetic(btnWorkRef.current);
    const cleanup2 = attachMagnetic(btnContactRef.current);

    return () => {
      cleanup1 && cleanup1();
      cleanup2 && cleanup2();
    };
  }, []);

  return (
    <section
      id="top"
      data-sec
      className="relative min-h-[100svh] flex flex-col justify-end gap-[clamp(1.5rem,4vh,3rem)] pt-28 pb-[clamp(2rem,6vh,4rem)] px-[clamp(1.1rem,4vw,3rem)]"
    >
      {/* Top Meta Pills */}
      <div className="flex flex-wrap items-center gap-2.5 mb-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-line bg-card text-ink backdrop-blur-md">
          <MapPin className="w-3.5 h-3.5 text-pink" />
          <span>Lalitpur, Nepal</span>
        </span>
        <a
          href="https://www.toptechgiants.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-line bg-card text-ink hover:text-cyan backdrop-blur-md transition-colors"
        >
          <Briefcase className="w-3.5 h-3.5 text-cyan" />
          <span>Top Tech Giants</span>
        </a>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-line bg-card text-ink backdrop-blur-md">
          <GraduationCap className="w-3.5 h-3.5 text-yellow" />
          <span>BCA (2023–Current)</span>
        </span>
      </div>

      {/* Main Big Name with 3D Character Reveal */}
      <h1
        className="w-full min-w-0 font-unbounded font-extrabold text-[clamp(1.75rem,min(9vw,16svh),9rem)] leading-[1.02] tracking-[-0.045em] [perspective:900px] select-none"
        aria-label="Aaron Shasankar Bishwakarma"
      >
        <span className="block whitespace-nowrap overflow-hidden pb-[0.1em]">
          {line1.split("").map((char, i) => (
            <span
              key={i}
              className="ch-anim"
              style={{ "--i": i }}
              aria-hidden="true"
            >
              {char}
            </span>
          ))}
        </span>
        <span className="block whitespace-nowrap overflow-hidden pb-[0.1em] pl-[clamp(0.75rem,4vw,3.5rem)]">
          {line2.split("").map((char, i) => (
            <span
              key={i}
              className="ch-anim"
              style={{ "--i": i + line1.length }}
              aria-hidden="true"
            >
              {char}
            </span>
          ))}
        </span>
      </h1>

      <div className="flex justify-between items-end gap-8 flex-wrap">
        <div className="max-w-[36rem]">
          <p className="text-[clamp(1.1rem,2vw,1.35rem)] leading-[1.45] text-ink font-normal">
            Software engineer building fast web apps, beautiful reactive
            interfaces, and robust backend architectures.{" "}
            <span className="text-muted">
              Working at Top Tech Giants while pursuing BCA. Drag the 3D shape,
              scroll through projects, or explore below.
            </span>
          </p>

          <div className="flex gap-3.5 items-center flex-wrap mt-6">
            <a
              ref={btnWorkRef}
              href="#work"
              data-magnetic
              className="btn-magnetic solid"
            >
              See selected work
            </a>
            <a
              ref={btnContactRef}
              href="#contact"
              data-magnetic
              className="btn-magnetic"
            >
              Get in touch
            </a>
            <a
              href="https://github.com/AaronShashankar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-full border border-line bg-card hover:bg-white/10 text-ink text-sm font-semibold transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Scroll Cue indicator */}
        <div
          className="hidden sm:flex flex-col items-center gap-2.5 text-muted text-xs tracking-wider uppercase"
          aria-hidden="true"
        >
          <div className="w-[1px] h-14 bg-gradient-to-b from-ink via-ink/60 to-transparent relative overflow-hidden">
            <div className="w-full h-full bg-pink animate-pulse" />
          </div>
          <span>Scroll</span>
        </div>
      </div>
    </section>
  );
}
