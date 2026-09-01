"use client";

import React from "react";
import { Sparkles, Sun, Droplets, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Language, translations, formatPrice } from "@/lib/i18n/dict";

interface AIRecommendationWidgetProps {
  onSelectTreatment?: (treatmentTitle: string) => void;
  currentLang: Language;
}

export function AIRecommendationWidget({
  onSelectTreatment,
  currentLang
}: AIRecommendationWidgetProps) {
  const t = translations[currentLang];

  return (
    <section id="ai-recommendations" className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Recommendation Glass Card */}
        <div className="glass-panel-accent rounded-3xl p-6 sm:p-8 md:p-10 border border-white/20 shadow-2xl relative overflow-hidden">
          
          {/* Ambient Glow background */}
          <div className="glow-orb-purple -top-10 -right-10 opacity-40"></div>
          <div className="glow-orb-pink -bottom-10 -left-10 opacity-30"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Weather & Context Data */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Header Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>{t.aiRecBadge}</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {t.aiRecTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {t.aiRecSubtitle}
                </p>
              </div>

              {/* Weather Ambient Card */}
              <div className="p-4 rounded-2xl glass-card border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold text-white">{t.weatherCardTitle}</span>
                  <span className="text-emerald-400 font-mono flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Weather Sync
                  </span>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                    <Sun className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{t.weatherCondition}</span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Droplets className="w-3.5 h-3.5 text-blue-400" />
                      <span>Skin Hydration Index: 42%</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Col: AI Suggested Treatment Card */}
            <div className="lg:col-span-7">
              <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-purple-500/30 shadow-xl space-y-5 relative">
                
                {/* Match Score Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300">
                      <Zap className="w-4 h-4 fill-pink-400 text-pink-400" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider block">
                        {t.weatherRecommendationTitle}
                      </span>
                      <span className="text-[10px] text-pink-300 font-semibold">
                        Custom Skin Protocol
                      </span>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold">
                    {t.aiMatchScore}
                  </div>
                </div>

                {/* Treatment Details */}
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {t.svc1Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {t.weatherRecDesc}
                  </p>
                </div>

                {/* Specs & Pricing */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                      Specialist Price
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-emerald-400">
                        {formatPrice(85, currentLang)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(110, currentLang)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTreatment?.(t.svc1Title)}
                    className="glass-button-primary px-6 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30 min-h-[48px]"
                  >
                    <span>{t.bookTreatmentBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
