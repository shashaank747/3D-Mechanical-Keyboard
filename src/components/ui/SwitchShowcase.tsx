"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import type { KeyboardTheme } from "@/lib/themes";
import { soundEngine } from "@/lib/sound";
import {
  Volume2,
  Gamepad2,
  Palette,
  ShieldCheck,
  Code2,
  Sparkles,
  Zap,
  Flame,
  Layers,
  ArrowRight,
  Database,
  Lock,
  Headphones,
  CheckCircle2,
  Terminal,
  Play
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
  const [activeSoundSwitch, setActiveSoundSwitch] = useState<string>("Tactile Brown");
  const [soundFeedback, setSoundFeedback] = useState<string | null>(null);

  const switchSounds = [
    { name: "Linear Red", feel: "Smooth & Silent", key: "A", color: "bg-red-500", border: "border-red-500/40 text-red-400" },
    { name: "Tactile Brown", feel: "Satisfying Bump", key: "B", color: "bg-amber-600", border: "border-amber-500/40 text-amber-400" },
    { name: "Clicky Blue", feel: "Crisp Clack", key: "C", color: "bg-cyan-500", border: "border-cyan-500/40 text-cyan-400" },
    { name: "Cream Yellow", feel: "Deep Thock", key: "D", color: "bg-yellow-400", border: "border-yellow-500/40 text-yellow-400" },
  ];

  const handleTestSound = (item: typeof switchSounds[0]) => {
    setActiveSoundSwitch(item.name);
    soundEngine.playKeySound(item.key);
    setSoundFeedback(`Played ${item.name} (${item.feel})`);
    setTimeout(() => setSoundFeedback(null), 1500);
  };

  return (
    <section id="features" className="w-full max-w-6xl my-16 px-4 flex flex-col gap-10 relative z-10">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Core Platform Superpowers</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
          Engineered for <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 bg-clip-text text-transparent">Peak Typing Mastery</span>
        </h2>
        <p className={`text-sm sm:text-base max-w-2xl ${isDark ? "text-slate-400" : "text-slate-600"}`}>
          From dynamic acoustic synthesis to 7 interactive developer arcade games and real-time cloud analytics.
        </p>
      </div>

      {/* 4 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* CARD 1: Mechanical Keyboard Sound FX */}
        <motion.div
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          className={`rounded-3xl border p-6 flex flex-col justify-between backdrop-blur-xl shadow-lg transition-all ${
            isDark
              ? "bg-slate-900/80 border-slate-800 hover:border-orange-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
              : "bg-white/90 border-slate-200/90 hover:border-orange-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          }`}
        >
          <div className="flex flex-col gap-4">
            {/* Top Badge & Icon */}
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20">
                <Volume2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-500 border border-orange-500/30">
                Acoustic FX
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black tracking-tight mb-1.5">
                Mechanical Audio Engine
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Real-time procedural Web Audio synthesis with spatial stereo feedback and natural pitch variations.
              </p>
            </div>

            {/* Interactive Switch Sound Testers */}
            <div className="flex flex-col gap-1.5 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Click to test sound:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {switchSounds.map((sw) => (
                  <button
                    key={sw.name}
                    onClick={() => handleTestSound(sw)}
                    className={`px-2.5 py-2 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer text-left ${
                      activeSoundSwitch === sw.name
                        ? isDark
                          ? "bg-slate-800 border-orange-500 text-orange-400 shadow-xs"
                          : "bg-orange-50 border-orange-400 text-orange-600 shadow-xs"
                        : isDark
                        ? "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${sw.color} shrink-0`} />
                    <span className="truncate">{sw.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">
              {soundFeedback || "Tactile & linear profiles"}
            </span>
            <Headphones className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          </div>
        </motion.div>

        {/* CARD 2: 7 Interactive Games & Arcade */}
        <motion.div
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          className={`rounded-3xl border p-6 flex flex-col justify-between backdrop-blur-xl shadow-lg transition-all ${
            isDark
              ? "bg-slate-900/80 border-slate-800 hover:border-amber-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
              : "bg-white/90 border-slate-200/90 hover:border-amber-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          }`}
        >
          <div className="flex flex-col gap-4">
            {/* Top Badge & Icon */}
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 text-white shadow-md shadow-amber-500/20">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
                7 Arcade Games
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black tracking-tight mb-1.5">
                Coding & Speed Arcade
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Master developer muscle memory through 7 gamified challenges and live coding syntax.
              </p>
            </div>

            {/* Games Preview Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { name: "Code Sprint", tag: "Python/Rust", color: "text-emerald-400" },
                { name: "Meteor Defense", tag: "Shooter", color: "text-red-400" },
                { name: "Speed Arena", tag: "WPM Test", color: "text-orange-400" },
                { name: "Shortcuts Dojo", tag: "Hotkeys", color: "text-cyan-400" },
              ].map((g) => (
                <div
                  key={g.name}
                  className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 ${
                    isDark ? "bg-slate-950/80 border-slate-800 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  <span className={g.color}>•</span>
                  <span>{g.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onNavigateToArcade}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-xs uppercase tracking-wider shadow-md hover:scale-102 transition-all cursor-pointer"
            >
              <span>Enter Arcade</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* CARD 3: 20+ Bespoke Keycap Themes & Palettes */}
        <motion.div
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          className={`rounded-3xl border p-6 flex flex-col justify-between backdrop-blur-xl shadow-lg transition-all ${
            isDark
              ? "bg-slate-900/80 border-slate-800 hover:border-violet-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
              : "bg-white/90 border-slate-200/90 hover:border-violet-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          }`}
        >
          <div className="flex flex-col gap-4">
            {/* Top Badge & Icon */}
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-md shadow-violet-500/20">
                <Palette className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30">
                20+ Palettes
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black tracking-tight mb-1.5">
                Bespoke Keycap Themes
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Personalize your 3D mechanical keyboard in real-time with curated designer colorways and keycap styles.
              </p>
            </div>

            {/* Color Swatch Dot Previews */}
            <div className="flex items-center gap-2 pt-2">
              {[
                { bg: "bg-orange-500 ring-orange-400/40", name: "Sunset" },
                { bg: "bg-cyan-500 ring-cyan-400/40", name: "Cyberpunk" },
                { bg: "bg-emerald-500 ring-emerald-400/40", name: "Matcha" },
                { bg: "bg-violet-500 ring-violet-400/40", name: "Neon" },
                { bg: "bg-pink-500 ring-pink-400/40", name: "Pastel" },
                { bg: "bg-slate-800 ring-slate-600/40", name: "Stealth" },
              ].map((c, i) => (
                <div
                  key={i}
                  title={c.name}
                  className={`w-5 h-5 rounded-full ${c.bg} ring-2 hover:scale-125 transition-transform cursor-pointer shadow-xs`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={onOpenThemes}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-violet-500/40 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>Explore Themes</span>
              <Palette className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* CARD 4: Supabase Cloud Sync & Real-Time Security */}
        <motion.div
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          className={`rounded-3xl border p-6 flex flex-col justify-between backdrop-blur-xl shadow-lg transition-all ${
            isDark
              ? "bg-slate-900/80 border-slate-800 hover:border-emerald-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
              : "bg-white/90 border-slate-200/90 hover:border-emerald-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
          }`}
        >
          <div className="flex flex-col gap-4">
            {/* Top Badge & Icon */}
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Cloud Live
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black tracking-tight mb-1.5">
                Cloud Analytics & Sync
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Real-time student progress, WPM records, and multi-device persistence powered by PostgreSQL.
              </p>
            </div>

            {/* Feature Checkpoints */}
            <div className="flex flex-col gap-1.5 pt-1 text-[11px]">
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">PBKDF2-SHA512 Salted Security</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Instant High-Score Leaderboards</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Real-time Student Activity Sync</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Cloud Connected</span>
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default SwitchShowcase;
