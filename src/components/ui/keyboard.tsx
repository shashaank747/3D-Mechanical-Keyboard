"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { soundEngine } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { AnimatedFingerOverlay, type ActiveFingerTap } from "./AnimatedFinger";
import { KEYBOARD_THEMES, type KeyboardTheme } from "@/lib/themes";

export interface KeyItem {
  id: string;
  label: string;
  subLabel?: string;
  code: string;
  unit: number;
  variant?: "normal" | "modifier" | "accent" | "space" | "function" | "accent-blue";
}

export interface KeyboardProps {
  className?: string;
  onKeyPress?: (key: string, code: string) => void;
  interactive?: boolean;
  allowMouseClick?: boolean;
  theme?: KeyboardTheme;
  colorZones?: boolean;
  onOpenThemeSidebar?: () => void;
  testedKeys?: Set<string>;
  onTestedKeysChange?: (tested: Set<string>) => void;
}

// Key to touch typing finger color mapping for color zones
const KEY_ZONE_COLORS: Record<string, string> = {
  // Left Pinky (Rose)
  Escape: "#ef446a", Backquote: "#ef446a", Digit1: "#ef446a", Tab: "#ef446a", KeyQ: "#ef446a",
  CapsLock: "#ef446a", KeyA: "#ef446a", ShiftLeft: "#ef446a", KeyZ: "#ef446a", ControlLeft: "#ef446a",

  // Left Ring (Orange)
  Digit2: "#f97316", KeyW: "#f97316", KeyS: "#f97316", KeyX: "#f97316", MetaLeft: "#f97316",

  // Left Middle (Amber)
  Digit3: "#eab308", KeyE: "#eab308", KeyD: "#eab308", KeyC: "#eab308", AltLeft: "#eab308",

  // Left Index (Emerald)
  Digit4: "#10b981", Digit5: "#10b981", KeyR: "#10b981", KeyT: "#10b981",
  KeyF: "#10b981", KeyG: "#10b981", KeyV: "#10b981", KeyB: "#10b981",

  // Space / Thumbs (Cyan)
  Space: "#06b6d4",

  // Right Index (Sky Blue)
  Digit6: "#3b82f6", Digit7: "#3b82f6", KeyY: "#3b82f6", KeyU: "#3b82f6",
  KeyH: "#3b82f6", KeyJ: "#3b82f6", KeyN: "#3b82f6", KeyM: "#3b82f6",

  // Right Middle (Purple)
  Digit8: "#8b5cf6", KeyI: "#8b5cf6", KeyK: "#8b5cf6", Comma: "#8b5cf6",

  // Right Ring (Fuchsia)
  Digit9: "#d946ef", KeyO: "#d946ef", KeyL: "#d946ef", Period: "#d946ef", AltRight: "#d946ef",

  // Right Pinky (Pink)
  Digit0: "#ec4899", Minus: "#ec4899", Equal: "#ec4899", Backspace: "#ec4899", KeyP: "#ec4899",
  BracketLeft: "#ec4899", BracketRight: "#ec4899", Backslash: "#ec4899", Semicolon: "#ec4899",
  Quote: "#ec4899", Enter: "#ec4899", Slash: "#ec4899", ShiftRight: "#ec4899", Delete: "#ec4899",
  PageUp: "#ec4899", PageDown: "#ec4899", End: "#ec4899", ArrowUp: "#ec4899",
  ArrowLeft: "#ec4899", ArrowDown: "#ec4899", ArrowRight: "#ec4899", Fn: "#ec4899", ControlRight: "#ec4899",
};

// Key to touch typing finger and hand mapping
const FINGER_MAPPING: Record<
  string,
  { hand: "left" | "right"; finger: "pinky" | "ring" | "middle" | "index" | "thumb" }
> = {
  // Left Pinky
  Escape: { hand: "left", finger: "pinky" },
  Backquote: { hand: "left", finger: "pinky" },
  Digit1: { hand: "left", finger: "pinky" },
  Tab: { hand: "left", finger: "pinky" },
  KeyQ: { hand: "left", finger: "pinky" },
  CapsLock: { hand: "left", finger: "pinky" },
  KeyA: { hand: "left", finger: "pinky" },
  ShiftLeft: { hand: "left", finger: "pinky" },
  KeyZ: { hand: "left", finger: "pinky" },
  ControlLeft: { hand: "left", finger: "pinky" },

  // Left Ring
  Digit2: { hand: "left", finger: "ring" },
  KeyW: { hand: "left", finger: "ring" },
  KeyS: { hand: "left", finger: "ring" },
  KeyX: { hand: "left", finger: "ring" },
  MetaLeft: { hand: "left", finger: "ring" },

  // Left Middle
  Digit3: { hand: "left", finger: "middle" },
  KeyE: { hand: "left", finger: "middle" },
  KeyD: { hand: "left", finger: "middle" },
  KeyC: { hand: "left", finger: "middle" },
  AltLeft: { hand: "left", finger: "middle" },

  // Left Index
  Digit4: { hand: "left", finger: "index" },
  Digit5: { hand: "left", finger: "index" },
  KeyR: { hand: "left", finger: "index" },
  KeyT: { hand: "left", finger: "index" },
  KeyF: { hand: "left", finger: "index" },
  KeyG: { hand: "left", finger: "index" },
  KeyV: { hand: "left", finger: "index" },
  KeyB: { hand: "left", finger: "index" },

  // Space (Thumbs)
  Space: { hand: "left", finger: "thumb" },

  // Right Index
  Digit6: { hand: "right", finger: "index" },
  Digit7: { hand: "right", finger: "index" },
  KeyY: { hand: "right", finger: "index" },
  KeyU: { hand: "right", finger: "index" },
  KeyH: { hand: "right", finger: "index" },
  KeyJ: { hand: "right", finger: "index" },
  KeyN: { hand: "right", finger: "index" },
  KeyM: { hand: "right", finger: "index" },

  // Right Middle
  Digit8: { hand: "right", finger: "middle" },
  KeyI: { hand: "right", finger: "middle" },
  KeyK: { hand: "right", finger: "middle" },
  Comma: { hand: "right", finger: "middle" },

  // Right Ring
  Digit9: { hand: "right", finger: "ring" },
  KeyO: { hand: "right", finger: "ring" },
  KeyL: { hand: "right", finger: "ring" },
  Period: { hand: "right", finger: "ring" },
  AltRight: { hand: "right", finger: "ring" },

  // Right Pinky
  Digit0: { hand: "right", finger: "pinky" },
  Minus: { hand: "right", finger: "pinky" },
  Equal: { hand: "right", finger: "pinky" },
  Backspace: { hand: "right", finger: "pinky" },
  KeyP: { hand: "right", finger: "pinky" },
  BracketLeft: { hand: "right", finger: "pinky" },
  BracketRight: { hand: "right", finger: "pinky" },
  Backslash: { hand: "right", finger: "pinky" },
  Semicolon: { hand: "right", finger: "pinky" },
  Quote: { hand: "right", finger: "pinky" },
  Enter: { hand: "right", finger: "pinky" },
  Slash: { hand: "right", finger: "pinky" },
  ShiftRight: { hand: "right", finger: "pinky" },
  Delete: { hand: "right", finger: "pinky" },
  PageUp: { hand: "right", finger: "pinky" },
  PageDown: { hand: "right", finger: "pinky" },
  End: { hand: "right", finger: "pinky" },
  ArrowUp: { hand: "right", finger: "pinky" },
  ArrowLeft: { hand: "right", finger: "pinky" },
  ArrowDown: { hand: "right", finger: "pinky" },
  ArrowRight: { hand: "right", finger: "pinky" },
  Fn: { hand: "right", finger: "pinky" },
  ControlRight: { hand: "right", finger: "pinky" },
};

// 65% Compact Layout - EXACTLY 16.0 units per row
const LAYOUT_65: KeyItem[][] = [
  // Row 1: 1.0 + 12*1.0 + 2.0 + 1.0 = 16.0 units
  [
    { id: "Escape", label: "ESC", code: "Escape", unit: 1.0, variant: "accent" },
    { id: "Digit1", label: "1", subLabel: "!", code: "Digit1", unit: 1.0 },
    { id: "Digit2", label: "2", subLabel: "@", code: "Digit2", unit: 1.0 },
    { id: "Digit3", label: "3", subLabel: "#", code: "Digit3", unit: 1.0 },
    { id: "Digit4", label: "4", subLabel: "$", code: "Digit4", unit: 1.0 },
    { id: "Digit5", label: "5", subLabel: "%", code: "Digit5", unit: 1.0 },
    { id: "Digit6", label: "6", subLabel: "^", code: "Digit6", unit: 1.0 },
    { id: "Digit7", label: "7", subLabel: "&", code: "Digit7", unit: 1.0 },
    { id: "Digit8", label: "8", subLabel: "*", code: "Digit8", unit: 1.0 },
    { id: "Digit9", label: "9", subLabel: "(", code: "Digit9", unit: 1.0 },
    { id: "Digit0", label: "0", subLabel: ")", code: "Digit0", unit: 1.0 },
    { id: "Minus", label: "-", subLabel: "_", code: "Minus", unit: 1.0 },
    { id: "Equal", label: "=", subLabel: "+", code: "Equal", unit: 1.0 },
    { id: "Backspace", label: "BACKSPACE", code: "Backspace", unit: 2.0, variant: "modifier" },
    { id: "Delete", label: "DEL", code: "Delete", unit: 1.0, variant: "modifier" },
  ],
  // Row 2: 1.5 + 12*1.0 + 1.5 + 1.0 = 16.0 units
  [
    { id: "Tab", label: "TAB", code: "Tab", unit: 1.5, variant: "modifier" },
    { id: "KeyQ", label: "Q", code: "KeyQ", unit: 1.0 },
    { id: "KeyW", label: "W", code: "KeyW", unit: 1.0 },
    { id: "KeyE", label: "E", code: "KeyE", unit: 1.0 },
    { id: "KeyR", label: "R", code: "KeyR", unit: 1.0 },
    { id: "KeyT", label: "T", code: "KeyT", unit: 1.0 },
    { id: "KeyY", label: "Y", code: "KeyY", unit: 1.0 },
    { id: "KeyU", label: "U", code: "KeyU", unit: 1.0 },
    { id: "KeyI", label: "I", code: "KeyI", unit: 1.0 },
    { id: "KeyO", label: "O", code: "KeyO", unit: 1.0 },
    { id: "KeyP", label: "P", code: "KeyP", unit: 1.0 },
    { id: "BracketLeft", label: "[", subLabel: "{", code: "BracketLeft", unit: 1.0 },
    { id: "BracketRight", label: "]", subLabel: "}", code: "BracketRight", unit: 1.0 },
    { id: "Backslash", label: "\\", subLabel: "|", code: "Backslash", unit: 1.5, variant: "modifier" },
    { id: "PageUp", label: "PGUP", code: "PageUp", unit: 1.0, variant: "modifier" },
  ],
  // Row 3: 1.75 + 11*1.0 + 2.25 + 1.0 = 16.0 units
  [
    { id: "CapsLock", label: "CAPS", code: "CapsLock", unit: 1.75, variant: "modifier" },
    { id: "KeyA", label: "A", code: "KeyA", unit: 1.0 },
    { id: "KeyS", label: "S", code: "KeyS", unit: 1.0 },
    { id: "KeyD", label: "D", code: "KeyD", unit: 1.0 },
    { id: "KeyF", label: "F", code: "KeyF", unit: 1.0 },
    { id: "KeyG", label: "G", code: "KeyG", unit: 1.0 },
    { id: "KeyH", label: "H", code: "KeyH", unit: 1.0 },
    { id: "KeyJ", label: "J", code: "KeyJ", unit: 1.0 },
    { id: "KeyK", label: "K", code: "KeyK", unit: 1.0 },
    { id: "KeyL", label: "L", code: "KeyL", unit: 1.0 },
    { id: "Semicolon", label: ";", subLabel: ":", code: "Semicolon", unit: 1.0 },
    { id: "Quote", label: "'", subLabel: '"', code: "Quote", unit: 1.0 },
    { id: "Enter", label: "ENTER", code: "Enter", unit: 2.25, variant: "accent" },
    { id: "PageDown", label: "PGDN", code: "PageDown", unit: 1.0, variant: "modifier" },
  ],
  // Row 4: 2.25 + 10*1.0 + 1.75 + 1.0 + 1.0 = 16.0 units
  [
    { id: "ShiftLeft", label: "SHIFT", code: "ShiftLeft", unit: 2.25, variant: "modifier" },
    { id: "KeyZ", label: "Z", code: "KeyZ", unit: 1.0 },
    { id: "KeyX", label: "X", code: "KeyX", unit: 1.0 },
    { id: "KeyC", label: "C", code: "KeyC", unit: 1.0 },
    { id: "KeyV", label: "V", code: "KeyV", unit: 1.0 },
    { id: "KeyB", label: "B", code: "KeyB", unit: 1.0 },
    { id: "KeyN", label: "N", code: "KeyN", unit: 1.0 },
    { id: "KeyM", label: "M", code: "KeyM", unit: 1.0 },
    { id: "Comma", label: ",", subLabel: "<", code: "Comma", unit: 1.0 },
    { id: "Period", label: ".", subLabel: ">", code: "Period", unit: 1.0 },
    { id: "Slash", label: "/", subLabel: "?", code: "Slash", unit: 1.0 },
    { id: "ShiftRight", label: "SHIFT", code: "ShiftRight", unit: 1.75, variant: "modifier" },
    { id: "ArrowUp", label: "▲", code: "ArrowUp", unit: 1.0, variant: "accent-blue" },
    { id: "End", label: "END", code: "End", unit: 1.0, variant: "modifier" },
  ],
  // Row 5: 1.25 + 1.25 + 1.25 + 6.25 + 1.0 + 1.0 + 1.0 + 1.0 + 1.0 + 1.0 = 16.0 units
  [
    { id: "ControlLeft", label: "CTRL", code: "ControlLeft", unit: 1.25, variant: "modifier" },
    { id: "MetaLeft", label: "WIN", code: "MetaLeft", unit: 1.25, variant: "modifier" },
    { id: "AltLeft", label: "ALT", code: "AltLeft", unit: 1.25, variant: "modifier" },
    { id: "Space", label: "SPACE", code: "Space", unit: 6.25, variant: "space" },
    { id: "AltRight", label: "ALT", code: "AltRight", unit: 1.0, variant: "modifier" },
    { id: "Fn", label: "FN", code: "Fn", unit: 1.0, variant: "modifier" },
    { id: "ControlRight", label: "CTRL", code: "ControlRight", unit: 1.0, variant: "modifier" },
    { id: "ArrowLeft", label: "◀", code: "ArrowLeft", unit: 1.0, variant: "accent-blue" },
    { id: "ArrowDown", label: "▼", code: "ArrowDown", unit: 1.0, variant: "accent-blue" },
    { id: "ArrowRight", label: "▶", code: "ArrowRight", unit: 1.0, variant: "accent-blue" },
  ],
];

export function Keyboard({
  className,
  onKeyPress,
  interactive = true,
  allowMouseClick = false,
  theme = KEYBOARD_THEMES[0],
  colorZones = true,
  onOpenThemeSidebar,
  testedKeys: externalTestedKeys,
  onTestedKeysChange,
}: KeyboardProps) {
  const plateRef = useRef<HTMLDivElement | null>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [internalTestedKeys, setInternalTestedKeys] = useState<Set<string>>(new Set());
  const [capsLock, setCapsLock] = useState<boolean>(false);
  const [activeFingers, setActiveFingers] = useState<ActiveFingerTap[]>([]);

  const isTestMode = externalTestedKeys !== undefined;
  const testedKeys = externalTestedKeys ?? internalTestedKeys;

  // Use refs to avoid stale closure in event callbacks
  const testedKeysRef = useRef(testedKeys);
  testedKeysRef.current = testedKeys;

  const onTestedKeysChangeRef = useRef(onTestedKeysChange);
  onTestedKeysChangeRef.current = onTestedKeysChange;

  const onKeyPressRef = useRef(onKeyPress);
  onKeyPressRef.current = onKeyPress;

  // Press a key (Physical or Virtual Click / Hold)
  const pressKey = useCallback(
    (code: string, label: string) => {
      // Play audio switch click
      soundEngine.playKeySound(label);

      // Add to pressed keys set
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.add(code);
        return next;
      });

      // Mark as tested permanently in Test Your Keyboard mode
      if (isTestMode && onTestedKeysChangeRef.current) {
        const current = testedKeysRef.current || new Set<string>();
        const next = new Set<string>(current);
        next.add(code);
        onTestedKeysChangeRef.current(next);
      }

      // Notify parent onKeyPress
      if (onKeyPressRef.current) {
        onKeyPressRef.current(label, code);
      }

      // Attach finger to key
      if (plateRef.current) {
        const keyElement = document.getElementById(`key-${code}`);
        if (keyElement) {
          const plateRect = plateRef.current.getBoundingClientRect();
          const keyRect = keyElement.getBoundingClientRect();
          const x = keyRect.left - plateRect.left + keyRect.width / 2;
          const y = keyRect.top - plateRect.top + keyRect.height / 2;

          const fingerInfo = FINGER_MAPPING[code] || { hand: "left", finger: "index" };

          const newTap: ActiveFingerTap = {
            id: code,
            keyId: code,
            x,
            y,
            hand: fingerInfo.hand,
            finger: fingerInfo.finger,
            timestamp: Date.now(),
          };

          setActiveFingers((prev) => {
            const filtered = prev.filter((f) => f.keyId !== code);
            return [...filtered, newTap];
          });
        }
      }
    },
    [isTestMode]
  );

  // Release a key (Physical keyup or mouse release)
  const releaseKey = useCallback((code: string, label?: string) => {
    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(code);
      return next;
    });

    // Remove the finger from the key so it lifts off
    setActiveFingers((prev) => prev.filter((f) => f.keyId !== code));

    if (label) {
      soundEngine.playKeySound(label, true);
    }
  }, []);

  // Global physical keyboard listener
  useEffect(() => {
    if (!interactive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent browser default page movement for navigation keys ONLY when in keyboard test mode
      if (isTestMode) {
        const navKeys = [
          "PageUp", "PageDown", "Home", "End",
          "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
          "Space", "Tab"
        ];
        if (navKeys.includes(e.code) || navKeys.includes(e.key)) {
          const activeTag = document.activeElement?.tagName?.toLowerCase();
          if (activeTag !== "input" && activeTag !== "textarea") {
            e.preventDefault();
          }
        }
      }

      if (e.code === "CapsLock") {
        setCapsLock(e.getModifierState("CapsLock"));
      }

      if (!e.repeat) {
        let label = e.key.toUpperCase();
        if (e.code === "Space") label = "SPACE";
        if (e.code === "Enter") label = "ENTER";
        if (e.code === "Backspace") label = "BACKSPACE";
        pressKey(e.code, label);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isTestMode) {
        const navKeys = [
          "PageUp", "PageDown", "Home", "End",
          "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
          "Space", "Tab"
        ];
        if (navKeys.includes(e.code) || navKeys.includes(e.key)) {
          const activeTag = document.activeElement?.tagName?.toLowerCase();
          if (activeTag !== "input" && activeTag !== "textarea") {
            e.preventDefault();
          }
        }
      }
      releaseKey(e.code, e.key);
    };

    const handleGlobalMouseUp = () => {
      setPressedKeys(new Set());
      setActiveFingers([]);
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp, { passive: false });
    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [interactive, isTestMode, pressKey, releaseKey]);

  const handleVirtualKeyDown = (key: KeyItem) => {
    if (key.code === "CapsLock") {
      setCapsLock((prev) => !prev);
    }
    pressKey(key.code, key.label);
  };

  const handleVirtualKeyUp = (key: KeyItem) => {
    releaseKey(key.code, key.label);
  };

  const getKeyClasses = (key: KeyItem, isPressed: boolean, isTested: boolean) => {
    let base = theme.keyBase;
    if (key.variant === "modifier") base = theme.keyMod;
    if (key.variant === "accent") base = theme.keyAccent;
    if (key.variant === "accent-blue") base = theme.keyAccentBlue;
    if (key.variant === "space") base = theme.keyBase;

    // When tested in Test Mode, the WHOLE key is permanently clicked, depressed into plate & illuminated in emerald green!
    const isPermanentlyClicked = isTestMode && isTested;
    const testedClasses = "!bg-gradient-to-b !from-emerald-400 !via-emerald-500 !to-emerald-600 !text-white !border-emerald-600 !border-b-[2px] !border-b-emerald-800 !translate-y-1 !shadow-[0_2px_14px_rgba(16,185,129,0.55),inset_0_2px_4px_rgba(0,0,0,0.3)] ring-2 ring-emerald-400/80";

    return cn(
      "relative flex flex-col items-center justify-center font-mono font-bold rounded-xl transition-all duration-100 select-none outline-none",
      allowMouseClick ? "cursor-pointer" : "cursor-default",
      "h-11 sm:h-13 md:h-14",
      isPermanentlyClicked ? testedClasses : base,
      isPressed && !isPermanentlyClicked && theme.keyActive,
      isPressed && isPermanentlyClicked && "!brightness-110 !translate-y-1.5",
      key.code === "CapsLock" && capsLock && "ring-2 ring-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]"
    );
  };

  return (
    <div className={cn("flex flex-col items-center w-full max-w-5xl mx-auto select-none", className)}>
      {/* 3D Keyboard Perspective Wrapper */}
      <div className="relative w-full transition-all duration-500 ease-out perspective-keyboard flex justify-center py-2 transform -rotate-x-2">
        {/* Physical 3D Keyboard CNC Chassis */}
        <div
          className={cn(
            "relative w-full p-4 sm:p-6 md:p-7 rounded-[32px] border transition-all duration-300 overflow-visible",
            theme.chassis
          )}
        >
          {/* Brass Inset Weight */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-slate-300/60 shadow-inner" />

          {/* Rubber Corner Mounts */}
          <div className="absolute top-3 left-4 w-2 h-2 rounded-full bg-slate-300/80 shadow-inner" />
          <div className="absolute top-3 right-4 w-2 h-2 rounded-full bg-slate-300/80 shadow-inner" />
          <div className="absolute bottom-3 left-4 w-2 h-2 rounded-full bg-slate-300/80 shadow-inner" />
          <div className="absolute bottom-3 right-4 w-2 h-2 rounded-full bg-slate-300/80 shadow-inner" />

          {/* Recessed Switch Plate */}
          <div
            ref={plateRef}
            className={cn(
              "relative w-full flex flex-col gap-2 sm:gap-2.5 p-3 sm:p-4 rounded-[24px] border border-slate-300/80 transition-all overflow-visible",
              theme.plate
            )}
          >
            {/* Live Key Tap Overlay */}
            <AnimatedFingerOverlay activeTaps={activeFingers} />

            {/* KEYCAPS GRID */}
            {LAYOUT_65.map((row, rowIdx) => (
              <div key={rowIdx} className="w-full flex items-center gap-1.5 sm:gap-2 justify-between z-10">
                {row.map((key) => {
                  const isPressed = pressedKeys.has(key.code);
                  const isTested = testedKeys.has(key.code);
                  const zoneColor = KEY_ZONE_COLORS[key.code];
                  const isDarkTheme = theme.isDark || theme.category === "Dark";

                  return (
                    <button
                      key={key.id}
                      id={`key-${key.id}`}
                      type="button"
                      style={{
                        flex: `${key.unit} 0 0%`,
                        borderTopColor:
                          !isTested && colorZones && !isDarkTheme ? zoneColor : undefined,
                        borderTopWidth:
                          !isTested && colorZones && !isDarkTheme ? "2.5px" : undefined,
                        boxShadow: isTested
                          ? `0 0 16px rgba(16,185,129,0.5), inset 0 2px 4px rgba(0,0,0,0.25)`
                          : colorZones && zoneColor && isDarkTheme
                          ? isPressed
                            ? `0 0 24px ${zoneColor}, 0 -2px 14px ${zoneColor}, inset 0 2px 6px ${zoneColor}, inset 0 0 8px ${zoneColor}`
                            : `0 0 10px ${zoneColor}55, 0 -2px 8px ${zoneColor}88, inset 0 2px 4px ${zoneColor}99`
                          : undefined,
                      }}
                      onMouseDown={
                        allowMouseClick
                          ? (e) => {
                              e.preventDefault();
                              handleVirtualKeyDown(key);
                            }
                          : undefined
                      }
                      onMouseUp={allowMouseClick ? () => handleVirtualKeyUp(key) : undefined}
                      onMouseLeave={allowMouseClick ? () => handleVirtualKeyUp(key) : undefined}
                      onTouchStart={
                        allowMouseClick
                          ? (e) => {
                              e.preventDefault();
                              handleVirtualKeyDown(key);
                            }
                          : undefined
                      }
                      onTouchEnd={allowMouseClick ? () => handleVirtualKeyUp(key) : undefined}
                      className={cn(
                        getKeyClasses(key, isPressed, isTested)
                      )}
                    >
                      {/* RGB Neon Top Rim Glow Bar (Only for Dark Themes when not tested) */}
                      {!isTested && colorZones && zoneColor && isDarkTheme && (
                        <span
                          className="absolute inset-x-1.5 top-0.5 h-[2px] rounded-full pointer-events-none transition-all duration-150"
                          style={{
                            backgroundColor: zoneColor,
                            boxShadow: isPressed
                              ? `0 0 12px ${zoneColor}, 0 0 20px ${zoneColor}, 0 2px 8px ${zoneColor}`
                              : `0 0 8px ${zoneColor}, 0 0 12px ${zoneColor}cc, 0 1px 4px ${zoneColor}`,
                          }}
                        />
                      )}

                      {/* Ambient Key Perimeter RGB Underglow (Only for Dark Themes when not tested) */}
                      {!isTested && colorZones && zoneColor && isDarkTheme && (
                        <span
                          className="absolute -inset-[1px] rounded-xl pointer-events-none transition-all duration-150 -z-10"
                          style={{
                            boxShadow: `0 0 10px ${zoneColor}44, 0 -2px 8px ${zoneColor}66`,
                          }}
                        />
                      )}

                      {/* Key Legend */}
                      {key.subLabel ? (
                        <div className="flex flex-col items-center justify-center leading-none py-0.5 pointer-events-none">
                          <span className={cn("text-[10px] sm:text-[11px] font-semibold", isTested ? "text-white/80" : "opacity-60")}>
                            {key.subLabel}
                          </span>
                          <span className="text-xs sm:text-sm font-extrabold mt-0.5">{key.label}</span>
                        </div>
                      ) : (
                        <span className="text-xs sm:text-sm font-extrabold tracking-tight pointer-events-none">
                          {key.label}
                        </span>
                      )}

                      {/* CapsLock Status LED */}
                      {key.code === "CapsLock" && (
                        <span
                          className={cn(
                            "absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full transition-colors",
                            capsLock ? "bg-orange-500 shadow-[0_0_6px_#f97316]" : "bg-slate-400/40"
                          )}
                        />
                      )}

                      {/* Top Bevel Highlight for 3D Keycap Realism */}
                      <span className="absolute inset-x-2 top-0.5 h-[1px] bg-white/40 rounded-full pointer-events-none" />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Keyboard;
