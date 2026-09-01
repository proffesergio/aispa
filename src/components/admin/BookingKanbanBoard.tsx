"use client";

import React, { useState } from "react";
import { Kanban, CheckCircle2, Clock, Calendar, MessageSquare, AlertCircle, RefreshCw, ChevronRight, User, Phone } from "lucide-react";
import { formatBDT } from "@/lib/i18n/dict";

export type BookingStatusType = "PENDING" | "CONFIRMED" | "RESCHEDULED" | "COMPLETED";

export interface BookingCardItem {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceTitle: string;
  bdtAmount: number;
  appointmentTime: string;
  status: BookingStatusType;
  channel: "WEBSITE" | "WHATSAPP" | "MESSENGER";
  notes?: string;
}

export function BookingKanbanBoard() {
  const [bookings, setBookings] = useState<BookingCardItem[]>([
    {
      id: "bk-101",
      customerName: "Dr. Farhana Ahmed",
      customerPhone: "+8801712345678",
      serviceTitle: "Hydro-O2 Oxygen Facial",
      bdtAmount: 10200,
      appointmentTime: "03:00 PM Today",
      status: "PENDING",
      channel: "WHATSAPP",
      notes: "First-time client requested Hydro-O2 skin moisture treatment.",
    },
    {
      id: "bk-102",
      customerName: "Anika Rahman",
      customerPhone: "+8801811223344",
      serviceTitle: "Japanese Gel Couture Nails",
      bdtAmount: 5400,
      appointmentTime: "04:30 PM Today",
      status: "PENDING",
      channel: "WEBSITE",
    },
    {
      id: "bk-103",
      customerName: "Nusrat Jahan",
      customerPhone: "+8801999887766",
      serviceTitle: "Precision Cut & Botanical Gloss",
      bdtAmount: 7800,
      appointmentTime: "11:00 AM Tomorrow",
      status: "CONFIRMED",
      channel: "WEBSITE",
    },
    {
      id: "bk-104",
      customerName: "Tanzim Huda",
      customerPhone: "+8801555443322",
      serviceTitle: "Hot Stone Aromatherapy Massage",
      bdtAmount: 11400,
      appointmentTime: "05:00 PM Tomorrow",
      status: "RESCHEDULED",
      channel: "MESSENGER",
      notes: "Rescheduled from 2:00 PM due to traffic.",
    },
    {
      id: "bk-105",
      customerName: "Sharmin Sultana",
      customerPhone: "+8801677889900",
      serviceTitle: "24K Gold Luxury Skin Detox",
      bdtAmount: 18000,
      appointmentTime: "10:00 AM Yesterday",
      status: "COMPLETED",
      channel: "WEBSITE",
    },
  ]);

  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const columns: Array<{ id: BookingStatusType; title: string; color: string }> = [
    { id: "PENDING", title: "Pending Approval", color: "border-amber-400/40 text-amber-300" },
    { id: "CONFIRMED", title: "Confirmed", color: "border-emerald-400/40 text-emerald-300" },
    { id: "RESCHEDULED", title: "Rescheduled", color: "border-purple-400/40 text-purple-300" },
    { id: "COMPLETED", title: "Completed", color: "border-blue-400/40 text-blue-300" },
  ];

  const handleApproveBooking = (id: string) => {
    const updated = bookings.map((b) => {
      if (b.id === id) {
        // Trigger simulated WhatsApp dispatch
        setNotificationToast(`✓ WhatsApp Template Confirmation sent to ${b.customerPhone} for ${b.serviceTitle}!`);
        setTimeout(() => setNotificationToast(null), 4000);
        return { ...b, status: "CONFIRMED" as BookingStatusType };
      }
      return b;
    });
    setBookings(updated);
  };

  const handleSuggestAltSlot = (id: string) => {
    const updated = bookings.map((b) => {
      if (b.id === id) {
        setNotificationToast(`Alternative slot invitation sent to ${b.customerPhone} via ${b.channel}`);
        setTimeout(() => setNotificationToast(null), 4000);
        return { ...b, status: "RESCHEDULED" as BookingStatusType };
      }
      return b;
    });
    setBookings(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Kanban className="w-6 h-6 text-purple-400" />
            <span>Booking Request Status Manager (Kanban)</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Approve incoming requests, trigger automated WhatsApp confirmation templates, or suggest alternative slot times.
          </p>
        </div>
      </div>

      {/* Notification Toast Alert */}
      {notificationToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-xs text-emerald-300 font-bold flex items-center gap-2 shadow-lg animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Kanban Grid Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => {
          const colBookings = bookings.filter((b) => b.status === col.id);
          return (
            <div
              key={col.id}
              className="glass-panel p-4 rounded-3xl border border-white/10 flex flex-col justify-between min-h-[500px]"
            >
              
              <div className="space-y-4">
                {/* Column Header */}
                <div className={`p-3 rounded-2xl glass-card border flex items-center justify-between ${col.color}`}>
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    {col.title}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-mono font-bold">
                    {colBookings.length}
                  </span>
                </div>

                {/* Booking Cards in Column */}
                <div className="space-y-3">
                  {colBookings.map((card) => (
                    <div
                      key={card.id}
                      className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 hover:border-purple-400/40 transition-all shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-white flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-purple-300" />
                            <span>{card.customerName}</span>
                          </h4>
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {card.customerPhone}
                          </p>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-400/30">
                          {card.channel}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl glass-panel text-xs space-y-1">
                        <p className="font-bold text-white">{card.serviceTitle}</p>
                        <p className="text-[11px] text-slate-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          <span>{card.appointmentTime}</span>
                        </p>
                        <p className="text-xs font-extrabold text-emerald-400 font-mono">
                          {formatBDT(card.bdtAmount, "bn")}
                        </p>
                      </div>

                      {card.notes && (
                        <p className="text-[11px] text-slate-400 italic">
                          "{card.notes}"
                        </p>
                      )}

                      {/* Action CTAs for Pending Requests */}
                      {card.status === "PENDING" && (
                        <div className="pt-2 space-y-2 border-t border-white/10">
                          <button
                            onClick={() => handleApproveBooking(card.id)}
                            className="w-full glass-button-primary py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 min-h-[36px]"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & WhatsApp</span>
                          </button>

                          <button
                            onClick={() => handleSuggestAltSlot(card.id)}
                            className="w-full glass-button-secondary py-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 min-h-[36px]"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-purple-300" />
                            <span>Suggest Alt Slot</span>
                          </button>
                        </div>
                      )}

                    </div>
                  ))}
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
