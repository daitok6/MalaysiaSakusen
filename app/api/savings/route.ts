import { NextRequest, NextResponse } from "next/server";
import { getSavings, updateSavingsEntry } from "@/lib/kv";

export async function GET() {
  const savings = await getSavings();
  return NextResponse.json(savings);
}

export async function PUT(request: NextRequest) {
  const { month, ...updates } = await request.json();
  if (!month) return NextResponse.json({ error: "month required" }, { status: 400 });
  const savings = await updateSavingsEntry(month, updates);
  return NextResponse.json(savings);
}
