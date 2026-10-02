"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Keyboard from "./keyboard";
import type { KeyboardTheme } from "@/lib/themes";
import { soundEngine } from "@/lib/sound";
import {
  Volume2,
  EyeOff,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Flame,
  ChevronRight,
  Headphones,
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
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [speechMode, setSpeechMode] = useState<"words" | "spelling">("words");
  const [streak, setStreak] = useState<number>(0);
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
    }, 350);

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

    if (val.trim() === currentPhrase.toLowerCase().trim()) {
      finishPhrase(val);
    }
  };

  const finishPhrase = (finalVal: string) => {
    const end = Date.now();
    setEndTime(end);
    setIsCompleted(true);
    setStreak((prev) => prev + 1);

    soundEngine.playKeySound("Enter");

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setTimeout(() => {
        const cheerUtter = new SpeechSynthesisUtterance("Perfect match!");
        cheerUtter.rate = 1.1;
        cheerUtter.pitch = 1.2;
        window.speechSynthesis.speak(cheerUtter);
      }, 250);
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

  const handleVirtualKeyPress = (label: string, code: string) => {
    inputRef.current?.focus();
  };

  // Compute live metrics
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
    <div className="relative z-10 w-full max-w-5xl px-3 sm:px-6 py-2 flex flex-col items-center gap-3 animate-in fade-in duration-300">
      {/* Hidden focused input */}
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
        className={`w-full flex items-center justify-between pb-2 border-b ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2.5">
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

          <div className="flex items-center gap-1.5">
            <span className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <EyeOff className="w-3.5 h-3.5" />
            </span>
            <span className={`text-sm font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Blind Typing
            </span>
          </div>
        </div>

        {/* Right HUD Badges */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-mono font-bold ${
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
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          </button>
        </div>
      </div>

      {/* Ultra-Compact Audio HUD Card */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`w-full px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-md flex flex-col gap-2.5 transition-all cursor-text ${
          isDark
            ? "bg-slate-900/90 border-purple-500/30 text-white"
            : "bg-white/95 border-purple-200 text-slate-900"
        }`}
      >
        {/* Controls Row */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isSpeaking && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isSpeaking ? "bg-purple-500" : "bg-slate-400"
                }`}
              ></span>
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-400 flex items-center gap-1">
              <Headphones className="w-3 h-3" />
              <span>{isSpeaking ? "Speaking Audio..." : `Audio Phrase #${phraseIndex + 1} (${wordCount} words)`}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                speakCurrentPhrase();
                inputRef.current?.focus();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              title="Hear the phrase again"
            >
              <Volume2 className="w-3 h-3" />
              <span>Hear Again</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSpeechMode((prev) => (prev === "words" ? "spelling" : "words"));
              }}
              className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                speechMode === "spelling"
                  ? "bg-purple-500/20 border-purple-400 text-purple-300"
                  : isDark
                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Mode: {speechMode === "words" ? "Words" : "Spell"}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSpeechRate((prev) => (prev === 0.75 ? 0.95 : prev === 0.95 ? 1.15 : 0.75));
              }}
              className={`px-2 py-1 rounded-lg border text-[10px] font-mono font-bold transition-all cursor-pointer ${
                isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-700"
              }`}
            >
              {speechRate === 0.75 ? "0.75x" : speechRate === 0.95 ? "1.0x" : "1.2x"}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                resetCurrentPhrase();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
              title="Reset phrase"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Masked Slots Track or Completion Row */}
        {!isCompleted ? (
          <div className="w-full flex flex-col items-center gap-1.5 pt-1 border-t border-purple-500/10">
            {/* Masked Dots Progress Bar */}
            <div className="w-full flex flex-wrap items-center justify-center gap-1 p-2 rounded-xl bg-purple-500/5 border border-purple-500/15">
              {targetChars.map((char, idx) => {
                const isTyped = idx < typedChars.length;
                const isSpace = char === " ";

                if (isSpace) {
                  return (
                    <div
                      key={idx}
                      className="w-2 h-5 flex items-center justify-center text-slate-400 opacity-40 font-mono text-[10px]"
                    >
                      ␣
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className={`w-4 h-5 rounded flex items-center justify-center font-mono text-[10px] font-bold transition-all ${
                      isTyped
                        ? isDark
                          ? "bg-purple-500/40 text-purple-300 border border-purple-400 shadow-xs"
                          : "bg-purple-200 text-purple-900 border border-purple-300"
                        : isDark
                        ? "bg-slate-950/60 border border-slate-800 text-slate-600"
                        : "bg-slate-100 border border-slate-200 text-slate-400"
                    }`}
                  >
                    {isTyped ? (showHint ? char : "●") : "○"}
                  </div>
                );
              })}
            </div>

            {/* Bottom Progress & Peek Trigger */}
            <div className="w-full flex items-center justify-between text-[11px] font-mono px-1">
              <span className="text-slate-400">
                Progress: <strong className="text-purple-400">{typedChars.length}</strong> / {targetChars.length} chars
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHint((prev) => !prev);
                }}
                className="text-slate-400 hover:text-purple-400 underline transition-colors cursor-pointer text-[10px]"
              >
                {showHint ? "Hide Peek" : "Peek Letters"}
              </button>
            </div>
          </div>
        ) : (
          /* Sleek Revealed Phrase & Next Button */
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-emerald-500/20"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div
                className={`px-3 py-1 rounded-xl font-mono text-xs font-bold border ${
                  isDark ? "bg-slate-950 text-emerald-300 border-emerald-500/40" : "bg-emerald-50 text-emerald-900 border-emerald-300"
                }`}
              >
                {currentPhrase}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-orange-500 px-2 py-0.5 rounded bg-orange-500/10">
                {wpm} WPM
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10">
                {accuracy}%
              </span>

              <button
                onClick={nextPhrase}
                className="flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Next Phrase</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Prominent 3D Mechanical Keyboard Front and Center */}
      <div className="flex w-full items-center justify-center p-0 sm:p-2">
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
