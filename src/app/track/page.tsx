"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IssueItem, IssueStatus, CivicCategory } from "@/types";
import { getUrgencyBadge, getStatusBadge, formatTimeAgo, formatDateTime } from "@/lib/utils";
import InteractiveMap from "@/components/InteractiveMap";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  ThumbsUp,
  Map as MapIcon,
  List,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export default function TrackPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"LIST" | "MAP">("LIST");

  const fetchIssues = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (categoryFilter !== "ALL") params.append("category", categoryFilter);
      if (searchId.trim()) params.append("search", searchId.trim());

      const res = await fetch(`/api/issues?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setIssues(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.toUpperCase().startsWith("CR-")) {
      router.push(`/track/${searchId.trim().toUpperCase()}`);
    } else {
      fetchIssues();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-civic-teal-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Citizen Public Grievance Tracking Portal</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Track Civic Complaints
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time status, department accountability, and SLA countdowns across Coimbatore city wards.
          </p>
        </div>

        {/* View Switcher (List vs Map) */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setViewMode("LIST")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === "LIST"
                ? "bg-civic-teal-500 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode("MAP")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === "MAP"
                ? "bg-civic-teal-500 text-slate-950 font-bold shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>City Map View</span>
          </button>
        </div>
      </div>

      {/* Instant Search by ID & Filter Bar */}
      <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-4 shadow-xl mb-8 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Issue ID (e.g. CR-2026-1001) or search keywords, ward, landmark..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-civic-teal-400 font-sans"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-civic-teal-500 hover:bg-civic-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-civic-teal-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Complaint</span>
          </button>
        </form>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-civic-teal-400" /> Filter:
          </span>

          {/* Status Buttons */}
          {["ALL", "REPORTED", "IN_PROGRESS", "RESOLVED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2.5 py-1 rounded-lg transition-all font-mono text-[11px] ${
                statusFilter === status
                  ? "bg-civic-teal-500/20 text-civic-teal-300 border border-civic-teal-500/50"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {status === "ALL" ? "All Statuses" : status.replace("_", " ")}
            </button>
          ))}

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 focus:outline-none ml-auto"
          >
            <option value="ALL">All Categories</option>
            <option value="Pothole/Road Damage">Potholes & Roads</option>
            <option value="Garbage/Sanitation">Garbage & Sanitation</option>
            <option value="Streetlight">Streetlights</option>
            <option value="Water Leakage/Supply">Water Leakage</option>
            <option value="Drainage/Sewage">Drainage & Sewage</option>
            <option value="Electricity">Electricity</option>
            <option value="Public Safety">Public Safety</option>
          </select>
        </div>
      </div>

      {/* MAP VIEW */}
      {viewMode === "MAP" && (
        <div className="h-[580px] w-full rounded-2xl overflow-hidden shadow-2xl border border-civic-cardBorder mb-8">
          <InteractiveMap issues={issues} showHotspots={true} />
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "LIST" && (
        <>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-civic-card border border-civic-cardBorder rounded-2xl p-5 h-64 animate-pulse flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                    <div className="h-5 bg-slate-800 rounded w-4/5"></div>
                    <div className="h-3 bg-slate-800 rounded w-2/3"></div>
                  </div>
                  <div className="h-8 bg-slate-800 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : issues.length === 0 ? (
            <div className="text-center py-16 bg-civic-card border border-civic-cardBorder rounded-2xl p-8">
              <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">No complaints found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No issues match your current search or filter criteria. Try resetting the filters or file a new complaint.
              </p>
              <Link
                href="/report"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-civic-teal-500 text-slate-950 font-bold text-xs"
              >
                File New Complaint
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {issues.map((issue) => {
                const urgency = getUrgencyBadge(issue.urgency);
                const status = getStatusBadge(issue.status);

                return (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-civic-card border border-civic-cardBorder hover:border-civic-teal-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
                  >
                    <div>
                      {/* Top Row: ID & Status Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-xs font-bold text-civic-teal-400 bg-civic-teal-950/80 px-2 py-0.5 rounded border border-civic-teal-800/60">
                          {issue.id}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${urgency.bg} ${urgency.text} ${urgency.border}`}
                          >
                            {issue.urgency}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.bg} ${status.text} ${status.border}`}
                          >
                            {status.label}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-sm text-white group-hover:text-civic-teal-300 transition-colors line-clamp-2 leading-snug">
                        {issue.title}
                      </h3>

                      {/* Location & Ward */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 line-clamp-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{issue.address}</span>
                      </div>

                      {/* Department */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-2 line-clamp-1">
                        <Building2 className="w-3.5 h-3.5 text-civic-teal-400 shrink-0" />
                        <span className="font-medium">{issue.assignedDepartment.split("(")[0]}</span>
                      </div>

                      {/* Description snippet */}
                      <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                        {issue.description}
                      </p>
                    </div>

                    {/* Bottom Metadata & Track Action */}
                    <div className="mt-4 pt-3 border-t border-civic-cardBorder/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(issue.createdAt)}</span>
                        {issue.upvotesCount > 1 && (
                          <span className="text-civic-teal-400 flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            {issue.upvotesCount}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/track/${issue.id}`}
                        className="font-semibold text-civic-teal-400 hover:text-civic-teal-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Details & Timeline</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
