import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { Play, ExternalLink, Award, ImageIcon, Plus, GitBranch } from "lucide-react";
import { PROJECT_CATEGORIES, PROFILE } from "../data/portfolio";

function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 18,
  });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ProjectCard({ project, index }) {
  const [tab, setTab] = useState("mockup"); // 'mockup' | 'video'

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="h-full"
      data-testid={`project-card-${project.id}`}
    >
      <TiltCard className="h-full">
        <div className="glass-card glass-card-hover rounded-[12px] overflow-hidden h-full flex flex-col">
          <div className="relative aspect-[16/10] overflow-hidden bg-[#F8FAFC] border-b border-[var(--color-border)]">
            {tab === "mockup" ? (
              <motion.div
                key="m"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <img
  src={project.mockup}
  alt={project.title}
  className="w-full h-full object-contain p-5 opacity-95 transition-transform duration-500 group-hover:scale-105"
/>
              </motion.div>
            ) : (
              <motion.div
                key="v"
                data-testid={`project-walkthrough-${project.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 grid-bg flex items-center justify-center"
              >
                <div className="relative w-[88%] h-[78%] rounded-[12px] border border-[var(--color-border)] overflow-hidden bg-white">
                  <div className="absolute inset-0 shimmer" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4">
                    <div className="w-14 h-14 rounded-[12px] grid place-items-center icon-box">
                      <Play className="w-5 h-5" />
                    </div>
                    <div className="font-mono-tech text-[11px] tracking-widest uppercase text-[var(--color-accent)]">
                      Screen Recording Walkthrough
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)]">
                      Video container · Replace with your MP4
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* tab toggle */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <div className="flex bg-white/95 rounded-[12px] p-1 border border-[var(--color-border)] shadow-sm">
                <button
                  data-testid={`project-tab-mockup-${project.id}`}
                  onClick={() => setTab("mockup")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[10px] font-mono-tech tracking-widest uppercase transition-all ${
                    tab === "mockup"
                      ? "bg-[var(--color-accent)] text-white"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-accent-hover)]"
                  }`}
                >
                  <ImageIcon className="w-3 h-3" /> Mockup
                </button>
                <button
                  data-testid={`project-tab-video-${project.id}`}
                  onClick={() => setTab("video")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[10px] font-mono-tech tracking-widest uppercase transition-all ${
                    tab === "video"
                      ? "bg-[var(--color-accent)] text-white"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-accent-hover)]"
                  }`}
                >
                  <Play className="w-3 h-3" /> Walkthrough
                </button>
              </div>
              {project.award && (
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-white/95 border border-[var(--color-border)] text-[10px] font-mono-tech tracking-widest uppercase text-[var(--color-accent)] shadow-sm max-w-[45%] truncate">
                  <Award className="w-3 h-3" />
                  {project.award}
                </div>
              )}
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-display text-xl font-bold text-[var(--color-text)] mb-2">
              {project.title}
            </h3>
            <p className="text-sm body-copy flex-1 line-clamp-5">
              {project.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="tag text-[10px] font-mono-tech tracking-widest uppercase px-2 py-1"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono-tech tracking-widest uppercase text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] inline-flex items-center gap-1.5 transition-colors"
                data-testid={`project-link-${project.id}`}
              >
                View Live <ExternalLink className="w-3 h-3" />
              </a>
              {project.award && (
                <span className="sm:hidden text-[10px] font-mono-tech tracking-widest uppercase text-[var(--color-accent)] truncate">
                  {project.award}
                </span>
              )}
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

function PlaceholderCard() {
  return (
    <motion.a
      href={PROFILE.socials.github}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      data-testid="project-placeholder-card"
      className="glass-card glass-card-hover rounded-[12px] border-dashed flex items-center justify-center p-8 min-h-[280px] group relative overflow-hidden"
    >
      <div className="absolute inset-0 shimmer opacity-50" />
      <div className="relative flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-[12px] grid place-items-center icon-box">
          <Plus className="w-5 h-5" />
        </div>
        <p className="font-mono-tech text-[11px] tracking-widest uppercase text-[var(--color-accent)]">
          Additional Projects
        </p>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-[18ch]">
          Loading from github…
        </p>
        <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-mono-tech tracking-widest uppercase text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-hover)] transition-colors">
<GitBranch className="w-3 h-3" /> View on github
        </span>
      </div>
    </motion.a>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      data-testid="projects-section"
      className="relative py-24 sm:py-32 section-shell"
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
             02 · Selected Projects
          </div>
          <h2 className="font-display text-3xl sm:text-5xl section-title">
            Things I&apos;ve{" "}
            <span className="highlight-text">
              built
            </span>
          </h2>
          <p className="mt-3 body-copy max-w-xl">
            Hit <span className="text-[var(--color-accent)] font-semibold">Walkthrough</span> to peek a
            screen-recorded demo inside each card.
          </p>
        </motion.div>

        <div className="space-y-20">
  {PROJECT_CATEGORIES.map((category, categoryIndex) => (
    <motion.div
      key={category.id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: categoryIndex * 0.1 }}
      className="space-y-8"
    >
      {/* Category Heading */}
      <div className="relative">
        <div
          className="inline-flex items-center gap-3 px-5 py-2 rounded-[12px] bg-white border border-[var(--color-border)] text-[var(--color-accent)] font-mono-tech text-xs font-bold tracking-[0.18em] uppercase shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          {category.title}
        </div>

        <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
          {category.subtitle}
        </p>
      </div>

      {/* Projects Grid */}
      <div className={`project-grid ${category.id === "hackathons" ? "hackathon-grid" : ""}`}>
        {category.projects.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            index={i}
          />
        ))}

        {category.id === "freelancing" && <PlaceholderCard />}
      </div>
    </motion.div>
  ))}
</div>
      </div>
    </section>
  );
}
