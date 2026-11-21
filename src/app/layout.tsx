import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Shield, Sparkles, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "CivicResolve — AI-Powered Civic Issue Reporting & Resolution Platform",
  description:
    "Multimodal AI civic intelligence platform powered by Google Gemini. Taking citizen complaints from submission to AI classification, prioritization, department recommendation, tracking, and tamper-proof resolution.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-civic-dark text-slate-100 flex flex-col selection:bg-civic-teal-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>

        <footer className="border-t border-civic-cardBorder bg-civic-darker py-8 px-4 sm:px-6 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-civic-teal-400" />
              <span>
                <strong className="text-slate-200">CivicResolve</strong> &bull; Coimbatore City Municipal Corporation (CCMC) Operations
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-civic-teal-400" />
              <span>Powered by Google Gemini 2.5 Flash Multimodal AI</span>
            </div>

            <div className="text-slate-400">
              Demo Ready &bull; Coimbatore Smart City Hackathon 2026
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
