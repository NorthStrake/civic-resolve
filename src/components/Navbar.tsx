"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  MapPin,
  FilePlus2,
  Search,
  BarChart3,
  SlidersHorizontal,
  Award,
  Globe2,
  UserCheck,
  ChevronDown,
} from "lucide-react";
import JudgesGuideModal from "./JudgesGuideModal";

export default function Navbar() {
  const pathname = usePathname();
  const [isJudgesGuideOpen, setIsJudgesGuideOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"EN" | "TA" | "HI">("EN");
  const [isAdminRole, setIsAdminRole] = useState(pathname.startsWith("/admin"));

  const navLinks = [
    { label: "Overview", href: "/", icon: MapPin },
    { label: "Report Issue", href: "/report", icon: FilePlus2 },
    { label: "Track Complaints", href: "/track", icon: Search },
    { label: "Transparency", href: "/transparency", icon: BarChart3 },
    { label: "Control Room", href: "/admin", icon: SlidersHorizontal, admin: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-civic-dark/85 backdrop-blur-xl border-b border-civic-cardBorder">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & City Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-civic-teal-400 via-teal-600 to-slate-900 p-0.5 shadow-lg shadow-civic-teal-500/20 group-hover:shadow-civic-teal-500/40 transition-all">
              <div className="w-full h-full bg-civic-dark rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-civic-teal-400 group-hover:scale-110 transition-transform" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-civic-teal-400 animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-civic-teal-400"></span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg text-white tracking-tight">
                  Civic<span className="text-civic-teal-400">Resolve</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-civic-teal-950 text-civic-teal-300 border border-civic-teal-700/40">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block -mt-1 font-mono">
                Coimbatore Smart City
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-civic-teal-500/15 text-civic-teal-300 border border-civic-teal-500/30"
                      : item.admin
                      ? "text-amber-400 hover:text-amber-300 hover:bg-amber-950/20"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.admin && (
                    <span className="text-[9px] font-mono px-1 rounded bg-amber-950 text-amber-300 border border-amber-600/40">
                      ADMIN
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Role Switcher, Language & Judge's Guide */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5 text-[11px] font-mono">
              <button
                onClick={() => setSelectedLanguage("EN")}
                className={`px-2 py-1 rounded transition-colors ${
                  selectedLanguage === "EN"
                    ? "bg-civic-teal-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setSelectedLanguage("TA")}
                className={`px-2 py-1 rounded transition-colors ${
                  selectedLanguage === "TA"
                    ? "bg-civic-teal-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
                title="தமிழ்"
              >
                தமிழ்
              </button>
              <button
                onClick={() => setSelectedLanguage("HI")}
                className={`px-2 py-1 rounded transition-colors ${
                  selectedLanguage === "HI"
                    ? "bg-civic-teal-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
                title="हिंदी"
              >
                हिंदी
              </button>
            </div>

            {/* Quick Demo Role Switcher */}
            <Link
              href={pathname.startsWith("/admin") ? "/" : "/admin"}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                pathname.startsWith("/admin")
                  ? "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                  : "bg-amber-950/40 text-amber-300 border-amber-600/40 hover:bg-amber-900/40"
              }`}
              title="One-click demo role switcher"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{pathname.startsWith("/admin") ? "Switch to Citizen" : "Switch to Admin"}</span>
            </Link>

            {/* Judge's Guide Floating CTA */}
            <button
              onClick={() => setIsJudgesGuideOpen(true)}
              className="relative group px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-teal-500/20 hover:from-amber-500/30 hover:to-teal-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-amber-500/10 transition-all"
            >
              <Award className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Judge's Guide</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Judge's Guide Modal */}
      <JudgesGuideModal
        isOpen={isJudgesGuideOpen}
        onClose={() => setIsJudgesGuideOpen(false)}
      />
    </>
  );
}
