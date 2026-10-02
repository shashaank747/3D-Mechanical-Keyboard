"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Keyboard from "./keyboard";
import type { KeyboardTheme } from "@/lib/themes";
import { soundEngine } from "@/lib/sound";
import {
  Volume2,
  VolumeX,
  EyeOff,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Play,
  Pause,
  CheckCircle2,
  Flame,
  Award,
  ChevronRight,
  ShieldAlert,
  Headphones,
  Sliders,
  HelpCircle,
} from "lucide-react";

// Curated library of natural, everyday conversational phrases with easy generally used words
const BLIND_PHRASES = [
  "the cat sat on the warm mat",
  "keep your hands on the home keys",
  "a cup of hot coffee on the desk",
  "sunlight comes through the open window",
  "typing without looking is fun and easy",
  "listen to the voice and type the words",
  "practice every day to build muscle memory",
  "the quick brown fox jumped high",
  "music plays softly in the quiet room",
  "breathe easy and relax your fingers",
  "focus on your rhythm and speed will follow",
  "fresh water and cool morning air",
  "take your time and do your best work",
  "simple words make typing effortless",
  "light rain taps gently on the roof",
  "great work on trusting your fingers",
];

interface BlindTypingGameProps {
  theme: KeyboardTheme;
  colorZones: boolean;
  onOpenThemeSidebar: () => void;
  onBackToHub: () => void;
}

export function BlindTypingGame({
  theme,
  colorZones,
  onOpenThemeSidebar,
  onBackToHub,
}: BlindTypingGameProps) {
  const isDark = theme.isDark || theme.category === "Dark";

  // Game state
  const [phraseIndex, setPhraseIndex] = useState<number>(0);
  const [typedInput, setTypedInput] = useState<string>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.9); // Gentle, clear speed
  const [speechMode, setSpeechMode] = useState<"words" | "spelling">("words");
  const [streak, setStreak] = useState<number>(0);
  const [totalCompleted, setTotalCompleted] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const currentPhrase = BLIND_PHRASES[phraseIndex % BLIND_PHRASES.length];

  // Text-to-speech engine
  const speakCurrentPhrase = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    if (speechMode === "spelling") {
      // Spell out letters with spaces
      const spelledText = currentPhrase
        .split("")
        .map((ch) => (ch === " " ? " space " : ` ${ch} `))
        .join("");
      const utter = new SpeechSynthesisUtterance(spelledText);
      utter.rate = speechRate * 0.85;
      utter.pitch = 1.0;
      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
    } else {
      // Speak full natural sentence
      const utter = new SpeechSynthesisUtterance(currentPhrase);
      utter.rate = speechRate;
      utter.pitch = 1.0;
      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
    }
  }, [currentPhrase, speechRate, speechMode]);

  // Speak automatically when starting or moving to next phrase
  useEffect(() => {
    setTypedInput("");
    setIsCompleted(false);
    setShowHint(false);
    setStartTime(null);
    setEndTime(null);

    const timer = setTimeout(() => {
      speakCurrentPhrase();
      inputRef.current?.focus();
    }, 400);

    return () => {
      clearTimeout(timer);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [phraseIndex, speakCurrentPhrase]);

  // Check completion on input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCompleted) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const val = e.target.value.toLowerCase();
    setTypedInput(val);

    // Normalize comparison
    if (val.trim() === currentPhrase.toLowerCase().trim()) {
      finishPhrase(val);
    }
  };

  const finishPhrase = (finalVal: string) => {
    const end = Date.now();
    setEndTime(end);
    setIsCompleted(true);
    setTotalCompleted((prev) => prev + 1);
    setStreak((prev) => prev + 1);

    // Play victory chime
    soundEngine.playKeySound("Enter");

    // Speak celebratory remark
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setTimeout(() => {
        const cheerUtter = new SpeechSynthesisUtterance("Perfect match! Well done.");
        cheerUtter.rate = 1.1;
        cheerUtter.pitch = 1.2;
        window.speechSynthesis.speak(cheerUtter);
      }, 300);
    }
  };

  const nextPhrase = () => {
    setPhraseIndex((prev) => (prev + 1) % BLIND_PHRASES.length);
  };

  const resetCurrentPhrase = () => {
    setTypedInput("");
    setIsCompleted(false);
    setShowHint(false);
    setStartTime(null);
    setEndTime(null);
    speakCurrentPhrase();
    inputRef.current?.focus();
  };

  // Keyboard key press integration
  const handleVirtualKeyPress = (label: string, code: string) => {
    inputRef.current?.focus();
  };

  // Compute live accuracy & metrics
  const targetChars = currentPhrase.split("");
  const typedChars = typedInput.split("");
  let correctCount = 0;
  for (let i = 0; i < typedChars.length; i++) {
    if (typedChars[i] === targetChars[i]) {
      correctCount++;
    }
  }
  const accuracy = typedChars.length > 0 ? Math.round((correctCount / typedChars.length) * 100) : 100;

  const durationSec = startTime && endTime ? Math.max(1, (endTime - startTime) / 1000) : 1;
  const wordCount = currentPhrase.split(" ").length;
  const wpm = Math.round((wordCount / durationSec) * 60);

  return (
    <div className="relative z-10 w-full max-w-5xl px-3 sm:px-6 py-6 flex flex-col items-center gap-6 animate-in fade-in duration-300">
      {/* Hidden focused input to capture all physical typing smoothly */}
      <input
        ref={inputRef}
        type="text"
        value={typedInput}
        onChange={handleInputChange}
        className="opacity-0 absolute -top-100 pointer-events-none"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      {/* Top Header Bar */}
      <div
        className={`w-full flex items-center justify-between pb-3 border-b ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHub}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isDark
                ? "bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Games Hub</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <EyeOff className="w-4 h-4" />
            </span>
            <div>
              <h1
                className={`text-base sm:text-lg font-black tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Blind Typing Dojo
              </h1>
              <p className="text-[11px] text-slate-500">
                Pure Audio Dictation • Words are hidden until you finish
              </p>
            </div>
          </div>
        </div>

        {/* Right HUD Badges */}
        <div className="flex items-center gap-2.5">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-mono font-bold ${
              isDark
                ? "bg-slate-900 border-slate-800 text-purple-300"
                : "bg-purple-50 border-purple-200 text-purple-900"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Streak: {streak}</span>
          </div>

          <button
            onClick={onOpenThemeSidebar}
            className={`p-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isDark
                ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            title="Themes"
          >
            <Sparkles className="w-4 h-4 text-orange-500" />
          </button>
        </div>
      </div>

      {/* Main Blindfold Audio Card */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`w-full p-6 sm:p-8 rounded-3xl border shadow-2xl backdrop-blur-xl flex flex-col items-center gap-5 transition-all cursor-text ${
          isDark
            ? "bg-slate-900/90 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.12)] text-white"
            : "bg-white/95 border-purple-200 shadow-[0_0_30px_rgba(168,85,247,0.08)] text-slate-900"
        }`}
      >
        {/* Blindfold Audio Header Controls */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-purple-500/20">
          {/* Spoken Status Banner */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              {isSpeaking && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isSpeaking ? "bg-purple-500" : "bg-slate-400"
                }`}
              ></span>
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-purple-400">
              {isSpeaking ? "Speaking Audio..." : "Listening • Type What You Heard"}
            </span>
          </div>

          {/* Voice Action Triggers */}
          <div className="flex items-center gap-2">
            {/* Replay Audio Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                speakCurrentPhrase();
                inputRef.current?.focus();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              title="Hear the phrase again"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Hear Again</span>
            </button>

            {/* Read Words vs Spell Letters Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSpeechMode((prev) => (prev === "words" ? "spelling" : "words"));
              }}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                speechMode === "spelling"
                  ? "bg-purple-500/20 border-purple-400 text-purple-300"
                  : isDark
                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Mode: {speechMode === "words" ? "Read Words" : "Spell Letters"}
            </button>

            {/* Speech Rate Cycle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSpeechRate((prev) => (prev === 0.75 ? 0.95 : prev === 0.95 ? 1.15 : 0.75));
              }}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold transition-all cursor-pointer ${
                isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
              }`}
              title="Speech Speed"
            >
              {speechRate === 0.75 ? "0.75x (Slow)" : speechRate === 0.95 ? "1.0x (Normal)" : "1.2x (Fast)"}
            </button>

            {/* Reset Current */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetCurrentPhrase();
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
              title="Reset phrase"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Central Audio / Soundwave Orb (Zero Screen Text While Active) */}
        {!isCompleted ? (
          <div className="w-full flex flex-col items-center justify-center py-6 gap-5">
            {/* Animated Soundwave Visualizer Circle */}
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{
                  scale: isSpeaking ? [1, 1.15, 1] : [1, 1.04, 1],
                  opacity: isSpeaking ? [0.6, 0.9, 0.6] : [0.3, 0.45, 0.3],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 blur-xl absolute"
              />

              <div
                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 flex items-center justify-center shadow-inner ${
                  isDark
                    ? "bg-slate-950 border-purple-500/50 text-purple-400"
                    : "bg-white border-purple-300 text-purple-600"
                }`}
              >
                {isSpeaking ? (
                  <Headphones className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
                ) : (
                  <EyeOff className="w-8 h-8 sm:w-10 sm:h-10 opacity-80" />
                )}
              </div>
            </div>

            {/* Phrase Info Hint (Without revealing letters) */}
            <div className="text-center space-y-1">
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400">
                Audio Dictation #{phraseIndex + 1} • {currentPhrase.split(" ").length} Words Spoken
              </div>
              <p className="text-xs text-slate-500 max-w-md">
                Words are completely hidden. Listen carefully to the voice and type the sentence directly on your mechanical keyboard.
              </p>
            </div>

            {/* Blindfold Masked Letter Slots / Progress HUD */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-xl p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20">
              {targetChars.map((char, idx) => {
                const isTyped = idx < typedChars.length;
                const isSpace = char === " ";

                if (isSpace) {
                  return (
                    <div
                      key={idx}
                      className="w-3 h-7 flex items-center justify-center text-slate-400 opacity-30 font-mono text-xs"
                    >
                      ␣
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className={`w-6 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-black transition-all ${
                      isTyped
                        ? isDark
                          ? "bg-purple-500/30 text-purple-300 border border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.3)]"
                          : "bg-purple-100 text-purple-800 border border-purple-300"
                        : isDark
                        ? "bg-slate-950/70 border border-slate-800 text-slate-600"
                        : "bg-slate-100 border border-slate-200 text-slate-400"
                    }`}
                  >
                    {isTyped ? (showHint ? char : "●") : "○"}
                  </div>
                );
              })}
            </div>

            {/* Hint & Helper Row */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-slate-400">
                Progress: <strong className="text-purple-400">{typedChars.length}</strong> / {targetChars.length} chars
              </span>
              <span>•</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHint((prev) => !prev);
                }}
                className="text-slate-500 hover:text-purple-400 underline transition-colors cursor-pointer"
              >
                {showHint ? "Hide Peek" : "Peek Typed Letters"}
              </button>
            </div>
          </div>
        ) : (
          /* Reveal View upon Finishing */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center gap-5 py-4"
          >
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm uppercase tracking-wider">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Sentence Completed Successfully!</span>
            </div>

            {/* Revealed Phrase Text with Green/Red Highlight */}
            <div
              className={`w-full p-4 rounded-2xl border text-center font-mono text-lg font-black tracking-wide leading-relaxed ${
                isDark ? "bg-slate-950 border-emerald-500/40 text-white" : "bg-emerald-50 border-emerald-300 text-slate-900"
              }`}
            >
              {currentPhrase}
            </div>

            {/* Performance Stats Cards */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              <div
                className={`p-3 rounded-2xl border text-center ${
                  isDark ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  WPM Speed
                </span>
                <span className="text-2xl font-black font-mono text-orange-500">{wpm}</span>
              </div>

              <div
                className={`p-3 rounded-2xl border text-center ${
                  isDark ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Accuracy
                </span>
                <span className="text-2xl font-black font-mono text-emerald-400">{accuracy}%</span>
              </div>

              <div
                className={`p-3 rounded-2xl border text-center ${
                  isDark ? "bg-slate-950/70 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Time
                </span>
                <span className="text-2xl font-black font-mono text-purple-400">{durationSec.toFixed(1)}s</span>
              </div>
            </div>

            {/* Next Action Button */}
            <button
              onClick={nextPhrase}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Next Spoken Phrase</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Prominent 3D Mechanical Keyboard View */}
      <div className="w-full flex items-center justify-center p-2 sm:p-4 mt-2">
        <Keyboard
          className="mx-auto"
          theme={theme}
          colorZones={colorZones}
          onKeyPress={handleVirtualKeyPress}
          onOpenThemeSidebar={onOpenThemeSidebar}
        />
      </div>
    </div>
  );
}

export default BlindTypingGame;
