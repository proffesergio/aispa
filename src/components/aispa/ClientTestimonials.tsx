"use client";

import React from "react";
import { Sparkles, Star, Quote, CheckCircle2 } from "lucide-react";
import { Language, translations } from "@/lib/i18n/dict";

interface ClientTestimonialsProps {
  currentLang: Language;
}

export function ClientTestimonials({ currentLang }: ClientTestimonialsProps) {
  const t = translations[currentLang];

  const testimonials = [
    {
      id: "1",
      name: t.rev1Name,
      location: t.rev1Loc,
      text: t.rev1Text,
      rating: 5,
      avatar: "/images/facial.png",
      verified: true,
    },
    {
      id: "2",
      name: t.rev2Name,
      location: t.rev2Loc,
      text: t.rev2Text,
      rating: 5,
      avatar: "/images/stylist.png",
      verified: true,
    },
    {
      id: "3",
      name: t.rev3Name,
      location: t.rev3Loc,
      text: t.rev3Text,
      rating: 5,
      avatar: "/images/hero.png",
      verified: true,
    },
  ];

  return (
    <section id="testimonials" className="py-16 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="glow-orb-purple bottom-0 right-1/4 opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>{t.reviewsBadge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.reviewsTitle}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            {t.reviewsSubtitle}
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-purple-400/40 transition-all duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="w-8 h-8 text-purple-400/20 absolute top-6 right-6 group-hover:text-purple-400/40 transition-colors" />

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  "{item.text}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover border border-purple-400/40"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white">{item.name}</h3>
                    {item.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{item.location}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
