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
             05 · Foundations
          </div>
          <h2 className="font-display text-3xl sm:text-5xl section-title">
            Education &{" "}
            <span className="highlight-text">
              Certifications
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Education */}
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-1">
              <GraduationCap className="w-5 h-5 text-[var(--color-accent)]" />
              <h3 className="font-display text-lg font-bold text-[var(--color-text)]">
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
                className="glass-card glass-card-hover rounded-[12px] p-6"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-display text-base sm:text-lg font-bold text-[var(--color-text)] leading-snug">
                    {e.degree}
                  </h4>
                  <span className="text-[10px] font-mono-tech tracking-widest uppercase text-[var(--color-accent)] shrink-0">
                    {e.period}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">{e.school}</p>
              </motion.div>
            ))}
          </div>

          {/* Certifications */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Award className="w-5 h-5 text-[var(--color-accent)]" />
              <h3 className="font-display text-lg font-bold text-[var(--color-text)]">
                Certifications
              </h3>
            </div>

            {/* Infinite marquee */}
            <div
              data-testid="certifications-marquee"
              className="relative overflow-hidden glass-card rounded-[12px] py-5"
            >
              <div className="flex w-max animate-marquee gap-4 px-4">
                {marquee.map((c, i) => (
                  <div
                    key={i}
                    className="min-w-[280px] max-w-[280px] glass-card rounded-[12px] p-4 hover:border-[var(--color-accent)] transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2 mb-2 text-[var(--color-accent)]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono-tech tracking-widest uppercase">
                        Verified
                      </span>
                    </div>
                    <h5 className="font-display text-sm font-semibold text-[var(--color-text)] leading-tight line-clamp-2">
                      {c.title}
                    </h5>
                    <p className="mt-1.5 text-xs text-[var(--color-text-secondary)]">{c.issuer}</p>
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
                  className="text-xs text-[var(--color-text-secondary)] flex items-start gap-2"
                  data-testid={`cert-item-${i}`}
                >
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--color-accent)] shrink-0" />
                  <span>
                    <span className="text-[var(--color-text)]">{c.title}</span>
                    <span className="text-[var(--color-text-secondary)]"> · {c.issuer}</span>
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
