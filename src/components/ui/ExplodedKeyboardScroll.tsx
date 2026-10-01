"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Keyboard from "./keyboard";
import type { KeyboardTheme } from "@/lib/themes";
import { 
  Layers, Cpu, Sparkles, RotateCcw, ArrowDown, 
  Volume2, ShieldCheck, Zap
} from "lucide-react";

interface ExplodedKeyboardScrollProps {
  theme: KeyboardTheme;
  colorZones: boolean;
  testedKeys: Set<string>;
  onTestedKeysChange: (tested: Set<string>) => void;
  onOpenThemeSidebar: () => void;
}

export function ExplodedKeyboardScroll({
  theme,
  colorZones,
  testedKeys,
  onTestedKeysChange,
  onOpenThemeSidebar,
}: ExplodedKeyboardScrollProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    restDelta: 0.001,
  });

  const [progressVal, setProgressVal] = useState(0);

  useEffect(() => {
    return smoothProgress.on("change", (latest) => {
      setProgressVal(latest);
    });
  }, [smoothProgress]);

  // Transform curves:
  // Phase 1: Rapid centering & initial tilt (0.00 -> 0.08)
  const keyboardY = useTransform(smoothProgress, [0, 0.08, 0.60, 0.94, 1], [80, 0, 0, 0, 0]);
  const keyboardScale = useTransform(smoothProgress, [0, 0.08, 0.35, 0.58, 0.94, 1], [0.94, 1, 1.02, 1, 1, 1]);
  const keyboardRotateX = useTransform(smoothProgress, [0, 0.08, 0.35, 0.55, 0.62, 1], [24, 18, 22, 12, 0, 0]);
  const keyboardRotateZ = useTransform(smoothProgress, [0, 0.08, 0.35, 0.55, 0.62, 1], [-4, -2, 2, -1, 0, 0]);

  // Phase 2: 3D Exploded Layer Separation (0.08 -> 0.42 separates, 0.42 -> 0.58 converges)
  const keycapsOffset = useTransform(smoothProgress, [0.08, 0.25, 0.42, 0.58], [0, -115, -115, 0]);
  const switchesOffset = useTransform(smoothProgress, [0.08, 0.25, 0.42, 0.58], [0, -58, -58, 0]);
  const plateOffset = useTransform(smoothProgress, [0.08, 0.25, 0.42, 0.58], [0, 0, 0, 0]);
  const pcbOffset = useTransform(smoothProgress, [0.08, 0.25, 0.42, 0.58], [0, 58, 58, 0]);
  const chassisOffset = useTransform(smoothProgress, [0.08, 0.25, 0.42, 0.58], [0, 115, 115, 0]);

  // Annotation Callout Opacity
  const annotationsOpacity = useTransform(smoothProgress, [0.14, 0.22, 0.42, 0.52], [0, 1, 1, 0]);

  // Stage Indicator Pill Opacity (Visible only during exploding/assembling phases, vanishes when assembled)
  const stagePillOpacity = useTransform(smoothProgress, [0, 0.04, 0.50, 0.58], [1, 1, 1, 0]);

  // Phase 3: Snap together into interactive live keyboard (0.54 -> 0.62 transition)
  const assembledOpacity = useTransform(smoothProgress, [0.54, 0.62], [0, 1]);
  const explodedOpacity = useTransform(smoothProgress, [0.54, 0.62], [1, 0]);
  const toolbarOpacity = useTransform(smoothProgress, [0.58, 0.66], [0, 1]);
  const toolbarY = useTransform(smoothProgress, [0.58, 0.66], [15, 0]);

  // Generous working test range: 0.60 all the way to 0.94
  const isFullyAssembled = progressVal >= 0.58;

  // Stage indicator details (Stages 1 to 3 only; disappears in stage 4)
  let stageTitle = "Scroll to explode keyboard layers";
  let stageBadge = "Stage 1 • Exploded View";
  if (progressVal >= 0.10 && progressVal < 0.42) {
    stageTitle = "3D Layer Separation • Keep scrolling";
    stageBadge = "Stage 2 • Exploded Breakdown";
  } else if (progressVal >= 0.42) {
    stageTitle = "Precision Assembly • Convergence";
    stageBadge = "Stage 3 • Assembling";
  }

  const isDark = theme?.isDark || theme?.category === "Dark";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520vh] z-20"
      id="exploded-studio"
    >
      {/* Pinned Sticky Viewport (Screen freezes here while scroll progresses) */}
      <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden px-4 select-none">
        
        {/* Stage Status Pill & Progress Bar (Fades out / vanishes when keyboard is assembled) */}
        <motion.div
          style={{
            opacity: stagePillOpacity,
            pointerEvents: "none",
          }}
          className="absolute top-16 sm:top-20 z-30 flex flex-col items-center gap-1.5"
        >
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-md backdrop-blur-md ${
            isDark ? "bg-slate-900/95 border-slate-700 text-white" : "bg-white/95 border-slate-200 text-slate-800"
          }`}>
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">
              {stageBadge}
            </span>
            <span className={isDark ? "text-slate-600" : "text-slate-300"}>|</span>
            <span className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              {stageTitle}
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className={`w-52 h-1.5 rounded-full overflow-hidden shadow-inner ${
            isDark ? "bg-slate-800" : "bg-slate-200/80"
          }`}>
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-rose-500 to-indigo-600 transition-all duration-75"
              style={{ width: `${Math.min(100, Math.max(0, progressVal * 100))}%` }}
            />
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* TEST BENCH TOOLBAR (Fades in when Assembled)                */}
        {/* ============================================================ */}
        <motion.div
          style={{
            opacity: toolbarOpacity,
            y: toolbarY,
            pointerEvents: isFullyAssembled ? "auto" : "none",
          }}
          className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 pb-2 px-4 mb-2 z-30"
        >
          <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border backdrop-blur-xl shadow-lg transition-all ${
            isDark
              ? "bg-slate-900/90 border-slate-700/80 text-white shadow-black/40"
              : "bg-white/95 border-slate-200/90 text-slate-900 shadow-slate-200/50"
          }`}>
            <span className="flex items-center gap-2 text-xs sm:text-sm font-black tracking-wider uppercase">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              </span>
              <span className={isDark ? "text-white font-extrabold" : "text-slate-900 font-extrabold"}>
                Test your keyboard here
              </span>
            </span>
            <span className={`text-xs font-mono font-black px-3 py-1 rounded-full border shadow-xs ${
              isDark
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                : "bg-emerald-100 text-emerald-800 border-emerald-300"
            }`}>
              {testedKeys.size} / 68 Keys Tested
            </span>
          </div>

          {testedKeys.size > 0 && (
            <button
              onClick={() => onTestedKeysChange(new Set())}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl border text-xs font-bold transition-all shadow-lg hover:scale-105 cursor-pointer ${
                isDark
                  ? "bg-slate-900/90 border-slate-700 text-slate-100 hover:bg-slate-800 hover:text-orange-400 shadow-black/40"
                  : "bg-white/95 border-slate-200 text-slate-700 hover:text-orange-600 hover:bg-slate-50 shadow-slate-200/50"
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
              <span>Reset Key Test ({testedKeys.size})</span>
            </button>
          )}
        </motion.div>

        {/* 3D Perspective Staging Box */}
        <div className="relative w-full max-w-5xl flex items-center justify-center perspective-[1400px] z-20">
          <motion.div
            style={{
              y: keyboardY,
              scale: keyboardScale,
              rotateX: keyboardRotateX,
              rotateZ: keyboardRotateZ,
              transformStyle: "preserve-3d",
            }}
            className="relative w-full flex items-center justify-center transition-transform duration-75"
          >
            {/* ======================================================== */}
            {/* 1. ASSEMBLED FUNCTIONAL KEYBOARD                         */}
            {/* ======================================================== */}
            <motion.div
              style={{
                opacity: assembledOpacity,
                pointerEvents: isFullyAssembled ? "auto" : "none",
              }}
              className="w-full flex items-center justify-center"
            >
              <Keyboard
                className="mx-auto"
                theme={theme}
                colorZones={colorZones}
                testedKeys={testedKeys}
                onTestedKeysChange={onTestedKeysChange}
                onOpenThemeSidebar={onOpenThemeSidebar}
              />
            </motion.div>

            {/* ======================================================== */}
            {/* 2. 3D EXPLODED LAYERS (Centered in Viewport)             */}
            {/* ======================================================== */}
            <motion.div
              style={{
                opacity: explodedOpacity,
                pointerEvents: "none",
              }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="relative w-full max-w-4xl h-[280px] flex items-center justify-center">
                {/* ---------------- LAYER 1: PBT KEYCAPS ---------------- */}
                <motion.div
                  style={{ y: keycapsOffset }}
                  className="absolute inset-x-4 top-0 h-[210px] rounded-[22px] bg-white/85 border-2 border-orange-400 shadow-[0_18px_36px_rgba(249,115,22,0.22)] backdrop-blur-md flex flex-col p-3.5 z-50 transition-all"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-orange-200 text-xs font-bold text-orange-600">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" /> Layer 1: Sculpted Double-Shot PBT Keycaps
                    </span>
                    <span className="text-[10px] font-mono bg-orange-100 px-2 py-0.5 rounded text-orange-700">
                      1.5mm Dense Polymer
                    </span>
                  </div>
                  <div className="flex-1 grid grid-cols-12 gap-1.5 pt-2.5 opacity-85">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-7 rounded-lg bg-gradient-to-b from-white to-slate-100 border border-slate-300 shadow-xs flex items-center justify-center text-[9px] font-mono font-bold text-slate-700"
                      >
                        {i === 0 ? "ESC" : i === 47 ? "RET" : ""}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* ---------------- LAYER 2: TACTILE SWITCHES ------------ */}
                <motion.div
                  style={{ y: switchesOffset }}
                  className="absolute inset-x-6 top-3 h-[200px] rounded-[20px] bg-gradient-to-b from-rose-50/95 to-pink-50/95 border-2 border-rose-400 shadow-[0_14px_28px_rgba(244,63,94,0.22)] backdrop-blur-md flex flex-col p-3.5 z-40 transition-all"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-rose-200 text-xs font-bold text-rose-600">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider">
                      <Volume2 className="w-3.5 h-3.5" /> Layer 2: 55g Progressive Tactile Switches
                    </span>
                    <span className="text-[10px] font-mono bg-rose-100 px-2 py-0.5 rounded text-rose-700">
                      POM Stems • Gold Springs
                    </span>
                  </div>
                  <div className="flex-1 grid grid-cols-12 gap-1.5 pt-2.5 opacity-90">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-7 rounded-lg bg-rose-500 border border-rose-600 shadow-inner flex items-center justify-center"
                      >
                        <div className="w-2.5 h-2.5 bg-white/90 rounded-xs" />
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* ---------------- LAYER 3: ALUMINUM PLATE ------------- */}
                <motion.div
                  style={{ y: plateOffset }}
                  className="absolute inset-x-8 top-6 h-[190px] rounded-[18px] bg-gradient-to-b from-slate-200 to-slate-300 border-2 border-slate-400 shadow-[0_10px_20px_rgba(15,23,42,0.18)] flex flex-col p-3.5 z-30 transition-all"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-300 text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" /> Layer 3: Anodized Switch Plate & Silicone Dampener
                    </span>
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      Gasket Mount Isolation
                    </span>
                  </div>
                  <div className="flex-1 bg-slate-400/20 rounded-lg border border-slate-400/40 mt-1.5 flex items-center justify-center">
                    <span className="text-[11px] font-mono font-bold text-slate-600">
                      Acoustic Isolation Plate
                    </span>
                  </div>
                </motion.div>

                {/* ---------------- LAYER 4: HOT-SWAP PCB --------------- */}
                <motion.div
                  style={{ y: pcbOffset }}
                  className="absolute inset-x-10 top-9 h-[180px] rounded-[16px] bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-400 shadow-[0_14px_30px_rgba(6,182,212,0.28)] flex flex-col p-3.5 z-20 transition-all"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-cyan-900 text-xs font-bold text-cyan-400">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider">
                      <Cpu className="w-3.5 h-3.5" /> Layer 4: Hot-Swap PCB & RGB Matrix Controller
                    </span>
                    <span className="text-[10px] font-mono bg-cyan-950 px-2 py-0.5 rounded text-cyan-300 border border-cyan-800">
                      1000Hz Polling
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-around mt-1 p-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                      >
                        <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* ---------------- LAYER 5: CNC CHASSIS BASE ----------- */}
                <motion.div
                  style={{ y: chassisOffset }}
                  className="absolute inset-x-4 top-12 h-[220px] rounded-[24px] bg-gradient-to-b from-slate-100 to-slate-300 border-2 border-indigo-400 shadow-[0_24px_50px_rgba(79,70,229,0.22)] flex flex-col p-4 z-10 transition-all"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-300 text-xs font-bold text-indigo-700">
                    <span className="flex items-center gap-1.5 uppercase tracking-wider">
                      <Layers className="w-3.5 h-3.5" /> Layer 5: CNC Aluminum Chassis & Brass Weight
                    </span>
                    <span className="text-[10px] font-mono bg-indigo-100 px-2 py-0.5 rounded text-indigo-800">
                      Heavy Brass Base
                    </span>
                  </div>
                  <div className="flex-1 flex items-center justify-center mt-2">
                    <div className="w-44 h-7 rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 shadow-inner border border-amber-600/40 flex items-center justify-center font-mono text-[9px] font-black text-amber-950 tracking-wider">
                      BRASS ACOUSTIC WEIGHT
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* 3D FLOATING CALLOUT LABELS */}
            <motion.div
              style={{ opacity: annotationsOpacity }}
              className="absolute -right-4 sm:-right-8 top-1/4 flex flex-col gap-2.5 pointer-events-none z-50 hidden md:flex"
            >
              <div className={`px-3 py-1.5 rounded-xl border shadow-lg backdrop-blur-md flex items-center gap-2 text-xs font-bold ${
                isDark ? "bg-slate-900/95 border-orange-500/40 text-white" : "bg-white/95 border-orange-200 text-slate-800"
              }`}>
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span>PBT Keycap Tops</span>
              </div>
              <div className={`px-3 py-1.5 rounded-xl border shadow-lg backdrop-blur-md flex items-center gap-2 text-xs font-bold ${
                isDark ? "bg-slate-900/95 border-rose-500/40 text-white" : "bg-white/95 border-rose-200 text-slate-800"
              }`}>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>55g Tactile Stems</span>
              </div>
              <div className={`px-3 py-1.5 rounded-xl border shadow-lg backdrop-blur-md flex items-center gap-2 text-xs font-bold ${
                isDark ? "bg-slate-900/95 border-cyan-500/40 text-white" : "bg-white/95 border-cyan-200 text-slate-800"
              }`}>
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span>Hot-Swap RGB PCB</span>
              </div>
              <div className={`px-3 py-1.5 rounded-xl border shadow-lg backdrop-blur-md flex items-center gap-2 text-xs font-bold ${
                isDark ? "bg-slate-900/95 border-indigo-500/40 text-white" : "bg-white/95 border-indigo-200 text-slate-800"
              }`}>
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Solid Base Chassis</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Progress Helper */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`absolute bottom-5 flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border shadow-lg backdrop-blur-md pointer-events-none ${
            isDark ? "bg-slate-900/95 border-slate-700 text-slate-200" : "bg-white/95 border-slate-200 text-slate-700"
          }`}
        >
          {!isFullyAssembled ? (
            <>
              <span className={isDark ? "text-slate-300" : "text-slate-600"}>Scroll down to explore 3D exploded view</span>
              <ArrowDown className="w-3.5 h-3.5 text-orange-500 animate-bounce" />
            </>
          ) : (
            <>
              <span className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Assembly complete!
              </span>
              <span className={isDark ? "text-slate-400" : "text-slate-500"}>Test keys above or scroll down to continue</span>
              <ArrowDown className={`w-3.5 h-3.5 animate-bounce ${isDark ? "text-slate-400" : "text-slate-500"}`} />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
