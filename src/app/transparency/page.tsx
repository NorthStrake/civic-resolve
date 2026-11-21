"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardAnalytics } from "@/types";
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  Award,
  BarChart3,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import InteractiveMap from "@/components/InteractiveMap";

export default function TransparencyPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        if (json.success) setAnalytics(json.data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (isLoading || !analytics) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-civic-teal-400 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
          Fetching City Municipal Transparency Metrics...
        </span>
      </div>
    );
  }

  const resolutionRate = Math.round((analytics.resolved / (analytics.total || 1)) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-civic-teal-400 uppercase tracking-wider mb-2 bg-civic-teal-950/80 px-3 py-1 rounded-full border border-civic-teal-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Open Civic Governance & Accountability</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
          Coimbatore Municipal Performance Scorecard
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Public real-time dashboard displaying resolution velocities, department service level compliance, and ward-level civic accountability.
        </p>
      </div>

      {/* Top Level Metric Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Overall Resolution Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">{resolutionRate}%</div>
          <p className="text-xs text-slate-400 mt-2">
            {analytics.resolved} of {analytics.total} total complaints resolved
          </p>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${resolutionRate}%` }}></div>
          </div>
        </div>

        <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Average Resolution SLA</span>
            <Clock className="w-4 h-4 text-civic-teal-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-civic-teal-300">
            {analytics.avgResolutionHours} Hours
          </div>
          <p className="text-xs text-slate-400 mt-2">
            City average turnaround from filing to verified resolution
          </p>
        </div>

        <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>SLA Target Compliance</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-300">
            {analytics.slaComplianceRate}%
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Tickets resolved strictly within stipulated charter deadlines
          </p>
        </div>

        <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>Active Citizen Grip</span>
            <TrendingUp className="w-4 h-4 text-civic-teal-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">42+ Reports</div>
          <p className="text-xs text-slate-400 mt-2">
            Across 14 municipal administrative zones
          </p>
        </div>
      </div>

      {/* Department-wise Performance Leaderboard (Requirement 6) */}
      <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-6 sm:p-8 shadow-2xl mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-civic-teal-400" />
              Department SLA & Resolution Leaderboard
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live service metrics categorized by civic operational wing
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">Updated hourly from audit logs</span>
        </div>

        <div className="space-y-4">
          {analytics.departmentBreakdown.map((dept, i) => (
            <div
              key={dept.department}
              className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-xs flex items-center justify-center font-mono">
                    #{i + 1}
                  </span>
                  <h3 className="font-semibold text-sm text-white">{dept.department}</h3>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                  <span>Open: <strong className="text-amber-400">{dept.open}</strong></span>
                  <span>Resolved: <strong className="text-emerald-400">{dept.resolved}</strong></span>
                  <span>Total: <strong className="text-slate-200">{dept.open + dept.resolved}</strong></span>
                </div>
              </div>

              {/* Compliance Progress Bar */}
              <div className="w-full md:w-64 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Resolution Rate</span>
                  <span className="font-mono font-bold text-civic-teal-300">{dept.compliance}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-civic-teal-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${dept.compliance}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ward Heatmap & Geographic Coverage */}
      <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-6 sm:p-8 shadow-2xl mb-8">
        <div className="mb-4">
          <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-civic-teal-400" />
            Civic Grievance Distribution Across Coimbatore Wards
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic dispersion of reported issues across residential and commercial corridors.
          </p>
        </div>

        <div className="h-80 w-full rounded-xl overflow-hidden border border-slate-800 mb-6">
          <InteractiveMap showHotspots={true} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {analytics.wardBreakdown.map((wb) => (
            <div
              key={wb.ward}
              className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center"
            >
              <span className="text-[10px] font-mono text-slate-400 block truncate" title={wb.ward}>
                {wb.ward.split("-")[1]?.trim() || wb.ward}
              </span>
              <span className="font-mono text-sm font-bold text-civic-teal-400">{wb.count} issues</span>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-6">
        <Link
          href="/report"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-civic-teal-500 hover:bg-civic-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-civic-teal-500/25 transition-all"
        >
          <span>Report an Issue in Your Ward</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
