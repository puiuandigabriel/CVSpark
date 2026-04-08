"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  Shield,
  Zap,
  Crown,
  Lock,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Target,
  Type,
  ListChecks,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  BarChart3,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AtsCheck {
  id: string;
  label: string;
  description: string;
  category: "format" | "content" | "keywords" | "structure";
  weight: number; // 1-3 importance
  status: "pass" | "fail" | "warn";
  details: string;
  fixTip: string;
  isPremiumFix: boolean;
}

interface CvData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  experiences: { company: string; title: string; startDate: string; endDate: string; current: boolean; bullets: string[] }[];
  educations: { institution: string; degree: string; field: string; year: string }[];
  skills: string[];
  languages: { name: string; proficiency: string }[];
  certifications: { name: string; issuer: string; year: string }[];
  selectedTemplate: string;
}

/* ------------------------------------------------------------------ */
/*  ATS Analysis Engine                                                */
/* ------------------------------------------------------------------ */

function analyzeCV(cv: CvData): AtsCheck[] {
  const checks: AtsCheck[] = [];

  // --- CONTACT INFO ---
  checks.push({
    id: "contact-email",
    label: "Email Address Present",
    description: "ATS systems need your email to contact you",
    category: "content",
    weight: 3,
    status: cv.email && cv.email.includes("@") ? "pass" : "fail",
    details: cv.email ? "Email detected" : "No email address found",
    fixTip: "Add a professional email address to your contact info",
    isPremiumFix: false,
  });

  checks.push({
    id: "contact-phone",
    label: "Phone Number Present",
    description: "Recruiters need a phone number to reach you",
    category: "content",
    weight: 2,
    status: cv.phone && cv.phone.length >= 7 ? "pass" : "fail",
    details: cv.phone ? "Phone number detected" : "No phone number found",
    fixTip: "Add your phone number to your contact information",
    isPremiumFix: false,
  });

  checks.push({
    id: "contact-location",
    label: "Location Specified",
    description: "Many ATS filter by location",
    category: "content",
    weight: 2,
    status: cv.location ? "pass" : "warn",
    details: cv.location ? "Location detected" : "No location specified",
    fixTip: "Add your city and state/country",
    isPremiumFix: false,
  });

  checks.push({
    id: "contact-linkedin",
    label: "LinkedIn Profile",
    description: "LinkedIn URLs add credibility",
    category: "content",
    weight: 1,
    status: cv.linkedin ? "pass" : "warn",
    details: cv.linkedin ? "LinkedIn URL found" : "No LinkedIn URL",
    fixTip: "Add your LinkedIn profile URL",
    isPremiumFix: false,
  });

  // --- PROFESSIONAL SUMMARY ---
  checks.push({
    id: "summary-present",
    label: "Professional Summary",
    description: "A summary helps ATS categorize your profile",
    category: "content",
    weight: 3,
    status: cv.summary && cv.summary.length >= 50 ? "pass" : cv.summary ? "warn" : "fail",
    details: cv.summary
      ? `Summary is ${cv.summary.length} characters (${cv.summary.split(/\s+/).length} words)`
      : "No professional summary found",
    fixTip: "Write a 3-5 sentence summary highlighting your key qualifications",
    isPremiumFix: false,
  });

  checks.push({
    id: "summary-length",
    label: "Summary Length Optimal",
    description: "ATS-friendly summaries are 50-200 words",
    category: "format",
    weight: 2,
    status: (() => {
      if (!cv.summary) return "fail";
      const words = cv.summary.split(/\s+/).length;
      if (words >= 50 && words <= 200) return "pass";
      if (words >= 30 && words <= 250) return "warn";
      return "fail";
    })(),
    details: cv.summary ? `${cv.summary.split(/\s+/).length} words` : "No summary",
    fixTip: "Aim for 50-200 words in your professional summary",
    isPremiumFix: true,
  });

  // --- WORK EXPERIENCE ---
  const validExperiences = cv.experiences.filter((e) => e.company || e.title);
  checks.push({
    id: "experience-present",
    label: "Work Experience Listed",
    description: "Employment history is critical for ATS scoring",
    category: "content",
    weight: 3,
    status: validExperiences.length > 0 ? "pass" : "fail",
    details: validExperiences.length > 0
      ? `${validExperiences.length} position(s) found`
      : "No work experience listed",
    fixTip: "Add at least one work experience entry",
    isPremiumFix: false,
  });

  checks.push({
    id: "experience-dates",
    label: "Employment Dates Complete",
    description: "ATS systems use dates to calculate experience",
    category: "format",
    weight: 3,
    status: (() => {
      if (validExperiences.length === 0) return "fail";
      const allHaveDates = validExperiences.every((e) => e.startDate && (e.endDate || e.current));
      return allHaveDates ? "pass" : "warn";
    })(),
    details: (() => {
      const missing = validExperiences.filter((e) => !e.startDate || (!e.endDate && !e.current));
      return missing.length === 0 ? "All dates present" : `${missing.length} position(s) missing dates`;
    })(),
    fixTip: "Ensure every position has start and end dates",
    isPremiumFix: false,
  });

  checks.push({
    id: "experience-bullets",
    label: "Bullet Points with Details",
    description: "ATS scans bullet points for keywords and achievements",
    category: "content",
    weight: 3,
    status: (() => {
      if (validExperiences.length === 0) return "fail";
      const totalBullets = validExperiences.reduce((acc, e) => acc + e.bullets.filter(Boolean).length, 0);
      if (totalBullets >= validExperiences.length * 3) return "pass";
      if (totalBullets >= validExperiences.length) return "warn";
      return "fail";
    })(),
    details: (() => {
      const totalBullets = validExperiences.reduce((acc, e) => acc + e.bullets.filter(Boolean).length, 0);
      return `${totalBullets} bullet point(s) across ${validExperiences.length} position(s)`;
    })(),
    fixTip: "Add 3-5 bullet points per position describing your achievements",
    isPremiumFix: true,
  });

  // --- ACTION VERBS ---
  const actionVerbs = [
    "led", "managed", "developed", "created", "implemented", "designed", "built",
    "improved", "increased", "decreased", "reduced", "achieved", "delivered",
    "launched", "established", "organized", "coordinated", "executed", "drove",
    "spearheaded", "mentored", "optimized", "streamlined", "automated", "analyzed",
    "collaborated", "negotiated", "resolved", "transformed", "initiated",
  ];
  const allBullets = validExperiences.flatMap((e) => e.bullets.filter(Boolean));
  const bulletsWithActions = allBullets.filter((b) =>
    actionVerbs.some((v) => b.toLowerCase().startsWith(v))
  );

  checks.push({
    id: "action-verbs",
    label: "Strong Action Verbs",
    description: "Bullets should start with action verbs like 'Led', 'Developed', 'Improved'",
    category: "content",
    weight: 2,
    status: (() => {
      if (allBullets.length === 0) return "fail";
      const ratio = bulletsWithActions.length / allBullets.length;
      if (ratio >= 0.6) return "pass";
      if (ratio >= 0.3) return "warn";
      return "fail";
    })(),
    details: `${bulletsWithActions.length}/${allBullets.length} bullets start with action verbs`,
    fixTip: "Start each bullet with a strong action verb (Led, Developed, Improved, etc.)",
    isPremiumFix: true,
  });

  // --- QUANTIFIABLE ACHIEVEMENTS ---
  const bulletsWithNumbers = allBullets.filter((b) => /\d+%|\$[\d,]+|\d+\+?\s*(users|clients|projects|team|people|revenue|sales)/i.test(b));
  checks.push({
    id: "quantifiable",
    label: "Quantifiable Achievements",
    description: "Numbers and metrics make your CV 40% more likely to get callbacks",
    category: "content",
    weight: 3,
    status: (() => {
      if (allBullets.length === 0) return "fail";
      const ratio = bulletsWithNumbers.length / allBullets.length;
      if (ratio >= 0.3) return "pass";
      if (ratio >= 0.1) return "warn";
      return "fail";
    })(),
    details: `${bulletsWithNumbers.length}/${allBullets.length} bullets contain metrics`,
    fixTip: "Add numbers: percentages, dollar amounts, team sizes, project counts",
    isPremiumFix: true,
  });

  // --- EDUCATION ---
  const validEducation = cv.educations.filter((e) => e.institution || e.degree);
  checks.push({
    id: "education-present",
    label: "Education Listed",
    description: "Education section is required by most ATS systems",
    category: "content",
    weight: 2,
    status: validEducation.length > 0 ? "pass" : "fail",
    details: validEducation.length > 0 ? `${validEducation.length} entry(ies)` : "No education listed",
    fixTip: "Add your education history",
    isPremiumFix: false,
  });

  // --- SKILLS ---
  checks.push({
    id: "skills-present",
    label: "Skills Section",
    description: "ATS systems match your skills against job requirements",
    category: "content",
    weight: 3,
    status: cv.skills.length >= 5 ? "pass" : cv.skills.length > 0 ? "warn" : "fail",
    details: `${cv.skills.length} skill(s) listed`,
    fixTip: "List at least 8-12 relevant skills",
    isPremiumFix: false,
  });

  checks.push({
    id: "skills-count",
    label: "Sufficient Skill Count",
    description: "8-15 skills is the sweet spot for ATS matching",
    category: "keywords",
    weight: 2,
    status: cv.skills.length >= 8 && cv.skills.length <= 20 ? "pass" : cv.skills.length >= 5 ? "warn" : "fail",
    details: cv.skills.length >= 8 ? "Good number of skills" : `Only ${cv.skills.length} skills — add more`,
    fixTip: "Add industry-specific and technical skills relevant to your target role",
    isPremiumFix: true,
  });

  // --- TEMPLATE / FORMAT ---
  checks.push({
    id: "template-ats",
    label: "ATS-Friendly Template",
    description: "Some templates with columns/graphics confuse ATS parsers",
    category: "format",
    weight: 3,
    status: cv.selectedTemplate === "Creative" ? "fail" : cv.selectedTemplate === "Classic" || cv.selectedTemplate === "Minimal" ? "pass" : "pass",
    details: cv.selectedTemplate === "Creative"
      ? "Creative template uses two-column layout — most ATS can't parse this"
      : `${cv.selectedTemplate} template is ATS-compatible`,
    fixTip: "Switch to Modern, Classic, or Minimal template for best ATS compatibility",
    isPremiumFix: false,
  });

  // --- CV LENGTH ---
  const totalWords = [
    cv.summary,
    ...allBullets,
    ...cv.skills,
    ...validEducation.map((e) => `${e.degree} ${e.field} ${e.institution}`),
  ]
    .filter(Boolean)
    .join(" ")
    .split(/\s+/).length;

  checks.push({
    id: "cv-length",
    label: "CV Length Appropriate",
    description: "ATS prefers CVs with 400-800 words of content",
    category: "format",
    weight: 2,
    status: totalWords >= 300 && totalWords <= 1000 ? "pass" : totalWords >= 150 ? "warn" : "fail",
    details: `Approximately ${totalWords} words of content`,
    fixTip: totalWords < 300 ? "Add more detail to your experience and skills" : "Consider condensing — keep it to 1-2 pages",
    isPremiumFix: true,
  });

  // --- JOB TITLE ---
  checks.push({
    id: "job-title",
    label: "Job Title Present",
    description: "Your current/target job title helps ATS categorize you",
    category: "content",
    weight: 2,
    status: cv.jobTitle ? "pass" : "fail",
    details: cv.jobTitle ? `Job title: "${cv.jobTitle}"` : "No job title specified",
    fixTip: "Add your current or target job title",
    isPremiumFix: false,
  });

  // --- FULL NAME ---
  checks.push({
    id: "full-name",
    label: "Full Name Present",
    description: "Your name is the first thing ATS looks for",
    category: "content",
    weight: 3,
    status: cv.fullName && cv.fullName.trim().includes(" ") ? "pass" : cv.fullName ? "warn" : "fail",
    details: cv.fullName ? `Name: "${cv.fullName}"` : "No name found",
    fixTip: "Include your full name (first and last)",
    isPremiumFix: false,
  });

  // --- CERTIFICATIONS BONUS ---
  checks.push({
    id: "certifications",
    label: "Certifications & Credentials",
    description: "Certifications boost ATS scores for specialized roles",
    category: "keywords",
    weight: 1,
    status: cv.certifications.filter((c) => c.name).length > 0 ? "pass" : "warn",
    details: cv.certifications.filter((c) => c.name).length > 0
      ? `${cv.certifications.filter((c) => c.name).length} certification(s) listed`
      : "No certifications — consider adding relevant ones",
    fixTip: "Add industry certifications to stand out",
    isPremiumFix: false,
  });

  return checks;
}

function computeScore(checks: AtsCheck[]): number {
  let totalWeight = 0;
  let earnedWeight = 0;
  for (const check of checks) {
    totalWeight += check.weight;
    if (check.status === "pass") earnedWeight += check.weight;
    else if (check.status === "warn") earnedWeight += check.weight * 0.5;
  }
  return totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
}

/* ------------------------------------------------------------------ */
/*  Score Circle Component                                             */
/* ------------------------------------------------------------------ */

function ScoreCircle({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400";
  const strokeColor =
    score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  const label =
    score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Needs Work" : "Poor";

  return (
    <div className="relative flex flex-col items-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r="54" strokeWidth="8" fill="none" className="stroke-zinc-800" />
        <motion.circle
          cx="70"
          cy="70"
          r="54"
          strokeWidth="8"
          fill="none"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn("text-3xl font-bold", color)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-zinc-500 mt-0.5">out of 100</span>
      </div>
      <p className={cn("mt-3 text-sm font-semibold", color)}>{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Category icons                                                     */
/* ------------------------------------------------------------------ */

const categoryIcons: Record<string, typeof Shield> = {
  format: Type,
  content: ListChecks,
  keywords: Target,
  structure: BarChart3,
};

const categoryLabels: Record<string, string> = {
  format: "Formatting",
  content: "Content",
  keywords: "Keywords",
  structure: "Structure",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "cvspark-cv-data";

export default function AtsCheckerPage() {
  const [cvData, setCvData] = useState<CvData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setCvData(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const checks = useMemo(() => (cvData ? analyzeCV(cvData) : []), [cvData]);
  const score = useMemo(() => computeScore(checks), [checks]);

  const passCount = checks.filter((c) => c.status === "pass").length;
  const warnCount = checks.filter((c) => c.status === "warn").length;
  const failCount = checks.filter((c) => c.status === "fail").length;
  const premiumFixCount = checks.filter((c) => c.isPremiumFix && c.status !== "pass").length;

  const categories = ["content", "format", "keywords"] as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/60 ring-1 ring-zinc-700/50 mx-auto mb-6">
            <Shield className="h-8 w-8 text-zinc-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">No CV Found</h1>
          <p className="text-zinc-400 mb-8">Create or edit a CV first, then come back to check its ATS compatibility.</p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            <FileText className="h-4 w-4" />
            Go to CV Builder
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <Shield size={16} className="text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white">ATS Compatibility Checker</h1>
                <p className="text-[11px] text-zinc-500">Analyzing: {cvData.fullName || "Your CV"}</p>
              </div>
            </div>
          </div>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700 transition-colors"
          >
            <FileText size={14} />
            Edit CV
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
        {/* Score Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ScoreCircle score={score} />

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold text-white mb-2">ATS Compatibility Score</h2>
              <p className="text-sm text-zinc-400 mb-5 max-w-lg">
                {score >= 80
                  ? "Your CV is well-optimized for ATS systems. It should pass through most automated screenings."
                  : score >= 60
                  ? "Your CV has decent ATS compatibility but there are areas that could be improved to increase your chances."
                  : "Your CV needs significant improvements to pass ATS screening. Many applications may be automatically rejected."}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-sm text-zinc-300"><strong className="text-emerald-400">{passCount}</strong> Passed</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-400" />
                  <span className="text-sm text-zinc-300"><strong className="text-amber-400">{warnCount}</strong> Warnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle size={16} className="text-red-400" />
                  <span className="text-sm text-zinc-300"><strong className="text-red-400">{failCount}</strong> Failed</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fix All CTA */}
        {(failCount > 0 || warnCount > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-indigo-600/5 p-6"
          >
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />
            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25 shrink-0">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-white mb-1">
                  Fix {premiumFixCount} Issue{premiumFixCount !== 1 ? "s" : ""} with AI-Powered ATS Optimizer
                </h3>
                <p className="text-sm text-zinc-400">
                  Our AI will rewrite your bullet points, optimize keywords, adjust formatting, and boost your score to 90+
                </p>
              </div>
              <button
                onClick={() => setShowPaywall(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-purple-500 transition-all shrink-0"
              >
                <Crown className="h-4 w-4" />
                Fix All Issues
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Detailed Checks by Category */}
        {categories.map((cat) => {
          const catChecks = checks.filter((c) => c.category === cat);
          if (catChecks.length === 0) return null;
          const CatIcon = categoryIcons[cat] || Shield;

          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * categories.indexOf(cat) + 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
                  <CatIcon size={16} className="text-zinc-400" />
                </div>
                <h2 className="text-base font-semibold text-white">{categoryLabels[cat]}</h2>
                <span className="text-xs text-zinc-500">
                  {catChecks.filter((c) => c.status === "pass").length}/{catChecks.length} passed
                </span>
              </div>

              <div className="space-y-2">
                {catChecks.map((check) => {
                  const isExpanded = expandedCheck === check.id;
                  return (
                    <div
                      key={check.id}
                      className={cn(
                        "rounded-xl border bg-zinc-900/60 overflow-hidden transition-all",
                        check.status === "pass"
                          ? "border-zinc-800/60"
                          : check.status === "warn"
                          ? "border-amber-500/20"
                          : "border-red-500/20"
                      )}
                    >
                      <button
                        onClick={() => setExpandedCheck(isExpanded ? null : check.id)}
                        className="flex items-center gap-3 w-full px-4 py-3.5 text-left"
                      >
                        {check.status === "pass" ? (
                          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                        ) : check.status === "warn" ? (
                          <AlertTriangle size={18} className="text-amber-400 shrink-0" />
                        ) : (
                          <XCircle size={18} className="text-red-400 shrink-0" />
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{check.label}</span>
                            {check.weight === 3 && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">HIGH</span>
                            )}
                            {check.isPremiumFix && check.status !== "pass" && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 flex items-center gap-0.5">
                                <Crown size={8} />
                                PRO FIX
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 mt-0.5">{check.details}</p>
                        </div>

                        {isExpanded ? (
                          <ChevronUp size={16} className="text-zinc-500 shrink-0" />
                        ) : (
                          <ChevronDown size={16} className="text-zinc-500 shrink-0" />
                        )}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0 border-t border-zinc-800/60">
                              <p className="text-xs text-zinc-400 mt-3 mb-2">{check.description}</p>
                              {check.status !== "pass" && (
                                <div className="rounded-lg bg-zinc-800/60 p-3 mt-2">
                                  <p className="text-xs text-zinc-300">
                                    <strong className="text-indigo-400">Fix:</strong> {check.fixTip}
                                  </p>
                                  {check.isPremiumFix && (
                                    <button
                                      onClick={() => setShowPaywall(true)}
                                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600/15 px-3 py-1.5 text-xs font-semibold text-indigo-400 ring-1 ring-indigo-500/20 hover:bg-indigo-600/25 transition-colors"
                                    >
                                      <Zap size={12} />
                                      Auto-fix with AI
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center py-8"
        >
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to CV Builder
          </Link>
        </motion.div>
      </main>

      {/* ============================================================= */}
      {/* PAYWALL MODAL                                                  */}
      {/* ============================================================= */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPaywall(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/60 overflow-hidden"
            >
              {/* Header gradient */}
              <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 px-8 py-10 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)]" />
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm mx-auto mb-4">
                    <Crown className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">ATS Optimizer Pro</h2>
                  <p className="text-sm text-indigo-200">Boost your ATS score to 90+ with AI-powered fixes</p>
                </div>
              </div>

              {/* Features */}
              <div className="px-8 py-6 space-y-4">
                {[
                  { icon: Zap, text: "AI rewrites bullet points with action verbs and metrics" },
                  { icon: Target, text: "Keyword optimization matched to your target role" },
                  { icon: Type, text: "Format adjustments for maximum ATS compatibility" },
                  { icon: TrendingUp, text: "Score guarantee — reach 90+ or your money back" },
                  { icon: Shield, text: "Unlimited re-checks after optimization" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 shrink-0">
                      <Icon size={16} className="text-indigo-400" />
                    </div>
                    <span className="text-sm text-zinc-300">{text}</span>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="px-8 pb-8 space-y-3">
                {/* One-time */}
                <button
                  onClick={() => alert("Payment integration coming soon! This feature is under development.")}
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-left hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/20 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">One-Time Fix</p>
                      <p className="text-xs text-indigo-200 mt-0.5">Fix this CV once</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">$4.99</p>
                      <p className="text-[10px] text-indigo-200">one-time</p>
                    </div>
                  </div>
                </button>

                {/* Pro plan */}
                <button
                  onClick={() => alert("Payment integration coming soon! This feature is under development.")}
                  className="w-full rounded-xl border-2 border-indigo-500/50 bg-indigo-500/5 px-6 py-4 text-left hover:border-indigo-500 hover:bg-indigo-500/10 transition-all group relative"
                >
                  <div className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-indigo-600 text-[10px] font-bold text-white uppercase tracking-wider">
                    Best Value
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">Pro Plan</p>
                      <p className="text-xs text-zinc-400 mt-0.5">Unlimited CVs, ATS fixes, premium templates</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">$9.99<span className="text-sm font-normal text-zinc-400">/mo</span></p>
                      <p className="text-[10px] text-indigo-400">cancel anytime</p>
                    </div>
                  </div>
                </button>

                {/* Close */}
                <button
                  onClick={() => setShowPaywall(false)}
                  className="w-full text-center text-sm text-zinc-500 hover:text-zinc-300 transition-colors py-2"
                >
                  Maybe later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
