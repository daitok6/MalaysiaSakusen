import { NextResponse } from "next/server";
import {
  getTasks, setTasks,
  setSavings, setVisaSteps, setDocuments, setSettings,
} from "@/lib/kv";
import { seedTasks, seedSavings, seedVisaSteps, seedDocuments, seedSettings } from "@/lib/seed-data";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "true";

  try {
    const existing = await getTasks();
    if (existing.length > 0 && !force) {
      return NextResponse.json({ message: "Data already seeded", seeded: false });
    }

    await Promise.all([
      setTasks(seedTasks),
      setSavings(seedSavings),
      setVisaSteps(seedVisaSteps),
      setDocuments(seedDocuments),
      setSettings(seedSettings),
    ]);

    return NextResponse.json({ message: "Seed complete", seeded: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Seed failed", error: String(error) },
      { status: 500 }
    );
  }
}
