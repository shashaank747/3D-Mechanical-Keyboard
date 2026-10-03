"use client";

import React from "react";
import { motion } from "framer-motion";
import type { KeyboardTheme } from "@/lib/themes";
import {
  Gamepad2,
  Palette,
  ShieldCheck,
  Code2,
  Sparkles,
  Layers,
  ArrowRight,
  Database,
  Headphones,
  CheckCircle2,
  Terminal,
  Zap,
  Flame,
  Music,
  Activity,
  Award
} from "lucide-react";

interface SwitchShowcaseProps {
  theme?: KeyboardTheme;
  onNavigateToArcade?: () => void;
  onOpenThemes?: () => void;
}

export function SwitchShowcase({
  theme,
  onNavigateToArcade,
  onOpenThemes,
}: SwitchShowcaseProps) {
  const isDark = theme?.isDark || theme?.category === "Dark";

  const allGames = [
    { name: "Code Sprint", tag: "Python, TS, Rust", icon: Terminal, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { name: "Meteor Defense", tag: "Arcade Blaster", icon: Flame, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
    { name: "Speed Arena", tag: "Live WPM & Accuracy", icon: Zap, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { name: "Shortcuts Dojo", tag: "OS & Dev Hotkeys", icon: Award, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
    { name: "Typing Academy", tag: "16 Step Lessons", icon: Sparkles, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
    { name: "Blind Typing", tag: "Blackout Memory", icon: Activity, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
    { name: "Sound Matrix", tag: "Audio-Visual Beats", icon: Music, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  ];

  return (
    <section id="features" className="w-full max-w-6xl my-16 px-4 flex flex-col gap-8 relative z-10">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Platform Features & Highlights</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
          Everything Built for <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 bg-clip-text text-transparent">Typing Excellence</span>
        </h2>
        <p className={`text-sm sm:text-base max-w-2xl ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          Explore 7 developer typing games, 20+ keycap palettes, 3D mechanical physics, and real-time cloud analytics.
        </p>
      </div>

      {/* Asymmetrical Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* ============================================================ */}
        {/* 🌟 HERO BENTO CARD: 7 Coding & Arcade Games (Col-span 8)      */}
        {/* ============================================================ */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className={`md:col-span-8 rounded-3xl border p-6 sm:p-8 flex flex-col justify-between backdrop-blur-xl shadow-xl transition-all relative overflow-hidden ${
            isDark
              ? "bg-slate-900/85 border-slate-800 hover:border-orange-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
              : "bg-white/90 border-slate-200/90 hover:border-orange-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
          }`}
        >
          {/* Subtle Ambient Background Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-orange-500/15 to-amber-500/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col gap-5 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-orange-500 block">
                    Complete Arcade & Syntax Hub
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                    7 Interactive Developer Games
                  </h3>
                </div>
              </div>
              <span className="hidden sm:inline-flex text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-orange-500/15 text-orange-500 border border-orange-500/30">
                16+ Levels
              </span>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Level up muscle memory with real programming syntax, live WPM leaderboards, and arcade reflex shooters:
            </p>

            {/* 7 Games Interactive Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {allGames.map((g) => {
                const IconComponent = g.icon;
                return (
                  <div
                    key={g.name}
                    className={`p-2.5 rounded-2xl border flex flex-col gap-1 transition-all ${
                      isDark ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <IconComponent className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-xs font-extrabold truncate">{g.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 truncate">{g.tag}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
            <span className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Unlocked upon login with real-time score saving
            </span>
            <button
              onClick={onNavigateToArcade}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Launch Arcade Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* 🎨 BENTO CARD: 20+ Bespoke Keycap Themes (Col-span 4)         */}
        {/* ============================================================ */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className={`md:col-span-4 rounded-3xl border p-6 flex flex-col justify-between backdrop-blur-xl shadow-xl transition-all relative overflow-hidden ${
            isDark
              ? "bg-slate-900/85 border-slate-800 hover:border-violet-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
              : "bg-white/90 border-slate-200/90 hover:border-violet-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
          }`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/20">
                <Palette className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30">
                20+ Palettes
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black tracking-tight mb-1">
                Theme Studio
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Instant 1-click preview of curated 3D keycap palettes with custom modifier color zoning.
              </p>
            </div>

            {/* Color Swatches Grid */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                { bg: "bg-orange-500", name: "Sunset Glow" },
                { bg: "bg-cyan-500", name: "Cyberpunk" },
                { bg: "bg-emerald-500", name: "Matcha" },
                { bg: "bg-violet-500", name: "Neon Violet" },
                { bg: "bg-pink-500", name: "Cotton Candy" },
                { bg: "bg-amber-400", name: "Obsidian Gold" },
                { bg: "bg-slate-800", name: "Stealth Dark" },
              ].map((c, i) => (
                <div
                  key={i}
                  title={c.name}
                  className={`w-6 h-6 rounded-full ${c.bg} ring-2 ring-white/20 hover:scale-125 transition-transform cursor-pointer shadow-xs`}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onOpenThemes}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>Open Theme Palette</span>
              <Palette className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* ⌨️ BENTO CARD: 3D Keyboard Workbench (Col-span 4)            */}
        {/* ============================================================ */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className={`md:col-span-4 rounded-3xl border p-6 flex flex-col justify-between backdrop-blur-xl shadow-xl transition-all ${
            isDark
              ? "bg-slate-900/85 border-slate-800 hover:border-cyan-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
              : "bg-white/90 border-slate-200/90 hover:border-cyan-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
          }`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                Interactive 3D
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black tracking-tight mb-1">
                Exploded 3D Assembly
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Scroll-driven mechanical disassembly, 68-key compact ANSI layout, tactile keypress physics, and live hotkey tracker HUD.
              </p>
            </div>

            <div className={`p-2.5 rounded-2xl border text-[11px] font-mono flex items-center justify-between ${
              isDark ? "bg-slate-950/70 border-slate-800 text-cyan-400" : "bg-slate-100 border-slate-200 text-cyan-600"
            }`}>
              <span>68-Key Compact ANSI</span>
              <span>100% Responsive</span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Live Keystroke Lighting</span>
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* ☁️ BENTO CARD: Cloud Progress & Security (Col-span 4)         */}
        {/* ============================================================ */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className={`md:col-span-4 rounded-3xl border p-6 flex flex-col justify-between backdrop-blur-xl shadow-xl transition-all ${
            isDark
              ? "bg-slate-900/85 border-slate-800 hover:border-emerald-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
              : "bg-white/90 border-slate-200/90 hover:border-emerald-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
          }`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Cloud Live
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black tracking-tight mb-1">
                Live Cloud Sync
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Real-time high scores, WPM tracking, and streak progression securely stored with PBKDF2-SHA512 password encryption.
              </p>
            </div>

            <div className="flex flex-col gap-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">PBKDF2-SHA512 Cryptographic Salt</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Multi-Game Progress Retention</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Cloud Connected</span>
            </span>
            <Database className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* 🎧 BENTO CARD: 5-Track Ambient Lo-Fi Soundtrack (Col-span 4)  */}
        {/* ============================================================ */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className={`md:col-span-4 rounded-3xl border p-6 flex flex-col justify-between backdrop-blur-xl shadow-xl transition-all ${
            isDark
              ? "bg-slate-900/85 border-slate-800 hover:border-amber-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
              : "bg-white/90 border-slate-200/90 hover:border-amber-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
          }`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/20">
                <Headphones className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
                5 Lo-Fi Tracks
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black tracking-tight mb-1">
                Ambient Focus Soundtrack
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Relaxing ambient lo-fi tracks in a smart shuffle queue that plays every song before reshuffling.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded-md bg-slate-800/40 border border-slate-700/50">Sunlight</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800/40 border border-slate-700/50">Steaming Mug</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800/40 border border-slate-700/50">Afternoon</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800/40 border border-slate-700/50">Last Keystroke</span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-amber-400 font-bold">
            <span>Zero-Repeat Smart Shuffle</span>
            <Music className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default SwitchShowcase;
