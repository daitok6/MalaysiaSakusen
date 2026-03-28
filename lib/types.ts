export type TaskCategory = "visa" | "income" | "business" | "life" | "tech";
export type TaskPriority = "critical" | "high" | "medium" | "low";
export type TaskStatus = "todo" | "in_progress" | "done";

export type Task = {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  deadline?: string;
  assignee?: string;
  dependsOn?: string[];
  updatedBy?: string;
  updatedAt?: string;
};

export type SavingsEntry = {
  month: string;
  projectedSalary: number;
  projectedSideIncome: number;
  projectedCumulative: number;
  actualSalary?: number;
  actualSideIncome?: number;
  actualCumulative?: number;
  currency: "JPY";
};

export type VisaPhase = "A" | "B" | "C" | "D";
export type VisaStepStatus = "pending" | "in_progress" | "completed" | "blocked";

export type VisaStep = {
  id: string;
  phase: VisaPhase;
  title: string;
  description?: string;
  status: VisaStepStatus;
  dueDate?: string;
  notes?: string;
  completedAt?: string;
  sortOrder: number;
};

export type DocumentStatus = "not_started" | "in_progress" | "ready";

export type TrackerDocument = {
  id: string;
  name: string;
  status: DocumentStatus;
  notes?: string;
};

export type Currency = "MYR" | "USD" | "JPY";

export type Settings = {
  userNames: string[];
  preferredCurrency: Currency;
};

export type ExchangeRates = {
  base: Currency;
  rates: Record<Currency, number>;
  fetchedAt: string;
};
