import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Briefcase, GraduationCap, ArrowUpRight, Code2, Layers, Cpu, Wrench } from 'lucide-react';
import myPhoto from '../assets/myImage.jpeg';
import { skillCategories } from '../data/skills';

const statementText =
  "I'm Aaron Shasankar Bishwakarma, a passionate Software Engineer at Top Tech Giants and a Bachelor of Computer Application (BCA) student based in Lalitpur, Nepal. I build high-performance web and mobile applications across React, Django, Node.js, and modern cloud stacks—from schema design and REST/WebSocket APIs to polished, responsive user interfaces.";

const categoryIcons = {
  'Frontend & Mobile': Code2,
  'Backend & Databases': Layers,
  'DevOps & Testing': Wrench,
  'Foundational Knowledge': Cpu,
};

export default function AboutSection() {
  const statementRef = useRef(null);
  const photoCardRef = useRef(null);
  const words = statementText.trim().split(/\s+/);
  const [wordOpacities, setWordOpacities] = useState(() => Array(words.length).fill(0.14));

  // Word-by-word scroll reveal
  useEffect(() => {
    const handleScroll = () => {
      const el = statementRef.current;
      if (!el) return;
      const sr = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const sp = Math.min(Math.max((vh * 0.85 - sr.top) / (vh * 0.4 + sr.height), 0), 1);
      const n = words.length;

      const newOpacities = words.map((_, i) => {
        const f = Math.min(Math.max(sp * (n + 5) - i, 0), 1);
        return 0.14 + 0.86 * f;
      });
      setWordOpacities(newOpacities);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [words.length]);

  // Photo 3D tilt effect on hover
  const handlePhotoMouseMove = (e) => {
    if (e.pointerType === 'touch' || !photoCardRef.current) return;
    const card = photoCardRef.current;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    card.style.transform = `perspective(1000px) rotateX(${((0.5 - py) * 12).toFixed(2)}deg) rotateY(${((px - 0.5) * 12).toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handlePhotoMouseLeave = () => {
    if (!photoCardRef.current) return;
    photoCardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <section
      id="about"
      data-sec
      className="pt-[clamp(6rem,16vh,12rem)] pb-[clamp(5rem,14vh,10rem)] px-[clamp(1.1rem,4vw,3rem)] max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Portrait Showcase Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div
            ref={photoCardRef}
            onPointerMove={handlePhotoMouseMove}
            onPointerLeave={handlePhotoMouseLeave}
            className="relative w-full max-w-[380px] rounded-3xl p-3 border border-line bg-card backdrop-blur-2xl transition-transform duration-300 ease-out shadow-2xl group"
          >
            {/* Ambient Back Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink via-violet to-cyan rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 -z-10" />

            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-bg2">
              <img
                src={myPhoto}
                alt="Aaron Shasankar Bishwakarma"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient overlay at bottom of photo for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent pointer-events-none" />

              {/* Badges on image */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
                <span className="font-unbounded font-bold text-base text-ink tracking-tight">
                  Aaron Shasankar Bishwakarma
                </span>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <MapPin className="w-3.5 h-3.5 text-pink flex-shrink-0" />
                  <span>Lalitpur, Nepal</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Pill List */}
            <div className="mt-4 px-2 py-1 flex flex-col gap-2.5 text-xs text-ink">
              <a
                href="https://www.toptechgiants.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl border border-line/60 bg-white/5 hover:bg-cyan/10 hover:border-cyan/40 transition-colors group/item"
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-cyan" />
                  <span className="font-medium">Software Engineer @ Top Tech Giants</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover/item:text-cyan transition-colors" />
              </a>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-line/60 bg-white/5">
                <GraduationCap className="w-4 h-4 text-yellow" />
                <span className="font-medium">BCA Student (2023 – Current)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Statement, Counters & Story */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-pink border border-pink/30 bg-pink/10 w-fit mb-6">
            <span>About Me</span>
          </div>

          <p
            ref={statementRef}
            className="font-unbounded font-semibold text-[clamp(1.3rem,2.8vw,2.4rem)] leading-[1.3] tracking-[-0.025em] text-ink"
          >
            {words.map((w, i) => (
              <span
                key={i}
                className="inline-block mr-[0.26em] transition-opacity duration-150"
                style={{ opacity: wordOpacities[i] }}
              >
                {w}
              </span>
            ))}
          </p>

          {/* Stats Counter Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 pt-8 border-t border-line">
            <StatCounter
              target={30}
              suffix="+"
              label="Modern technologies & tools"
            />
            <StatCounter
              target={4}
              suffix="+"
              label="Full-stack production builds"
            />
            <StatCounter
              target={100}
              suffix="%"
              label="Dedication to clean code & speed"
            />
          </div>
        </div>
      </div>

      {/* Complete Skills & Tech Stack Matrix */}
      <div className="mt-20 pt-12 border-t border-line">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h3 className="font-unbounded font-bold text-2xl md:text-3xl text-ink tracking-tight">
              Comprehensive Tech Stack
            </h3>
            <p className="mt-2 text-muted text-sm md:text-base">
              Languages, libraries, frameworks and infrastructure I utilize daily.
            </p>
          </div>
          <span className="text-xs font-medium px-3 py-1.5 rounded-full border border-line bg-card text-muted w-fit">
            Verified Stack
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((group) => {
            const Icon = categoryIcons[group.category] || Code2;
            return (
              <div
                key={group.category}
                className="p-6 rounded-2xl border border-line bg-card backdrop-blur-md hover:border-pink/40 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-pink/10 border border-pink/20 text-pink">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-unbounded font-semibold text-lg text-ink">
                    {group.category}
                  </h4>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs md:text-sm font-medium px-3 py-1.5 rounded-full border border-line bg-white/5 text-ink hover:text-cyan hover:border-cyan/40 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatCounter({ target, label, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const duration = 1700;

          const tick = (now) => {
            const p = Math.min(Math.max((now - startTime) / duration, 0), 1);
            const eased = Math.round(target * (1 - Math.pow(1 - p, 4)));
            setCount(eased);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref}>
      <strong className="block font-unbounded font-extrabold text-[clamp(2.2rem,5vw,3.8rem)] tracking-[-0.05em] leading-none text-ink">
        {count}
        {suffix && <sup className="text-[0.4em] align-top ml-1 text-pink">{suffix}</sup>}
      </strong>
      <span className="block mt-2.5 text-muted text-xs md:text-sm max-w-[20ch] leading-snug">
        {label}
      </span>
    </div>
  );
}
