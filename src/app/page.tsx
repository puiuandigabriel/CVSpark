"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useScroll } from "framer-motion";
import {
  Sparkles,
  LayoutTemplate,
  Wand2,
  ScanSearch,
  Eye,
  Download,
  Upload,
  BrainCircuit,
  FileDown,
  Check,
  Star,
  Menu,
  X,
  ArrowRight,
  Globe,
  MessageCircle,
  Users,
  GraduationCap,
  Award,
  BookOpen,
  ExternalLink,
  Clock,
  BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUser, signOut } from "@/lib/supabase/auth";

/* ------------------------------------------------------------------ */
/*  ANIMATION HELPERS                                                  */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={cn("w-full px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  MINI CV PREVIEW HELPERS                                            */
/* ------------------------------------------------------------------ */

const Line = ({ w, c = "bg-zinc-300" }: { w: string; c?: string }) => (
  <div className={cn("h-[3px] rounded-full", c)} style={{ width: w }} />
);
const Lines = ({ n = 3, c }: { n?: number; c?: string }) => (
  <div className="space-y-[3px]">
    {Array.from({ length: n }).map((_, i) => (
      <Line key={i} w={i === n - 1 ? "60%" : "100%"} c={c} />
    ))}
  </div>
);

function AuroraPreview() {
  return (
    <div className="flex h-full w-full overflow-hidden rounded bg-white">
      <div className="w-[35%] bg-indigo-800 p-3 flex flex-col gap-3">
        <div className="mx-auto h-8 w-8 rounded-full bg-indigo-300" />
        <div className="space-y-[3px]">
          <Line w="80%" c="bg-indigo-300" />
          <Line w="60%" c="bg-indigo-400" />
        </div>
        <div className="mt-1 space-y-[3px]">
          <Line w="90%" c="bg-indigo-400" />
          <Line w="70%" c="bg-indigo-400" />
          <Line w="50%" c="bg-indigo-400" />
        </div>
        <div className="mt-auto space-y-[3px]">
          <Line w="85%" c="bg-indigo-400" />
          <Line w="65%" c="bg-indigo-400" />
        </div>
      </div>
      <div className="flex-1 p-3 space-y-3">
        <Line w="70%" c="bg-zinc-800" />
        <Line w="40%" c="bg-zinc-400" />
        <div className="border-t border-zinc-200 pt-2">
          <Lines n={4} />
        </div>
        <div className="border-t border-zinc-200 pt-2">
          <Lines n={3} />
        </div>
      </div>
    </div>
  );
}

function PrismPreview() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded bg-white relative">
      <div className="h-12 bg-gradient-to-r from-pink-500 to-purple-600 -skew-y-2 origin-top-left" />
      <div className="p-3 space-y-3 -mt-1">
        <Line w="55%" c="bg-zinc-800" />
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-pink-400 mt-[2px] shrink-0" />
          <Lines n={2} />
        </div>
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-purple-400 mt-[2px] shrink-0" />
          <Lines n={2} />
        </div>
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-pink-400 mt-[2px] shrink-0" />
          <Lines n={3} />
        </div>
      </div>
    </div>
  );
}

function CipherPreview() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded bg-[#1e1e2e]">
      <div className="flex gap-1 p-2 pb-0">
        <div className="h-2 w-2 rounded-full bg-red-500" />
        <div className="h-2 w-2 rounded-full bg-yellow-500" />
        <div className="h-2 w-2 rounded-full bg-green-500" />
      </div>
      <div className="p-3 space-y-3 flex-1">
        <Line w="60%" c="bg-green-400" />
        <Line w="40%" c="bg-zinc-500" />
        <div className="space-y-2 pt-1">
          <Line w="30%" c="bg-green-400/60" />
          <div className="flex gap-1">
            <div className="h-[6px] flex-1 rounded-full bg-zinc-700">
              <div className="h-full w-[85%] rounded-full bg-green-500" />
            </div>
          </div>
          <div className="flex gap-1">
            <div className="h-[6px] flex-1 rounded-full bg-zinc-700">
              <div className="h-full w-[70%] rounded-full bg-green-500" />
            </div>
          </div>
          <div className="flex gap-1">
            <div className="h-[6px] flex-1 rounded-full bg-zinc-700">
              <div className="h-full w-[60%] rounded-full bg-green-500" />
            </div>
          </div>
        </div>
        <Lines n={3} c="bg-zinc-600" />
      </div>
    </div>
  );
}

function MeridianPreview() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded bg-white">
      <div className="bg-[#1e3a5f] p-3 pb-2">
        <Line w="55%" c="bg-white" />
        <Line w="35%" c="bg-blue-300" />
        <div className="mt-1 h-[2px] w-full bg-[#d4a574]" />
      </div>
      <div className="flex-1 p-3 space-y-3">
        <div>
          <Line w="30%" c="bg-[#1e3a5f]" />
          <div className="mt-1 h-[1px] bg-zinc-200" />
          <div className="mt-1">
            <Lines n={3} />
          </div>
        </div>
        <div>
          <Line w="25%" c="bg-[#1e3a5f]" />
          <div className="mt-1 h-[1px] bg-zinc-200" />
          <div className="mt-1">
            <Lines n={3} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SparkPreview() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded bg-white">
      <div className="bg-gradient-to-r from-indigo-500 to-violet-600 p-3 flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-white/30" />
        <div className="space-y-[3px] flex-1">
          <Line w="60%" c="bg-white" />
          <Line w="40%" c="bg-indigo-200" />
        </div>
      </div>
      <div className="p-3 space-y-2 flex-1">
        <Line w="30%" c="bg-indigo-600" />
        <div className="space-y-[5px]">
          <div className="flex items-center gap-1">
            <span className="text-[5px] text-zinc-500 w-6 shrink-0">React</span>
            <div className="h-[5px] flex-1 rounded-full bg-zinc-100">
              <div className="h-full w-[90%] rounded-full bg-indigo-500" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[5px] text-zinc-500 w-6 shrink-0">TS</span>
            <div className="h-[5px] flex-1 rounded-full bg-zinc-100">
              <div className="h-full w-[80%] rounded-full bg-violet-500" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[5px] text-zinc-500 w-6 shrink-0">Node</span>
            <div className="h-[5px] flex-1 rounded-full bg-zinc-100">
              <div className="h-full w-[70%] rounded-full bg-indigo-400" />
            </div>
          </div>
        </div>
        <Lines n={3} />
      </div>
    </div>
  );
}

function OnyxPreview() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded bg-zinc-900 p-3 space-y-3">
      <div className="space-y-[3px]">
        <Line w="50%" c="bg-white" />
        <Line w="30%" c="bg-rose-400" />
      </div>
      <div className="h-[1px] bg-zinc-700" />
      <Lines n={3} c="bg-zinc-500" />
      <div className="h-[1px] bg-zinc-700" />
      <div className="flex gap-1 flex-wrap">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[10px] w-8 rounded bg-rose-500/20 border border-rose-500/40"
          />
        ))}
      </div>
      <Lines n={2} c="bg-zinc-600" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const templates = [
  { name: "Aurora", category: "Professional", Preview: AuroraPreview },
  { name: "Prism", category: "Creative", Preview: PrismPreview },
  { name: "Cipher", category: "Tech", Preview: CipherPreview },
  { name: "Meridian", category: "Professional", Preview: MeridianPreview },
  { name: "Spark", category: "Modern", Preview: SparkPreview },
  { name: "Onyx", category: "Minimal", Preview: OnyxPreview },
];

const companies = ["Google", "Microsoft", "Apple", "Amazon", "Meta", "Netflix"];

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                          */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [careerTab, setCareerTab] = useState<"certificates" | "courses" | "suggestions">("certificates");
  const { scrollYProgress } = useScroll();

  const navLinks = [
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.templates"), href: "#templates" },
    { label: "ATS Checker", href: "/ats-checker" },
    { label: t("career.title"), href: "#career" },
    { label: t("nav.reviews"), href: "#reviews" },
    { label: t("nav.pricing"), href: "#pricing" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      {/* ============================================================ */}
      {/*  NAVBAR                                                       */}
      {/* ============================================================ */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <motion.div
          className="h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 origin-left"
          style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        />
        <nav className="bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
          <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Sparkles className="h-6 w-6 text-indigo-400 transition-transform group-hover:scale-110" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                CV<span className="text-indigo-400">Spark</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <LanguageSwitcher />
              {authLoading ? (
                <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
              ) : user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                  <Link
                    href="/builder"
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors duration-200"
                  >
                    New CV
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors duration-200"
                  >
                    {t("nav.getStarted")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-zinc-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden border-t border-white/5 bg-zinc-950/95 backdrop-blur-xl px-4 pb-4 pt-2 space-y-3"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-zinc-400 hover:text-white py-2"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 flex items-center gap-3">
                <ThemeToggle />
                <LanguageSwitcher />
                {user ? (
                  <>
                    <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white">Dashboard</Link>
                    <button onClick={() => signOut()} className="text-sm text-zinc-500 hover:text-white">Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-sm text-zinc-400 hover:text-white">Sign In</Link>
                    <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white">
                      {t("nav.getStarted")}
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </nav>
      </header>

      {/* ============================================================ */}
      {/*  HERO SECTION                                                 */}
      {/* ============================================================ */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-[128px] animate-pulse" />
          <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-purple-600/20 blur-[100px] animate-pulse [animation-delay:1s]" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-600/15 blur-[100px] animate-pulse [animation-delay:2s]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-sm text-indigo-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI-Powered Resume Builder
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
              >
                {t("hero.title")}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                {t("hero.subtitle")}
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  href="/builder"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 hover:shadow-indigo-500/30 transition-all duration-300"
                >
                  <Wand2 className="h-4 w-4" />
                  {t("hero.startBuilding")}
                </Link>
                <Link
                  href="/templates"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/50 px-6 py-3.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all duration-300"
                >
                  <Eye className="h-4 w-4" />
                  {t("hero.viewTemplates")}
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex items-center gap-3 justify-center lg:justify-start"
              >
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-zinc-400">
                  {t("hero.trusted")}
                </span>
              </motion.div>
            </motion.div>

            {/* Right column - Floating CV mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeOut" as const,
                delay: 0.3,
              }}
              className="relative flex items-center justify-center"
            >
              {/* Glassmorphism floating elements */}
              <motion.div
                animate={{ y: [-8, 8, -8], rotate: [0, 3, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" as const }}
                className="absolute -top-4 -right-4 z-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-3 shadow-2xl"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">ATS Score</p>
                    <p className="text-xs text-green-400">95/100</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [6, -6, 6], rotate: [0, -2, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" as const, delay: 1 }}
                className="absolute -bottom-2 -left-4 z-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-3 shadow-2xl"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">AI Enhanced</p>
                    <p className="text-xs text-indigo-400">Content optimized</p>
                  </div>
                </div>
              </motion.div>

              {/* Main CV mockup */}
              <motion.div
                animate={{ y: [-6, 6, -6], rotateY: [-2, 2, -2] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" as const }}
                className="relative w-64 sm:w-72 rounded-2xl bg-white shadow-2xl shadow-indigo-500/10 overflow-hidden"
                style={{ aspectRatio: "3/4" }}
              >
                {/* CV content */}
                <div className="h-full flex flex-col">
                  <div className="bg-indigo-700 p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-300" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-2.5 w-3/4 rounded-full bg-white" />
                        <div className="h-2 w-1/2 rounded-full bg-indigo-300" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-4 space-y-4 bg-white">
                    <div>
                      <div className="h-2 w-20 rounded-full bg-indigo-600 mb-2" />
                      <div className="space-y-1.5">
                        <div className="h-1.5 w-full rounded-full bg-zinc-200" />
                        <div className="h-1.5 w-full rounded-full bg-zinc-200" />
                        <div className="h-1.5 w-3/4 rounded-full bg-zinc-200" />
                      </div>
                    </div>
                    <div>
                      <div className="h-2 w-16 rounded-full bg-indigo-600 mb-2" />
                      <div className="space-y-2">
                        {[85, 70, 60].map((w, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="h-1.5 w-12 rounded-full bg-zinc-300" />
                            <div className="h-2 flex-1 rounded-full bg-zinc-100">
                              <div
                                className="h-full rounded-full bg-indigo-500"
                                style={{ width: `${w}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="h-2 w-24 rounded-full bg-indigo-600 mb-2" />
                      <div className="space-y-1.5">
                        <div className="h-1.5 w-full rounded-full bg-zinc-200" />
                        <div className="h-1.5 w-full rounded-full bg-zinc-200" />
                        <div className="h-1.5 w-2/3 rounded-full bg-zinc-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  LOGOS BAR                                                     */}
      {/* ============================================================ */}
      <Section className="py-16 border-y border-white/5">
        <div className="mx-auto max-w-7xl">
          <motion.p
            variants={fadeUp}
            className="text-center text-sm text-zinc-500 mb-8 tracking-wider uppercase"
          >
            {t("hero.hiredAt")}
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6"
          >
            {companies.map((name) => (
              <span
                key={name}
                className="text-xl sm:text-2xl font-bold text-zinc-700 tracking-tight select-none"
              >
                {name}
              </span>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  FEATURES                                                     */}
      {/* ============================================================ */}
      <Section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {t("features.title")}
            </h2>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BrainCircuit,
                title: t("features.ai.title"),
                desc: t("features.ai.desc"),
                color: "text-indigo-400",
                bg: "bg-indigo-500/10",
              },
              {
                icon: LayoutTemplate,
                title: t("features.templates.title"),
                desc: t("features.templates.desc"),
                color: "text-purple-400",
                bg: "bg-purple-500/10",
              },
              {
                icon: Wand2,
                title: t("features.redesign.title"),
                desc: t("features.redesign.desc"),
                color: "text-pink-400",
                bg: "bg-pink-500/10",
              },
              {
                icon: ScanSearch,
                title: t("features.ats.title"),
                desc: t("features.ats.desc"),
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
              {
                icon: Eye,
                title: t("features.preview.title"),
                desc: t("features.preview.desc"),
                color: "text-amber-400",
                bg: "bg-amber-500/10",
              },
              {
                icon: FileDown,
                title: t("features.export.title"),
                desc: t("features.export.desc"),
                color: "text-cyan-400",
                bg: "bg-cyan-500/10",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div
                    className={cn(
                      "inline-flex h-12 w-12 items-center justify-center rounded-xl",
                      feature.bg
                    )}
                  >
                    <feature.icon className={cn("h-6 w-6", feature.color)} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  HOW IT WORKS                                                 */}
      {/* ============================================================ */}
      <Section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {t("howItWorks.title")}
            </h2>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
              {t("howItWorks.subtitle")}
            </p>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            {/* Connecting line */}
            <div className="absolute left-8 top-0 bottom-0 w-px border-l-2 border-dashed border-zinc-800 hidden sm:block" />

            {[
              {
                num: "1",
                icon: Upload,
                title: t("howItWorks.step1.title"),
                desc: t("howItWorks.step1.desc"),
              },
              {
                num: "2",
                icon: Wand2,
                title: t("howItWorks.step2.title"),
                desc: t("howItWorks.step2.desc"),
              },
              {
                num: "3",
                icon: Download,
                title: t("howItWorks.step3.title"),
                desc: t("howItWorks.step3.desc"),
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={cn(
                  "relative flex items-start gap-6 mb-12 last:mb-0",
                  i % 2 === 1 ? "sm:flex-row-reverse sm:text-right" : ""
                )}
              >
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold text-xl shadow-lg shadow-indigo-600/25">
                  {step.num}
                </div>
                <div
                  className={cn(
                    "flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6",
                    i % 2 === 1 ? "sm:mr-6" : "sm:ml-0"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center gap-3 mb-3",
                      i % 2 === 1 ? "sm:justify-end" : ""
                    )}
                  >
                    <step.icon className="h-5 w-5 text-indigo-400" />
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  TEMPLATES PREVIEW                                            */}
      {/* ============================================================ */}
      <Section id="templates" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {t("templates.title")}
            </h2>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
              {t("templates.subtitle")}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tpl, i) => (
              <motion.div
                key={tpl.name}
                variants={fadeUp}
                className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden hover:border-zinc-700 transition-all duration-300"
              >
                <div
                  className="w-full overflow-hidden bg-zinc-100"
                  style={{ aspectRatio: "3/4" }}
                >
                  <tpl.Preview />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{tpl.name}</h3>
                    <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
                      {tpl.category}
                    </span>
                  </div>
                  <Link
                    href={`/builder?template=${tpl.name.toLowerCase()}`}
                    className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200"
                  >
                    {t("templates.useTemplate")}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="mt-12 text-center">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200"
            >
              {t("templates.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  TESTIMONIALS                                                 */}
      {/* ============================================================ */}
      <Section id="reviews" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {t("reviews.title")}
            </h2>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
              {t("reviews.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Chen",
                role: "Software Engineer at Google",
                initials: "SC",
                color: "bg-indigo-600",
                quote:
                  "CVSpark transformed my job search. The AI suggestions were incredibly accurate and helped me land interviews at top tech companies.",
              },
              {
                name: "Marcus Rivera",
                role: "Product Manager at Stripe",
                initials: "MR",
                color: "bg-purple-600",
                quote:
                  "The templates are stunning and ATS-friendly. I went from zero callbacks to multiple offers in just two weeks.",
              },
              {
                name: "Emily Watson",
                role: "UX Designer at Figma",
                initials: "EW",
                color: "bg-pink-600",
                quote:
                  "As a designer, I appreciate the attention to detail. The CV layouts are beautiful, professional, and completely customizable.",
              },
            ].map((review, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold text-white",
                      review.color
                    )}
                  >
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{review.name}</p>
                    <p className="text-xs text-zinc-500">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  CAREER RESOURCES                                             */}
      {/* ============================================================ */}
      <Section id="career" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-medium text-indigo-400 tracking-wide uppercase">
              {t("career.title")}
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              {t("career.subtitle")}
            </h2>
          </motion.div>

          {/* Category tabs */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {([
              { key: "certificates" as const, label: t("career.freeCertificates"), icon: Award },
              { key: "courses" as const, label: t("career.courses"), icon: BookOpen },
              { key: "suggestions" as const, label: t("career.suggestions"), icon: GraduationCap },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setCareerTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
                  careerTab === tab.key
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                    : "border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Course cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(careerTab === "certificates" ? [
              {
                title: "Google Project Management Certificate",
                provider: "Google / Coursera",
                duration: "6 months",
                free: true,
                cert: true,
                category: "Management",
                color: "from-blue-500 to-cyan-500",
                skills: ["Agile", "Scrum", "Risk Management", "Stakeholder Communication"],
                url: "https://www.coursera.org/professional-certificates/google-project-management",
              },
              {
                title: "IBM Data Science Professional Certificate",
                provider: "IBM / Coursera",
                duration: "4 months",
                free: true,
                cert: true,
                category: "Data Science",
                color: "from-indigo-500 to-purple-500",
                skills: ["Python", "SQL", "Machine Learning", "Data Visualization"],
                url: "https://www.coursera.org/professional-certificates/ibm-data-science",
              },
              {
                title: "Meta Front-End Developer Certificate",
                provider: "Meta / Coursera",
                duration: "7 months",
                free: true,
                cert: true,
                category: "Development",
                color: "from-emerald-500 to-teal-500",
                skills: ["React", "JavaScript", "UX/UI", "Version Control"],
                url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
              },
              {
                title: "HubSpot Digital Marketing Certificate",
                provider: "HubSpot Academy",
                duration: "4 hours",
                free: true,
                cert: true,
                category: "Marketing",
                color: "from-orange-500 to-amber-500",
                skills: ["SEO", "Content Marketing", "Social Media", "Email Marketing"],
                url: "https://academy.hubspot.com/courses/digital-marketing",
              },
              {
                title: "AWS Cloud Practitioner Essentials",
                provider: "Amazon / AWS",
                duration: "6 hours",
                free: true,
                cert: true,
                category: "Cloud",
                color: "from-yellow-500 to-orange-500",
                skills: ["Cloud Computing", "AWS Services", "Security", "Architecture"],
                url: "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/",
              },
              {
                title: "LinkedIn Learning Career Essentials",
                provider: "LinkedIn Learning",
                duration: "10 hours",
                free: true,
                cert: true,
                category: "Soft Skills",
                color: "from-pink-500 to-rose-500",
                skills: ["Leadership", "Communication", "Problem Solving", "Teamwork"],
                url: "https://www.linkedin.com/learning/paths/career-essentials",
              },
            ] : careerTab === "courses" ? [
              {
                title: "CS50: Introduction to Computer Science",
                provider: "Harvard / edX",
                duration: "12 weeks",
                free: true,
                cert: true,
                category: "Computer Science",
                color: "from-red-500 to-rose-500",
                skills: ["C", "Python", "Algorithms", "Data Structures"],
                url: "https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science",
              },
              {
                title: "The Science of Well-Being",
                provider: "Yale / Coursera",
                duration: "10 weeks",
                free: true,
                cert: true,
                category: "Psychology",
                color: "from-violet-500 to-purple-500",
                skills: ["Mindfulness", "Productivity", "Habits", "Mental Health"],
                url: "https://www.coursera.org/learn/the-science-of-well-being",
              },
              {
                title: "Machine Learning Specialization",
                provider: "Stanford / Coursera",
                duration: "3 months",
                free: true,
                cert: true,
                category: "AI / ML",
                color: "from-cyan-500 to-blue-500",
                skills: ["Neural Networks", "TensorFlow", "Regression", "Clustering"],
                url: "https://www.coursera.org/specializations/machine-learning-introduction",
              },
              {
                title: "Excel Skills for Business",
                provider: "Macquarie / Coursera",
                duration: "6 months",
                free: true,
                cert: true,
                category: "Business",
                color: "from-green-500 to-emerald-500",
                skills: ["Excel", "Data Analysis", "Formulas", "Dashboards"],
                url: "https://www.coursera.org/specializations/excel",
              },
              {
                title: "UX Design Professional Certificate",
                provider: "Google / Coursera",
                duration: "6 months",
                free: true,
                cert: true,
                category: "Design",
                color: "from-teal-500 to-cyan-500",
                skills: ["Figma", "User Research", "Wireframing", "Prototyping"],
                url: "https://www.coursera.org/professional-certificates/google-ux-design",
              },
              {
                title: "Financial Markets",
                provider: "Yale / Coursera",
                duration: "7 weeks",
                free: true,
                cert: true,
                category: "Finance",
                color: "from-amber-500 to-yellow-500",
                skills: ["Investment", "Risk Management", "Banking", "Insurance"],
                url: "https://www.coursera.org/learn/financial-markets-global",
              },
            ] : [
              {
                title: "Build a Portfolio Website",
                provider: "Career Advice",
                duration: "1-2 weeks",
                free: true,
                cert: false,
                category: "Visibility",
                color: "from-indigo-500 to-violet-500",
                skills: ["Personal Branding", "Web Presence", "Showcasing Work", "SEO"],
                url: "https://www.freecodecamp.org/news/how-to-build-a-developer-portfolio-website/",
              },
              {
                title: "Optimize Your LinkedIn Profile",
                provider: "Career Advice",
                duration: "2-3 hours",
                free: true,
                cert: false,
                category: "Networking",
                color: "from-blue-500 to-indigo-500",
                skills: ["Networking", "Personal Brand", "Recruiter Visibility", "Keywords"],
                url: "https://www.linkedin.com/help/linkedin/answer/a522441",
              },
              {
                title: "Practice Mock Interviews",
                provider: "Career Advice",
                duration: "Ongoing",
                free: true,
                cert: false,
                category: "Interview Prep",
                color: "from-emerald-500 to-green-500",
                skills: ["STAR Method", "Behavioral Questions", "Technical Skills", "Confidence"],
                url: "https://grow.google/certificates/interview-warmup/",
              },
              {
                title: "Learn Git & GitHub for Collaboration",
                provider: "GitHub",
                duration: "4 hours",
                free: true,
                cert: true,
                category: "Development",
                color: "from-zinc-500 to-zinc-400",
                skills: ["Git", "Version Control", "Pull Requests", "Collaboration"],
                url: "https://skills.github.com/",
              },
              {
                title: "Contribute to Open Source Projects",
                provider: "Career Advice",
                duration: "Ongoing",
                free: true,
                cert: false,
                category: "Experience",
                color: "from-orange-500 to-red-500",
                skills: ["Collaboration", "Code Review", "Real Projects", "Community"],
                url: "https://opensource.guide/how-to-contribute/",
              },
              {
                title: "Develop Public Speaking Skills",
                provider: "Toastmasters",
                duration: "Ongoing",
                free: true,
                cert: false,
                category: "Soft Skills",
                color: "from-pink-500 to-fuchsia-500",
                skills: ["Presentations", "Confidence", "Leadership", "Communication"],
                url: "https://www.toastmasters.org/resources/public-speaking-tips",
              },
            ]).map((course, i) => (
              <motion.div
                key={course.title}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden hover:border-indigo-500/40 transition-all duration-300"
              >
                {/* Top accent bar */}
                <div className={cn("h-1.5 bg-gradient-to-r", course.color)} />

                <div className="p-6">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-3">
                    {course.free && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs text-emerald-400 font-medium">
                        <BadgeCheck className="h-3 w-3" />
                        {t("career.free")}
                      </span>
                    )}
                    {course.cert && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 text-xs text-indigo-400 font-medium">
                        <Award className="h-3 w-3" />
                        {t("career.certificate")}
                      </span>
                    )}
                    <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
                      {course.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                    {course.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5" />
                      {course.provider}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {course.duration}
                    </span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {course.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-zinc-800/80 px-2 py-0.5 text-xs text-zinc-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
                    >
                      {t("career.viewCourse")}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <Link
                      href="/builder"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                      {t("career.addToCV")}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  PRICING                                                      */}
      {/* ============================================================ */}
      <Section id="pricing" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {t("pricing.title")}
            </h2>
            <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
              {t("pricing.subtitle")}
            </p>
          </motion.div>

          {/* Toggle */}
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-center gap-4 mb-12"
          >
            <span
              className={cn(
                "text-sm font-medium",
                !annual ? "text-white" : "text-zinc-500"
              )}
            >
              {t("pricing.monthly")}
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={cn(
                "relative h-7 w-12 rounded-full transition-colors duration-300",
                annual ? "bg-indigo-600" : "bg-zinc-700"
              )}
            >
              <div
                className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300"
                style={{
                  transform: annual ? "translateX(20px)" : "translateX(0px)",
                }}
              />
            </button>
            <span
              className={cn(
                "text-sm font-medium",
                annual ? "text-white" : "text-zinc-500"
              )}
            >
              {t("pricing.annual")}
            </span>
            {annual && (
              <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 text-xs text-green-400 font-medium">
                {t("pricing.save40")}
              </span>
            )}
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: t("pricing.free"),
                price: "$0",
                priceAnnual: "$0",
                cta: t("pricing.getStarted"),
                highlighted: false,
                features: [
                  "1 CV Template",
                  "Basic AI Suggestions",
                  "PDF Export",
                  "Standard Support",
                ],
              },
              {
                name: t("pricing.pro"),
                price: "$12",
                priceAnnual: "$7",
                cta: t("pricing.getStarted"),
                highlighted: true,
                badge: t("pricing.popular"),
                features: [
                  "All Templates",
                  "Advanced AI Writing",
                  "ATS Optimization",
                  "Multiple Formats",
                  "Priority Support",
                  "Custom Branding",
                ],
              },
              {
                name: t("pricing.enterprise"),
                price: "$29",
                priceAnnual: "$17",
                cta: t("pricing.contactSales"),
                highlighted: false,
                features: [
                  "Everything in Pro",
                  "Team Management",
                  "API Access",
                  "Custom Templates",
                  "Dedicated Support",
                  "SSO & SAML",
                  "Analytics Dashboard",
                ],
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className={cn(
                  "relative rounded-2xl border p-6 transition-all duration-300",
                  plan.highlighted
                    ? "border-indigo-500 bg-zinc-900 shadow-xl shadow-indigo-500/10 scale-[1.02]"
                    : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">
                      {annual ? plan.priceAnnual : plan.price}
                    </span>
                    <span className="text-zinc-500">/{t("pricing.month")}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span className="text-zinc-300">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/builder"
                  className={cn(
                    "block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all duration-300",
                    plan.highlighted
                      ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/25"
                      : "border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  )}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  CTA BANNER                                                   */}
      {/* ============================================================ */}
      <Section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 px-8 py-16 sm:px-16 text-center"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {t("cta.title")}
              </h2>
              <p className="mt-4 text-lg text-indigo-100 max-w-xl mx-auto">
                {t("cta.subtitle")}
              </p>
              <Link
                href="/builder"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-semibold text-indigo-700 shadow-xl hover:bg-indigo-50 transition-all duration-300"
              >
                {t("cta.button")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/*  FOOTER                                                       */}
      {/* ============================================================ */}
      <footer className="border-t border-white/5 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {/* Logo + description */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-indigo-400" />
                <span className="text-lg font-bold tracking-tight">
                  CV<span className="text-indigo-400">Spark</span>
                </span>
              </Link>
              <p className="mt-4 text-sm text-zinc-500 max-w-xs leading-relaxed">
                AI-powered resume builder that helps you create stunning,
                ATS-optimized CVs in minutes.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <a
                  href="/"
                  className="text-zinc-600 hover:text-zinc-400 transition-colors"
                  title="Website"
                >
                  <Globe className="h-5 w-5" />
                </a>
                <a
                  href="/"
                  className="text-zinc-600 hover:text-zinc-400 transition-colors"
                  title="Chat"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a
                  href="/"
                  className="text-zinc-600 hover:text-zinc-400 transition-colors"
                  title="Community"
                >
                  <Users className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                {[
                  { label: "Features", href: "/builder" },
                  { label: "Templates", href: "/templates" },
                  { label: "Pricing", href: "/builder" },
                  { label: "Changelog", href: "/builder" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                {["Blog", "Resume Tips", "Career Guide", "Help Center"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        href="/"
                        className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                {["About", "Careers", "Contact", "Press"].map((item) => (
                  <li key={item}>
                    <Link
                      href="/"
                      className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                {["Privacy", "Terms", "Cookies", "Licenses"].map((item) => (
                  <li key={item}>
                    <Link
                      href="/"
                      className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-zinc-600">
              &copy; {new Date().getFullYear()} CVSpark. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
