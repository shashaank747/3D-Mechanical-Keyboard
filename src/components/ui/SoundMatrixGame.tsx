"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, LAYOUT_65 } from "./keyboard";
import { type KeyboardTheme } from "@/lib/themes";
import { soundEngine } from "@/lib/sound";
import {
  Sparkles,
  Trophy,
  Volume2,
  RotateCcw,
  ArrowLeft,
  Play,
  Zap,
  CheckCircle2,
  Headphones,
} from "lucide-react";
import confetti from "canvas-confetti";

const POOL_KEY_CODES = ["KeyF", "KeyJ", "KeyD", "KeyK", "KeyS", "KeyL", "KeyA", "Semicolon", "Space"];

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

  const [gameState, setGameState] = useState<"idle" | "playback" | "userTurn" | "gameover">("idle");
  const [sequence, setSequence] = useState<string[]>([]);
  const [userStep, setUserStep] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [highScore, setHighScore] = useState<number>(0);
  const [activePlaybackKey, setActivePlaybackKey] = useState<string | null>(null);

  const startNewGame = () => {
    const firstKey = POOL_KEY_CODES[Math.floor(Math.random() * POOL_KEY_CODES.length)];
    const newSeq = [firstKey];
    setSequence(newSeq);
    setRound(1);
    setUserStep(0);
    setGameState("playback");
    playSequence(newSeq);
  };

  const playSequence = async (seq: string[]) => {
    setGameState("playback");
    setUserStep(0);

    for (let i = 0; i < seq.length; i++) {
      await new Promise((r) => setTimeout(r, 450));
      const code = seq[i];
      setActivePlaybackKey(code);
      soundEngine.playKeySound(code.replace("Key", ""));
      await new Promise((r) => setTimeout(r, 400));
      setActivePlaybackKey(null);
    }

    setGameState("userTurn");
  };

  const handleUserInput = (code: string) => {
    if (gameState !== "userTurn") return;

    const expectedCode = sequence[userStep];
    if (code === expectedCode) {
      // Correct step
      soundEngine.playKeySound(code.replace("Key", ""));
      const nextStep = userStep + 1;

      if (nextStep >= sequence.length) {
        // Round completed!
        const nextRound = round + 1;
        setRound(nextRound);
        if (nextRound > highScore) setHighScore(nextRound);

        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch {}

        // Add next key and playback
        const nextKey = POOL_KEY_CODES[Math.floor(Math.random() * POOL_KEY_CODES.length)];
        const nextSeq = [...sequence, nextKey];
        setSequence(nextSeq);
        setTimeout(() => playSequence(nextSeq), 800);
      } else {
        setUserStep(nextStep);
      }
    } else {
      // Failed sequence
      soundEngine.playKeySound("Backspace");
      setGameState("gameover");
    }
  };

  // Keyboard listener
  useEffect(() => {
    if (gameState !== "userTurn") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      handleUserInput(e.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, sequence, userStep]);

  return (
    <div className="relative z-10 w-full max-w-5xl px-3 sm:px-5 py-3 flex flex-col items-center justify-between gap-3 animate-in fade-in duration-300 select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToHub}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all shadow-2xs cursor-pointer ${
              isDark
                ? "bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Games Hub</span>
          </button>

          <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-2xs uppercase tracking-wider flex items-center gap-1">
            <Headphones className="w-3.5 h-3.5" />
            <span>Sound Matrix Echo</span>
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-lg border text-xs font-bold font-mono ${
            isDark ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-700"
          }`}>
            Round {round}
          </span>
          <span className="px-3 py-0.5 rounded-lg bg-purple-600 text-white font-mono text-xs font-black shadow-xs">
            Best: {highScore}
          </span>
        </div>
      </div>

      {/* STATUS BANNER */}
      <div
        className={`w-full p-4 rounded-2xl border shadow-xl flex items-center justify-between gap-4 transition-all ${
          isDark
            ? "bg-slate-900/95 border-slate-800 text-white"
            : "bg-white border-slate-200 text-slate-900 shadow-xs"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${
            gameState === "playback"
              ? "bg-amber-500/20 text-amber-400 animate-pulse"
              : gameState === "userTurn"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-purple-500/20 text-purple-400"
          }`}>
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-black tracking-tight">
              {gameState === "idle" && "Ready to Test Your Acoustic Memory?"}
              {gameState === "playback" && "Listen & Watch the Illumination Sequence..."}
              {gameState === "userTurn" && `Your Turn! Tap the keys (${userStep + 1}/${sequence.length})`}
              {gameState === "gameover" && "Acoustic Pattern Missed!"}
            </h4>
            <p className="text-xs text-slate-400">
              {gameState === "idle" && "Listen to the switch pitches and repeat the exact pattern on the 3D keyboard."}
              {gameState === "playback" && "Memorize the sequence of switch acoustics and glowing beacons."}
              {gameState === "userTurn" && "Repeat the sequence in the exact order."}
              {gameState === "gameover" && `You mastered ${round - 1} rounds in this session.`}
            </p>
          </div>
        </div>

        {gameState === "idle" && (
          <button
            onClick={startNewGame}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-500/25 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>START GAME</span>
          </button>
        )}

        {gameState === "gameover" && (
          <button
            onClick={startNewGame}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-500/25 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RETRY ECHO</span>
          </button>
        )}
      </div>

      {/* 3D MECHANICAL KEYBOARD ENGINE */}
      <div className="w-full flex flex-col items-center justify-center relative mt-0">
        <Keyboard
          className="mx-auto"
          theme={theme}
          colorZones={colorZones}
          allowMouseClick={gameState === "userTurn"}
          targetKeyCode={activePlaybackKey || (gameState === "userTurn" ? sequence[userStep] : undefined)}
          onKeyPress={(_, code) => handleUserInput(code)}
          onOpenThemeSidebar={onOpenThemeSidebar}
        />
      </div>
    </div>
  );
}
