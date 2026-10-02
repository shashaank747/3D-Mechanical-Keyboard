"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bgMusic } from "@/lib/bgMusic";
import { Music, Play, Pause, Volume2, VolumeX, Sparkles } from "lucide-react";

interface MusicPlayerProps {
  isDark: boolean;
}

export function MusicPlayer({ isDark }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(bgMusic.getIsPlaying());
  const [isMuted, setIsMuted] = useState<boolean>(bgMusic.getIsMuted());
  const [volume, setVolume] = useState<number>(bgMusic.getVolume());
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = bgMusic.subscribe(() => {
      setIsPlaying(bgMusic.getIsPlaying());
      setIsMuted(bgMusic.getIsMuted());
      setVolume(bgMusic.getVolume());
    });
    return () => unsubscribe();
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    bgMusic.togglePlay();
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    bgMusic.toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    bgMusic.setVolume(val);
  };

  return (
    <div className="relative flex items-center">
      {/* Pill Container */}
      <div
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full border backdrop-blur-md shadow-xs transition-all ${
          isPlaying
            ? isDark
              ? "bg-gradient-to-r from-orange-950/70 to-amber-950/70 border-orange-500/50 text-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
              : "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300 text-orange-900 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
            : isDark
            ? "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200"
            : "bg-white/80 border-slate-200 text-slate-600 hover:text-slate-900"
        }`}
      >
        {/* Play / Pause Trigger */}
        <button
          onClick={handleTogglePlay}
          className={`p-1 rounded-full transition-all cursor-pointer flex items-center justify-center ${
            isPlaying
              ? "bg-orange-500 text-white shadow-xs hover:scale-110"
              : isDark
              ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700"
          }`}
          title={isPlaying ? "Pause Chill BGM" : "Play 'Sunlight on the Desk'"}
        >
          {isPlaying ? <Pause className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
        </button>

        {/* Animated Soundwave Visualizer Bars */}
        <div className="flex items-end gap-0.5 h-3.5 px-0.5">
          {[
            { delay: 0, height: "h-3.5" },
            { delay: 0.15, height: "h-2" },
            { delay: 0.3, height: "h-3" },
            { delay: 0.45, height: "h-1.5" },
          ].map((bar, idx) => (
            <span
              key={idx}
              className={`w-0.5 rounded-full transition-all duration-300 ${
                isPlaying
                  ? "bg-orange-500 animate-pulse"
                  : isDark
                  ? "bg-slate-700 h-1"
                  : "bg-slate-300 h-1"
              } ${isPlaying ? bar.height : "h-1"}`}
              style={{
                animationDuration: isPlaying ? "0.8s" : undefined,
                animationDelay: isPlaying ? `${bar.delay}s` : undefined,
              }}
            />
          ))}
        </div>

        {/* Track Title */}
        <div
          onClick={handleTogglePlay}
          className="flex items-center gap-1 cursor-pointer select-none"
          title="Sunlight on the Desk (3:00 Chill Vibe Track)"
        >
          <span className="text-[11px] font-bold tracking-tight truncate max-w-[130px] sm:max-w-[160px]">
            Sunlight on the Desk
          </span>
          <span className="text-[9px] font-mono opacity-70 px-1 py-0.2 rounded bg-orange-500/10 text-orange-500 hidden sm:inline font-bold">
            BGM
          </span>
        </div>

        {/* Volume / Mute Button */}
        <div className="relative flex items-center">
          <button
            onClick={() => setShowVolumeSlider((prev) => !prev)}
            onDoubleClick={handleToggleMute}
            className="p-1 rounded-full text-slate-400 hover:text-orange-500 transition-colors cursor-pointer"
            title="Volume / Mute"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Popover Volume Slider */}
          <AnimatePresence>
            {showVolumeSlider && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className={`absolute bottom-full right-0 mb-2 p-2.5 rounded-2xl border shadow-xl backdrop-blur-xl flex flex-col items-center gap-2 z-50 ${
                  isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                }`}
              >
                <div className="flex items-center justify-between gap-3 w-28 text-[10px] font-mono font-bold">
                  <span>BGM Vol</span>
                  <span className="text-orange-500">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-28 accent-orange-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
