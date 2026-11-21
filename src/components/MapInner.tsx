"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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

function createCustomMarkerIcon(urgency: string, status: string, isSelected: boolean = false) {
  let color = "#10B981"; // green
  let glow = "rgba(16, 185, 129, 0.4)";
  if (urgency === "Critical") {
    color = "#EF4444";
    glow = "rgba(239, 68, 68, 0.6)";
  } else if (urgency === "High") {
    color = "#F97316";
    glow = "rgba(249, 115, 22, 0.5)";
  } else if (urgency === "Medium") {
    color = "#EAB308";
    glow = "rgba(234, 179, 8, 0.4)";
  }

  const pulseClass = status === "REPORTED" ? "animate-pulse" : "";
  const size = isSelected ? 38 : 30;

  const html = `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
      <div style="
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: ${glow};
        box-shadow: 0 0 16px ${color};
        opacity: ${status === "RESOLVED" ? 0.3 : 0.8};
      " class="${pulseClass}"></div>
      <div style="
        width: ${size - 8}px;
        height: ${size - 8}px;
        border-radius: 50%;
        background: #0E1526;
        border: 2px solid ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
      ">
        <div style="width: 8px; height: 8px; border-radius: 50%; background: ${color};"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "custom-map-pin",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createPickerIcon() {
  const html = `
    <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: rgba(20, 184, 166, 0.4); box-shadow: 0 0 20px #14B8A6;" class="animate-ping"></div>
      <div style="width: 26px; height: 26px; border-radius: 50%; background: #14B8A6; border: 3px solid #FFFFFF; display: flex; align-items: center; justify-content: center; z-index: 2;">
        <div style="width: 6px; height: 6px; border-radius: 50%; background: #0E1526;"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "picker-map-pin",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

export default function MapInner({
  issues = [],
  selectedIssueId,
  onSelectIssue,
  center = [11.0168, 76.9558],
  zoom = 13,
  isPicker = false,
  pickerPosition,
  onLocationSelect,
  showHotspots = false,
  showRadiusCircle = false,
  radiusMeters = 300,
}: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter = pickerPosition || center;

    const map = L.map(containerRef.current, {
      center: initialCenter,
      zoom: zoom,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Click handler for location picker
    if (isPicker && onLocationSelect) {
      map.on("click", (e: L.LeafletMouseEvent) => {
        const lat = +e.latlng.lat.toFixed(5);
        const lng = +e.latlng.lng.toFixed(5);
        let locality = "Coimbatore Municipal Ward";
        if (lat >= 11.025 && lng >= 77.0) locality = "Peelamedu, Ward 45";
        else if (lat >= 11.025 && lng < 76.95) locality = "Saibaba Colony, Ward 17";
        else if (lat >= 11.015 && lng >= 76.96) locality = "Gandhipuram, Ward 49";
        else if (lat < 11.015 && lng < 76.955) locality = "RS Puram, Ward 23";
        else if (lat < 11.0 && lng < 76.96) locality = "Ukkadam, Ward 78";
        else if (lat < 11.0 && lng >= 77.01) locality = "Singanallur, Ward 57";

        onLocationSelect(lat, lng, `${locality}, Coimbatore, Tamil Nadu`);
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers, Hotspots, and Selected Issue
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // Mode 1: Location Picker Marker
    if (isPicker && pickerPosition) {
      const pickerMarker = L.marker(pickerPosition, { icon: createPickerIcon() });
      pickerMarker.bindPopup(`
        <div style="padding: 6px; font-family: sans-serif; color: #0f172a;">
          <strong style="color: #0d9488; font-size: 13px;">Selected Report Location</strong>
          <div style="font-size: 11px; color: #475569; margin-top: 4px;">
            Lat: ${pickerPosition[0].toFixed(5)}, Lng: ${pickerPosition[1].toFixed(5)}
          </div>
        </div>
      `);
      pickerMarker.addTo(markersLayer);

      if (showRadiusCircle) {
        L.circle(pickerPosition, {
          radius: radiusMeters,
          color: "#14B8A6",
          fillColor: "#14B8A6",
          fillOpacity: 0.15,
          weight: 2,
          dashArray: "4, 6",
        }).addTo(markersLayer);
      }

      map.panTo(pickerPosition);
      return;
    }

    // Mode 2: Issues Markers
    issues.forEach((issue) => {
      const isSelected = selectedIssueId === issue.id;
      const icon = createCustomMarkerIcon(issue.urgency, issue.status, isSelected);

      const marker = L.marker([issue.latitude, issue.longitude], { icon });

      const popupHtml = `
        <div style="padding: 8px; font-family: sans-serif; color: #0f172a; max-width: 240px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="background: #e2e8f0; font-family: monospace; font-weight: bold; font-size: 10px; padding: 2px 6px; border-radius: 4px;">
              ${issue.id}
            </span>
            <span style="font-size: 10px; font-weight: bold; color: ${
              issue.urgency === "Critical" ? "#b91c1c" : issue.urgency === "High" ? "#c2410c" : "#047857"
            };">
              ${issue.urgency}
            </span>
          </div>
          <div style="font-weight: 600; font-size: 12px; line-height: 1.3; margin-bottom: 4px;">
            ${issue.title}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
            ${issue.address}
          </div>
          <div style="border-top: 1px solid #e2e8f0; padding-top: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
            <span style="color: #64748b;">${issue.assignedDepartment.split("(")[0]}</span>
            <a href="/track/${issue.id}" style="color: #0d9488; font-weight: bold; text-decoration: none;">Track &rarr;</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on("click", () => {
        if (onSelectIssue) onSelectIssue(issue);
      });

      marker.addTo(markersLayer);

      // Hotspot circle
      if (showHotspots && (issue.urgency === "Critical" || issue.urgency === "High")) {
        L.circle([issue.latitude, issue.longitude], {
          radius: 350,
          color: issue.urgency === "Critical" ? "#EF4444" : "#F97316",
          fillColor: issue.urgency === "Critical" ? "#EF4444" : "#F97316",
          fillOpacity: 0.16,
          weight: 1,
        }).addTo(markersLayer);
      }
    });

    if (selectedIssueId) {
      const match = issues.find((i) => i.id === selectedIssueId);
      if (match) {
        map.panTo([match.latitude, match.longitude]);
      }
    }
  }, [issues, selectedIssueId, pickerPosition, isPicker, showHotspots, showRadiusCircle]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-civic-cardBorder shadow-2xl">
      <div ref={containerRef} className="w-full h-full min-h-[420px] z-10" />

      {/* Floating Map Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-civic-dark/90 backdrop-blur-md px-3 py-2 rounded-lg border border-civic-cardBorder text-xs flex items-center gap-4 text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
          <span>Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Low</span>
        </div>
      </div>
    </div>
  );
}
