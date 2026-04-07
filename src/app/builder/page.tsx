"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Sparkles,
  Eye,
  EyeOff,
  Download,
  Share2,
  Plus,
  X,
  Send,
  Loader2,
  Layout,
  Wand2,
  GraduationCap,
  Briefcase,
  User,
  Globe,
  Award,
  Tags,
  Mail,
  Phone,
  MapPin,
  Link2,
  Trash2,
  GripVertical,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  year: string;
}

interface LanguageEntry {
  id: string;
  name: string;
  proficiency: "Native" | "Fluent" | "Intermediate" | "Basic";
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

interface CustomSection {
  id: string;
  title: string;
  content: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface CvData {
  cvTitle: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  experiences: Experience[];
  educations: Education[];
  skills: string[];
  languages: LanguageEntry[];
  certifications: Certification[];
  customSections: CustomSection[];
  selectedTemplate: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const uid = () => Math.random().toString(36).slice(2, 10);

const proficiencyPercent: Record<string, number> = {
  Native: 100,
  Fluent: 85,
  Intermediate: 60,
  Basic: 35,
};

const EASE = "easeOut" as const;

const TEMPLATES = ["Modern", "Classic", "Minimal", "Creative"] as const;

const QUICK_ACTIONS = [
  "Improve Summary",
  "Add Keywords",
  "Fix Grammar",
  "Make Concise",
] as const;

const STORAGE_KEY = "cvspark-cv-data";

function loadFromStorage(): Partial<CvData> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(data: CvData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full — silently ignore
  }
}

/* ------------------------------------------------------------------ */
/*  Template renderers                                                 */
/* ------------------------------------------------------------------ */

interface TemplateProps {
  data: CvData;
}

function ModernTemplate({ data }: TemplateProps) {
  return (
    <div className="px-10 py-10 text-zinc-900 min-h-[297mm]">
      {/* Header */}
      <div className="border-b-2 border-indigo-500 pb-5 mb-7">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          {data.fullName || "Your Name"}
        </h1>
        <p className="text-lg text-indigo-600 font-medium mt-1">
          {data.jobTitle || "Job Title"}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-zinc-500">
          {data.email && (
            <span className="flex items-center gap-1">
              <Mail size={11} className="text-zinc-400" />
              {data.email}
            </span>
          )}
          {data.phone && (
            <span className="flex items-center gap-1">
              <Phone size={11} className="text-zinc-400" />
              {data.phone}
            </span>
          )}
          {data.location && (
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-zinc-400" />
              {data.location}
            </span>
          )}
          {data.linkedin && (
            <span className="flex items-center gap-1">
              <Link2 size={11} className="text-zinc-400" />
              {data.linkedin}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-7">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experiences.some((e) => e.company || e.title) && (
        <div className="mb-7">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-3">
            Work Experience
          </h2>
          <div className="space-y-5">
            {data.experiences
              .filter((e) => e.company || e.title)
              .map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900">{exp.title || "Position"}</h3>
                      <p className="text-sm text-zinc-500">{exp.company}</p>
                    </div>
                    <span className="shrink-0 text-xs text-zinc-400 mt-0.5 tabular-nums">
                      {exp.startDate}
                      {exp.startDate && (exp.current || exp.endDate) && " -- "}
                      {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.filter(Boolean).map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2 text-xs leading-relaxed text-zinc-600">
                          <span className="mt-1.5 h-1 w-1 rounded-full bg-zinc-400 shrink-0" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.educations.some((e) => e.institution || e.degree) && (
        <div className="mb-7">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-3">Education</h2>
          <div className="space-y-3">
            {data.educations.filter((e) => e.institution || e.degree).map((edu) => (
              <div key={edu.id} className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">{edu.degree}{edu.field && ` in ${edu.field}`}</h3>
                  <p className="text-sm text-zinc-500">{edu.institution}</p>
                </div>
                {edu.year && <span className="shrink-0 text-xs text-zinc-400 mt-0.5">{edu.year}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-7">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2.5">Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((skill) => (
              <span key={skill} className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 border border-indigo-100">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {data.languages.some((l) => l.name) && (
        <div className="mb-7">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-3">Languages</h2>
          <div className="space-y-2.5">
            {data.languages.filter((l) => l.name).map((lang) => (
              <div key={lang.id} className="flex items-center gap-3">
                <span className="w-24 text-sm text-zinc-700">{lang.name}</span>
                <div className="flex-1 h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${proficiencyPercent[lang.proficiency] ?? 50}%` }} />
                </div>
                <span className="w-24 text-right text-xs text-zinc-400">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.some((c) => c.name) && (
        <div className="mb-7">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-3">Certifications</h2>
          <div className="space-y-2">
            {data.certifications.filter((c) => c.name).map((cert) => (
              <div key={cert.id} className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">{cert.name}</h3>
                  {cert.issuer && <p className="text-xs text-zinc-500">{cert.issuer}</p>}
                </div>
                {cert.year && <span className="text-xs text-zinc-400">{cert.year}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {data.customSections.filter((s) => s.title && s.content).map((section) => (
        <div key={section.id} className="mb-7">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2">{section.title}</h2>
          <p className="text-sm leading-relaxed text-zinc-600 whitespace-pre-line">{section.content}</p>
        </div>
      ))}
    </div>
  );
}

function ClassicTemplate({ data }: TemplateProps) {
  return (
    <div className="px-10 py-10 text-zinc-900 min-h-[297mm]">
      {/* Header - centered classic style */}
      <div className="text-center border-b border-zinc-300 pb-6 mb-7">
        <h1 className="text-3xl font-serif font-bold text-zinc-900 tracking-wide">
          {data.fullName || "Your Name"}
        </h1>
        <p className="text-base text-zinc-600 mt-1 italic">
          {data.jobTitle || "Job Title"}
        </p>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-3 text-xs text-zinc-500">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-6">
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-200 pb-1 mb-3">
            Profile
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experiences.some((e) => e.company || e.title) && (
        <div className="mb-6">
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-200 pb-1 mb-3">
            Professional Experience
          </h2>
          <div className="space-y-5">
            {data.experiences.filter((e) => e.company || e.title).map((exp) => (
              <div key={exp.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">{exp.title || "Position"}</h3>
                    <p className="text-sm text-zinc-500 italic">{exp.company}</p>
                  </div>
                  <span className="shrink-0 text-xs text-zinc-400 mt-0.5 tabular-nums">
                    {exp.startDate}{exp.startDate && (exp.current || exp.endDate) && " - "}{exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-2 space-y-1 ml-4">
                    {exp.bullets.filter(Boolean).map((bullet, bIdx) => (
                      <li key={bIdx} className="text-xs leading-relaxed text-zinc-600 list-disc">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.educations.some((e) => e.institution || e.degree) && (
        <div className="mb-6">
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-200 pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {data.educations.filter((e) => e.institution || e.degree).map((edu) => (
              <div key={edu.id} className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">{edu.degree}{edu.field && ` in ${edu.field}`}</h3>
                  <p className="text-sm text-zinc-500 italic">{edu.institution}</p>
                </div>
                {edu.year && <span className="shrink-0 text-xs text-zinc-400 mt-0.5">{edu.year}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-200 pb-1 mb-3">
            Skills
          </h2>
          <p className="text-sm text-zinc-600">{data.skills.join(" \u2022 ")}</p>
        </div>
      )}

      {/* Languages */}
      {data.languages.some((l) => l.name) && (
        <div className="mb-6">
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-200 pb-1 mb-3">
            Languages
          </h2>
          <p className="text-sm text-zinc-600">
            {data.languages.filter((l) => l.name).map((l) => `${l.name} (${l.proficiency})`).join(" \u2022 ")}
          </p>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.some((c) => c.name) && (
        <div className="mb-6">
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-200 pb-1 mb-3">
            Certifications
          </h2>
          <div className="space-y-1">
            {data.certifications.filter((c) => c.name).map((cert) => (
              <p key={cert.id} className="text-sm text-zinc-600">
                {cert.name}{cert.issuer && ` — ${cert.issuer}`}{cert.year && ` (${cert.year})`}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections */}
      {data.customSections.filter((s) => s.title && s.content).map((section) => (
        <div key={section.id} className="mb-6">
          <h2 className="text-xs font-serif font-bold uppercase tracking-widest text-zinc-800 border-b border-zinc-200 pb-1 mb-3">{section.title}</h2>
          <p className="text-sm leading-relaxed text-zinc-600 whitespace-pre-line">{section.content}</p>
        </div>
      ))}
    </div>
  );
}

function MinimalTemplate({ data }: TemplateProps) {
  return (
    <div className="px-12 py-12 text-zinc-900 min-h-[297mm]">
      {/* Header - ultra minimal */}
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-wide text-zinc-900">
          {data.fullName || "Your Name"}
        </h1>
        <p className="text-sm text-zinc-400 mt-1 tracking-wide">
          {data.jobTitle || "Job Title"}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[11px] text-zinc-400">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-8">
          <p className="text-sm leading-relaxed text-zinc-500">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experiences.some((e) => e.company || e.title) && (
        <div className="mb-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-400 mb-4">
            Experience
          </h2>
          <div className="space-y-5">
            {data.experiences.filter((e) => e.company || e.title).map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-medium text-zinc-800">{exp.title || "Position"}</h3>
                  <span className="text-[11px] text-zinc-400 tabular-nums">
                    {exp.startDate}{exp.startDate && (exp.current || exp.endDate) && " — "}{exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{exp.company}</p>
                {exp.bullets.filter(Boolean).length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.bullets.filter(Boolean).map((bullet, bIdx) => (
                      <li key={bIdx} className="text-xs leading-relaxed text-zinc-500 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1 before:h-px before:bg-zinc-300">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.educations.some((e) => e.institution || e.degree) && (
        <div className="mb-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-400 mb-4">Education</h2>
          <div className="space-y-3">
            {data.educations.filter((e) => e.institution || e.degree).map((edu) => (
              <div key={edu.id} className="flex items-baseline justify-between">
                <div>
                  <h3 className="text-sm font-medium text-zinc-800">{edu.degree}{edu.field && `, ${edu.field}`}</h3>
                  <p className="text-xs text-zinc-400">{edu.institution}</p>
                </div>
                {edu.year && <span className="text-[11px] text-zinc-400">{edu.year}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-400 mb-3">Skills</h2>
          <p className="text-xs text-zinc-500 leading-relaxed">{data.skills.join(", ")}</p>
        </div>
      )}

      {/* Languages */}
      {data.languages.some((l) => l.name) && (
        <div className="mb-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-400 mb-3">Languages</h2>
          <p className="text-xs text-zinc-500">
            {data.languages.filter((l) => l.name).map((l) => `${l.name} (${l.proficiency})`).join(", ")}
          </p>
        </div>
      )}

      {/* Certifications */}
      {data.certifications.some((c) => c.name) && (
        <div className="mb-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-400 mb-3">Certifications</h2>
          <div className="space-y-1">
            {data.certifications.filter((c) => c.name).map((cert) => (
              <p key={cert.id} className="text-xs text-zinc-500">
                {cert.name}{cert.issuer && ` — ${cert.issuer}`}{cert.year && `, ${cert.year}`}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Custom */}
      {data.customSections.filter((s) => s.title && s.content).map((section) => (
        <div key={section.id} className="mb-8">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-400 mb-3">{section.title}</h2>
          <p className="text-xs leading-relaxed text-zinc-500 whitespace-pre-line">{section.content}</p>
        </div>
      ))}
    </div>
  );
}

function CreativeTemplate({ data }: TemplateProps) {
  return (
    <div className="flex min-h-[297mm]">
      {/* Sidebar */}
      <div className="w-[35%] bg-zinc-900 text-white px-6 py-8">
        {/* Avatar placeholder */}
        <div className="w-20 h-20 rounded-full bg-violet-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
          {data.fullName ? data.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "CV"}
        </div>
        <h1 className="text-xl font-bold text-center">{data.fullName || "Your Name"}</h1>
        <p className="text-sm text-violet-300 text-center mt-1">{data.jobTitle || "Job Title"}</p>

        {/* Contact */}
        <div className="mt-6 space-y-2 text-xs">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-2">Contact</h2>
          {data.email && <p className="text-zinc-300">{data.email}</p>}
          {data.phone && <p className="text-zinc-300">{data.phone}</p>}
          {data.location && <p className="text-zinc-300">{data.location}</p>}
          {data.linkedin && <p className="text-zinc-300">{data.linkedin}</p>}
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="mt-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-violet-500/20 border border-violet-400/30 px-2.5 py-0.5 text-[10px] text-violet-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.some((l) => l.name) && (
          <div className="mt-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-3">Languages</h2>
            <div className="space-y-2">
              {data.languages.filter((l) => l.name).map((lang) => (
                <div key={lang.id}>
                  <div className="flex justify-between text-xs text-zinc-300 mb-1">
                    <span>{lang.name}</span>
                    <span className="text-zinc-500">{lang.proficiency}</span>
                  </div>
                  <div className="h-1 rounded-full bg-zinc-700 overflow-hidden">
                    <div className="h-full rounded-full bg-violet-400" style={{ width: `${proficiencyPercent[lang.proficiency] ?? 50}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications.some((c) => c.name) && (
          <div className="mt-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mb-3">Certifications</h2>
            <div className="space-y-2">
              {data.certifications.filter((c) => c.name).map((cert) => (
                <div key={cert.id}>
                  <p className="text-xs font-medium text-zinc-200">{cert.name}</p>
                  <p className="text-[10px] text-zinc-400">{cert.issuer}{cert.year && ` · ${cert.year}`}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 py-8 text-zinc-900">
        {/* Summary */}
        {data.summary && (
          <div className="mb-7">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 mb-2">About Me</h2>
            <p className="text-sm leading-relaxed text-zinc-600">{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experiences.some((e) => e.company || e.title) && (
          <div className="mb-7">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 mb-3">Experience</h2>
            <div className="space-y-5 border-l-2 border-violet-200 pl-5">
              {data.experiences.filter((e) => e.company || e.title).map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-[25px] top-1 w-2.5 h-2.5 rounded-full bg-violet-500 border-2 border-white" />
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900">{exp.title || "Position"}</h3>
                      <p className="text-xs text-violet-500 font-medium">{exp.company}</p>
                    </div>
                    <span className="shrink-0 text-[11px] text-zinc-400 tabular-nums bg-violet-50 px-2 py-0.5 rounded-full">
                      {exp.startDate}{exp.startDate && (exp.current || exp.endDate) && " — "}{exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.bullets.filter(Boolean).length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.bullets.filter(Boolean).map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2 text-xs leading-relaxed text-zinc-600">
                          <span className="mt-1.5 h-1 w-1 rounded-full bg-violet-300 shrink-0" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.educations.some((e) => e.institution || e.degree) && (
          <div className="mb-7">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 mb-3">Education</h2>
            <div className="space-y-3">
              {data.educations.filter((e) => e.institution || e.degree).map((edu) => (
                <div key={edu.id} className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">{edu.degree}{edu.field && ` in ${edu.field}`}</h3>
                    <p className="text-xs text-zinc-500">{edu.institution}</p>
                  </div>
                  {edu.year && <span className="text-[11px] text-zinc-400 bg-violet-50 px-2 py-0.5 rounded-full">{edu.year}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {data.customSections.filter((s) => s.title && s.content).map((section) => (
          <div key={section.id} className="mb-7">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600 mb-2">{section.title}</h2>
            <p className="text-sm leading-relaxed text-zinc-600 whitespace-pre-line">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const templateComponents: Record<string, React.FC<TemplateProps>> = {
  Modern: ModernTemplate,
  Classic: ClassicTemplate,
  Minimal: MinimalTemplate,
  Creative: CreativeTemplate,
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BuilderPage() {
  /* ---- Initial load from localStorage ---- */
  const [loaded, setLoaded] = useState(false);

  /* ---- CV title ---- */
  const [cvTitle, setCvTitle] = useState("Untitled CV");
  const [editingTitle, setEditingTitle] = useState(false);

  /* ---- save indicator ---- */
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- view state ---- */
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [templateOpen, setTemplateOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("Modern");

  /* ---- collapsible sections ---- */
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    experience: true,
    education: false,
    skills: false,
    languages: false,
    certifications: false,
  });
  const toggle = (key: string) =>
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  /* ---- personal info ---- */
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [summary, setSummary] = useState("");

  /* ---- experience ---- */
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: uid(),
      company: "",
      title: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""],
    },
  ]);

  /* ---- education ---- */
  const [educations, setEducations] = useState<Education[]>([
    {
      id: uid(),
      institution: "",
      degree: "",
      field: "",
      year: "",
    },
  ]);

  /* ---- skills ---- */
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  /* ---- languages ---- */
  const [languages, setLanguages] = useState<LanguageEntry[]>([
    { id: uid(), name: "", proficiency: "Basic" },
  ]);

  /* ---- certifications ---- */
  const [certifications, setCertifications] = useState<Certification[]>([]);

  /* ---- custom sections ---- */
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);

  /* ---- AI loading flags ---- */
  const [aiLoading, setAiLoading] = useState<Record<string, boolean>>({});

  /* ---- PDF export state ---- */
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  /* ---- Load from localStorage on mount ---- */
  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      if (saved.cvTitle) setCvTitle(saved.cvTitle);
      if (saved.fullName) setFullName(saved.fullName);
      if (saved.jobTitle) setJobTitle(saved.jobTitle);
      if (saved.email) setEmail(saved.email);
      if (saved.phone) setPhone(saved.phone);
      if (saved.location) setLocation(saved.location);
      if (saved.linkedin) setLinkedin(saved.linkedin);
      if (saved.summary) setSummary(saved.summary);
      if (saved.experiences?.length) setExperiences(saved.experiences);
      if (saved.educations?.length) setEducations(saved.educations);
      if (saved.skills?.length) setSkills(saved.skills);
      if (saved.languages?.length) setLanguages(saved.languages);
      if (saved.certifications?.length) setCertifications(saved.certifications);
      if (saved.customSections?.length) setCustomSections(saved.customSections);
      if (saved.selectedTemplate) setSelectedTemplate(saved.selectedTemplate);
    }
    setLoaded(true);
  }, []);

  /* ---- Build CvData object ---- */
  const cvData: CvData = useMemo(
    () => ({
      cvTitle,
      fullName,
      jobTitle,
      email,
      phone,
      location,
      linkedin,
      summary,
      experiences,
      educations,
      skills,
      languages,
      certifications,
      customSections,
      selectedTemplate,
    }),
    [cvTitle, fullName, jobTitle, email, phone, location, linkedin, summary, experiences, educations, skills, languages, certifications, customSections, selectedTemplate]
  );

  /* ---- Auto-save to localStorage ---- */
  const triggerAutoSave = useCallback(() => {
    setSaveStatus("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaveStatus("saved");
    }, 600);
  }, []);

  // Save to localStorage whenever cvData changes (after initial load)
  useEffect(() => {
    if (!loaded) return;
    saveToStorage(cvData);
    triggerAutoSave();
  }, [cvData, loaded, triggerAutoSave]);

  const simulateAi = useCallback(
    (key: string, cb: () => void, delay = 1500) => {
      setAiLoading((p) => ({ ...p, [key]: true }));
      setTimeout(() => {
        cb();
        setAiLoading((p) => ({ ...p, [key]: false }));
      }, delay);
    },
    []
  );

  /* ---- AI assistant panel ---- */
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  const sendChat = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const userMsg: ChatMessage = { id: uid(), role: "user", text };
      setChatMessages((m) => [...m, userMsg]);
      setChatInput("");
      setChatLoading(true);
      setTimeout(() => {
        const responses: Record<string, string> = {
          "Improve Summary":
            "I've enhanced your professional summary to be more impactful and keyword-rich. It now highlights your core strengths and quantifiable achievements more effectively.",
          "Add Keywords":
            "Based on your target role, I suggest weaving in: microservices, CI/CD, cloud-native, stakeholder management, and data-driven decision making.",
          "Fix Grammar":
            "I've reviewed every section and corrected tense consistency, punctuation, and phrasing. All bullet points now start with strong action verbs.",
          "Make Concise":
            "I've trimmed redundant phrases and tightened each bullet point to be punchier while retaining impact. Your CV is now 20% shorter.",
        };
        const reply =
          responses[text] ||
          "Great question! I've analyzed your CV and applied targeted improvements based on your request. Check the relevant sections for the updates.";
        setChatMessages((m) => [
          ...m,
          { id: uid(), role: "assistant", text: reply },
        ]);
        setChatLoading(false);
      }, 1800);
    },
    []
  );

  /* ---- PDF export ---- */
  const handleDownloadPdf = useCallback(async () => {
    if (!previewRef.current || exporting) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      const el = previewRef.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF("p", "mm", "a4");

      // Handle multi-page if content is taller than A4
      const pageHeight = 297;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = -(imgHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${cvTitle || "cv"}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      // Fallback to print
      window.print();
    } finally {
      setExporting(false);
    }
  }, [cvTitle, exporting]);

  /* ---- completion percentage ---- */
  const completionPercent = useMemo(() => {
    const fields = [
      fullName,
      jobTitle,
      email,
      phone,
      location,
      summary,
      experiences.length > 0 && experiences[0].company ? "y" : "",
      experiences.length > 0 && experiences[0].title ? "y" : "",
      experiences.length > 0 && experiences[0].bullets.length > 0 ? "y" : "",
      educations.length > 0 && educations[0].institution ? "y" : "",
      educations.length > 0 && educations[0].degree ? "y" : "",
      skills.length > 0 ? "y" : "",
      languages.length > 0 && languages[0].name ? "y" : "",
      linkedin,
      certifications.length > 0 ? "y" : "",
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [fullName, jobTitle, email, phone, location, summary, experiences, educations, skills, languages, linkedin, certifications]);

  /* ---- style tokens ---- */
  const inputClass =
    "w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-colors";

  const labelClass = "block text-xs font-medium text-zinc-500 mb-1.5";

  const btnSmall =
    "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer";

  /* ---- section header ---- */
  const SectionHeader = ({
    id,
    icon: Icon,
    title,
    count,
  }: {
    id: string;
    icon: React.ElementType;
    title: string;
    count?: number;
  }) => (
    <button
      onClick={() => toggle(id)}
      className="group flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm font-semibold text-zinc-200 hover:bg-zinc-800/50 transition-colors"
    >
      <span className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
          <Icon size={14} />
        </span>
        {title}
        {count !== undefined && count > 0 && (
          <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
            {count}
          </span>
        )}
      </span>
      <motion.span
        animate={{ rotate: openSections[id] ? 180 : 0 }}
        transition={{ duration: 0.2, ease: EASE }}
      >
        <ChevronDown size={16} className="text-zinc-600" />
      </motion.span>
    </button>
  );

  /* ---- collapsible wrapper ---- */
  const Collapse = ({
    id,
    children,
  }: {
    id: string;
    children: React.ReactNode;
  }) => (
    <AnimatePresence initial={false}>
      {openSections[id] && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="overflow-hidden"
        >
          <div className="space-y-3 px-4 pb-5 pt-1">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  /* ---- Get template component ---- */
  const TemplateComponent = templateComponents[selectedTemplate] || ModernTemplate;

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100">
      {/* ============================================================ */}
      {/*  TOP TOOLBAR                                                  */}
      {/* ============================================================ */}
      <header className="flex items-center gap-3 border-b border-zinc-800/80 bg-zinc-950 px-4 py-2.5 shrink-0">
        {/* Back */}
        <Link
          href="/dashboard"
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={18} />
        </Link>

        {/* Divider */}
        <div className="h-5 w-px bg-zinc-800" />

        {/* Title */}
        {editingTitle ? (
          <input
            autoFocus
            value={cvTitle}
            onChange={(e) => setCvTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
            className="rounded-lg border border-indigo-500/50 bg-zinc-900 px-2.5 py-1 text-sm font-semibold text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 w-48"
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <FileText size={14} className="text-zinc-500" />
            {cvTitle}
          </button>
        )}

        {/* Save status */}
        <AnimatePresence mode="wait">
          <motion.span
            key={saveStatus}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            transition={{ duration: 0.15, ease: EASE }}
            className={cn(
              "hidden sm:flex items-center gap-1.5 text-xs",
              saveStatus === "saved" ? "text-emerald-500" : "text-zinc-500"
            )}
          >
            {saveStatus === "saved" ? (
              <>
                <Check size={12} />
                All changes saved
              </>
            ) : (
              <>
                <Loader2 size={12} className="animate-spin" />
                Saving...
              </>
            )}
          </motion.span>
        </AnimatePresence>

        {/* Center spacer */}
        <div className="flex-1" />

        {/* Template selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setTemplateOpen(!templateOpen)}
            className={cn(
              btnSmall,
              "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
            )}
          >
            <Layout size={14} />
            {selectedTemplate}
            <ChevronDown
              size={12}
              className={cn(
                "transition-transform",
                templateOpen && "rotate-180"
              )}
            />
          </button>
          <AnimatePresence>
            {templateOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15, ease: EASE }}
                className="absolute left-1/2 -translate-x-1/2 top-full z-50 mt-1.5 w-44 rounded-xl border border-zinc-800 bg-zinc-900 py-1.5 shadow-2xl shadow-black/50"
              >
                {TEMPLATES.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedTemplate(t);
                      setTemplateOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm hover:bg-zinc-800 transition-colors",
                      t === selectedTemplate
                        ? "text-indigo-400"
                        : "text-zinc-400"
                    )}
                  >
                    {t === selectedTemplate && <Check size={14} />}
                    <span className={t === selectedTemplate ? "" : "ml-[22px]"}>
                      {t}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Center spacer */}
        <div className="flex-1" />

        {/* Preview toggle (mobile) */}
        <button
          onClick={() =>
            setMobileView(mobileView === "editor" ? "preview" : "editor")
          }
          className={cn(
            btnSmall,
            "lg:hidden border border-zinc-800 text-zinc-300 hover:bg-zinc-800"
          )}
        >
          {mobileView === "preview" ? (
            <EyeOff size={14} />
          ) : (
            <Eye size={14} />
          )}
          {mobileView === "preview" ? "Edit" : "Preview"}
        </button>

        {/* Share */}
        <button
          onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied to clipboard!"); }}
          className={cn(
            btnSmall,
            "hidden sm:inline-flex border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          )}
        >
          <Share2 size={14} />
          Share
        </button>

        {/* Download */}
        <button
          onClick={handleDownloadPdf}
          disabled={exporting}
          className={cn(
            btnSmall,
            "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20",
            exporting && "opacity-70 cursor-wait"
          )}
        >
          {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          <span className="hidden sm:inline">{exporting ? "Exporting..." : "Download PDF"}</span>
        </button>
      </header>

      {/* ============================================================ */}
      {/*  MAIN LAYOUT                                                  */}
      {/* ============================================================ */}
      <div className="flex flex-1 overflow-hidden">
        {/* ---------------------------------------------------------- */}
        {/*  LEFT PANEL  - Editor (~45%)                                */}
        {/* ---------------------------------------------------------- */}
        <aside
          className={cn(
            "w-full lg:w-[45%] xl:w-[42%] shrink-0 flex flex-col overflow-hidden border-r border-zinc-800/60 bg-zinc-950",
            mobileView === "preview" ? "hidden lg:flex" : "flex"
          )}
        >
          {/* Completion indicator */}
          <div className="shrink-0 border-b border-zinc-800/60 px-5 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-400">
                Resume completion
              </span>
              <span
                className={cn(
                  "text-xs font-bold",
                  completionPercent >= 80
                    ? "text-emerald-400"
                    : completionPercent >= 50
                    ? "text-amber-400"
                    : "text-zinc-500"
                )}
              >
                {completionPercent}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  completionPercent >= 80
                    ? "bg-emerald-500"
                    : completionPercent >= 50
                    ? "bg-amber-500"
                    : "bg-indigo-500"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${completionPercent}%` }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </div>
          </div>

          {/* Scrollable form */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 scrollbar-thin">
            {/* ---- Personal Info ---- */}
            <SectionHeader id="personal" icon={User} title="Personal Info" />
            <Collapse id="personal">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input className={inputClass} placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Job Title</label>
                  <input className={inputClass} placeholder="Software Engineer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Email</label>
                  <input className={inputClass} placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input className={inputClass} placeholder="+1 234 567 890" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Location</label>
                  <input className={inputClass} placeholder="San Francisco, CA" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn URL</label>
                  <input className={inputClass} placeholder="linkedin.com/in/johndoe" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={labelClass}>Professional Summary</label>
                  <button
                    onClick={() =>
                      simulateAi("summary", () =>
                        setSummary(
                          "Innovative and detail-oriented software engineer with over 5 years of experience in full-stack web development. Adept at translating complex business requirements into elegant, scalable solutions. Proven track record of leading cross-functional teams and delivering high-impact projects on time."
                        )
                      )
                    }
                    className={cn(btnSmall, "text-indigo-400 hover:bg-indigo-500/10")}
                  >
                    {aiLoading["summary"] ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                    AI Enhance
                  </button>
                </div>
                <textarea
                  rows={4}
                  className={cn(inputClass, "resize-none")}
                  placeholder="Brief professional summary highlighting your key strengths..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>
            </Collapse>

            {/* ---- Work Experience ---- */}
            <SectionHeader id="experience" icon={Briefcase} title="Work Experience" count={experiences.length} />
            <Collapse id="experience">
              {experiences.map((exp, idx) => (
                <div key={exp.id} className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical size={14} className="text-zinc-700 cursor-grab" />
                      <span className="text-xs font-medium text-zinc-500">Position {idx + 1}</span>
                    </div>
                    {experiences.length > 1 && (
                      <button
                        onClick={() => setExperiences((p) => p.filter((e) => e.id !== exp.id))}
                        className="rounded-lg p-1 text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Company</label>
                      <input className={inputClass} placeholder="Company name" value={exp.company}
                        onChange={(e) => setExperiences((p) => p.map((x) => x.id === exp.id ? { ...x, company: e.target.value } : x))} />
                    </div>
                    <div>
                      <label className={labelClass}>Job Title</label>
                      <input className={inputClass} placeholder="Your role" value={exp.title}
                        onChange={(e) => setExperiences((p) => p.map((x) => x.id === exp.id ? { ...x, title: e.target.value } : x))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Start Date</label>
                      <input type="month" className={inputClass} value={exp.startDate}
                        onChange={(e) => setExperiences((p) => p.map((x) => x.id === exp.id ? { ...x, startDate: e.target.value } : x))} />
                    </div>
                    <div>
                      <label className={labelClass}>End Date</label>
                      <input type="month" className={cn(inputClass, exp.current && "opacity-40")} value={exp.endDate} disabled={exp.current}
                        onChange={(e) => setExperiences((p) => p.map((x) => x.id === exp.id ? { ...x, endDate: e.target.value } : x))} />
                      <label className="mt-2 flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                        <input type="checkbox" checked={exp.current}
                          onChange={(e) => setExperiences((p) => p.map((x) => x.id === exp.id ? { ...x, current: e.target.checked, endDate: e.target.checked ? "" : x.endDate } : x))}
                          className="rounded border-zinc-700 bg-zinc-800 text-indigo-500 focus:ring-indigo-500/30" />
                        Currently working here
                      </label>
                    </div>
                  </div>

                  {/* Bullet points */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={labelClass}>Description Bullets</label>
                      <button
                        onClick={() =>
                          simulateAi(`exp-${exp.id}`, () =>
                            setExperiences((p) =>
                              p.map((x) =>
                                x.id === exp.id
                                  ? {
                                      ...x,
                                      bullets: [
                                        "Spearheaded the development of a microservices architecture that reduced deployment time by 60%",
                                        "Collaborated with product managers and designers to deliver features that increased user retention by 25%",
                                        "Implemented comprehensive testing strategies achieving 95% code coverage",
                                      ],
                                    }
                                  : x
                              )
                            )
                          )
                        }
                        className={cn(btnSmall, "text-indigo-400 hover:bg-indigo-500/10")}
                      >
                        {aiLoading[`exp-${exp.id}`] ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                        Improve Bullets
                      </button>
                    </div>
                    <div className="space-y-2">
                      {exp.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-zinc-600 shrink-0" />
                          <input className={cn(inputClass, "flex-1")} value={bullet} placeholder="Describe an achievement..."
                            onChange={(e) => setExperiences((p) => p.map((x) => x.id === exp.id ? { ...x, bullets: x.bullets.map((b, i) => i === bIdx ? e.target.value : b) } : x))} />
                          <button
                            onClick={() => setExperiences((p) => p.map((x) => x.id === exp.id ? { ...x, bullets: x.bullets.filter((_, i) => i !== bIdx) } : x))}
                            className="mt-2 text-zinc-600 hover:text-red-400 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setExperiences((p) => p.map((x) => x.id === exp.id ? { ...x, bullets: [...x.bullets, ""] } : x))}
                        className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors flex items-center gap-1"
                      >
                        <Plus size={12} />
                        Add bullet point
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() =>
                  setExperiences((p) => [...p, { id: uid(), company: "", title: "", startDate: "", endDate: "", current: false, bullets: [""] }])
                }
                className={cn(btnSmall, "w-full justify-center border border-dashed border-zinc-700 text-zinc-500 hover:border-indigo-500 hover:text-indigo-400 py-2.5")}
              >
                <Plus size={14} />
                Add Experience
              </button>
            </Collapse>

            {/* ---- Education ---- */}
            <SectionHeader id="education" icon={GraduationCap} title="Education" count={educations.length} />
            <Collapse id="education">
              {educations.map((edu, idx) => (
                <div key={edu.id} className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-500">Education {idx + 1}</span>
                    {educations.length > 1 && (
                      <button onClick={() => setEducations((p) => p.filter((e) => e.id !== edu.id))}
                        className="rounded-lg p-1 text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Institution</label>
                      <input className={inputClass} placeholder="University name" value={edu.institution}
                        onChange={(e) => setEducations((p) => p.map((x) => x.id === edu.id ? { ...x, institution: e.target.value } : x))} />
                    </div>
                    <div>
                      <label className={labelClass}>Degree</label>
                      <input className={inputClass} placeholder="Bachelor of Science" value={edu.degree}
                        onChange={(e) => setEducations((p) => p.map((x) => x.id === edu.id ? { ...x, degree: e.target.value } : x))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Field of Study</label>
                      <input className={inputClass} placeholder="Computer Science" value={edu.field}
                        onChange={(e) => setEducations((p) => p.map((x) => x.id === edu.id ? { ...x, field: e.target.value } : x))} />
                    </div>
                    <div>
                      <label className={labelClass}>Graduation Year</label>
                      <input className={inputClass} placeholder="2020" value={edu.year}
                        onChange={(e) => setEducations((p) => p.map((x) => x.id === edu.id ? { ...x, year: e.target.value } : x))} />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setEducations((p) => [...p, { id: uid(), institution: "", degree: "", field: "", year: "" }])}
                className={cn(btnSmall, "w-full justify-center border border-dashed border-zinc-700 text-zinc-500 hover:border-indigo-500 hover:text-indigo-400 py-2.5")}
              >
                <Plus size={14} />
                Add Education
              </button>
            </Collapse>

            {/* ---- Skills ---- */}
            <SectionHeader id="skills" icon={Tags} title="Skills" count={skills.length} />
            <Collapse id="skills">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <motion.span key={skill} layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15, ease: EASE }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 border border-indigo-500/15">
                    {skill}
                    <button onClick={() => setSkills((p) => p.filter((s) => s !== skill))}
                      className="ml-0.5 rounded-full p-0.5 hover:bg-indigo-500/20 hover:text-red-300 transition-colors">
                      <X size={11} />
                    </button>
                  </motion.span>
                ))}
              </div>
              <div className="flex gap-2">
                <input className={cn(inputClass, "flex-1")} placeholder="Type a skill and press Enter..." value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && skillInput.trim() && !skills.includes(skillInput.trim())) {
                      setSkills((p) => [...p, skillInput.trim()]);
                      setSkillInput("");
                    }
                  }} />
                <button onClick={() => { if (skillInput.trim() && !skills.includes(skillInput.trim())) { setSkills((p) => [...p, skillInput.trim()]); setSkillInput(""); } }}
                  className={cn(btnSmall, "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200")}>
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={() => simulateAi("skills", () => setSkills((p) => [...p, ...["Docker", "AWS", "GraphQL", "Git", "Agile"].filter((s) => !p.includes(s))]))}
                className={cn(btnSmall, "text-indigo-400 hover:bg-indigo-500/10")}>
                {aiLoading["skills"] ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                AI Suggest Skills
              </button>
            </Collapse>

            {/* ---- Languages ---- */}
            <SectionHeader id="languages" icon={Globe} title="Languages" count={languages.length} />
            <Collapse id="languages">
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3">
                  <div className="flex-1">
                    <label className={labelClass}>Language</label>
                    <input className={inputClass} placeholder="e.g. English" value={lang.name}
                      onChange={(e) => setLanguages((p) => p.map((x) => x.id === lang.id ? { ...x, name: e.target.value } : x))} />
                  </div>
                  <div className="flex-1">
                    <label className={labelClass}>Proficiency</label>
                    <select className={cn(inputClass, "appearance-none cursor-pointer")} value={lang.proficiency}
                      onChange={(e) => setLanguages((p) => p.map((x) => x.id === lang.id ? { ...x, proficiency: e.target.value as LanguageEntry["proficiency"] } : x))}>
                      <option>Native</option>
                      <option>Fluent</option>
                      <option>Intermediate</option>
                      <option>Basic</option>
                    </select>
                  </div>
                  <button onClick={() => setLanguages((p) => p.filter((x) => x.id !== lang.id))}
                    className="mt-5 rounded-lg p-1 text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button onClick={() => setLanguages((p) => [...p, { id: uid(), name: "", proficiency: "Basic" }])}
                className={cn(btnSmall, "w-full justify-center border border-dashed border-zinc-700 text-zinc-500 hover:border-indigo-500 hover:text-indigo-400 py-2.5")}>
                <Plus size={14} />
                Add Language
              </button>
            </Collapse>

            {/* ---- Certifications ---- */}
            <SectionHeader id="certifications" icon={Award} title="Certifications" count={certifications.length} />
            <Collapse id="certifications">
              {certifications.map((cert, idx) => (
                <div key={cert.id} className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-500">Certification {idx + 1}</span>
                    <button onClick={() => setCertifications((p) => p.filter((c) => c.id !== cert.id))}
                      className="rounded-lg p-1 text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className={labelClass}>Name</label>
                      <input className={inputClass} placeholder="AWS Solutions Architect" value={cert.name}
                        onChange={(e) => setCertifications((p) => p.map((x) => x.id === cert.id ? { ...x, name: e.target.value } : x))} />
                    </div>
                    <div>
                      <label className={labelClass}>Issuing Org</label>
                      <input className={inputClass} placeholder="Amazon" value={cert.issuer}
                        onChange={(e) => setCertifications((p) => p.map((x) => x.id === cert.id ? { ...x, issuer: e.target.value } : x))} />
                    </div>
                    <div>
                      <label className={labelClass}>Year</label>
                      <input className={inputClass} placeholder="2024" value={cert.year}
                        onChange={(e) => setCertifications((p) => p.map((x) => x.id === cert.id ? { ...x, year: e.target.value } : x))} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => setCertifications((p) => [...p, { id: uid(), name: "", issuer: "", year: "" }])}
                className={cn(btnSmall, "w-full justify-center border border-dashed border-zinc-700 text-zinc-500 hover:border-indigo-500 hover:text-indigo-400 py-2.5")}>
                <Plus size={14} />
                Add Certification
              </button>
            </Collapse>

            {/* ---- Custom Sections ---- */}
            {customSections.map((section) => (
              <div key={section.id}>
                <div className="flex items-center justify-between rounded-xl px-4 py-3.5">
                  <input
                    className="bg-transparent text-sm font-semibold text-zinc-200 border-b border-transparent focus:border-indigo-500 focus:outline-none transition-colors"
                    value={section.title} placeholder="Section Title"
                    onChange={(e) => setCustomSections((p) => p.map((s) => s.id === section.id ? { ...s, title: e.target.value } : s))} />
                  <button onClick={() => setCustomSections((p) => p.filter((s) => s.id !== section.id))}
                    className="rounded-lg p-1 text-zinc-600 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="px-4 pb-4">
                  <textarea rows={3} className={cn(inputClass, "resize-none")} placeholder="Add content for this section..." value={section.content}
                    onChange={(e) => setCustomSections((p) => p.map((s) => s.id === section.id ? { ...s, content: e.target.value } : s))} />
                </div>
              </div>
            ))}

            {/* Add Section button */}
            <div className="pt-3 pb-6 px-1">
              <button onClick={() => setCustomSections((p) => [...p, { id: uid(), title: "", content: "" }])}
                className={cn(btnSmall, "w-full justify-center border border-dashed border-zinc-700 text-zinc-500 hover:border-indigo-500 hover:text-indigo-400 py-3 rounded-xl")}>
                <Plus size={14} />
                Add Custom Section
              </button>
            </div>
          </div>
        </aside>

        {/* ---------------------------------------------------------- */}
        {/*  RIGHT PANEL  - Preview (~55%)                              */}
        {/* ---------------------------------------------------------- */}
        <main
          className={cn(
            "flex-1 overflow-y-auto bg-zinc-900/50",
            mobileView === "editor" ? "hidden lg:block" : "block"
          )}
        >
          <div className="flex items-start justify-center p-6 lg:p-10 min-h-full">
            <div ref={previewRef} className="w-full max-w-[210mm] rounded-sm bg-white shadow-2xl shadow-black/50 ring-1 ring-zinc-800/30">
              <TemplateComponent data={cvData} />
            </div>
          </div>
        </main>
      </div>

      {/* ============================================================ */}
      {/*  AI ASSISTANT - FAB + PANEL                                   */}
      {/* ============================================================ */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {assistantOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="w-[340px] rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-3.5 bg-zinc-900/50">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15">
                    <Sparkles size={14} className="text-indigo-400" />
                  </span>
                  <div>
                    <span className="text-sm font-semibold text-zinc-100">AI Assistant</span>
                    <p className="text-[10px] text-zinc-500">Powered by CVSpark AI</p>
                  </div>
                </div>
                <button onClick={() => setAssistantOpen(false)} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Quick action chips */}
              <div className="flex flex-wrap gap-1.5 px-4 pt-3 pb-1">
                {QUICK_ACTIONS.map((action) => (
                  <button key={action} onClick={() => sendChat(action)}
                    className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-[11px] text-zinc-400 hover:border-indigo-500/50 hover:text-indigo-300 hover:bg-indigo-500/5 transition-colors">
                    {action}
                  </button>
                ))}
              </div>

              {/* Messages */}
              <div className="h-60 overflow-y-auto px-4 py-3 space-y-3">
                {chatMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Sparkles size={24} className="text-zinc-700 mb-2" />
                    <p className="text-xs text-zinc-600">Ask me anything about your CV</p>
                    <p className="text-[10px] text-zinc-700 mt-1">or use a quick action above</p>
                  </div>
                )}
                {chatMessages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: EASE }}
                    className={cn("max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed",
                      msg.role === "user" ? "ml-auto bg-indigo-600 text-white" : "bg-zinc-900 text-zinc-300 border border-zinc-800")}>
                    {msg.text}
                  </motion.div>
                ))}
                {chatLoading && (
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Loader2 size={12} className="animate-spin" />
                    Thinking...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-zinc-800/80 p-3 bg-zinc-900/30">
                <div className="flex gap-2">
                  <input className={cn(inputClass, "flex-1 text-xs py-2.5")} placeholder="Ask the AI assistant..."
                    value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat(chatInput)} />
                  <button onClick={() => sendChat(chatInput)} disabled={!chatInput.trim()}
                    className={cn("rounded-lg p-2.5 transition-colors", chatInput.trim() ? "bg-indigo-600 text-white hover:bg-indigo-500" : "bg-zinc-800 text-zinc-600")}>
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAssistantOpen(!assistantOpen)}
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors",
            assistantOpen
              ? "bg-zinc-800 text-zinc-300 shadow-black/30"
              : "bg-indigo-600 text-white shadow-indigo-600/30 hover:bg-indigo-500"
          )}
        >
          {!assistantOpen && (
            <span className="absolute inset-0 rounded-full animate-ping bg-indigo-500/20" />
          )}
          {assistantOpen ? <X size={22} /> : <Sparkles size={22} />}
        </motion.button>
      </div>
    </div>
  );
}
