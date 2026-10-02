"use client";

import React, { useEffect, useRef } from "react";
import type { KeyboardTheme } from "@/lib/themes";

interface MotionBackgroundProps {
  theme: KeyboardTheme;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  color: string;
  pulseSpeed: number;
  pulseOffset: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface FloatingTechItem {
  id: number;
  x: number;
  y: number;
  symbol: string;
  size: number;
  rotation: number;
  rotSpeed: number;
  vx: number;
  vy: number;
  opacity: number;
}

// Convert hex to rgb
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace("#", "");
  if (clean.length === 3) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 249, g: 115, b: 22 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function MotionBackground({ theme }: MotionBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });
  const shockwavesRef = useRef<Shockwave[]>([]);

  const isDark = theme.isDark || theme.category === "Dark";

  // Derive vibrant dynamic palette from active theme preview colors
  const primaryColor = theme.previewColors[3] || "#ea580c"; // Accent
  const secondaryColor = theme.previewColors[2] || "#0891b2"; // Mod
  const tertiaryColor = theme.previewColors[1] || "#7c3aed"; // Base

  const primaryRgb = hexToRgb(primaryColor);
  const secondaryRgb = hexToRgb(secondaryColor);
  const tertiaryRgb = hexToRgb(tertiaryColor);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handlePointerDown = (e: MouseEvent) => {
      // Spawn ripple shockwave on click
      const shockAlpha = isDark ? 0.9 : 0.85;
      const colors = [
        `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${shockAlpha})`,
        `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, ${shockAlpha})`,
      ];
      shockwavesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: Math.min(width, height) * 0.45,
        alpha: shockAlpha,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
      if (shockwavesRef.current.length > 8) shockwavesRef.current.shift();
    };

    const handleKeyDown = () => {
      // Spawn subtle ripple near center / bottom when typing
      const shockAlpha = isDark ? 0.75 : 0.7;
      const colors = [
        `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${shockAlpha})`,
        `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, ${shockAlpha})`,
      ];
      const rx = width * 0.5 + (Math.random() - 0.5) * (width * 0.4);
      const ry = height * 0.6 + (Math.random() - 0.5) * (height * 0.2);
      shockwavesRef.current.push({
        x: rx,
        y: ry,
        radius: 5,
        maxRadius: 180 + Math.random() * 120,
        alpha: shockAlpha,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
      if (shockwavesRef.current.length > 8) shockwavesRef.current.shift();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    // Initialize Particles for interactive constellation (High contrast in light mode)
    const particleCount = isDark ? 65 : 60;
    const particles: Particle[] = [];
    const colorPalette = isDark
      ? [
          `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`,
          `rgb(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b})`,
          `rgb(${tertiaryRgb.r}, ${tertiaryRgb.g}, ${tertiaryRgb.b})`,
        ]
      : [
          // Saturated high-contrast tones for white backgrounds
          `rgb(${Math.max(0, primaryRgb.r - 20)}, ${Math.max(0, primaryRgb.g - 20)}, ${Math.max(0, primaryRgb.b - 20)})`,
          `rgb(${Math.max(0, secondaryRgb.r - 20)}, ${Math.max(0, secondaryRgb.g - 20)}, ${Math.max(0, secondaryRgb.b - 20)})`,
          `rgb(${Math.max(0, tertiaryRgb.r - 20)}, ${Math.max(0, tertiaryRgb.g - 20)}, ${Math.max(0, tertiaryRgb.b - 20)})`,
          `rgba(234, 88, 12, 0.9)`, // Radiant Amber-Orange
          `rgba(8, 145, 178, 0.9)`, // Deep Cyan
          `rgba(124, 58, 237, 0.9)`, // Vivid Violet
        ];

    for (let i = 0; i < particleCount; i++) {
      const col = colorPalette[i % colorPalette.length];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        size: isDark ? Math.random() * 2.8 + 1.4 : Math.random() * 3.5 + 2.0,
        baseAlpha: isDark ? Math.random() * 0.5 + 0.4 : Math.random() * 0.35 + 0.55,
        alpha: 0.7,
        color: col,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Floating Tech Glyphs (switch cross stems, brackets, mechanical runes)
    const techSymbols = ["+", "◇", "⬡", "::", "//", "⊞", "×", "•"];
    const techItems: FloatingTechItem[] = [];
    for (let i = 0; i < 16; i++) {
      techItems.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        symbol: techSymbols[i % techSymbols.length],
        size: isDark ? 14 + Math.random() * 16 : 16 + Math.random() * 18,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.2 - Math.random() * 0.3,
        opacity: isDark ? 0.15 + Math.random() * 0.18 : 0.22 + Math.random() * 0.2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Shockwaves / Typist Ripples
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.06 + 2.5;
        sw.alpha *= 0.94;

        if (sw.alpha < 0.01 || sw.radius >= sw.maxRadius) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color.replace(/[\d.]+\)$/, `${sw.alpha})`);
        ctx.lineWidth = isDark ? 2.5 * (sw.alpha + 0.2) : 3.5 * (sw.alpha + 0.3);
        if (isDark) {
          ctx.shadowColor = sw.color;
          ctx.shadowBlur = 15;
        }
        ctx.stroke();
        ctx.restore();
      }

      // 2. Draw Subtle Perspective Horizon Glow Lines
      const horizonY = height * 0.82;
      const gridSegments = 16;
      ctx.save();
      ctx.strokeStyle = isDark
        ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.08)`
        : `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.16)`;
      ctx.lineWidth = isDark ? 1 : 1.25;

      // Vertical perspective fan lines
      for (let i = 0; i <= gridSegments; i++) {
        const xBottom = (width / gridSegments) * i;
        ctx.beginPath();
        ctx.moveTo(width * 0.5, horizonY - 140);
        ctx.lineTo(xBottom, height);
        ctx.stroke();
      }

      // Horizontal ground lines with moving offset
      const gridSpeed = (time * 25) % 30;
      for (let y = horizonY - 100; y <= height; y += 28) {
        const animatedY = y + gridSpeed;
        if (animatedY <= height) {
          const depthProgress = Math.max(0, (animatedY - (horizonY - 100)) / (height - (horizonY - 100)));
          ctx.strokeStyle = isDark
            ? `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, ${depthProgress * 0.14})`
            : `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, ${depthProgress * 0.22})`;
          ctx.beginPath();
          ctx.moveTo(0, animatedY);
          ctx.lineTo(width, animatedY);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 3. Draw Floating Tech Glyphs
      ctx.save();
      ctx.font = "bold 16px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < techItems.length; i++) {
        const item = techItems[i];
        item.x += item.vx;
        item.y += item.vy;
        item.rotation += item.rotSpeed;

        if (item.y < -30) {
          item.y = height + 30;
          item.x = Math.random() * width;
        }
        if (item.x < -30) item.x = width + 30;
        if (item.x > width + 30) item.x = -30;

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);
        ctx.fillStyle = isDark
          ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${item.opacity})`
          : `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${item.opacity})`;
        ctx.font = `${item.size}px 'JetBrains Mono', monospace`;
        ctx.fillText(item.symbol, 0, 0);
        ctx.restore();
      }
      ctx.restore();

      // 4. Update & Connect Constellation Particles (Clear & Vibrant on Light/White theme)
      const maxConnectDist = isDark ? 130 : 125;
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce screen edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction (repel gently and brighten)
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const force = (160 - dist) / 160;
            p.x -= (dx / dist) * force * 3;
            p.y -= (dy / dist) * force * 3;
          }
        }

        // Pulse alpha
        p.alpha = p.baseAlpha + Math.sin(time * 2 + p.pulseOffset) * 0.15;

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const lineAlpha = (1 - dist / maxConnectDist) * (isDark ? 0.28 : 0.42);
            ctx.strokeStyle = isDark
              ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${lineAlpha})`
              : `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${lineAlpha})`;
            ctx.lineWidth = isDark ? 1 : 1.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw Particle Glow Dot
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.25, Math.min(1, p.alpha));
        if (isDark) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
          ctx.shadowBlur = 4;
        }
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(animId);
    };
  }, [theme, isDark, primaryColor, secondaryColor, tertiaryColor, primaryRgb, secondaryRgb, tertiaryRgb]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Deep Cybernetic Vignette Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(2,6,23,0.85)_100%)]"
            : "bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(241,245,249,0.75)_100%)]"
        }`}
      />

      {/* 2. Primary Morphing Aurora Plasma Mesh Blob 1 (Top Left / Orange-Cyan) */}
      <div
        className={`absolute -top-32 -left-32 w-[720px] h-[720px] rounded-full filter blur-[100px] animate-aurora-blob-1 transition-all duration-1000 ${
          isDark ? "opacity-60 mix-blend-screen" : "opacity-75 mix-blend-multiply"
        }`}
        style={{
          background: isDark
            ? `radial-gradient(circle, ${primaryColor}99 0%, ${secondaryColor}66 50%, transparent 75%)`
            : `radial-gradient(circle, ${primaryColor}77 0%, ${secondaryColor}55 50%, transparent 80%)`,
        }}
      />

      {/* 3. Primary Morphing Aurora Plasma Mesh Blob 2 (Top Right / Violet-Indigo) */}
      <div
        className={`absolute top-1/4 -right-32 w-[750px] h-[750px] rounded-full filter blur-[110px] animate-aurora-blob-2 transition-all duration-1000 ${
          isDark ? "opacity-55 mix-blend-screen" : "opacity-70 mix-blend-multiply"
        }`}
        style={{
          background: isDark
            ? `radial-gradient(circle, ${secondaryColor}88 0%, ${tertiaryColor}66 50%, transparent 75%)`
            : `radial-gradient(circle, ${secondaryColor}66 0%, ${tertiaryColor}55 50%, transparent 80%)`,
        }}
      />

      {/* 4. Primary Morphing Aurora Plasma Mesh Blob 3 (Bottom Left / Emerald-Rose) */}
      <div
        className={`absolute -bottom-40 -left-20 w-[800px] h-[800px] rounded-full filter blur-[120px] animate-aurora-blob-3 transition-all duration-1000 ${
          isDark ? "opacity-50 mix-blend-screen" : "opacity-65 mix-blend-multiply"
        }`}
        style={{
          background: isDark
            ? `radial-gradient(circle, ${tertiaryColor}77 0%, ${primaryColor}55 50%, transparent 75%)`
            : `radial-gradient(circle, ${tertiaryColor}66 0%, ${primaryColor}44 50%, transparent 80%)`,
        }}
      />

      {/* 5. Central Kinetic Ambient Breathing Core */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[600px] rounded-full filter blur-[130px] animate-ambient-pulse transition-all duration-1000 ${
          isDark ? "opacity-40 mix-blend-screen" : "opacity-55 mix-blend-multiply"
        }`}
        style={{
          background: isDark
            ? `radial-gradient(ellipse at center, ${primaryColor}44 0%, ${secondaryColor}22 55%, transparent 75%)`
            : `radial-gradient(ellipse at center, ${primaryColor}66 0%, ${secondaryColor}44 55%, transparent 80%)`,
        }}
      />

      {/* 6. Subtle Cyber Scanline / Dot Matrix Grid Texture */}
      <div
        className={`absolute inset-0 ${isDark ? "opacity-[0.035] invert" : "opacity-[0.065]"}`}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* 7. Interactive Constellation Canvas & Shockwave Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}

// Backward compatibility alias
export { MotionBackground as GlowingSmokeBackground };
