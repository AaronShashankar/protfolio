import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy, MapPin, Briefcase, Github, Mail } from 'lucide-react';

export default function ContactSection() {
  const email = "aaronshasankar@gmail.com";
  const mailRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // Magnetic effect for email
  useEffect(() => {
    const el = mailRef.current;
    if (!el) return;

    const handleMove = (e) => {
      if (e.pointerType === 'touch') return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
    };

    const handleLeave = () => {
      el.style.transform = '';
    };

    el.addEventListener('pointermove', handleMove);
    el.addEventListener('pointerleave', handleLeave);

    return () => {
      el.removeEventListener('pointermove', handleMove);
      el.removeEventListener('pointerleave', handleLeave);
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="contact"
      data-sec
      className="min-h-[100svh] flex flex-col justify-between gap-12 pt-[clamp(6rem,16vh,10rem)] pb-[calc(2rem+env(safe-area-inset-bottom,0px))] px-[clamp(1.1rem,4vw,3rem)]"
    >
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-cyan border border-cyan/30 bg-cyan/10">
            <Mail className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-line bg-card text-muted">
            <MapPin className="w-3 h-3 text-pink" />
            <span>Lalitpur, Nepal</span>
          </span>
        </div>

        <h2 className="font-unbounded font-extrabold text-[clamp(2.6rem,9.5vw,9rem)] leading-[0.96] tracking-[-0.045em] max-w-[10em]">
          Let's build something fast.
        </h2>

        <div className="flex items-center gap-4 flex-wrap mt-8">
          <a
            ref={mailRef}
            id="mail"
            href={`mailto:${email}`}
            data-magnetic
            className="mail-hover inline-flex flex-wrap font-unbounded font-semibold text-[clamp(1.1rem,3vw,2.4rem)] tracking-[-0.03em] border-b-2 border-pink pb-1 break-all group transition-transform"
            aria-label={email}
          >
            {email.split('').map((char, i) => (
              <span
                key={i}
                className="mail-letter"
                style={{ '--i': i }}
                aria-hidden="true"
              >
                {char}
              </span>
            ))}
          </a>

          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 text-xs md:text-sm px-4 py-2 rounded-full border border-line bg-card hover:bg-white/10 text-muted hover:text-ink transition-colors cursor-pointer"
            title="Copy email to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-cyan" />
                <span className="text-cyan font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Email</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end gap-6 flex-wrap text-muted text-sm md:text-base border-t border-line/60 pt-6">
        <div className="flex items-center gap-6 text-ink font-medium">
          <a
            href="https://github.com/AaronShashankar"
            target="_blank"
            rel="noopener noreferrer"
            className="relative py-1 group flex items-center gap-1.5 hover:text-pink transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan origin-right scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-hover:origin-left" />
          </a>
          <a
            href="https://www.toptechgiants.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative py-1 group flex items-center gap-1.5 hover:text-pink transition-colors"
          >
            <Briefcase className="w-4 h-4 text-cyan" />
            <span>Top Tech Giants</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan origin-right scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-hover:origin-left" />
          </a>
          <a
            href="#top"
            className="relative py-1 group flex items-center gap-1 hover:text-pink transition-colors"
          >
            <span>Back to Top ↑</span>
          </a>
        </div>

        <p className="text-xs md:text-sm text-muted">
          Aaron Shasankar Bishwakarma. BCA (2023–Current) · Lalitpur, Nepal. © {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}
