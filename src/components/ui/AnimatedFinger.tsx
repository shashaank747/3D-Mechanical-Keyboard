"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ActiveFingerTap {
  id: string;
  keyId: string;
  x: number; // Center X coordinate relative to keyboard plate
  y: number; // Center Y coordinate relative to keyboard plate
  hand: "left" | "right";
  finger: "thumb" | "index" | "middle" | "ring" | "pinky";
  timestamp: number;
}

interface AnimatedFingerOverlayProps {
  activeTaps: ActiveFingerTap[];
}

export function AnimatedFingerOverlay({ activeTaps }: AnimatedFingerOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
      <AnimatePresence>
        {activeTaps.map((tap) => {
          const isLeft = tap.hand === "left";
          
          // Realistic finger geometries & angles
          let baseRotation = 0;
          let fingerWidth = 40;
          let fingerHeight = 80;
          let padWidth = 32;

          switch (tap.finger) {
            case "thumb":
              baseRotation = isLeft ? -24 : 24;
              fingerWidth = 46;
              fingerHeight = 68;
              padWidth = 38;
              break;
            case "index":
              baseRotation = isLeft ? 8 : -8;
              fingerWidth = 42;
              fingerHeight = 82;
              padWidth = 33;
              break;
            case "middle":
              baseRotation = isLeft ? 1 : -1;
              fingerWidth = 44;
              fingerHeight = 88;
              padWidth = 34;
              break;
            case "ring":
              baseRotation = isLeft ? -7 : 7;
              fingerWidth = 40;
              fingerHeight = 80;
              padWidth = 31;
              break;
            case "pinky":
              baseRotation = isLeft ? -16 : 16;
              fingerWidth = 35;
              fingerHeight = 70;
              padWidth = 27;
              break;
          }

          const halfWidth = fingerWidth / 2;

          return (
            <motion.div
              key={tap.id}
              initial={{
                opacity: 0,
                scale: 1.15,
                x: tap.x - halfWidth,
                y: tap.y + 35,
                rotate: baseRotation * 1.4,
              }}
              animate={{
                opacity: 1,
                scale: 1.0,
                x: tap.x - halfWidth,
                y: tap.y - 10,
                rotate: baseRotation,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: tap.y + 24,
                transition: { duration: 0.16, ease: "easeOut" },
              }}
              transition={{
                type: "spring",
                stiffness: 700,
                damping: 24,
              }}
              className="absolute pointer-events-none filter drop-shadow-[0_12px_22px_rgba(15,23,42,0.45)] select-none"
            >
              {/* Tactile Contact Impact Ring */}
              <motion.div
                initial={{ scale: 0.3, opacity: 0.9 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full border-2 border-orange-500 bg-orange-400/40 pointer-events-none"
              />

              {/* Inverted 3D Tactile Finger (Pointing UPWARDS onto key) */}
              <div
                className="relative flex flex-col items-center"
                style={{ width: `${fingerWidth}px`, height: `${fingerHeight}px` }}
              >
                {/* 1. Rounded Fingertip Pad (Top Contact Point on Key) */}
                <div
                  className="h-4 rounded-t-full bg-gradient-to-b from-[#ea580c] via-[#f97316] to-[#fb923c] shadow-[0_-2px_8px_rgba(234,88,12,0.7)] z-10"
                  style={{ width: `${padWidth}px` }}
                />

                {/* 2. Finger Body / Knuckles & Nail */}
                <div
                  className="w-full flex-1 -mt-1 rounded-b-2xl bg-gradient-to-b from-[#fb923c] via-[#fdba74] to-[#fed7aa] border-2 border-[#ea580c]/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-4px_6px_rgba(154,52,18,0.4)] flex flex-col items-center justify-start p-1"
                >
                  {/* Fingernail Highlight facing Upwards towards Key */}
                  <div className="w-3/5 h-4 rounded-b-full bg-gradient-to-b from-white/95 via-white/50 to-transparent border-b border-white/80 mt-0.5 shadow-sm" />

                  {/* Upper Knuckle Crease */}
                  <div className="w-4/5 h-[1.5px] bg-[#ea580c]/40 rounded-full mt-3" />
                  <div className="w-3/5 h-[1px] bg-[#ea580c]/30 rounded-full mt-0.5" />

                  {/* Lower Knuckle Crease */}
                  <div className="w-4/5 h-[1.5px] bg-[#ea580c]/35 rounded-full mt-2.5" />

                  {/* Base Palm Joint Shadow */}
                  <div className="w-5/6 h-2 rounded-full bg-gradient-to-b from-transparent to-[#ea580c]/25 mt-auto mb-0.5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
