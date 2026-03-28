import { NextResponse } from "next/server";

let cachedRates: { rates: Record<string, number>; fetchedAt: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET() {
  if (cachedRates && Date.now() - cachedRates.fetchedAt < CACHE_TTL) {
    return NextResponse.json(cachedRates.rates);
  }

  try {
    const res = await fetch(
      "https://api.frankfurter.app/latest?from=USD&to=JPY,MYR"
    );
    if (!res.ok) throw new Error("Frankfurter API error");
    const data = await res.json();

    cachedRates = { rates: data.rates, fetchedAt: Date.now() };
    return NextResponse.json(data.rates);
  } catch {
    return NextResponse.json({ JPY: 150, MYR: 4.5 });
  }
}
