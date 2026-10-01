import React, { useState } from "react";
import { motion } from "framer-motion";
import type { KeyboardTheme } from "@/lib/themes";
import { 
  Volume2, ShieldCheck, Zap, Sparkles, Layers, Cpu, Radio, Gauge, ArrowRight
} from "lucide-react";

interface SwitchPart {
  id: string;
  name: string;
  role: string;
  desc: string;
  material: string;
  color: string;
}

const SWITCH_PARTS: SwitchPart[] = [
  {
    id: "keycap",
    name: "Double-shot PBT Keycap",
    role: "Acoustic & Tactile Interface",
    desc: "Sculpted OEM profile engineered from dense 1.5mm PBT with crisp legends and zero finger shine.",
    material: "PBT Polymer (1.5mm Thick)",
    color: "from-orange-500 to-amber-600",
  },
  {
    id: "stem",
    name: "Linear POM Stem & Cross",
    role: "Actuation Stability",
    desc: "Self-lubricating POM cross-stem delivering ultra-smooth travel with zero keycap wobble.",
    material: "DuPont POM Composite",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "spring",
    name: "Gold-Plated Progressive Spring",
    role: "Tactile Force Curve",
    desc: "Custom wound 55g bottom-out progressive coil delivering a snappy rebound and thocky acoustics.",
    material: "24K Gold-Plated Spring Steel",
    color: "from-amber-400 to-yellow-500",
  },
  {
    id: "leaf",
    name: "High-Conductivity Gold Leaf",
    role: "Sub-Millisecond Contact",
    desc: "Precision stamped contact leaf ensuring instantaneous debounce-free electrical closure.",
    material: "Gold Alloy Contact Point",
    color: "from-cyan-400 to-blue-500",
  },
  {
    id: "housing",
    name: "Polycarbonate Upper & Nylon Base",
    role: "Acoustic Chamber",
    desc: "Dual-material housing tuned to dissipate high frequencies and amplify deep bass thock.",
    material: "Polycarbonate & Nylon PA66",
    color: "from-purple-500 to-indigo-600",
  },
];

interface SwitchShowcaseProps {
  theme?: KeyboardTheme;
}

export function SwitchShowcase({ theme }: SwitchShowcaseProps) {
  const [activePart, setActivePart] = useState<SwitchPart>(SWITCH_PARTS[0]);
  const isDark = theme?.isDark || theme?.category === "Dark";

  return (
    <section id="features" className="w-full max-w-5xl my-16 px-4 flex flex-col gap-10 relative z-10">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
          isDark 
            ? "bg-orange-500/20 border border-orange-500/40 text-orange-400" 
            : "bg-orange-500/10 border border-orange-500/20 text-orange-600"
        }`}>
          <Cpu className="w-3.5 h-3.5" /> Mechanical Engineering
        </span>
        <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          Anatomy of Next-Gen Tactility
        </h2>
        <p className={`text-sm sm:text-base max-w-2xl font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          Powered by SETU's real-time Web Audio acoustics, sub-millisecond tactile modeling, and sculpted 3D geometries.
        </p>
      </div>

      {/* Interactive Switch Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Interactive Switch Parts Selector */}
        <div className="lg:col-span-5 flex flex-col gap-2.5">
          {SWITCH_PARTS.map((part) => {
            const isSelected = activePart.id === part.id;
            return (
              <button
                key={part.id}
                onClick={() => setActivePart(part)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? isDark
                      ? "bg-slate-800 border-orange-500 shadow-[0_8px_24px_rgba(249,115,22,0.25)] ring-2 ring-orange-500/40 text-white"
                      : "bg-white border-orange-500 shadow-[0_8px_24px_rgba(249,115,22,0.15)] ring-2 ring-orange-500/20 text-slate-900"
                    : isDark
                      ? "bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-slate-700 text-slate-200"
                      : "bg-white/80 hover:bg-white border-slate-200/90 hover:border-slate-300 text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${part.color} shadow-sm flex-shrink-0`}
                  />
                  <div>
                    <h3 className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>{part.name}</h3>
                    <span className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>{part.role}</span>
                  </div>
                </div>
                <ArrowRight
                  className={`w-4 h-4 transition-transform ${
                    isSelected ? "text-orange-500 translate-x-1" : isDark ? "text-slate-600" : "text-slate-300"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right Detail Card Preview */}
        <div className={`lg:col-span-7 border rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-md ${
          isDark 
            ? "bg-slate-900/95 border-slate-800 text-white" 
            : "bg-white/95 border-slate-200/90 text-slate-900"
        }`}>
          <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full filter blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Component Specification
              </span>
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                isDark 
                  ? "bg-slate-800 text-cyan-300 border-slate-700" 
                  : "bg-slate-100 text-slate-700 border-slate-200"
              }`}>
                {activePart.material}
              </span>
            </div>

            <h3 className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              {activePart.name}
            </h3>

            <p className={`text-sm sm:text-base leading-relaxed font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              {activePart.desc}
            </p>
          </div>

          {/* Quick Specs Micro-Grid */}
          <div className={`grid grid-cols-3 gap-3 mt-8 pt-6 border-t ${isDark ? "border-slate-800" : "border-slate-100"}`}>
            <div className={`flex flex-col p-3 rounded-xl border text-center ${
              isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200/60"
            }`}>
              <span className="text-[10px] uppercase font-bold text-slate-400">Actuation Travel</span>
              <span className={`text-base font-black font-mono mt-0.5 ${isDark ? "text-white" : "text-slate-900"}`}>2.0mm ± 0.4</span>
            </div>
            <div className={`flex flex-col p-3 rounded-xl border text-center ${
              isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200/60"
            }`}>
              <span className="text-[10px] uppercase font-bold text-slate-400">Operating Force</span>
              <span className="text-base font-black font-mono text-orange-500 mt-0.5">45 cN Tactile</span>
            </div>
            <div className={`flex flex-col p-3 rounded-xl border text-center ${
              isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200/60"
            }`}>
              <span className="text-[10px] uppercase font-bold text-slate-400">Lifespan Rating</span>
              <span className="text-base font-black font-mono text-emerald-500 mt-0.5">80M Cycles</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        <div className={`p-6 rounded-3xl border shadow-lg flex flex-col gap-3 hover:-translate-y-1 transition-all backdrop-blur-md ${
          isDark 
            ? "bg-slate-900/90 border-slate-800 text-white shadow-black/30" 
            : "bg-white/95 border-slate-200/90 text-slate-900 shadow-slate-200/50"
        }`}>
          <div className="w-10 h-10 rounded-2xl bg-orange-500/15 text-orange-500 flex items-center justify-center font-bold">
            <Volume2 className="w-5 h-5" />
          </div>
          <h4 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Procedural Synth Audio</h4>
          <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Zero-latency acoustic synthesis reproducing physical bottom-out click curves.
          </p>
        </div>

        <div className={`p-6 rounded-3xl border shadow-lg flex flex-col gap-3 hover:-translate-y-1 transition-all backdrop-blur-md ${
          isDark 
            ? "bg-slate-900/90 border-slate-800 text-white shadow-black/30" 
            : "bg-white/95 border-slate-200/90 text-slate-900 shadow-slate-200/50"
        }`}>
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5" />
          </div>
          <h4 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Adaptive RGB Underglow</h4>
          <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Per-key neon matrix halos active on dark palettes, clean crisp trims on light ones.
          </p>
        </div>

        <div className={`p-6 rounded-3xl border shadow-lg flex flex-col gap-3 hover:-translate-y-1 transition-all backdrop-blur-md ${
          isDark 
            ? "bg-slate-900/90 border-slate-800 text-white shadow-black/30" 
            : "bg-white/95 border-slate-200/90 text-slate-900 shadow-slate-200/50"
        }`}>
          <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>10-Finger Kinematics</h4>
          <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Touch-typing color zones with real-time persistent key holding and release dynamics.
          </p>
        </div>

        <div className={`p-6 rounded-3xl border shadow-lg flex flex-col gap-3 hover:-translate-y-1 transition-all backdrop-blur-md ${
          isDark 
            ? "bg-slate-900/90 border-slate-800 text-white shadow-black/30" 
            : "bg-white/95 border-slate-200/90 text-slate-900 shadow-slate-200/50"
        }`}>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
            <Gauge className="w-5 h-5" />
          </div>
          <h4 className={`text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Speed Typing Arena</h4>
          <p className={`text-xs leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            Real-time WPM, accuracy metrics, automated phrase transitions, and streak confetti.
          </p>
        </div>
      </div>
    </section>
  );
}
