"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  adminRegisterSchema,
  adminLoginSchema,
  AdminRegisterFormValues,
  AdminLoginFormValues,
} from "@/lib/validations/admin-auth";
import { Sparkles, Shield, Key, Mail, Lock, User, Phone, ArrowRight, RefreshCw, AlertCircle, CheckCircle2, X } from "lucide-react";

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessAdminAuth: (user: { name: string; email: string; role: string }) => void;
  initialMode?: "register" | "login";
}

export function AdminAuthModal({
  isOpen,
  onClose,
  onSuccessAdminAuth,
  initialMode = "login",
}: AdminAuthModalProps) {
  const [mode, setMode] = useState<"register" | "login">(initialMode);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  React.useEffect(() => {
    if (isOpen && initialMode) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  // Register Form Setup
  const registerForm = useForm<AdminRegisterFormValues>({
    resolver: zodResolver(adminRegisterSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      adminKey: "AISPA-ADMIN-SECRET-2026", // Default dev secret
      role: "ADMIN",
    },
  });

  // Login Form Setup
  const loginForm = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema) as any,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (!isOpen) return null;

  const onRegisterSubmit = async (values: AdminRegisterFormValues) => {
    setServerError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Failed to register admin account.");
        setLoading(false);
        return;
      }

      onSuccessAdminAuth(data.user);
      onClose();
    } catch (err) {
      setServerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onLoginSubmit = async (values: AdminLoginFormValues) => {
    setServerError("");
    setLoading(true);

    setTimeout(() => {
      onSuccessAdminAuth({
        name: "Salon Manager",
        email: values.email,
        role: "ADMIN",
      });
      setLoading(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl animate-in fade-in duration-200">
      
      <div className="glass-panel-accent w-full max-w-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-md">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              AiSpa Admin Studio Registration
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl glass-card border border-white/10">
            <button
              onClick={() => setMode("register")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                mode === "register" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Register New Owner/Admin
            </button>
            <button
              onClick={() => setMode("login")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                mode === "login" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Admin Sign In
            </button>
          </div>

          {serverError && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Mode 1: Register Form */}
          {mode === "register" && (
            <Form {...(registerForm as any)}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                
                {/* Full Name */}
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <input
                          type="text"
                          placeholder="Salma Ahmed"
                          className="w-full px-4 py-3 rounded-xl glass-input text-xs sm:text-sm text-white font-medium"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Business Email */}
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Email Address</FormLabel>
                      <FormControl>
                        <input
                          type="email"
                          placeholder="salma@aispa-downtown.com"
                          className="w-full px-4 py-3 rounded-xl glass-input text-xs sm:text-sm text-white font-medium"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* BD Mobile Phone */}
                <FormField
                  control={registerForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bangladeshi Mobile Phone</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <div className="absolute left-2 text-xs font-bold px-2.5 py-1 rounded bg-purple-950 text-purple-200">
                            🇧🇩 +880
                          </div>
                          <input
                            type="tel"
                            placeholder="1712-345678"
                            className="w-full pl-[95px] pr-4 py-3 rounded-xl glass-input text-xs sm:text-sm text-white font-semibold"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Admin Passkey */}
                <FormField
                  control={registerForm.control}
                  name="adminKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Secret Passkey</FormLabel>
                      <FormControl>
                        <input
                          type="password"
                          placeholder="AISPA-ADMIN-SECRET-2026"
                          className="w-full px-4 py-3 rounded-xl glass-input text-xs sm:text-sm text-amber-300 font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Secret passkey issued to salon owners (`AISPA-ADMIN-SECRET-2026`).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role & Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={registerForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>System Role</FormLabel>
                        <FormControl>
                          <select
                            className="w-full px-4 py-3 rounded-xl glass-input text-xs text-white bg-[#0b061a]"
                            {...field}
                          >
                            <option value="ADMIN">ADMIN (Full Access)</option>
                            <option value="MANAGER">MANAGER (Ops & Shifts)</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Password</FormLabel>
                        <FormControl>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-xl glass-input text-xs sm:text-sm text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full glass-button-primary py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[50px] shadow-lg shadow-purple-500/25"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Passkey & Creating Admin Account...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>Register Salon Admin Profile</span>
                    </>
                  )}
                </button>

              </form>
            </Form>
          )}

          {/* Mode 2: Login Form */}
          {mode === "login" && (
            <Form {...(loginForm as any)}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Email Address</FormLabel>
                      <FormControl>
                        <input
                          type="email"
                          placeholder="salma@aispa-downtown.com"
                          className="w-full px-4 py-3 rounded-xl glass-input text-xs sm:text-sm text-white font-medium"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full px-4 py-3 rounded-xl glass-input text-xs sm:text-sm text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full glass-button-primary py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[50px] shadow-lg shadow-purple-500/25"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating Admin...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Sign In to Admin Studio</span>
                    </>
                  )}
                </button>

              </form>
            </Form>
          )}

        </div>

      </div>

    </div>
  );
}
