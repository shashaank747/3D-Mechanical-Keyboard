"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Keyboard from "@/components/ui/keyboard";
import { ThemeSidebar } from "@/components/ui/ThemeSidebar";
import { MotionBackground } from "@/components/ui/MotionBackground";
import { ParallaxFloatingElements } from "@/components/ui/ParallaxFloatingElements";
import { SwitchShowcase } from "@/components/ui/SwitchShowcase";
import { ExplodedKeyboardScroll } from "@/components/ui/ExplodedKeyboardScroll";
import { KeyboardGame } from "@/components/ui/KeyboardGame";
import { GamesHub } from "@/components/ui/GamesHub";
import { FallingWordsGame } from "@/components/ui/FallingWordsGame";
import { SoundMatrixGame } from "@/components/ui/SoundMatrixGame";
import { BlindTypingGame } from "@/components/ui/BlindTypingGame";
import { KEYBOARD_THEMES, type KeyboardTheme } from "@/lib/themes";
import { 
  Keyboard as KeyboardIcon, Sparkles, 
  Check, RotateCcw, Flame, Palette,
  Play, ArrowLeft, ArrowDown, BookOpen, Layers, Menu,
  Volume2, Gamepad2, ShieldCheck
} from "lucide-react";
import confetti from "canvas-confetti";
import { MusicPlayer } from "@/components/ui/MusicPlayer";
import { bgMusic } from "@/lib/bgMusic";
import { soundEngine } from "@/lib/sound";

export type AppPage = "home" | "start" | "academy" | "speedtest" | "fallingwords" | "soundmatrix" | "blindtyping" | "shortcuts";

export default function KeyboardLandingPage() {
  const [currentPage, setCurrentPage] = useState<AppPage>("home");
  const [currentTheme, setCurrentTheme] = useState<KeyboardTheme>(KEYBOARD_THEMES[0]);
  const [isThemeSidebarOpen, setIsThemeSidebarOpen] = useState(false);
  const [colorZones, setColorZones] = useState<boolean>(true);
  const [testedKeys, setTestedKeys] = useState<Set<string>>(new Set());
  const [lastTriggeredKey, setLastTriggeredKey] = useState<{ key: string; code: string; time: number } | null>(null);
  const [totalKeyHits, setTotalKeyHits] = useState<number>(0);

  // Speed test state
  const testPhrases = [
    "The quick brown fox jumps over the lazy dog.",
    "Tactile mechanical switches provide supreme typing accuracy and satisfaction.",
    "Antigravity AI empowers developers to build and test next-generation web apps.",
    "Clean 3D design and proportional layouts create stunning user experiences.",
    "Precision keycaps with smooth linear stems enable lightning-fast typing records.",
    "Master touch typing through rhythm, finger positioning, and muscle memory.",
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [typedInput, setTypedInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number>(100);
  const autoNextTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keyboardSectionRef = useRef<HTMLDivElement | null>(null);

  // Shortcuts Dojo state
  const [testedShortcuts, setTestedShortcuts] = useState<Set<string>>(new Set());
  const [activeShortcutCombo, setActiveShortcutCombo] = useState<string | null>(null);

  // Intercept & Disable Browser Default Shortcuts specifically when Shortcuts Dojo is Active
  useEffect(() => {
    if (currentPage !== "shortcuts") return;

    const handleShortcutsKeyDown = (e: KeyboardEvent) => {
      // Modifiers and combinations that normally trigger browser dialogs (e.g. Ctrl+P, Ctrl+S, Ctrl+F, Ctrl+O, etc.)
      const isModifierCombo = e.ctrlKey || e.altKey || e.metaKey;
      const isFunctionKey = e.key.startsWith("F") && e.key.length <= 3;

      if (isModifierCombo || isFunctionKey) {
        // PREVENT BROWSER DEFAULT ACTIONS (Print dialog, Save dialog, Page search, etc.)
        e.preventDefault();
        e.stopPropagation();
      }

      // Format pressed combination
      const parts: string[] = [];
      if (e.ctrlKey) parts.push("Ctrl");
      if (e.altKey) parts.push("Alt");
      if (e.shiftKey) parts.push("Shift");
      if (e.metaKey) parts.push("Windows");

      let mainKey = e.key.toUpperCase();
      if (e.code === "Space") mainKey = "Space";
      if (e.code === "Tab") mainKey = "Tab";
      if (e.code === "Escape") mainKey = "Esc";
      if (e.code === "Period") mainKey = ".";
      if (e.code === "Slash") mainKey = "/";

      // Exclude modifier-only key presses
      const modifierKeys = ["CONTROL", "ALT", "SHIFT", "META"];
      if (!modifierKeys.includes(mainKey)) {
        parts.push(mainKey);
      }

      if (parts.length > 0) {
        const comboStr = parts.join(" + ");
        setActiveShortcutCombo(comboStr);

        // Normalize match against shortcut list
        const SHORTCUTS_REF = [
          "Ctrl + C", "Ctrl + V", "Ctrl + Z", "Ctrl + P", "Ctrl + S", "Ctrl + F",
          "Ctrl + Shift + P", "Ctrl + A", "Ctrl + Shift + T", "Alt + Tab", "Windows + .", "Ctrl + K"
        ];

        const matched = SHORTCUTS_REF.find((s) => {
          const sNormalized = s.toLowerCase().replace(/\s+/g, "");
          const comboNormalized = comboStr.toLowerCase().replace(/\s+/g, "");
          return sNormalized === comboNormalized;
        });

        if (matched) {
          setTestedShortcuts((prev) => new Set(prev).add(matched));
          soundEngine.playKeySound(mainKey);
        }

        handleKeyTriggered(mainKey, e.code);
      }
    };

    window.addEventListener("keydown", handleShortcutsKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", handleShortcutsKeyDown, { capture: true });
  }, [currentPage]);

  // Auto-play chill BGM only when user is in the "Let's Play" / games views, and pause on home
  useEffect(() => {
    if (currentPage !== "home") {
      bgMusic.play();
    } else {
      bgMusic.pause();
    }
  }, [currentPage]);

  // Cleanup pending timer on unmount
  useEffect(() => {
    return () => {
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
    };
  }, []);

  const targetPhrase = testPhrases[currentPhraseIndex];

  const handleKeyTriggered = (key: string, code: string) => {
    setLastTriggeredKey({ key, code, time: Date.now() });
    setTotalKeyHits((prev) => prev + 1);
  };

  const handleTestTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!startTime) {
      setStartTime(Date.now());
    }
    setTypedInput(val);

    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetPhrase[i]) correct++;
    }
    const acc = val.length > 0 ? Math.round((correct / val.length) * 100) : 100;
    setAccuracy(acc);

    // Check completion
    if (val === targetPhrase) {
      const durationMin = (Date.now() - (startTime || Date.now())) / 60000;
      const wordCount = targetPhrase.split(" ").length;
      const calculatedWpm = Math.round(wordCount / (durationMin || 0.01));
      setWpm(calculatedWpm);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      // Clear any existing pending auto-transition
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }

      // Automatically advance to the next phrase after a brief celebratory pause
      autoNextTimeoutRef.current = setTimeout(() => {
        setTypedInput("");
        setStartTime(null);
        setCurrentPhraseIndex((prev) => (prev + 1) % testPhrases.length);
      }, 700);
    }
  };

  const resetSpeedTest = () => {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
    }
    setTypedInput("");
    setStartTime(null);
    setWpm(null);
    setAccuracy(100);
    setCurrentPhraseIndex((prev) => (prev + 1) % testPhrases.length);
  };

  const scrollToKeyboard = () => {
    keyboardSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isDark = currentTheme.isDark || currentTheme.category === "Dark";

  return (
    <div
      className={`min-h-screen ${currentTheme.appBg} ${currentTheme.appText} flex flex-col items-center justify-start selection:bg-orange-500 selection:text-white relative overflow-x-clip transition-colors duration-300`}
    >
      {/* Dynamic Cybernetic Aurora & Constellation Motion Background (Shared Across All Pages) */}
      <MotionBackground theme={currentTheme} />

      {/* Floating 3D Parallax Keycap Elements (Home Hero Page Only) */}
      {currentPage === "home" && <ParallaxFloatingElements />}

      {/* Sticky Glassmorphic Top Navigation */}
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b ${
          isDark ? "bg-slate-950/80 border-slate-800 text-white" : "bg-white/80 border-slate-200 text-slate-900"
        } px-4 sm:px-8 py-3.5 transition-colors shadow-xs`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Left Side: Burger Menu (Keyboard Theme Palette & Navigation) + Logo */}
          <div className="flex items-center gap-3">
            {/* Burger Menu Button */}
            <button
              onClick={() => setIsThemeSidebarOpen(true)}
              className={`p-2.5 rounded-xl shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center border ${
                isDark
                  ? "bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`}
              aria-label="Keyboard Theme Palette"
              title="Keyboard Theme Palette"
            >
              <Menu className="w-5 h-5 text-orange-500" />
            </button>

            {currentPage !== "home" && (
              <button
                onClick={() => setCurrentPage("home")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-md hover:bg-orange-500 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
            )}

            {currentPage !== "home" && currentPage !== "start" && (
              <button
                onClick={() => setCurrentPage("start")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  isDark ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5 text-orange-500" />
                <span>Games Hub</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black tracking-widest uppercase bg-gradient-to-r from-orange-500 via-rose-500 to-indigo-500 bg-clip-text text-transparent">
                SETU
              </span>
              <span className={isDark ? "text-slate-600" : "text-slate-300"}>/</span>
              <span className={`text-sm font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                3D Mechanical Keyboard
              </span>
            </div>
          </div>

          {/* Right Side: Chill Vibe BGM Player Widget (Shown in Let's Play & Game Pages) */}
          <div className="flex items-center gap-3">
            {currentPage !== "home" && <MusicPlayer isDark={isDark} />}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* PAGE 1: HOMEPAGE (HERO + TEST YOUR KEYBOARD HERE + SHOWCASE) */}
      {/* ============================================================ */}
      {currentPage === "home" && (
        <>
          {/* Cinematic Hero Section */}
          <section className="relative z-10 w-full max-w-5xl pt-12 sm:pt-20 pb-8 px-4 flex flex-col items-center text-center">
            {/* Powered By SETU Glowing Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-lg backdrop-blur-md mb-6 hover:scale-105 transition-transform ${
                isDark
                  ? "bg-slate-900/90 border-slate-700/80 shadow-[0_4px_20px_rgba(234,88,12,0.2)] text-white"
                  : "bg-white/90 border-slate-200/90 shadow-[0_4px_20px_rgba(234,88,12,0.12)] text-slate-800"
              }`}
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className={`text-xs font-black uppercase tracking-widest ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                Powered by <span className="text-orange-500 font-extrabold">SETU</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 text-[10px] border border-orange-500/30">
                NEXT-GEN WEB 3D
              </span>
            </motion.div>

            {/* Big Bold Headline: 3D MECHANICAL KEYBOARD */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] uppercase max-w-4xl ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              <span className="block drop-shadow-sm">3D Mechanical</span>
              <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
                Keyboard
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
              className={`mt-6 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-medium ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Zero-latency mechanical switch acoustics, adaptive per-key RGB matrices, and realistic touch-typing contact kinematics rendered in pure React & Tailwind.
            </motion.p>

            {/* Hero CTA Action Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <button
                onClick={() => setCurrentPage("start")}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-sm shadow-xl hover:from-orange-500 hover:to-amber-500 hover:scale-105 active:scale-95 transition-all cursor-pointer group ring-2 ring-orange-400/40"
              >
                <Sparkles className="w-4 h-4 text-white fill-white group-hover:rotate-12 transition-transform" />
                <span>Let's Start Training</span>
              </button>

              <button
                onClick={scrollToKeyboard}
                className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                  isDark
                    ? "bg-slate-900/90 border-slate-700 text-white hover:bg-slate-800"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Play className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>Test Workbench</span>
                <ArrowDown className="w-4 h-4 ml-0.5 opacity-70" />
              </button>

              <button
                onClick={() => setCurrentPage("speedtest")}
                className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                  isDark
                    ? "bg-slate-900/90 border-slate-700 text-white hover:bg-slate-800"
                    : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Speed Arena</span>
              </button>

              <button
                onClick={() => setIsThemeSidebarOpen(true)}
                className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border font-bold text-sm hover:scale-105 transition-all cursor-pointer ${
                  isDark
                    ? "bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800"
                    : "bg-white/80 border-slate-200 text-slate-700 hover:bg-white"
                }`}
              >
                <Palette className="w-4 h-4 text-indigo-400" />
                <span>Themes</span>
              </button>
            </motion.div>
          </section>

          {/* Scroll-Driven 3D Keyboard Exploded Assembly & Interactive Test Workbench */}
          <div ref={keyboardSectionRef} id="studio" className="w-full">
            <ExplodedKeyboardScroll
              theme={currentTheme}
              colorZones={colorZones}
              testedKeys={testedKeys}
              onTestedKeysChange={setTestedKeys}
              onOpenThemeSidebar={() => setIsThemeSidebarOpen(true)}
            />
          </div>

          {/* Switch Anatomy & Technical Showcase */}
          <SwitchShowcase theme={currentTheme} />
        </>
      )}

      {/* ============================================================ */}
      {/* PAGE: LET'S START - ARCADE GAMES HUB SELECTOR                 */}
      {/* ============================================================ */}
      {currentPage === "start" && (
        <GamesHub
          theme={currentTheme}
          onSelectGame={(gameId) => setCurrentPage(gameId as AppPage)}
        />
      )}

      {/* ============================================================ */}
      {/* GAME 1: TOUCH TYPING ACADEMY (16-LEVEL COMPREHENSIVE ENGINE) */}
      {/* ============================================================ */}
      {currentPage === "academy" && (
        <KeyboardGame
          theme={currentTheme}
          colorZones={colorZones}
          onOpenThemeSidebar={() => setIsThemeSidebarOpen(true)}
          onBackToHome={() => setCurrentPage("start")}
        />
      )}

      {/* ============================================================ */}
      {/* GAME 2: METEOR DEFENSE (FALLING WORDS ARCADE)                */}
      {/* ============================================================ */}
      {currentPage === "fallingwords" && (
        <FallingWordsGame
          theme={currentTheme}
          colorZones={colorZones}
          onOpenThemeSidebar={() => setIsThemeSidebarOpen(true)}
          onBackToHub={() => setCurrentPage("start")}
        />
      )}

      {/* ============================================================ */}
      {/* GAME 3: SOUND MATRIX ECHO (SWITCH ACOUSTIC SIMON SAYS)       */}
      {/* ============================================================ */}
      {currentPage === "soundmatrix" && (
        <SoundMatrixGame
          theme={currentTheme}
          colorZones={colorZones}
          onOpenThemeSidebar={() => setIsThemeSidebarOpen(true)}
          onBackToHub={() => setCurrentPage("start")}
        />
      )}

      {/* ============================================================ */}
      {/* GAME 4: BLIND TYPING DOJO (PURE AUDIO DICTATION)             */}
      {/* ============================================================ */}
      {currentPage === "blindtyping" && (
        <BlindTypingGame
          theme={currentTheme}
          colorZones={colorZones}
          onOpenThemeSidebar={() => setIsThemeSidebarOpen(true)}
          onBackToHub={() => setCurrentPage("start")}
        />
      )}

      {/* ============================================================ */}
      {/* GAME 4: SPEED TEST ARENA PAGE                                */}
      {/* ============================================================ */}
      {currentPage === "speedtest" && (
        <section className="relative z-10 w-full max-w-5xl px-4 py-8 flex flex-col items-center gap-6 animate-in fade-in duration-300">
          <div className={`w-full flex items-center justify-between pt-4 pb-2 border-b ${
            isDark ? "border-slate-800" : "border-slate-200/80"
          }`}>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-orange-500/15 text-orange-500">
                <Flame className="w-5 h-5" />
              </span>
              <div>
                <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Speed Typing Arena
                </h2>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Real-time accuracy calculation, words-per-minute metrics, and automatic phrase progression
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage("start")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isDark ? "bg-slate-800 text-white border-slate-700 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Games Hub</span>
            </button>
          </div>

          {/* Speed Test Banner */}
          <div className={`w-full p-6 sm:p-8 border rounded-3xl shadow-2xl flex flex-col md:flex-row items-stretch gap-6 backdrop-blur-md ${
            isDark ? "bg-slate-900/95 border-slate-800 text-white" : "bg-white/95 border-slate-200 text-slate-900"
          }`}>
            {/* Left / Main Typing Area */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4" /> Live Typing Challenge
                </span>
                <button
                  onClick={resetSpeedTest}
                  className={`text-xs flex items-center gap-1 transition-colors font-semibold cursor-pointer ${
                    isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Next Phrase
                </button>
              </div>

              {/* Target phrase */}
              <div className={`text-base sm:text-lg font-medium font-mono p-5 rounded-2xl border tracking-wide select-none leading-relaxed ${
                isDark ? "bg-slate-950/80 border-slate-800 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
              }`}>
                {targetPhrase.split("").map((char, index) => {
                  let color = isDark ? "text-slate-500" : "text-slate-400";
                  if (index < typedInput.length) {
                    color = typedInput[index] === char ? "text-emerald-400 font-bold" : "text-rose-400 bg-rose-500/20 rounded px-0.5";
                  }
                  return (
                    <span key={index} className={color}>
                      {char}
                    </span>
                  );
                })}
              </div>

              {/* Input field */}
              <input
                type="text"
                value={typedInput}
                onChange={handleTestTyping}
                placeholder="Start typing the phrase above..."
                className={`w-full p-4 border-2 focus:border-orange-500 focus:outline-none rounded-2xl font-mono text-sm transition-all shadow-inner ${
                  isDark ? "bg-slate-950 border-slate-800 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-800 placeholder-slate-400"
                }`}
                autoFocus
              />
            </div>

            {/* Right Side Vertical Metrics Panel */}
            <div className={`w-full md:w-56 flex flex-row md:flex-col items-center justify-around p-5 rounded-2xl border gap-3 ${
              isDark ? "bg-slate-950/80 border-slate-800" : "bg-slate-50 border-slate-200/80"
            }`}>
              <div className="text-center w-full">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">WPM Speed</span>
                <span className="text-3xl font-black font-mono text-orange-500 block">{wpm !== null ? `${wpm}` : "--"}</span>
              </div>
              <div className={`w-[1px] md:w-full h-8 md:h-[1px] ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
              <div className="text-center w-full">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Accuracy</span>
                <span className={`text-3xl font-black font-mono block ${accuracy > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>{accuracy}%</span>
              </div>
              <div className={`w-[1px] md:w-full h-8 md:h-[1px] ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
              <div className="text-center w-full">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Status</span>
                <span className="text-xs font-black font-mono text-indigo-400 block truncate">{typedInput === targetPhrase ? "COMPLETED! 🎉" : "TYPING..."}</span>
              </div>
            </div>
          </div>

          {/* Interactive Keyboard in Speed Test Page */}
          <div className="flex w-full items-center justify-center p-2 sm:p-4 mt-2">
            <Keyboard
              className="mx-auto"
              theme={currentTheme}
              colorZones={colorZones}
              onKeyPress={handleKeyTriggered}
              onOpenThemeSidebar={() => setIsThemeSidebarOpen(true)}
            />
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* GAME 5: SHORTCUTS GUIDE PAGE                                 */}
      {/* ============================================================ */}
      {currentPage === "shortcuts" && (
        <section className="relative z-10 w-full max-w-5xl px-4 py-8 flex flex-col items-center gap-6 animate-in fade-in duration-300">
          <div className={`w-full flex items-center justify-between pt-4 pb-2 border-b ${
            isDark ? "border-slate-800" : "border-slate-200/80"
          }`}>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Keyboard Shortcuts Guide & Dojo
                </h2>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Comprehensive standard shortcut reference matrix for power users & developers
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentPage("start")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isDark ? "bg-slate-800 text-white border-slate-700 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Games Hub</span>
            </button>
          </div>

          <div className={`w-full p-6 sm:p-8 border rounded-3xl shadow-2xl flex flex-col gap-6 backdrop-blur-md ${
            isDark ? "bg-slate-900/95 border-slate-800 text-white" : "bg-white/95 border-slate-200 text-slate-900"
          }`}>
            {/* Safe Sandbox Active Status Banner */}
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              isDark ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-900"
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider block">
                    Browser Shortcut Override Enabled
                  </span>
                  <p className="text-xs opacity-85">
                    Browser hotkeys (such as <strong>Ctrl + P</strong> for print, <strong>Ctrl + S</strong> for save, and <strong>Ctrl + F</strong> for find) are intercepted safely inside the dojo.
                  </p>
                </div>
              </div>

              {/* Live Practiced Counter */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                  {testedShortcuts.size} / 12 Practiced
                </span>
                {testedShortcuts.size > 0 && (
                  <button
                    onClick={() => setTestedShortcuts(new Set())}
                    className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer"
                    title="Reset Practice"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Live Pressed Hotkey HUD */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
              isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Hotkey Input:</span>
                {activeShortcutCombo ? (
                  <span className="font-mono text-sm font-black px-3 py-1 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 animate-pulse">
                    {activeShortcutCombo}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 italic">Press any shortcut keys on your keyboard...</span>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">Tactile feedback active</span>
            </div>

            {/* Shortcuts Practice Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {[
                { key: "Ctrl + C", desc: "Copy Selection" },
                { key: "Ctrl + V", desc: "Paste Clipboard" },
                { key: "Ctrl + Z", desc: "Undo Action" },
                { key: "Ctrl + P", desc: "Quick Print / File Open (Safe)" },
                { key: "Ctrl + S", desc: "Save File / Commit (Safe)" },
                { key: "Ctrl + F", desc: "Find in Page (Safe)" },
                { key: "Ctrl + Shift + P", desc: "Command Palette" },
                { key: "Ctrl + A", desc: "Select All" },
                { key: "Ctrl + Shift + T", desc: "Reopen Closed Tab" },
                { key: "Alt + Tab", desc: "Switch Applications" },
                { key: "Windows + .", desc: "Emoji Picker" },
                { key: "Ctrl + K", desc: "Quick Search / Command" },
              ].map((sc, i) => {
                const isPracticed = testedShortcuts.has(sc.key);
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isPracticed
                        ? isDark
                          ? "bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] text-white"
                          : "bg-emerald-50 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] text-slate-900"
                        : isDark
                        ? "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2.5 py-1 rounded-xl border font-mono text-xs font-bold shadow-xs ${
                        isPracticed
                          ? "bg-emerald-500 text-white border-emerald-400"
                          : isDark
                          ? "bg-slate-900 border-slate-700 text-cyan-400"
                          : "bg-white border-slate-300 text-slate-800"
                      }`}>
                        {sc.key}
                      </span>
                      <span className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        {sc.desc}
                      </span>
                    </div>

                    {isPracticed && (
                      <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Keyboard in Shortcuts Page */}
          <div className="flex w-full items-center justify-center p-2 sm:p-4 mt-2">
            <Keyboard
              className="mx-auto"
              theme={currentTheme}
              colorZones={colorZones}
              onKeyPress={handleKeyTriggered}
              onOpenThemeSidebar={() => setIsThemeSidebarOpen(true)}
            />
          </div>
        </section>
      )}

      {/* Footer (Hidden during interactive gameplay views for zero-scroll viewport) */}
      {currentPage !== "academy" && currentPage !== "fallingwords" && currentPage !== "soundmatrix" && currentPage !== "blindtyping" && (
        <footer
          className={`relative z-10 w-full border-t ${currentTheme.headerBorder} py-8 px-6 mt-12 bg-white/40 backdrop-blur-md transition-colors`}
        >
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-75">
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-orange-600">SETU</span>
              <span>•</span>
              <span className="font-semibold">3D Mechanical Keyboard Engine</span>
            </div>
            <div>
              <span>Crafted with React, Framer Motion & Tailwind CSS</span>
            </div>
          </div>
        </footer>
      )}

      {/* Slide-over Theme Sidebar Drawer */}
      <ThemeSidebar
        isOpen={isThemeSidebarOpen}
        onClose={() => setIsThemeSidebarOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={(theme) => setCurrentTheme(theme)}
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
        colorZones={colorZones}
        onToggleColorZones={() => setColorZones((prev) => !prev)}
      />
    </div>
  );
}
