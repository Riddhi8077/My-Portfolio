
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Briefcase } from "lucide-react";
import { EXPERIENCES } from "../data/portfolio";

function TimelineItem({ item, index }) {
  const ref = useRef(null);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-12 sm:pl-16 pb-14 last:pb-0"
      data-testid={`experience-item-${index}`}
    >
      {/* node */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ delay: 0.1 + index * 0.08, duration: 0.5 }}
        className="absolute left-2 sm:left-4 top-2 w-4 h-4 rounded-full bg-white border-2 border-[var(--color-accent)] flex items-center justify-center shadow-sm"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-2)]" />
      </motion.div>

      <div className="glass-card glass-card-hover rounded-[12px] p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <Briefcase className="w-4 h-4 text-[var(--color-accent)]" />
          <h3 className="font-display text-lg sm:text-xl font-bold text-[var(--color-text)]">
            {item.company}
          </h3>
          <span className="tag text-[10px] font-mono-tech tracking-widest uppercase px-2 py-1">
            {item.period}
          </span>
        </div>
        <p className="text-sm font-mono-tech tracking-wide text-[var(--color-accent)] mb-4">
          {item.role}
        </p>
        <ul className="space-y-2.5">
          {item.bullets.map((b, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm sm:text-base body-copy"
            >
              <span className="mt-2 w-1 h-1 rounded-full bg-[var(--color-accent)] shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          {item.stack.map((s) => (
            <span
              key={s}
              className="tag text-[10px] font-mono-tech tracking-widest uppercase px-2.5 py-1"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 60%", "end 30%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="experience"
      data-testid="experience-section"
      className="relative py-24 sm:py-32 section-shell overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <div className="section-eyebrow mb-3">
          </div>
          <h2 className="font-display text-3xl sm:text-5xl section-title">
            Work{" "}
            <span className="highlight-text">
              Experience
            </span>
          </h2>
          <p className="mt-3 body-copy max-w-xl">
            Real production roles where I shipped APIs, built dashboards, and led full-stack
            delivery.
          </p>
        </motion.div>

        <div ref={containerRef} className="relative">
          {/* base line */}
          <div className="absolute left-3.5 sm:left-[22px] top-0 bottom-0 w-px bg-[var(--color-border)]" />
          {/* progress line */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-3.5 sm:left-[22px] top-0 w-px bg-[var(--color-accent)]"
          />
          {EXPERIENCES.map((e, i) => (
            <TimelineItem key={e.id} item={e} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
