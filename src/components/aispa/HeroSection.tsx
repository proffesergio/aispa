"use client";

import React, { useState } from "react";
import { Search, Sparkles, SlidersHorizontal, Calendar, ArrowRight, Zap } from "lucide-react";
import { Language, translations } from "@/lib/i18n/dict";

interface HeroSectionProps {
  onSearchSubmit?: (searchQuery: string, activeCategory: string) => void;
  onOpenAIConcierge?: () => void;
  currentLang: Language;
}

export function HeroSection({
  onSearchSubmit,
  onOpenAIConcierge,
  currentLang
}: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const t = translations[currentLang];

  const categories = [
    { id: "all", label: t.heroFilterAll },
    { id: "facial", label: t.heroFilterFacial },
    { id: "hair", label: t.heroFilterHair },
    { id: "nails", label: t.heroFilterNails },
    { id: "massage", label: t.heroFilterMassage },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit?.(searchQuery, selectedCategory);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-8 pb-16 overflow-hidden">
      
      {/* Dynamic Ambient Background Mesh Glow Orbs */}
      <div className="glow-orb-purple top-1/4 left-1/2 -translate-x-1/2 opacity-70"></div>
      <div className="glow-orb-pink top-10 right-10 opacity-50"></div>
      <div className="glow-orb-blue bottom-10 left-10 opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Smart Search */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* AI Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-purple-400/30 text-purple-300 text-xs font-semibold tracking-wide shadow-lg shadow-purple-500/10 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping"></span>
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>{t.heroBadge}</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                {t.heroTitleLine1} <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                  {t.heroTitleLine2}
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                {t.heroSubtitle}
              </p>
            </div>

            {/* Interactive Smart Search & AI Matcher Component */}
            <div className="space-y-4 pt-2">
              
              {/* Category Quick Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-center lg:justify-start">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap min-h-[38px] ${
                      selectedCategory === cat.id
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-500/25 scale-105"
                        : "glass-panel text-slate-300 hover:text-white hover:border-purple-400/40"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Glassmorphic Search Form */}
              <form onSubmit={handleSearch} className="glass-panel p-2 sm:p-3 rounded-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto lg:mx-0">
                <div className="relative flex-1 w-full flex items-center">
                  <Search className="w-5 h-5 text-purple-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.heroSearchPlaceholder}
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none min-h-[48px]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onOpenAIConcierge}
                    className="glass-button-secondary px-3 py-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 min-h-[48px] sm:min-w-[120px]"
                    title="Ask AI Concierge for recommendations"
                  >
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span>{t.navAiMatch}</span>
                  </button>

                  <button
                    type="submit"
                    className="glass-button-primary flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 min-h-[48px] shadow-lg shadow-purple-500/30 whitespace-nowrap"
                  >
                    <span>{t.heroSearchBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span>100% {t.heroAiActive}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>Instant Mobile Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Priority VIP Slots</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden glass-panel p-3 border border-white/20 shadow-2xl">
                <img
                  src="/images/hero.png"
                  alt="AiSpa Smart Salon Experience"
                  className="w-full h-[400px] sm:h-[480px] object-cover rounded-2xl"
                />

                {/* Floating AI Glass Card Badge 1 */}
                <div className="absolute top-6 right-6 glass-panel-accent p-3.5 rounded-2xl border border-white/20 shadow-xl max-w-[200px] animate-float">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <span>Skin Moisture AI</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    High Humidity detected in Dhaka. Hydration therapy recommended.
                  </p>
                </div>

                {/* Floating AI Glass Card Badge 2 */}
                <div className="absolute bottom-6 left-6 glass-panel-accent p-3 rounded-2xl border border-white/20 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-white text-xs shadow-md">
                    99%
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">AI Biometric Match</p>
                    <p className="text-[10px] text-emerald-300">Hydro-O2 Oxygen Facial</p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
