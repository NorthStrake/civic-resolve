"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  Sparkles,
  ArrowRight,
  MapPin,
  Camera,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  Search,
  Eye,
  Sliders,
  Play,
  TrendingUp,
  FileText,
} from "lucide-react";
import JudgesGuideModal from "@/components/JudgesGuideModal";

export default function LandingPage() {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isJudgesGuideOpen, setIsJudgesGuideOpen] = useState(false);

  // Cycle the 3 pin states (Red -> Amber -> Green) to demonstrate the core promise
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 3);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const stages = [
    {
      state: "REPORTED",
      color: "#EF4444",
      glow: "rgba(239, 68, 68, 0.4)",
      label: "Phase 1: Citizen Spot & Report",
      desc: "Grievance captured with photo, voice, and GPS pin. Gemini analyzes safety impact.",
      badge: "Reported (Red)",
    },
    {
      state: "IN_PROGRESS",
      color: "#F59E0B",
      glow: "rgba(245, 158, 11, 0.4)",
      label: "Phase 2: Automated Department Dispatch",
      desc: "Work order routed to Roads & Highways or TWAD with field action directives.",
      badge: "In Progress (Amber)",
    },
    {
      state: "RESOLVED",
      color: "#10B981",
      glow: "rgba(16, 185, 129, 0.4)",
      label: "Phase 3: Verified Resolution & Proof",
      desc: "Crews complete repair on-site. 'After' photo uploaded for tamper-proof citizen verification.",
      badge: "Resolved (Green)",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Radial Glow & Cyber Grid */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:32px_32px] opacity-20 pointer-events-none"></div>
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-civic-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-civic-teal-500/30 text-xs font-mono text-civic-teal-300 mb-6 shadow-lg shadow-civic-teal-500/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-civic-teal-400 animate-spin-slow" />
            <span>Google Gemini Flash Multimodal Civic Intelligence Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-civic-teal-400"></span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.1]"
          >
            Spot it. Report it. <br />
            <span className="bg-gradient-to-r from-civic-teal-300 via-teal-400 to-amber-400 bg-clip-text text-transparent">
              Watch it get fixed.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            Everyday civic issues like potholes, open manholes, and dark streetlights shouldn't disappear into bureaucratic voids.
            CivicResolve leverages Gemini multimodal AI to classify, prioritize, route, and publicly verify municipal resolutions.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
          >
            <Link
              href="/report"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-civic-teal-500 via-teal-500 to-teal-600 hover:from-civic-teal-400 hover:to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-xl shadow-civic-teal-500/25 flex items-center gap-2 transition-all group"
            >
              <span>Report a Civic Issue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/track"
              className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Search className="w-4 h-4 text-civic-teal-400" />
              <span>Track Complaint by ID</span>
            </Link>

            <button
              onClick={() => setIsJudgesGuideOpen(true)}
              className="px-5 py-3.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Judge's Guide & 1-Click Demo</span>
            </button>
          </motion.div>
        </div>

        {/* CINEMATIC INTERACTIVE CITY PINS SCENE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-14 relative rounded-3xl border border-civic-cardBorder bg-gradient-to-b from-slate-900/90 to-slate-950/95 p-6 sm:p-8 shadow-2xl overflow-hidden"
        >
          {/* Top Bar of the Scene */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="text-xs font-mono text-slate-400 ml-2">
                Coimbatore Smart City Grievance Network Simulation
              </span>
            </div>

            {/* Current Lifecycle Stage Pill */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono">
              <span
                className="w-2.5 h-2.5 rounded-full transition-colors duration-500"
                style={{ backgroundColor: stages[activeStage].color }}
              ></span>
              <span className="text-slate-300 font-semibold">{stages[activeStage].badge}</span>
            </div>
          </div>

          {/* Interactive City Scene with Glowing Municipal Nodes */}
          <div className="relative h-64 sm:h-80 w-full my-6 rounded-2xl bg-[#070B14] border border-slate-800/80 overflow-hidden flex items-center justify-center">
            {/* Grid Map Background */}
            <div className="absolute inset-0 bg-cyber-grid bg-[size:24px_24px] opacity-30"></div>

            {/* Connection Network Lines SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="20%" y1="45%" x2="50%" y2="50%" stroke="rgba(20, 184, 166, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="80%" y2="40%" stroke="rgba(20, 184, 166, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="45%" y2="75%" stroke="rgba(20, 184, 166, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="30%" y1="30%" x2="50%" y2="50%" stroke="rgba(20, 184, 166, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
            </svg>

            {/* Simulated Coimbatore Wards Glowing Pins */}
            {[
              { name: "Peelamedu (Ward 45)", x: "20%", y: "45%", delay: 0 },
              { name: "RS Puram (Ward 23)", x: "50%", y: "50%", delay: 0.1 },
              { name: "Gandhipuram (Ward 49)", x: "80%", y: "40%", delay: 0.2 },
              { name: "Saibaba Colony (Ward 17)", x: "30%", y: "30%", delay: 0.3 },
              { name: "Singanallur (Ward 57)", x: "70%", y: "70%", delay: 0.4 },
              { name: "Town Hall (Ward 62)", x: "45%", y: "75%", delay: 0.5 },
            ].map((pin, i) => (
              <div
                key={pin.name}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                style={{ left: pin.x, top: pin.y }}
              >
                {/* Glowing Pulse Aura */}
                <div
                  className="w-10 h-10 rounded-full absolute -top-2 animate-ping opacity-30 transition-colors duration-700"
                  style={{ backgroundColor: stages[activeStage].color }}
                ></div>

                {/* Node Center */}
                <div
                  className="w-7 h-7 rounded-full bg-slate-900 border-2 flex items-center justify-center transition-all duration-700 shadow-lg"
                  style={{
                    borderColor: stages[activeStage].color,
                    boxShadow: `0 0 16px ${stages[activeStage].color}`,
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full transition-colors duration-700"
                    style={{ backgroundColor: stages[activeStage].color }}
                  ></div>
                </div>

                {/* Label */}
                <span className="mt-1 text-[10px] font-mono font-medium text-slate-300 bg-slate-950/90 px-1.5 py-0.5 rounded border border-slate-800 whitespace-nowrap shadow">
                  {pin.name.split("-")[0].trim()}
                </span>
              </div>
            ))}

            {/* Central Floating Live Card */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 max-w-sm bg-slate-950/90 backdrop-blur-md p-3.5 rounded-xl border border-civic-teal-500/30 text-xs shadow-2xl">
              <span className="font-semibold text-white block mb-0.5">
                {stages[activeStage].label}
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {stages[activeStage].desc}
              </p>
            </div>
          </div>

          {/* Interactive Stepper Navigation Below Scene */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {stages.map((st, idx) => (
              <button
                key={st.state}
                onClick={() => setActiveStage(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activeStage === idx
                    ? "bg-slate-900 border-civic-teal-500/50 shadow-md"
                    : "bg-slate-950/50 border-slate-800/80 hover:bg-slate-900/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: st.color }}
                  ></span>
                  <span className="font-semibold text-xs text-white">{st.label.split(":")[0]}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{st.label.split(":")[1]}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* LIVE TELEMETRY COUNTERS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          <div className="bg-civic-card/80 border border-civic-cardBorder rounded-2xl p-5 text-center shadow-lg">
            <span className="text-3xl font-extrabold font-mono text-white block">42+</span>
            <span className="text-xs text-slate-400 mt-1 block">Issues Tracked & Seeded</span>
          </div>
          <div className="bg-civic-card/80 border border-civic-cardBorder rounded-2xl p-5 text-center shadow-lg">
            <span className="text-3xl font-extrabold font-mono text-civic-teal-400 block">26h</span>
            <span className="text-xs text-slate-400 mt-1 block">Average Resolution Speed</span>
          </div>
          <div className="bg-civic-card/80 border border-civic-cardBorder rounded-2xl p-5 text-center shadow-lg">
            <span className="text-3xl font-extrabold font-mono text-emerald-400 block">89%</span>
            <span className="text-xs text-slate-400 mt-1 block">SLA Target Compliance</span>
          </div>
          <div className="bg-civic-card/80 border border-civic-cardBorder rounded-2xl p-5 text-center shadow-lg">
            <span className="text-3xl font-extrabold font-mono text-amber-400 block">14 Wards</span>
            <span className="text-xs text-slate-400 mt-1 block">Coimbatore Smart City Coverage</span>
          </div>
        </div>
      </section>

      {/* 4-STEP AI CIVIC PIPELINE SECTION */}
      <section className="py-20 bg-civic-card/50 border-t border-b border-civic-cardBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-civic-teal-400 font-semibold bg-civic-teal-950/80 px-3 py-1 rounded-full border border-civic-teal-800">
              End-to-End Operational Workflow
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-3">
              How CivicResolve Works
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              From grassroots reporting to automated AI triage, department routing, and verified resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-6 relative group hover:border-civic-teal-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-civic-teal-500/10 border border-civic-teal-500/30 flex items-center justify-center text-civic-teal-400 font-mono font-bold text-sm mb-4">
                01
              </div>
              <h3 className="font-semibold text-base text-white mb-2">Citizen Grievance Capture</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Report via voice in English, Tamil, or Hindi with Web Speech API. Upload photos and drop a pinpoint GPS map location.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-6 relative group hover:border-civic-teal-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-civic-teal-500/10 border border-civic-teal-500/30 flex items-center justify-center text-civic-teal-400 font-mono font-bold text-sm mb-4">
                02
              </div>
              <h3 className="font-semibold text-base text-white mb-2">Gemini Multimodal Triage</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini 2.5 Flash classifies category, evaluates hazard severity, calculates a 0-100 impact score, and checks ~300m duplicates.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-6 relative group hover:border-civic-teal-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-civic-teal-500/10 border border-civic-teal-500/30 flex items-center justify-center text-civic-teal-400 font-mono font-bold text-sm mb-4">
                03
              </div>
              <h3 className="font-semibold text-base text-white mb-2">Automated Department Routing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates a field action order, SLA timer, and a one-line "Why this department?" explanation with confidence scores.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-6 relative group hover:border-civic-teal-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm mb-4">
                04
              </div>
              <h3 className="font-semibold text-base text-white mb-2">Proof of Resolution Slider</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Authorities upload "after" photos. Citizens inspect before/after comparisons and track status audit logs in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL HACKATHON CTA BANNER */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white">
            Experience the Future of Civic Accountability
          </h2>
          <p className="text-slate-300 text-sm mt-3 max-w-xl mx-auto">
            Ready for live evaluation. Explore citizen reporting, AI multimodal analysis, before/after proof comparisons, and control-room triage.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              href="/report"
              className="px-6 py-3 rounded-xl bg-civic-teal-500 hover:bg-civic-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-civic-teal-500/25 transition-all"
            >
              Report an Issue Now
            </Link>

            <Link
              href="/admin"
              className="px-6 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-xs transition-colors"
            >
              Open Control Room
            </Link>

            <button
              onClick={() => setIsJudgesGuideOpen(true)}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
            >
              Review Judge's Checklist
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      <JudgesGuideModal
        isOpen={isJudgesGuideOpen}
        onClose={() => setIsJudgesGuideOpen(false)}
      />
    </div>
  );
}
