"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  AlertTriangle,
  XCircle,
  Flame,
  ChevronRight,
  Headphones,
  Check,
  X,
  Shuffle,
  Layers,
} from "lucide-react";

export interface BlindPhraseItem {
  id: number;
  text: string;
  tier: "5-10" | "10-15" | "15-20";
}

// Full 60 curated sentences across 3 word-length tiers
export const ALL_BLIND_PHRASES: BlindPhraseItem[] = [
  // -------------------------------------------------------------
  // 5–10 Words (20 Sentences)
  // -------------------------------------------------------------
  { id: 1, tier: "5-10", text: "The morning sky looked bright and peaceful." },
  { id: 2, tier: "5-10", text: "Keep your hands relaxed while typing." },
  { id: 3, tier: "5-10", text: "A small bird landed near the window." },
  { id: 4, tier: "5-10", text: "Practice makes typing faster and easier." },
  { id: 5, tier: "5-10", text: "The train arrived exactly on time." },
  { id: 6, tier: "5-10", text: "Fresh ideas often come from simple moments." },
  { id: 7, tier: "5-10", text: "My keyboard feels smooth and comfortable." },
  { id: 8, tier: "5-10", text: "The little garden was full of flowers." },
  { id: 9, tier: "5-10", text: "Everyone enjoyed the quiet evening walk." },
  { id: 10, tier: "5-10", text: "A cup of tea sat beside the laptop." },
  { id: 11, tier: "5-10", text: "Stay hungry. Stay foolish." },
  { id: 12, tier: "5-10", text: "It always seems impossible until it's done." },
  { id: 13, tier: "5-10", text: "The future depends on what you do today." },
  { id: 14, tier: "5-10", text: "Believe you can and you're halfway there." },
  { id: 15, tier: "5-10", text: "Well done is better than well said." },
  { id: 16, tier: "5-10", text: "Do what you can, with what you have." },
  { id: 17, tier: "5-10", text: "The secret of getting ahead is getting started." },
  { id: 18, tier: "5-10", text: "Success is not final, failure is not fatal." },
  { id: 19, tier: "5-10", text: "Keep your face always toward the sunshine." },
  { id: 20, tier: "5-10", text: "Great things never come from comfort zones." },

  // -------------------------------------------------------------
  // 10–15 Words (20 Sentences)
  // -------------------------------------------------------------
  { id: 21, tier: "10-15", text: "The old clock on the wall suddenly started ticking again." },
  { id: 22, tier: "10-15", text: "She opened the window and watched the rain fall outside." },
  { id: 23, tier: "10-15", text: "Learning something new becomes easier when practice becomes a daily habit." },
  { id: 24, tier: "10-15", text: "The computer finished processing the file after several minutes of waiting." },
  { id: 25, tier: "10-15", text: "A group of students gathered around the table to discuss their project." },
  { id: 26, tier: "10-15", text: "The road was quiet except for a few passing vehicles." },
  { id: 27, tier: "10-15", text: "He carefully checked every detail before submitting the final report." },
  { id: 28, tier: "10-15", text: "The colorful lights made the small room feel warm and welcoming." },
  { id: 29, tier: "10-15", text: "Sometimes the simplest solution is hidden behind a complicated problem." },
  { id: 30, tier: "10-15", text: "The notebook contained several useful ideas written during yesterday's meeting." },
  { id: 31, tier: "10-15", text: "The only way to do great work is to love what you do." },
  { id: 32, tier: "10-15", text: "You miss one hundred percent of the shots you don't take." },
  { id: 33, tier: "10-15", text: "If you can dream it, you can do it." },
  { id: 34, tier: "10-15", text: "Great things are done by a series of small things brought together." },
  { id: 35, tier: "10-15", text: "Don't watch the clock; do what it does. Keep going." },
  { id: 36, tier: "10-15", text: "Hardships often prepare ordinary people for an extraordinary destiny." },
  { id: 37, tier: "10-15", text: "It does not matter how slowly you go as long as you do not stop." },
  { id: 38, tier: "10-15", text: "The best way to predict the future is to create it." },
  { id: 39, tier: "10-15", text: "You have power over your mind, not outside events." },
  { id: 40, tier: "10-15", text: "Success usually comes to those who are too busy to be looking for it." },

  // -------------------------------------------------------------
  // 15–20 Words (20 Sentences)
  // -------------------------------------------------------------
  { id: 41, tier: "15-20", text: "The student opened the laptop, connected to the internet, and started working on the assignment." },
  { id: 42, tier: "15-20", text: "After completing the experiment, the team recorded their observations and discussed the results together." },
  { id: 43, tier: "15-20", text: "The city becomes surprisingly peaceful late at night when most people have already returned home." },
  { id: 44, tier: "15-20", text: "She organized all the files into separate folders so everything would be easier to find later." },
  { id: 45, tier: "15-20", text: "A good typing speed comes from accuracy first, followed by consistent practice and gradual improvement." },
  { id: 46, tier: "15-20", text: "The engineer carefully tested the circuit before connecting the final component to the power supply." },
  { id: 47, tier: "15-20", text: "Every small mistake during practice provides an opportunity to understand the process and improve." },
  { id: 48, tier: "15-20", text: "The weather changed suddenly, so everyone decided to finish the outdoor activity before evening." },
  { id: 49, tier: "15-20", text: "He wrote down the important instructions because remembering every detail without notes was difficult." },
  { id: 50, tier: "15-20", text: "The new system automatically stores the information and displays the results on the screen." },
  { id: 51, tier: "15-20", text: "Our greatest glory is not in never falling, but in rising every time we fall." },
  { id: 52, tier: "15-20", text: "Whether you think you can, or you think you can't - you're right." },
  { id: 53, tier: "15-20", text: "The journey of a thousand miles begins with one step." },
  { id: 54, tier: "15-20", text: "A person who never made a mistake never tried anything new." },
  { id: 55, tier: "15-20", text: "Success is walking from failure to failure with no loss of enthusiasm." },
  { id: 56, tier: "15-20", text: "You are never too old to set another goal or to dream a new dream." },
  { id: 57, tier: "15-20", text: "Start where you are. Use what you have. Do what you can." },
  { id: 58, tier: "15-20", text: "Opportunities don't happen. You create them." },
  { id: 59, tier: "15-20", text: "The harder I work, the luckier I get." },
  { id: 60, tier: "15-20", text: "There is no substitute for hard work." },
];

type ValidationState = "typing" | "perfect" | "minor_errors" | "major_errors";

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

  // Tier filter: "all" | "5-10" | "10-15" | "15-20"
  const [selectedTier, setSelectedTier] = useState<"all" | "5-10" | "10-15" | "15-20">("all");

  const getFilteredPool = useCallback(() => {
    if (selectedTier === "all") return ALL_BLIND_PHRASES;
    return ALL_BLIND_PHRASES.filter((p) => p.tier === selectedTier);
  }, [selectedTier]);

  // Pick random sentence on start
  const [currentPhraseObj, setCurrentPhraseObj] = useState<BlindPhraseItem>(() => {
    const pool = ALL_BLIND_PHRASES;
    const initialIndex = Math.floor(Math.random() * pool.length);
    return pool[initialIndex] || pool[0];
  });

  const [typedInput, setTypedInput] = useState<string>("");
  const [validationState, setValidationState] = useState<ValidationState>("typing");
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [errorIndices, setErrorIndices] = useState<Set<number>>(new Set());
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [speechMode, setSpeechMode] = useState<"words" | "spelling">("words");
  const [streak, setStreak] = useState<number>(0);
  const [totalCompleted, setTotalCompleted] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const currentPhrase = currentPhraseObj.text;

  // Helper to speak custom voice prompt
  const speakVoiceRemark = useCallback((text: string, onDone?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.0;
    utter.pitch = 1.05;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => {
      setIsSpeaking(false);
      onDone?.();
    };
    utter.onerror = () => {
      setIsSpeaking(false);
      onDone?.();
    };
    window.speechSynthesis.speak(utter);
  }, []);

  // Text-to-speech engine for current phrase
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

  // Pick next random sentence
  const nextRandomPhrase = useCallback(() => {
    const pool = getFilteredPool();
    // Filter out current so it always changes
    const otherPool = pool.filter((p) => p.id !== currentPhraseObj.id);
    const candidatePool = otherPool.length > 0 ? otherPool : pool;
    const randomIdx = Math.floor(Math.random() * candidatePool.length);
    setCurrentPhraseObj(candidatePool[randomIdx]);
  }, [getFilteredPool, currentPhraseObj]);

  // Reset and speak when phrase changes
  useEffect(() => {
    setTypedInput("");
    setValidationState("typing");
    setMistakesCount(0);
    setErrorIndices(new Set());
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
  }, [currentPhraseObj, speakCurrentPhrase]);

  const resetCurrentPhrase = useCallback(() => {
    setTypedInput("");
    setValidationState("typing");
    setMistakesCount(0);
    setErrorIndices(new Set());
    setShowHint(false);
    setStartTime(null);
    setEndTime(null);
    speakCurrentPhrase();
    inputRef.current?.focus();
  }, [speakCurrentPhrase]);

  // Keyboard shortcut listener for (Y / N) when minor error prompt is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (validationState === "minor_errors") {
        if (e.key.toLowerCase() === "y" || e.key === "Enter") {
          e.preventDefault();
          resetCurrentPhrase();
        } else if (e.key.toLowerCase() === "n" || e.key === "Escape") {
          e.preventDefault();
          nextRandomPhrase();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [validationState, resetCurrentPhrase, nextRandomPhrase]);

  // Check completion on input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validationState !== "typing") return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const val = e.target.value;
    setTypedInput(val);

    const targetLength = currentPhrase.length;

    // When all letters are filled:
    if (val.length >= targetLength) {
      const end = Date.now();
      setEndTime(end);

      const trimmedVal = val.slice(0, targetLength);
      const targetStr = currentPhrase;

      let errors = 0;
      const errorIdxSet = new Set<number>();

      for (let i = 0; i < targetLength; i++) {
        // Case-insensitive letter matching for natural typing
        if (trimmedVal[i].toLowerCase() !== targetStr[i].toLowerCase()) {
          errors++;
          errorIdxSet.add(i);
        }
      }

      setMistakesCount(errors);
      setErrorIndices(errorIdxSet);

      if (errors === 0) {
        // CASE 1: 0 ERRORS -> PERFECT MATCH
        setValidationState("perfect");
        setStreak((prev) => prev + 1);
        setTotalCompleted((prev) => prev + 1);
        soundEngine.playKeySound("Enter");
        speakVoiceRemark("Perfect match! Well done.");
      } else if (errors === 1 || errors === 2) {
        // CASE 2: 1 OR 2 ERRORS -> NOT PERFECT MATCH, ASK TO RETRY
        setValidationState("minor_errors");
        soundEngine.playKeySound("Backspace");
        speakVoiceRemark("Not a perfect match. Would you like to type again?");
      } else {
        // CASE 3: MORE THAN 3 ERRORS (>= 3) -> RESET AND TELL THE SAME LINE AGAIN
        setValidationState("major_errors");
        soundEngine.playKeySound("Backspace");
        speakVoiceRemark("More than two mistakes. Let's try that line again.", () => {
          setTimeout(() => {
            resetCurrentPhrase();
          }, 400);
        });
      }
    }
  };

  const handleVirtualKeyPress = () => {
    inputRef.current?.focus();
  };

  // Metrics calculation
  const targetChars = currentPhrase.split("");
  const typedChars = typedInput.split("");
  const durationSec = startTime && endTime ? Math.max(1, (endTime - startTime) / 1000) : 1;
  const wordCount = currentPhrase.split(" ").length;
  const wpm = Math.round((wordCount / durationSec) * 60);
  const correctCount = Math.max(0, targetChars.length - mistakesCount);
  const accuracy = Math.round((correctCount / targetChars.length) * 100);

  return (
    <div className="relative z-10 w-full max-w-5xl px-3 sm:px-6 py-2 flex flex-col items-center gap-3 animate-in fade-in duration-300">
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

        {/* Word Length Filter Pills */}
        <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold">
          {[
            { id: "all", label: "All Lengths (60)" },
            { id: "5-10", label: "5–10 Words" },
            { id: "10-15", label: "10–15 Words" },
            { id: "15-20", label: "15–20 Words" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTier(t.id as any);
                nextRandomPhrase();
              }}
              className={`px-2.5 py-0.5 rounded-lg transition-all cursor-pointer ${
                selectedTier === t.id
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
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
            <Sparkles className="w-4 h-4 text-orange-500" />
          </button>
        </div>
      </div>

      {/* Ultra-Compact Audio HUD Card */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`w-full px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-md flex flex-col gap-2.5 transition-all cursor-text ${
          validationState === "perfect"
            ? isDark
              ? "bg-emerald-950/40 border-emerald-500/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]"
              : "bg-emerald-50 border-emerald-300 text-slate-900"
            : validationState === "minor_errors"
            ? isDark
              ? "bg-amber-950/40 border-amber-500/50 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)]"
              : "bg-amber-50 border-amber-300 text-slate-900"
            : validationState === "major_errors"
            ? isDark
              ? "bg-rose-950/40 border-rose-500/50 text-white shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-shake"
              : "bg-rose-50 border-rose-300 text-slate-900 animate-shake"
            : isDark
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
              <span>
                {isSpeaking
                  ? "Speaking Audio..."
                  : validationState === "minor_errors"
                  ? "Not Perfect Match • Retype or Continue?"
                  : validationState === "major_errors"
                  ? "3+ Errors • Replaying line..."
                  : `Random Dictation #${currentPhraseObj.id} (${wordCount} words • ${currentPhraseObj.tier} tier)`}
              </span>
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
                nextRandomPhrase();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-[10px] font-bold transition-colors cursor-pointer"
              title="Pick another random phrase"
            >
              <Shuffle className="w-3 h-3" />
              <span>New Random</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* VIEW 1: ACTIVE BLINDFOLD TYPING PROGRESS                     */}
        {/* ============================================================ */}
        {validationState === "typing" && (
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
        )}

        {/* ============================================================ */}
        {/* VIEW 2: PERFECT MATCH (0 ERRORS)                             */}
        {/* ============================================================ */}
        {validationState === "perfect" && (
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
                100% Match
              </span>

              <button
                onClick={nextRandomPhrase}
                className="flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Next Random Phrase</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* VIEW 3: MINOR ERRORS (1 OR 2 ERRORS) -> RETRY PROMPT (YES/NO)*/}
        {/* ============================================================ */}
        {validationState === "minor_errors" && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col gap-2.5 pt-1 border-t border-amber-500/20"
          >
            {/* Diff View with mistakes in red */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <div
                  className={`px-3 py-1 rounded-xl font-mono text-xs font-bold border ${
                    isDark ? "bg-slate-950 border-amber-500/40" : "bg-amber-50 border-amber-300"
                  }`}
                >
                  {targetChars.map((char, idx) => {
                    const isError = errorIndices.has(idx);
                    return (
                      <span
                        key={idx}
                        className={isError ? "text-rose-500 underline font-black bg-rose-500/20 px-0.5 rounded" : "text-emerald-400"}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-500 px-2 py-0.5 rounded bg-amber-500/10">
                  {mistakesCount} {mistakesCount === 1 ? "mistake" : "mistakes"} ({accuracy}%)
                </span>
              </div>
            </div>

            {/* Would you like to type again? Yes / No Buttons */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <span className="font-bold text-amber-400">
                Not a perfect match. Would you like to type again?
              </span>

              <div className="flex items-center gap-2">
                {/* YES Button */}
                <button
                  onClick={resetCurrentPhrase}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-xs transition-all cursor-pointer"
                  title="Press 'Y' or click to re-type"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Yes (Retry)</span>
                  <span className="text-[10px] opacity-75 font-mono hidden sm:inline">[Y]</span>
                </button>

                {/* NO Button */}
                <button
                  onClick={nextRandomPhrase}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-black shadow-xs transition-all cursor-pointer"
                  title="Press 'N' or click to continue"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>No (Next)</span>
                  <span className="text-[10px] opacity-75 font-mono hidden sm:inline">[N]</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* VIEW 4: MAJOR ERRORS (3+ ERRORS) -> AUTO RESET ALERT         */}
        {/* ============================================================ */}
        {validationState === "major_errors" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-400 font-bold"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{mistakesCount} mistakes made. Resetting and telling the sentence again...</span>
            </div>
            <span className="text-[10px] font-mono animate-pulse">Listening...</span>
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
