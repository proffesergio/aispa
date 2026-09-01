"use client";

import React, { useState } from "react";
import { Sparkles, Clock, Calendar, ArrowUpRight, Zap } from "lucide-react";
import { Language, translations, formatPrice } from "@/lib/i18n/dict";

interface ServiceCategoriesProps {
  onBookService?: (serviceName: string) => void;
  currentLang: Language;
}

export function ServiceCategories({
  onBookService,
  currentLang
}: ServiceCategoriesProps) {
  const [activeTab, setActiveTab] = useState("all");
  const t = translations[currentLang];

  const categories = [
    { id: "all", label: t.catAll },
    { id: "hair", label: t.catHair },
    { id: "facial", label: t.catFacial },
    { id: "nails", label: t.catNails },
    { id: "massage", label: t.catMassage },
  ];

  const services = [
    {
      id: "1",
      category: "facial",
      title: t.svc1Title,
      description: t.svc1Desc,
      usdPrice: 85,
      duration: `45 ${t.mins}`,
      image: "/images/facial.png",
      aiMatch: "99%",
    },
    {
      id: "2",
      category: "hair",
      title: t.svc2Title,
      description: t.svc2Desc,
      usdPrice: 65,
      duration: `60 ${t.mins}`,
      image: "/images/stylist.png",
      aiMatch: "96%",
    },
    {
      id: "3",
      category: "nails",
      title: t.svc3Title,
      description: t.svc3Desc,
      usdPrice: 45,
      duration: `40 ${t.mins}`,
      image: "/images/hero.png",
      aiMatch: "94%",
    },
    {
      id: "4",
      category: "massage",
      title: t.svc4Title,
      description: t.svc4Desc,
      usdPrice: 95,
      duration: `75 ${t.mins}`,
      image: "/images/facial.png",
      aiMatch: "97%",
    },
    {
      id: "5",
      category: "hair",
      title: t.svc5Title,
      description: t.svc5Desc,
      usdPrice: 120,
      duration: `90 ${t.mins}`,
      image: "/images/stylist.png",
      aiMatch: "95%",
    },
    {
      id: "6",
      category: "facial",
      title: t.svc6Title,
      description: t.svc6Desc,
      usdPrice: 150,
      duration: `60 ${t.mins}`,
      image: "/images/hero.png",
      aiMatch: "98%",
    },
  ];

  const filteredServices = activeTab === "all"
    ? services
    : services.filter((s) => s.category === activeTab);

  return (
    <section id="services" className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>{t.servicesBadge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.servicesTitle}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            {t.servicesSubtitle}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap min-h-[42px] ${
                activeTab === cat.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/25 scale-105"
                  : "glass-panel text-slate-300 hover:text-white hover:border-purple-400/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Mobile Horizontal Snap Carousel & Desktop Grid Layout */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory pb-6 md:pb-0 scrollbar-none">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="snap-center shrink-0 w-[85vw] sm:w-[320px] md:w-auto glass-card rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/40 transition-all duration-300 hover:scale-[1.02] group flex flex-col justify-between"
            >
              {/* Image Header */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b061a] via-transparent to-transparent opacity-80"></div>

                {/* AI Match Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full glass-panel border border-emerald-400/30 text-emerald-300 text-[10px] font-extrabold flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-emerald-400" />
                  <span>{service.aiMatch} AI Fit</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-300" />
                      {service.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Footer Price & Booking CTA */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Price
                    </span>
                    <span className="text-lg font-extrabold text-emerald-400">
                      {formatPrice(service.usdPrice, currentLang)}
                    </span>
                  </div>

                  <button
                    onClick={() => onBookService?.(service.title)}
                    className="glass-button-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md shadow-purple-500/20 min-h-[40px]"
                  >
                    <span>{t.instantBook}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
