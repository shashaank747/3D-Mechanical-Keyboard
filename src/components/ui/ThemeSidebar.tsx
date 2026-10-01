"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KEYBOARD_THEMES, type KeyboardTheme } from "@/lib/themes";
import { X, Palette, Check, Sparkles, SlidersHorizontal, Sun, Moon } from "lucide-react";

interface ThemeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: KeyboardTheme;
  onSelectTheme: (theme: KeyboardTheme) => void;
}

export function ThemeSidebar({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}: ThemeSidebarProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Light", "Pastel", "Retro", "Dark"];

  const filteredThemes =
    activeCategory === "All"
      ? KEYBOARD_THEMES
      : KEYBOARD_THEMES.filter((t) => t.category === activeCategory);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
          />

          {/* Sidebar Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white text-slate-900 z-50 shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-100 text-orange-600 border border-orange-200 shadow-xs">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black tracking-tight text-slate-900">
                    Keyboard Theme Palette
                  </h2>
                  <p className="text-xs text-slate-500">
                    Select a color aesthetic for your 3D keyboard
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                title="Close Sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="px-5 pt-4 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-100">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeCategory === cat
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Theme List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
              {filteredThemes.map((theme) => {
                const isSelected = currentTheme.id === theme.id;

                return (
                  <motion.div
                    key={theme.id}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => onSelectTheme(theme)}
                    className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                      isSelected
                        ? "border-orange-500 bg-orange-50/40 shadow-md ring-2 ring-orange-200"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-xs"
                    }`}
                  >
                    {/* Top Row: Theme Name + Badge + Check */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {theme.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {theme.category}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Tagline */}
                    <p className="text-xs text-slate-500 mb-3 line-clamp-1">
                      {theme.tagline}
                    </p>

                    {/* Palette Swatches & Mini Keycap Mockup */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      {/* Color dots swatch */}
                      <div className="flex items-center gap-1.5">
                        {theme.previewColors.map((hex, idx) => (
                          <div
                            key={idx}
                            className="w-4 h-4 rounded-full border border-slate-300/80 shadow-xs"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                      </div>

                      {/* Mini visual preview keycaps */}
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <span
                          className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-mono font-bold shadow-xs"
                          style={{
                            backgroundColor: theme.previewColors[1],
                            color: theme.previewColors[2],
                            border: `1px solid ${theme.previewColors[2]}`,
                          }}
                        >
                          A
                        </span>
                        <span
                          className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-mono font-bold shadow-xs text-white"
                          style={{
                            backgroundColor: theme.previewColors[3],
                          }}
                        >
                          ESC
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer summary */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Active: {currentTheme.name}</span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-sm"
              >
                Apply & Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ThemeSidebar;
