import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { Send, Code2, Phone, MapPin, CheckCircle2, AlertCircle, GitBranch } from "lucide-react";
import { PROFILE } from "../data/portfolio";

const API = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/api`;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | ok | err
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await axios.post(`${API}/contact`, form);
      setStatus("ok");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (e) {
      setStatus("err");
      setErrorMsg(
        e?.response?.data?.detail?.[0]?.msg ||
          e?.response?.data?.detail ||
          "Something went wrong. Please try again."
      );
    }
  };

  const field = (name, props = {}) => (
    <input
      data-testid={`contact-input-${name}`}
      value={form[name]}
      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      className="w-full bg-transparent border-0 border-b border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none py-3 px-1 text-sm font-mono-tech placeholder:text-slate-400 text-[var(--color-text)] transition-colors duration-200"
      {...props}
    />
  );

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="relative py-24 sm:py-32 section-shell overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <div className="section-eyebrow mb-3">
          </div>
          <h2 className="font-display text-3xl sm:text-5xl section-title">
            Get in{" "}
            <span className="highlight-text">
              touch
            </span>
          </h2>
          <p className="mt-3 body-copy max-w-xl mx-auto">
            Open to internships, full-time SWE roles & freelance builds. Drop a line.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="glass-card rounded-[12px] p-6 space-y-4">
              <a
                href={`tel:${PROFILE.phone.replace(/s/g, "")}`}
                data-testid="contact-phone-link"
                className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-accent-hover)] transition-colors duration-200"
              >
                <span className="w-9 h-9 icon-box grid place-items-center">
                  <Phone className="w-4 h-4" />
                </span>
                <span className="font-mono-tech">{PROFILE.phone}</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                <span className="w-9 h-9 icon-box grid place-items-center">
                  <MapPin className="w-4 h-4" />
                </span>
                <span className="font-mono-tech">{PROFILE.location}</span>
              </div>
              <div className="pt-4 border-t border-[var(--color-border)] flex items-center gap-2">
                <a
                  data-testid="contact-github-link"
                  href={PROFILE.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-[12px] grid place-items-center border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent-hover)] hover:border-[var(--color-accent)] transition-all duration-200 hover:-translate-y-0.5"
                  aria-label="github"
                >
<GitBranch className="w-4 h-4" />
                </a>
                <a
                  data-testid="contact-linkedin-link"
                  href={PROFILE.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-[12px] grid place-items-center border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent-hover)] hover:border-[var(--color-accent)] transition-all duration-200 hover:-translate-y-0.5"
                  aria-label="LinkedIn"
                >
                  <span className="text-xs font-bold">in</span>
                </a>
                <a
                  data-testid="contact-leetcode-link"
                  href={PROFILE.socials.leetcode}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-[12px] grid place-items-center border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent-hover)] hover:border-[var(--color-accent)] transition-all duration-200 hover:-translate-y-0.5"
                  aria-label="LeetCode"
                >
                  <Code2 className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="glass-card rounded-[12px] p-6">
              <div className="text-[11px] font-mono-tech tracking-widest uppercase text-[var(--color-accent)] mb-2">
                 availability --status
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                <span className="text-[var(--color-text-secondary)]">
                  Open to full-time & internship offers
                </span>
              </div>
            </div>
          </motion.div>

          {/* form */}
          <motion.form
            data-testid="contact-form"
            onSubmit={submit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 glass-card rounded-[12px] p-6 sm:p-8"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              {field("name", { placeholder: "Your name", required: true, maxLength: 120 })}
              {field("email", { placeholder: "Email address", type: "email", required: true })}
            </div>
            <div className="mt-5">
              {field("subject", { placeholder: "Subject (optional)", maxLength: 200 })}
            </div>
            <div className="mt-5">
              <textarea
                data-testid="contact-input-message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell me about your project, role, or opportunity…"
                required
                rows={5}
                maxLength={4000}
                className="w-full bg-transparent border-0 border-b border-[var(--color-border)] focus:border-[var(--color-accent)] focus:outline-none py-3 px-1 text-sm font-mono-tech placeholder:text-slate-400 text-[var(--color-text)] transition-colors duration-200 resize-none"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 justify-between">
              <div className="text-[11px] font-mono-tech text-[var(--color-text-secondary)]">
                Stored securely. No spam, ever.
              </div>
              <button
                data-testid="contact-submit-btn"
                disabled={status === "sending"}
                className="btn-primary px-7 py-3 font-mono-tech text-xs tracking-widest uppercase disabled:opacity-60 disabled:scale-100"
              >
                <Send className="w-4 h-4" />
                {status === "sending" ? "Sending…" : "Send Message"}
              </button>
            </div>

            {status === "ok" && (
              <motion.div
                data-testid="contact-success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 flex items-center gap-2 text-sm text-[var(--color-success)]"
              >
                <CheckCircle2 className="w-4 h-4" />
                Message sent - I&apos;ll get back within 24h.
              </motion.div>
            )}
            {status === "err" && (
              <motion.div
                data-testid="contact-error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 flex items-center gap-2 text-sm text-red-400"
              >
                <AlertCircle className="w-4 h-4" />
                {errorMsg}
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
