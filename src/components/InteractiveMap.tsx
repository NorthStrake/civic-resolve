"use client";

import dynamic from "next/dynamic";
import React from "react";
import { IssueItem } from "@/types";

interface MapProps {
  issues?: IssueItem[];
  selectedIssueId?: string | null;
  onSelectIssue?: (issue: IssueItem) => void;
  center?: [number, number];
  zoom?: number;
  isPicker?: boolean;
  pickerPosition?: [number, number] | null;
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  showHotspots?: boolean;
  showRadiusCircle?: boolean;
  radiusMeters?: number;
}

const MapComponent = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] bg-civic-card flex items-center justify-center rounded-xl border border-civic-cardBorder">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-civic-teal-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-slate-400 tracking-wider uppercase font-mono">Initializing Spatial Map...</span>
      </div>
    </div>
  ),
});

export default function InteractiveMap(props: MapProps) {
  return <MapComponent {...props} />;
}
