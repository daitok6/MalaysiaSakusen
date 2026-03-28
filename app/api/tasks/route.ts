import { NextRequest, NextResponse } from "next/server";
import { getTasks, updateTask } from "@/lib/kv";

export async function GET() {
  const tasks = await getTasks();
  return NextResponse.json(tasks);
}

export async function PUT(request: NextRequest) {
  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const tasks = await updateTask(id, updates);
  return NextResponse.json(tasks);
}
