import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

export function formatTimeAgo(date: string | Date | null | undefined): string {
  if (!date) return "just now";
  const d = new Date(date);
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);

  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function getUrgencyBadge(urgency: string): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (urgency) {
    case "Critical":
      return {
        bg: "bg-red-950/40",
        text: "text-red-400",
        border: "border-red-500/40",
        dot: "bg-red-500 animate-pulse",
      };
    case "High":
      return {
        bg: "bg-amber-950/40",
        text: "text-amber-400",
        border: "border-amber-500/40",
        dot: "bg-amber-500",
      };
    case "Medium":
      return {
        bg: "bg-yellow-950/30",
        text: "text-yellow-400",
        border: "border-yellow-500/30",
        dot: "bg-yellow-400",
      };
    case "Low":
    default:
      return {
        bg: "bg-emerald-950/30",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
        dot: "bg-emerald-400",
      };
  }
}

export function getStatusBadge(status: string): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  switch (status) {
    case "RESOLVED":
      return {
        bg: "bg-emerald-950/50",
        text: "text-emerald-300",
        border: "border-emerald-500/40",
        label: "Resolved",
      };
    case "IN_PROGRESS":
      return {
        bg: "bg-amber-950/50",
        text: "text-amber-300",
        border: "border-amber-500/40",
        label: "In Progress",
      };
    case "REJECTED":
      return {
        bg: "bg-zinc-900/60",
        text: "text-zinc-400",
        border: "border-zinc-700",
        label: "Rejected",
      };
    case "REPORTED":
    default:
      return {
        bg: "bg-red-950/50",
        text: "text-red-300",
        border: "border-red-500/40",
        label: "Reported",
      };
  }
}
