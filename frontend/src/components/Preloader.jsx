
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TARGET = "RIDDHI PACHEHARA";
const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*!?/<>{}[]";

function randChar() {
  return POOL[Math.floor(Math.random() * POOL.length)];
}

export default function Preloader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [display, setDisplay] = useState(
    TARGET.split("").map(() => randChar()).join("")
  );
  const [hide, setHide] = useState(false);

  useEffect(() => {
    let p = 0;
    const totalDuration = 2200;
    const tick = 60;
    const steps = totalDuration / tick;
    const inc = 100 / steps;

    const interval = setInterval(() => {
      p = Math.min(100, p + inc);
      setProgress(p);

      // settle characters from left → right based on progress
      const settled = Math.floor((p / 100) * TARGET.length);
      const next = TARGET.split("")
        .map((ch, i) => (i < settled ? ch : ch === " " ? " " : randChar()))
        .join("");
      setDisplay(next);

      if (p >= 100) {
        clearInterval(interval);
        setDisplay(TARGET);
        setTimeout(() => setHide(true), 450);
        setTimeout(() => onDone && onDone(), 1100);
      }
    }, tick);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!hide && (
        <motion.div
          data-testid="preloader"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-obsidian grid-bg overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        >
          {/* radial wash */}
          <div className="absolute inset-0 radial-spotlight pointer-events-none" />

          {/* split panels on exit */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-[#0B0F19] z-[2]"
            initial={{ x: 0 }}
            animate={hide ? { x: "-100%" } : { x: 0 }}
            transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-[#0B0F19] z-[2]"
            initial={{ x: 0 }}
            animate={hide ? { x: "100%" } : { x: 0 }}
            transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
          />

          <div className="relative z-[3] w-full max-w-2xl px-6 text-center">
            <div className="font-mono-tech text-[10px] sm:text-xs tracking-[0.35em] text-neon-emerald/80 mb-6">
              [ INITIALIZING_PORTFOLIO.SYS ]
            </div>

            <div
              data-testid="preloader-name"
              className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-tight text-white neon-text-glow"
            >
              {display.split("").map((c, i) => (
                <span
                  key={i}
                  className={
                    i < Math.floor((progress / 100) * TARGET.length)
                      ? "text-white"
                      : "text-neon-emerald"
                  }
                >
                  {c === " " ? " " : c}
                </span>
              ))}
            </div>

            <div className="mt-10 mx-auto max-w-md">
              <div className="flex justify-between text-[10px] font-mono-tech tracking-widest text-neon-cyan/80 mb-2">
                <span>COMPILING…</span>
                <span data-testid="preloader-progress">
                  {Math.floor(progress)}%
                </span>
              </div>
              <div className="h-[3px] w-full bg-white/5 overflow-hidden rounded-full">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#00F0FF] to-[#00FF66]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-3 text-[10px] font-mono-tech text-white/30 tracking-widest">
                LOADING REACT MODULES 
              </div>
              
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}