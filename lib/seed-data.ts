import type { Task, SavingsEntry, VisaStep, TrackerDocument, Settings } from "./types";

export const seedTasks: Task[] = [
  // ── ビザ・法務 ──────────────────────────────────────────────────────────
  { id: "V1",  title: "日本で婚姻届を提出",                                   category: "visa", priority: "critical", status: "todo", deadline: "2026-04-30" },
  { id: "V2",  title: "パスポートの有効期限確認（二人とも）",                      category: "visa", priority: "critical", status: "todo", deadline: "2026-04-15" },
  { id: "V3",  title: "必要に応じてパスポート更新",                              category: "visa", priority: "high",     status: "todo", deadline: "2026-05-31", dependsOn: ["V2"] },
  { id: "V4",  title: "DE Rantauの最新要件を調査",                             category: "visa", priority: "high",     status: "todo", deadline: "2026-04-15" },
  { id: "V5",  title: "婚姻証明書の英訳を取得",                                category: "visa", priority: "high",     status: "todo", deadline: "2026-05-15", dependsOn: ["V1"] },
  { id: "V6",  title: "健康保険に加入（SafetyWing/Cigna）",                   category: "visa", priority: "high",     status: "todo", deadline: "2026-08-01" },
  { id: "V7",  title: "3ヶ月分の収入証明を準備",                               category: "visa", priority: "critical", status: "todo", deadline: "2026-08-01" },
  { id: "V8",  title: "履歴書・ポートフォリオを準備（二人とも）",                   category: "visa", priority: "medium",   status: "todo", deadline: "2026-07-31" },
  { id: "V9",  title: "DE Rantau申請を提出",                                 category: "visa", priority: "critical", status: "todo", deadline: "2026-08-15", dependsOn: ["V3","V5","V6","V7","V8"] },
  { id: "V10", title: "ビザ承認を受領",                                       category: "visa", priority: "critical", status: "todo", deadline: "2026-09-15", dependsOn: ["V9"] },
  { id: "V11", title: "退職の通知期間を確認（二人とも）",                         category: "visa", priority: "high",     status: "todo", deadline: "2026-08-15" },
  { id: "V12", title: "納税管理人を選定",                                     category: "visa", priority: "high",     status: "todo", deadline: "2026-09-15" },
  { id: "V13", title: "納税管理人届出書を提出（税務署・区役所）",                   category: "visa", priority: "critical", status: "todo", deadline: "2026-10-15", dependsOn: ["V12"] },
  { id: "V14", title: "退職届を提出（二人とも）",                               category: "visa", priority: "critical", status: "todo", deadline: "2026-10-15", dependsOn: ["V10","V11"] },
  { id: "V15", title: "退職証明書・源泉徴収票を請求",                            category: "visa", priority: "high",     status: "todo", deadline: "2026-10-31", dependsOn: ["V14"] },
  { id: "V16", title: "残りの有給休暇を消化（二人とも）",                         category: "visa", priority: "high",     status: "todo", deadline: "2026-10-31", dependsOn: ["V14"] },
  { id: "V17", title: "転出届を区役所に提出",                                  category: "visa", priority: "critical", status: "todo", deadline: "2026-10-20", dependsOn: ["V14"] },
  { id: "V18", title: "公共料金・NHK・ネットを解約",                            category: "visa", priority: "medium",   status: "todo", deadline: "2026-10-25" },
  { id: "V19", title: "郵便転送届を設定",                                     category: "visa", priority: "medium",   status: "todo", deadline: "2026-10-25" },
  { id: "V20", title: "携帯をpovo2.0に切替",                                 category: "visa", priority: "low",      status: "todo", deadline: "2026-10-31" },
  { id: "V21", title: "日本の銀行口座を維持＋オンラインバンキング設定",              category: "visa", priority: "high",     status: "todo", deadline: "2026-10-31" },
  { id: "V22", title: "2026年分の確定申告を納税管理人経由で提出",                  category: "visa", priority: "critical", status: "todo", deadline: "2027-03-15", dependsOn: ["V13"] },

  // ── 収入 ────────────────────────────────────────────────────────────────
  { id: "I1",  title: "DataAnnotationのオンボーディング完了",                   category: "income", priority: "critical", status: "in_progress", deadline: "2026-04-07" },
  { id: "I2",  title: "Outlierのオンボーディング完了",                          category: "income", priority: "critical", status: "in_progress", deadline: "2026-04-07" },
  { id: "I3",  title: "Appen・Telus・Scale AIに応募（バックアップ）",            category: "income", priority: "high",     status: "todo",        deadline: "2026-04-01" },
  { id: "I4",  title: "Wiseアカウント開設（USD受取用）",                        category: "income", priority: "critical", status: "todo",        deadline: "2026-04-10" },
  { id: "I5",  title: "Upworkプロフィール作成",                               category: "income", priority: "high",     status: "todo",        deadline: "2026-05-01" },
  { id: "I6",  title: "Toptalに応募",                                       category: "income", priority: "medium",   status: "todo",        deadline: "2026-05-15" },
  { id: "I7",  title: "初のフリーランス案件を完了",                             category: "income", priority: "high",     status: "todo",        deadline: "2026-06-15", dependsOn: ["I5"] },
  { id: "I8",  title: "こうめ: CrowdWorksプロフィール作成",                     category: "income", priority: "medium",   status: "todo",        deadline: "2026-04-15" },
  { id: "I9",  title: "こうめ: HubSpotマーケティング講座修了",                   category: "income", priority: "medium",   status: "todo",        deadline: "2026-05-31" },
  { id: "I10", title: "副収入$1,500/月を達成",                                category: "income", priority: "critical", status: "todo",        deadline: "2026-07-31", dependsOn: ["I1","I5"] },
  { id: "I11", title: "副収入$2,500/月を達成",                                category: "income", priority: "high",     status: "todo",        deadline: "2026-09-30", dependsOn: ["I10"] },

  // ── ビジネス ──────────────────────────────────────────────────────────────
  { id: "B1",  title: "SaaSアイデアを検証（SNS・Reddit・5人のデベロッパーと対話）",  category: "business", priority: "high",   status: "todo", deadline: "2026-06-15" },
  { id: "B2",  title: "SaaS MVPを構築",                                      category: "business", priority: "high",   status: "todo", deadline: "2026-07-31", dependsOn: ["B1"] },
  { id: "B3",  title: "Product Huntでローンチ",                               category: "business", priority: "medium", status: "todo", deadline: "2026-08-15", dependsOn: ["B2"] },
  { id: "B4",  title: "初のデジタル商品を作成（テンプレート）",                     category: "business", priority: "medium", status: "todo", deadline: "2026-06-30" },
  { id: "B5",  title: "Gumroadストアを開設",                                  category: "business", priority: "medium", status: "todo", deadline: "2026-06-15" },
  { id: "B6",  title: "こうめ: コンテンツ制作開始（ブログ・SNS）",                 category: "business", priority: "medium", status: "todo", deadline: "2026-05-15", dependsOn: ["I9"] },
  { id: "B7",  title: "ニュースレターを開始",                                   category: "business", priority: "medium", status: "todo", deadline: "2026-07-01", dependsOn: ["B6"] },
  { id: "B8",  title: "SaaS有料顧客10人を獲得",                               category: "business", priority: "high",   status: "todo", deadline: "2026-10-31", dependsOn: ["B3"] },
  { id: "B9",  title: "両者の副業ポリシーを確認",                               category: "business", priority: "critical",status: "todo" },
  { id: "B10", title: "SaaS検証: 興味ユーザー5人＋ベータテスター2人",              category: "business", priority: "high",   status: "todo", deadline: "2026-06-15", dependsOn: ["B1"] },
  { id: "B11", title: "こうめ: ライティングサンプル3〜5本作成",                    category: "business", priority: "medium", status: "todo", deadline: "2026-06-30" },
  { id: "B12", title: "SaaS月収$2K超で法人設立を検討",                          category: "business", priority: "medium", status: "todo" },

  // ── 生活・ロジ ──────────────────────────────────────────────────────────
  { id: "L1",  title: "毎月¥100,000+の貯金を開始",                            category: "life", priority: "critical", status: "todo", deadline: "2026-04-01" },
  { id: "L2",  title: "モントキアラのアパートを調査",                            category: "life", priority: "medium",   status: "todo", deadline: "2026-08-01" },
  { id: "L3",  title: "KL到着後最初の1ヶ月のAirbnbを予約",                      category: "life", priority: "high",     status: "todo", deadline: "2026-10-01", dependsOn: ["V10"] },
  { id: "L4",  title: "東京のアパートの退去通知",                               category: "life", priority: "high",     status: "todo", deadline: "2026-10-01", dependsOn: ["V10"] },
  { id: "L5",  title: "荷物の売却・発送",                                     category: "life", priority: "medium",   status: "todo", deadline: "2026-10-15", dependsOn: ["L4"] },
  { id: "L6",  title: "日本の公共料金・サブスクを解約",                          category: "life", priority: "medium",   status: "todo", deadline: "2026-10-25", dependsOn: ["L4"] },
  { id: "L7",  title: "東京→KLのフライトを予約",                               category: "life", priority: "high",     status: "todo", deadline: "2026-10-10", dependsOn: ["V10"] },
  { id: "L8",  title: "貯金¥1,200,000+を達成",                               category: "life", priority: "critical", status: "todo", deadline: "2026-10-31", dependsOn: ["L1"] },
  { id: "L9",  title: "Grab・Touch 'n Goアプリをダウンロード",                  category: "life", priority: "low",      status: "todo", deadline: "2026-11-01" },
  { id: "L10", title: "KLIA到着時にSIMカードを購入",                           category: "life", priority: "high",     status: "todo", deadline: "2026-11-01" },
  { id: "L11", title: "マレーシアの銀行口座を開設",                             category: "life", priority: "high",     status: "todo", deadline: "2026-11-21", dependsOn: ["L10"] },
  { id: "L12", title: "アパート保証金MYR 10,500+を予算化",                     category: "life", priority: "critical", status: "todo" },
  { id: "L13", title: "マレーシアの税理士に相談",                               category: "life", priority: "high",     status: "todo", deadline: "2027-12-01" },

  // ── テック ──────────────────────────────────────────────────────────────
  { id: "T1",  title: "Next.js + Supabaseプロジェクトを初期化",                category: "tech", priority: "high",   status: "todo", deadline: "2026-04-05" },
  { id: "T2",  title: "認証を設定（2ユーザー用メール/パスワード）",                category: "tech", priority: "high",   status: "todo", deadline: "2026-04-07", dependsOn: ["T1"] },
  { id: "T3",  title: "ダッシュボードページを構築",                             category: "tech", priority: "high",   status: "todo", deadline: "2026-04-14", dependsOn: ["T2"] },
  { id: "T4",  title: "チェックリストページを構築",                             category: "tech", priority: "high",   status: "todo", deadline: "2026-04-14", dependsOn: ["T2"] },
  { id: "T5",  title: "収入トラッキングページを構築",                            category: "tech", priority: "high",   status: "todo", deadline: "2026-04-21", dependsOn: ["T2"] },
  { id: "T6",  title: "ビザトラッカーページを構築",                              category: "tech", priority: "medium", status: "todo", deadline: "2026-04-28", dependsOn: ["T2"] },
  { id: "T7",  title: "メモページを構築",                                     category: "tech", priority: "medium", status: "todo", deadline: "2026-05-05", dependsOn: ["T2"] },
  { id: "T8",  title: "意思決定ログページを構築",                               category: "tech", priority: "low",    status: "todo", deadline: "2026-05-12", dependsOn: ["T2"] },
  { id: "T9",  title: "Vercelにデプロイ",                                    category: "tech", priority: "high",   status: "todo", deadline: "2026-04-07", dependsOn: ["T1"] },
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
  // フェーズA — 基盤づくり（2026年4〜6月）
  { id: "VA1", phase: "A", title: "婚姻届を提出（日本で）",                              status: "pending", dueDate: "2026-04-15", sortOrder: 1  },
  { id: "VA2", phase: "A", title: "DataAnnotation/Outlierの仕事を開始",                  status: "pending", dueDate: "2026-04-07", sortOrder: 2  },
  { id: "VA3", phase: "A", title: "USD受取口座を開設（Wise）",                           status: "pending", dueDate: "2026-04-14", sortOrder: 3  },
  { id: "VA4", phase: "A", title: "毎月¥100,000+の貯金を開始",                          status: "pending", dueDate: "2026-04-14", sortOrder: 4  },
  { id: "VA5", phase: "A", title: "2〜3ヶ月分の収入証明を構築",                          status: "pending", dueDate: "2026-06-01", sortOrder: 5  },
  { id: "VA6", phase: "A", title: "パスポート更新（残り18ヶ月未満の場合）",                status: "pending", dueDate: "2026-05-31", sortOrder: 6  },
  { id: "VA7", phase: "A", title: "健康保険の見積もりを取得",                             status: "pending", dueDate: "2026-06-30", sortOrder: 7  },

  // フェーズB — 収入構築（2026年5〜8月）
  { id: "VB1", phase: "B", title: "フリーランスプロフィールを公開",                       status: "pending", dueDate: "2026-05-15", sortOrder: 8  },
  { id: "VB2", phase: "B", title: "初のフリーランス契約を獲得",                           status: "pending", dueDate: "2026-06-30", sortOrder: 9  },
  { id: "VB3", phase: "B", title: "SaaS MVPの構築を開始",                               status: "pending", dueDate: "2026-07-01", sortOrder: 10 },
  { id: "VB4", phase: "B", title: "副収入を$1,500〜2,500/月に拡大",                     status: "pending", dueDate: "2026-08-31", sortOrder: 11 },

  // フェーズC — ビザ申請（2026年8〜9月）
  { id: "VC1", phase: "C", title: "全ビザ書類を準備",                                   status: "pending", dueDate: "2026-08-07", sortOrder: 12 },
  { id: "VC2", phase: "C", title: "MDECポータルでDE Rantau申請を提出",                  status: "pending", dueDate: "2026-08-14", sortOrder: 13 },
  { id: "VC3", phase: "C", title: "審査期間（2〜4週間）",                                status: "pending", dueDate: "2026-09-07", sortOrder: 14 },
  { id: "VC4", phase: "C", title: "承認を受領",                                         status: "pending", dueDate: "2026-09-14", sortOrder: 15 },

  // フェーズD — 引越し（2026年10〜11月）
  { id: "VD1", phase: "D", title: "フライトを予約（東京→KL）",                          status: "pending", dueDate: "2026-10-07", sortOrder: 16 },
  { id: "VD2", phase: "D", title: "モントキアラのアパートを確保",                         status: "pending", dueDate: "2026-10-07", sortOrder: 17 },
  { id: "VD3", phase: "D", title: "東京のアパート退去・荷物発送/売却",                    status: "pending", dueDate: "2026-10-21", sortOrder: 18 },
  { id: "VD4", phase: "D", title: "公共料金解約・郵便転送設定",                           status: "pending", dueDate: "2026-10-28", sortOrder: 19 },
  { id: "VD5", phase: "D", title: "クアラルンプールに到着！",                             status: "pending", dueDate: "2026-11-01", sortOrder: 20 },
  { id: "VD6", phase: "D", title: "入国手続きを完了",                                   status: "pending", dueDate: "2026-11-07", sortOrder: 21 },
  { id: "VD7", phase: "D", title: "現地銀行口座開設＋SIMカード取得",                      status: "pending", dueDate: "2026-11-14", sortOrder: 22 },
];

export const seedDocuments: TrackerDocument[] = [
  { id: "D1",  name: "有効なパスポート（二人とも、残り18ヶ月以上）",            status: "not_started" },
  { id: "D2",  name: "婚姻証明書（英訳付き）",                               status: "not_started" },
  { id: "D3",  name: "収入証明 — 3ヶ月分の銀行明細",                          status: "not_started" },
  { id: "D4",  name: "雇用契約書またはフリーランス請求書",                      status: "not_started" },
  { id: "D5",  name: "履歴書（二人とも）",                                    status: "not_started" },
  { id: "D6",  name: "デジタルワークのポートフォリオ",                          status: "not_started" },
  { id: "D7",  name: "健康保険/旅行保険の証券",                               status: "not_started" },
  { id: "D8",  name: "証明写真（白背景）",                                    status: "not_started" },
  { id: "D9",  name: "MDEC申請書（記入済み）",                                status: "not_started" },
  { id: "D10", name: "宿泊証明（Airbnb予約確認書）",                           status: "not_started" },
];

export const seedSettings: Settings = {
  userNames: ["Daito", "Koume"],
  preferredCurrency: "JPY",
};
