"use client";

import { useState, useEffect } from "react";
import { CurrencyProvider } from "./currency-provider";
import { Nav } from "./nav";
import { UserPickerModal, useCurrentUser } from "./user-picker-modal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, selectUser } = useCurrentUser();
  const [userNames, setUserNames] = useState<string[]>(["Daito", "Partner"]);
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
    <CurrencyProvider>
      <Nav userName={user} />
      <UserPickerModal
        userNames={userNames}
        onSelect={selectUser}
        open={!user}
      />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </CurrencyProvider>
  );
}
