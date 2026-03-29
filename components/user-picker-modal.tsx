"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useLocale } from "./locale-provider";
import { UserCircle } from "lucide-react";

export function useCurrentUser() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sakusen-user");
    setUser(saved);
  }, []);

  const selectUser = (name: string) => {
    localStorage.setItem("sakusen-user", name);
    setUser(name);
  };

  return { user, selectUser };
}

type UserPickerModalProps = {
  userNames: string[];
  onSelect: (name: string) => void;
  open: boolean;
};

export function UserPickerModal({ userNames, onSelect, open }: UserPickerModalProps) {
  const { t } = useLocale();

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md rounded-2xl" showCloseButton={false}>
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-2xl bg-lavender/20 flex items-center justify-center">
              <UserCircle size={28} className="text-lavender-foreground" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-bold">
            {t("user.welcome")}
          </DialogTitle>
          <DialogDescription className="text-center leading-relaxed">
            {t("user.prompt")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 justify-center pt-4">
          {userNames.map((name) => (
            <button
              key={name}
              className="h-20 w-32 text-lg font-bold rounded-2xl border-2 border-border bg-card hover:border-lavender hover:bg-lavender/10 transition-all duration-200 cursor-pointer"
              onClick={() => onSelect(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
