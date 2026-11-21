"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { IssueItem } from "@/types";
import { getUrgencyBadge, getStatusBadge, formatDateTime, formatTimeAgo } from "@/lib/utils";
import StatusTimeline from "@/components/StatusTimeline";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import InteractiveMap from "@/components/InteractiveMap";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ThumbsUp,
  Share2,
  CheckCircle2,
  User,
  Sliders,
  ExternalLink,
} from "lucide-react";

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [issue, setIssue] = useState<IssueItem | null>(null);
  const [nearbyIssues, setNearbyIssues] = useState<IssueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadIssue() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/issues/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setIssue(json.data);
          setNearbyIssues(json.nearby || []);
        } else {
          setIssue(null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) loadIssue();
  }, [id]);

  const handleUpvote = async () => {
    if (!issue) return;
    setIsUpvoting(true);
    try {
      const res = await fetch(`/api/issues/${id}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ citizenId: "Citizen User" }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setIssue((prev) => (prev ? { ...prev, upvotesCount: data.data.upvotesCount, impactScore: data.data.impactScore } : null));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-civic-teal-400 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
          Loading Complaint Telemetry...
        </span>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">Complaint Not Found</h2>
        <p className="text-xs text-slate-400 mt-2">
          No issue found with ID "{id}". Please check the ID or search the public list.
        </p>
        <Link
          href="/track"
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-civic-teal-500 text-slate-950 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Track Complaints
        </Link>
      </div>
    );
  }

  const urgency = getUrgencyBadge(issue.urgency);
  const status = getStatusBadge(issue.status);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back Navigation & Share */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href="/track"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Complaints</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Quick Admin Shortcut to update this specific ticket */}
          <Link
            href={`/admin?select=${issue.id}`}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-600/50 text-amber-300 hover:bg-amber-900/40 flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Manage in Control Room</span>
          </Link>

          <button
            onClick={handleCopyShare}
            className="text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-civic-teal-400" />
            <span>{copiedLink ? "Link Copied!" : "Share Issue"}</span>
          </button>
        </div>
      </div>

      {/* Main Issue Header Card */}
      <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-6 sm:p-8 shadow-2xl mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-bold text-civic-teal-300 bg-civic-teal-950 px-3 py-1 rounded-lg border border-civic-teal-700/60">
              {issue.id}
            </span>
            <span
              className={`text-xs font-semibold px-3 py-0.5 rounded-full border ${urgency.bg} ${urgency.text} ${urgency.border}`}
            >
              {issue.urgency} Priority
            </span>
            <span
              className={`text-xs font-semibold px-3 py-0.5 rounded-full border ${status.bg} ${status.text} ${status.border}`}
            >
              {status.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Upvote Button */}
            <button
              onClick={handleUpvote}
              disabled={isUpvoting}
              className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-civic-teal-400" />
              <span>Support Issue ({issue.upvotesCount})</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-display font-bold text-xl sm:text-2xl text-white leading-snug">
          {issue.title}
        </h1>

        {/* Location & Metadata Bar */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-civic-teal-400 shrink-0" />
            <strong className="text-slate-300">{issue.ward}</strong> &bull; {issue.address}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            Reported {formatDateTime(issue.createdAt)} ({formatTimeAgo(issue.createdAt)})
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            Reported by: <span className="text-slate-300">{issue.citizenName}</span>
          </span>
        </div>

        {/* Description */}
        <div className="mt-5 pt-5 border-t border-slate-800">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
            Citizen Statement
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {issue.description}
          </p>
        </div>
      </div>

      {/* Grid: Status Timeline (Left) & AI Triage Intelligence (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left Column: Animated Status Timeline & Proof of Resolution */}
        <div className="lg:col-span-7 space-y-6">
          {/* Resolution Proof Card (Before / After Slider) */}
          {issue.status === "RESOLVED" && issue.resolvedImageUrl && issue.imageUrl ? (
            <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-6 shadow-xl">
              <h3 className="font-display font-semibold text-sm text-white mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Verified Resolution Proof (Before & After)
                </span>
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Inspected On-Site
                </span>
              </h3>
              <BeforeAfterSlider
                beforeImage={issue.imageUrl}
                afterImage={issue.resolvedImageUrl}
              />
            </div>
          ) : issue.imageUrl ? (
            <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-6 shadow-xl">
              <h3 className="font-display font-semibold text-sm text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-civic-teal-400" />
                Original Incident Photo
              </h3>
              <div className="rounded-xl overflow-hidden max-h-72 border border-slate-800">
                <img
                  src={issue.imageUrl}
                  alt="Incident photo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : null}

          {/* Status Timeline */}
          <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-6 shadow-xl">
            <h3 className="font-display font-semibold text-base text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-civic-teal-400" />
              Live Resolution Timeline
            </h3>
            <StatusTimeline
              currentStatus={issue.status}
              audits={issue.statusAudits || []}
              createdAt={issue.createdAt}
              resolvedAt={issue.resolvedAt}
              assignedDepartment={issue.assignedDepartment}
            />
          </div>
        </div>

        {/* Right Column: AI Triage & Department Accountability */}
        <div className="lg:col-span-5 space-y-6">
          {/* Department Card */}
          <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-civic-teal-400 font-semibold flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                Assigned Authority
              </span>
              <span className="text-[10px] font-mono bg-slate-900 text-civic-teal-300 px-2 py-0.5 rounded border border-slate-800">
                {Math.round(issue.departmentConfidence * 100)}% Confidence
              </span>
            </div>

            <h3 className="font-semibold text-base text-white">
              {issue.assignedDepartment}
            </h3>

            {/* Department Reasoning (R4) */}
            <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-civic-teal-400 font-medium">Why this department? </strong>
              {issue.departmentReasoning}
            </div>

            {/* Suggested Field Action */}
            {issue.suggestedAction && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-civic-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-300">Action Order: </strong>
                  {issue.suggestedAction}
                </span>
              </div>
            )}
          </div>

          {/* SLA & Impact Metrics */}
          <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-6 shadow-xl space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Public Impact & SLA Metrics
            </h4>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Public Impact Score:</span>
                <span className="font-mono font-bold text-white">{issue.impactScore} / 100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    issue.impactScore >= 80
                      ? "bg-red-500"
                      : issue.impactScore >= 60
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${issue.impactScore}%` }}
                ></div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
              <div>
                <span className="text-slate-400 block text-[11px]">SLA Target Deadline</span>
                <span className="font-semibold text-slate-200">{formatDateTime(issue.slaDeadline)}</span>
              </div>
              {issue.isOverdue ? (
                <span className="text-[11px] font-bold text-red-400 bg-red-950 px-2 py-1 rounded border border-red-800 animate-pulse">
                  SLA OVERDUE
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-800">
                  Within SLA
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Triage Engine:</span>
              <span className="font-mono text-civic-teal-300">{issue.aiModelUsed}</span>
            </div>
            {issue.userOverridden && (
              <div className="text-[11px] text-amber-400 bg-amber-950/40 p-2 rounded border border-amber-900">
                Note: Classification modified by citizen prior to submission.
              </div>
            )}
          </div>

          {/* Incident Map Pin */}
          <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-4 shadow-xl">
            <span className="text-xs font-semibold text-slate-300 block mb-2">
              Incident Map Coordinate
            </span>
            <div className="h-56 w-full rounded-xl overflow-hidden">
              <InteractiveMap
                center={[issue.latitude, issue.longitude]}
                zoom={14}
                issues={[issue, ...nearbyIssues]}
                selectedIssueId={issue.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
