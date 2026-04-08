"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Edit3,
  Copy,
  Trash2,
  ChevronRight,
  Menu,
  X,
  Clock,
  User,
  Zap,
  ArrowUpRight,
  Lightbulb,
  MessageSquare,
  LogOut,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useUser, signOut } from "@/lib/supabase/auth";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NavTab = "dashboard" | "cvs" | "cover-letters" | "settings";

interface CvRecord {
  id: string;
  title: string;
  template: string;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

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
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function getInitials(name?: string | null, email?: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return (email?.[0] ?? "U").toUpperCase();
}

function getFirstName(name?: string | null, email?: string): string {
  if (name) return name.split(" ")[0];
  return email?.split("@")[0] ?? "there";
}

const TEMPLATE_ACCENTS: Record<string, string> = {
  Modern: "from-indigo-500 to-blue-500",
  Classic: "from-rose-500 to-pink-500",
  Minimal: "from-emerald-500 to-teal-500",
  Creative: "from-purple-500 to-violet-500",
};

// ---------------------------------------------------------------------------
// Mini CV Thumbnail
// ---------------------------------------------------------------------------

function CvThumbnail({ accent }: { accent: string }) {
  return (
    <div className="relative aspect-[3/4] w-full rounded-lg bg-zinc-800/60 border border-zinc-700/50 overflow-hidden group-hover:border-zinc-600/50 transition-colors">
      <div className={cn("h-1.5 w-full bg-gradient-to-r", accent)} />
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
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [cvs, setCvs] = useState<CvRecord[]>([]);
  const [loadingCvs, setLoadingCvs] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Settings state
  const [settingsName, setSettingsName] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0];
  const userEmail = user?.email;
  const initials = getInitials(user?.user_metadata?.full_name, user?.email);
  const firstName = getFirstName(user?.user_metadata?.full_name, user?.email);

  // Load CVs from Supabase
  const loadCvs = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("cvs")
      .select("*")
      .order("updated_at", { ascending: false });
    setCvs(data ?? []);
    setLoadingCvs(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      loadCvs();
      setSettingsName(user.user_metadata?.full_name || "");
    }
  }, [user, loadCvs]);

  // Delete CV
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) return;
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("cvs").delete().eq("id", id);
    setCvs((prev) => prev.filter((cv) => cv.id !== id));
    setDeleting(null);
  };

  // Duplicate CV
  const handleDuplicate = async (cv: CvRecord) => {
    if (!user) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("cvs")
      .insert({
        user_id: user.id,
        title: `${cv.title} (Copy)`,
        template: cv.template,
        data: cv.data,
      })
      .select()
      .single();
    if (data) setCvs((prev) => [data, ...prev]);
  };

  // Save settings
  const handleSaveSettings = async () => {
    if (!user) return;
    setSettingsSaving(true);
    const supabase = createClient();
    await supabase.auth.updateUser({
      data: { full_name: settingsName },
    });
    setSettingsSaving(false);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  // Nav items
  const navItems: {
    label: string;
    icon: typeof LayoutDashboard;
    tab?: NavTab;
    href?: string;
  }[] = [
    { label: "Dashboard", icon: LayoutDashboard, tab: "dashboard" },
    { label: "My CVs", icon: FileText, tab: "cvs" },
    { label: "Templates", icon: Layout, href: "/templates" },
    { label: "AI Assistant", icon: Sparkles, href: "/builder" },
    { label: "Cover Letters", icon: MessageSquare, tab: "cover-letters" },
    { label: "Settings", icon: Settings, tab: "settings" },
  ];

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[17rem] flex-col border-r border-zinc-800/80 bg-zinc-900/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-zinc-800/80">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-4 w-4 text-white" />
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
                {item.label}
                {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-400" />}
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

          {/* Sign out */}
          <button
            onClick={() => signOut()}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200 transition-all duration-200 w-full text-left mt-4"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Sign Out
          </button>
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
              <button className="w-full rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 px-3 py-2 text-xs font-semibold text-white hover:from-indigo-500 hover:to-indigo-400 transition-all shadow-lg shadow-indigo-500/25">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="border-t border-zinc-800/80 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold ring-2 ring-indigo-500/20">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-white">{userName}</p>
              <p className="truncate text-xs text-zinc-500">{userEmail}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top header */}
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
                Welcome back, {firstName}
              </h1>
              <p className="text-xs text-zinc-500 hidden sm:block">Here&apos;s your resume activity</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative rounded-xl p-2.5 text-zinc-400 hover:bg-zinc-800/80 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold sm:hidden">
              {initials}
            </div>
            <Link
              href="/builder"
              className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-indigo-400 transition-all sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              Create New CV
            </Link>
            <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold ring-2 ring-zinc-800">
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mx-auto max-w-7xl space-y-8"
          >
            {/* ============================================================= */}
            {/* DASHBOARD TAB                                                  */}
            {/* ============================================================= */}
            {activeTab === "dashboard" && (
              <>
                {/* Stats cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: "Total CVs", value: cvs.length.toString(), icon: FileText, color: "text-indigo-400", bg: "bg-indigo-500/10", ring: "ring-indigo-500/20" },
                    { label: "Templates Used", value: [...new Set(cvs.map((c) => c.template))].length.toString(), icon: Layout, color: "text-emerald-400", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20" },
                    { label: "Last Updated", value: cvs.length > 0 ? timeAgo(cvs[0].updated_at) : "—", icon: Clock, color: "text-purple-400", bg: "bg-purple-500/10", ring: "ring-purple-500/20" },
                    { label: "AI Credits", value: "500", icon: Sparkles, color: "text-amber-400", bg: "bg-amber-500/10", ring: "ring-amber-500/20" },
                  ].map((card, i) => (
                    <motion.div
                      key={card.label}
                      variants={fadeUp}
                      custom={i}
                      className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-sm p-5 hover:border-zinc-700/80 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-400">{card.label}</span>
                        <div className={cn("rounded-xl p-2.5 ring-1", card.bg, card.ring)}>
                          <card.icon className={cn("h-4 w-4", card.color)} />
                        </div>
                      </div>
                      <p className="mt-3 text-3xl font-bold tracking-tight text-white">{card.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Recent CVs + Sidebar */}
                <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_380px]">
                  {/* Recent CVs */}
                  <motion.div variants={fadeUp} custom={4}>
                    <div className="mb-5 flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-white">Recent CVs</h2>
                      {cvs.length > 0 && (
                        <button
                          onClick={() => setActiveTab("cvs")}
                          className="flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          View All
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {loadingCvs ? (
                      <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
                      </div>
                    ) : cvs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-zinc-800/80 bg-zinc-900/60">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/60 ring-1 ring-zinc-700/50">
                          <FileText className="h-7 w-7 text-zinc-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">No CVs yet</h3>
                        <p className="text-sm text-zinc-500 max-w-sm mb-6">Create your first CV to get started. Our AI-powered builder will help you craft a professional resume.</p>
                        <Link
                          href="/builder"
                          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Create Your First CV
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {cvs.slice(0, 6).map((cv, i) => (
                          <motion.div
                            key={cv.id}
                            variants={scaleIn}
                            custom={i + 5}
                            className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/60 overflow-hidden hover:border-zinc-700/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5"
                          >
                            <div className="p-3 pb-0">
                              <CvThumbnail accent={TEMPLATE_ACCENTS[cv.template] || "from-indigo-500 to-blue-500"} />
                            </div>
                            <div className="p-4 pt-3 space-y-3">
                              <div>
                                <h3 className="truncate text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                                  {cv.title}
                                </h3>
                                <p className="mt-0.5 text-xs text-zinc-500">{cv.template}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 text-xs text-zinc-500">
                                  <Clock className="h-3 w-3" />
                                  {timeAgo(cv.updated_at)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 pt-2 border-t border-zinc-800/80">
                                <Link href={`/builder?id=${cv.id}`} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600/15 px-3 py-1.5 text-xs font-semibold text-indigo-400 hover:bg-indigo-600/25 transition-colors ring-1 ring-indigo-500/20">
                                  <Edit3 className="h-3 w-3" />
                                  Edit
                                </Link>
                                <button onClick={() => handleDuplicate(cv)} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors" title="Duplicate">
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(cv.id)}
                                  disabled={deleting === cv.id}
                                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                  title="Delete"
                                >
                                  {deleting === cv.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  {/* Right column */}
                  <div className="space-y-6">
                    {/* AI Suggestions */}
                    <motion.div variants={fadeUp} custom={11}>
                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">AI Suggestions</h2>
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        {[
                          { title: "Strengthen your summary", desc: "A compelling professional summary can increase your interview callbacks by 40%.", color: "text-indigo-400", bg: "bg-indigo-500/10" },
                          { title: "Add quantifiable achievements", desc: "Include numbers and metrics to make your experience section more impactful.", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                          { title: "Update skills for 2026", desc: "Consider adding trending skills like AI/ML, Rust, and cloud-native development.", color: "text-purple-400", bg: "bg-purple-500/10" },
                        ].map((suggestion, i) => (
                          <motion.div
                            key={suggestion.title}
                            variants={fadeUp}
                            custom={i + 12}
                            className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 hover:border-zinc-700/60 transition-all"
                          >
                            <div className="flex items-start gap-3">
                              <div className={cn("rounded-xl p-2.5 shrink-0", suggestion.bg)}>
                                <Lightbulb className={cn("h-4 w-4", suggestion.color)} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-white">{suggestion.title}</h3>
                                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{suggestion.desc}</p>
                                <Link href="/builder" className="mt-3 inline-flex items-center gap-1 rounded-lg bg-indigo-600/15 px-3.5 py-1.5 text-xs font-semibold text-indigo-400 ring-1 ring-indigo-500/20 hover:bg-indigo-600/25 transition-colors">
                                  Try it
                                  <ChevronRight className="h-3 w-3" />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </>
            )}

            {/* ============================================================= */}
            {/* MY CVs TAB                                                     */}
            {/* ============================================================= */}
            {activeTab === "cvs" && (
              <motion.div variants={fadeUp} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">My CVs</h2>
                  <Link
                    href="/builder"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:from-indigo-500 hover:to-indigo-400 transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    Create New CV
                  </Link>
                </div>

                {loadingCvs ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
                  </div>
                ) : cvs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/60 ring-1 ring-zinc-700/50">
                      <FileText className="h-7 w-7 text-zinc-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No CVs yet</h3>
                    <p className="text-sm text-zinc-500 max-w-sm mb-6">Create your first CV to get started.</p>
                    <Link href="/builder" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">
                      <Plus className="h-4 w-4" />
                      Create Your First CV
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cvs.map((cv) => (
                      <div key={cv.id} className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/60 overflow-hidden hover:border-zinc-700/60 transition-all">
                        <div className="p-3 pb-0">
                          <CvThumbnail accent={TEMPLATE_ACCENTS[cv.template] || "from-indigo-500 to-blue-500"} />
                        </div>
                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-white truncate">{cv.title}</h3>
                          </div>
                          <p className="text-xs text-zinc-500">{cv.template} &middot; {timeAgo(cv.updated_at)}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <Link href={`/builder?id=${cv.id}`} className="flex-1 text-center rounded-lg bg-indigo-600/10 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-600/20 transition-colors">Edit</Link>
                            <button onClick={() => handleDuplicate(cv)} className="rounded-lg bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-700 transition-colors"><Copy className="h-3.5 w-3.5" /></button>
                            <button onClick={() => handleDelete(cv.id)} disabled={deleting === cv.id} className="rounded-lg bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-red-400 transition-colors">
                              {deleting === cv.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ============================================================= */}
            {/* COVER LETTERS TAB                                              */}
            {/* ============================================================= */}
            {activeTab === "cover-letters" && (
              <motion.div variants={fadeUp} className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Cover Letters</h2>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/60 ring-1 ring-zinc-700/50">
                    <MessageSquare className="h-7 w-7 text-zinc-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
                  <p className="text-sm text-zinc-500 max-w-sm">AI-powered cover letter generation is coming in a future update.</p>
                </div>
              </motion.div>
            )}

            {/* ============================================================= */}
            {/* SETTINGS TAB                                                   */}
            {/* ============================================================= */}
            {activeTab === "settings" && (
              <motion.div variants={fadeUp} className="space-y-6">
                <h2 className="text-xl font-semibold text-white">Settings</h2>
                <div className="space-y-5 max-w-2xl">
                  {/* Profile */}
                  <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4">
                    <h3 className="font-medium text-white">Profile</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-zinc-500 mb-1.5">Full Name</label>
                        <input
                          type="text"
                          value={settingsName}
                          onChange={(e) => setSettingsName(e.target.value)}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-500 mb-1.5">Email</label>
                        <input
                          type="email"
                          value={userEmail || ""}
                          disabled
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-400 cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSaveSettings}
                      disabled={settingsSaving}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors disabled:opacity-60"
                    >
                      {settingsSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      {settingsSaved ? "Saved!" : "Save Changes"}
                    </button>
                  </div>

                  {/* Sign out */}
                  <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4">
                    <h3 className="font-medium text-white">Account</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white">Sign Out</p>
                        <p className="text-xs text-zinc-500">Sign out of your account on this device</p>
                      </div>
                      <button
                        onClick={() => signOut()}
                        className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
