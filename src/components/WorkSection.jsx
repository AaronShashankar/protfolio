import React, { useEffect, useRef } from "react";
import { projects } from "../data/projects";

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const lerp = (a, b, t) => a + (b - a) * t;

export default function WorkSection({ scrollRef }) {
  const hsRef = useRef(null);
  const trackRef = useRef(null);
  const hsFillRef = useRef(null);

  // Measure and manage horizontal scroll
  useEffect(() => {
    let animId;
    let hp = 0;

    const updateHorizontalScroll = () => {
      animId = requestAnimationFrame(updateHorizontalScroll);

      const hs = hsRef.current;
      const track = trackRef.current;
      const hsFill = hsFillRef.current;

      if (!hs || !track) return;

      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const hsDist = Math.max(0, track.offsetWidth - vw);

      // Set parent height so user has scroll distance
      hs.style.height = `${hsDist + vh}px`;

      const hr = hs.getBoundingClientRect();
      const p = clamp(-hr.top / Math.max(1, hs.offsetHeight - vh), 0, 1);
      hp = lerp(hp, p, 0.12);

      track.style.transform = `translate3d(${(-hp * hsDist).toFixed(1)}px, 0, 0)`;
      if (hsFill) {
        hsFill.style.transform = `scaleX(${hp.toFixed(4)})`;
      }
    };

    animId = requestAnimationFrame(updateHorizontalScroll);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Card 3D tilt & glare on mouse move
  const handleCardMouseMove = (e) => {
    if (e.pointerType === "touch") return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    card.style.setProperty("--ry", `${((px - 0.5) * 14).toFixed(2)}deg`);
    card.style.setProperty("--rx", `${((0.5 - py) * 14).toFixed(2)}deg`);
    card.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    card.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    card.style.setProperty("--px", (px - 0.5).toFixed(3));
    card.style.setProperty("--py", (py - 0.5).toFixed(3));
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.removeProperty("--rx");
    card.style.removeProperty("--ry");
    card.style.removeProperty("--px");
    card.style.removeProperty("--py");
  };

  // Generate procedural bars for Card 2
  const barsData = Array.from({ length: 18 }, (_, i) => ({
    key: i,
    d: `${(1.1 + (Math.sin(i * 1.7) + 1) * 0.5).toFixed(2)}s`,
    m: (0.45 + (Math.cos(i * 0.9) + 1) * 0.27).toFixed(2),
  }));

  return (
    <section id="work" data-sec className="relative">
      <div ref={hsRef} className="relative">
        <div className="sticky top-0 h-[100svh] overflow-hidden flex items-center">
          <div
            ref={trackRef}
            className="flex items-center gap-[clamp(1rem,3vw,2.5rem)] w-max px-[clamp(1.1rem,4vw,3rem)] will-change-transform"
          >
            {/* Intro Lead Panel */}
            <div className="flex-none w-[min(84vw,27rem)] pr-8">
              <h2 className="font-unbounded font-semibold text-[clamp(2.2rem,5vw,4.2rem)] leading-none tracking-[-0.04em]">
                Selected work
              </h2>
              <p className="mt-5 text-muted text-base md:text-lg max-w-[28ch] leading-relaxed">
                Four full-stack projects, from database schema to deployed
                interface.
              </p>
              <div className="inline-flex items-center gap-3 mt-8 font-medium text-ink">
                <span>Keep scrolling</span>
                <span className="block relative w-12 h-[2px] bg-ink overflow-hidden">
                  <span className="absolute inset-0 bg-pink animate-slide" />
                </span>
              </div>
            </div>

            {/* Project Cards */}
            {projects.map((proj) => (
              <article
                key={proj.id}
                onPointerMove={handleCardMouseMove}
                onPointerLeave={handleCardMouseLeave}
                className="portfolio-card relative flex-none w-[min(82vw,30rem)] h-[min(66svh,35rem)] flex flex-col rounded-[28px] border border-line bg-card backdrop-blur-xl overflow-hidden group shadow-2xl"
              >
                {/* Generative Visual Header */}
                <div className="relative flex-1 min-h-0 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Visual Art 1: Rings */}
                    {proj.artType === "rings" && (
                      <div className="w-full h-full relative bg-[radial-gradient(circle_at_25%_20%,rgba(123,97,255,0.7),transparent_60%),linear-gradient(160deg,#1C1850,#100E2E)]">
                        <div className="rings-art absolute inset-0 grid place-items-center">
                          {[1, 2, 3, 4].map((k) => (
                            <i key={k} style={{ "--k": k }} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Visual Art 2: Dynamic Bars */}
                    {proj.artType === "bars" && (
                      <div className="w-full h-full relative bg-[radial-gradient(circle_at_75%_15%,rgba(255,92,138,0.6),transparent_55%),linear-gradient(200deg,#1C1850,#100E2E)]">
                        <div className="bars-art absolute inset-[16%_9%] flex items-end gap-[2.4%]">
                          {barsData.map((bar) => (
                            <i
                              key={bar.key}
                              style={{
                                "--k": bar.key,
                                "--d": bar.d,
                                "--m": bar.m,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Visual Art 3: Planetary Orbit */}
                    {proj.artType === "orbit" && (
                      <div className="w-full h-full relative bg-[radial-gradient(circle_at_50%_50%,rgba(92,225,230,0.35),transparent_65%),linear-gradient(180deg,#100E2E,#1C1850)]">
                        <div className="absolute inset-0 grid place-items-center [perspective:700px]">
                          <div className="sys-3d">
                            <i style={{ "--s": 1, "--d": 14 }} />
                            <i style={{ "--s": 0.74, "--d": 9 }} />
                            <i style={{ "--s": 0.5, "--d": 6 }} />
                            <i className="core" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Visual Art 4: Isometric Sheets */}
                    {proj.artType === "sheets" && (
                      <div className="w-full h-full relative bg-[radial-gradient(circle_at_20%_80%,rgba(255,200,87,0.45),transparent_55%),linear-gradient(140deg,#1C1850,#100E2E)]">
                        <div className="sheets-3d">
                          {[1, 2, 3, 4].map((k) => (
                            <i key={k} style={{ "--k": k }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full border border-line bg-bg/60 backdrop-blur-md text-ink">
                    {proj.year}
                  </span>
                </div>

                {/* Metadata */}
                <div className="p-6 md:p-7 border-t border-line bg-bg2/40 backdrop-blur-sm">
                  <h3 className="font-unbounded font-semibold text-[clamp(1.3rem,2.4vw,1.7rem)] tracking-tight text-ink group-hover:text-pink transition-colors">
                    {proj.title}
                  </h3>
                  <p className="mt-2 text-muted text-sm md:text-base leading-relaxed">
                    {proj.description}
                  </p>
                  <ul className="flex flex-wrap gap-2 mt-4">
                    {proj.tags.map((tag, i) => (
                      <li
                        key={i}
                        className="text-xs font-medium px-2.5 py-1 border border-line rounded-full text-ink/80 bg-white/5"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Glare effect */}
                <span className="card-glare" />
              </article>
            ))}
          </div>

          {/* Bottom track progress indicator line */}
          <div
            className="absolute left-[clamp(1.1rem,4vw,3rem)] right-[clamp(1.1rem,4vw,3rem)] bottom-[calc(1.8rem+env(safe-area-inset-bottom,0px))] h-[2px] bg-line overflow-hidden"
            aria-hidden="true"
          >
            <i
              ref={hsFillRef}
              className="block h-full bg-ink origin-left scale-x-0 transition-transform duration-75"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
