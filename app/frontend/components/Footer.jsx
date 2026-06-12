import { Code2, MapPin, GitBranch } from "lucide-react";
import { PROFILE } from "../data/portfolio";

export default function Footer() {
  return (
    <footer
      data-testid="footer"
      className="relative bg-obsidian border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs font-mono-tech tracking-widest uppercase text-white/40 text-center sm:text-left">
          © {new Date().getFullYear()} {PROFILE.name} · Built with React 
        </div>
        <div className="flex items-center gap-3">
          <a
            href={PROFILE.socials.github}
            target="_blank"
            rel="noreferrer"
            aria-label="github"
            className="text-white/60 hover:text-neon-cyan transition-colors"
            data-testid="footer-github"
          >
<GitBranch className="w-4 h-4" />
          </a>
          <a
            href={PROFILE.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-white/60 hover:text-neon-cyan transition-colors"
            data-testid="footer-linkedin"
          >
<MapPin className="w-4 h-4" />
          </a>
          <a
            href={PROFILE.socials.leetcode}
            target="_blank"
            rel="noreferrer"
            aria-label="LeetCode"
            className="text-white/60 hover:text-neon-emerald transition-colors"
            data-testid="footer-leetcode"
          >
            <Code2 className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
