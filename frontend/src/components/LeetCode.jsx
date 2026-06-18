import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Trophy, Flame, Activity, ExternalLink, AlertCircle } from "lucide-react";
import { PROFILE } from "../data/portfolio";

const API = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/api`;
const REFRESH_INTERVAL_MS = 15 * 60 * 1000;

const EMPTY_LEETCODE_DATA = {
  totalSolved: 0,
  easySolved: 0,
  mediumSolved: 0,
  hardSolved: 0,
  totalEasy: 800,
  totalMedium: 1700,
  totalHard: 750,
  ranking: null,
  contestRating: null,
  contestGlobalRanking: null,
  acceptanceRate: null,
  currentStreak: 0,
  longestStreak: 0,
  totalActiveDays: 0,
  lastActiveDate: null,
  submissionCalendar: {},
  dailyActivity: [],
  recentSubmissions: [],
  badges: [],
  updatedAt: null,
  error: null,
};

const formatNumber = (value) =>
  value || value === 0 ? Number(value).toLocaleString() : "N/A";

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const formatRelativeDate = (timestamp) => {
  if (!timestamp) return "recently";
  const diffDays = Math.max(
    0,
    Math.floor((Date.now() - Number(timestamp) * 1000) / 86400000)
  );
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  return `${diffDays} days ago`;
};

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
          <circle cx="50" cy="50" r={r} stroke="#E2E8F0" strokeWidth="6" fill="none" />
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
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold text-[var(--color-text)]">{value}</span>
          <span className="text-[10px] font-mono-tech tracking-widest text-[var(--color-text-secondary)]">
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
    if (n === 0) return "#F1F5F9";
    const ratio = n / max;
    if (ratio < 0.25) return "#BFDBFE";
    if (ratio < 0.5) return "#60A5FA";
    if (ratio < 0.75) return "#2563EB";
    return "#0EA5E9";
  };

  return (
    <div data-testid="leetcode-contribution-grid" className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-mono-tech tracking-widest uppercase text-[var(--color-text-secondary)]">
          <Activity className="w-3.5 h-3.5 text-[var(--color-accent)]" />
          Daily Consistency · last 120 days
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono-tech text-[var(--color-text-secondary)]">
          <span>less</span>
          {[0.05, 0.25, 0.5, 0.75, 1].map((r, i) => (
            <span
              key={i}
              className="inline-block w-2.5 h-2.5 rounded-[2px]"
              style={{
                background:
                  r < 0.1
                    ? "#F1F5F9"
                    : r < 0.5
                    ? "#BFDBFE"
                    : r < 0.8
                    ? "#60A5FA"
                    : "#2563EB",
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchLeetCode = useCallback(async ({ initial = false } = {}) => {
    if (initial) setLoading(true);
    else setRefreshing(true);
    setError("");

    try {
      const res = await axios.get(
        `${API}/leetcode/${PROFILE.leetcodeUsername}`,
        { timeout: 15000 }
      );
      setData({ ...EMPTY_LEETCODE_DATA, ...res.data });
      if (res.data?.error) setError(res.data.error);
    } catch (e) {
      setError("Unable to refresh LeetCode data right now.");
      setData((current) => current || EMPTY_LEETCODE_DATA);
    } finally {
      if (initial) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchLeetCode({ initial: true });
    const interval = window.setInterval(() => {
      if (mounted) fetchLeetCode();
    }, REFRESH_INTERVAL_MS);
    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [fetchLeetCode]);

  const d = data || EMPTY_LEETCODE_DATA;
  const recentDailyActivity = [...(d.dailyActivity || [])].slice(-7).reverse();
  const recentSubmissions = (d.recentSubmissions || []).slice(0, 5);
  const badges = (d.badges || []).slice(0, 4);

  return (
    <section
      id="leetcode"
      data-testid="leetcode-section"
      className="relative py-24 sm:py-32 section-shell overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="mb-12 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <div className="section-eyebrow mb-3">
             04 · DSA Grind
            </div>
            <h2 className="font-display text-3xl sm:text-5xl section-title">
              LeetCode{" "}
              <span className="highlight-text">
                Dashboard
              </span>
            </h2>
          </div>
          <a
            href={PROFILE.socials.leetcode}
            target="_blank"
            rel="noreferrer"
            data-testid="https://leetcode.com/u/Riddhi8077/"
            className="inline-flex items-center gap-2 text-xs font-mono-tech tracking-widest uppercase text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
          >
            @{PROFILE.leetcodeUsername} <ExternalLink className="w-3 h-3" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="glass-card rounded-[12px] p-6 sm:p-10"
          data-testid="leetcode-widget"
        >
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#EFF6FF] border border-[#BFDBFE]">
                  <Trophy className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  <span className="text-[11px] font-mono-tech tracking-widest uppercase text-[var(--color-accent)]">
                    {loading
                      ? "Syncing…"
                      : d.ranking
                      ? `Rank #${d.ranking.toLocaleString()}`
                      : "Live Profile"}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#F0F9FF] border border-[#BAE6FD]">
                  <Flame className="w-3.5 h-3.5 text-[var(--color-accent-2)]" />
                  <span className="text-[11px] font-mono-tech tracking-widest uppercase text-[var(--color-accent-2)]">
                    {d.totalSolved} solved
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-6 justify-items-center">
                <Ring
                  value={d.easySolved}
                  total={d.totalEasy || 800}
                  color="#0EA5E9"
                  label="Easy"
                  delay={0}
                />
                <Ring
                  value={d.mediumSolved}
                  total={d.totalMedium || 1700}
                  color="#2563EB"
                  label="Medium"
                  delay={0.1}
                />
                <Ring
                  value={d.hardSolved}
                  total={d.totalHard || 750}
                  color="#DC2626"
                  label="Hard"
                  delay={0.2}
                />
              </div>

              {error && (
                <div className="mt-6 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                  <AlertCircle className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  {error}
                </div>
              )}

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  ["Total solved", formatNumber(d.totalSolved)],
                  ["Current streak", `${formatNumber(d.currentStreak)} days`],
                  ["Longest streak", `${formatNumber(d.longestStreak)} days`],
                  ["Acceptance", d.acceptanceRate ? `${d.acceptanceRate}%` : "N/A"],
                  ["Contest rating", d.contestRating ? formatNumber(d.contestRating) : "N/A"],
                  ["Global rank", d.ranking ? `#${formatNumber(d.ranking)}` : "N/A"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[12px] border border-[var(--color-border)] bg-white p-3"
                  >
                    <div className="text-[10px] font-mono-tech tracking-widest uppercase text-[var(--color-text-secondary)]">
                      {label}
                    </div>
                    <div className="mt-1 font-display text-base font-bold text-[var(--color-text)]">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <ContributionGrid calendar={d.submissionCalendar} />
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] font-mono-tech tracking-widest uppercase text-[var(--color-accent)] mb-3">
                    Recent submissions
                  </div>
                  <div className="space-y-2">
                    {recentSubmissions.length ? (
                      recentSubmissions.map((submission) => (
                        <a
                          key={`${submission.id}-${submission.timestamp}`}
                          href={`https://leetcode.com/problems/${submission.titleSlug}/`}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-[12px] border border-[var(--color-border)] bg-white p-3 transition-colors hover:border-[var(--color-accent)]"
                        >
                          <div className="text-sm font-semibold text-[var(--color-text)] line-clamp-1">
                            {submission.title}
                          </div>
                          <div className="mt-1 text-[10px] font-mono-tech tracking-widest uppercase text-[var(--color-text-secondary)]">
                            Solved {formatRelativeDate(submission.timestamp)}
                          </div>
                        </a>
                      ))
                    ) : (
                      <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-3 text-sm text-[var(--color-text-secondary)]">
                        Recent submissions will appear after the next successful sync.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-mono-tech tracking-widest uppercase text-[var(--color-accent)] mb-3">
                    Daily LeetCode Activity
                  </div>
                  <div className="space-y-2">
                    {recentDailyActivity.length ? (
                      recentDailyActivity.map((day) => (
                        <div
                          key={day.timestamp}
                          className="flex items-center justify-between rounded-[12px] border border-[var(--color-border)] bg-white p-3"
                        >
                          <span className="text-sm text-[var(--color-text)]">
                            {formatDate(day.date)}
                          </span>
                          <span className="text-[11px] font-mono-tech tracking-widest uppercase text-[var(--color-accent)]">
                            {day.count} solved
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[12px] border border-[var(--color-border)] bg-white p-3 text-sm text-[var(--color-text-secondary)]">
                        Daily progress will appear when LeetCode returns activity data.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {badges.length > 0 && (
                <div className="mt-6">
                  <div className="text-[11px] font-mono-tech tracking-widest uppercase text-[var(--color-accent)] mb-3">
                    Badges & achievements
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {badges.map((badge) => (
                      <span
                        key={badge.id || badge.name}
                        className="tag text-[10px] font-mono-tech tracking-widest uppercase px-2.5 py-1"
                      >
                        {badge.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-6 text-[11px] font-mono-tech tracking-widest text-[var(--color-text-secondary)] uppercase">
                Last active: {formatDate(d.lastActiveDate)} · Updated:{" "}
                {formatDate(d.updatedAt)} ·{" "}
                {refreshing ? "Refreshing" : "Auto-refreshes every 15 minutes"}
              </div>
              <div className="hidden">
                Source: Live LeetCode API · auto-refreshes on load
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
