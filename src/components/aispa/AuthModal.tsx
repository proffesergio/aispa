"use client";

import React, { useState, useRef, useEffect } from "react";
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
  getPhoneFormSchema,
  getOtpFormSchema,
  PhoneFormValues,
  OtpFormValues,
} from "@/lib/validations/auth";
import { Language, translations, formatBDT, toBanglaNumerals } from "@/lib/i18n/dict";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  Sparkles,
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Lock,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onSuccessAuth?: (user: { phone?: string; name?: string; provider: string }) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  currentLang,
  onLanguageChange,
  onSuccessAuth,
}: AuthModalProps) {
  const t = translations[currentLang];

  // Auth Steps: "phone" | "otp" | "success"
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [activePhone, setActivePhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // OTP Countdown State
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Authenticated User State
  const [authUser, setAuthUser] = useState<{ phone?: string; name?: string; provider: string } | null>(null);

  // 1. Phone Form setup with React Hook Form + Zod Resolver (shadcn pattern)
  const phoneFormSchema = getPhoneFormSchema(currentLang);
  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: {
      phone: "",
    },
  });

  // Re-trigger validation if language changes
  useEffect(() => {
    phoneForm.clearErrors();
  }, [currentLang]);

  // 2. OTP Form setup with React Hook Form + Zod Resolver (shadcn pattern)
  const otpFormSchema = getOtpFormSchema(currentLang);
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "otp" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  // Handle Phone Submit -> Request OTP via Backend API
  const onPhoneSubmit = async (values: PhoneFormValues) => {
    setServerError("");
    setLoading(true);

    const cleanNum = values.phone.replace(/\D/g, "");
    const formattedPhone = `+880${cleanNum}`;

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formattedPhone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || t.rateLimitErr);
        setLoading(false);
        return;
      }

      // Transition to OTP Step
      setActivePhone(cleanNum);
      setStep("otp");
      setCountdown(60);
      setCanResend(false);
      otpForm.reset({ otp: "" });

      // Focus first input
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);

    } catch (err) {
      setServerError(t.serverErr);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Submit -> Verify via Backend API
  const onOtpSubmit = async (values: OtpFormValues) => {
    setServerError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+880${activePhone}`, otp: values.otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || t.invalidOtpErr);
        setLoading(false);
        return;
      }

      // Success Authentication
      const userObj = { phone: `+880${activePhone}`, provider: "phone" };
      setAuthUser(userObj);
      setStep("success");
      onSuccessAuth?.(userObj);

    } catch (err) {
      setServerError(t.serverErr);
    } finally {
      setLoading(false);
    }
  };

  // OTP Digit Grid Handler
  const handleOtpDigitChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;

    const currentOtp = otpForm.getValues("otp") || "";
    const otpArray = currentOtp.padEnd(6, " ").split("");
    otpArray[index] = digit.slice(-1);
    const newOtpStr = otpArray.join("").trim();

    otpForm.setValue("otp", newOtpStr, { shouldValidate: true });

    // Focus next digit field
    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // Auto-submit if 6 digits completed
    if (newOtpStr.length === 6 && /^\d{6}$/.test(newOtpStr)) {
      otpForm.handleSubmit(onOtpSubmit)();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentOtp = otpForm.getValues("otp") || "";
    if (e.key === "Backspace" && !currentOtp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData.length === 6) {
      otpForm.setValue("otp", pastedData, { shouldValidate: true });
      otpInputsRef.current[5]?.focus();
      otpForm.handleSubmit(onOtpSubmit)();
    }
  };

  // Social Login Handler
  const handleSocialAuth = (provider: "google" | "facebook") => {
    setLoading(true);
    setTimeout(() => {
      const userObj = {
        name: provider === "google" ? "Tasnim Ahmed" : "Nusrat Jahan",
        provider,
      };
      setAuthUser(userObj);
      setStep("success");
      setLoading(false);
      onSuccessAuth?.(userObj);
    }, 800);
  };

  // Resend OTP Handler
  const handleResendOtp = () => {
    if (!canResend) return;
    setCountdown(60);
    setCanResend(false);
    setServerError("");
    otpForm.reset({ otp: "" });
    fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: `+880${activePhone}` }),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-2xl animate-in fade-in duration-200">
      
      {/* Modal Card Container */}
      <div className="glass-panel-accent w-full max-w-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              {t.appName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher
              currentLang={currentLang}
              onLanguageChange={onLanguageChange}
            />

            <button
              onClick={onClose}
              className="p-2 rounded-xl glass-panel text-slate-300 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* ================= STEP 1: PHONE INPUT (shadcn react-hook-form) ================= */}
          {step === "phone" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-200">
              
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {t.loginTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  {t.loginSubtitle}
                </p>
              </div>

              {/* Server-level Error Alert */}
              {serverError && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* shadcn Form Component Wrapper */}
              <Form {...phoneForm}>
                <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                  
                  <FormField
                    control={phoneForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.phoneLabel}</FormLabel>
                        <FormControl>
                          <div className="relative flex items-center">
                            {/* Native +880 Country Prefix Badge */}
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-purple-950/80 border border-purple-400/40 text-purple-200 font-bold text-sm flex items-center gap-1.5 shadow-inner">
                              <span className="text-xs">🇧🇩</span>
                              <span>+880</span>
                            </div>

                            <input
                              type="tel"
                              inputMode="numeric"
                              placeholder={t.phonePlaceholder}
                              className="w-full pl-[105px] pr-4 py-3.5 rounded-xl glass-input text-base sm:text-lg font-semibold tracking-wide min-h-[52px]"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>{t.phoneHelper}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full glass-button-primary py-4 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[52px] shadow-lg shadow-purple-500/25 group"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>{t.sendingOtp}</span>
                      </>
                    ) : (
                      <>
                        <span>{t.sendOtpBtn}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                </form>
              </Form>

              {/* Social Login Options */}
              <div className="space-y-4 pt-2">
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-white/10 w-full"></div>
                  <span className="bg-[#0b061a] px-3 text-[10px] uppercase font-bold text-slate-400 tracking-widest absolute">
                    {t.orDivider}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialAuth("google")}
                    disabled={loading}
                    className="glass-button-secondary py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.1 9 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z" />
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.1-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
                    </svg>
                    <span>{t.googleAuth}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialAuth("facebook")}
                    disabled={loading}
                    className="glass-button-secondary py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    <svg className="w-4 h-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>{t.facebookAuth}</span>
                  </button>
                </div>
              </div>

              {/* Localized BDT Preview */}
              <div className="pt-2">
                <div className="p-3.5 rounded-2xl glass-card border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-pink-300" />
                    </div>
                    <div>
                      <p className="text-[10px] text-purple-300 uppercase tracking-wider font-bold">
                        {t.bdtPreviewTitle}
                      </p>
                      <p className="text-xs font-bold text-white">
                        {t.sampleServiceTitle}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-emerald-400">
                      {formatBDT(t.sampleServicePrice, currentLang)}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {t.sampleServiceDuration}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= STEP 2: 6-DIGIT OTP GRID (shadcn react-hook-form) ================= */}
          {step === "otp" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-200">
              
              <div>
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-xs text-purple-300 hover:text-white flex items-center gap-1 mb-2"
                >
                  ← {t.changeNumber}
                </button>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {t.otpTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {t.otpSubtitle}{" "}
                  <strong className="text-emerald-400 font-mono">
                    +880 {activePhone}
                  </strong>
                </p>
              </div>

              {serverError && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* shadcn Form for OTP */}
              <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                  
                  <FormField
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.otpLabel}</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-6 gap-2 sm:gap-3">
                            {[0, 1, 2, 3, 4, 5].map((index) => {
                              const digit = field.value?.[index] || "";
                              return (
                                <input
                                  key={index}
                                  ref={(el) => {
                                    otpInputsRef.current[index] = el;
                                  }}
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  maxLength={1}
                                  value={digit}
                                  onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                  onPaste={handleOtpPaste}
                                  className="w-full aspect-square text-center text-xl font-extrabold glass-input rounded-xl border border-white/20 focus:border-purple-400 focus:bg-purple-500/10 transition-all"
                                />
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <button
                    type="submit"
                    disabled={loading || (otpForm.watch("otp") || "").length !== 6}
                    className="w-full glass-button-primary py-4 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[52px] shadow-lg shadow-purple-500/25 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>{t.verifying}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>{t.verifyBtn}</span>
                      </>
                    )}
                  </button>

                </form>
              </Form>

              {/* Resend Countdown */}
              <div className="text-center pt-2">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-xs font-semibold text-purple-300 hover:text-white underline"
                  >
                    {t.resendOtp}
                  </button>
                ) : (
                  <p className="text-xs text-slate-400">
                    {t.resendCountdown}:{" "}
                    <strong className="text-emerald-400 font-mono">
                      {currentLang === "bn" ? toBanglaNumerals(countdown) : countdown}s
                    </strong>
                  </p>
                )}
              </div>

            </div>
          )}

          {/* ================= STEP 3: SUCCESS CONFIRMATION ================= */}
          {step === "success" && (
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-white">
                {t.successLogin}
              </h3>

              <div className="p-4 rounded-2xl glass-card border border-white/10 text-xs max-w-sm mx-auto text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Authentication Method:</span>
                  <span className="font-semibold text-emerald-400 uppercase">
                    {authUser?.provider}
                  </span>
                </div>
                {authUser?.phone && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Phone Number:</span>
                    <span className="font-mono text-white">{authUser.phone}</span>
                  </div>
                )}
                {authUser?.name && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Client Profile:</span>
                    <span className="font-semibold text-white">{authUser.name}</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full glass-button-primary py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider min-h-[48px] max-w-sm"
              >
                Continue Booking Spa Slots →
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
