import { motion } from "framer-motion";
import { Code2, Layout, Server, Cloud, Cpu } from "lucide-react";
import { SKILLS } from "../data/portfolio";

const ICONS = { Code2, Layout, Server, Cloud, Cpu };

export default function Skills() {
  return (
    <section
      id="skills"
      data-testid="skills-section"
      className="relative py-24 sm:py-32 bg-obsidian overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-neon-cyan/5 blur-[160px]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <div className="text-xs font-mono-tech tracking-[0.3em] text-neon-cyan/80 uppercase mb-3">
             03 · Stack
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white">
            Technical{" "}
            <span className="bg-gradient-to-r from-[#00F0FF] to-[#00FF66] bg-clip-text text-transparent">
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
                className="glass-card glass-card-hover rounded-2xl p-6 group"
              >
                <div className="flex items-center gap-3 mb-5">
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 250 }}
                    className="w-11 h-11 rounded-xl grid place-items-center bg-gradient-to-br from-neon-cyan/15 to-neon-emerald/10 border border-neon-cyan/30 text-neon-cyan animate-float"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {cat.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((it) => (
                    <span
                      key={it}
                      className="text-xs font-mono-tech tracking-wider px-3 py-1.5 rounded-md bg-white/5 border border-white/5 text-white/80 hover:bg-neon-cyan/10 hover:border-neon-cyan/40 hover:text-neon-cyan transition-all"
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
