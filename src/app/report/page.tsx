"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import InteractiveMap from "@/components/InteractiveMap";
import VoiceInputButton from "@/components/VoiceInputButton";
import AIAnalysisPanel from "@/components/AIAnalysisPanel";
import { AIAnalysisResult, CivicCategory, UrgencyLevel, IssueItem } from "@/types";
import {
  MapPin,
  Camera,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ThumbsUp,
  Crosshair,
  Building2,
  Clock,
  Layers,
  ArrowRight,
  RefreshCw,
  Image as ImageIcon,
  X,
} from "lucide-react";

// Coimbatore localities for quick selection
const QUICK_LOCALITIES = [
  { name: "Peelamedu (Ward 45)", lat: 11.0270, lng: 77.0016, address: "Avinashi Road, Peelamedu, Ward 45, Coimbatore" },
  { name: "RS Puram (Ward 23)", lat: 11.0084, lng: 76.9497, address: "D.B. Road, RS Puram, Ward 23, Coimbatore" },
  { name: "Gandhipuram (Ward 49)", lat: 11.0183, lng: 76.9678, address: "Cross Cut Road, Gandhipuram, Ward 49, Coimbatore" },
  { name: "Saibaba Colony (Ward 17)", lat: 11.0289, lng: 76.9412, address: "NSR Road, Saibaba Colony, Ward 17, Coimbatore" },
  { name: "Town Hall (Ward 62)", lat: 10.9958, lng: 76.9632, address: "Big Bazaar Street, Town Hall, Ward 62, Coimbatore" },
  { name: "Race Course (Ward 28)", lat: 11.0028, lng: 76.9742, address: "Thomas Park, Race Course, Ward 28, Coimbatore" },
];

export default function ReportPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("Avinashi Road, Peelamedu, Ward 45, Coimbatore");
  const [ward, setWard] = useState("Ward 45 - Peelamedu");
  const [latitude, setLatitude] = useState<number>(11.0270);
  const [longitude, setLongitude] = useState<number>(77.0016);
  const [citizenName, setCitizenName] = useState("Karthik Subramanian");
  const [citizenPhone, setCitizenPhone] = useState("+91 98421 88320");
  const [voiceLang, setVoiceLang] = useState<"en-IN" | "ta-IN" | "hi-IN">("en-IN");

  // Image Upload State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // Live AI Preview & Full Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [livePreview, setLivePreview] = useState<{
    category: string;
    urgency: string;
    department: string;
  } | null>(null);

  // Duplicate Alert State
  const [duplicates, setDuplicates] = useState<IssueItem[]>([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [upvotingId, setUpvotingId] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIssue, setSubmittedIssue] = useState<IssueItem | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Live typing debounced preview
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (title.trim().length > 6 || description.trim().length > 10) {
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const res = await fetch("/api/ai/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              description,
              address,
              imageBase64,
            }),
          });
          const json = await res.json();
          if (json.success && json.data) {
            setLivePreview({
              category: json.data.category,
              urgency: json.data.urgency,
              department: json.data.recommended_department.split("(")[0].trim(),
            });
          }
        } catch (e) {
          console.warn("Live preview error:", e);
        }
      }, 700);
    } else {
      setLivePreview(null);
    }

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [title, description, address, imageBase64]);

  // Handle Geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = +pos.coords.latitude.toFixed(5);
        const lng = +pos.coords.longitude.toFixed(5);
        setLatitude(lat);
        setLongitude(lng);
        setAddress(`GPS Location (${lat}, ${lng}), Coimbatore`);
      },
      (err) => {
        console.warn("Geolocation denied or error:", err);
        // Fallback to Peelamedu
        setLatitude(11.0270);
        setLongitude(77.0016);
        setAddress("Avinashi Road, Peelamedu, Ward 45, Coimbatore");
      }
    );
  };

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = reader.result as string;
        setImagePreview(resultStr);
        setImageBase64(resultStr);
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 1: Trigger AI Triage & Check Duplicates
  const handleAnalyzeAndReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please enter a title and description for your complaint.");
      return;
    }

    setIsAnalyzing(true);
    try {
      // 1. Run AI analysis
      const aiRes = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          address,
          imageBase64,
        }),
      });
      const aiJson = await aiRes.json();
      if (!aiJson.success) throw new Error(aiJson.error || "AI analysis failed");

      setAiAnalysis(aiJson.data);

      // 2. Check for nearby duplicates (~350m radius with matching category)
      const dupRes = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category: aiJson.data.category,
          latitude,
          longitude,
          checkDuplicatesOnly: true,
        }),
      });
      const dupJson = await dupRes.json();
      if (dupJson.hasDuplicates && dupJson.duplicates.length > 0) {
        setDuplicates(dupJson.duplicates);
        setShowDuplicateModal(true);
      }
    } catch (err: any) {
      console.error(err);
      alert("Error analyzing issue: " + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step 2: Final Submit to DB (Human in the loop confirmation)
  const handleFinalSubmit = async (finalData: {
    category: CivicCategory;
    urgency: UrgencyLevel;
    assignedDepartment: string;
    userOverridden: boolean;
    overrideDetails?: string;
  }) => {
    if (!aiAnalysis) return;
    setIsSubmitting(true);

    try {
      const payload = {
        title,
        description,
        category: finalData.category,
        subcategory: aiAnalysis.subcategory,
        urgency: finalData.urgency,
        impactScore: aiAnalysis.impact_score,
        latitude,
        longitude,
        address,
        ward,
        imageUrl: imageBase64 || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
        assignedDepartment: finalData.assignedDepartment,
        departmentConfidence: aiAnalysis.department_confidence,
        departmentReasoning: aiAnalysis.department_reasoning,
        oneLineSummary: aiAnalysis.one_line_summary,
        suggestedAction: aiAnalysis.suggested_action_for_authority,
        estimatedResolutionHours: aiAnalysis.estimated_resolution_time_hours,
        citizenName,
        citizenPhone,
        aiModelUsed: aiAnalysis.source,
        userOverridden: finalData.userOverridden,
        overrideDetails: finalData.overrideDetails,
      };

      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (resJson.success && resJson.data) {
        setSubmittedIssue(resJson.data);
      } else {
        throw new Error(resJson.error || "Submission failed");
      }
    } catch (e: any) {
      console.error(e);
      alert("Submission error: " + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upvote Duplicate Issue
  const handleUpvoteDuplicate = async (dupId: string) => {
    setUpvotingId(dupId);
    try {
      const res = await fetch(`/api/issues/${dupId}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ citizenId: citizenName }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Thank you! Upvoted existing issue. Priority elevated.");
        router.push(`/track/${dupId}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpvotingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-civic-teal-400 uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal Civic Ingestion Engine</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
          Report a Civic Issue
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Spot a problem in Coimbatore? Describe it in English, தமிழ், or हिंदी or upload a photo.
          Google Gemini automatically classifies, prioritizes, and routes it to the exact municipal authority.
        </p>
      </div>

      {/* SUCCESS CONFIRMATION SCREEN */}
      {submittedIssue ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel-glow rounded-2xl p-8 max-w-2xl mx-auto text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800">
            Complaint Registered Successfully
          </span>

          <h2 className="font-display font-bold text-2xl text-white mt-4">
            Issue ID: <span className="text-civic-teal-300 font-mono">{submittedIssue.id}</span>
          </h2>

          <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
            Your grievance has been classified as <strong>{submittedIssue.category}</strong> and routed directly to the{" "}
            <strong>{submittedIssue.assignedDepartment}</strong>.
          </p>

          <div className="my-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Target Resolution SLA:</span>
              <span className="text-civic-teal-300 font-semibold">{submittedIssue.estimatedResolutionHours} Hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Assigned Urgency:</span>
              <span className="text-amber-300 font-semibold">{submittedIssue.urgency} Priority</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ward & Area:</span>
              <span className="text-slate-200">{submittedIssue.ward}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => router.push(`/track/${submittedIssue.id}`)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-civic-teal-500 hover:bg-civic-teal-400 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-civic-teal-500/30 flex items-center justify-center gap-2"
            >
              <span>Track Resolution Live</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSubmittedIssue(null);
                setAiAnalysis(null);
                setTitle("");
                setDescription("");
                setImagePreview(null);
                setImageBase64(null);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Report Another Issue
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Input Form */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleAnalyzeAndReview} className="space-y-5">
              {/* Complaint Title */}
              <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-5 shadow-lg">
                <label className="text-xs font-semibold text-slate-200 block mb-1.5 flex items-center justify-between">
                  <span>Issue Headline / Title *</span>
                  <span className="text-[11px] text-slate-500 font-normal">Clear & concise</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hazardous deep crater pothole near PSG Tech bus stop"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-civic-teal-400 transition-colors"
                />

                {/* Live Typing AI Preview Indicator */}
                {livePreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 p-2.5 bg-civic-teal-950/40 border border-civic-teal-800/60 rounded-lg text-[11px] flex items-center justify-between gap-2 text-civic-teal-300"
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-civic-teal-400" />
                      <span>
                        AI Live Triage: <strong>{livePreview.category}</strong> &bull;{" "}
                        <span className="text-amber-400">{livePreview.urgency} Urgency</span>
                      </span>
                    </div>
                    <span className="text-slate-400 font-mono text-[10px] hidden sm:inline">
                      {livePreview.department}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Description & Voice Input */}
              <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-200">
                    Detailed Grievance Description *
                  </label>

                  <div className="flex items-center gap-2">
                    {/* Voice Language Picker */}
                    <select
                      value={voiceLang}
                      onChange={(e) => setVoiceLang(e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                    >
                      <option value="en-IN">Voice: English</option>
                      <option value="ta-IN">Voice: தமிழ்</option>
                      <option value="hi-IN">Voice: हिंदी</option>
                    </select>

                    {/* Web Speech Voice Input Button */}
                    <VoiceInputButton
                      language={voiceLang}
                      onTranscript={(text) => setDescription((prev) => (prev ? `${prev} ${text}` : text))}
                    />
                  </div>
                </div>

                <textarea
                  required
                  rows={4}
                  placeholder="Describe the issue, hazards, and exact landmark... (Voice supported in English, Tamil, and Hindi)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-civic-teal-400 transition-colors"
                />
              </div>

              {/* Image Upload (Multimodal Gemini Vision) */}
              <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-5 shadow-lg">
                <label className="text-xs font-semibold text-slate-200 block mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-civic-teal-400" />
                    Photo Evidence (Enables Gemini Multimodal Visual Severity)
                  </span>
                  <span className="text-[11px] text-slate-500">Optional but recommended</span>
                </label>

                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-civic-teal-500/40 max-h-52 bg-black">
                    <img
                      src={imagePreview}
                      alt="Uploaded preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageBase64(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2.5 py-1 rounded-md text-[11px] text-civic-teal-300 font-mono flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Multimodal visual verification active
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-700 hover:border-civic-teal-500/60 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/30">
                    <Upload className="w-8 h-8 text-slate-500 mb-2" />
                    <span className="text-xs font-medium text-slate-300">
                      Click to upload photo or drag & drop
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      JPEG, PNG, WebP up to 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Location & Ward Selector */}
              <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-civic-teal-400" />
                    Civic Location & Address
                  </label>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="text-xs text-civic-teal-300 hover:text-civic-teal-200 flex items-center gap-1 font-medium bg-civic-teal-950/60 px-2.5 py-1 rounded-lg border border-civic-teal-800/60 transition-colors"
                  >
                    <Crosshair className="w-3 h-3" />
                    Use My Location
                  </button>
                </div>

                {/* Quick Coimbatore Locality Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_LOCALITIES.map((loc) => (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => {
                        setLatitude(loc.lat);
                        setLongitude(loc.lng);
                        setAddress(loc.address);
                        setWard(loc.name);
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        latitude === loc.lat && longitude === loc.lng
                          ? "bg-civic-teal-500/20 text-civic-teal-300 border-civic-teal-500/60"
                          : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                      }`}
                    >
                      {loc.name.split("-")[0].trim()}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  required
                  placeholder="Street address, ward number, landmarks"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-civic-teal-400"
                />

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>GPS Coordinates: {latitude.toFixed(5)}, {longitude.toFixed(5)}</span>
                  <span>Click map on the right to drop a custom pin</span>
                </div>
              </div>

              {/* Citizen Details */}
              <div className="bg-civic-card border border-civic-cardBorder rounded-2xl p-5 shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Your Name (Citizen)
                  </label>
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-civic-teal-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Phone Number (For SMS Status Alerts)
                  </label>
                  <input
                    type="text"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-civic-teal-400"
                  />
                </div>
              </div>

              {/* Submit / Trigger Analysis Button */}
              {!aiAnalysis && (
                <button
                  type="submit"
                  disabled={isAnalyzing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-civic-teal-500 via-teal-500 to-teal-600 hover:from-civic-teal-400 hover:to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-xl shadow-civic-teal-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Gemini Analyzing Multimodal Grievance...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze with Gemini & Review Triage</span>
                    </>
                  )}
                </button>
              )}
            </form>

            {/* AI ANALYSIS PANEL (R1-R4) with Human-in-the-loop Override */}
            {aiAnalysis && (
              <AIAnalysisPanel
                analysis={aiAnalysis}
                onConfirm={handleFinalSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>

          {/* RIGHT COLUMN: Interactive Pin-Drop Map & Coimbatore Context */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-civic-teal-400" />
                  Interactive Location Pin-Drop
                </span>
                <span className="text-[10px] font-mono text-civic-teal-400 bg-civic-teal-950/80 px-2 py-0.5 rounded border border-civic-teal-800">
                  300m Duplicate Halo
                </span>
              </div>

              {/* Map Container */}
              <div className="h-[440px] w-full rounded-2xl overflow-hidden shadow-2xl border border-civic-cardBorder">
                <InteractiveMap
                  isPicker={true}
                  pickerPosition={[latitude, longitude]}
                  onLocationSelect={(lat, lng, addr) => {
                    setLatitude(lat);
                    setLongitude(lng);
                    setAddress(addr);
                  }}
                  showRadiusCircle={true}
                  radiusMeters={300}
                />
              </div>

              {/* Map Helper Info */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-civic-teal-400 shrink-0 mt-0.5" />
                <p>
                  Clicking the map relocates your complaint pin. Any existing open reports within
                  300 meters will be checked to prevent duplicate submissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DUPLICATE DETECTION DIALOG (Feature 1) */}
      <AnimatePresence>
        {showDuplicateModal && duplicates.length > 0 && (
          <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Similar Issue Already Reported!
                  </h3>
                  <p className="text-xs text-slate-400">
                    {duplicates.length} citizen(s) have already reported a {aiAnalysis?.category} within ~300 meters.
                  </p>
                </div>
              </div>

              <div className="space-y-3 my-4">
                {duplicates.map((dup) => (
                  <div
                    key={dup.id}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-civic-teal-400">{dup.id}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300">
                          {dup.status}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-200 line-clamp-1">{dup.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{dup.address}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUpvoteDuplicate(dup.id)}
                      disabled={upvotingId === dup.id}
                      className="px-3 py-1.5 rounded-lg bg-civic-teal-500 hover:bg-civic-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Support ({dup.upvotesCount})</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDuplicateModal(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Proceed with Separate Complaint
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
