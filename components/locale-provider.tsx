"use client";

import { createContext, useContext, useCallback } from "react";
import { translations, type Locale } from "@/lib/i18n";

type LocaleContextType = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextType>({
  locale: "ja",
  setLocale: () => {},
  t: (key) => key,
});

export function useLocale() {
  return useContext(LocaleContext);
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale: Locale = "ja";
  const setLocale = useCallback(() => {}, []);

  const t = useCallback(
    (key: string): string => {
      return translations[locale][key] ?? key;
    },
    []
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}
