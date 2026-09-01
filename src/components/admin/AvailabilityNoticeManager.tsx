"use client";

import React, { useState } from "react";
import { Calendar, Bell, Clock, AlertTriangle, ShieldCheck, Plus, Trash2, CheckCircle2, Lock, Unlock } from "lucide-react";

export interface StylistShiftItem {
  id: string;
  stylistName: string;
  date: string;
  startTime: string;
  endTime: string;
  isBlocked: boolean;
  overrideReason?: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  message: string;
  priorityLevel: "CRITICAL" | "INFO";
  isGlobalActive: boolean;
  createdAt: string;
}

export function AvailabilityNoticeManager() {
  const [shifts, setShifts] = useState<StylistShiftItem[]>([
    {
      id: "sh-1",
      stylistName: "Tanjina Akter",
      date: "2026-09-02",
      startTime: "09:00 AM",
      endTime: "05:00 PM",
      isBlocked: false,
    },
    {
      id: "sh-2",
      stylistName: "Farhan Kabir",
      date: "2026-09-02",
      startTime: "01:00 PM",
      endTime: "09:00 PM",
      isBlocked: true,
      overrideReason: "Emergency Equipment Calibration",
    },
    {
      id: "sh-3",
      stylistName: "Rehana Yasmin",
      date: "2026-09-02",
      startTime: "10:00 AM",
      endTime: "06:00 PM",
      isBlocked: false,
    },
  ]);

  const [notices, setNotices] = useState<NoticeItem[]>([
    {
      id: "not-1",
      title: "Eid Holiday Special Schedule Alert",
      message: "Our Gulshan Pavilion will close at 6:00 PM on Friday for private VIP consultations.",
      priorityLevel: "CRITICAL",
      isGlobalActive: true,
      createdAt: "2026-09-01",
    },
  ]);

  // Notice Form State
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticePriority, setNoticePriority] = useState<"CRITICAL" | "INFO">("CRITICAL");

  // Shift Form State
  const [newStylist, setNewStylist] = useState("");
  const [newTimeStart, setNewTimeStart] = useState("10:00 AM");
  const [newTimeEnd, setNewTimeEnd] = useState("06:00 PM");

  const handleToggleBlockShift = (id: string) => {
    setShifts(
      shifts.map((s) => (s.id === id ? { ...s, isBlocked: !s.isBlocked } : s))
    );
  };

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStylist) return;

    const newSh: StylistShiftItem = {
      id: `sh-${Date.now()}`,
      stylistName: newStylist,
      date: new Date().toISOString().split("T")[0],
      startTime: newTimeStart,
      endTime: newTimeEnd,
      isBlocked: false,
    };

    setShifts([...shifts, newSh]);
    setNewStylist("");
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeMessage) return;

    const newNot: NoticeItem = {
      id: `not-${Date.now()}`,
      title: noticeTitle,
      message: noticeMessage,
      priorityLevel: noticePriority,
      isGlobalActive: true,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setNotices([newNot, ...notices]);
    setNoticeTitle("");
    setNoticeMessage("");
  };

  const handleToggleNoticeActive = (id: string) => {
    setNotices(
      notices.map((n) => (n.id === id ? { ...n, isGlobalActive: !n.isGlobalActive } : n))
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Calendar className="w-6 h-6 text-purple-400" />
          <span>Dynamic Availability & Operational Notices Hub</span>
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Override stylist shift availability blocks and broadcast global opening/closing announcement banners to the consumer site.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Stylist Shift Availability Override Grid */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel-accent p-6 rounded-3xl border border-white/20 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Master Stylist Shift & Block Overrides</span>
              </h3>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-400/30">
                Live Slot Synchronization
              </span>
            </div>

            {/* Quick Shift Addition Form */}
            <form onSubmit={handleAddShift} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={newStylist}
                onChange={(e) => setNewStylist(e.target.value)}
                placeholder="Stylist Name..."
                className="px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
              />
              <input
                type="text"
                value={newTimeStart}
                onChange={(e) => setNewTimeStart(e.target.value)}
                placeholder="Start Time (09:00 AM)"
                className="px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
              />
              <button
                type="submit"
                className="glass-button-primary py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 min-h-[42px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Shift Slot</span>
              </button>
            </form>

            {/* Shift Roster List */}
            <div className="space-y-3 pt-2">
              {shifts.map((shift) => (
                <div
                  key={shift.id}
                  className={`p-4 rounded-2xl glass-card border transition-all flex items-center justify-between ${
                    shift.isBlocked ? "border-rose-500/40 bg-rose-500/10" : "border-white/10"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{shift.stylistName}</h4>
                      {shift.isBlocked && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-400/30 text-[10px] font-extrabold uppercase">
                          Slot Blocked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">
                      Shift Hours: <strong className="text-purple-300 font-mono">{shift.startTime} - {shift.endTime}</strong> ({shift.date})
                    </p>
                    {shift.overrideReason && (
                      <p className="text-[11px] text-rose-300 italic">
                        Reason: {shift.overrideReason}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleBlockShift(shift.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[38px] ${
                      shift.isBlocked
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30"
                        : "bg-rose-500/20 text-rose-300 border border-rose-400/30 hover:bg-rose-500/30"
                    }`}
                  >
                    {shift.isBlocked ? (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Unblock Slot</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-rose-400" />
                        <span>Block Slot</span>
                      </>
                    )}
                  </button>

                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Right Col: Global Emergency Announcement Banner Widget */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel-accent p-6 rounded-3xl border border-white/20 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-pink-400" />
                <span>Global Emergency Banner Widget</span>
              </h3>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-semibold border border-pink-400/30">
                Consumer Sync
              </span>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Notice Headline
                </label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Special Holiday Hours Announcement"
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Announcement Body Text
                </label>
                <textarea
                  rows={2}
                  required
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  placeholder="Details regarding holiday closures or urgent schedule shifts..."
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Priority Banner Level
                </label>
                <select
                  value={noticePriority}
                  onChange={(e) => setNoticePriority(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs text-white bg-[#0b061a]"
                >
                  <option value="CRITICAL">🔴 Critical Red Alert (Holiday Closure)</option>
                  <option value="INFO">🔵 Informational Blue Banner (New Specialty Arrival)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full glass-button-primary py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px]"
              >
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>Publish Announcement Banner</span>
              </button>
            </form>

            {/* Active Notices List */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Published Banners ({notices.length})
              </h4>

              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="p-4 rounded-2xl glass-card border border-white/10 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${notice.priorityLevel === "CRITICAL" ? "bg-rose-500 animate-ping" : "bg-blue-400"}`}></span>
                      <h5 className="text-xs font-bold text-white">{notice.title}</h5>
                    </div>

                    <button
                      onClick={() => handleToggleNoticeActive(notice.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        notice.isGlobalActive
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {notice.isGlobalActive ? "Broadcasting Live" : "Paused"}
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{notice.message}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
