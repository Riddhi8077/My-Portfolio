import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import {
  Github,
  Linkedin,
  Code2,
  ArrowDown,
  Download,
  MapPin,
} from "lucide-react";

import { PROFILE } from "../data/portfolio";

function ParticleField() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const count = Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 35000);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.4,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => (mouseRef.current = { x: -9999, y: -9999 });
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      const { x: mx, y: my } = mouseRef.current;

      particles.forEach((p) => {
        // mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          const f = (140 - dist) / 140;
          p.vx += (dx / (dist || 1)) * f * 0.4;
          p.vy += (dy / (dist || 1)) * f * 0.4;
        }
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.offsetWidth;
        if (p.x > canvas.offsetWidth) p.x = 0;
        if (p.y < 0) p.y = canvas.offsetHeight;
        if (p.y > canvas.offsetHeight) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(37, 99, 235, 0.22)";
        ctx.fill();
      });

      // connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            ctx.strokeStyle = `rgba(14, 165, 233, ${(1 - d / 110) * 0.12})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      setTimeout(() => {
  raf = requestAnimationFrame(draw);
}, 16);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      data-testid="hero-particles"
    />
  );
}

function Typewriter({ words, speed = 90, pause = 1300 }) {
  const [idx, setIdx] = useState(0);
  const [sub, setSub] = useState("");
  const [del, setDel] = useState(false);

  useEffect(() => {
    const current = words[idx];
    let t;
    if (!del && sub === current) {
      t = setTimeout(() => setDel(true), pause);
    } else if (del && sub === "") {
      setDel(false);
      setIdx((i) => (i + 1) % words.length);
    } else {
      t = setTimeout(
        () => {
          setSub((s) =>
            del ? current.substring(0, s.length - 1) : current.substring(0, s.length + 1)
          );
        },
        del ? speed / 2 : speed
      );
    }
    return () => clearTimeout(t);
  }, [sub, del, idx, words, speed, pause]);

  return (
    <span data-testid="hero-typewriter" className="text-[var(--color-accent)]">
      {sub}
      <span className="cursor-blink text-[var(--color-accent-2)]">|</span>
    </span>
  );
}

export default function Hero() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative min-h-screen flex items-center overflow-hidden section-shell"
    >
      <div className="absolute inset-0 grid-bg opacity-35" />
      <div className="absolute inset-0 radial-spotlight" />
      <ParticleField />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-32 w-full">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-2 section-eyebrow mb-6"
        >
          <span className="w-8 h-px bg-[var(--color-accent)]" />
          <MapPin className="w-3 h-3" />
          {PROFILE.location} · Available for work
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-black tracking-tight text-4xl sm:text-6xl lg:text-7xl leading-[1.02] text-[var(--color-text)]"
        >
          <span className="block">Riddhi</span>
          <span className="block">
            <span className="text-[var(--color-accent)]">
              Pachehara
            </span>
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-6 font-mono-tech text-base sm:text-xl text-[var(--color-text-secondary)] h-7"
        >
          <span className="text-[var(--color-text-secondary)]">{`> I am a `}</span>
          <Typewriter words={PROFILE.titles} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 max-w-2xl text-base sm:text-lg body-copy"
        >
          {PROFILE.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <button
            data-testid="hero-explore-btn"
            onClick={() => scrollTo("projects")}
            className="btn-primary group px-6 py-3 font-mono-tech text-xs sm:text-sm tracking-widest uppercase"
          >
            Explore My Work
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>

          <a
            href={PROFILE.resumePath}
            download
            data-testid="hero-resume-btn"
            className="btn-secondary px-5 py-3 font-mono-tech text-xs sm:text-sm tracking-widest uppercase"
          >
            <Download className="w-4 h-4" />
            Resume
          </a>

          <div className="flex items-center gap-2 pl-1">
            <a
              data-testid="hero-github-link"
              href={PROFILE.socials.github}
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-[12px] grid place-items-center border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:text-[var(--color-accent-hover)] hover:border-[var(--color-accent)] transition-all duration-200 hover:-translate-y-0.5"
              aria-label="github"
            >
<Github className="w-4 h-4" />
            </a>
            <a
              data-testid="hero-linkedin-link"
              href={PROFILE.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-[12px] grid place-items-center border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:text-[var(--color-accent-hover)] hover:border-[var(--color-accent)] transition-all duration-200 hover:-translate-y-0.5"
              aria-label="linkedin"
            >
<Linkedin className="w-4 h-4" />
            </a>
            <a
              data-testid="hero-leetcode-link"
              href={PROFILE.socials.leetcode}
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-[12px] grid place-items-center border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:text-[var(--color-accent-hover)] hover:border-[var(--color-accent)] transition-all duration-200 hover:-translate-y-0.5"
              aria-label="LeetCode"
            >
              <Code2 className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>

      <motion.button
        onClick={() => scrollTo("experience")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ delay: 1, duration: 1.6, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-hover)] transition-colors"
        data-testid="hero-scroll-indicator"
        aria-label="Scroll down"
      >
        <ArrowDown className="w-4 h-4" />
      </motion.button>
    </section>
  );
}
