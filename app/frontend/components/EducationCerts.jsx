import { motion } from "framer-motion";
import { GraduationCap, Award, Sparkles } from "lucide-react";
import { EDUCATION, CERTIFICATIONS } from "../data/portfolio";

export default function EducationCerts() {
  // duplicate cert list for infinite marquee
  const marquee = [...CERTIFICATIONS, ...CERTIFICATIONS];
