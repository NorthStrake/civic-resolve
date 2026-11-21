"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AIAnalysisResult, CivicCategory, UrgencyLevel } from "@/types";
import {
  Sparkles,
  ShieldCheck,
  AlertOctagon,
  Clock,
  Building2,
  ChevronDown,
  Edit3,
  CheckCircle2,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { getUrgencyBadge } from "@/lib/utils";

interface AIAnalysisPanelProps {
  analysis: AIAnalysisResult;
  onConfirm: (finalData: {
    category: CivicCategory;
    urgency: UrgencyLevel;
    assignedDepartment: string;
    userOverridden: boolean;
    overrideDetails?: string;
  }) => void;
  isSubmitting?: boolean;
}

const CATEGORIES: CivicCategory[] = [
  "Pothole/Road Damage",
  "Garbage/Sanitation",
  "Streetlight",
  "Water Leakage/Supply",
  "Drainage/Sewage",
  "Electricity",
  "Public Safety",
  "Other",
];

const URGENCIES: UrgencyLevel[] = ["Critical", "High", "Medium", "Low"];

export default function AIAnalysisPanel({
  analysis,
  onConfirm,
  isSubmitting = false,
}: AIAnalysisPanelProps) {
  const [isOverriding, setIsOverriding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CivicCategory>(analysis.category);
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyLevel>(analysis.urgency);
  const [overrideReason, setOverrideReason] = useState("");

  const urgencyBadge = getUrgencyBadge(selectedUrgency);

  const handleFinalSubmit = () => {
    const isChanged =
      selectedCategory !== analysis.category || selectedUrgency !== analysis.urgency;

    onConfirm({
      category: selectedCategory,
      urgency: selectedUrgency,
      assignedDepartment: analysis.recommended_department,
      userOverridden: isChanged,
      overrideDetails: isChanged
        ? `Citizen adjusted category from "${analysis.category}" to "${selectedCategory}", urgency from "${analysis.urgency}" to "${selectedUrgency}". Note: ${overrideReason}`
        : undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-panel-glow rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Top Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-civic-cardBorder">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-civic-teal-500/20 border border-civic-teal-500/40 flex items-center justify-center text-civic-teal-300">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
              Automated Civic Triage
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-civic-teal-950 text-civic-teal-300 border border-civic-teal-700/50">
                Live Analysis
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated with multimodal safety parameters & municipal routing rules
            </p>
          </div>
        </div>

        {/* Source Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs">
          {analysis.source === "Gemini 2.5 Flash" ? (
            <>
              <span className="w-2 h-2 rounded-full bg-civic-teal-400 animate-pulse"></span>
              <span className="text-civic-teal-300 font-medium font-mono text-[11px]">
                AI-analyzed by Gemini 2.5 Flash
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="text-amber-300 font-medium font-mono text-[11px]">
                Rule-based fallback
              </span>
            </>
          )}
        </div>
      </div>

      {/* Grid of Triage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
        {/* Category Card */}
        <div className="bg-civic-card/80 border border-civic-cardBorder rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block mb-1">Detected Category</span>
          <div className="text-base font-semibold text-white flex items-center justify-between">
            <span>{selectedCategory}</span>
            <span className="text-xs font-mono text-civic-teal-400">
              {Math.round(analysis.department_confidence * 100)}% match
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{analysis.subcategory}</p>
        </div>

        {/* Urgency & Impact Score Card */}
        <div className="bg-civic-card/80 border border-civic-cardBorder rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block mb-1">
            Urgency & Public Impact
          </span>
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${urgencyBadge.bg} ${urgencyBadge.text} ${urgencyBadge.border}`}
            >
              {selectedUrgency} Priority
            </span>
            <span className="text-xs font-mono text-slate-300 font-bold">
              Impact: {analysis.impact_score}/100
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                analysis.impact_score >= 80
                  ? "bg-red-500"
                  : analysis.impact_score >= 60
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${analysis.impact_score}%` }}
            ></div>
          </div>
        </div>

        {/* SLA & Time to Resolve */}
        <div className="bg-civic-card/80 border border-civic-cardBorder rounded-xl p-4">
          <span className="text-xs text-slate-400 font-medium block mb-1">Estimated Resolution SLA</span>
          <div className="text-base font-semibold text-white flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-civic-teal-400" />
            <span>{analysis.estimated_resolution_time_hours} Hours</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Target dispatch within 4 hours</p>
        </div>
      </div>

      {/* Department Routing Explanation Card (R4) */}
      <div className="bg-gradient-to-r from-civic-teal-950/40 to-slate-900/60 border border-civic-teal-900/50 rounded-xl p-4 mb-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-civic-teal-900/50 border border-civic-teal-700/50 flex items-center justify-center text-civic-teal-300 shrink-0 mt-0.5">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-civic-teal-400 font-semibold">
                Recommended Department
              </span>
              <span className="text-[11px] text-slate-400">
                ({Math.round(analysis.department_confidence * 100)}% Confidence)
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white mt-0.5">
              {analysis.recommended_department}
            </h4>

            {/* Why This Department? (R4) */}
            <div className="mt-2 text-xs text-slate-300 bg-black/30 p-2.5 rounded-lg border border-white/5">
              <span className="font-semibold text-civic-teal-300">Why this department? </span>
              {analysis.department_reasoning}
            </div>

            {/* Suggested Action for Authority */}
            <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-civic-teal-400 shrink-0" />
              <span>Suggested Field Action: {analysis.suggested_action_for_authority}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Severity Notes if image analysis present */}
      {analysis.visual_severity_notes && (
        <div className="mb-5 bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-xs flex items-center gap-2 text-slate-300">
          <Eye className="w-4 h-4 text-civic-teal-400 shrink-0" />
          <span>
            <strong className="text-slate-200">Multimodal Visual Check: </strong>
            {analysis.visual_severity_notes}
          </span>
        </div>
      )}

      {/* Human-in-the-loop Override Drawer */}
      <AnimatePresence>
        {isOverriding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-800 pt-4 mb-5 overflow-hidden"
          >
            <div className="bg-slate-900/80 p-4 rounded-xl border border-amber-500/30">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-3">
                <AlertTriangle className="w-4 h-4" />
                Human-in-the-Loop Override (Your adjustments will be logged for audit)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Override Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as CivicCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-civic-teal-400"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Override Urgency</label>
                  <select
                    value={selectedUrgency}
                    onChange={(e) => setSelectedUrgency(e.target.value as UrgencyLevel)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-civic-teal-400"
                  >
                    {URGENCIES.map((urg) => (
                      <option key={urg} value={urg}>
                        {urg} Priority
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label className="text-xs text-slate-300 block mb-1">Reason for Adjustment (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Near school crossing during morning hours"
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-civic-teal-400"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-civic-cardBorder">
        <button
          type="button"
          onClick={() => setIsOverriding(!isOverriding)}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors py-2 px-3 rounded-lg hover:bg-slate-800"
        >
          <Edit3 className="w-3.5 h-3.5" />
          {isOverriding ? "Cancel Override" : "Modify Triage Classification"}
        </button>

        <button
          type="button"
          onClick={handleFinalSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-civic-teal-500 to-teal-600 hover:from-civic-teal-400 hover:to-teal-500 text-slate-950 font-semibold text-xs tracking-wide shadow-lg shadow-civic-teal-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              <span>Registering Issue with Department...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Submit Complaint</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
