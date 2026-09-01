"use client";

import React from "react";
import { Globe } from "lucide-react";
import { Language, translations } from "@/lib/i18n/dict";

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
}

export function LanguageSwitcher({
  currentLang,
  onLanguageChange,
  className = ""
}: LanguageSwitcherProps) {
  const t = translations[currentLang];

  const toggleLang = () => {
    const nextLang: Language = currentLang === "en" ? "bn" : "en";
    onLanguageChange(nextLang);
  };

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={`glass-panel px-3 py-1.5 rounded-full border border-white/20 hover:border-purple-400/50 text-xs font-semibold text-white flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md ${className}`}
      title="Toggle Language / ভাষা পরিবর্তন করুন"
    >
      <Globe className="w-3.5 h-3.5 text-purple-300 animate-pulse-subtle" />
      <div className="flex items-center gap-1">
        <span className={currentLang === "en" ? "text-purple-300 font-bold" : "text-slate-400"}>
          EN
        </span>
        <span className="text-slate-500">|</span>
        <span className={currentLang === "bn" ? "text-pink-300 font-bold" : "text-slate-400"}>
          বাংলা
        </span>
      </div>
    </button>
  );
}
