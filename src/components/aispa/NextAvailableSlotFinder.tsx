"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Clock, Calendar, ShieldCheck, Zap, UserCheck } from "lucide-react";
import { Language, translations, formatPrice, toBanglaNumerals } from "@/lib/i18n/dict";

interface SlotItem {
  id: string;
  stylistName: string;
  stylistRole: string;
  service: string;
  timeSlot: string;
  usdOriginalPrice: number;
  usdDiscountPrice: number;
  discountPercent: number;
  remainingSeconds: number;
  avatar: string;
}

interface NextAvailableSlotFinderProps {
  onHoldSlot?: (slot: SlotItem) => void;
  currentLang: Language;
}

export function NextAvailableSlotFinder({
  onHoldSlot,
  currentLang
}: NextAvailableSlotFinderProps) {
  const t = translations[currentLang];

  const [slots, setSlots] = useState<SlotItem[]>([
    {
      id: "1",
      stylistName: currentLang === "bn" ? "তানজিনা আক্তার" : "Tanjina Akter",
      stylistRole: currentLang === "bn" ? "সিনিয়র স্কিন স্পেশালিস্ট" : "Senior Skin Specialist",
      service: t.svc1Title,
      timeSlot: "02:30 PM Today",
      usdOriginalPrice: 110,
      usdDiscountPrice: 85,
      discountPercent: 20,
      remainingSeconds: 420, // 7 minutes countdown
      avatar: "/images/facial.png",
    },
    {
      id: "2",
      stylistName: currentLang === "bn" ? "ফারহান কবির" : "Farhan Kabir",
      stylistRole: currentLang === "bn" ? "মাষ্টার হেয়ার কালারিস্ট" : "Master Hair Colorist",
      service: t.svc2Title,
      timeSlot: "03:15 PM Today",
      usdOriginalPrice: 80,
      usdDiscountPrice: 65,
      discountPercent: 15,
      remainingSeconds: 840,
      avatar: "/images/stylist.png",
    },
    {
      id: "3",
      stylistName: currentLang === "bn" ? "রেহানা ইয়াসমিন" : "Rehana Yasmin",
      stylistRole: currentLang === "bn" ? "আ্যরোমাথেরাপিস্ট" : "Aromatherapist Specialist",
      service: t.svc4Title,
      timeSlot: "04:00 PM Today",
      usdOriginalPrice: 120,
      usdDiscountPrice: 95,
      discountPercent: 20,
      remainingSeconds: 1260,
      avatar: "/images/hero.png",
    },
  ]);

  // Live Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSlots((prevSlots) =>
        prevSlots.map((s) => ({
          ...s,
          remainingSeconds: s.remainingSeconds > 0 ? s.remainingSeconds - 1 : 0,
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const str = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return currentLang === "bn" ? toBanglaNumerals(str) : str;
  };

  return (
    <section id="live-slots" className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{t.slotBadge}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.slotTitle}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {t.slotSubtitle}
            </p>
          </div>
        </div>

        {/* Slot Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="glass-card rounded-2xl p-6 border border-white/10 hover:border-emerald-400/40 transition-all duration-300 space-y-5 flex flex-col justify-between"
            >
              {/* Slot Header with Countdown */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={slot.avatar}
                    alt={slot.stylistName}
                    className="w-11 h-11 rounded-full object-cover border border-purple-400/40"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1">
                      <span>{slot.stylistName}</span>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </h3>
                    <p className="text-[11px] text-slate-400">{slot.stylistRole}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Hold Expires
                  </span>
                  <span className="text-sm font-mono font-bold text-pink-400 flex items-center gap-1 justify-end">
                    <Clock className="w-3.5 h-3.5" />
                    {formatCountdown(slot.remainingSeconds)}
                  </span>
                </div>
              </div>

              {/* Service & Time */}
              <div className="p-3.5 rounded-xl glass-panel border border-white/10 space-y-1.5">
                <p className="text-xs font-bold text-purple-300">{slot.service}</p>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>{slot.timeSlot}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                    {slot.discountPercent}% {t.discountBadge}
                  </span>
                </div>
              </div>

              {/* Price & Hold Button */}
              <div className="pt-2 flex items-center justify-between border-t border-white/10">
                <div>
                  <span className="text-xs text-slate-400 line-through block">
                    {formatPrice(slot.usdOriginalPrice, currentLang)}
                  </span>
                  <span className="text-xl font-extrabold text-emerald-400">
                    {formatPrice(slot.usdDiscountPrice, currentLang)}
                  </span>
                </div>

                <button
                  onClick={() => onHoldSlot?.(slot)}
                  className="glass-button-primary px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 min-h-[42px]"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t.holdSlotBtn}</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
