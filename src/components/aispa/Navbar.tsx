"use client";

import React, { useState } from "react";
import { Sparkles, Calendar, Clock, User, Compass, Menu, X, Zap } from "lucide-react";
import { Language, translations } from "@/lib/i18n/dict";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavbarProps {
  onOpenBooking?: () => void;
  onOpenAIConcierge?: () => void;
  onOpenAuth?: () => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export function Navbar({
  onOpenBooking,
  onOpenAIConcierge,
  onOpenAuth,
  currentLang,
  onLanguageChange
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const t = translations[currentLang];

  return (
    <>
      {/* ================= DESKTOP STICKY TOP NAVBAR ================= */}
      <header className="sticky top-0 z-40 w-full glass-nav-top backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white animate-pulse-subtle" />
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-40 blur group-hover:opacity-75 transition duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-1">
                {t.appName.slice(0, 2)}<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{t.appName.slice(2)}</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-purple-300/70 font-semibold -mt-1">
                {t.tagline}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 glass-panel px-4 py-1.5 rounded-full border border-white/10">
            <a
              href="#services"
              className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              Treatments
            </a>
            <a
              href="#ai-recommendations"
              className="px-3.5 py-2 text-sm font-medium text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-full transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              AI Match
            </a>
            <a
              href="#live-slots"
              className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-full transition-all flex items-center gap-1.5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Next Available
            </a>
            <a
              href="#testimonials"
              className="px-3.5 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              Reviews
            </a>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher
              currentLang={currentLang}
              onLanguageChange={onLanguageChange}
            />

            {/* Sign In Button */}
            <button
              onClick={onOpenAuth}
              className="glass-button-secondary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 min-h-[44px]"
            >
              <User className="w-4 h-4 text-purple-300" />
              <span>🇧🇩 {currentLang === "bn" ? "সাইন ইন" : "Sign In"}</span>
            </button>

            {/* Book Now Button */}
            <button
              onClick={onOpenBooking}
              className="glass-button-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/25 min-h-[44px]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Now</span>
            </button>
          </div>

          {/* Mobile Top Hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenAIConcierge}
              className="p-2.5 rounded-xl glass-panel text-purple-300 min-h-[48px] min-w-[48px] flex items-center justify-center"
              aria-label="AI Assistant"
            >
              <Sparkles className="w-5 h-5 text-pink-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl glass-panel text-white min-h-[48px] min-w-[48px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Top) */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-card border-t border-white/10 px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 text-base font-medium text-slate-100 hover:bg-white/10 rounded-xl"
            >
              Treatments & Services
            </a>
            <a
              href="#ai-recommendations"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-3 px-4 text-base font-medium text-purple-300 hover:bg-purple-500/20 rounded-xl"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              AI Style & Treatment Match
            </a>
            <a
              href="#live-slots"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-3 px-4 text-base font-medium text-emerald-300 hover:bg-emerald-500/20 rounded-xl"
            >
              <Clock className="w-4 h-4 text-emerald-400" />
              Next Available Slots
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 px-4 text-base font-medium text-slate-100 hover:bg-white/10 rounded-xl"
            >
              Client Reviews
            </a>
            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking?.();
                }}
                className="w-full glass-button-primary py-3 rounded-xl text-base font-semibold min-h-[48px] flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ================= MOBILE BOTTOM FLOATING NAVIGATION BAR ================= */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <nav className="glass-nav-bottom rounded-3xl p-2.5 flex items-center justify-around max-w-md mx-auto shadow-2xl border border-white/20">
          
          {/* Home */}
          <a
            href="#"
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center justify-center min-h-[48px] min-w-[56px] rounded-2xl px-2 py-1 transition-all ${
              activeTab === "home"
                ? "text-white bg-white/15 border border-white/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">Explore</span>
          </a>

          {/* AI Match */}
          <a
            href="#ai-recommendations"
            onClick={() => setActiveTab("ai")}
            className={`flex flex-col items-center justify-center min-h-[48px] min-w-[56px] rounded-2xl px-2 py-1 transition-all ${
              activeTab === "ai"
                ? "text-purple-300 bg-purple-500/25 border border-purple-400/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-5 h-5 text-pink-400" />
            <span className="text-[10px] font-medium mt-0.5">AI Match</span>
          </a>

          {/* Center Main Trigger (Book Now Floating Action) */}
          <button
            onClick={() => {
              setActiveTab("book");
              onOpenBooking?.();
            }}
            className="flex items-center justify-center min-h-[52px] min-w-[52px] rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/50 border border-white/30 -mt-5 hover:scale-105 active:scale-95 transition-transform"
            aria-label="Quick Book Appointment"
          >
            <Calendar className="w-6 h-6" />
          </button>

          {/* Slots */}
          <a
            href="#live-slots"
            onClick={() => setActiveTab("slots")}
            className={`flex flex-col items-center justify-center min-h-[48px] min-w-[56px] rounded-2xl px-2 py-1 transition-all relative ${
              activeTab === "slots"
                ? "text-emerald-300 bg-emerald-500/20 border border-emerald-400/40"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-medium mt-0.5">Slots</span>
            <span className="absolute top-1 right-2 h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          </a>

          {/* Profile / AI Concierge */}
          <button
            onClick={() => {
              setActiveTab("concierge");
              onOpenAIConcierge?.();
            }}
            className={`flex flex-col items-center justify-center min-h-[48px] min-w-[56px] rounded-2xl px-2 py-1 transition-all ${
              activeTab === "concierge"
                ? "text-white bg-white/15 border border-white/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-0.5">Assistant</span>
          </button>
        </nav>
      </div>
    </>
  );
}
