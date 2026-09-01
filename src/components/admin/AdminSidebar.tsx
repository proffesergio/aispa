"use client";

import React from "react";
import {
  Package,
  Calendar,
  MessageSquare,
  Kanban,
  Sparkles,
  LayoutDashboard,
  Bell,
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-react";

export type AdminTab = "overview" | "packages" | "availability" | "inbox" | "kanban";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  adminUser?: { name: string; email: string; role: string } | null;
  onLogout?: () => void;
  unreadMessagesCount?: number;
  pendingBookingsCount?: number;
}

export function AdminSidebar({
  activeTab,
  onTabChange,
  adminUser,
  onLogout,
  unreadMessagesCount = 3,
  pendingBookingsCount = 4,
}: AdminSidebarProps) {
  const navItems: Array<{ id: AdminTab; label: string; icon: any; badge?: number }> = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "packages", label: "Package & Pricing Engine", icon: Package },
    { id: "kanban", label: "Booking Requests Kanban", icon: Kanban, badge: pendingBookingsCount },
    { id: "inbox", label: "Omni-Channel Inbox", icon: MessageSquare, badge: unreadMessagesCount },
    { id: "availability", label: "Shift & Emergency Notices", icon: Calendar },
  ];

  return (
    <aside className="w-full md:w-64 glass-panel border-r border-white/10 flex flex-col justify-between shrink-0 p-4 space-y-6">
      
      {/* Brand Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-1">
              Ai<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Spa</span>
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Admin Studio
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full px-3.5 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all min-h-[46px] ${
                  isActive
                    ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/25 scale-[1.02]"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-purple-400"}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? "bg-white text-purple-900" : "bg-pink-500 text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Admin User Profile Card */}
      <div className="p-3.5 rounded-2xl glass-card border border-white/10 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center font-bold text-white text-xs">
            {adminUser ? adminUser.name.slice(0, 2).toUpperCase() : "AD"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">
              {adminUser ? adminUser.name : "Salon Admin"}
            </p>
            <p className="text-[10px] text-purple-300 truncate uppercase font-mono">
              {adminUser ? adminUser.role : "Role Access"}
            </p>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full glass-button-secondary py-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 min-h-[36px]"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out Admin</span>
          </button>
        )}
      </div>

    </aside>
  );
}
