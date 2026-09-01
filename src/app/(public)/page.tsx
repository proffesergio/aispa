"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/aispa/Navbar";
import { HeroSection } from "@/components/aispa/HeroSection";
import { AIRecommendationWidget } from "@/components/aispa/AIRecommendationWidget";
import { ServiceCategories } from "@/components/aispa/ServiceCategories";
import { NextAvailableSlotFinder } from "@/components/aispa/NextAvailableSlotFinder";
import { ClientTestimonials } from "@/components/aispa/ClientTestimonials";
import { Footer } from "@/components/aispa/Footer";
import { AIConciergeModal } from "@/components/aispa/AIConciergeModal";
import { AuthModal } from "@/components/aispa/AuthModal";
import { Language } from "@/lib/i18n/dict";

export default function Homepage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [currentLang, setCurrentLang] = useState<Language>("en");
  const [user, setUser] = useState<{ phone?: string; name?: string; provider: string } | null>(null);

  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) {
      setSelectedService(serviceName);
    } else {
      setSelectedService("");
    }
    setModalOpen(true);
  };

  const handleOpenAIConcierge = () => {
    setSelectedService("");
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b061a] text-slate-100 selection:bg-pink-500 selection:text-white font-sans relative">
      
      {/* Sticky Navigation */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAIConcierge={handleOpenAIConcierge}
        onOpenAuth={() => setAuthModalOpen(true)}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
      />

      {/* Authenticated User Banner Notification */}
      {user && (
        <div className="bg-gradient-to-r from-purple-900/80 to-pink-900/80 border-b border-white/20 py-2.5 px-4 text-center text-xs font-semibold text-white flex items-center justify-center gap-2">
          <span>✨ {currentLang === "bn" ? "লগইনকৃত ইউজার:" : "Logged in as"} <strong className="text-emerald-300 font-mono">{user.phone || user.name}</strong> ({user.provider})</span>
          <button
            onClick={() => setUser(null)}
            className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors ml-2"
          >
            {currentLang === "bn" ? "সাইন আউট" : "Sign Out"}
          </button>
        </div>
      )}

      {/* Main Content Sections with currentLang prop */}
      <main className="relative z-10 space-y-4 md:space-y-8">
        
        {/* 1. Smart Hero Section */}
        <HeroSection
          currentLang={currentLang}
          onSearchSubmit={(query, category) => {
            handleOpenBooking(query || category);
          }}
          onOpenAIConcierge={handleOpenAIConcierge}
        />

        {/* 2. AI Recommendation Widget */}
        <AIRecommendationWidget
          currentLang={currentLang}
          onSelectTreatment={(title) => handleOpenBooking(title)}
        />

        {/* 3. Services Categories & Catalog */}
        <ServiceCategories
          currentLang={currentLang}
          onBookService={(serviceName) => handleOpenBooking(serviceName)}
        />

        {/* 4. Real-Time "Next Available" Slot Finder */}
        <NextAvailableSlotFinder
          currentLang={currentLang}
          onHoldSlot={(slot) => handleOpenBooking(slot.service)}
        />

        {/* 5. Client Testimonials & Social Proof */}
        <ClientTestimonials currentLang={currentLang} />

      </main>

      {/* 6. Glassmorphic Footer */}
      <Footer currentLang={currentLang} />

      {/* Quick Booking Modal */}
      <AIConciergeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preselectedService={selectedService}
        currentLang={currentLang}
      />

      {/* Bangladeshi Localized Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onSuccessAuth={(authUser) => {
          setUser(authUser);
          setTimeout(() => setAuthModalOpen(false), 1500);
        }}
      />

    </div>
  );
}