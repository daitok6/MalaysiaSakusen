import type { Metadata } from "next";
import { Nunito_Sans, M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-latin",
  weight: ["300", "400", "500", "600", "700"],
});

const mplusRounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  variable: "--font-jp",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Sakusen — マレーシア移住トラッカー",
  description: "だいと＆こうめ — 東京からクアラルンプールへ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${nunitoSans.variable} ${mplusRounded.variable} font-sans antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
