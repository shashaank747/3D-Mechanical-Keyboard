export interface KeyboardTheme {
  id: string;
  name: string;
  tagline: string;
  category: "Light" | "Retro" | "Dark" | "Pastel" | "Vibrant";
  isDark?: boolean;
  previewColors: [string, string, string, string]; // [Chassis, Base, Mod, Accent]
  appBg: string;
  appText: string;
  headerBorder: string;
  cardBg: string;
  cardBorder: string;
  chassis: string;
  plate: string;
  keyBase: string;
  keyMod: string;
  keyAccent: string;
  keyAccentBlue: string;
  keyActive: string;
  accentBadgeBg: string;
  accentBadgeText: string;
  iconBg: string;
  iconColor: string;
}

export const KEYBOARD_THEMES: KeyboardTheme[] = [
  {
    id: "studio-light",
    name: "Studio Light",
    tagline: "Crisp architectural white & slate with solar orange accents",
    category: "Light",
    isDark: false,
    previewColors: ["#ffffff", "#f1f5f9", "#cbd5e1", "#f97316"],
    appBg: "bg-[#f1f5f9]",
    appText: "text-[#0f172a]",
    headerBorder: "border-slate-200",
    cardBg: "bg-white/90",
    cardBorder: "border-slate-200",
    chassis:
      "bg-gradient-to-b from-[#ffffff] via-[#f8fafc] to-[#e2e8f0] border-[#cbd5e1] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.18),0_20px_0_0_#cbd5e1,0_26px_25px_rgba(15,23,42,0.15)]",
    plate: "bg-gradient-to-b from-[#e2e8f0] to-[#cbd5e1] shadow-[inset_0_5px_12px_rgba(15,23,42,0.22)]",
    keyBase:
      "bg-gradient-to-b from-[#ffffff] via-[#ffffff] to-[#f1f5f9] text-[#1e293b] border-[#cbd5e1] border-b-[5px] border-b-[#94a3b8] shadow-[0_4px_10px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]",
    keyMod:
      "bg-gradient-to-b from-[#f1f5f9] via-[#e2e8f0] to-[#cbd5e1] text-[#334155] border-[#94a3b8] border-b-[5px] border-b-[#64748b] shadow-[0_4px_10px_rgba(15,23,42,0.1)]",
    keyAccent:
      "bg-gradient-to-b from-[#f97316] via-[#ea580c] to-[#c2410c] text-white border-[#ea580c] border-b-[5px] border-b-[#9a3412] shadow-[0_4px_12px_rgba(234,88,12,0.3)]",
    keyAccentBlue:
      "bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#075985] text-white border-[#0369a1] border-b-[5px] border-b-[#0c4a6e] shadow-[0_4px_12px_rgba(2,132,199,0.3)]",
    keyActive:
      "!translate-y-1 !border-b-[1px] !shadow-[0_1px_3px_rgba(15,23,42,0.2),inset_0_2px_4px_rgba(0,0,0,0.15)]",
    accentBadgeBg: "bg-orange-100",
    accentBadgeText: "text-orange-700 border border-orange-200",
    iconBg: "bg-white",
    iconColor: "text-orange-600",
  },
  {
    id: "cyberpunk-neon",
    name: "Cyberpunk Neon",
    tagline: "Obsidian night chassis, electric magenta & laser cyan",
    category: "Dark",
    isDark: true,
    previewColors: ["#0f172a", "#1e293b", "#ec4899", "#06b6d4"],
    appBg: "bg-[#0b0f19]",
    appText: "text-slate-100",
    headerBorder: "border-slate-800",
    cardBg: "bg-slate-900/90",
    cardBorder: "border-slate-800",
    chassis:
      "bg-gradient-to-b from-[#1e1b4b] via-[#0f172a] to-[#020617] border-[#4338ca] shadow-[0_30px_60px_-15px_rgba(236,72,153,0.25),0_20px_0_0_#312e81,0_26px_25px_rgba(6,182,212,0.2)]",
    plate: "bg-gradient-to-b from-[#0f172a] to-[#020617] shadow-[inset_0_5px_12px_rgba(0,0,0,0.8)]",
    keyBase:
      "bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#020617] text-[#38bdf8] border-[#334155] border-b-[5px] border-b-[#1e293b] shadow-[0_4px_10px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]",
    keyMod:
      "bg-gradient-to-b from-[#312e81] via-[#1e1b4b] to-[#0f172a] text-[#f472b6] border-[#4338ca] border-b-[5px] border-b-[#1e1b4b] shadow-[0_4px_10px_rgba(0,0,0,0.5)]",
    keyAccent:
      "bg-gradient-to-b from-[#ec4899] via-[#db2777] to-[#9d174d] text-white border-[#db2777] border-b-[5px] border-b-[#831843] shadow-[0_4px_16px_rgba(236,72,153,0.5)]",
    keyAccentBlue:
      "bg-gradient-to-b from-[#06b6d4] via-[#0891b2] to-[#0e7490] text-white border-[#0891b2] border-b-[5px] border-b-[#155e75] shadow-[0_4px_16px_rgba(6,182,212,0.5)]",
    keyActive:
      "!translate-y-1 !border-b-[1px] !shadow-[0_1px_3px_rgba(236,72,153,0.4),inset_0_2px_4px_rgba(0,0,0,0.6)]",
    accentBadgeBg: "bg-fuchsia-950",
    accentBadgeText: "text-fuchsia-300 border border-fuchsia-800",
    iconBg: "bg-slate-900",
    iconColor: "text-cyan-400",
  },
  {
    id: "carbon-stealth",
    name: "Carbon Stealth Dark",
    tagline: "Matte graphite & industrial safety orange highlights",
    category: "Dark",
    isDark: true,
    previewColors: ["#1e293b", "#0f172a", "#334155", "#f97316"],
    appBg: "bg-[#0f172a]",
    appText: "text-slate-200",
    headerBorder: "border-slate-800",
    cardBg: "bg-slate-900/90",
    cardBorder: "border-slate-800",
    chassis:
      "bg-gradient-to-b from-[#334155] via-[#1e293b] to-[#0f172a] border-[#475569] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),0_20px_0_0_#334155,0_26px_25px_rgba(0,0,0,0.4)]",
    plate: "bg-gradient-to-b from-[#1e293b] to-[#0f172a] shadow-[inset_0_5px_12px_rgba(0,0,0,0.6)]",
    keyBase:
      "bg-gradient-to-b from-[#334155] via-[#1e293b] to-[#0f172a] text-slate-100 border-[#475569] border-b-[5px] border-b-[#0f172a] shadow-[0_4px_10px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",
    keyMod:
      "bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#020617] text-slate-300 border-[#334155] border-b-[5px] border-b-[#020617] shadow-[0_4px_10px_rgba(0,0,0,0.4)]",
    keyAccent:
      "bg-gradient-to-b from-[#f97316] via-[#ea580c] to-[#c2410c] text-white border-[#ea580c] border-b-[5px] border-b-[#7c2d12] shadow-[0_4px_14px_rgba(249,115,22,0.4)]",
    keyAccentBlue:
      "bg-gradient-to-b from-[#64748b] via-[#475569] to-[#334155] text-white border-[#475569] border-b-[5px] border-b-[#1e293b] shadow-[0_4px_10px_rgba(0,0,0,0.3)]",
    keyActive:
      "!translate-y-1 !border-b-[1px] !shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(0,0,0,0.4)]",
    accentBadgeBg: "bg-slate-800",
    accentBadgeText: "text-orange-400 border border-slate-700",
    iconBg: "bg-slate-800",
    iconColor: "text-orange-500",
  },
  {
    id: "retro-90s",
    name: "Retro Classic 90s",
    tagline: "Vintage IBM Model M beige & industrial concrete grey",
    category: "Retro",
    isDark: false,
    previewColors: ["#e5dfd3", "#fdfbf7", "#c4baa8", "#dc2626"],
    appBg: "bg-[#f4efe6]",
    appText: "text-[#292524]",
    headerBorder: "border-[#d6cdc0]",
    cardBg: "bg-[#fdfbf7]/95",
    cardBorder: "border-[#d6cdc0]",
    chassis:
      "bg-gradient-to-b from-[#ede8db] via-[#e2dbcd] to-[#cfc5b4] border-[#b8ab96] shadow-[0_30px_60px_-15px_rgba(41,37,36,0.2),0_20px_0_0_#b8ab96,0_26px_25px_rgba(41,37,36,0.18)]",
    plate: "bg-gradient-to-b from-[#cfc5b4] to-[#b8ab96] shadow-[inset_0_5px_12px_rgba(41,37,36,0.25)]",
    keyBase:
      "bg-gradient-to-b from-[#fdfbf7] via-[#f7f3eb] to-[#ece5d8] text-[#292524] border-[#d6cdc0] border-b-[5px] border-b-[#a89b87] shadow-[0_4px_10px_rgba(41,37,36,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]",
    keyMod:
      "bg-gradient-to-b from-[#e5dfd3] via-[#dcd4c4] to-[#c7bcaa] text-[#44403c] border-[#b8ab96] border-b-[5px] border-b-[#8c7f6b] shadow-[0_4px_10px_rgba(41,37,36,0.12)]",
    keyAccent:
      "bg-gradient-to-b from-[#ef4444] via-[#dc2626] to-[#b91c1c] text-white border-[#b91c1c] border-b-[5px] border-b-[#7f1d1d] shadow-[0_4px_12px_rgba(220,38,38,0.35)]",
    keyAccentBlue:
      "bg-gradient-to-b from-[#0d9488] via-[#0f766e] to-[#115e59] text-white border-[#0f766e] border-b-[5px] border-b-[#134e4a] shadow-[0_4px_12px_rgba(13,148,136,0.35)]",
    keyActive:
      "!translate-y-1 !border-b-[1px] !shadow-[0_1px_3px_rgba(41,37,36,0.25),inset_0_2px_4px_rgba(0,0,0,0.2)]",
    accentBadgeBg: "bg-amber-100",
    accentBadgeText: "text-amber-800 border border-amber-300",
    iconBg: "bg-[#fdfbf7]",
    iconColor: "text-red-600",
  },
  {
    id: "matcha-forest",
    name: "Matcha & Cream",
    tagline: "Earthy soothing sage, warm ivory cream & forest green",
    category: "Pastel",
    isDark: false,
    previewColors: ["#d1fae5", "#fffbeb", "#10b981", "#047857"],
    appBg: "bg-[#f0fdf4]",
    appText: "text-[#064e3b]",
    headerBorder: "border-[#a7f3d0]",
    cardBg: "bg-white/95",
    cardBorder: "border-[#a7f3d0]",
    chassis:
      "bg-gradient-to-b from-[#ecfdf5] via-[#d1fae5] to-[#a7f3d0] border-[#6ee7b7] shadow-[0_30px_60px_-15px_rgba(6,78,59,0.18),0_20px_0_0_#6ee7b7,0_26px_25px_rgba(6,78,59,0.15)]",
    plate: "bg-gradient-to-b from-[#a7f3d0] to-[#6ee7b7] shadow-[inset_0_5px_12px_rgba(6,78,59,0.2)]",
    keyBase:
      "bg-gradient-to-b from-[#fffbeb] via-[#fef3c7] to-[#fde68a] text-[#064e3b] border-[#fcd34d] border-b-[5px] border-b-[#d97706] shadow-[0_4px_10px_rgba(6,78,59,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]",
    keyMod:
      "bg-gradient-to-b from-[#34d399] via-[#10b981] to-[#059669] text-white border-[#059669] border-b-[5px] border-b-[#047857] shadow-[0_4px_10px_rgba(6,78,59,0.15)]",
    keyAccent:
      "bg-gradient-to-b from-[#f97316] via-[#ea580c] to-[#c2410c] text-white border-[#ea580c] border-b-[5px] border-b-[#9a3412] shadow-[0_4px_12px_rgba(234,88,12,0.3)]",
    keyAccentBlue:
      "bg-gradient-to-b from-[#047857] via-[#065f46] to-[#064e3b] text-white border-[#065f46] border-b-[5px] border-b-[#022c22] shadow-[0_4px_12px_rgba(4,120,87,0.35)]",
    keyActive:
      "!translate-y-1 !border-b-[1px] !shadow-[0_1px_3px_rgba(6,78,59,0.2),inset_0_2px_4px_rgba(0,0,0,0.15)]",
    accentBadgeBg: "bg-emerald-100",
    accentBadgeText: "text-emerald-800 border border-emerald-300",
    iconBg: "bg-white",
    iconColor: "text-emerald-600",
  },
  {
    id: "nordic-frost",
    name: "Nordic Polar Frost",
    tagline: "Glacial Arctic cyan, iced aluminum & deep ocean blue",
    category: "Light",
    isDark: false,
    previewColors: ["#e0f2fe", "#ffffff", "#38bdf8", "#0369a1"],
    appBg: "bg-[#f0f9ff]",
    appText: "text-[#0c4a6e]",
    headerBorder: "border-[#bae6fd]",
    cardBg: "bg-white/95",
    cardBorder: "border-[#bae6fd]",
    chassis:
      "bg-gradient-to-b from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd] border-[#7dd3fc] shadow-[0_30px_60px_-15px_rgba(12,74,110,0.2),0_20px_0_0_#7dd3fc,0_26px_25px_rgba(12,74,110,0.16)]",
    plate: "bg-gradient-to-b from-[#bae6fd] to-[#7dd3fc] shadow-[inset_0_5px_12px_rgba(12,74,110,0.22)]",
    keyBase:
      "bg-gradient-to-b from-[#ffffff] via-[#f8fafc] to-[#f0f9ff] text-[#0c4a6e] border-[#bae6fd] border-b-[5px] border-b-[#38bdf8] shadow-[0_4px_10px_rgba(12,74,110,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]",
    keyMod:
      "bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] text-white border-[#0284c7] border-b-[5px] border-b-[#075985] shadow-[0_4px_10px_rgba(12,74,110,0.15)]",
    keyAccent:
      "bg-gradient-to-b from-[#06b6d4] via-[#0891b2] to-[#0e7490] text-white border-[#0891b2] border-b-[5px] border-b-[#155e75] shadow-[0_4px_12px_rgba(6,182,212,0.35)]",
    keyAccentBlue:
      "bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#075985] text-white border-[#0369a1] border-b-[5px] border-b-[#0c4a6e] shadow-[0_4px_12px_rgba(2,132,199,0.35)]",
    keyActive:
      "!translate-y-1 !border-b-[1px] !shadow-[0_1px_3px_rgba(12,74,110,0.25),inset_0_2px_4px_rgba(0,0,0,0.15)]",
    accentBadgeBg: "bg-sky-100",
    accentBadgeText: "text-sky-800 border border-sky-300",
    iconBg: "bg-white",
    iconColor: "text-sky-600",
  },
  {
    id: "sakura-blossom",
    name: "Sakura Blossom",
    tagline: "Pastel cherry petals, porcelain white & gold accents",
    category: "Pastel",
    isDark: false,
    previewColors: ["#ffe4e6", "#fffafb", "#f43f5e", "#be123c"],
    appBg: "bg-[#fff1f2]",
    appText: "text-[#881337]",
    headerBorder: "border-[#fecdd3]",
    cardBg: "bg-white/95",
    cardBorder: "border-[#fecdd3]",
    chassis:
      "bg-gradient-to-b from-[#fff1f2] via-[#ffe4e6] to-[#fecdd3] border-[#fda4af] shadow-[0_30px_60px_-15px_rgba(136,19,55,0.18),0_20px_0_0_#fda4af,0_26px_25px_rgba(136,19,55,0.14)]",
    plate: "bg-gradient-to-b from-[#fecdd3] to-[#fda4af] shadow-[inset_0_5px_12px_rgba(136,19,55,0.2)]",
    keyBase:
      "bg-gradient-to-b from-[#ffffff] via-[#fff5f5] to-[#ffe4e6] text-[#881337] border-[#fecdd3] border-b-[5px] border-b-[#fb7185] shadow-[0_4px_10px_rgba(136,19,55,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]",
    keyMod:
      "bg-gradient-to-b from-[#fb7185] via-[#f43f5e] to-[#e11d48] text-white border-[#e11d48] border-b-[5px] border-b-[#9f1239] shadow-[0_4px_10px_rgba(136,19,55,0.15)]",
    keyAccent:
      "bg-gradient-to-b from-[#e11d48] via-[#be123c] to-[#9f1239] text-white border-[#be123c] border-b-[5px] border-b-[#881337] shadow-[0_4px_12px_rgba(190,18,60,0.35)]",
    keyAccentBlue:
      "bg-gradient-to-b from-[#fbbf24] via-[#f59e0b] to-[#d97706] text-white border-[#f59e0b] border-b-[5px] border-b-[#b45309] shadow-[0_4px_12px_rgba(245,158,11,0.35)]",
    keyActive:
      "!translate-y-1 !border-b-[1px] !shadow-[0_1px_3px_rgba(136,19,55,0.2),inset_0_2px_4px_rgba(0,0,0,0.15)]",
    accentBadgeBg: "bg-pink-100",
    accentBadgeText: "text-pink-800 border border-pink-300",
    iconBg: "bg-white",
    iconColor: "text-rose-600",
  },
  {
    id: "lavender-mist",
    name: "Lavender Mist",
    tagline: "Dreamy lilac chassis, clean milk alphas & royal purple",
    category: "Pastel",
    isDark: false,
    previewColors: ["#e9d5ff", "#ffffff", "#a855f7", "#7e22ce"],
    appBg: "bg-[#faf5ff]",
    appText: "text-[#581c87]",
    headerBorder: "border-[#e9d5ff]",
    cardBg: "bg-white/95",
    cardBorder: "border-[#e9d5ff]",
    chassis:
      "bg-gradient-to-b from-[#faf5ff] via-[#f3e8ff] to-[#e9d5ff] border-[#d8b4fe] shadow-[0_30px_60px_-15px_rgba(88,28,135,0.18),0_20px_0_0_#d8b4fe,0_26px_25px_rgba(88,28,135,0.14)]",
    plate: "bg-gradient-to-b from-[#e9d5ff] to-[#d8b4fe] shadow-[inset_0_5px_12px_rgba(88,28,135,0.2)]",
    keyBase:
      "bg-gradient-to-b from-[#ffffff] via-[#faf5ff] to-[#f3e8ff] text-[#581c87] border-[#e9d5ff] border-b-[5px] border-b-[#c084fc] shadow-[0_4px_10px_rgba(88,28,135,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]",
    keyMod:
      "bg-gradient-to-b from-[#c084fc] via-[#a855f7] to-[#9333ea] text-white border-[#9333ea] border-b-[5px] border-b-[#6b21a8] shadow-[0_4px_10px_rgba(88,28,135,0.15)]",
    keyAccent:
      "bg-gradient-to-b from-[#9333ea] via-[#7e22ce] to-[#6b21a8] text-white border-[#7e22ce] border-b-[5px] border-b-[#581c87] shadow-[0_4px_12px_rgba(126,34,206,0.35)]",
    keyAccentBlue:
      "bg-gradient-to-b from-[#818cf8] via-[#6366f1] to-[#4f46e5] text-white border-[#6366f1] border-b-[5px] border-b-[#3730a3] shadow-[0_4px_12px_rgba(99,102,241,0.35)]",
    keyActive:
      "!translate-y-1 !border-b-[1px] !shadow-[0_1px_3px_rgba(88,28,135,0.2),inset_0_2px_4px_rgba(0,0,0,0.15)]",
    accentBadgeBg: "bg-purple-100",
    accentBadgeText: "text-purple-800 border border-purple-300",
    iconBg: "bg-white",
    iconColor: "text-purple-600",
  },
];
