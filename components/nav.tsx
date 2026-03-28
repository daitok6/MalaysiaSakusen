"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrency } from "./currency-provider";
import type { Currency } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const navItems = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/checklist", label: "Checklist", icon: "✅" },
  { href: "/finances", label: "Finances", icon: "💰" },
  { href: "/visa", label: "Visa", icon: "📄" },
];

const currencyOptions: { value: Currency; label: string }[] = [
  { value: "JPY", label: "¥ JPY" },
  { value: "USD", label: "$ USD" },
  { value: "MYR", label: "RM MYR" },
];

type NavProps = {
  userName: string | null;
};

export function Nav({ userName }: NavProps) {
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-navy text-white">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-gold">☆</span>
            <span>Sakusen</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-white/15 text-gold"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
            <SelectTrigger className="w-[100px] h-8 bg-white/10 border-white/20 text-white text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencyOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {userName && (
            <div className="h-8 px-3 rounded-full bg-gold/20 text-gold text-sm font-medium flex items-center">
              {userName}
            </div>
          )}
        </div>
      </div>
      {/* Mobile nav */}
      <nav className="md:hidden flex border-t border-white/10">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 text-center py-2 text-xs font-medium transition-colors ${
              pathname === item.href
                ? "text-gold bg-white/10"
                : "text-white/60"
            }`}
          >
            <div className="text-lg">{item.icon}</div>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
