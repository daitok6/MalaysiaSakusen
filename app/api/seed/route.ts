import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { seedTasks, seedSavings, seedVisaSteps, seedDocuments, seedSettings } from "@/lib/seed-data";

export async function POST() {
  const existing = await kv.get("tasks");
  if (existing) {
    return NextResponse.json({ message: "Data already seeded", seeded: false });
  }

  await Promise.all([
    kv.set("tasks", seedTasks),
    kv.set("savings", seedSavings),
    kv.set("visa_steps", seedVisaSteps),
    kv.set("documents", seedDocuments),
    kv.set("settings", seedSettings),
  ]);

  return NextResponse.json({ message: "Seed complete", seeded: true });
}
