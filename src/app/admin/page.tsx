"use client";

import React, { useState } from "react";
import { AdminSidebar, AdminTab } from "@/components/admin/AdminSidebar";
import { PackageEngine } from "@/components/admin/PackageEngine";
import { AvailabilityNoticeManager } from "@/components/admin/AvailabilityNoticeManager";
import { OmniInboxHub } from "@/components/admin/OmniInboxHub";
import { BookingKanbanBoard } from "@/components/admin/BookingKanbanBoard";
import { AdminAuthModal } from "@/components/admin/AdminAuthModal";
import { Sparkles, TrendingUp, Calendar, MessageSquare, Package, ArrowUpRight, ShieldCheck, UserPlus, LogIn } from "lucide-react";
import { formatBDT } from "@/lib/i18n/dict";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [adminAuthOpen, setAdminAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("login");
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(null);

  const handleOpenAuth = (mode: "register" | "login") => {
    setAuthMode(mode);
    setAdminAuthOpen(true);
  };

  const handleLogout = () => {
    setAdminUser(null);
  };

  return (
    <div className="min-h-screen bg-[#0b061a] text-slate-100 font-sans flex flex-col md:flex-row relative overflow-x-hidden">
      
      {/* Dynamic Background Glow Mesh */}
      <div className="glow-orb-purple top-10 left-1/4 opacity-40"></div>
      <div className="glow-orb-pink bottom-10 right-10 opacity-30"></div>

      {/* Navigation Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        adminUser={adminUser}
        onLogout={handleLogout}
      />

      {/* Main Content View Container */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 overflow-y-auto z-10">
        
        {/* ACCESS GATE: Unauthenticated Admin Screen */}
        {!adminUser ? (
          <div className="min-h-[75vh] flex items-center justify-center animate-in fade-in duration-300">
            <div className="glass-panel-accent max-w-2xl w-full p-8 sm:p-10 rounded-3xl border border-white/20 shadow-2xl space-y-8 text-center relative overflow-hidden">
              
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center mx-auto shadow-xl shadow-purple-500/30">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>

              <div className="space-y-3">
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30">
                  Protected Operations Gate
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  AiSpa Salon Admin Authentication Required
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                  Welcome to the AiSpa Operations Control Center. Please sign in with your registered admin account or sign up using your Salon Owner Secret Passkey to manage service packages, shift timelines, and omni-channel customer communications.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-2">
                <button
                  onClick={() => handleOpenAuth("login")}
                  className="glass-button-primary py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[48px] shadow-lg shadow-purple-500/25"
                >
                  <LogIn className="w-4 h-4 text-purple-300" />
                  <span>Sign In to Admin Studio</span>
                </button>

                <button
                  onClick={() => handleOpenAuth("register")}
                  className="glass-button-secondary py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[48px]"
                >
                  <UserPlus className="w-4 h-4 text-pink-400" />
                  <span>Register New Owner Account</span>
                </button>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Passkey default: <code className="text-amber-300 font-mono">AISPA-ADMIN-SECRET-2026</code></span>
                <a href="/" className="hover:text-white underline font-medium">← Back to Portal</a>
              </div>

            </div>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD CONTENT */
          <>
            {/* Render Tab 1: Overview Dashboard */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-in fade-in duration-200">
                
                {/* Header Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                      <span>Salon Owner Control Center</span>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        Live Operations
                      </span>
                    </h1>
                    <p className="text-sm text-slate-300 mt-1">
                      Real-time metrics, omni-channel message streams, and automated booking dispatch.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-panel border border-white/10 text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <div>
                        <p className="font-bold text-white">{adminUser.name}</p>
                        <p className="text-[10px] text-purple-300 uppercase font-mono">{adminUser.role}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="glass-button-secondary px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 min-h-[44px]"
                    >
                      <LogIn className="w-4 h-4 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Monthly BDT Revenue</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {formatBDT(485000, "bn")}
                </div>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> +18.4% from last month
                </p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Active Packages</span>
                  <Package className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  12 Bundles
                </div>
                <p className="text-[11px] text-purple-300">
                  Tiered BDT (৳) pricing enabled
                </p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Pending Requests</span>
                  <Calendar className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-amber-400 font-mono">
                  4 Bookings
                </div>
                <p className="text-[11px] text-slate-400">
                  Requires 1-click WhatsApp approval
                </p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Omni-Channel Inbox</span>
                  <MessageSquare className="w-4 h-4 text-pink-400" />
                </div>
                <div className="text-2xl font-extrabold text-pink-400 font-mono">
                  3 Unread
                </div>
                <p className="text-[11px] text-slate-400">
                  WhatsApp & Facebook Messenger
                </p>
              </div>

            </div>

            {/* Quick Actions Shortcuts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-panel-accent p-6 rounded-3xl border border-white/20 shadow-2xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Quick Administrative Shortcuts</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setActiveTab("kanban")}
                    className="p-4 rounded-2xl glass-card border border-white/10 text-left hover:border-purple-400/40 transition-all space-y-1"
                  >
                    <p className="text-xs font-bold text-white">Approve Bookings</p>
                    <p className="text-[11px] text-slate-400">Kanban Board & WhatsApp</p>
                  </button>
                  <button
                    onClick={() => setActiveTab("packages")}
                    className="p-4 rounded-2xl glass-card border border-white/10 text-left hover:border-purple-400/40 transition-all space-y-1"
                  >
                    <p className="text-xs font-bold text-white">Package Builder</p>
                    <p className="text-[11px] text-slate-400">Manage BDT ৳ pricing</p>
                  </button>
                  <button
                    onClick={() => setActiveTab("inbox")}
                    className="p-4 rounded-2xl glass-card border border-white/10 text-left hover:border-purple-400/40 transition-all space-y-1"
                  >
                    <p className="text-xs font-bold text-white">Omni-Channel Inbox</p>
                    <p className="text-[11px] text-slate-400">Reply to WhatsApp/FB</p>
                  </button>
                  <button
                    onClick={() => setActiveTab("availability")}
                    className="p-4 rounded-2xl glass-card border border-white/10 text-left hover:border-purple-400/40 transition-all space-y-1"
                  >
                    <p className="text-xs font-bold text-white">Holiday Announcements</p>
                    <p className="text-[11px] text-slate-400">Emergency Banner sync</p>
                  </button>
                </div>
              </div>

              {/* Status Manager Kanban Preview */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Latest Booking Request</h3>
                  <button
                    onClick={() => setActiveTab("kanban")}
                    className="text-xs text-purple-300 hover:text-white font-semibold"
                  >
                    View Full Kanban Board →
                  </button>
                </div>
                <div className="p-4 rounded-2xl glass-card border border-amber-400/30 space-y-2">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
                    <span>Pending Approval</span>
                    <span>WhatsApp Request</span>
                  </div>
                  <p className="text-sm font-bold text-white">Dr. Farhana Ahmed • Hydro-O2 Oxygen Facial</p>
                  <p className="text-xs text-emerald-400 font-mono font-bold">{formatBDT(10200, "bn")} • 03:00 PM Today</p>
                  <button
                    onClick={() => setActiveTab("kanban")}
                    className="w-full glass-button-primary py-2 rounded-xl text-xs font-bold uppercase"
                  >
                    Review & Confirm →
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Package Engine */}
        {activeTab === "packages" && <PackageEngine />}

        {/* Tab 3: Availability & Notices */}
        {activeTab === "availability" && <AvailabilityNoticeManager />}

        {/* Tab 4: Omni Inbox */}
        {activeTab === "inbox" && <OmniInboxHub />}

        {/* Tab 5: Kanban Booking Manager */}
        {activeTab === "kanban" && <BookingKanbanBoard />}
          </>
        )}

      </main>

      {/* Admin Auth & Registration Modal */}
      <AdminAuthModal
        isOpen={adminAuthOpen}
        initialMode={authMode}
        onClose={() => setAdminAuthOpen(false)}
        onSuccessAdminAuth={(user) => {
          setAdminUser(user);
        }}
      />

    </div>
  );
}
