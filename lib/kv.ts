import { kv } from "@vercel/kv";
import type { Task, SavingsEntry, VisaStep, TrackerDocument, Settings } from "./types";
import { seedTasks, seedSavings, seedVisaSteps, seedDocuments, seedSettings } from "./seed-data";

export async function getTasks(): Promise<Task[]> {
  const tasks = await kv.get<Task[]>("tasks");
  if (tasks) return tasks;
  await kv.set("tasks", seedTasks);
  return seedTasks;
}

export async function setTasks(tasks: Task[]): Promise<void> {
  await kv.set("tasks", tasks);
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task[]> {
  const tasks = await getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error(`Task ${id} not found`);
  tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
  await setTasks(tasks);
  return tasks;
}

export async function getSavings(): Promise<SavingsEntry[]> {
  const savings = await kv.get<SavingsEntry[]>("savings");
  if (savings) return savings;
  await kv.set("savings", seedSavings);
  return seedSavings;
}

export async function setSavings(savings: SavingsEntry[]): Promise<void> {
  await kv.set("savings", savings);
}

export async function updateSavingsEntry(
  month: string,
  updates: Partial<SavingsEntry>
): Promise<SavingsEntry[]> {
  const savings = await getSavings();
  const index = savings.findIndex((s) => s.month === month);
  if (index === -1) throw new Error(`Savings entry for ${month} not found`);
  savings[index] = { ...savings[index], ...updates };
  await setSavings(savings);
  return savings;
}

export async function getVisaSteps(): Promise<VisaStep[]> {
  const steps = await kv.get<VisaStep[]>("visa_steps");
  if (steps) return steps;
  await kv.set("visa_steps", seedVisaSteps);
  return seedVisaSteps;
}

export async function setVisaSteps(steps: VisaStep[]): Promise<void> {
  await kv.set("visa_steps", steps);
}

export async function updateVisaStep(
  id: string,
  updates: Partial<VisaStep>
): Promise<VisaStep[]> {
  const steps = await getVisaSteps();
  const index = steps.findIndex((s) => s.id === id);
  if (index === -1) throw new Error(`Visa step ${id} not found`);
  steps[index] = { ...steps[index], ...updates };
  await setVisaSteps(steps);
  return steps;
}

export async function getDocuments(): Promise<TrackerDocument[]> {
  const docs = await kv.get<TrackerDocument[]>("documents");
  if (docs) return docs;
  await kv.set("documents", seedDocuments);
  return seedDocuments;
}

export async function setDocuments(docs: TrackerDocument[]): Promise<void> {
  await kv.set("documents", docs);
}

export async function updateDocument(
  id: string,
  updates: Partial<TrackerDocument>
): Promise<TrackerDocument[]> {
  const docs = await getDocuments();
  const index = docs.findIndex((d) => d.id === id);
  if (index === -1) throw new Error(`Document ${id} not found`);
  docs[index] = { ...docs[index], ...updates };
  await setDocuments(docs);
  return docs;
}

export async function getSettings(): Promise<Settings> {
  const settings = await kv.get<Settings>("settings");
  if (settings) return settings;
  await kv.set("settings", seedSettings);
  return seedSettings;
}

export async function setSettings(settings: Settings): Promise<void> {
  await kv.set("settings", settings);
}
