import React, { useEffect, useRef } from "react";
import type { KeyboardTheme } from "@/lib/themes";

interface GlowingSmokeBackgroundProps {
  theme: KeyboardTheme;
}

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  growth: number;
  opacity: number;
  maxOpacity: number;
  r: number;
  g: number;
  b: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
}

export function GlowingSmokeBackground({ theme }: GlowingSmokeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDark = theme.isDark ?? false;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const particles: SmokeParticle[] = [];
    const maxParticles = isDark ? 65 : 45;

    // Vibrant glowing color palettes
    const darkColors = [
      { r: 249, g: 115, b: 22 },  // Orange
      { r: 217, g: 70, b: 239 },  // Fuchsia
      { r: 6, g: 182, b: 212 },   // Cyan
      { r: 139, g: 92, b: 246 },  // Purple
      { r: 236, g: 72, b: 153 },  // Pink
    ];

    const lightColors = [
      { r: 251, g: 146, b: 60 },  // Amber/Orange
      { r: 56, g: 189, b: 248 },  // Sky blue
      { r: 168, g: 85, b: 247 },  // Purple
      { r: 244, g: 63, b: 94 },   // Rose
      { r: 52, g: 211, b: 153 },  // Emerald
    ];

    const palette = isDark ? darkColors : lightColors;

    const createParticle = (spawnRandomY = false): SmokeParticle => {
      const col = palette[Math.floor(Math.random() * palette.length)];
      const life = 0;
      const maxLife = 180 + Math.random() * 220;
      const x = Math.random() * width;
      const y = spawnRandomY ? Math.random() * height : height + Math.random() * 80;
      const size = 70 + Math.random() * 90;
      const maxOpacity = isDark ? 0.35 + Math.random() * 0.25 : 0.22 + Math.random() * 0.18;

      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(0.5 + Math.random() * 0.8),
        size,
        growth: 0.4 + Math.random() * 0.6,
        opacity: 0,
        maxOpacity,
        r: col.r,
        g: col.g,
        b: col.b,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.012,
        life,
        maxLife,
      };
    };

    // Pre-populate particles across screen
    for (let i = 0; i < maxParticles; i++) {
      const p = createParticle(true);
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Blend mode
      ctx.globalCompositeOperation = isDark ? "lighter" : "source-over";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life++;
        p.x += p.vx + Math.sin((p.life + i * 20) * 0.02) * 0.6;
        p.y += p.vy;
        p.size += p.growth;
        p.rotation += p.rotationSpeed;

        const progress = p.life / p.maxLife;
        // Smooth fade-in then fade-out curve
        if (progress < 0.2) {
          p.opacity = (progress / 0.2) * p.maxOpacity;
        } else {
          p.opacity = (1 - (progress - 0.2) / 0.8) * p.maxOpacity;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        radGrad.addColorStop(0, `rgba(${p.r}, ${p.g}, ${p.b}, ${p.opacity * 0.9})`);
        radGrad.addColorStop(0.3, `rgba(${p.r}, ${p.g}, ${p.b}, ${p.opacity * 0.6})`);
        radGrad.addColorStop(0.65, `rgba(${p.r}, ${p.g}, ${p.b}, ${p.opacity * 0.25})`);
        radGrad.addColorStop(1, `rgba(${p.r}, ${p.g}, ${p.b}, 0)`);

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Respawn when particle ends lifecycle or goes offscreen
        if (p.life >= p.maxLife || p.y < -p.size || p.x < -p.size || p.x > width + p.size) {
          particles[i] = createParticle(false);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, isDark]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Primary Ambient Glowing Smoke Nebula 1 */}
      <div
        className={`absolute -top-32 left-1/4 w-[750px] h-[750px] rounded-full filter blur-[110px] animate-smoke-drift-1 transition-all duration-700 pointer-events-none ${
          isDark ? "opacity-60" : "opacity-45"
        }`}
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(249,115,22,0.65) 0%, rgba(217,70,239,0.45) 45%, transparent 75%)"
            : "radial-gradient(circle, rgba(251,146,60,0.45) 0%, rgba(56,189,248,0.3) 50%, transparent 75%)",
        }}
      />

      {/* Primary Ambient Glowing Smoke Nebula 2 */}
      <div
        className={`absolute top-1/4 -right-28 w-[800px] h-[800px] rounded-full filter blur-[120px] animate-smoke-drift-2 transition-all duration-700 pointer-events-none ${
          isDark ? "opacity-55" : "opacity-40"
        }`}
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(6,182,212,0.6) 0%, rgba(139,92,246,0.45) 50%, transparent 75%)"
            : "radial-gradient(circle, rgba(14,165,233,0.4) 0%, rgba(168,85,247,0.25) 55%, transparent 75%)",
        }}
      />

      {/* Primary Ambient Glowing Smoke Nebula 3 */}
      <div
        className={`absolute -bottom-40 -left-28 w-[850px] h-[850px] rounded-full filter blur-[130px] animate-smoke-drift-3 transition-all duration-700 pointer-events-none ${
          isDark ? "opacity-60" : "opacity-35"
        }`}
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(168,85,247,0.55) 0%, rgba(236,72,153,0.45) 45%, transparent 75%)"
            : "radial-gradient(circle, rgba(244,63,94,0.35) 0%, rgba(251,146,60,0.25) 50%, transparent 75%)",
        }}
      />

      {/* Billowing Center Mist Vapor Cloud */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[600px] rounded-full filter blur-[140px] pointer-events-none transition-all duration-1000 ${
          isDark ? "opacity-45" : "opacity-35"
        }`}
        style={{
          background: isDark
            ? "radial-gradient(ellipse at center, rgba(59,130,246,0.4) 0%, rgba(147,51,234,0.3) 40%, transparent 70%)"
            : "radial-gradient(ellipse at center, rgba(253,186,116,0.45) 0%, rgba(186,230,253,0.35) 50%, transparent 75%)",
        }}
      />

      {/* Active Particle Smoke Flow Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
