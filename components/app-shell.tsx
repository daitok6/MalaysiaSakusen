"use client";

import { useState, useEffect } from "react";
import { CurrencyProvider } from "./currency-provider";
import { LocaleProvider } from "./locale-provider";
import { Nav } from "./nav";
import { FloatingNav } from "./floating-nav";
import { UserPickerModal, useCurrentUser } from "./user-picker-modal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, selectUser } = useCurrentUser();
  const [userNames, setUserNames] = useState<string[]>(["Daito", "Koume"]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.userNames) setUserNames(data.userNames);
      })
      .catch(() => {});
  }, []);

  // Seed data on first load
  useEffect(() => {
    fetch("/api/seed", { method: "POST" }).catch(() => {});
  }, []);

  if (!mounted) return null;

  return (
    <LocaleProvider>
      <CurrencyProvider>
        <Nav userName={user} />
        <UserPickerModal
          userNames={userNames}
          onSelect={selectUser}
          open={!user}
        />
        <main className="container mx-auto px-6 py-10 max-w-6xl">{children}</main>
        <FloatingNav />
      </CurrencyProvider>
    </LocaleProvider>
  );
}
