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
      className="w-full bg-transparent border-0 border-b border-white/10 focus:border-neon-cyan focus:outline-none py-3 px-1 text-sm font-mono-tech placeholder:text-white/30 text-white transition-colors"
      {...props}
    />
  );
