"use client";

import React, { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { Language, translations } from "@/lib/i18n/dict";

interface FooterProps {
  currentLang: Language;
}

export function Footer({ currentLang }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const t = translations[currentLang];

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative pt-16 pb-28 md:pb-16 border-t border-white/10 glass-panel-accent overflow-hidden">
      {/* Background Orbs */}
      <div className="glow-orb-purple -bottom-20 left-1/4 opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1 & 2: Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                {t.appName.slice(0, 2)}<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{t.appName.slice(2)}</span>
              </span>
            </div>

            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              {t.footerDesc}
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
                {t.vipTitle}
              </p>
              {subscribed ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs text-emerald-300 font-semibold">
                  {t.vipSuccess}
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs min-h-[44px]"
                  />
                  <button
                    type="submit"
                    className="glass-button-primary px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 min-h-[44px]"
                  >
                    <span>{t.joinBtn}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">
              {t.navHeader1}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <a href="#services" className="hover:text-purple-300 transition-colors">
                  {t.navTreatments}
                </a>
              </li>
              <li>
                <a href="#ai-recommendations" className="hover:text-purple-300 transition-colors">
                  {t.navAiMatch}
                </a>
              </li>
              <li>
                <a href="#live-slots" className="hover:text-purple-300 transition-colors">
                  {t.navNextAvailable}
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-purple-300 transition-colors">
                  {t.navReviews}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Services */}
          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">
              {t.navHeader2}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>{t.svc1Title}</li>
              <li>{t.svc2Title}</li>
              <li>{t.svc4Title}</li>
              <li>{t.svc3Title}</li>
              <li>{t.svc5Title}</li>
              <li>{t.svc6Title}</li>
            </ul>
          </div>

          {/* Col 5: Active Locations */}
          <div>
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">
              {t.navHeader3}
            </h3>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl glass-panel border border-white/10 space-y-1">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>{t.loc1Name}</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-[11px] text-slate-400">{t.loc1Addr}</p>
                <span className="inline-block text-[10px] text-emerald-400 font-medium">{t.loc1Status}</span>
              </div>

              <div className="p-3 rounded-xl glass-panel border border-white/10 space-y-1">
                <div className="flex items-center justify-between font-bold text-white">
                  <span>{t.loc2Name}</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                </div>
                <p className="text-[11px] text-slate-400">{t.loc2Addr}</p>
                <span className="inline-block text-[10px] text-emerald-400 font-medium">{t.loc2Status}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <span>{t.copyright}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Accessibility (WCAG AA)</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
