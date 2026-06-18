import { motion } from "framer-motion";
import { GraduationCap, Award, Sparkles } from "lucide-react";
import { EDUCATION, CERTIFICATIONS } from "../data/portfolio";

export default function EducationCerts() {
  // duplicate cert list for infinite marquee
  const marquee = [...CERTIFICATIONS, ...CERTIFICATIONS];

  return (
    <section
      id="education"
      data-testid="education-section"
      className="relative py-24 sm:py-32 bg-obsidian overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <div className="text-xs font-mono-tech tracking-[0.3em] text-neon-cyan/80 uppercase mb-3">
             05 · Foundations
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white">
            Education &{" "}
            <span className="bg-gradient-to-r from-[#00F0FF] to-[#00FF66] bg-clip-text text-transparent">
              Certifications
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Education */}
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-1">
              <GraduationCap className="w-5 h-5 text-neon-cyan" />
              <h3 className="font-display text-lg font-bold text-white">
                Education
              </h3>
            </div>
            {EDUCATION.map((e, i) => (
              <motion.div
                key={i}
                data-testid={`education-card-${i}`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card glass-card-hover rounded-2xl p-6"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-display text-base sm:text-lg font-bold text-white leading-snug">
                    {e.degree}
                  </h4>
                  <span className="text-[10px] font-mono-tech tracking-widest uppercase text-neon-emerald shrink-0">
                    {e.period}
                  </span>
                </div>
                <p className="text-sm text-[#94A3B8]">{e.school}</p>
              </motion.div>
            ))}
          </div>

          {/* Certifications */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Award className="w-5 h-5 text-neon-emerald" />
              <h3 className="font-display text-lg font-bold text-white">
                Certifications
              </h3>
            </div>

            {/* Infinite marquee */}
            <div
              data-testid="certifications-marquee"
              className="relative overflow-hidden glass-card rounded-2xl py-5"
              style={{
                maskImage:
                  "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
              }}
            >
              <div className="flex w-max animate-marquee gap-4 px-4">
                {marquee.map((c, i) => (
                  <div
                    key={i}
                    className="min-w-[280px] max-w-[280px] glass-card rounded-xl p-4 border border-white/8 hover:border-neon-cyan/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2 text-neon-cyan">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono-tech tracking-widest uppercase">
                        Verified
                      </span>
                    </div>
                    <h5 className="font-display text-sm font-semibold text-white leading-tight line-clamp-2">
                      {c.title}
                    </h5>
                    <p className="mt-1.5 text-xs text-[#94A3B8]">{c.issuer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Static list (backup readability) */}
            <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CERTIFICATIONS.map((c, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                  className="text-xs text-white/70 flex items-start gap-2"
                  data-testid={`cert-item-${i}`}
                >
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-neon-emerald shrink-0" />
                  <span>
                    <span className="text-white/90">{c.title}</span>
                    <span className="text-white/40"> · {c.issuer}</span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
