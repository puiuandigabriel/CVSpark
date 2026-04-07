"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  Crown,
  X,
  Check,
  ArrowLeft,
  Zap,
  Eye,
  Grid3X3,
  Grid2X2,
  LayoutGrid,
  LayoutList,
  ChevronDown,
  Sparkles,
  MessageSquarePlus,
  PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

/* ------------------------------------------------------------------ */
/*  TEMPLATE DATA                                                      */
/* ------------------------------------------------------------------ */

type Template = {
  id: string;
  name: string;
  category: string;
  desc: string;
  rating: number;
  reviewCount: number;
  free: boolean;
  staffPick?: boolean;
  features: string[];
  colorVariants: string[];
  preview: React.ReactNode;
};

const templateFeatures: Record<string, string[]> = {
  aurora: ["ATS-Friendly", "Two-Column", "Sidebar Layout", "Icon Support"],
  zenith: ["ATS-Friendly", "Three-Column", "Bold Header", "Section Dividers"],
  prism: ["Creative Layout", "Gradient Accents", "Asymmetric", "Icon Bullets"],
  nexus: ["ATS-Friendly", "Clean Layout", "Accent Colors", "Two-Column"],
  cipher: ["Developer-Focused", "Skill Bars", "Dark Theme", "Code-Inspired"],
  cascade: ["Card Layout", "Stacked Sections", "Warm Tones", "Border Accents"],
  meridian: ["ATS-Friendly", "Executive Style", "Gold Accents", "Classic Layout"],
  vertex: ["Geometric Shapes", "Modern Header", "Tag Pills", "Clean Typography"],
  lumina: ["Ultra-Minimal", "Elegant Spacing", "Centered Header", "Line Dividers"],
  scholar: ["Academic Format", "Publication-Ready", "Structured Sections", "ATS-Friendly"],
  spark: ["Gradient Header", "Skill Bars", "ATS-Friendly", "Modern Layout"],
  onyx: ["Dark Theme", "High Contrast", "Rose Accents", "Bold Design"],
};

const templateColors: Record<string, string[]> = {
  aurora: ["#4f46e5", "#0ea5e9", "#8b5cf6", "#ec4899", "#10b981"],
  zenith: ["#1e293b", "#334155", "#0f172a", "#1e3a5f", "#374151"],
  prism: ["#ec4899", "#8b5cf6", "#f59e0b", "#06b6d4", "#ef4444"],
  nexus: ["#10b981", "#0ea5e9", "#6366f1", "#f59e0b", "#ef4444"],
  cipher: ["#22c55e", "#0ea5e9", "#a855f7", "#f59e0b", "#ec4899"],
  cascade: ["#f59e0b", "#ef4444", "#8b5cf6", "#0ea5e9", "#10b981"],
  meridian: ["#1e3a5f", "#1e293b", "#0f172a", "#374151", "#4f46e5"],
  vertex: ["#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"],
  lumina: ["#71717a", "#4f46e5", "#0ea5e9", "#10b981", "#ec4899"],
  scholar: ["#475569", "#1e3a5f", "#374151", "#4f46e5", "#0f172a"],
  spark: ["#6366f1", "#8b5cf6", "#ec4899", "#0ea5e9", "#10b981"],
  onyx: ["#f43f5e", "#8b5cf6", "#0ea5e9", "#f59e0b", "#10b981"],
};

function useTemplates(): Template[] {
  return [
    {
      id: "aurora",
      name: "Aurora",
      category: "Professional",
      desc: "Clean two-column layout with an elegant sidebar. Perfect for corporate roles.",
      rating: 4.9,
      reviewCount: 342,
      free: true,
      features: templateFeatures.aurora,
      colorVariants: templateColors.aurora,
      preview: <AuroraPreview />,
    },
    {
      id: "zenith",
      name: "Zenith",
      category: "Professional",
      desc: "Bold header with three-column body. Ideal for experienced professionals.",
      rating: 4.8,
      reviewCount: 289,
      free: false,
      features: templateFeatures.zenith,
      colorVariants: templateColors.zenith,
      preview: <ZenithPreview />,
    },
    {
      id: "prism",
      name: "Prism",
      category: "Creative",
      desc: "Asymmetric layout with gradient accents. Stand out in creative industries.",
      rating: 4.7,
      reviewCount: 198,
      free: false,
      features: templateFeatures.prism,
      colorVariants: templateColors.prism,
      preview: <PrismPreview />,
    },
    {
      id: "nexus",
      name: "Nexus",
      category: "Modern",
      desc: "Minimal design with green accents. Clean and modern for tech roles.",
      rating: 4.8,
      reviewCount: 256,
      free: true,
      features: templateFeatures.nexus,
      colorVariants: templateColors.nexus,
      preview: <NexusPreview />,
    },
    {
      id: "cipher",
      name: "Cipher",
      category: "Tech",
      desc: "Code-editor inspired design. Built for developers and engineers.",
      rating: 4.9,
      reviewCount: 412,
      free: false,
      features: templateFeatures.cipher,
      colorVariants: templateColors.cipher,
      preview: <CipherPreview />,
    },
    {
      id: "cascade",
      name: "Cascade",
      category: "Creative",
      desc: "Stacked card layout with warm amber accents. Unique and memorable.",
      rating: 4.6,
      reviewCount: 167,
      free: true,
      features: templateFeatures.cascade,
      colorVariants: templateColors.cascade,
      preview: <CascadePreview />,
    },
    {
      id: "meridian",
      name: "Meridian",
      category: "Professional",
      desc: "Classic single-column with navy and gold. Timeless executive style.",
      rating: 4.9,
      reviewCount: 378,
      free: false,
      features: templateFeatures.meridian,
      colorVariants: templateColors.meridian,
      preview: <MeridianPreview />,
    },
    {
      id: "vertex",
      name: "Vertex",
      category: "Modern",
      desc: "Geometric shapes with cyan accents. Fresh and contemporary.",
      rating: 4.7,
      reviewCount: 203,
      free: true,
      features: templateFeatures.vertex,
      colorVariants: templateColors.vertex,
      preview: <VertexPreview />,
    },
    {
      id: "lumina",
      name: "Lumina",
      category: "Minimal",
      desc: "Extreme minimalism with elegant spacing. Let your content speak.",
      rating: 4.8,
      reviewCount: 311,
      free: true,
      features: templateFeatures.lumina,
      colorVariants: templateColors.lumina,
      preview: <LuminaPreview />,
    },
    {
      id: "scholar",
      name: "Scholar",
      category: "Academic",
      desc: "Structured academic layout for researchers and educators.",
      rating: 4.7,
      reviewCount: 145,
      free: false,
      features: templateFeatures.scholar,
      colorVariants: templateColors.scholar,
      preview: <ScholarPreview />,
    },
    {
      id: "spark",
      name: "Spark",
      category: "Modern",
      desc: "CVSpark's signature template. Modern gradient header with skill bars.",
      rating: 5.0,
      reviewCount: 523,
      free: true,
      staffPick: true,
      features: templateFeatures.spark,
      colorVariants: templateColors.spark,
      preview: <SparkPreview />,
    },
    {
      id: "onyx",
      name: "Onyx",
      category: "Creative",
      desc: "Dark-themed CV with rose accents. Bold, high-contrast design.",
      rating: 4.8,
      reviewCount: 276,
      free: false,
      features: templateFeatures.onyx,
      colorVariants: templateColors.onyx,
      preview: <OnyxPreview />,
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  MINI PREVIEW COMPONENTS                                            */
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
        <div className="border-t border-zinc-200 pt-2"><Lines n={4} /></div>
        <div className="border-t border-zinc-200 pt-2"><Lines n={3} /></div>
      </div>
    </div>
  );
}

function ZenithPreview() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded bg-white">
      <div className="bg-slate-800 p-3">
        <Line w="60%" c="bg-white" />
        <Line w="40%" c="bg-slate-400" />
      </div>
      <div className="flex flex-1 p-2 gap-2">
        <div className="w-[25%] space-y-2">
          <Line w="90%" c="bg-slate-300" />
          <Line w="70%" c="bg-slate-300" />
          <Line w="80%" c="bg-slate-300" />
        </div>
        <div className="flex-1 space-y-2 border-l border-r border-zinc-200 px-2">
          <Lines n={4} />
          <div className="pt-1"><Lines n={3} /></div>
        </div>
        <div className="w-[20%] space-y-2">
          <Line w="100%" c="bg-slate-200" />
          <Line w="100%" c="bg-slate-200" />
          <Line w="100%" c="bg-slate-200" />
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

function NexusPreview() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded bg-white">
      <div className="p-3 pb-1">
        <Line w="50%" c="bg-zinc-800" />
        <div className="mt-1 h-[2px] w-full bg-emerald-400" />
      </div>
      <div className="flex flex-1 p-3 pt-2 gap-3">
        <div className="w-[25%] space-y-3">
          <div className="space-y-[3px]">
            <Line w="100%" c="bg-zinc-300" />
            <Line w="80%" c="bg-zinc-300" />
          </div>
          <div className="space-y-[3px]">
            <Line w="100%" c="bg-zinc-300" />
            <Line w="70%" c="bg-zinc-300" />
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <Line w="35%" c="bg-emerald-500" />
          <Lines n={4} />
          <Line w="35%" c="bg-emerald-500" />
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
            <div className="h-[6px] flex-1 rounded-full bg-zinc-700"><div className="h-full w-[85%] rounded-full bg-green-500" /></div>
          </div>
          <div className="flex gap-1">
            <div className="h-[6px] flex-1 rounded-full bg-zinc-700"><div className="h-full w-[70%] rounded-full bg-green-500" /></div>
          </div>
          <div className="flex gap-1">
            <div className="h-[6px] flex-1 rounded-full bg-zinc-700"><div className="h-full w-[60%] rounded-full bg-green-500" /></div>
          </div>
        </div>
        <Lines n={3} c="bg-zinc-600" />
      </div>
    </div>
  );
}

function CascadePreview() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded bg-zinc-50 p-2 gap-[6px]">
      <div className="rounded bg-white p-2 shadow-sm border border-amber-200">
        <Line w="50%" c="bg-zinc-800" />
        <Line w="35%" c="bg-amber-500" />
      </div>
      <div className="rounded bg-white p-2 shadow-sm border-l-2 border-amber-400">
        <Line w="30%" c="bg-amber-600" />
        <div className="mt-1"><Lines n={2} /></div>
      </div>
      <div className="rounded bg-white p-2 shadow-sm border-l-2 border-amber-400">
        <Line w="35%" c="bg-amber-600" />
        <div className="mt-1"><Lines n={2} /></div>
      </div>
      <div className="rounded bg-white p-2 shadow-sm border-l-2 border-amber-400">
        <Line w="25%" c="bg-amber-600" />
        <div className="mt-1"><Lines n={2} /></div>
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
          <div className="mt-1"><Lines n={3} /></div>
        </div>
        <div>
          <Line w="25%" c="bg-[#1e3a5f]" />
          <div className="mt-1 h-[1px] bg-zinc-200" />
          <div className="mt-1"><Lines n={3} /></div>
        </div>
      </div>
    </div>
  );
}

function VertexPreview() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded bg-white relative">
      <div className="h-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-500 -skew-y-3 origin-top-right" />
        <div className="absolute right-2 top-1 h-6 w-6 rounded bg-white/30 rotate-12" />
      </div>
      <div className="p-3 space-y-3">
        <Line w="50%" c="bg-zinc-800" />
        <Line w="30%" c="bg-cyan-500" />
        <div className="flex gap-1 flex-wrap">
          {["w-8", "w-10", "w-7", "w-9", "w-6"].map((w, i) => (
            <div key={i} className={cn("h-[10px] rounded-full bg-cyan-100 border border-cyan-300", w)} />
          ))}
        </div>
        <Lines n={4} />
      </div>
    </div>
  );
}

function LuminaPreview() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded bg-white p-4 space-y-4">
      <div className="text-center space-y-[3px]">
        <Line w="40%" c="bg-zinc-800 mx-auto" />
        <Line w="25%" c="bg-zinc-400 mx-auto" />
      </div>
      <div className="h-[1px] bg-zinc-200" />
      <Lines n={3} c="bg-zinc-300" />
      <div className="h-[1px] bg-zinc-200" />
      <Lines n={2} c="bg-zinc-300" />
      <div className="h-[1px] bg-zinc-200" />
      <Lines n={2} c="bg-zinc-300" />
    </div>
  );
}

function ScholarPreview() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded bg-white p-3 space-y-2">
      <Line w="55%" c="bg-zinc-800" />
      <Line w="35%" c="bg-zinc-400" />
      <div className="h-[1px] bg-slate-300" />
      <div>
        <Line w="30%" c="bg-slate-600" />
        <div className="mt-1"><Lines n={3} c="bg-zinc-300" /></div>
      </div>
      <div className="h-[1px] bg-slate-300" />
      <div>
        <Line w="25%" c="bg-slate-600" />
        <div className="mt-1"><Lines n={2} c="bg-zinc-300" /></div>
      </div>
      <div className="h-[1px] bg-slate-300" />
      <div>
        <Line w="35%" c="bg-slate-600" />
        <div className="mt-1"><Lines n={2} c="bg-zinc-300" /></div>
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
            <div className="h-[5px] flex-1 rounded-full bg-zinc-100"><div className="h-full w-[90%] rounded-full bg-indigo-500" /></div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[5px] text-zinc-500 w-6 shrink-0">TS</span>
            <div className="h-[5px] flex-1 rounded-full bg-zinc-100"><div className="h-full w-[80%] rounded-full bg-violet-500" /></div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[5px] text-zinc-500 w-6 shrink-0">Node</span>
            <div className="h-[5px] flex-1 rounded-full bg-zinc-100"><div className="h-full w-[70%] rounded-full bg-indigo-400" /></div>
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
          <div key={i} className="h-[10px] w-8 rounded bg-rose-500/20 border border-rose-500/40" />
        ))}
      </div>
      <Lines n={2} c="bg-zinc-600" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CATEGORY COLORS                                                    */
/* ------------------------------------------------------------------ */

const catColors: Record<string, string> = {
  Professional: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Creative: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Modern: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Minimal: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  Academic: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Tech: "bg-green-500/20 text-green-400 border-green-500/30",
};

const catDotColors: Record<string, string> = {
  Professional: "bg-blue-400",
  Creative: "bg-pink-400",
  Modern: "bg-emerald-400",
  Minimal: "bg-zinc-400",
  Academic: "bg-amber-400",
  Tech: "bg-green-400",
};

/* ------------------------------------------------------------------ */
/*  SORT OPTIONS                                                       */
/* ------------------------------------------------------------------ */

type SortOption = "popular" | "newest" | "rating";
type GridCols = 2 | 3 | 4;

const sortLabels: Record<SortOption, string> = {
  popular: "Popular",
  newest: "Newest",
  rating: "Rating",
};

function sortTemplates(templates: Template[], sort: SortOption): Template[] {
  const sorted = [...templates];
  switch (sort) {
    case "popular":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    case "newest":
      return sorted.reverse();
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

const filters = ["All", "Professional", "Creative", "Minimal", "Modern", "Academic", "Tech"];

const easeOut = "easeOut" as const;

export default function TemplatesPage() {
  const { t } = useLanguage();
  const templates = useTemplates();
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [gridCols, setGridCols] = useState<GridCols>(4);
  const [sort, setSort] = useState<SortOption>("popular");
  const [sortOpen, setSortOpen] = useState(false);
  const [selected, setSelected] = useState<Template | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);

  const filterKeys: Record<string, string> = {
    All: t("templates.filterAll"),
    Professional: t("templates.filterProfessional"),
    Creative: t("templates.filterCreative"),
    Minimal: t("templates.filterMinimal"),
    Modern: t("templates.filterModern"),
    Academic: t("templates.filterAcademic"),
    Tech: t("templates.filterTech"),
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (active !== "All") count++;
    if (search.trim()) count++;
    if (sort !== "popular") count++;
    return count;
  }, [active, search, sort]);

  const filtered = useMemo(() => {
    const result = templates.filter((tpl) => {
      const matchCat = active === "All" || tpl.category === active;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        tpl.category.toLowerCase().includes(q) ||
        tpl.desc.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
    return sortTemplates(result, sort);
  }, [active, search, sort, templates]);

  const openPreview = useCallback((tpl: Template) => {
    setSelected(tpl);
    setSelectedColor(0);
  }, []);

  const gridColsClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[gridCols];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* ---- HEADER ---- */}
      <header className="relative border-b border-zinc-800/60 bg-zinc-950">
        {/* Decorative gradient blur */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[600px] rounded-full bg-indigo-600/10 blur-3xl" />
        </div>

        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 font-bold text-xl">
            <Zap className="h-5 w-5 text-indigo-400" />
            <span>CVSpark</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </nav>

        {/* Hero heading */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              {t("templates.title") !== "templates.title"
                ? t("templates.title")
                : "Choose Your Template"}
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              12 professionally designed, ATS-optimized templates to land your dream role
            </p>
          </motion.div>
        </div>
      </header>

      {/* ---- STICKY FILTER BAR ---- */}
      <div className="sticky top-0 z-40 border-b border-zinc-800/60 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => {
                const isActive = active === f;
                return (
                  <button
                    key={f}
                    onClick={() => setActive(f)}
                    className={cn(
                      "relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 border",
                      isActive
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                        : "border-zinc-700/60 text-zinc-400 hover:text-white hover:border-zinc-500 hover:bg-zinc-800/50"
                    )}
                  >
                    {f !== "All" && (
                      <span className={cn("inline-block h-2 w-2 rounded-full mr-1.5", catDotColors[f] || "bg-zinc-400")} />
                    )}
                    {filterKeys[f]}
                  </button>
                );
              })}
            </div>

            {/* Search + View toggle + Sort */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("templates.search")}
                  className="rounded-lg border border-zinc-700/60 bg-zinc-900/80 pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 focus:outline-none w-52 transition-all"
                />
              </div>

              {/* Grid density toggle */}
              <div className="flex rounded-lg border border-zinc-700/60 overflow-hidden">
                <button
                  onClick={() => { setView("grid"); setGridCols(2); }}
                  title="2 columns"
                  className={cn(
                    "p-2 transition-colors",
                    view === "grid" && gridCols === 2 ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  <Grid2X2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { setView("grid"); setGridCols(3); }}
                  title="3 columns"
                  className={cn(
                    "p-2 transition-colors",
                    view === "grid" && gridCols === 3 ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { setView("grid"); setGridCols(4); }}
                  title="4 columns"
                  className={cn(
                    "p-2 transition-colors",
                    view === "grid" && gridCols === 4 ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  title="List view"
                  className={cn(
                    "p-2 transition-colors",
                    view === "list" ? "bg-zinc-700 text-white" : "text-zinc-500 hover:text-white hover:bg-zinc-800/50"
                  )}
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-lg border border-zinc-700/60 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
                >
                  {sortLabels[sort]}
                  <ChevronDown className={cn("h-4 w-4 transition-transform", sortOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15, ease: easeOut }}
                      className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-zinc-700 bg-zinc-900 shadow-xl overflow-hidden z-50"
                    >
                      {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => { setSort(opt); setSortOpen(false); }}
                          className={cn(
                            "w-full text-left px-4 py-2.5 text-sm transition-colors",
                            sort === opt
                              ? "bg-indigo-600/20 text-indigo-400"
                              : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                          )}
                        >
                          {sortLabels[opt]}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Active filter count badge */}
              {activeFilterCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="flex items-center justify-center h-6 min-w-[24px] rounded-full bg-indigo-600 px-1.5 text-xs font-bold"
                >
                  {activeFilterCount}
                </motion.span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---- MAIN CONTENT ---- */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Results count */}
        <motion.p
          key={filtered.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: easeOut }}
          className="text-sm text-zinc-500 mb-6"
        >
          {t("templates.showing")} {filtered.length} {filtered.length === 1 ? "template" : "templates"}
          {active !== "All" && (
            <span className="text-zinc-600"> in {active}</span>
          )}
        </motion.p>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <Search className="h-12 w-12 text-zinc-700 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No templates found</h3>
            <p className="text-zinc-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => { setActive("All"); setSearch(""); }}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}

        {/* GRID VIEW */}
        {view === "grid" && filtered.length > 0 && (
          <motion.div
            layout
            className={cn("grid gap-6", gridColsClass)}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((tpl, i) => (
                <motion.div
                  layout
                  key={tpl.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { delay: i * 0.04, duration: 0.35, ease: easeOut },
                  }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: easeOut } }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: easeOut } }}
                  className={cn(
                    "group relative rounded-xl border overflow-hidden transition-all duration-300",
                    tpl.staffPick
                      ? "border-indigo-500/40 bg-gradient-to-b from-indigo-950/30 to-zinc-900 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/10"
                      : "border-zinc-800 bg-zinc-900 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-zinc-700"
                  )}
                >
                  {/* Staff Pick glow */}
                  {tpl.staffPick && (
                    <div className="absolute -top-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
                  )}

                  {/* Preview area */}
                  <div className="relative p-3 bg-zinc-800/40" style={{ aspectRatio: "3/4" }}>
                    <div className="h-full w-full rounded-lg overflow-hidden shadow-md ring-1 ring-white/5">
                      {tpl.preview}
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={() => openPreview(tpl)}
                        className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100 transition-colors shadow-lg"
                      >
                        <Eye className="h-4 w-4" />
                        {t("templates.preview")}
                      </button>
                      <Link
                        href="/builder"
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors shadow-lg"
                      >
                        <PenLine className="h-4 w-4" />
                        {t("templates.useTemplate")}
                      </Link>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-5 left-5 flex gap-2">
                      {tpl.staffPick && (
                        <span className="flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-indigo-500/30">
                          <Sparkles className="h-3 w-3" />
                          {t("templates.staffPick")}
                        </span>
                      )}
                    </div>
                    <div className="absolute top-5 right-5">
                      {tpl.free ? (
                        <span className="rounded-full bg-emerald-600/90 px-2.5 py-0.5 text-[10px] font-bold uppercase shadow-lg">
                          {t("templates.free")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-amber-600/90 px-2.5 py-0.5 text-[10px] font-bold uppercase shadow-lg">
                          <Crown className="h-2.5 w-2.5" />
                          {t("templates.pro")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-semibold text-lg">{tpl.name}</h3>
                      <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-medium", catColors[tpl.category])}>
                        {tpl.category}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-3 line-clamp-2 leading-relaxed">{tpl.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3 w-3",
                                i < Math.floor(tpl.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-zinc-700"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{tpl.rating}</span>
                        <span className="text-xs text-zinc-500">({tpl.reviewCount})</span>
                      </div>
                      <Link
                        href="/builder"
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium hover:bg-indigo-500 transition-colors"
                      >
                        {t("templates.useTemplate")}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* LIST VIEW */}
        {view === "list" && filtered.length > 0 && (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((tpl, i) => (
                <motion.div
                  layout
                  key={tpl.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { delay: i * 0.03, duration: 0.3, ease: easeOut },
                  }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2, ease: easeOut } }}
                  className={cn(
                    "group flex items-center gap-4 rounded-xl border p-3 transition-all duration-200 hover:shadow-lg",
                    tpl.staffPick
                      ? "border-indigo-500/30 bg-gradient-to-r from-indigo-950/20 to-zinc-900 hover:border-indigo-500/50"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
                  )}
                >
                  {/* Thumbnail */}
                  <div
                    className="h-24 w-[72px] shrink-0 rounded-lg overflow-hidden bg-zinc-800 shadow ring-1 ring-white/5 cursor-pointer"
                    onClick={() => openPreview(tpl)}
                  >
                    {tpl.preview}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold">{tpl.name}</h3>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", catColors[tpl.category])}>
                        {tpl.category}
                      </span>
                      {tpl.free ? (
                        <span className="rounded-full bg-emerald-600/20 text-emerald-400 px-2 py-0.5 text-[10px] font-medium">
                          {t("templates.free")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-amber-600/20 text-amber-400 px-2 py-0.5 text-[10px] font-medium">
                          <Crown className="h-2.5 w-2.5" />
                          {t("templates.pro")}
                        </span>
                      )}
                      {tpl.staffPick && (
                        <span className="flex items-center gap-1 rounded-full bg-indigo-600/20 text-indigo-400 px-2 py-0.5 text-[10px] font-bold">
                          <Sparkles className="h-2.5 w-2.5" />
                          {t("templates.staffPick")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-400 truncate">{tpl.desc}</p>
                    {/* Features row */}
                    <div className="hidden sm:flex items-center gap-2 mt-2">
                      {tpl.features.slice(0, 3).map((f) => (
                        <span key={f} className="flex items-center gap-1 text-[10px] text-zinc-500">
                          <Check className="h-2.5 w-2.5 text-emerald-500" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{tpl.rating}</span>
                      <span className="text-xs text-zinc-500 hidden sm:inline">({tpl.reviewCount})</span>
                    </div>
                    <button
                      onClick={() => openPreview(tpl)}
                      className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors hidden sm:flex items-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {t("templates.preview")}
                    </button>
                    <Link
                      href="/builder"
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 transition-colors"
                    >
                      {t("templates.useTemplate")}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ---- BOTTOM CTA ---- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="mt-24 relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950"
        >
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-96 rounded-full bg-indigo-600/5 blur-3xl" />
          </div>

          <div className="relative px-6 py-14 sm:px-12 text-center">
            <MessageSquarePlus className="h-10 w-10 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold">{t("templates.cantFind")}</h2>
            <p className="mt-3 text-zinc-400 max-w-md mx-auto leading-relaxed">
              Request a custom template tailored to your industry, or start building from a blank canvas with our powerful editor.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => alert("Template request submitted! We'll notify you when it's ready.")} className="rounded-xl border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all w-full sm:w-auto">
                {t("templates.requestTemplate")}
              </button>
              <Link
                href="/builder"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium hover:bg-indigo-500 transition-colors w-full sm:w-auto text-center"
              >
                {t("templates.blankCanvas")}
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ---- PREVIEW MODAL ---- */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              key="modal-content"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: easeOut }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-700/80 bg-zinc-900 shadow-2xl shadow-black/40"
            >
              {/* Close button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 rounded-full bg-zinc-800/80 p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors z-10 backdrop-blur-sm"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid md:grid-cols-[1fr,1.1fr] gap-0">
                {/* Left: Preview */}
                <div className="relative bg-zinc-800/30 p-8 flex items-center justify-center min-h-[340px]">
                  {/* Subtle grid pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="relative w-full max-w-[260px]">
                    <div
                      className="w-full rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                      style={{ aspectRatio: "3/4" }}
                    >
                      {selected.preview}
                    </div>
                  </div>
                </div>

                {/* Right: Details */}
                <div className="p-8 space-y-5">
                  {/* Name + badges */}
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h2 className="text-2xl font-bold">{selected.name}</h2>
                      <span className={cn("rounded-full border px-2.5 py-0.5 text-[10px] font-medium", catColors[selected.category])}>
                        {selected.category}
                      </span>
                      {selected.staffPick && (
                        <span className="flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold uppercase shadow-sm">
                          <Sparkles className="h-3 w-3" />
                          {t("templates.staffPick")}
                        </span>
                      )}
                      {selected.free ? (
                        <span className="rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-medium">
                          {t("templates.free")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full bg-amber-600/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-medium">
                          <Crown className="h-2.5 w-2.5" />
                          {t("templates.pro")}
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-400 leading-relaxed">{selected.desc}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < Math.floor(selected.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-zinc-600"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{selected.rating}</span>
                    <span className="text-sm text-zinc-500">
                      ({selected.reviewCount} {t("templates.reviews")})
                    </span>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2.5">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selected.features.map((f) => (
                        <span
                          key={f}
                          className="flex items-center gap-1.5 rounded-full border border-zinc-700/80 bg-zinc-800/60 px-3 py-1 text-xs text-zinc-300"
                        >
                          <Check className="h-3 w-3 text-emerald-400" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Color variants */}
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2.5">Color Variants</h4>
                    <div className="flex items-center gap-2">
                      {selected.colorVariants.map((color, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedColor(i)}
                          className={cn(
                            "h-7 w-7 rounded-full transition-all duration-200",
                            selectedColor === i
                              ? "ring-2 ring-offset-2 ring-offset-zinc-900 ring-indigo-500 scale-110"
                              : "ring-1 ring-white/10 hover:ring-white/30 hover:scale-105"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Reviews */}
                  <div className="space-y-2.5 pt-1">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Reviews</h4>
                    {[
                      { name: "Sarah M.", text: "This template helped me land my dream job. The design is clean and professional." },
                      { name: "Alex K.", text: "ATS-friendly and looks great. Received compliments from recruiters." },
                    ].map((r) => (
                      <div key={r.name} className="rounded-lg border border-zinc-800 bg-zinc-800/40 p-3">
                        <div className="flex items-center gap-0.5 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                        <p className="mt-1 text-xs text-zinc-500">&mdash; {r.name}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href="/builder"
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 px-6 py-3.5 font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    <PenLine className="h-4 w-4" />
                    {t("templates.useTemplate")}
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
