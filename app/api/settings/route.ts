import { NextRequest, NextResponse } from "next/server";
import { getSettings, setSettings } from "@/lib/kv";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const updates = await request.json();
  const current = await getSettings();
  const merged = { ...current, ...updates };
  await setSettings(merged);
  return NextResponse.json(merged);
}
