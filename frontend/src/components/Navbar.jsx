
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { PROFILE } from "../data/portfolio";

const LINKS = [
  { label: "Home", id: "hero" },
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Skills", id: "skills" },
  { label: "LeetCode", id: "leetcode" },
  { label: "Education", id: "education" },
  { label: "Contact", id: "contact" },
];

export default function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
      setScrollProgress(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Reading progress bar */}
      <div
        data-testid="reading-progress-bar"
        className="reading-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      <motion.header
        data-testid="navbar"
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-50 bg-white border-b border-[var(--color-border)]"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <button
            data-testid="nav-logo"
            onClick={() => scrollTo("hero")}
            className="font-display font-black tracking-tight text-[var(--color-text)] text-base sm:text-lg group flex items-center gap-2"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-accent)]" />
            <span className="group-hover:text-[var(--color-accent)] transition-colors duration-200">
              {PROFILE.shortName}
              <span className="text-[var(--color-accent)]">.</span>dev
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-7">
            {LINKS.map((l) => (
              <button
                key={l.id}
                data-testid={`nav-link-${l.id}`}
                onClick={() => scrollTo(l.id)}
                className="text-[12px] font-mono-tech tracking-[0.16em] uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-accent-hover)] transition-colors duration-200"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              data-testid="nav-resume-btn"
              href={PROFILE.resumePath}
              download
              className="btn-primary hidden sm:inline-flex px-4 py-2 text-[12px] font-mono-tech tracking-widest uppercase"
            >
              <Download className="w-3.5 h-3.5" />
              Resume
            </a>
            <button
              data-testid="nav-menu-toggle"
              onClick={() => setOpen((s) => !s)}
              className="lg:hidden text-[var(--color-text-secondary)] hover:text-[var(--color-accent-hover)] transition-colors duration-200 p-2"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-[var(--color-border)] bg-white"
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {LINKS.map((l) => (
                <button
                  key={l.id}
                  data-testid={`mobile-nav-link-${l.id}`}
                  onClick={() => scrollTo(l.id)}
                  className="text-left py-3 text-sm font-mono-tech tracking-widest uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-accent-hover)] border-b border-[var(--color-border)] transition-colors duration-200"
                >
                  {l.label}
                </button>
              ))}
              <a
                href={PROFILE.resumePath}
                download
                data-testid="mobile-nav-resume-btn"
                className="btn-primary mt-3 px-4 py-3 text-xs font-mono-tech tracking-widest uppercase"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </motion.header>
    </>
  );
}
