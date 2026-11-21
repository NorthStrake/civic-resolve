"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { IssueItem, DashboardAnalytics, IssueStatus, UrgencyLevel } from "@/types";
import {
  getUrgencyBadge,
  getStatusBadge,
  formatDateTime,
  formatTimeAgo,
} from "@/lib/utils";
import InteractiveMap from "@/components/InteractiveMap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Sliders,
  Sparkles,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Building2,
  MapPin,
  Filter,
  Search,
  RefreshCw,
  X,
  Send,
  Upload,
  AlertTriangle,
  ArrowUpDown,
  CheckSquare,
  Square,
  FileText,
  BarChart3,
  Layers,
  ShieldAlert,
} from "lucide-react";

const DEPARTMENTS = [
  "Roads & Highways Department (Highways & CCMC Wing)",
  "Solid Waste Management & Public Health Wing",
  "Electrical Engineering & Street Lighting Wing",
  "Coimbatore Municipal Water Supply & Sewerage Board (TWAD)",
  "Stormwater Drainage & Sewerage Operations",
  "Tamil Nadu Generation and Distribution Corporation (TANGEDCO)",
  "Public Safety & Municipal Rapid Response Cell",
  "General Civic Administration",
];

const PRESET_RESOLUTION_IMAGES = [
  { label: "Fresh Asphalt Road Patch", url: "https://images.unsplash.com/photo-1584463699042-4b2a8d32ca13?auto=format&fit=crop&w=800&q=80" },
  { label: "Cleared & Sanitized Street", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" },
  { label: "Repaired High-Pressure Valve", url: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80" },
  { label: "Installed LED Streetlight", url: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80" },
];

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const initialSelect = searchParams.get("select");

  // Telemetry & Issues State
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Sorting
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [urgencyFilter, setUrgencyFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("date_desc");

  // Selection & Detail Drawer
  const [selectedIssue, setSelectedIssue] = useState<IssueItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Update Drawer Form State
  const [updateStatus, setUpdateStatus] = useState<IssueStatus>("IN_PROGRESS");
  const [updateDept, setUpdateDept] = useState("");
  const [updateRemarks, setUpdateRemarks] = useState("");
  const [updateProofUrl, setUpdateProofUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Gemini Executive Digest State
  const [isGeneratingDigest, setIsGeneratingDigest] = useState(false);
  const [executiveDigest, setExecutiveDigest] = useState<{
    headline: string;
    criticalAlerts: string[];
    hotspotAreas: string[];
    recommendedExecutiveAction: string;
  } | null>(null);

  // Active View Tab: Table vs Map
  const [activeTab, setActiveTab] = useState<"TABLE" | "MAP" | "CHARTS">("TABLE");

  // Load Analytics & Issues
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [analyticsRes, issuesRes] = await Promise.all([
        fetch("/api/analytics"),
        fetch(`/api/issues?search=${encodeURIComponent(search)}&status=${statusFilter}&urgency=${urgencyFilter}&department=${deptFilter}&sortBy=${sortBy}`),
      ]);

      const analyticsJson = await analyticsRes.json();
      const issuesJson = await issuesRes.json();

      if (analyticsJson.success) setAnalytics(analyticsJson.data);
      if (issuesJson.success) {
        setIssues(issuesJson.data);
        if (initialSelect) {
          const match = issuesJson.data.find((i: IssueItem) => i.id === initialSelect);
          if (match) openDetailDrawer(match);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, urgencyFilter, deptFilter, sortBy]);

  // Open Drawer
  const openDetailDrawer = (issue: IssueItem) => {
    setSelectedIssue(issue);
    setUpdateStatus(issue.status);
    setUpdateDept(issue.assignedDepartment);
    setUpdateRemarks("");
    setUpdateProofUrl(issue.resolvedImageUrl || PRESET_RESOLUTION_IMAGES[0].url);
  };

  // Submit Drawer Status Update
  const handleUpdateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;
    setIsUpdating(true);

    try {
      const payload: any = {
        status: updateStatus,
        assignedDepartment: updateDept,
        officialRemarks: updateRemarks,
        changedBy: "Municipal Operations Desk (Admin)",
      };

      if (updateStatus === "RESOLVED") {
        payload.resolvedImageUrl = updateProofUrl;
      }

      const res = await fetch(`/api/issues/${selectedIssue.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setSelectedIssue(json.data);
        await loadData();
        alert(`Issue ${selectedIssue.id} updated successfully!`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to update issue.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Bulk Status Update Action
  const handleBulkStatus = async (newStatus: IssueStatus) => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to mark ${selectedIds.length} issues as ${newStatus}?`)) return;

    for (const id of selectedIds) {
      await fetch(`/api/issues/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          changedBy: "Bulk Command Action",
          officialRemarks: `Bulk triage operation executed by Commissioner's desk.`,
        }),
      });
    }

    setSelectedIds([]);
    await loadData();
  };

  // Trigger Gemini Admin Summary
  const handleGenerateSummary = async () => {
    setIsGeneratingDigest(true);
    try {
      const res = await fetch("/api/ai/admin-summary", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setExecutiveDigest(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingDigest(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === issues.length) setSelectedIds([]);
    else setSelectedIds(issues.map((i) => i.id));
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter((item) => item !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Control Room Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Municipal Command & Control Room &bull; Operations Desk</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white flex items-center gap-2.5">
            Civic Operations Dashboard
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700">
              Admin Clearance
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Coimbatore City Municipal Corporation &bull; Triage, Dispatch, SLA Tracking & Resolution Audit
          </p>
        </div>

        {/* AI Executive Summary Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateSummary}
            disabled={isGeneratingDigest}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-civic-teal-500 to-teal-600 hover:from-civic-teal-400 hover:to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-civic-teal-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{isGeneratingDigest ? "Analyzing Open Clusters..." : "Summarize Open Issues (AI)"}</span>
          </button>

          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Refresh Telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* GEMINI EXECUTIVE BRIEFING CARD */}
      <AnimatePresence>
        {executiveDigest && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel-glow rounded-2xl p-6 mb-8 border-civic-teal-500/40 relative overflow-hidden"
          >
            <button
              onClick={() => setExecutiveDigest(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-civic-teal-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Gemini Civic Intel Digest</span>
            </div>

            <h3 className="font-display font-bold text-lg text-white mb-3">
              {executiveDigest.headline}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                <span className="font-semibold text-amber-300 block mb-2">Critical Operations Alerts:</span>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                  {executiveDigest.criticalAlerts.map((alert, idx) => (
                    <li key={idx}>{alert}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div>
                  <span className="font-semibold text-slate-300">Cluster Density Hotspots: </span>
                  <span className="text-civic-teal-300 font-mono">
                    {executiveDigest.hotspotAreas.join(" &bull; ")}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-slate-300">Command Directive: </span>
                  <p className="text-slate-300 mt-1 italic">
                    "{executiveDigest.recommendedExecutiveAction}"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI STAT CARDS */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-4 shadow-lg">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Total Complaints</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">{analytics.total}</div>
            <span className="text-[10px] text-slate-500 font-mono">All city wards</span>
          </div>

          <div className="bg-civic-card border border-red-500/30 rounded-2xl p-4 shadow-lg">
            <span className="text-[11px] font-mono text-red-400 uppercase tracking-wider">Critical Open</span>
            <div className="text-2xl font-bold font-mono text-red-400 mt-1 flex items-center justify-between">
              <span>{analytics.criticalOpen}</span>
              <AlertOctagon className="w-5 h-5 text-red-500/60" />
            </div>
            <span className="text-[10px] text-red-400/80 font-mono">Needs immediate dispatch</span>
          </div>

          <div className="bg-civic-card border border-amber-500/30 rounded-2xl p-4 shadow-lg">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">In Progress</span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{analytics.inProgress}</div>
            <span className="text-[10px] text-slate-500 font-mono">Field teams active</span>
          </div>

          <div className="bg-civic-card border border-emerald-500/30 rounded-2xl p-4 shadow-lg">
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">Resolved</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 flex items-center justify-between">
              <span>{analytics.resolved}</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500/60" />
            </div>
            <span className="text-[10px] text-emerald-400/80 font-mono">With verified proof</span>
          </div>

          <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-4 shadow-lg">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Avg Resolution</span>
            <div className="text-2xl font-bold font-mono text-civic-teal-300 mt-1">
              {analytics.avgResolutionHours}h
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Target: &lt;36 hours</span>
          </div>

          <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-4 shadow-lg">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">SLA Compliance</span>
            <div className="text-2xl font-bold font-mono text-civic-teal-300 mt-1">
              {analytics.slaComplianceRate}%
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{analytics.overdueCount} tickets overdue</span>
          </div>
        </div>
      )}

      {/* VIEW TABS (Table, Map, Analytics Charts) */}
      <div className="flex items-center gap-2 border-b border-civic-cardBorder pb-4 mb-6 text-xs">
        <button
          onClick={() => setActiveTab("TABLE")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all ${
            activeTab === "TABLE"
              ? "bg-civic-teal-500 text-slate-950 shadow-md"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Operational Queue ({issues.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("MAP")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all ${
            activeTab === "MAP"
              ? "bg-civic-teal-500 text-slate-950 shadow-md"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>City Heatmap & Hotspots</span>
        </button>

        <button
          onClick={() => setActiveTab("CHARTS")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all ${
            activeTab === "CHARTS"
              ? "bg-civic-teal-500 text-slate-950 shadow-md"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics & Department SLA</span>
        </button>
      </div>

      {/* TAB 1: OPERATIONAL TABLE VIEW */}
      {activeTab === "TABLE" && (
        <div className="space-y-4">
          {/* Filters & Bulk Actions Toolbar */}
          <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search complaint ID, street, citizen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadData()}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-civic-teal-400"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="REPORTED">Reported</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>

              {/* Urgency Filter */}
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Urgencies</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {/* Department Filter */}
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none max-w-[180px] truncate"
              >
                <option value="ALL">All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept.split("(")[0].trim()}>
                    {dept.split("(")[0].trim()}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-300 focus:outline-none"
              >
                <option value="date_desc">Newest First</option>
                <option value="impact_desc">Highest Impact</option>
                <option value="sla_asc">SLA Urgency</option>
              </select>
            </div>
          </div>

          {/* Bulk Operations Bar */}
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-civic-teal-950/80 border border-civic-teal-500/40 p-3 rounded-xl flex items-center justify-between text-xs text-civic-teal-200"
            >
              <span className="font-semibold">
                {selectedIds.length} complaints selected for bulk operation:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkStatus("IN_PROGRESS")}
                  className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                >
                  Mark In Progress
                </button>
                <button
                  onClick={() => handleBulkStatus("RESOLVED")}
                  className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                >
                  Mark Resolved
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-slate-400 hover:text-white px-2 py-1"
                >
                  Clear Selection
                </button>
              </div>
            </motion.div>
          )}

          {/* Table Container */}
          <div className="bg-civic-card border border-civic-cardBorder rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 uppercase font-mono text-[11px]">
                  <tr>
                    <th className="p-3.5 w-10">
                      <button onClick={toggleSelectAll}>
                        {selectedIds.length === issues.length && issues.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-civic-teal-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    </th>
                    <th className="p-3.5">Issue ID & Category</th>
                    <th className="p-3.5">Title & Landmark</th>
                    <th className="p-3.5">Urgency & Impact</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Assigned Department</th>
                    <th className="p-3.5">SLA / Target</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {issues.map((issue) => {
                    const urgency = getUrgencyBadge(issue.urgency);
                    const status = getStatusBadge(issue.status);
                    const isSelected = selectedIds.includes(issue.id);

                    return (
                      <tr
                        key={issue.id}
                        onClick={() => openDetailDrawer(issue)}
                        className={`hover:bg-slate-900/60 cursor-pointer transition-colors ${
                          isSelected ? "bg-civic-teal-950/20" : ""
                        }`}
                      >
                        <td
                          className="p-3.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectRow(issue.id);
                          }}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-civic-teal-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-600" />
                          )}
                        </td>

                        <td className="p-3.5">
                          <span className="font-mono font-bold text-civic-teal-300 block">
                            {issue.id}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {issue.category}
                          </span>
                        </td>

                        <td className="p-3.5 max-w-xs">
                          <span className="font-semibold text-white block line-clamp-1">
                            {issue.title}
                          </span>
                          <span className="text-[11px] text-slate-400 line-clamp-1">
                            {issue.ward} &bull; {issue.address}
                          </span>
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${urgency.bg} ${urgency.text} ${urgency.border}`}
                          >
                            {issue.urgency} ({issue.impactScore}/100)
                          </span>
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.bg} ${status.text} ${status.border}`}
                          >
                            {status.label}
                          </span>
                        </td>

                        <td className="p-3.5 max-w-[180px] truncate text-slate-300">
                          {issue.assignedDepartment.split("(")[0]}
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          {issue.isOverdue ? (
                            <span className="text-[10px] font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800 animate-pulse">
                              OVERDUE
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono text-[11px]">
                              {issue.estimatedResolutionHours}h SLA
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetailDrawer(issue);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-civic-teal-300 font-medium border border-slate-700 hover:border-civic-teal-500/50 transition-colors"
                          >
                            Update & Proof
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE CITY MAP VIEW */}
      {activeTab === "MAP" && (
        <div className="h-[620px] w-full rounded-2xl overflow-hidden shadow-2xl border border-civic-cardBorder">
          <InteractiveMap
            issues={issues}
            showHotspots={true}
            onSelectIssue={(issue) => openDetailDrawer(issue)}
          />
        </div>
      )}

      {/* TAB 3: CHARTS & ANALYTICS */}
      {activeTab === "CHARTS" && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Breakdown Bar Chart */}
          <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-5 shadow-xl">
            <h3 className="font-semibold text-sm text-white mb-4">Complaints by Category</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.categoryBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="category" tick={{ fill: "#94A3B8", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0E1526", borderColor: "#1E293B", borderRadius: "8px" }}
                  />
                  <Bar dataKey="count" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Urgency Distribution Pie Chart */}
          <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-5 shadow-xl">
            <h3 className="font-semibold text-sm text-white mb-4">Urgency & Priority Share</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.priorityBreakdown}
                    dataKey="count"
                    nameKey="priority"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {analytics.priorityBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0E1526", borderColor: "#1E293B", borderRadius: "8px" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Trend Line Chart */}
          <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-5 shadow-xl md:col-span-2">
            <h3 className="font-semibold text-sm text-white mb-4">7-Day Civic Throughput (Reported vs Resolved)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.dailyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="date" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0E1526", borderColor: "#1E293B", borderRadius: "8px" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="reported" stroke="#EF4444" strokeWidth={2} name="Reported" />
                  <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} name="Resolved" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ISSUE DETAIL & ACTION SLIDE-OVER DRAWER */}
      <AnimatePresence>
        {selectedIssue && (
          <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex justify-end">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-xl bg-[#0B101D] border-l border-slate-800 h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-civic-teal-300 bg-civic-teal-950 px-2.5 py-0.5 rounded border border-civic-teal-700">
                      {selectedIssue.id}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {selectedIssue.category}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedIssue(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Issue Headline & Context */}
                <div className="my-4">
                  <h2 className="font-bold text-base text-white leading-snug">
                    {selectedIssue.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-civic-teal-400 shrink-0" />
                    {selectedIssue.ward} &bull; {selectedIssue.address}
                  </p>
                  <p className="text-xs text-slate-300 mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 leading-relaxed whitespace-pre-line">
                    {selectedIssue.description}
                  </p>
                </div>

                {/* Gemini Suggested Action */}
                {selectedIssue.suggestedAction && (
                  <div className="p-3 bg-civic-teal-950/40 border border-civic-teal-800/60 rounded-xl text-xs text-civic-teal-200 mb-5">
                    <span className="font-semibold flex items-center gap-1.5 text-civic-teal-300 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Gemini Suggested Operational Next Step:
                    </span>
                    {selectedIssue.suggestedAction}
                  </div>
                )}

                {/* Status Update Form */}
                <form onSubmit={handleUpdateIssue} className="space-y-4 pt-2 border-t border-slate-800">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                    Field Action & Status Transition
                  </h3>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Update Ticket Status
                    </label>
                    <select
                      value={updateStatus}
                      onChange={(e) => setUpdateStatus(e.target.value as IssueStatus)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-civic-teal-400"
                    >
                      <option value="REPORTED">Reported (Pending Triage)</option>
                      <option value="IN_PROGRESS">In Progress (Field Crews Dispatched)</option>
                      <option value="RESOLVED">Resolved (Work Completed & Verified)</option>
                      <option value="REJECTED">Rejected / Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Assigned Department / Wing
                    </label>
                    <select
                      value={updateDept}
                      onChange={(e) => setUpdateDept(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-civic-teal-400"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Official Remarks / Inspection Note
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Dispatched Ward 23 quick patch crew; work verified on site."
                      value={updateRemarks}
                      onChange={(e) => setUpdateRemarks(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-civic-teal-400"
                    />
                  </div>

                  {/* Resolution Proof Upload (Requirement 5) */}
                  {updateStatus === "RESOLVED" && (
                    <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl space-y-3">
                      <label className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        Resolution Proof Photo ("After" Image)
                      </label>

                      {/* Presets for Demo */}
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_RESOLUTION_IMAGES.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setUpdateProofUrl(preset.url)}
                            className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                              updateProofUrl === preset.url
                                ? "bg-emerald-500 text-slate-950 font-bold border-emerald-400"
                                : "bg-slate-900 text-slate-400 border-slate-800"
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      <input
                        type="url"
                        placeholder="Paste image URL or use preset above"
                        value={updateProofUrl}
                        onChange={(e) => setUpdateProofUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
                      />

                      {updateProofUrl && (
                        <div className="rounded-lg overflow-hidden h-28 border border-emerald-500/30">
                          <img
                            src={updateProofUrl}
                            alt="Resolution proof"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-civic-teal-500 to-teal-600 hover:from-civic-teal-400 hover:to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-civic-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isUpdating ? "Logging Audit & Updating..." : "Commit Status Change"}</span>
                  </button>
                </form>
              </div>

              {/* Bottom Quick Links */}
              <div className="pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                <Link
                  href={`/track/${selectedIssue.id}`}
                  target="_blank"
                  className="text-civic-teal-400 hover:text-civic-teal-300 flex items-center gap-1 font-semibold"
                >
                  View Public Citizen Page &rarr;
                </Link>
                <span>Audit trail logged</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Loading Operations Command Desk...
          </span>
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
