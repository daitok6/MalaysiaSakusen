"use client";

import { useState, useEffect } from "react";
import { encouragements } from "@/lib/encouragements";
import { useLocale } from "./locale-provider";
import { Sparkles } from "lucide-react";

export function EncouragementBanner() {
  const [message, setMessage] = useState("");
  const { locale } = useLocale();

  useEffect(() => {
    const msgs = encouragements[locale];
    const idx = Math.floor(Math.random() * msgs.length);
    setMessage(msgs[idx]);
  }, [locale]);

  if (!message) return null;

  return (
    <div className="glass card-hover text-center relative sparkle overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "linear-gradient(135deg, rgba(255,214,165,0.3) 0%, rgba(255,181,167,0.2) 50%, rgba(184,181,255,0.3) 100%)",
        }}
      />
      <div className="relative flex items-center justify-center gap-2">
        <Sparkles size={16} className="text-marigold-foreground" />
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
}
