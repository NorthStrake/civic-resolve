"use client";

import { useState, useRef, MouseEvent, TouchEvent } from "react";
import Image from "next/image";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Original Complaint (Before)",
  afterLabel = "Verified Resolution (After)",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-civic-cardBorder shadow-2xl bg-slate-950 select-none">
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] cursor-ew-resize overflow-hidden"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* "After" Image (Underneath, full view) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={afterImage}
            alt="After resolution"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-emerald-950/90 border border-emerald-500/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-emerald-300 flex items-center gap-1.5 shadow-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {afterLabel}
          </div>
        </div>

        {/* "Before" Image (Clipped by slider position) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeImage}
            alt="Before repair"
            className="absolute inset-0 w-full h-full object-cover max-w-none"
            style={{ width: containerRef.current ? containerRef.current.clientWidth : "100%" }}
          />
          <div className="absolute top-3 left-3 bg-red-950/90 border border-red-500/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-red-300 flex items-center gap-1.5 shadow-lg">
            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
            {beforeLabel}
          </div>
        </div>

        {/* Draggable Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs">
            ⇄
          </div>
        </div>
      </div>

      <div className="p-3 bg-civic-card/90 border-t border-civic-cardBorder flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>Drag slider left/right to compare field photos</span>
        <span className="text-civic-teal-400 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Tamper-Evident Resolution Proof
        </span>
      </div>
    </div>
  );
}
