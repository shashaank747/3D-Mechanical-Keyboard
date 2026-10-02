"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { KeyboardTheme } from "@/lib/themes";
import { soundEngine } from "@/lib/sound";
import {
  Volume2,
  Zap,
  Sparkles,
  Layers,
  Cpu,
  Radio,
  Gauge,
  Sliders,
  Flame,
  ShieldCheck,
  Palette,
  Activity,
  Check,
  ArrowRight,
  Disc,
} from "lucide-react";

interface SwitchShowcaseProps {
  theme?: KeyboardTheme;
}

const SWITCH_SOUND_PROFILES = [
  {
    id: "thock",
    name: "Deep Thock",
    type: "Linear 45g",
    stem: "Lubed POM Stem",
    pitch: "Deep Bass 180Hz",
    soundKey: "KeyF",
    accent: "from-orange-500 to-amber-500",
    badge: "Most Popular",
  },
  {
    id: "clack",
    name: "Crisp Click",
    type: "Clicky 50g",
    stem: "Click-Bar Box White",
    pitch: "Crisp High 2.4kHz",
    soundKey: "Space",
    accent: "from-cyan-400 to-blue-500",
    badge: "Tactile Audio",
  },
  {
    id: "tactile",
    name: "Holy Panda Pop",
    type: "Tactile 62g",
    stem: "Dual-Stage Tactile Bump",
    pitch: "Mid-Frequency Pop",
    soundKey: "KeyJ",
    accent: "from-purple-500 to-indigo-500",
    badge: "Snappy Rebound",
  },
  {
    id: "silent",
    name: "Muted Studio",
    type: "Silent Linear 35g",
    stem: "TPE Silicone Dampened",
    pitch: "Quiet Sub-30dB",
    soundKey: "Enter",
    accent: "from-emerald-400 to-teal-500",
    badge: "Ultra-Quiet",
  },
];

const RGB_PRESETS = [
  { id: "cyber", name: "Cyberpunk Neon", colors: ["#f97316", "#ef4444", "#8b5cf6", "#06b6d4"] },
  { id: "sunset", name: "Solar Flare", colors: ["#ea580c", "#f59e0b", "#fbbf24", "#dc2626"] },
  { id: "emerald", name: "Matrix Bio", colors: ["#10b981", "#059669", "#34d399", "#065f46"] },
  { id: "aurora", name: "Aurora Borealis", colors: ["#8b5cf6", "#ec4899", "#3b82f6", "#06b6d4"] },
];

export function SwitchShowcase({ theme }: SwitchShowcaseProps) {
  const isDark = theme?.isDark || theme?.category === "Dark";
  const [selectedProfile, setSelectedProfile] = useState(SWITCH_SOUND_PROFILES[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeRgbPreset, setActiveRgbPreset] = useState(RGB_PRESETS[0]);
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);

  const handleTestSound = (keyToPlay?: string) => {
    setIsPlayingAudio(true);
    soundEngine.playKeySound(keyToPlay || selectedProfile.soundKey);
    setTimeout(() => setIsPlayingAudio(false), 400);
  };

  return (
    <section id="features" className="w-full max-w-6xl my-16 px-4 flex flex-col gap-10 relative z-10">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
            isDark
              ? "bg-orange-500/20 border border-orange-500/40 text-orange-400"
              : "bg-orange-500/10 border border-orange-500/20 text-orange-600"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" /> Hardware Architecture & Acoustic Matrix
        </span>
        <h2 className={`text-3xl sm:text-5xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          Next-Gen Mechanical Engineering
        </h2>
        <p className={`text-sm sm:text-base max-w-2xl font-medium ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          Engineered with real-time Web Audio acoustics, sub-millisecond polling rates, multi-layer gasket acoustics, and adaptive per-key lighting matrices.
        </p>
      </div>

      {/* Bento Grid Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {/* ============================================================ */}
        {/* BENTO CARD 1: Interactive Real-Time Acoustic Synthesizer (2-Cols on Large) */}
        {/* ============================================================ */}
        <div
          className={`lg:col-span-2 p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col justify-between relative overflow-hidden backdrop-blur-xl transition-all ${
            isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white/95 border-slate-200 text-slate-900"
          }`}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full filter blur-3xl pointer-events-none -z-10" />

          <div className="flex flex-col gap-5">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-orange-500/20 text-orange-500 border border-orange-500/30">
                  <Volume2 className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-500 block">
                    Synthesizer Engine
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">Real-Time Switch Soundboard</h3>
                </div>
              </div>

              {/* Sound Test Action Button */}
              <button
                onClick={() => handleTestSound()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs tracking-wider uppercase shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Radio className={`w-3.5 h-3.5 ${isPlayingAudio ? "animate-spin text-amber-200" : ""}`} />
                <span>Test Switch Sound</span>
              </button>
            </div>

            <p className={`text-xs sm:text-sm ${isDark ? "text-slate-300" : "text-slate-600"} leading-relaxed`}>
              Click any mechanical switch profile to preview its synthesized acoustic signature with dynamic Web Audio harmonics.
            </p>

            {/* Switch Profile Selection Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
              {SWITCH_SOUND_PROFILES.map((p) => {
                const isSelected = selectedProfile.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProfile(p);
                      handleTestSound(p.soundKey);
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? isDark
                          ? "bg-slate-800 border-orange-500 shadow-[0_4px_20px_rgba(249,115,22,0.2)] ring-2 ring-orange-500/30 text-white"
                          : "bg-orange-50/50 border-orange-500 shadow-md ring-2 ring-orange-500/20 text-slate-900"
                        : isDark
                        ? "bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-300"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${p.accent} shadow-sm shrink-0`} />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold leading-none">{p.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 font-mono font-semibold">
                            {p.badge}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{p.type} • {p.pitch}</span>
                      </div>
                    </div>

                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? "text-orange-500" : "text-slate-500"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Animated Acoustic Waveform Frequency Bars */}
          <div className={`mt-6 pt-4 border-t flex items-center justify-between gap-4 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono text-slate-400 font-semibold">
                Active Profile: <strong className="text-orange-400">{selectedProfile.name}</strong> ({selectedProfile.stem})
              </span>
            </div>

            {/* Dynamic Waveform Visualizer */}
            <div className="flex items-end gap-1 h-6">
              {[35, 70, 45, 90, 60, 100, 50, 85, 40, 95, 65, 30].map((h, i) => (
                <div
                  key={i}
                  style={{ height: isPlayingAudio ? `${Math.max(20, Math.round(h * Math.random()))}%` : `${h * 0.4}%` }}
                  className={`w-1 rounded-full transition-all duration-100 ${
                    isPlayingAudio ? "bg-orange-400 shadow-[0_0_6px_#f97316]" : isDark ? "bg-slate-700" : "bg-slate-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BENTO CARD 2: 1000Hz Ultra-Low Latency & Debounce Engine     */}
        {/* ============================================================ */}
        <div
          className={`p-6 sm:p-7 rounded-3xl border shadow-xl flex flex-col justify-between backdrop-blur-xl relative overflow-hidden transition-all ${
            isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white/95 border-slate-200 text-slate-900"
          }`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Zap className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                1000Hz Polling
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black tracking-tight">Sub-Millisecond Polling</h3>
              <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Zero-debounce electrical contact matrix delivering instant keystroke registration.
              </p>
            </div>

            {/* Big Latency Metric */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${isDark ? "bg-slate-950/80 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Input Latency</span>
                <span className="text-3xl font-black font-mono text-cyan-400 block">&lt; 0.8ms</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scan Rate</span>
                <span className="text-lg font-black font-mono text-emerald-400 block">1,000 FPS</span>
              </div>
            </div>

            {/* Latency Comparison Graph */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] font-mono font-bold">
                <span className="text-cyan-400">SETU Engine (0.8ms)</span>
                <span className="text-slate-400">Standard USB (8.0ms)</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-200"}`}>
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full w-[94%]" />
              </div>
            </div>
          </div>

          <span className="text-[10px] font-mono text-slate-400 mt-4 block">
            ✓ Full N-Key Rollover (NKRO) & Anti-Ghosting
          </span>
        </div>

        {/* ============================================================ */}
        {/* BENTO CARD 3: Adaptive Per-Key RGB Lighting Matrix           */}
        {/* ============================================================ */}
        <div
          className={`p-6 sm:p-7 rounded-3xl border shadow-xl flex flex-col justify-between backdrop-blur-xl relative overflow-hidden transition-all ${
            isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white/95 border-slate-200 text-slate-900"
          }`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Palette className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                16.8M RGB
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black tracking-tight">Adaptive RGB Matrix</h3>
              <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Individual per-key LED arrays with dynamic finger-zone reactive underglow.
              </p>
            </div>

            {/* Interactive Live Preset Selector */}
            <div className="grid grid-cols-2 gap-2">
              {RGB_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setActiveRgbPreset(preset)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    activeRgbPreset.id === preset.id
                      ? "bg-purple-500/20 border-purple-400 text-purple-300 shadow-xs"
                      : isDark
                      ? "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="truncate">{preset.name}</span>
                  <div className="flex gap-0.5">
                    {preset.colors.slice(0, 2).map((c, idx) => (
                      <div key={idx} style={{ backgroundColor: c }} className="w-2 h-2 rounded-full" />
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Live Visual Illuminated LED Nodes */}
            <div className={`p-3.5 rounded-2xl border flex items-center justify-around gap-1.5 ${isDark ? "bg-slate-950/80 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              {activeRgbPreset.colors.concat(activeRgbPreset.colors).map((color, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 12px ${color}, 0 0 20px ${color}88`,
                  }}
                  className="w-5 h-5 rounded-lg border border-white/40 animate-pulse"
                />
              ))}
            </div>
          </div>

          <span className="text-[10px] font-mono text-slate-400 mt-4 block">
            ✓ 10-Finger Color Zones & Reactive Typing Illumination
          </span>
        </div>

        {/* ============================================================ */}
        {/* BENTO CARD 4: 5-Layer Acoustic Gasket Architecture (2-Cols)  */}
        {/* ============================================================ */}
        <div
          className={`lg:col-span-2 p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col justify-between relative overflow-hidden backdrop-blur-xl transition-all ${
            isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white/95 border-slate-200 text-slate-900"
          }`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                    Structural Isolation
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">5-Layer Acoustic Gasket Stack</h3>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                -18 dB Acoustic Damping
              </span>
            </div>

            <p className={`text-xs sm:text-sm ${isDark ? "text-slate-300" : "text-slate-600"} leading-relaxed`}>
              Multi-tier sandwich mount structure designed to isolate resonance, cushion bottom-out strikes, and produce pure bass acoustics.
            </p>

            {/* Interactive Stacked Sandwich Layers */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mt-2">
              {[
                { layer: "L1", title: "PBT Keycaps", sub: "1.5mm Thick Double-Shot" },
                { layer: "L2", title: "FR4 Plate", sub: "Precision Flex-Cut" },
                { layer: "L3", title: "IXPE Foam", sub: "Switch Acoustic Pad" },
                { layer: "L4", title: "Poron Strip", sub: "Gasket Soft Mount" },
                { layer: "L5", title: "CNC Chassis", sub: "Anodized Aluminum" },
              ].map((layer, idx) => {
                const isActive = activeLayerIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveLayerIndex(idx)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/30 shadow-md"
                        : isDark
                        ? "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold block text-emerald-400">{layer.layer}</span>
                    <strong className="text-xs block mt-0.5">{layer.title}</strong>
                    <span className="text-[9px] opacity-75 block truncate mt-0.5">{layer.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`mt-6 pt-4 border-t flex items-center justify-between text-xs ${isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}>
            <span>Compatible with Cherry MX, Gateron, Kailh, Outemu & Holy Panda stems</span>
            <span className="font-mono text-emerald-400 font-bold">100% Solderless Hot-Swap</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SwitchShowcase;
