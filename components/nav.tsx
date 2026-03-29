"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrency } from "./currency-provider";
import { useLocale } from "./locale-provider";
import type { Currency } from "@/lib/types";
import {
  LayoutDashboard,
  ClipboardList,
  Wallet,
  FileCheck,
  BarChart3,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const navItems = [
  { href: "/", key: "nav.dashboard", Icon: LayoutDashboard },
  { href: "/summary", key: "nav.summary", Icon: BarChart3 },
  { href: "/checklist", key: "nav.checklist", Icon: ClipboardList },
  { href: "/finances", key: "nav.finances", Icon: Wallet },
  { href: "/visa", key: "nav.visa", Icon: FileCheck },
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
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-white/50 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 max-w-6xl">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-lavender text-lavender-foreground text-sm font-bold">
              作
            </span>
            <span className="font-bold text-lg tracking-tight hidden sm:inline">sakusen</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    active
                      ? "bg-lavender/20 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
            <SelectTrigger className="w-[88px] h-8 bg-muted border-0 text-foreground text-xs rounded-xl cursor-pointer">
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
            <div className="h-8 px-3.5 rounded-xl bg-coral/30 text-coral-foreground text-xs font-medium hidden sm:flex items-center">
              {userName}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
