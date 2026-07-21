"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { cn } from "@/lib/utils";

interface WavyBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  waveYOffset?: number;
}

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth = 50,
  backgroundFill = "black",
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  waveYOffset = 250,
  ...props
}: WavyBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const noise = useMemo(() => createNoise3D(), []);

  const waveColors = useMemo(
    () => colors ?? ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"],
    [colors],
  );

  const speedValue = speed === "fast" ? 0.002 : 0.001;

  // No state or effect needed.
  const isSafari =
    typeof window !== "undefined" &&
    navigator.userAgent.includes("Safari") &&
    !navigator.userAgent.includes("Chrome");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    resize();

    const drawWave = (count: number) => {
      time += speedValue;

      for (let i = 0; i < count; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth;
        ctx.strokeStyle = waveColors[i % waveColors.length];

        for (let x = 0; x < width; x += 5) {
          const y = noise(x / 800, 0.3 * i, time) * 100;
          ctx.lineTo(x, y + waveYOffset);
        }

        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      ctx.fillStyle = backgroundFill;
      ctx.globalAlpha = waveOpacity;
      ctx.fillRect(0, 0, width, height);

      drawWave(5);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    blur,
    backgroundFill,
    waveOpacity,
    waveWidth,
    waveYOffset,
    waveColors,
    speedValue,
    noise,
  ]);

  return (
    <div
      className={cn(
        "flex h-screen flex-col items-center justify-center",
        containerClassName,
      )}
    >
      <canvas
        ref={canvasRef}
        id="canvas"
        className="absolute inset-0 z-0"
        style={isSafari ? { filter: `blur(${blur}px)` } : undefined}
      />
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};
