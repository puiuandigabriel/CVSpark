"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Layout,
  Sparkles,
  Settings,
  Bell,
  Plus,
  Eye,
  Download,
  TrendingUp,
  TrendingDown,
  Edit3,
  Copy,
  Trash2,
  ChevronRight,
  Menu,
  X,
  Clock,
  Share2,
  User,
  Zap,
  ArrowUpRight,
  Lightbulb,
  Upload,
  Link2,
  MessageSquare,
  FileUp,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type NavTab = "dashboard" | "cvs" | "cover-letters" | "settings";

const navItems: {
  label: string;
  tKey: string;
  icon: typeof LayoutDashboard;
  tab?: NavTab;
  href?: string;
}[] = [
  { label: "Dashboard", tKey: "dashboard.title", icon: LayoutDashboard, tab: "dashboard" },
  { label: "My CVs", tKey: "dashboard.myCVs", icon: FileText, tab: "cvs" },
  { label: "Templates", tKey: "dashboard.templates", icon: Layout, href: "/templates" },
  { label: "AI Assistant", tKey: "dashboard.aiAssistant", icon: Sparkles, href: "/builder" },
  { label: "Cover Letters", tKey: "dashboard.coverLetters", icon: MessageSquare, tab: "cover-letters" },
  { label: "Settings", tKey: "dashboard.settings", icon: Settings, tab: "settings" },
];

const statsCards = [
  {
    labelKey: "dashboard.totalCVs",
    fallback: "Total CVs",
    value: "12",
    icon: FileText,
    trend: "+12% this month",
    up: true,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    ring: "ring-indigo-500/20",
  },
  {
    labelKey: "dashboard.viewsThisMonth",
    fallback: "Total Views",
    value: "1,247",
    icon: Eye,
    trend: "+24% this month",
    up: true,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/20",
  },
  {
    labelKey: "dashboard.downloads",
    fallback: "Downloads",
    value: "89",
    icon: Download,
    trend: "+8% this month",
    up: true,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    ring: "ring-purple-500/20",
  },
  {
    labelKey: "dashboard.aiCredits",
    fallback: "AI Credits",
    value: "450",
    max: 500,
    icon: Sparkles,
    trend: "50 used this month",
    up: false,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/20",
    hasProgress: true,
  },
];

const recentCVs = [
  {
    name: "Software Engineer Resume",
    lastEdited: "2 hours ago",
    status: "Complete",
    template: "Modern Pro",
    completion: 100,
    accent: "from-indigo-500 to-blue-500",
    statusColor: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
  },
  {
    name: "Marketing Manager CV",
    lastEdited: "1 day ago",
    status: "Draft",
    template: "Classic",
    completion: 68,
    accent: "from-rose-500 to-pink-500",
    statusColor: "bg-amber-500/15 text-amber-400 ring-amber-500/20",
  },
  {
    name: "Data Analyst CV",
    lastEdited: "2 days ago",
    status: "Shared",
    template: "Minimal",
    completion: 100,
    accent: "from-emerald-500 to-teal-500",
    statusColor: "bg-blue-500/15 text-blue-400 ring-blue-500/20",
  },
  {
    name: "Product Designer Resume",
    lastEdited: "3 hours ago",
    status: "Complete",
    template: "Creative",
    completion: 85,
    accent: "from-amber-500 to-orange-500",
    statusColor: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
  },
  {
    name: "Project Manager CV",
    lastEdited: "5 days ago",
    status: "Draft",
    template: "Executive",
    completion: 45,
    accent: "from-purple-500 to-violet-500",
    statusColor: "bg-amber-500/15 text-amber-400 ring-amber-500/20",
  },
  {
    name: "UX Researcher Resume",
    lastEdited: "1 week ago",
    status: "Complete",
    template: "Modern Pro",
    completion: 92,
    accent: "from-cyan-500 to-sky-500",
    statusColor: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
  },
];

const aiSuggestions = [
  {
    title: "Strengthen your summary section",
    description: "Your Software Engineer CV summary could be more impactful. AI found 3 improvements.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Add quantifiable achievements",
    description: "Adding metrics to your Marketing CV could increase interview callbacks by 40%.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Update skills for 2026 trends",
    description: "Consider adding AI/ML, Rust, and WebAssembly to stay competitive.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
];

const quickActions = [
  { tKey: "dashboard.importLinkedin", icon: Link2, color: "text-blue-400", bg: "bg-blue-500/10" },
  { tKey: "dashboard.uploadCV", icon: FileUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { tKey: "dashboard.aiReview", icon: Bot, color: "text-purple-400", bg: "bg-purple-500/10" },
];

const activityItems = [
  {
    text: "Created Product Designer Resume",
    time: "2 hours ago",
    icon: Plus,
    color: "text-emerald-400",
    dot: "bg-emerald-500",
  },
  {
    text: "Downloaded Software Engineer Resume as PDF",
    time: "5 hours ago",
    icon: Download,
    color: "text-blue-400",
    dot: "bg-blue-500",
  },
  {
    text: "AI improved Marketing Manager CV",
    time: "1 day ago",
    icon: Sparkles,
    color: "text-purple-400",
    dot: "bg-purple-500",
  },
  {
    text: "Shared Data Analyst CV via link",
    time: "2 days ago",
    icon: Share2,
    color: "text-amber-400",
    dot: "bg-amber-500",
  },
  {
    text: "Updated profile information",
    time: "3 days ago",
    icon: User,
    color: "text-zinc-400",
    dot: "bg-zinc-500",
  },
];

// ---------------------------------------------------------------------------
// Animations
// ---------------------------------------------------------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.45, ease: "easeOut" as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.05 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.04, duration: 0.4, ease: "easeOut" as const },
  }),
};

// ---------------------------------------------------------------------------
// Mini CV Thumbnail Component
// ---------------------------------------------------------------------------

function CvThumbnail({ accent }: { accent: string }) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-lg bg-zinc-800/60 border border-zinc-700/50 overflow-hidden group-hover:border-zinc-600/50 transition-colors">
      {/* Top accent bar */}
      <div className={cn("h-1.5 w-full bg-gradient-to-r", accent)} />
      {/* Mock content lines */}
      <div className="p-3 space-y-2">
        <div className="h-2.5 w-3/4 rounded-full bg-zinc-700/80" />
        <div className="h-1.5 w-full rounded-full bg-zinc-700/50" />
        <div className="h-1.5 w-5/6 rounded-full bg-zinc-700/50" />
        <div className="mt-3 h-1.5 w-2/3 rounded-full bg-zinc-700/40" />
        <div className="h-1.5 w-full rounded-full bg-zinc-700/30" />
        <div className="h-1.5 w-4/5 rounded-full bg-zinc-700/30" />
        <div className="mt-3 space-y-1">
          <div className="h-1 w-full rounded-full bg-zinc-700/20" />
          <div className="h-1 w-3/4 rounded-full bg-zinc-700/20" />
          <div className="h-1 w-5/6 rounded-full bg-zinc-700/20" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      {/* ----------------------------------------------------------------- */}
      {/* Mobile sidebar overlay                                            */}
      {/* ----------------------------------------------------------------- */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" as const }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------------------- */}
      {/* Sidebar                                                           */}
      {/* ----------------------------------------------------------------- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[17rem] flex-col border-r border-zinc-800/80 bg-zinc-900/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-zinc-800/80">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              CVSpark
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => {
            const isActive = item.tab ? activeTab === item.tab : false;
            const cls = cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 w-full",
              isActive
                ? "bg-indigo-600/15 text-indigo-400 shadow-sm shadow-indigo-500/5"
                : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200"
            );
            const content = (
              <>
                <item.icon className={cn("h-[18px] w-[18px]", isActive && "text-indigo-400")} />
                {t(item.tKey)}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />
                )}
              </>
            );

            return item.href ? (
              <Link key={item.label} href={item.href} className={cls}>
                {content}
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={() => { setActiveTab(item.tab!); setSidebarOpen(false); }}
                className={cn(cls, "text-left")}
              >
                {content}
              </button>
            );
          })}
        </nav>

        {/* Upgrade banner */}
        <div className="mx-3 mb-4">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-indigo-600/10 border border-indigo-500/20 p-4">
            <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-indigo-500/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Pro Plan</span>
              </div>
              <p className="text-xs text-zinc-400 mb-3">Unlock unlimited AI credits, premium templates & more.</p>
              <button onClick={() => alert("Pro upgrade coming soon!")} className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-3 py-2 text-xs font-semibold text-white hover:from-indigo-500 hover:to-indigo-400 transition-all shadow-lg shadow-indigo-500/25">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="border-t border-zinc-800/80 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold ring-2 ring-indigo-500/20">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-white">Alex Johnson</p>
              <p className="truncate text-xs text-zinc-500">alex@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ----------------------------------------------------------------- */}
      {/* Main content area                                                 */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* --------------------------------------------------------------- */}
        {/* Top header bar                                                   */}
        {/* --------------------------------------------------------------- */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-zinc-800/80 bg-zinc-950/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-base font-semibold text-white sm:text-lg">
                Welcome back, Alex <span className="inline-block animate-[wave_1.8s_ease-in-out_infinite]">&#x1F44B;</span>
              </h1>
              <p className="text-xs text-zinc-500 hidden sm:block">Here&apos;s your resume activity</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification bell */}
            <button onClick={() => alert("No new notifications")} className="relative rounded-xl p-2.5 text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-zinc-950" />
            </button>

            {/* User avatar (mobile) */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold sm:hidden">
              A
            </div>

            {/* Create button */}
            <Link
              href="/builder"
              className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-indigo-400 transition-all sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              Create New CV
            </Link>

            {/* Avatar (desktop) */}
            <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold ring-2 ring-zinc-800 cursor-pointer hover:ring-indigo-500/40 transition-all">
              A
            </div>
          </div>
        </header>

        {/* --------------------------------------------------------------- */}
        {/* Page content                                                     */}
        {/* --------------------------------------------------------------- */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mx-auto max-w-7xl space-y-8"
          >
            {activeTab === "dashboard" && (<>
            {/* ------------------------------------------------------------- */}
            {/* Stats cards                                                    */}
            {/* ------------------------------------------------------------- */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statsCards.map((card, i) => (
                <motion.div
                  key={card.labelKey}
                  variants={fadeUp}
                  custom={i}
                  className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-sm p-5 hover:border-zinc-700/80 transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
                >
                  {/* Subtle glassmorphism glow */}
                  <div className={cn("absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500", card.bg, "blur-xl")} />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-400">
                        {t(card.labelKey)}
                      </span>
                      <div className={cn("rounded-xl p-2.5 ring-1", card.bg, card.ring)}>
                        <card.icon className={cn("h-4 w-4", card.color)} />
                      </div>
                    </div>

                    <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                      {card.value}
                      {"max" in card && (
                        <span className="text-base font-normal text-zinc-500">/{card.max}</span>
                      )}
                    </p>

                    {/* Progress bar for AI Credits */}
                    {"hasProgress" in card && card.hasProgress && (
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(parseInt(card.value) / (card.max ?? 500)) * 100}%` }}
                          transition={{ delay: 0.6, duration: 1, ease: "easeOut" as const }}
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                        />
                      </div>
                    )}

                    <div className="mt-2.5 flex items-center gap-1.5 text-xs">
                      {card.up ? (
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-zinc-500" />
                      )}
                      <span className={card.up ? "text-emerald-400 font-medium" : "text-zinc-500"}>
                        {card.trend}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Main two-column layout                                         */}
            {/* ------------------------------------------------------------- */}
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_380px]">
              {/* =========================================================== */}
              {/* LEFT COLUMN - Recent CVs                                     */}
              {/* =========================================================== */}
              <motion.div variants={fadeUp} custom={4}>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">{t("dashboard.recentCVs")}</h2>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {t("dashboard.viewAll")}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recentCVs.map((cv, i) => (
                    <motion.div
                      key={cv.name}
                      variants={scaleIn}
                      custom={i + 5}
                      className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-sm overflow-hidden hover:border-zinc-700/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5"
                    >
                      {/* CV Thumbnail */}
                      <div className="p-3 pb-0">
                        <CvThumbnail accent={cv.accent} />
                      </div>

                      <div className="p-4 pt-3 space-y-3">
                        {/* Title + template */}
                        <div>
                          <h3 className="truncate text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                            {cv.name}
                          </h3>
                          <p className="mt-0.5 text-xs text-zinc-500">{cv.template}</p>
                        </div>

                        {/* Meta row: date + status */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1 text-xs text-zinc-500">
                            <Clock className="h-3 w-3" />
                            {cv.lastEdited}
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1",
                              cv.statusColor
                            )}
                          >
                            {cv.status}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div>
                          <div className="mb-1.5 flex items-center justify-between text-xs">
                            <span className="text-zinc-500">Completion</span>
                            <span className="font-medium text-zinc-300">{cv.completion}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                cv.completion === 100
                                  ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                                  : cv.completion >= 80
                                  ? "bg-gradient-to-r from-indigo-500 to-indigo-400"
                                  : cv.completion >= 50
                                  ? "bg-gradient-to-r from-amber-500 to-amber-400"
                                  : "bg-gradient-to-r from-red-500 to-red-400"
                              )}
                              style={{ width: `${cv.completion}%` }}
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-800/80">
                          <Link href="/builder" className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600/15 px-3 py-1.5 text-xs font-semibold text-indigo-400 hover:bg-indigo-600/25 transition-colors ring-1 ring-indigo-500/20">
                            <Edit3 className="h-3 w-3" />
                            {t("dashboard.edit")}
                          </Link>
                          <button onClick={() => alert("CV duplicated!")} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors" title={t("dashboard.duplicate")}>
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => alert("CV deleted!")} className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors" title={t("dashboard.delete")}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* =========================================================== */}
              {/* RIGHT COLUMN                                                 */}
              {/* =========================================================== */}
              <div className="space-y-6">
                {/* --------------------------------------------------------- */}
                {/* AI Suggestions                                             */}
                {/* --------------------------------------------------------- */}
                <motion.div variants={fadeUp} custom={11}>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">{t("dashboard.aiSuggestions")}</h2>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {aiSuggestions.map((suggestion, i) => (
                      <motion.div
                        key={suggestion.title}
                        variants={fadeUp}
                        custom={i + 12}
                        className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-sm p-4 hover:border-zinc-700/60 transition-all duration-300"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn("rounded-xl p-2.5 shrink-0", suggestion.bg)}>
                            <Lightbulb className={cn("h-4 w-4", suggestion.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-white">
                              {suggestion.title}
                            </h3>
                            <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                              {suggestion.description}
                            </p>
                            <button onClick={() => alert("Suggestion applied!")} className="mt-3 inline-flex items-center gap-1 rounded-lg bg-indigo-600/15 px-3.5 py-1.5 text-xs font-semibold text-indigo-400 ring-1 ring-indigo-500/20 hover:bg-indigo-600/25 transition-colors">
                              Apply
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* --------------------------------------------------------- */}
                {/* Quick Actions                                              */}
                {/* --------------------------------------------------------- */}
                <motion.div variants={fadeUp} custom={15}>
                  <h2 className="mb-4 text-lg font-semibold text-white">{t("dashboard.quickActions")}</h2>
                  <div className="grid grid-cols-1 gap-2.5">
                    {quickActions.map((action) => (
                      <button
                        key={action.tKey}
                        onClick={() => {
                          if (action.tKey === "dashboard.importLinkedin") alert("LinkedIn import coming soon!");
                          else if (action.tKey === "dashboard.uploadCV") window.location.href = "/builder";
                          else if (action.tKey === "dashboard.aiReview") window.location.href = "/builder";
                          else alert("Coming soon!");
                        }}
                        className="group flex items-center gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-sm px-4 py-3.5 text-left hover:border-zinc-700/60 transition-all duration-300 hover:shadow-lg hover:shadow-black/10"
                      >
                        <div className={cn("rounded-xl p-2.5 ring-1 ring-white/5", action.bg)}>
                          <action.icon className={cn("h-4 w-4", action.color)} />
                        </div>
                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                          {t(action.tKey)}
                        </span>
                        <ChevronRight className="ml-auto h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* --------------------------------------------------------- */}
                {/* Activity Timeline                                          */}
                {/* --------------------------------------------------------- */}
                <motion.div variants={fadeUp} custom={16}>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">{t("dashboard.recentActivity")}</h2>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {t("dashboard.viewAll")}
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-sm overflow-hidden">
                    {activityItems.map((item, i) => (
                      <motion.div
                        key={i}
                        variants={fadeUp}
                        custom={i + 17}
                        className={cn(
                          "flex items-center gap-3.5 px-4 py-3.5",
                          i !== activityItems.length - 1 && "border-b border-zinc-800/60"
                        )}
                      >
                        {/* Timeline dot */}
                        <div className="relative flex shrink-0 items-center justify-center">
                          <div className={cn("h-2 w-2 rounded-full", item.dot)} />
                          {i !== activityItems.length - 1 && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-px h-6 bg-zinc-800/80" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm text-zinc-300">{item.text}</p>
                        </div>
                        <span className="shrink-0 text-[11px] text-zinc-600 font-medium">{item.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
            </>)}

            {/* ============================================================= */}
            {/* MY CVs TAB                                                     */}
            {/* ============================================================= */}
            {activeTab === "cvs" && (
              <motion.div variants={fadeUp} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">{t("dashboard.myCVs")}</h2>
                  <Link
                    href="/builder"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:from-indigo-500 hover:to-indigo-400 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    {t("nav.createNewCV")}
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recentCVs.map((cv) => (
                    <div key={cv.name} className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 overflow-hidden hover:border-zinc-700/60 transition-all">
                      <CvThumbnail accent={cv.accent} />
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-white truncate">{cv.name}</h3>
                          <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full ring-1", cv.statusColor)}>{cv.status}</span>
                        </div>
                        <p className="text-xs text-zinc-500">{cv.template} &middot; {cv.lastEdited}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <Link href="/builder" className="flex-1 text-center rounded-lg bg-indigo-600/10 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-600/20 transition-colors">{t("dashboard.edit")}</Link>
                          <button onClick={() => alert("CV duplicated!")} className="rounded-lg bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-700 transition-colors"><Copy className="h-3.5 w-3.5" /></button>
                          <button onClick={() => alert("CV deleted!")} className="rounded-lg bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-red-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ============================================================= */}
            {/* COVER LETTERS TAB                                              */}
            {/* ============================================================= */}
            {activeTab === "cover-letters" && (
              <motion.div variants={fadeUp} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">{t("dashboard.coverLetters")}</h2>
                  <button onClick={() => alert("Cover letter feature coming soon!")} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:from-indigo-500 hover:to-indigo-400 transition-all">
                    <Plus className="h-4 w-4" />
                    New Cover Letter
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/60 ring-1 ring-zinc-700/50">
                    <MessageSquare className="h-7 w-7 text-zinc-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No cover letters yet</h3>
                  <p className="text-sm text-zinc-500 max-w-sm mb-6">Create a tailored cover letter for each job application. Our AI will help you write a compelling letter.</p>
                  <button onClick={() => alert("Cover letter feature coming soon!")} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
                    <Sparkles className="h-4 w-4" />
                    Generate with AI
                  </button>
                </div>
              </motion.div>
            )}

            {/* ============================================================= */}
            {/* SETTINGS TAB                                                   */}
            {/* ============================================================= */}
            {activeTab === "settings" && (
              <motion.div variants={fadeUp} className="space-y-6">
                <h2 className="text-xl font-semibold text-white">{t("dashboard.settings")}</h2>
                <div className="space-y-5 max-w-2xl">
                  {/* Profile */}
                  <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4">
                    <h3 className="font-medium text-white">Profile</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-zinc-500 mb-1.5">Full Name</label>
                        <input type="text" defaultValue="Alex Johnson" className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-500 mb-1.5">Email</label>
                        <input type="email" defaultValue="alex@example.com" className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none transition-colors" />
                      </div>
                    </div>
                    <button onClick={() => alert("Settings saved!")} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors">Save Changes</button>
                  </div>
                  {/* Preferences */}
                  <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4">
                    <h3 className="font-medium text-white">Preferences</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white">Email Notifications</p>
                        <p className="text-xs text-zinc-500">Receive tips and updates about your CVs</p>
                      </div>
                      <button className="relative h-6 w-11 rounded-full bg-indigo-600 transition-colors">
                        <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm" style={{ transform: "translateX(20px)" }} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white">AI Suggestions</p>
                        <p className="text-xs text-zinc-500">Show AI improvement suggestions on your dashboard</p>
                      </div>
                      <button className="relative h-6 w-11 rounded-full bg-indigo-600 transition-colors">
                        <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm" style={{ transform: "translateX(20px)" }} />
                      </button>
                    </div>
                  </div>
                  {/* Danger zone */}
                  <div className="rounded-2xl border border-red-900/30 bg-red-950/10 p-6 space-y-4">
                    <h3 className="font-medium text-red-400">Danger Zone</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white">Delete Account</p>
                        <p className="text-xs text-zinc-500">Permanently delete your account and all data</p>
                      </div>
                      <button onClick={() => alert("Account deletion is disabled in demo mode.")} className="rounded-lg border border-red-800 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 transition-colors">Delete</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </motion.div>
        </main>
      </div>

      {/* Wave animation keyframes via inline style (for the greeting emoji) */}
      <style jsx global>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(14deg); }
          30% { transform: rotate(-8deg); }
          40% { transform: rotate(14deg); }
          50% { transform: rotate(-4deg); }
          60% { transform: rotate(10deg); }
          70% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
