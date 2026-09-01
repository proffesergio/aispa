"use client";

import React, { useState } from "react";
import { Sparkles, X, Send, Bot, User, Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import { Language, translations, formatPrice } from "@/lib/i18n/dict";

interface AIConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  currentLang: Language;
}

export function AIConciergeModal({
  isOpen,
  onClose,
  preselectedService,
  currentLang
}: AIConciergeModalProps) {
  const t = translations[currentLang];
  const [messages, setMessages] = useState<
    Array<{ sender: "ai" | "user"; text: string; action?: string }>
  >([
    {
      sender: "ai",
      text: currentLang === "bn"
        ? "আসসালামু আলাইকুম! আমি আইস্পা এআই অ্যাসিস্ট্যান্ট। আজ আপনার ত্বক ও সৌন্দর্যের জন্য কোন সার্ভিস পছন্দ করতে চান?"
        : "Hello! I am your AiSpa Assistant. What personal care or beauty service can I assist you with today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [bookingStep, setBookingStep] = useState<"chat" | "confirm" | "success">("chat");

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputValue("");

    // Simulate AI Concierge Logic
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: currentLang === "bn"
            ? `চমৎকার পছন্দ! আপনার অনুমানের ওপর ভিত্তি করে আমরা ${userText}-এর জন্য একটি স্লট বুকিং করতে পারি।`
            : `Great choice! Based on your request, we recommend locking in a slot for ${userText}.`,
          action: "book_now",
        },
      ]);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      
      <div className="glass-panel-accent w-full max-w-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>{t.aiConciergeBtn}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-semibold">
                  Online
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                {currentLang === "bn" ? "তাৎক্ষণিক এআই পরামর্শ ও স্লট বুকিং" : "Instant AI Recommendation & Scheduling"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 scrollbar-thin">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-pink-300" />
                </div>
              )}

              <div className={`space-y-2 max-w-[80%] ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                      : "glass-panel text-slate-200 border border-white/10"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.action && (
                  <button
                    onClick={() => setBookingStep("confirm")}
                    className="glass-button-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-500/20"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{currentLang === "bn" ? "প্রিফারেড স্লট কনফার্ম করুন" : "Confirm Slot Booking"}</span>
                  </button>
                )}
              </div>

              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {bookingStep === "confirm" && (
            <div className="p-4 rounded-2xl glass-card border border-purple-500/40 space-y-3 animate-in fade-in">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {currentLang === "bn" ? "বুকিং নিশ্চিতকরণ" : "Slot Reservation Details"}
              </h4>
              <div className="text-xs text-slate-300 space-y-1">
                <p>• <strong>Service:</strong> {preselectedService || t.svc1Title}</p>
                <p>• <strong>Price:</strong> <span className="text-emerald-400 font-bold">{formatPrice(85, currentLang)}</span></p>
                <p>• <strong>Location:</strong> {t.loc1Name}</p>
              </div>
              <button
                onClick={() => setBookingStep("success")}
                className="w-full glass-button-primary py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                {currentLang === "bn" ? "নিশ্চিত করুন এবং পেমেন্ট করুন →" : "Confirm Reservation →"}
              </button>
            </div>
          )}

          {bookingStep === "success" && (
            <div className="p-5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-center space-y-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-white">
                {currentLang === "bn" ? "স্লট সফলভাবে সংরক্ষিত হয়েছে!" : "Slot Successfully Reserved!"}
              </p>
              <p className="text-xs text-emerald-300">
                {currentLang === "bn" ? "আপনার নিবন্ধিত মোবাইলে এসএমএস পাঠানো হয়েছে।" : "Confirmation SMS sent to your mobile."}
              </p>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-white/10 bg-white/5 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={currentLang === "bn" ? "আপনার প্রশ্ন লিখুন..." : "Ask AI Concierge anything..."}
            className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs sm:text-sm min-h-[44px]"
          />
          <button
            type="submit"
            className="glass-button-primary px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center min-h-[44px]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
