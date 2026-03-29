import type { Task, SavingsEntry, VisaStep, TrackerDocument, Settings } from "./types";

export const seedTasks: Task[] = [
  // ── VISA & LEGAL ──────────────────────────────────────────────────────────
  { id: "V1",  title: "Register marriage in Japan",                        category: "visa", priority: "critical", status: "todo", deadline: "2026-04-30" },
  { id: "V2",  title: "Check passport validity (both)",                    category: "visa", priority: "critical", status: "todo", deadline: "2026-04-15" },
  { id: "V3",  title: "Renew passports if needed",                         category: "visa", priority: "high",     status: "todo", deadline: "2026-05-31", dependsOn: ["V2"] },
  { id: "V4",  title: "Research DE Rantau latest requirements",            category: "visa", priority: "high",     status: "todo", deadline: "2026-04-15" },
  { id: "V5",  title: "Get marriage certificate English translation",      category: "visa", priority: "high",     status: "todo", deadline: "2026-05-15", dependsOn: ["V1"] },
  { id: "V6",  title: "Get health insurance (SafetyWing/Cigna)",           category: "visa", priority: "high",     status: "todo", deadline: "2026-08-01" },
  { id: "V7",  title: "Compile 3 months income proof",                     category: "visa", priority: "critical", status: "todo", deadline: "2026-08-01" },
  { id: "V8",  title: "Prepare CV/portfolio for both",                     category: "visa", priority: "medium",   status: "todo", deadline: "2026-07-31" },
  { id: "V9",  title: "Submit DE Rantau application",                      category: "visa", priority: "critical", status: "todo", deadline: "2026-08-15", dependsOn: ["V3","V5","V6","V7","V8"] },
  { id: "V10", title: "Receive visa approval",                             category: "visa", priority: "critical", status: "todo", deadline: "2026-09-15", dependsOn: ["V9"] },
  { id: "V11", title: "Check resignation notice period (both)",            category: "visa", priority: "high",     status: "todo", deadline: "2026-08-15" },
  { id: "V12", title: "Identify tax representative (納税管理人)",            category: "visa", priority: "high",     status: "todo", deadline: "2026-09-15" },
  { id: "V13", title: "Submit 納税管理人届出書 (tax office + city hall)",     category: "visa", priority: "critical", status: "todo", deadline: "2026-10-15", dependsOn: ["V12"] },
  { id: "V14", title: "Submit resignation (退職届) — both",                 category: "visa", priority: "critical", status: "todo", deadline: "2026-10-15", dependsOn: ["V10","V11"] },
  { id: "V15", title: "Request 退職証明書 + 源泉徴収票 from employers",        category: "visa", priority: "high",     status: "todo", deadline: "2026-10-31", dependsOn: ["V14"] },
  { id: "V16", title: "Use remaining 有給休暇 (both)",                       category: "visa", priority: "high",     status: "todo", deadline: "2026-10-31", dependsOn: ["V14"] },
  { id: "V17", title: "Submit 転出届 at city hall",                         category: "visa", priority: "critical", status: "todo", deadline: "2026-10-20", dependsOn: ["V14"] },
  { id: "V18", title: "Cancel utilities, NHK, internet",                   category: "visa", priority: "medium",   status: "todo", deadline: "2026-10-25" },
  { id: "V19", title: "Set up mail forwarding (転送届)",                    category: "visa", priority: "medium",   status: "todo", deadline: "2026-10-25" },
  { id: "V20", title: "Switch mobile to povo2.0",                          category: "visa", priority: "low",      status: "todo", deadline: "2026-10-31" },
  { id: "V21", title: "Keep JP bank account + set up online banking",      category: "visa", priority: "high",     status: "todo", deadline: "2026-10-31" },
  { id: "V22", title: "File 確定申告 for 2026 via 納税管理人",                category: "visa", priority: "critical", status: "todo", deadline: "2027-03-15", dependsOn: ["V13"] },

  // ── INCOME ────────────────────────────────────────────────────────────────
  { id: "I1",  title: "Complete DataAnnotation onboarding",                category: "income", priority: "critical", status: "in_progress", deadline: "2026-04-07" },
  { id: "I2",  title: "Complete Outlier onboarding",                       category: "income", priority: "critical", status: "in_progress", deadline: "2026-04-07" },
  { id: "I3",  title: "Apply to Appen, Telus, Scale AI (backup)",          category: "income", priority: "high",     status: "todo",        deadline: "2026-04-01" },
  { id: "I4",  title: "Set up Wise account (USD receiving)",               category: "income", priority: "critical", status: "todo",        deadline: "2026-04-10" },
  { id: "I5",  title: "Create Upwork profile",                             category: "income", priority: "high",     status: "todo",        deadline: "2026-05-01" },
  { id: "I6",  title: "Apply to Toptal",                                   category: "income", priority: "medium",   status: "todo",        deadline: "2026-05-15" },
  { id: "I7",  title: "Complete first freelance project",                  category: "income", priority: "high",     status: "todo",        deadline: "2026-06-15", dependsOn: ["I5"] },
  { id: "I8",  title: "Koume: Set up CrowdWorks profile",                   category: "income", priority: "medium",   status: "todo",        deadline: "2026-04-15" },
  { id: "I9",  title: "Koume: Complete HubSpot Marketing course",          category: "income", priority: "medium",   status: "todo",        deadline: "2026-05-31" },
  { id: "I10", title: "Reach $1,500/mo side income",                       category: "income", priority: "critical", status: "todo",        deadline: "2026-07-31", dependsOn: ["I1","I5"] },
  { id: "I11", title: "Reach $2,500/mo side income",                       category: "income", priority: "high",     status: "todo",        deadline: "2026-09-30", dependsOn: ["I10"] },

  // ── BUSINESS ──────────────────────────────────────────────────────────────
  { id: "B1",  title: "Validate SaaS idea (tweet, Reddit, talk to 5 devs)", category: "business", priority: "high",   status: "todo", deadline: "2026-06-15" },
  { id: "B2",  title: "Build SaaS MVP",                                     category: "business", priority: "high",   status: "todo", deadline: "2026-07-31", dependsOn: ["B1"] },
  { id: "B3",  title: "Launch on Product Hunt",                             category: "business", priority: "medium", status: "todo", deadline: "2026-08-15", dependsOn: ["B2"] },
  { id: "B4",  title: "Create first digital product (template)",            category: "business", priority: "medium", status: "todo", deadline: "2026-06-30" },
  { id: "B5",  title: "Set up Gumroad store",                               category: "business", priority: "medium", status: "todo", deadline: "2026-06-15" },
  { id: "B6",  title: "Koume: Start content creation (blog/social)",        category: "business", priority: "medium", status: "todo", deadline: "2026-05-15", dependsOn: ["I9"] },
  { id: "B7",  title: "Launch newsletter",                                  category: "business", priority: "medium", status: "todo", deadline: "2026-07-01", dependsOn: ["B6"] },
  { id: "B8",  title: "First 10 paying SaaS customers",                     category: "business", priority: "high",   status: "todo", deadline: "2026-10-31", dependsOn: ["B3"] },
  { id: "B9",  title: "Verify side-work policy at both employers",          category: "business", priority: "critical",status: "todo" },
  { id: "B10", title: "SaaS validation: 5 interested users + 2 beta testers",category: "business",priority: "high",   status: "todo", deadline: "2026-06-15", dependsOn: ["B1"] },
  { id: "B11", title: "Koume: build portfolio of 3-5 writing samples",     category: "business", priority: "medium", status: "todo", deadline: "2026-06-30" },
  { id: "B12", title: "Decide on business entity when SaaS > $2K/mo",      category: "business", priority: "medium", status: "todo" },

  // ── LIFE & LOGISTICS ──────────────────────────────────────────────────────
  { id: "L1",  title: "Start saving ¥100,000+/mo",                         category: "life", priority: "critical", status: "todo", deadline: "2026-04-01" },
  { id: "L2",  title: "Research Mont Kiara apartments",                    category: "life", priority: "medium",   status: "todo", deadline: "2026-08-01" },
  { id: "L3",  title: "Book Airbnb for first month in KL",                 category: "life", priority: "high",     status: "todo", deadline: "2026-10-01", dependsOn: ["V10"] },
  { id: "L4",  title: "Give notice on Tokyo apartment",                    category: "life", priority: "high",     status: "todo", deadline: "2026-10-01", dependsOn: ["V10"] },
  { id: "L5",  title: "Sell/ship belongings",                              category: "life", priority: "medium",   status: "todo", deadline: "2026-10-15", dependsOn: ["L4"] },
  { id: "L6",  title: "Cancel Japanese utilities & subscriptions",         category: "life", priority: "medium",   status: "todo", deadline: "2026-10-25", dependsOn: ["L4"] },
  { id: "L7",  title: "Book flights Tokyo → KL",                           category: "life", priority: "high",     status: "todo", deadline: "2026-10-10", dependsOn: ["V10"] },
  { id: "L8",  title: "Reach ¥1,200,000+ savings",                         category: "life", priority: "critical", status: "todo", deadline: "2026-10-31", dependsOn: ["L1"] },
  { id: "L9",  title: "Download Grab + Touch 'n Go apps",                  category: "life", priority: "low",      status: "todo", deadline: "2026-11-01" },
  { id: "L10", title: "Get SIM card at KLIA on arrival",                   category: "life", priority: "high",     status: "todo", deadline: "2026-11-01" },
  { id: "L11", title: "Open Malaysian bank account",                       category: "life", priority: "high",     status: "todo", deadline: "2026-11-21", dependsOn: ["L10"] },
  { id: "L12", title: "Budget MYR 10,500+ for apartment deposit",          category: "life", priority: "critical", status: "todo" },
  { id: "L13", title: "Consult Malaysian tax advisor",                     category: "life", priority: "high",     status: "todo", deadline: "2027-12-01" },

  // ── TECH ──────────────────────────────────────────────────────────────────
  { id: "T1",  title: "Initialize Next.js + Supabase project",             category: "tech", priority: "high",   status: "todo", deadline: "2026-04-05" },
  { id: "T2",  title: "Set up auth (email/password for 2 users)",          category: "tech", priority: "high",   status: "todo", deadline: "2026-04-07", dependsOn: ["T1"] },
  { id: "T3",  title: "Build dashboard page",                              category: "tech", priority: "high",   status: "todo", deadline: "2026-04-14", dependsOn: ["T2"] },
  { id: "T4",  title: "Build checklist page",                              category: "tech", priority: "high",   status: "todo", deadline: "2026-04-14", dependsOn: ["T2"] },
  { id: "T5",  title: "Build income tracking page",                        category: "tech", priority: "high",   status: "todo", deadline: "2026-04-21", dependsOn: ["T2"] },
  { id: "T6",  title: "Build visa tracker page",                           category: "tech", priority: "medium", status: "todo", deadline: "2026-04-28", dependsOn: ["T2"] },
  { id: "T7",  title: "Build notes page",                                  category: "tech", priority: "medium", status: "todo", deadline: "2026-05-05", dependsOn: ["T2"] },
  { id: "T8",  title: "Build decision log page",                           category: "tech", priority: "low",    status: "todo", deadline: "2026-05-12", dependsOn: ["T2"] },
  { id: "T9",  title: "Deploy to Vercel",                                  category: "tech", priority: "high",   status: "todo", deadline: "2026-04-07", dependsOn: ["T1"] },
];

export const seedSavings: SavingsEntry[] = [
  { month: "2026-04", projectedSalary: 60000, projectedSideIncome: 0,      projectedCumulative: 60000,  currency: "JPY" },
  { month: "2026-05", projectedSalary: 60000, projectedSideIncome: 15000,  projectedCumulative: 135000, currency: "JPY" },
  { month: "2026-06", projectedSalary: 60000, projectedSideIncome: 30000,  projectedCumulative: 225000, currency: "JPY" },
  { month: "2026-07", projectedSalary: 60000, projectedSideIncome: 60000,  projectedCumulative: 345000, currency: "JPY" },
  { month: "2026-08", projectedSalary: 60000, projectedSideIncome: 90000,  projectedCumulative: 495000, currency: "JPY" },
  { month: "2026-09", projectedSalary: 60000, projectedSideIncome: 120000, projectedCumulative: 675000, currency: "JPY" },
  { month: "2026-10", projectedSalary: 60000, projectedSideIncome: 150000, projectedCumulative: 885000, currency: "JPY" },
];

export const seedVisaSteps: VisaStep[] = [
  // Phase A — Foundation (Apr–Jun 2026)
  { id: "VA1", phase: "A", title: "Get married (register in Japan)",                     status: "pending", dueDate: "2026-04-15", sortOrder: 1  },
  { id: "VA2", phase: "A", title: "Start DataAnnotation/Outlier work",                   status: "pending", dueDate: "2026-04-07", sortOrder: 2  },
  { id: "VA3", phase: "A", title: "Open USD-receiving account (Wise)",                   status: "pending", dueDate: "2026-04-14", sortOrder: 3  },
  { id: "VA4", phase: "A", title: "Begin saving ¥100,000+/mo",                           status: "pending", dueDate: "2026-04-14", sortOrder: 4  },
  { id: "VA5", phase: "A", title: "Build 2-3 months income proof",                       status: "pending", dueDate: "2026-06-01", sortOrder: 5  },
  { id: "VA6", phase: "A", title: "Renew passports if < 18 months validity",             status: "pending", dueDate: "2026-05-31", sortOrder: 6  },
  { id: "VA7", phase: "A", title: "Get health insurance quotes",                         status: "pending", dueDate: "2026-06-30", sortOrder: 7  },

  // Phase B — Income Building (May–Aug 2026)
  { id: "VB1", phase: "B", title: "Launch freelance profiles",                           status: "pending", dueDate: "2026-05-15", sortOrder: 8  },
  { id: "VB2", phase: "B", title: "Take first freelance contracts",                      status: "pending", dueDate: "2026-06-30", sortOrder: 9  },
  { id: "VB3", phase: "B", title: "Begin building SaaS MVP",                             status: "pending", dueDate: "2026-07-01", sortOrder: 10 },
  { id: "VB4", phase: "B", title: "Scale side income to $1,500-2,500/mo",               status: "pending", dueDate: "2026-08-31", sortOrder: 11 },

  // Phase C — Visa Application (Aug–Sep 2026)
  { id: "VC1", phase: "C", title: "Compile all visa documents",                          status: "pending", dueDate: "2026-08-07", sortOrder: 12 },
  { id: "VC2", phase: "C", title: "Submit DE Rantau application on MDEC portal",        status: "pending", dueDate: "2026-08-14", sortOrder: 13 },
  { id: "VC3", phase: "C", title: "Processing period (2-4 weeks)",                      status: "pending", dueDate: "2026-09-07", sortOrder: 14 },
  { id: "VC4", phase: "C", title: "Receive approval",                                   status: "pending", dueDate: "2026-09-14", sortOrder: 15 },

  // Phase D — Relocation (Oct–Nov 2026)
  { id: "VD1", phase: "D", title: "Book flights (Tokyo → KL)",                          status: "pending", dueDate: "2026-10-07", sortOrder: 16 },
  { id: "VD2", phase: "D", title: "Secure Mont Kiara apartment",                        status: "pending", dueDate: "2026-10-07", sortOrder: 17 },
  { id: "VD3", phase: "D", title: "Close out Tokyo apartment, ship/sell belongings",    status: "pending", dueDate: "2026-10-21", sortOrder: 18 },
  { id: "VD4", phase: "D", title: "Cancel Japanese utilities, redirect mail",           status: "pending", dueDate: "2026-10-28", sortOrder: 19 },
  { id: "VD5", phase: "D", title: "Arrive in Kuala Lumpur!",                            status: "pending", dueDate: "2026-11-01", sortOrder: 20 },
  { id: "VD6", phase: "D", title: "Complete immigration formalities",                   status: "pending", dueDate: "2026-11-07", sortOrder: 21 },
  { id: "VD7", phase: "D", title: "Set up local bank + SIM card",                       status: "pending", dueDate: "2026-11-14", sortOrder: 22 },
];

export const seedDocuments: TrackerDocument[] = [
  { id: "D1",  name: "Valid passports (both, 18+ months validity)",        status: "not_started" },
  { id: "D2",  name: "Marriage certificate (translated to English)",       status: "not_started" },
  { id: "D3",  name: "Proof of income — 3 months bank statements",        status: "not_started" },
  { id: "D4",  name: "Employment contract or freelance invoices",          status: "not_started" },
  { id: "D5",  name: "CV/Resume (both)",                                   status: "not_started" },
  { id: "D6",  name: "Portfolio of digital work",                          status: "not_started" },
  { id: "D7",  name: "Health/travel insurance policy",                     status: "not_started" },
  { id: "D8",  name: "Passport photos (white background)",                 status: "not_started" },
  { id: "D9",  name: "Completed MDEC application form",                    status: "not_started" },
  { id: "D10", name: "Proof of accommodation (Airbnb booking)",            status: "not_started" },
];

export const seedSettings: Settings = {
  userNames: ["Daito", "Koume"],
  preferredCurrency: "JPY",
};
