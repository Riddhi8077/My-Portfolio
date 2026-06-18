import { motion } from "framer-motion";
import { Code2, Layout, Server, Cloud, Cpu } from "lucide-react";
import { SKILLS } from "../data/portfolio";

const ICONS = { Code2, Layout, Server, Cloud, Cpu };

export default function Skills() {
  return (
    <section
      id="skills"
      data-testid="skills-section"
      className="relative py-24 sm:py-32 section-shell overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <div className="section-eyebrow mb-3">
             03 · Stack
          </div>
          <h2 className="font-display text-3xl sm:text-5xl section-title">
            Technical{" "}
            <span className="highlight-text">
              Skills
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SKILLS.map((cat, idx) => {
            const Icon = ICONS[cat.icon] || Code2;
            return (
              <motion.div
                key={cat.category}
                data-testid={`skill-card-${cat.category.toLowerCase().replace(/s/g, "-")}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: idx * 0.06 }}
                className="glass-card glass-card-hover rounded-[12px] p-6 group"
              >
                <div className="flex items-center gap-3 mb-5">
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 250 }}
                    className="w-11 h-11 icon-box grid place-items-center animate-float"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <h3 className="font-display text-lg font-bold text-[var(--color-text)]">
                    {cat.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((it) => (
                    <span
                      key={it}
                      className="tag text-xs font-mono-tech tracking-wider px-3 py-1.5 hover:bg-[#DBEAFE] hover:border-[#93C5FD] transition-all duration-200"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
