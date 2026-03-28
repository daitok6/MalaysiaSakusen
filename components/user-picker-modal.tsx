"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLocale } from "./locale-provider";

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
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-navy text-center text-xl">
            {t("user.welcome")}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t("user.prompt")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 justify-center pt-4">
          {userNames.map((name) => (
            <Button
              key={name}
              variant="outline"
              className="h-20 w-32 text-lg font-semibold border-2 hover:border-primary hover:bg-primary/10"
              onClick={() => onSelect(name)}
            >
              {name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
