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
        ctx.fillStyle = "rgba(0, 240, 255, 0.65)";
        ctx.fill();
      });

      // connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - d / 110) * 0.18})`;
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
    <span data-testid="hero-typewriter" className="text-neon-cyan neon-text-glow">
      {sub}
      <span className="cursor-blink text-neon-emerald">|</span>
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
      className="relative min-h-screen flex items-center overflow-hidden bg-obsidian"
    >
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 radial-spotlight" />
      <ParticleField />

      {/* glow orbs */}
      <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-neon-cyan/10 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full bg-neon-emerald/10 blur-[140px]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-32 w-full">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-2 text-xs font-mono-tech tracking-[0.3em] uppercase text-neon-emerald/90 mb-6"
        >
          <span className="w-8 h-px bg-neon-emerald" />
          <MapPin className="w-3 h-3" />
          {PROFILE.location} · Available for work
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-black tracking-tight text-4xl sm:text-6xl lg:text-7xl leading-[1.02] text-white"
        >
          <span className="block neon-text-glow">Riddhi</span>
          <span className="block">
            <span className="bg-gradient-to-r from-[#00F0FF] to-[#00FF66] bg-clip-text text-transparent">
              Pachehara
            </span>
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-6 font-mono-tech text-base sm:text-xl text-white/80 h-7"
        >
          <span className="text-white/50">{`> I am a `}</span>
          <Typewriter words={PROFILE.titles} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-[#94A3B8]"
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
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono-tech text-xs sm:text-sm tracking-widest uppercase text-[#0B0F19] bg-gradient-to-r from-[#00F0FF] to-[#00FF66] hover:scale-[1.04] transition-all shadow-[0_0_32px_rgba(0,240,255,0.4)] hover:shadow-[0_0_44px_rgba(0,255,102,0.5)]"
          >
            Explore My Work
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>

          <a
            href={PROFILE.resumePath}
            download
            data-testid="hero-resume-btn"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-mono-tech text-xs sm:text-sm tracking-widest uppercase text-white/90 border border-white/15 hover:border-neon-cyan/50 hover:text-neon-cyan transition-all"
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
              className="w-11 h-11 rounded-full grid place-items-center border border-white/10 text-white/70 hover:text-neon-cyan hover:border-neon-cyan/40 transition-all hover:scale-110"
              aria-label="github"
            >
<Github className="w-4 h-4" />
            </a>
            <a
              data-testid="hero-linkedin-link"
              href={PROFILE.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-full grid place-items-center border border-white/10 text-white/70 hover:text-neon-cyan hover:border-neon-cyan/40 transition-all hover:scale-110"
              aria-label="linkedin"
            >
<Linkedin className="w-4 h-4" />
            </a>
            <a
              data-testid="hero-leetcode-link"
              href={PROFILE.socials.leetcode}
              target="_blank"
              rel="noreferrer"
              className="w-11 h-11 rounded-full grid place-items-center border border-white/10 text-white/70 hover:text-neon-emerald hover:border-neon-emerald/50 transition-all hover:scale-110"
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
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 hover:text-neon-cyan"
        data-testid="hero-scroll-indicator"
        aria-label="Scroll down"
      >
        <ArrowDown className="w-4 h-4" />
      </motion.button>
    </section>
  );
}