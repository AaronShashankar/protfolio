import React, { useEffect, useState } from 'react';
import { Sun, Moon, ArrowUpRight } from 'lucide-react';

export default function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-30 flex items-center justify-between gap-4 px-[clamp(1.1rem,4vw,3rem)] py-4 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-md bg-bg/75 border-b border-line shadow-sm' : 'bg-transparent'
      }`}
    >
      <a
        href="#top"
        className="font-unbounded font-semibold text-sm tracking-tight text-ink hover:text-pink transition-colors flex items-center gap-2"
        aria-label="Aaron Shasankar, back to top"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-pink inline-block animate-pulse" />
        <span>Aaron Shasankar</span>
      </a>

      <nav aria-label="Primary" className="hidden md:block">
        <ul className="flex items-center gap-[clamp(1rem,3vw,2.2rem)] font-medium text-sm md:text-[0.95rem] text-ink">
          <li>
            <a
              href="#work"
              className="relative py-1 group hover:text-pink transition-colors"
            >
              Work
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink origin-right scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-hover:origin-left" />
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="relative py-1 group hover:text-pink transition-colors"
            >
              About
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink origin-right scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-hover:origin-left" />
            </a>
          </li>
          <li>
            <a
              href="#skills"
              className="relative py-1 group hover:text-pink transition-colors"
            >
              Skills
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink origin-right scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-hover:origin-left" />
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="relative py-1 group hover:text-pink transition-colors"
            >
              Contact
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink origin-right scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-hover:origin-left" />
            </a>
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-3">
        {/* Company & Role Badge */}
        <a
          href="https://www.toptechgiants.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-2 text-xs md:text-sm text-muted border border-line rounded-full px-3.5 py-1.5 bg-card backdrop-blur-md hover:border-cyan/50 hover:text-ink transition-colors group"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan shadow-[0_0_8px_#5CE1E6]" />
          </span>
          <span>Top Tech Giants</span>
          <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
        </a>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 rounded-full border border-line bg-card hover:bg-white/10 text-ink backdrop-blur-md transition-all duration-300 cursor-pointer active:scale-95 hover:rotate-12"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-yellow" />
          ) : (
            <Moon className="w-4 h-4 text-violet" />
          )}
        </button>
      </div>
    </header>
  );
}
