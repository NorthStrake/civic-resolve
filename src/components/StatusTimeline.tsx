"use client";

import { motion } from "framer-motion";
import { StatusAuditRecord, IssueStatus } from "@/types";
import { formatDateTime, formatTimeAgo } from "@/lib/utils";
import { CheckCircle2, Clock, FileText, Send, User, ShieldAlert, Sparkles } from "lucide-react";

interface StatusTimelineProps {
  currentStatus: IssueStatus;
  audits?: StatusAuditRecord[];
  createdAt: string | Date;
  resolvedAt?: string | Date | null;
  assignedDepartment: string;
}

export default function StatusTimeline({
  currentStatus,
  audits = [],
  createdAt,
  resolvedAt,
  assignedDepartment,
}: StatusTimelineProps) {
  const steps = [
    {
      key: "REPORTED",
      title: "Issue Reported",
      desc: "Filed by citizen & analyzed by Gemini multimodal triage",
      date: createdAt,
      done: true,
      active: currentStatus === "REPORTED",
    },
    {
      key: "IN_PROGRESS",
      title: "Work Order Dispatched",
      desc: `Assigned to ${assignedDepartment.split("(")[0]} field crew`,
      date: audits.find((a) => a.newStatus === "IN_PROGRESS")?.timestamp || null,
      done: currentStatus === "IN_PROGRESS" || currentStatus === "RESOLVED",
      active: currentStatus === "IN_PROGRESS",
    },
    {
      key: "RESOLVED",
      title: "Inspected & Resolved",
      desc: "Repairs completed on-site with verified resolution proof",
      date: resolvedAt || audits.find((a) => a.newStatus === "RESOLVED")?.timestamp || null,
      done: currentStatus === "RESOLVED",
      active: currentStatus === "RESOLVED",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 3-Step Visual Progress Bar */}
      <div className="relative flex items-center justify-between pb-8 pt-2">
        {/* Track Line */}
        <div className="absolute left-6 right-6 top-6 h-1 bg-slate-800 -translate-y-1/2 z-0">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width:
                currentStatus === "RESOLVED"
                  ? "100%"
                  : currentStatus === "IN_PROGRESS"
                  ? "50%"
                  : "0%",
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500"
          ></motion.div>
        </div>

        {steps.map((step, idx) => (
          <div key={step.key} className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: step.done ? 1.05 : 1 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step.done
                  ? step.key === "RESOLVED"
                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/40"
                    : step.key === "IN_PROGRESS"
                    ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/40"
                    : "bg-red-500 text-white shadow-lg shadow-red-500/30"
                  : "bg-slate-800 text-slate-500 border border-slate-700"
              }`}
            >
              {step.done ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
            </motion.div>

            <span
              className={`mt-2.5 text-xs font-semibold text-center ${
                step.done ? "text-white" : "text-slate-500"
              }`}
            >
              {step.title}
            </span>
            {step.date && (
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                {formatTimeAgo(step.date)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Detailed Audit Log History */}
      <div className="mt-6 border-t border-civic-cardBorder pt-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-civic-teal-400" />
          Official Resolution Audit Trail ({audits.length} Records)
        </h4>

        <div className="space-y-3">
          {audits.map((audit, i) => (
            <motion.div
              key={audit.id || i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-civic-card/60 border border-civic-cardBorder rounded-xl p-3.5 text-xs flex items-start gap-3"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-civic-teal-400 shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-200">{audit.changedBy}</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {formatDateTime(audit.timestamp)}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-civic-teal-300 border border-slate-700">
                    Status: {audit.newStatus}
                  </span>
                  {audit.previousStatus && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      (from {audit.previousStatus})
                    </span>
                  )}
                </div>
                {audit.remarks && (
                  <p className="mt-2 text-slate-300 bg-black/20 p-2 rounded-lg border border-white/5 text-[11px]">
                    "{audit.remarks}"
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
