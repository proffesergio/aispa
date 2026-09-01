"use client";

import React, { useState } from "react";
import { MessageSquare, Send, Search, Sparkles, Filter, CheckCircle2, User, Phone } from "lucide-react";

export type ChannelType = "WEBSITE" | "WHATSAPP" | "MESSENGER";

export interface OmniThread {
  id: string;
  senderId: string;
  customerName: string;
  channel: ChannelType;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Array<{
    id: string;
    text: string;
    isFromAdmin: boolean;
    timestamp: string;
  }>;
}

export function OmniInboxHub() {
  const [threads, setThreads] = useState<OmniThread[]>([
    {
      id: "thread-1",
      senderId: "+8801712345678",
      customerName: "Farhana Yasmin",
      channel: "WHATSAPP",
      lastMessage: "Is the Hydro-O2 facial available at Gulshan branch today at 4 PM?",
      timestamp: "10:42 AM",
      unreadCount: 2,
      messages: [
        {
          id: "m-1",
          text: "Hi AiSpa team! Is the Hydro-O2 facial available at Gulshan branch today at 4 PM?",
          isFromAdmin: false,
          timestamp: "10:42 AM",
        },
      ],
    },
    {
      id: "thread-2",
      senderId: "psid_987654321",
      customerName: "Tariqul Islam (FB)",
      channel: "MESSENGER",
      lastMessage: "Can I reschedule my appointment for tomorrow?",
      timestamp: "09:15 AM",
      unreadCount: 1,
      messages: [
        {
          id: "m-2",
          text: "Can I reschedule my appointment for tomorrow?",
          isFromAdmin: false,
          timestamp: "09:15 AM",
        },
      ],
    },
    {
      id: "thread-3",
      senderId: "web_session_4412",
      customerName: "Nusrat Jahan",
      channel: "WEBSITE",
      lastMessage: "What hair color brands do you use for Balayage?",
      timestamp: "Yesterday",
      unreadCount: 0,
      messages: [
        {
          id: "m-3",
          text: "What hair color brands do you use for Balayage?",
          isFromAdmin: false,
          timestamp: "Yesterday 08:30 PM",
        },
        {
          id: "m-4",
          text: "Assalamu Alaikum Nusrat! We exclusively use premium organic Japanese and French ammonia-free colors.",
          isFromAdmin: true,
          timestamp: "Yesterday 08:35 PM",
        },
      ],
    },
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string>("thread-1");
  const [replyInput, setReplyInput] = useState("");
  const [channelFilter, setChannelFilter] = useState<"ALL" | ChannelType>("ALL");

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const filteredThreads = channelFilter === "ALL"
    ? threads
    : threads.filter((t) => t.channel === channelFilter);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !activeThread) return;

    const newMsg = {
      id: `reply-${Date.now()}`,
      text: replyInput.trim(),
      isFromAdmin: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setThreads((prevThreads) =>
      prevThreads.map((t) => {
        if (t.id === activeThread.id) {
          return {
            ...t,
            lastMessage: newMsg.text,
            messages: [...t.messages, newMsg],
            unreadCount: 0,
          };
        }
        return t;
      })
    );

    setReplyInput("");
  };

  const renderChannelBadge = (channel: ChannelType) => {
    switch (channel) {
      case "WHATSAPP":
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold flex items-center gap-1">
            <span>💬 WhatsApp</span>
          </span>
        );
      case "MESSENGER":
        return (
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-extrabold flex items-center gap-1">
            <span>⚡ Facebook</span>
          </span>
        );
      case "WEBSITE":
        return (
          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-extrabold flex items-center gap-1">
            <span>🌐 Web Chat</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-purple-400" />
          <span>Omni-Channel Customer Communication Hub</span>
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Unified Inbox consolidating WhatsApp Business API, Facebook Messenger Graph API, and Website Live Chat streams into a single dashboard interface.
        </p>
      </div>

      {/* Split Pane Interface */}
      <div className="glass-panel-accent rounded-3xl border border-white/20 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        
        {/* Left Pane: Thread List */}
        <div className="lg:col-span-5 border-r border-white/10 flex flex-col bg-white/5">
          
          {/* Channel Filters */}
          <div className="p-4 border-b border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                Conversations ({threads.length})
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(["ALL", "WEBSITE", "WHATSAPP", "MESSENGER"] as const).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setChannelFilter(ch)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap ${
                    channelFilter === ch
                      ? "bg-purple-600 text-white shadow"
                      : "glass-panel text-slate-300 hover:text-white"
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5 scrollbar-thin">
            {filteredThreads.map((thread) => {
              const isActive = thread.id === activeThreadId;
              return (
                <button
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full p-4 text-left transition-all flex items-start justify-between gap-3 ${
                    isActive ? "bg-purple-500/20 border-l-4 border-purple-400" : "hover:bg-white/5"
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">{thread.customerName}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{thread.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-300 truncate leading-tight">
                      {thread.lastMessage}
                    </p>

                    <div className="pt-1 flex items-center gap-2">
                      {renderChannelBadge(thread.channel)}
                      <span className="text-[10px] text-slate-400 font-mono">{thread.senderId}</span>
                    </div>
                  </div>

                  {thread.unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-extrabold shrink-0">
                      {thread.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Pane: Fluid Conversation Window */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-black/20">
          
          {/* Thread Header */}
          {activeThread && (
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center font-bold text-white text-xs">
                  <User className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{activeThread.customerName}</span>
                    {renderChannelBadge(activeThread.channel)}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ID: {activeThread.senderId}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Messages Stream */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1 scrollbar-thin">
            {activeThread?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isFromAdmin ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.isFromAdmin
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                      : "glass-panel text-slate-200 border border-white/10"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1 px-1">
                  {msg.timestamp} {msg.isFromAdmin ? "(Admin Salma)" : ""}
                </span>
              </div>
            ))}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
            <input
              type="text"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              placeholder={`Send reply back to ${activeThread?.customerName} via ${activeThread?.channel}...`}
              className="flex-1 px-4 py-3 rounded-xl glass-input text-xs sm:text-sm min-h-[48px]"
            />
            <button
              type="submit"
              className="glass-button-primary px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 min-h-[48px] shadow-lg shadow-purple-500/25"
            >
              <Send className="w-4 h-4" />
              <span>Reply</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
