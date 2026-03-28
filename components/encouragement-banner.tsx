"use client";

import { useState, useEffect } from "react";
import { encouragements } from "@/lib/encouragements";
import { useLocale } from "./locale-provider";

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
    <div className="rounded-xl bg-gradient-to-r from-gold/20 to-primary/10 border border-gold/30 px-6 py-4 text-center">
      <p className="text-navy font-medium">{message}</p>
    </div>
  );
}
