"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard } from "./keyboard";
import { type KeyboardTheme } from "@/lib/themes";
import { soundEngine } from "@/lib/sound";
import {
  Sparkles,
  Trophy,
  Volume2,
  VolumeX,
  RotateCcw,
  ArrowLeft,
  Play,
  Pause,
  Zap,
  Headphones,
  CheckCircle2,
  Settings2,
  Sliders,
  Type,
  BookOpen,
  ArrowRight,
  Flame,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";

export type DictationMode = "spell" | "words";

export interface PracticeLine {
  id: number;
  category: "Beginner" | "Acoustics" | "Phrases" | "Speed" | "Code";
  text: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const PRACTICE_LINES: PracticeLine[] = [
  {
    id: 1,
    category: "Beginner",
    text: "type fast with rhythm and flow",
    difficulty: "Easy",
  },
  {
    id: 2,
    category: "Beginner",
    text: "home row keys anchor your fingers",
    difficulty: "Easy",
  },
  {
    id: 3,
    category: "Acoustics",
    text: "mechanical switches give deep tactile clacks",
    difficulty: "Medium",
  },
  {
    id: 4,
    category: "Phrases",
    text: "the quick brown fox jumps over the lazy dog",
    difficulty: "Medium",
  },
  {
    id: 5,
    category: "Acoustics",
    text: "lubed linear stems glide with zero friction",
    difficulty: "Medium",
  },
  {
    id: 6,
    category: "Speed",
    text: "muscle memory unlocks lightning typing velocity",
    difficulty: "Hard",
  },
  {
    id: 7,
    category: "Code",
    text: "const echo = sound matrix speech synthesis",
    difficulty: "Hard",
  },
  {
    id: 8,
    category: "Phrases",
    text: "listen to the voice and echo every single letter",
    difficulty: "Hard",
  },
];

// Map character to physical keyboard code
function charToKeyCode(char: string): string {
  if (!char) return "";
  if (char === " ") return "Space";
  if (char === ",") return "Comma";
  if (char === ".") return "Period";
  if (char === ";") return "Semicolon";
  if (char === "'") return "Quote";
  if (char === "/") return "Slash";
  if (char === "-") return "Minus";
  if (char === "=") return "Equal";
  if (char >= "0" && char <= "9") return `Digit${char}`;
  const upper = char.toUpperCase();
  if (upper >= "A" && upper <= "Z") return `Key${upper}`;
  return "";
}

export function SoundMatrixGame({
  theme,
  colorZones,
  onOpenThemeSidebar,
  onBackToHub,
}: {
  theme: KeyboardTheme;
  colorZones?: boolean;
  onOpenThemeSidebar?: () => void;
  onBackToHub: () => void;
}) {
  const isDark = theme.isDark || theme.category === "Dark";

  // Game Settings
  const [dictationMode, setDictationMode] = useState<DictationMode>("spell"); // 'spell' or 'words'
  const [speechRate, setSpeechRate] = useState<number>(0.9); // 0.6 to 1.4
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number>(0);

  // Active Session State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTypedText, setCurrentTypedText] = useState<string>("");
  const [speakingIndex, setSpeakingIndex] = useState<number>(0);
  const [speakingWordIndex, setSpeakingWordIndex] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState<boolean>(false);
  const [shakeWrong, setShakeWrong] = useState<boolean>(false);

  const activeLine = PRACTICE_LINES[selectedLineIndex] || PRACTICE_LINES[0];
  const targetText = activeLine.text;
  const currentTargetChar = targetText[currentTypedText.length] || "";
  const targetKeyCode = charToKeyCode(currentTargetChar);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isSpeakingRef = useRef<boolean>(false);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      stopSpeaking();
    };
  }, []);

  const stopSpeaking = () => {
    if (speechTimerRef.current) {
      clearTimeout(speechTimerRef.current);
      speechTimerRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    isSpeakingRef.current = false;
  };

  // Pronounce character or word cleanly
  const speakToken = useCallback((textToSpeak: string, onEnd?: () => void) => {
    if (isVoiceMuted || !synthRef.current) {
      onEnd?.();
      return;
    }

    try {
      synthRef.current.cancel(); // cancel any active queue for immediate clear audio
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      utterance.lang = "en-US";

      utterance.onend = () => {
        onEnd?.();
      };
      utterance.onerror = () => {
        onEnd?.();
      };

      synthRef.current.speak(utterance);
    } catch {
      onEnd?.();
    }
  }, [isVoiceMuted, speechPitch, speechRate]);

  // Continuous speech loop depending on mode
  const triggerNextDictation = useCallback((index: number) => {
    if (!isPlaying) return;

    if (dictationMode === "spell") {
      if (index >= targetText.length) return;

      setSpeakingIndex(index);
      const char = targetText[index];
      let spokenRepresentation = char.toUpperCase();
      if (char === " ") {
        spokenRepresentation = "Space";
      } else if (char === ".") {
        spokenRepresentation = "Period";
      } else if (char === ",") {
        spokenRepresentation = "Comma";
      }

      speakToken(spokenRepresentation, () => {
        if (!isPlaying) return;
        // Paced interval to next letter
        const delay = Math.max(350, Math.round(750 / speechRate));
        speechTimerRef.current = setTimeout(() => {
          triggerNextDictation(index + 1);
        }, delay);
      });
    } else {
      // Word by word dictation mode
      const words = targetText.split(" ");
      if (index >= words.length) return;

      setSpeakingWordIndex(index);
      const word = words[index];
      const spokenText = index < words.length - 1 ? `${word}, space` : word;

      speakToken(spokenText, () => {
        if (!isPlaying) return;
        const delay = Math.max(600, Math.round(1200 / speechRate));
        speechTimerRef.current = setTimeout(() => {
          triggerNextDictation(index + 1);
        }, delay);
      });
    }
  }, [dictationMode, isPlaying, speakToken, speechRate, targetText]);

  // Start / Resume Dictation
  const startSession = () => {
    setIsPlaying(true);
    setStartTime(Date.now());
    if (dictationMode === "spell") {
      triggerNextDictation(currentTypedText.length);
    } else {
      const currentWordIdx = currentTypedText.split(" ").length - 1;
      triggerNextDictation(currentWordIdx);
    }
  };

  const pauseSession = () => {
    setIsPlaying(false);
    stopSpeaking();
  };

  const restartSession = () => {
    stopSpeaking();
    setCurrentTypedText("");
    setSpeakingIndex(0);
    setSpeakingWordIndex(0);
    setStreak(0);
    setMistakes(0);
    setStartTime(null);
    setShowCompleteModal(false);
    setIsPlaying(false);
  };

  // Re-read current character or word on demand
  const repeatCurrentPrompt = () => {
    if (dictationMode === "spell") {
      const char = targetText[currentTypedText.length];
      if (char) {
        speakToken(char === " " ? "Space" : char.toUpperCase());
      }
    } else {
      const words = targetText.split(" ");
      const currentWordIdx = currentTypedText.split(" ").length - 1;
      const word = words[currentWordIdx];
      if (word) {
        speakToken(word);
      }
    }
  };

  // Handle typing input
  const processKey = useCallback((char: string) => {
    if (showCompleteModal) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const expectedChar = targetText[currentTypedText.length];
    if (!expectedChar) return;

    if (char.toLowerCase() === expectedChar.toLowerCase()) {
      // Correct character hit!
      soundEngine.playKeySound(expectedChar === " " ? "Space" : expectedChar.toUpperCase());
      const nextTyped = currentTypedText + expectedChar;
      setCurrentTypedText(nextTyped);
      setStreak((prev) => {
        const n = prev + 1;
        if (n > maxStreak) setMaxStreak(n);
        return n;
      });

      // Check if finished
      if (nextTyped === targetText) {
        stopSpeaking();
        setIsPlaying(false);
        setShowCompleteModal(true);
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.55 },
          });
        } catch {}
      } else {
        // If continuous voice was running in spelling mode, optionally sync spoken index
        if (isPlaying && dictationMode === "spell") {
          setSpeakingIndex(nextTyped.length);
        }
      }
    } else {
      // Wrong character hit
      soundEngine.playKeySound("Backspace");
      setStreak(0);
      setMistakes((prev) => prev + 1);
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 300);
    }
  }, [currentTypedText, dictationMode, isPlaying, maxStreak, showCompleteModal, startTime, targetText]);

  // Global physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showCompleteModal) return;

      if (e.code === "Space") {
        e.preventDefault();
        processKey(" ");
        return;
      }

      if (e.code === "Backspace") {
        e.preventDefault();
        if (currentTypedText.length > 0) {
          setCurrentTypedText((prev) => prev.slice(0, -1));
          soundEngine.playKeySound("Backspace");
        }
        return;
      }

      if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1) {
        processKey(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTypedText, processKey, showCompleteModal]);

  // Metrics
  const totalTyped = currentTypedText.length + mistakes;
  const accuracy = totalTyped > 0 ? Math.round((currentTypedText.length / totalTyped) * 100) : 100;
  const durationMin = startTime ? (Date.now() - startTime) / 60000 : 0.001;
  const wordCount = currentTypedText.trim().split(/\s+/).filter(Boolean).length;
  const liveWpm = Math.round(wordCount / (durationMin || 0.001));

  return (
    <div className="relative z-10 w-full max-w-5xl px-3 sm:px-5 py-2 flex flex-col items-center justify-between gap-3 animate-in fade-in duration-300 select-none">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              stopSpeaking();
              onBackToHub();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all shadow-2xs cursor-pointer ${
              isDark
                ? "bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Games Hub</span>
          </button>

          <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white shadow-2xs uppercase tracking-wider flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5" />
            <span>Echo Matrix Voice Dictation</span>
          </span>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-0.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${
            isDark ? "bg-slate-900 border-slate-800 text-emerald-400" : "bg-white border-slate-200 text-emerald-600"
          }`}>
            <span>Acc:</span>
            <span>{accuracy}%</span>
          </div>

          <div className="px-2.5 py-0.5 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 font-mono text-xs font-black flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
            <span>{streak}x</span>
          </div>
        </div>
      </div>

      {/* Voice Control & Dictation Mode Switcher Toolbar */}
      <div className={`w-full p-3.5 sm:p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-3 shadow-md backdrop-blur-md ${
        isDark ? "bg-slate-900/90 border-slate-800 text-white" : "bg-white/90 border-slate-200 text-slate-900"
      }`}>
        {/* Left: Mode Selection (Spell Letters vs Read Words) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Voice Mode:</span>
          <div className="flex items-center p-1 rounded-xl bg-slate-200 dark:bg-slate-950 border border-slate-300 dark:border-slate-800">
            <button
              onClick={() => {
                stopSpeaking();
                setDictationMode("spell");
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                dictationMode === "spell"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Spell Letters ("Space")</span>
            </button>

            <button
              onClick={() => {
                stopSpeaking();
                setDictationMode("words");
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                dictationMode === "words"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Full Words</span>
            </button>
          </div>
        </div>

        {/* Center: Play / Pause / Replay Buttons */}
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={startSession}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Voice Dictation</span>
            </button>
          ) : (
            <button
              onClick={pauseSession}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-black shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 fill-white" />
              <span>Pause Voice</span>
            </button>
          )}

          <button
            onClick={repeatCurrentPrompt}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-cyan-400" : "bg-slate-100 border-slate-300 hover:bg-slate-200 text-cyan-600"
            }`}
            title="Repeat Current Spoken Prompt"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            onClick={restartSession}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300" : "bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-700"
            }`}
            title="Restart Line"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Speech Rate Speed & Line Selector */}
        <div className="flex items-center gap-3">
          {/* Speed Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Speed:</span>
            {[0.7, 0.9, 1.2].map((rate) => (
              <button
                key={rate}
                onClick={() => setSpeechRate(rate)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  speechRate === rate
                    ? "bg-purple-600 text-white"
                    : isDark
                    ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Line Index Nav */}
          <div className="flex items-center gap-1">
            <button
              disabled={selectedLineIndex === 0}
              onClick={() => {
                setSelectedLineIndex((prev) => Math.max(0, prev - 1));
                restartSession();
              }}
              className="px-2 py-1 rounded-lg border text-xs font-bold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              ◀
            </button>
            <span className="text-xs font-mono font-bold px-1.5">
              {selectedLineIndex + 1}/{PRACTICE_LINES.length}
            </span>
            <button
              disabled={selectedLineIndex >= PRACTICE_LINES.length - 1}
              onClick={() => {
                setSelectedLineIndex((prev) => Math.min(PRACTICE_LINES.length - 1, prev + 1));
                restartSession();
              }}
              className="px-2 py-1 rounded-lg border text-xs font-bold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* Main Dictation Reading & Interactive Typing Line Display */}
      <div className={`w-full p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col items-center justify-center gap-4 text-center transition-all ${
        shakeWrong ? "animate-shake" : ""
      } ${
        isDark
          ? "bg-slate-900/95 border-slate-800 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          : "bg-white border-slate-200 text-slate-900 shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
      }`}>
        {/* Line Category and Difficulty Badge */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/30">
            {activeLine.category}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-400 border border-slate-700/50">
            {activeLine.difficulty}
          </span>
          {isPlaying && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 animate-pulse">
              <Volume2 className="w-3 h-3" />
              <span>Voice Reading Active</span>
            </span>
          )}
        </div>

        {/* Giant Kinetic Interactive Text Stream */}
        <div className="text-2xl sm:text-3xl md:text-4xl font-mono font-black tracking-wider leading-relaxed flex flex-wrap items-center justify-center gap-y-2 select-none">
          {targetText.split("").map((char, idx) => {
            const isTyped = idx < currentTypedText.length;
            const isCurrent = idx === currentTypedText.length;
            const isSpoken = dictationMode === "spell" && idx === speakingIndex && isPlaying;
            const isSpace = char === " ";

            return (
              <span
                key={idx}
                className={`relative px-1 py-0.5 rounded-md transition-all duration-150 ${
                  isTyped
                    ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                    : isCurrent
                    ? isDark
                      ? "text-amber-400 bg-amber-500/20 ring-2 ring-amber-400 scale-110 shadow-lg"
                      : "text-orange-600 bg-orange-100 ring-2 ring-orange-500 scale-110 shadow-md"
                    : isSpoken
                    ? "text-cyan-400 underline underline-offset-8 decoration-cyan-400 animate-pulse"
                    : isDark
                    ? "text-slate-600"
                    : "text-slate-300"
                }`}
              >
                {isSpace ? (
                  <span className={`inline-block px-1 text-xs font-sans tracking-tight uppercase opacity-80 ${isCurrent ? 'font-black text-amber-400' : ''}`}>
                    [SPACE]
                  </span>
                ) : (
                  char
                )}
                {isCurrent && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-1 bg-amber-400 rounded-full animate-bounce" />
                )}
              </span>
            );
          })}
        </div>

        {/* Spoken Hint / Next Target Pill */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Next Spoken Key:</span>
          <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-mono font-black text-sm shadow-md">
            {currentTargetChar === " " ? "SPACEBAR" : currentTargetChar.toUpperCase() || "DONE"}
          </span>
          <span className="text-xs text-slate-400 italic">
            ({dictationMode === "spell" ? "Spelling letter-by-letter with 'Space'" : "Reading full words"})
          </span>
        </div>
      </div>

      {/* 3D MECHANICAL KEYBOARD ENGINE WITH REAL-TIME ECHO TARGET LIGHTING */}
      <div className="w-full flex flex-col items-center justify-center relative mt-0">
        <Keyboard
          className="mx-auto"
          theme={theme}
          colorZones={colorZones}
          allowMouseClick={true}
          targetKeyCode={targetKeyCode}
          onKeyPress={(key) => processKey(key === "SPACE" ? " " : key)}
          onOpenThemeSidebar={onOpenThemeSidebar}
        />
      </div>

      {/* Level Completion Modal */}
      <AnimatePresence>
        {showCompleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl text-center flex flex-col items-center gap-5 ${
                isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl shadow-purple-500/30">
                <Trophy className="w-12 h-12 animate-bounce" />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-purple-400 block mb-1">
                  ECHO LINE COMPLETED!
                </span>
                <h3 className="text-2xl font-black tracking-tight">Flawless Audio Dictation</h3>
                <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  You echoed every character and space with supreme acoustic timing!
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 w-full">
                <div className={`p-3 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Accuracy</span>
                  <span className="text-lg font-black font-mono text-emerald-400">{accuracy}%</span>
                </div>
                <div className={`p-3 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Max Streak</span>
                  <span className="text-lg font-black font-mono text-orange-500">{maxStreak}x</span>
                </div>
                <div className={`p-3 rounded-2xl border ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Speed</span>
                  <span className="text-lg font-black font-mono text-indigo-400">{liveWpm} WPM</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full mt-2">
                <button
                  onClick={restartSession}
                  className={`w-1/2 py-3 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isDark ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-white" : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repeat Line</span>
                </button>

                <button
                  onClick={() => {
                    const nextIdx = (selectedLineIndex + 1) % PRACTICE_LINES.length;
                    setSelectedLineIndex(nextIdx);
                    restartSession();
                    setTimeout(() => startSession(), 200);
                  }}
                  className="w-1/2 py-3 px-3 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
                >
                  <span>Next Line</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
