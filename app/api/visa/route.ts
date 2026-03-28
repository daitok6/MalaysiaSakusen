import { NextRequest, NextResponse } from "next/server";
import { getVisaSteps, updateVisaStep, getDocuments, updateDocument } from "@/lib/kv";

export async function GET() {
  const [steps, documents] = await Promise.all([getVisaSteps(), getDocuments()]);
  return NextResponse.json({ steps, documents });
}

export async function PUT(request: NextRequest) {
  const { type, id, ...updates } = await request.json();
  if (!type || !id) {
    return NextResponse.json({ error: "type and id required" }, { status: 400 });
  }

  if (type === "step") {
    const steps = await updateVisaStep(id, updates);
    const documents = await getDocuments();
    return NextResponse.json({ steps, documents });
  } else if (type === "document") {
    const documents = await updateDocument(id, updates);
    const steps = await getVisaSteps();
    return NextResponse.json({ steps, documents });
  }

  return NextResponse.json({ error: "type must be 'step' or 'document'" }, { status: 400 });
}
