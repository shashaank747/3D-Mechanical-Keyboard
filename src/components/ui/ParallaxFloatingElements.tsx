"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { soundEngine } from "@/lib/sound";

interface FloatingKeycapProps {
  id: string;
  label: string;
  sub?: string;
  xPercent: number;
  yPercent: number;
  depth: number;
  rotation: number;
  colorClass: string;
  size?: "sm" | "md" | "lg";
}

const FLOATING_KEYS: FloatingKeycapProps[] = [
  {
    id: "esc",
    label: "ESC",
    xPercent: 8,
    yPercent: 18,
    depth: 45,
    rotation: -14,
    colorClass: "bg-gradient-to-b from-orange-500 to-orange-600 text-white border-orange-400 shadow-orange-500/30",
    size: "md",
  },
  {
    id: "setu",
    label: "SETU",
    sub: "PRO",
    xPercent: 86,
    yPercent: 15,
    depth: 55,
    rotation: 16,
    colorClass: "bg-gradient-to-b from-cyan-500 to-blue-600 text-white border-cyan-300 shadow-cyan-500/30",
    size: "lg",
  },
  {
    id: "space",
    label: "SPACE",
    xPercent: 12,
    yPercent: 70,
    depth: 35,
    rotation: 8,
    colorClass: "bg-gradient-to-b from-slate-800 to-slate-900 text-slate-200 border-slate-700 shadow-slate-900/40",
    size: "lg",
  },
  {
    id: "ctrl",
    label: "CTRL",
    xPercent: 88,
    yPercent: 68,
    depth: 40,
    rotation: -12,
    colorClass: "bg-gradient-to-b from-purple-600 to-indigo-700 text-white border-purple-400 shadow-purple-600/30",
    size: "sm",
  },
  {
    id: "tab",
    label: "TAB",
    xPercent: 4,
    yPercent: 44,
    depth: 25,
    rotation: 10,
    colorClass: "bg-gradient-to-b from-emerald-500 to-teal-600 text-white border-emerald-400 shadow-emerald-500/30",
    size: "sm",
  },
  {
    id: "enter",
    label: "ENTER",
    xPercent: 92,
    yPercent: 42,
    depth: 50,
    rotation: -18,
    colorClass: "bg-gradient-to-b from-rose-500 to-pink-600 text-white border-rose-400 shadow-rose-500/30",
    size: "md",
  },
];

export function ParallaxFloatingElements() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 40, stiffness: 200 });
  const smoothY = useSpring(mouseY, { damping: 40, stiffness: 200 });

  const [tappedKey, setTappedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handleKeyClick = (item: FloatingKeycapProps) => {
    soundEngine.playKeySound(item.label);
    setTappedKey(item.id);
    setTimeout(() => {
      setTappedKey((prev) => (prev === item.id ? null : prev));
    }, 200);
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {FLOATING_KEYS.map((item, idx) => {
        const xOffset = useTransform(smoothX, (val) => val * item.depth);
        const yOffset = useTransform(smoothY, (val) => val * item.depth);

        let sizeStyles = "w-14 h-14 text-xs";
        if (item.size === "lg") sizeStyles = "w-20 h-16 text-sm";
        if (item.size === "sm") sizeStyles = "w-12 h-12 text-[10px]";

        const isTapped = tappedKey === item.id;

        return (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => handleKeyClick(item)}
            style={{
              left: `${item.xPercent}%`,
              top: `${item.yPercent}%`,
              x: xOffset,
              y: yOffset,
              rotate: item.rotation,
            }}
            initial={{ opacity: 0, scale: 0.6, y: 50 }}
            animate={{
              opacity: 0.9,
              scale: isTapped ? 0.92 : 1,
              y: isTapped ? 4 : 0,
            }}
            whileHover={{
              scale: 1.12,
              opacity: 1,
              filter: "brightness(1.1)",
              transition: { duration: 0.2 },
            }}
            whileTap={{
              scale: 0.88,
              y: 6,
            }}
            transition={{ duration: 0.8, delay: 0.1 * idx, ease: "easeOut" }}
            className={`absolute pointer-events-auto cursor-pointer flex flex-col items-center justify-center font-mono font-black rounded-2xl border-t-2 border-l border-r border-b-[6px] shadow-2xl backdrop-blur-md transition-all active:border-b-[2px] outline-none ${item.colorClass} ${sizeStyles}`}
            title={`Click ${item.label} key for tactile feedback`}
          >
            <span className="tracking-wider">{item.label}</span>
            {item.sub && <span className="text-[9px] opacity-75 font-sans font-bold">{item.sub}</span>}
            <span className="absolute inset-x-1.5 top-1 h-[1px] bg-white/40 rounded-full pointer-events-none" />

            {/* Click Ripple Glow */}
            {isTapped && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0.9 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-0 rounded-2xl border-2 border-white pointer-events-none"
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
