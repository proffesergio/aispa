"use client";

import React, { useState } from "react";
import { Package, Plus, Sparkles, Check, Trash2, Tag, Clock, Layers, ToggleLeft, ToggleRight, DollarSign } from "lucide-react";
import { formatBDT, toBanglaNumerals } from "@/lib/i18n/dict";

export interface PackageItem {
  id: string;
  title: string;
  description: string;
  bdtPrice: number;
  bdtPromoPrice?: number;
  durationMins: number;
  isActive: boolean;
  isPromotional: boolean;
  services: string[];
}

export function PackageEngine() {
  const [packages, setPackages] = useState<PackageItem[]>([
    {
      id: "pkg-1",
      title: "Royal Bride Luxury Glow Spa Bundle",
      description: "Full bridal head-to-toe package: Hydro-O2 facial, Japanese gel nail couture, and Hot Stone Spa massage.",
      bdtPrice: 12500,
      bdtPromoPrice: 9800,
      durationMins: 180,
      isActive: true,
      isPromotional: true,
      services: ["Hydro-O2 Oxygen Facial", "Japanese Gel Nails", "Hot Stone Aromatherapy"],
    },
    {
      id: "pkg-2",
      title: "Weekend Hydration & Hair Gloss Therapy",
      description: "Deep moisture scalp gloss with hydrating botanical facial for instant weekend radiance.",
      bdtPrice: 7500,
      bdtPromoPrice: 6200,
      durationMins: 90,
      isActive: true,
      isPromotional: false,
      services: ["Botanical Hair Gloss", "Hydro-O2 Express Facial"],
    },
  ]);

  // Form Wizard State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bdtPrice, setBdtPrice] = useState<number | "">(6000);
  const [bdtPromoPrice, setBdtPromoPrice] = useState<number | "">(4800);
  const [durationMins, setDurationMins] = useState<number>(60);
  const [isActive, setIsActive] = useState(true);
  const [isPromotional, setIsPromotional] = useState(true);
  const [selectedServices, setSelectedServices] = useState<string[]>(["Hydro-O2 Oxygen Facial"]);
  const [customServiceInput, setCustomServiceInput] = useState("");

  const availableServices = [
    "Hydro-O2 Oxygen Facial",
    "Precision Cut & Botanical Gloss",
    "Japanese Gel Couture Nails",
    "Hot Stone Aromatherapy Massage",
    "Balayage Hair Color Treatment",
    "24K Gold Luxury Skin Detox",
  ];

  const handleToggleService = (svcName: string) => {
    if (selectedServices.includes(svcName)) {
      setSelectedServices(selectedServices.filter((s) => s !== svcName));
    } else {
      setSelectedServices([...selectedServices, svcName]);
    }
  };

  const handleAddCustomService = () => {
    if (customServiceInput.trim()) {
      setSelectedServices([...selectedServices, customServiceInput.trim()]);
      setCustomServiceInput("");
    }
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !bdtPrice) return;

    const newPkg: PackageItem = {
      id: `pkg-${Date.now()}`,
      title,
      description: description || "Comprehensive luxury salon bundle.",
      bdtPrice: Number(bdtPrice),
      bdtPromoPrice: isPromotional && bdtPromoPrice ? Number(bdtPromoPrice) : undefined,
      durationMins,
      isActive,
      isPromotional,
      services: selectedServices.length > 0 ? selectedServices : ["Custom Spa Service"],
    };

    setPackages([newPkg, ...packages]);

    // Reset Form
    setTitle("");
    setDescription("");
    setBdtPrice(6000);
    setBdtPromoPrice(4800);
    setSelectedServices(["Hydro-O2 Oxygen Facial"]);
  };

  const handleDeletePackage = (id: string) => {
    setPackages(packages.filter((p) => p.id !== id));
  };

  const handleToggleActiveStatus = (id: string) => {
    setPackages(
      packages.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-purple-400" />
            <span>Package & Tiered BDT Pricing Engine</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Configure multi-service bundles, seasonal BDT (৳) discounts, and active package visibility.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Package Creation Form Wizard */}
        <div className="lg:col-span-6 glass-panel-accent p-6 rounded-3xl border border-white/20 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Create New Service Package</span>
            </h3>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-400/30">
              BDT ৳ Tier System
            </span>
          </div>

          <form onSubmit={handleCreatePackage} className="space-y-4">
            
            {/* Package Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                Package Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Royal Bridal Glow Bundle"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white font-semibold"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                Description & Inclusions
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what services are included in this bundle..."
                className="w-full px-4 py-3 rounded-xl glass-input text-xs text-white"
              />
            </div>

            {/* Multi-Service Bundle Builder */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                Bundled Services Selection
              </label>

              <div className="flex flex-wrap gap-2 mb-3">
                {availableServices.map((svc) => {
                  const selected = selectedServices.includes(svc);
                  return (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => handleToggleService(svc)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                        selected
                          ? "bg-purple-600/80 text-white border border-purple-400 shadow-sm"
                          : "glass-panel text-slate-300 hover:text-white"
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-emerald-400" />}
                      <span>{svc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pricing Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Regular Price (BDT ৳)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 font-bold text-purple-300 text-sm">৳</span>
                  <input
                    type="number"
                    required
                    min={100}
                    value={bdtPrice}
                    onChange={(e) => setBdtPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl glass-input text-sm font-bold text-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                  Promo Discount Price (BDT ৳)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 font-bold text-pink-400 text-sm">৳</span>
                  <input
                    type="number"
                    disabled={!isPromotional}
                    value={bdtPromoPrice}
                    onChange={(e) => setBdtPromoPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl glass-input text-sm font-bold text-pink-300 disabled:opacity-40"
                  />
                </div>
              </div>
            </div>

            {/* Duration Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Estimated Duration
                </label>
                <span className="text-xs font-mono font-bold text-purple-300">
                  {durationMins} Minutes
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={300}
                step={15}
                value={durationMins}
                onChange={(e) => setDurationMins(Number(e.target.value))}
                className="w-full accent-purple-500 bg-purple-950/60 rounded-lg cursor-pointer"
              />
            </div>

            {/* Toggles */}
            <div className="pt-2 grid grid-cols-2 gap-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsPromotional(!isPromotional)}
                className="flex items-center justify-between p-3 rounded-xl glass-panel text-xs font-semibold text-slate-200"
              >
                <span>Promotional Deal</span>
                {isPromotional ? (
                  <ToggleRight className="w-5 h-5 text-pink-400" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-slate-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className="flex items-center justify-between p-3 rounded-xl glass-panel text-xs font-semibold text-slate-200"
              >
                <span>Active Status</span>
                {isActive ? (
                  <ToggleRight className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-slate-500" />
                )}
              </button>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full glass-button-primary py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[48px] shadow-lg shadow-purple-500/25"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Service Package</span>
            </button>

          </form>
        </div>

        {/* Right Col: Active Packages List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Configured Packages Catalog ({packages.length})</span>
            </h3>
          </div>

          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`glass-card p-5 rounded-2xl border transition-all space-y-4 ${
                  pkg.isActive ? "border-white/10 hover:border-purple-400/40" : "border-rose-500/30 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{pkg.title}</h4>
                      {pkg.isPromotional && (
                        <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-400/30 text-[10px] font-bold uppercase">
                          Promo Deal
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{pkg.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActiveStatus(pkg.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                        pkg.isActive
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {pkg.isActive ? "Active" : "Inactive"}
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Service Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {pkg.services.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-400/20 text-[11px] text-purple-200"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>

                {/* Price & Duration Specs */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-purple-300" />
                    <span className="text-slate-300 font-mono">{pkg.durationMins} Mins</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    {pkg.bdtPromoPrice ? (
                      <>
                        <span className="text-xs text-slate-400 line-through">
                          {formatBDT(pkg.bdtPrice, "bn")}
                        </span>
                        <span className="text-base font-extrabold text-pink-400 font-mono">
                          {formatBDT(pkg.bdtPromoPrice, "bn")}
                        </span>
                      </>
                    ) : (
                      <span className="text-base font-extrabold text-emerald-400 font-mono">
                        {formatBDT(pkg.bdtPrice, "bn")}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
