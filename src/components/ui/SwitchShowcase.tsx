"use client";

import React from "react";
import type { KeyboardTheme } from "@/lib/themes";
import { Lock, Sparkles, Clock } from "lucide-react";

interface SwitchShowcaseProps {
  theme?: KeyboardTheme;
}

export function SwitchShowcase({ theme }: SwitchShowcaseProps) {
  const isDark = theme?.isDark || theme?.category === "Dark";

  return (
    <section id="features" className="w-full max-w-6xl my-16 px-4 flex flex-col gap-8 relative z-10">
      {/* Blank Cards Grid with Available Soon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className={`h-64 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-3.5 p-6 backdrop-blur-xl transition-all ${
              isDark
                ? "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
                : "bg-white/40 border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            {/* Minimal Subtle Icon */}
            <div
              className={`p-3 rounded-2xl border ${
                isDark ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-400"
              }`}
            >
              <Lock className="w-5 h-5 opacity-70" />
            </div>

            {/* Available Soon Pill Badge */}
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold uppercase tracking-wider ${
                isDark
                  ? "bg-slate-900 border-slate-700 text-slate-300 shadow-xs"
                  : "bg-white border-slate-200 text-slate-700 shadow-xs"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>Available Soon</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SwitchShowcase;
