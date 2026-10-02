"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KEYBOARD_THEMES, type KeyboardTheme } from "@/lib/themes";
import { 
  X, Palette, Check, Flame, BookOpen, 
  Home as HomeIcon, ChevronRight, ArrowLeft,
  Sparkles, Layers
} from "lucide-react";

interface ThemeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: KeyboardTheme;
  onSelectTheme: (theme: KeyboardTheme) => void;
  currentPage?: "home" | "start" | "academy" | "speedtest" | "fallingwords" | "soundmatrix" | "shortcuts";
  onNavigate?: (page: "home" | "start" | "academy" | "speedtest" | "fallingwords" | "soundmatrix" | "shortcuts") => void;
  colorZones?: boolean;
  onToggleColorZones?: () => void;
}

export function ThemeSidebar({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  currentPage = "home",
  onNavigate,
  colorZones = true,
  onToggleColorZones,
}: ThemeSidebarProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeView, setActiveView] = useState<"menu" | "themes">("menu");

  const categories = ["All", "Light", "Pastel", "Retro", "Dark"];

  const filteredThemes =
    activeCategory === "All"
      ? KEYBOARD_THEMES
      : KEYBOARD_THEMES.filter((t) => t.category === activeCategory);

  // Lock background page scroll when sidebar is open
  React.useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setActiveView("menu");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            onWheel={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 transition-opacity overscroll-contain"
          />

          {/* Left Sidebar Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            onWheel={(e) => {
              e.stopPropagation();
            }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-md bg-white text-slate-900 z-50 shadow-2xl border-r border-slate-200 flex flex-col overflow-hidden overscroll-contain touch-pan-y"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
              <div className="flex items-center gap-3">
                {activeView === "themes" ? (
                  <button
                    onClick={() => setActiveView("menu")}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs flex items-center gap-1 text-xs font-bold"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div className="p-2 rounded-xl bg-orange-100 text-orange-600 border border-orange-200 shadow-xs">
                    <Layers className="w-5 h-5" />
                  </div>
                )}

                <div>
                  <h2 className="text-base font-black tracking-tight text-slate-900">
                    {activeView === "themes" ? "Keyboard Theme Palette" : "Main Navigation"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {activeView === "themes"
                      ? "Select a color aesthetic for your 3D keyboard"
                      : "Explore modes, typing tests & design themes"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MAIN MENU VIEW */}
            {activeView === "menu" && (
              <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-4">
                {/* Navigation Items Section */}
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3 px-1">
                    Navigation Pages & Games
                  </span>
                  <div className="space-y-2.5">
                    {/* Home Button */}
                    <button
                      onClick={() => {
                        onNavigate?.("home");
                        handleClose();
                      }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                        currentPage === "home"
                          ? "bg-slate-900 text-white border-slate-900 shadow-md"
                          : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${currentPage === "home" ? "bg-slate-800 text-orange-400" : "bg-slate-100 text-slate-600"}`}>
                          <HomeIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm">3D Studio Home</div>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${currentPage === "home" ? "text-slate-400" : "text-slate-400"}`} />
                    </button>

                    {/* Dedicated "Let's Start (Arcade Hub)" Button */}
                    <button
                      onClick={() => {
                        onNavigate?.("start");
                        handleClose();
                      }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                        currentPage === "start"
                          ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white border-orange-600 shadow-lg ring-2 ring-orange-200"
                          : "bg-white border-slate-200 hover:bg-orange-50/50 hover:border-orange-300 text-slate-800 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${currentPage === "start" ? "bg-white/20 text-white" : "bg-orange-100 text-orange-600"}`}>
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm flex items-center gap-1.5">
                            Let's Start • Games Hub
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                              currentPage === "start" ? "bg-white/20 text-white" : "bg-orange-100 text-orange-700"
                            }`}>
                              5 Games
                            </span>
                          </div>
                          <div className={`text-xs ${currentPage === "start" ? "text-orange-100" : "text-slate-500"}`}>
                            Arcade game selector & training hub
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${currentPage === "start" ? "text-white" : "text-slate-400"}`} />
                    </button>

                    {/* Touch Typing Academy Direct Button */}
                    <button
                      onClick={() => {
                        onNavigate?.("academy");
                        handleClose();
                      }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                        currentPage === "academy"
                          ? "bg-orange-500 text-white border-orange-600 shadow-md"
                          : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${currentPage === "academy" ? "bg-orange-600 text-white" : "bg-orange-50 text-orange-600"}`}>
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm">Touch Typing Academy</div>
                          <div className={`text-xs ${currentPage === "academy" ? "text-orange-100" : "text-slate-500"}`}>
                            16 Levels • Left & Right Hand Specialist
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${currentPage === "academy" ? "text-white" : "text-slate-400"}`} />
                    </button>

                    {/* Speed Typing Arena Button */}
                    <button
                      onClick={() => {
                        onNavigate?.("speedtest");
                        handleClose();
                      }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                        currentPage === "speedtest"
                          ? "bg-rose-500 text-white border-rose-600 shadow-md"
                          : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${currentPage === "speedtest" ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-600"}`}>
                          <Flame className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm">Speed Typing Arena</div>
                          <div className={`text-xs ${currentPage === "speedtest" ? "text-rose-100" : "text-slate-500"}`}>
                            Real-time WPM, accuracy test & celebrations
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${currentPage === "speedtest" ? "text-white" : "text-slate-400"}`} />
                    </button>

                    {/* Falling Words Button */}
                    <button
                      onClick={() => {
                        onNavigate?.("fallingwords");
                        handleClose();
                      }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                        currentPage === "fallingwords"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                          : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${currentPage === "fallingwords" ? "bg-emerald-700 text-white" : "bg-emerald-50 text-emerald-600"}`}>
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm">Meteor Defense Arcade</div>
                          <div className={`text-xs ${currentPage === "fallingwords" ? "text-emerald-100" : "text-slate-500"}`}>
                            Fast-paced falling words survival
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${currentPage === "fallingwords" ? "text-white" : "text-slate-400"}`} />
                    </button>

                    {/* Sound Matrix Button */}
                    <button
                      onClick={() => {
                        onNavigate?.("soundmatrix");
                        handleClose();
                      }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                        currentPage === "soundmatrix"
                          ? "bg-purple-600 text-white border-purple-600 shadow-md"
                          : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${currentPage === "soundmatrix" ? "bg-purple-700 text-white" : "bg-purple-50 text-purple-600"}`}>
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-extrabold text-sm">Sound Matrix Echo</div>
                          <div className={`text-xs ${currentPage === "soundmatrix" ? "text-purple-100" : "text-slate-500"}`}>
                            Switch acoustics & Simon Says memory
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${currentPage === "soundmatrix" ? "text-white" : "text-slate-400"}`} />
                    </button>
                  </div>
                </div>

                {/* DEDICATED BUTTON LINKED TO KEYBOARD THEME PALETTE */}
                <div className="pt-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3 px-1">
                    Customization & Aesthetics
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => setActiveView("themes")}
                    className="w-full p-4 rounded-2xl border-2 border-orange-400/80 bg-gradient-to-br from-orange-50/70 via-amber-50/40 to-white text-left cursor-pointer shadow-sm hover:border-orange-500 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-orange-500 text-white shadow-xs group-hover:scale-105 transition-transform">
                          <Palette className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                            Keyboard Theme Palette
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                              8 Styles
                            </span>
                          </h3>
                          <p className="text-xs text-slate-600 font-medium">
                            Select a color aesthetic for your 3D keyboard
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform shrink-0 mt-1" />
                    </div>

                    {/* Active Theme Preview Strip */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-orange-100 text-xs">
                      <span className="text-slate-500 font-semibold">
                        Active: <strong className="text-slate-900">{currentTheme.name}</strong>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {currentTheme.previewColors.map((hex, idx) => (
                          <div
                            key={idx}
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>
            )}

            {/* THEMES PALETTE SUBVIEW */}
            {activeView === "themes" && (
              <>
                {/* Finger Color Zones Toggle Bar */}
                {onToggleColorZones && (
                  <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-3 h-3 rounded-full transition-colors ${colorZones ? "bg-orange-500 animate-pulse" : "bg-slate-300"}`} />
                      <div>
                        <div className="text-xs font-black text-slate-900">Finger Color Zones</div>
                        <div className="text-[10px] text-slate-500">Touch typing finger color highlights</div>
                      </div>
                    </div>

                    <button
                      onClick={onToggleColorZones}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 border ${
                        colorZones
                          ? "bg-orange-500 text-white border-orange-600 shadow-sm"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${colorZones ? "bg-white" : "bg-slate-400"}`} />
                      <span>{colorZones ? "Zones ON" : "Zones OFF"}</span>
                    </button>
                  </div>
                )}

                {/* Category Filter Pills */}
                <div className="px-5 pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-slate-100 bg-slate-50/50">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        activeCategory === cat
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Theme List */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-3.5">
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
              </>
            )}

            {/* Footer summary */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Active: {currentTheme.name}</span>
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ThemeSidebar;
