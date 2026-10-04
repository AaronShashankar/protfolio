import React, { useEffect, useRef, useState } from 'react';
import Background3D from './components/Background3D';
import CursorProgress from './components/CursorProgress';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import WorkSection from './components/WorkSection';
import AboutSection from './components/AboutSection';
import SkillsRing from './components/SkillsRing';
import ContactSection from './components/ContactSection';

const lerp = (a, b, t) => a + (b - a) * t;

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved) return saved;
    return 'dark';
  });

  const pointerRef = useRef({
    mx: 0,
    my: 0,
    mxs: 0,
    mys: 0,
    cx: -100,
    cy: -100,
    cxs: -100,
    cys: -100,
  });

  const scrollRef = useRef({
    scrollY: 0,
    smoothY: 0,
    vel: 0,
    lastY: 0,
  });

  // Apply theme to HTML root element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    }
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    // Add loaded class for initial animations
    const timer = setTimeout(() => {
      document.body.classList.add('loaded');
    }, 100);

    let animId;
    let lastY = window.scrollY;

    const scrollLoop = () => {
      animId = requestAnimationFrame(scrollLoop);
      const y = window.scrollY;
      const vel = y - lastY;
      lastY = y;

      if (scrollRef.current) {
        scrollRef.current.scrollY = y;
        scrollRef.current.vel = vel;
        scrollRef.current.smoothY = lerp(scrollRef.current.smoothY, y, 0.085);
      }
    };
    animId = requestAnimationFrame(scrollLoop);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-bg text-ink selection:bg-pink selection:text-white transition-colors duration-400">
      {/* 3D WebGL background */}
      <Background3D pointerRef={pointerRef} scrollRef={scrollRef} theme={theme} />

      {/* Custom Follower Cursor and Progress Bar */}
      <CursorProgress pointerRef={pointerRef} />

      {/* Fixed Navigation Header with Theme Toggle */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero />
        <Marquee scrollRef={scrollRef} />
        <WorkSection scrollRef={scrollRef} />
        <AboutSection />
        <SkillsRing scrollRef={scrollRef} />
        <ContactSection />
      </main>
    </div>
  );
}
