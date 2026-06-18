import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { Trophy, Flame, Activity, ExternalLink } from "lucide-react";
import { PROFILE } from "../data/portfolio";

const API = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/api`;

function Ring({ value, total, color, label, delay = 0 }) {
  const pct = total > 0 ? Math.min(1, value / total) : 0;
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      className="flex flex-col items-center"
      data-testid={`leetcode-ring-${label.toLowerCase()}`}
    >
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} stroke="rgba(255,255,255,0.07)" strokeWidth="6" fill="none" />
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: c - c * pct }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 + delay }}
            style={{ filter: `drop-shadow(0 0 6px ${color}88)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold text-white">{value}</span>
          <span className="text-[10px] font-mono-tech tracking-widest text-white/40">
            /{total}
          </span>
        </div>
      </div>
      <div
        className="mt-3 text-[11px] font-mono-tech tracking-widest uppercase"
        style={{ color }}
      >
        {label}
      </div>
    </motion.div>
  );
}

function ContributionGrid({ calendar }) {
  // Build last 120 days grid from calendar timestamps (UNIX seconds)
  const entries = Object.entries(calendar || {}).reduce((acc, [k, v]) => {
    acc[Math.floor(Number(k) / 86400)] = Number(v);
    return acc;
  }, {});
  const today = Math.floor(Date.now() / 86400000);
  const days = [];
  for (let i = 119; i >= 0; i--) {
    const d = today - i;
    days.push(entries[d] || 0);
  }
  const max = Math.max(1, ...days);

  const colorFor = (n) => {
    if (n === 0) return "rgba(255,255,255,0.05)";
    const ratio = n / max;
    if (ratio < 0.25) return "rgba(0, 240, 255, 0.25)";
    if (ratio < 0.5) return "rgba(0, 240, 255, 0.5)";
    if (ratio < 0.75) return "rgba(0, 255, 102, 0.65)";
    return "#00FF66";
  };

  return (
    <div data-testid="leetcode-contribution-grid" className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-mono-tech tracking-widest uppercase text-white/60">
          <Activity className="w-3.5 h-3.5 text-neon-cyan" />
          Daily Consistency · last 120 days
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-white/40">
          <span>less</span>
          {[0.05, 0.25, 0.5, 0.75, 1].map((r, i) => (
            <span
              key={i}
              className="inline-block w-2.5 h-2.5 rounded-[2px]"
              style={{
                background:
                  r < 0.1
                    ? "rgba(255,255,255,0.05)"
                    : r < 0.5
                    ? "rgba(0,240,255,0.4)"
                    : r < 0.8
                    ? "rgba(0,255,102,0.5)"
                    : "#00FF66",
              }}
            />
          ))}
          <span>more</span>
        </div>
      </div>
      <div
        className="grid gap-[3px]"
        style={{
          gridTemplateColumns: "repeat(20, minmax(0, 1fr))",
        }}
      >
        {days.map((n, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.003, duration: 0.25 }}
            className="aspect-square rounded-[2px]"
            style={{ background: colorFor(n) }}
            title={`${n} submissions`}
          />
        ))}
      </div>
    </div>
  );
}

export default function LeetCodeWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(
          `${API}/leetcode/${PROFILE.leetcodeUsername}`,
          { timeout: 12000 }
        );
        if (mounted) setData(res.data);
      } catch (e) {
        if (mounted)
          setData({
            totalSolved: 0,
            easySolved: 0,
            mediumSolved: 0,
            hardSolved: 0,
            totalEasy: 800,
            totalMedium: 1700,
            totalHard: 750,
            ranking: null,
            submissionCalendar: {},
          });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const d = data || {
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalEasy: 800,
    totalMedium: 1700,
    totalHard: 750,
    ranking: null,
    submissionCalendar: {},
  };

  return (
    <section
      id="leetcode"
      data-testid="leetcode-section"
      className="relative py-24 sm:py-32 bg-obsidian overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="mb-12 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <div className="text-xs font-mono-tech tracking-[0.3em] text-neon-cyan/80 uppercase mb-3">
             04 · DSA Grind
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white">
              LeetCode{" "}
              <span className="bg-gradient-to-r from-[#00F0FF] to-[#00FF66] bg-clip-text text-transparent">
                Dashboard
              </span>
            </h2>
          </div>
          <a
            href={PROFILE.socials.leetcode}
            target="_blank"
            rel="noreferrer"
            data-testid="https://leetcode.com/u/Riddhi8077/"
            className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-widest uppercase text-white/70 hover:text-neon-emerald transition-colors"
          >
            @{PROFILE.leetcodeUsername} <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="glass-card rounded-3xl p-6 sm:p-10"
          data-testid="leetcode-widget"
        >
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-emerald/10 border border-neon-emerald/30">
                  <Trophy className="w-3.5 h-3.5 text-neon-emerald" />
                  <span className="text-[11px] font-mono-tech tracking-widest uppercase text-neon-emerald">
                    {loading
                      ? "Syncing…"
                      : d.ranking
                      ? `Rank #${d.ranking.toLocaleString()}`
                      : "Live Profile"}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30">
                  <Flame className="w-3.5 h-3.5 text-neon-cyan" />
                  <span className="text-[11px] font-mono-tech tracking-widest uppercase text-neon-cyan">
                    {d.totalSolved} solved
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-6 justify-items-center">
                <Ring
                  value={d.easySolved}
                  total={d.totalEasy || 800}
                  color="#00FF66"
                  label="Easy"
                  delay={0}
                />
                <Ring
                  value={d.mediumSolved}
                  total={d.totalMedium || 1700}
                  color="#00F0FF"
                  label="Medium"
                  delay={0.1}
                />
                <Ring
                  value={d.hardSolved}
                  total={d.totalHard || 750}
                  color="#FF6B9D"
                  label="Hard"
                  delay={0.2}
                />
              </div>
            </div>

            <div>
              <ContributionGrid calendar={d.submissionCalendar} />
              <div className="mt-6 text-[11px] font-mono-tech tracking-widest text-white/40 uppercase">
                Source: Live LeetCode API · auto-refreshes on load
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}