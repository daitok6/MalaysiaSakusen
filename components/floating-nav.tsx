"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "./locale-provider";
import {
  LayoutDashboard,
  ClipboardList,
  Wallet,
  FileCheck,
  BarChart3,
} from "lucide-react";

const navItems = [
  { href: "/", key: "nav.dashboard", Icon: LayoutDashboard },
  { href: "/summary", key: "nav.summary", Icon: BarChart3 },
  { href: "/checklist", key: "nav.checklist", Icon: ClipboardList },
  { href: "/finances", key: "nav.finances", Icon: Wallet },
  { href: "/visa", key: "nav.visa", Icon: FileCheck },
];

export function FloatingNav() {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50">
      <div className="flex items-center justify-around py-1.5 px-1 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg shadow-lavender/10">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${
                active
                  ? "bg-lavender/20 text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <item.Icon size={16} strokeWidth={active ? 2.2 : 1.5} />
              <span className="text-[9px] font-medium">{t(item.key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
