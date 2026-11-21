"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  language?: "en-IN" | "ta-IN" | "hi-IN";
}

export default function VoiceInputButton({
  onTranscript,
  language = "en-IN",
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          onTranscript(currentTranscript);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn("Speech recognition error:", err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language, onTranscript]);

  const toggleListening = () => {
    if (!supported || !recognitionRef.current) {
      alert("Voice input is supported in modern Chrome, Edge, and Safari browsers.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn("Error starting speech recognition:", e);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        isListening
          ? "bg-red-500/20 text-red-300 border border-red-500/50 shadow-lg shadow-red-500/20 animate-pulse"
          : "bg-civic-card text-slate-300 hover:text-white border border-civic-cardBorder hover:border-civic-teal-500/50"
      }`}
      title={
        isListening
          ? "Listening... Click to stop"
          : `Click to speak (${language === "ta-IN" ? "தமிழ்" : language === "hi-IN" ? "हिंदी" : "English"})`
      }
    >
      {isListening ? (
        <>
          <MicOff className="w-3.5 h-3.5 text-red-400" />
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
            Listening ({language.split("-")[0].toUpperCase()})...
          </span>
        </>
      ) : (
        <>
          <Mic className="w-3.5 h-3.5 text-civic-teal-400" />
          <span>Speak Issue</span>
        </>
      )}
    </button>
  );
}
