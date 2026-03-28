# Master Plan Deep Dive — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create three deep-dive module documents (EN + JA) that fill gaps in the master plan, then update both MASTER_PLAN.md and MASTER_PLAN_JA.md with revised financials, new checklists, and module pointers.

**Architecture:** Each module is a standalone markdown document in `docs/modules/`. The master plan files get surgical edits: replaced savings tables, new checklist sections, new risk entries, and links to the modules. All content is produced in both English and Japanese.

**Spec:** `docs/superpowers/specs/2026-03-28-master-plan-deep-dive-design.md`

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `docs/modules/01-revised-financial-model.md` | Create | EN — Full financial model with exit costs, KL setup, checkpoint gate, delay strategy |
| `docs/modules/01-revised-financial-model_ja.md` | Create | JA translation of above |
| `docs/modules/02-japan-exit-procedures.md` | Create | EN — Step-by-step Japan exit playbook |
| `docs/modules/02-japan-exit-procedures_ja.md` | Create | JA translation of above |
| `docs/modules/03-malaysia-setup-and-tax.md` | Create | EN — KL first-month playbook + tax + entity strategy |
| `docs/modules/03-malaysia-setup-and-tax_ja.md` | Create | JA translation of above |
| `MASTER_PLAN.md` | Modify | Replace savings table, add exit procedures section, add new checklists, update risks, add module links |
| `MASTER_PLAN_JA.md` | Modify | Same modifications in Japanese |

---

### Task 1: Create Module 1 — Revised Financial Model (EN)

**Files:**
- Create: `docs/modules/01-revised-financial-model.md`

- [ ] **Step 1: Create the docs/modules directory**

Run: `mkdir -p docs/modules`

- [ ] **Step 2: Write the English financial model document**

Create `docs/modules/01-revised-financial-model.md` with the following content:

```markdown
# Module 1: Revised Financial Model

> Part of [Malaysia Sakusen Master Plan](../../MASTER_PLAN.md) | Updated: 2026-03-28

---

## Overview

This module replaces the original savings projections with a comprehensive model accounting for:
- Conservative side income estimates (reflecting full-time work constraints)
- All Japan exit costs (flights, apartment, pension, insurance, tax contingency)
- All KL setup costs (Airbnb, apartment deposit, essentials)
- Tiered delay strategy with August checkpoint gate
- 住民税 deferred via 納税管理人 (not paid before departure)
- 年金 lump-sum withdrawal preserved as emergency-only option

---

## Revised Savings Target

Monthly savings: **¥60,000** (living on ~¥540,000/mo combined from ¥600,000 after-tax income).

Side income uses conservative projections — DataAnnotation task availability is unpredictable, Upwork requires months to build reviews, and partner is ramping skills from scratch.

| Month | Salary Savings | Side Income | Cumulative |
|-------|---------------|-------------|------------|
| Apr 2026 | ¥60,000 | ¥0 | ¥60,000 |
| May | ¥60,000 | ¥15,000 | ¥135,000 |
| Jun | ¥60,000 | ¥30,000 | ¥225,000 |
| Jul | ¥60,000 | ¥60,000 | ¥345,000 |
| Aug | ¥60,000 | ¥90,000 | ¥495,000 |
| Sep | ¥60,000 | ¥120,000 | ¥675,000 |
| Oct | ¥60,000 | ¥150,000 | ¥885,000 |
| **Total** | **¥420,000** | **¥465,000** | **¥885,000 (~$5,900)** |

### Side Income Assumptions (Conservative)

| Month | DataAnnotation/Outlier (you) | CrowdWorks + other (partner) | Total |
|-------|------------------------------|------------------------------|-------|
| Apr | ¥0 (awaiting approval) | ¥0 (setting up) | ¥0 |
| May | ¥10,000 | ¥5,000 | ¥15,000 |
| Jun | ¥20,000 | ¥10,000 | ¥30,000 |
| Jul | ¥40,000 | ¥20,000 | ¥60,000 |
| Aug | ¥60,000 | ¥30,000 | ¥90,000 |
| Sep | ¥80,000 | ¥40,000 | ¥120,000 |
| Oct | ¥100,000 | ¥50,000 | ¥150,000 |

---

## Exit Costs (Paid Before Departure from Japan)

| Item | Low | High | Notes |
|------|-----|------|-------|
| Flights (2x Tokyo→KL one-way) | ¥80,000 | ¥150,000 | October/November booking |
| Apartment exit (cleaning, repairs) | ¥50,000 | ¥150,000 | Minus 敷金 return |
| Shipping/disposal of belongings | ¥50,000 | ¥100,000 | Ship minimal, sell/donate rest |
| DE Rantau visa fees | ¥30,000 | ¥60,000 | ~MYR 1,000–2,000 |
| 国民年金 gap (1-2 months, 2 people) | ¥34,000 | ¥68,000 | Between resignation and departure |
| 国民健康保険 bridge (if gap, 2 people) | ¥0 | ¥100,000 | Prorated; minimize via 有給休暇 strategy |
| Internet cancellation fee | ¥0 | ¥20,000 | Check contract for 解約金 |
| 確定申告 additional tax contingency | ¥0 | ¥100,000 | Side income not withheld at source |
| **Total exit costs** | **¥244,000** | **¥688,000** | |

---

## KL Setup Costs (Paid on Arrival)

| Item | Low | High | Notes |
|------|-----|------|-------|
| Airbnb first month | ¥95,000 | ¥145,000 | MYR 3,000–4,500 in Mont Kiara |
| Apartment deposit (3.5x monthly rent) | ¥230,000 | ¥370,000 | MYR 7,000–10,500 for MYR 2,500–3,000/mo unit |
| SIM + transport + essentials | ¥15,000 | ¥30,000 | MYR 500–1,000 |
| **Total KL setup** | **¥340,000** | **¥545,000** | |

---

## Reconciled Landing Position (November 2026)

| Scenario | Savings | Exit Costs | KL Setup | Cash at Landing |
|----------|---------|------------|----------|-----------------|
| Best case | ¥885,000 | -¥244,000 | -¥340,000 | **¥301,000 ($2,010)** |
| Mid case | ¥885,000 | -¥466,000 | -¥440,000 | **-¥21,000 (negative)** |
| Worst case | ¥885,000 | -¥688,000 | -¥545,000 | **-¥348,000 (negative)** |

**Assessment:** At ¥60,000/mo savings with conservative side income, only the best-case scenario is viable for November. The August checkpoint gate and tiered delay strategy below are load-bearing.

---

## 住民税 (Resident Tax — Paid from KL)

Not paid before departure. Deferred via 納税管理人.

| Item | Detail |
|------|--------|
| Estimated liability | ¥500,000–800,000 for 2026 partial-year earnings |
| Payment method | Quarterly installments via 納税管理人 from Malaysia |
| Timeline | Billed mid-2027, paid over 6–9 months |
| Monthly impact | ~¥55,000–130,000/mo added to KL expenses temporarily |
| Why defer | Keeps ¥500K–800K in hand at departure. Paid from ongoing KL income instead. |

---

## 年金 Lump-Sum Withdrawal (Emergency Only)

| Item | Detail |
|------|--------|
| Estimated amount | ¥600,000–1,200,000 combined (depends on years contributed) |
| Status | **NOT planned into budget.** Emergency option only. |
| Decision window | 2 years after departure (until ~November 2028) |
| Trade-off | Claiming erases contributed years from pension record. If returning to Japan, those years are permanently lost toward the 10-year minimum for receiving 老齢基礎年金 (basic pension). |
| Recommendation | Don't claim unless facing a genuine emergency. Preserve contribution years in case of return to Japan. |

---

## August Checkpoint Gate

Evaluate in **August 2026** to determine move timing:

| Metric | Minimum to proceed with Nov/Dec | If not met |
|--------|----------------------------------|------------|
| Total savings | ¥400,000+ | Delay to December, then January |
| Side income run rate | ¥80,000+/mo ($530+) | Delay to December, then January |
| 納税管理人 identified | Yes | Must arrange before any departure |
| DE Rantau application submitted | Yes (or ready to submit) | — |

---

## Tiered Delay Strategy

```
August checkpoint
├── On track → November 2026 move (best case, before Jan 1)
├── Close but not quite → December 2026 move (still before Jan 1, no extra 住民税)
│   Adds: ~¥60,000 salary + ~¥150,000 side income = ~¥210,000 extra
│   New total: ~¥1,095,000
└── Not on track → January 2027 move (leave by Jan 31, accept small 住民税 hit)
    └── Still not ready by Jan → Serious reassessment needed
```

### January Delay: 住民税 Impact

Being registered in Japan on January 1, 2027 triggers 住民税 assessment on ALL 2027 income — even income earned in Malaysia after departure.

| Departure timing | 住民税 on 2027 income | Extra savings gained | Net gain |
|-----------------|----------------------|---------------------|----------|
| November 2026 | ¥0 | ¥0 (baseline) | Baseline |
| December 2026 | ¥0 | ~¥210,000 | **+¥210,000** |
| January 31, 2027 | ~¥30,000 (Jan salary only) | ~¥440,000 | **+¥410,000** |
| February 28, 2027 | ~¥80,000 (Jan-Feb salary) | ~¥670,000 | **+¥590,000** |
| March 2027+ | ~¥100,000–180,000+ | Diminishing returns | Clock is ticking |

**Key insight:** January departure is not terrible — the 住民税 hit (~¥30,000) is small relative to the extra savings (~¥440,000). But every month past January erodes the benefit. If you delay to January, **leave by January 31 at the latest.**

**The trap:** Once past Jan 1, there's a temptation to keep delaying ("just one more month of savings"). Each month adds income but also adds 住民税 liability. The net gain per month decreases. Set a hard deadline.

### Landing Position by Move Date (Mid-Case)

| Move date | Total savings | Exit costs (mid) | KL setup (mid) | Cash at landing |
|-----------|--------------|-------------------|-----------------|-----------------|
| Nov 2026 | ¥885,000 | -¥466,000 | -¥440,000 | **-¥21,000** |
| Dec 2026 | ¥1,095,000 | -¥466,000 | -¥440,000 | **¥189,000 ($1,260)** |
| Jan 2027 | ¥1,325,000 | -¥496,000 | -¥440,000 | **¥389,000 ($2,590)** |

**December is the realistic target.** Positive landing buffer at mid-case, preserves Jan 1 住民税 advantage, only 1 month later than original.

---

## Key Framing

**The real safety net is income, not savings.** Savings cover the transition. Ongoing income against ~$2,000/mo KL expenses is what makes this sustainable. The plan succeeds or fails on income velocity, not savings buffer.

With ¥60,000/mo savings, side income isn't a nice-to-have — **it's the difference between going and not going.**
```

- [ ] **Step 3: Commit**

```bash
git add docs/modules/01-revised-financial-model.md
git commit -m "docs: add Module 1 — Revised Financial Model (EN)"
```

---

### Task 2: Create Module 1 — Revised Financial Model (JA)

**Files:**
- Create: `docs/modules/01-revised-financial-model_ja.md`

- [ ] **Step 1: Write the Japanese financial model document**

Create `docs/modules/01-revised-financial-model_ja.md` — a full Japanese translation of the EN version. Use the same structure and formatting. Key translation notes:

- Title: `# モジュール1: 改訂版ファイナンシャルモデル`
- Keep all ¥/$/MYR amounts as-is (do not convert)
- Keep English terms where they are commonly used in Japanese context (e.g., "DataAnnotation", "Upwork", "Airbnb", "DE Rantau", "SaaS", "Wise")
- Translate section headers, table headers, explanatory text, and assessment notes
- Keep the same markdown table structure
- Match the tone of `MASTER_PLAN_JA.md` (direct, practical)

Full content:

```markdown
# モジュール1: 改訂版ファイナンシャルモデル

> [マレーシア作戦マスタープラン](../../MASTER_PLAN_JA.md)の一部 | 更新日: 2026年3月28日

---

## 概要

このモジュールは、以下を考慮した包括的なモデルで元の貯蓄予測を置き換えます:
- 保守的な副収入見積もり（フルタイム勤務中の制約を反映）
- 日本出国にかかる全費用（航空券、退去費、年金、保険、税金）
- KL到着時の全費用（Airbnb、敷金、生活立ち上げ）
- 8月チェックポイントによる段階的延期戦略
- 住民税は納税管理人経由で出国後に支払い（出国前に支払わない）
- 年金脱退一時金は緊急時のみのオプションとして温存

---

## 改訂版貯蓄目標

月間貯蓄額: **¥60,000**（手取り¥600,000から生活費約¥540,000を差し引き）

副収入は保守的な見積もり — DataAnnotationのタスク量は予測不可能、Upworkでのレビュー構築には数ヶ月必要、パートナーはスキル習得中。

| 月 | 給与からの貯蓄 | 副収入 | 累計 |
|----|--------------|--------|------|
| 2026年4月 | ¥60,000 | ¥0 | ¥60,000 |
| 5月 | ¥60,000 | ¥15,000 | ¥135,000 |
| 6月 | ¥60,000 | ¥30,000 | ¥225,000 |
| 7月 | ¥60,000 | ¥60,000 | ¥345,000 |
| 8月 | ¥60,000 | ¥90,000 | ¥495,000 |
| 9月 | ¥60,000 | ¥120,000 | ¥675,000 |
| 10月 | ¥60,000 | ¥150,000 | ¥885,000 |
| **合計** | **¥420,000** | **¥465,000** | **¥885,000（約$5,900）** |

### 副収入の内訳（保守的見積もり）

| 月 | DataAnnotation/Outlier（自分） | CrowdWorks等（パートナー） | 合計 |
|----|-------------------------------|---------------------------|------|
| 4月 | ¥0（承認待ち） | ¥0（準備中） | ¥0 |
| 5月 | ¥10,000 | ¥5,000 | ¥15,000 |
| 6月 | ¥20,000 | ¥10,000 | ¥30,000 |
| 7月 | ¥40,000 | ¥20,000 | ¥60,000 |
| 8月 | ¥60,000 | ¥30,000 | ¥90,000 |
| 9月 | ¥80,000 | ¥40,000 | ¥120,000 |
| 10月 | ¥100,000 | ¥50,000 | ¥150,000 |

---

## 出国費用（日本出発前に支払い）

| 項目 | 低 | 高 | 備考 |
|------|-----|------|------|
| 航空券（2名分 東京→KL片道） | ¥80,000 | ¥150,000 | 10月/11月予約 |
| 退去費用（清掃、修繕） | ¥50,000 | ¥150,000 | 敷金返還分を差し引き |
| 荷物の発送/処分 | ¥50,000 | ¥100,000 | 最小限を発送、残りは売却/寄付 |
| DE Rantauビザ申請費用 | ¥30,000 | ¥60,000 | MYR 1,000〜2,000 |
| 国民年金（1〜2ヶ月分、2人分） | ¥34,000 | ¥68,000 | 退職から出国までの間 |
| 国民健康保険（空白期間、2人分） | ¥0 | ¥100,000 | 日割り計算、有給休暇活用で最小化 |
| インターネット解約金 | ¥0 | ¥20,000 | 契約内容を確認 |
| 確定申告追加納税分 | ¥0 | ¥100,000 | 副収入の源泉徴収なし分 |
| **出国費用合計** | **¥244,000** | **¥688,000** | |

---

## KL到着時費用

| 項目 | 低 | 高 | 備考 |
|------|-----|------|------|
| Airbnb初月 | ¥95,000 | ¥145,000 | モントキアラでMYR 3,000〜4,500 |
| 賃貸デポジット（家賃の3.5倍） | ¥230,000 | ¥370,000 | MYR 2,500〜3,000/月の物件でMYR 7,000〜10,500 |
| SIM・交通・生活必需品 | ¥15,000 | ¥30,000 | MYR 500〜1,000 |
| **KL費用合計** | **¥340,000** | **¥545,000** | |

---

## 着地時の残高シミュレーション（2026年11月）

| シナリオ | 貯蓄 | 出国費用 | KL費用 | 着地時残高 |
|----------|------|----------|--------|-----------|
| 最良 | ¥885,000 | -¥244,000 | -¥340,000 | **¥301,000（$2,010）** |
| 中間 | ¥885,000 | -¥466,000 | -¥440,000 | **-¥21,000（マイナス）** |
| 最悪 | ¥885,000 | -¥688,000 | -¥545,000 | **-¥348,000（マイナス）** |

**評価:** 月¥60,000の貯蓄と保守的な副収入では、11月移住は最良シナリオでのみ成立。以下の8月チェックポイントと段階的延期戦略が計画の要。

---

## 住民税（KLから納税管理人経由で支払い）

出国前には支払わない。納税管理人を通じて後払い。

| 項目 | 詳細 |
|------|------|
| 推定納税額 | 2026年分として¥500,000〜800,000 |
| 支払方法 | 納税管理人経由で分割払い |
| タイミング | 2027年中頃に請求、6〜9ヶ月で分割 |
| 月々の影響 | KLの生活費に一時的に月¥55,000〜130,000が上乗せ |
| 後払いの理由 | 出国時に¥500K〜800Kを手元に残せる。KLでの収入から支払う。 |

---

## 年金脱退一時金（緊急時のみ）

| 項目 | 詳細 |
|------|------|
| 推定受取額 | 2人合計¥600,000〜1,200,000（納付年数による） |
| ステータス | **予算に組み込まない。** 緊急時のみのオプション。 |
| 請求期限 | 出国後2年以内（2028年11月頃まで） |
| トレードオフ | 請求すると納付済み年数が年金記録から消去。日本に戻る場合、老齢基礎年金の受給に必要な10年の最低加入期間にカウントされなくなる。 |
| 推奨 | 本当の緊急事態でない限り請求しない。将来日本に戻る可能性を考え、加入年数を温存する。 |

---

## 8月チェックポイント

**2026年8月**に以下を評価し、移住時期を決定:

| 指標 | 11月/12月移住の最低条件 | 未達の場合 |
|------|------------------------|-----------|
| 貯蓄総額 | ¥400,000以上 | 12月、その後1月に延期 |
| 副収入ペース | 月¥80,000以上（$530+） | 12月、その後1月に延期 |
| 納税管理人の確保 | 済 | 出国前に必ず手配 |
| DE Rantau申請 | 提出済み（または準備完了） | — |

---

## 段階的延期戦略

```
8月チェックポイント
├── 順調 → 2026年11月移住（最良、1月1日前）
├── あと少し → 2026年12月移住（1月1日前、住民税追加なし）
│   追加: 給与¥60,000 + 副収入¥150,000 = 約¥210,000
│   新合計: 約¥1,095,000
└── 未達 → 2027年1月移住（1月31日までに出国、少額の住民税負担あり）
    └── 1月でも準備不足 → 計画の根本的な見直しが必要
```

### 1月延期時の住民税への影響

2027年1月1日に日本に住民登録があると、2027年の全所得に対して住民税が課税される — マレーシア移住後にマレーシアで稼いだ所得も含む。

| 出国時期 | 2027年所得への住民税 | 追加貯蓄額 | 純増分 |
|---------|---------------------|-----------|--------|
| 2026年11月 | ¥0 | ¥0（基準） | 基準 |
| 2026年12月 | ¥0 | 約¥210,000 | **+¥210,000** |
| 2027年1月31日 | 約¥30,000（1月給与分のみ） | 約¥440,000 | **+¥410,000** |
| 2027年2月28日 | 約¥80,000（1〜2月給与分） | 約¥670,000 | **+¥590,000** |
| 2027年3月以降 | ¥100,000〜180,000+ | 逓減 | 毎月メリット減少 |

**重要:** 1月出国は悪くない — 住民税の負担（約¥30,000）は追加貯蓄（約¥440,000）に比べて小さい。ただし1月以降は毎月メリットが減少。1月に延期する場合、**1月31日までに必ず出国すること。**

**罠:** 1月1日を過ぎると「あと1ヶ月だけ」と延期し続ける誘惑がある。毎月収入は増えるが住民税も増える。月ごとの純増分は減少していく。ハードデッドラインを設定すること。

### 移住時期別の着地時残高（中間シナリオ）

| 移住時期 | 貯蓄総額 | 出国費用（中間） | KL費用（中間） | 着地時残高 |
|---------|---------|-----------------|---------------|-----------|
| 2026年11月 | ¥885,000 | -¥466,000 | -¥440,000 | **-¥21,000** |
| 2026年12月 | ¥1,095,000 | -¥466,000 | -¥440,000 | **¥189,000（$1,260）** |
| 2027年1月 | ¥1,325,000 | -¥496,000 | -¥440,000 | **¥389,000（$2,590）** |

**12月が現実的な目標。** 中間シナリオでプラスの着地残高、1月1日の住民税メリットを維持、元の計画から1ヶ月遅延のみ。

---

## 基本方針

**本当のセーフティネットは貯蓄ではなく収入。** 貯蓄は移行期をカバーするもの。KLでの月約$2,000の生活費に対する継続的な収入こそが持続可能性の鍵。計画の成否は収入のスピードにかかっている。

月¥60,000の貯蓄では、副収入は「あれば嬉しい」ではなく — **行けるか行けないかの分かれ目。**
```

- [ ] **Step 2: Commit**

```bash
git add docs/modules/01-revised-financial-model_ja.md
git commit -m "docs: add Module 1 — Revised Financial Model (JA)"
```

---

### Task 3: Create Module 2 — Japan Exit Procedures (EN)

**Files:**
- Create: `docs/modules/02-japan-exit-procedures.md`

- [ ] **Step 1: Write the English Japan exit procedures document**

Create `docs/modules/02-japan-exit-procedures.md` with the following content:

```markdown
# Module 2: Japan Exit Procedures Playbook

> Part of [Malaysia Sakusen Master Plan](../../MASTER_PLAN.md) | Updated: 2026-03-28

---

## Overview

Step-by-step playbook for cleanly exiting Japan — covering resignation, government procedures, financial transitions, and administrative closures. Organized by timing relative to departure date.

**Both partners are:** Full-time 正社員, both on 社会保険 (company health insurance + pension), both Japanese citizens.

---

## 2–3 Months Before Departure (Aug–Sep 2026)

### Resignation (退職)

| Item | Detail |
|------|--------|
| Notice period | Check your 就業規則 (work rules). Most companies expect 1–3 months. Legal minimum for 正社員 is 2 weeks. |
| Timing | Give notice immediately after DE Rantau visa approval (mid-September). Target last working day: late October/November. |
| Coordinate both | Ensure both final paychecks land before departure. Stagger resignations if employers have different notice periods. |
| Submit 退職届 | This is a formal notification (届), not a request (願). Use 退職届, not 退職願. |
| 有給休暇 strategy | You are legally entitled to use all remaining paid leave. Negotiate to take it at the end of employment — 10–15 days each = 2–3 weeks of paid time to prepare the move while still technically employed and covered by 社会保険. |
| Documents to collect | **退職証明書** (certificate of resignation) and **源泉徴収票** (withholding tax statement) — both needed for final tax return. Request these before your last day. |

### 納税管理人 (Tax Representative)

| Item | Detail |
|------|--------|
| What | A person in Japan authorized to receive tax notices and make payments on your behalf after you leave |
| Who | Family member is simplest and free. Alternative: tax accountant (税理士) for ¥30,000–50,000. |
| How | Submit **納税管理人の届出書** to BOTH: your local tax office (税務署) AND your city/ward office (区役所/市役所). Two separate submissions. |
| Deadline | Before departure. Recommend by October 15, 2026. |
| Why critical | Without this, 住民税 bills have nowhere to go. The city may pursue collection. **This is load-bearing for the entire financial plan** — deferred 住民税 payments depend on this. |

---

## 1 Month Before Departure (Oct 2026)

### Apartment

| Item | Detail |
|------|--------|
| Give notice | Early October for end-of-October/November move-out (1 month notice per your lease). |
| 敷金 return | Expect ¥0–50,000 back after cleaning deductions (ハウスクリーニング). Document apartment condition with timestamped photos at move-out for dispute protection. |

### Health Insurance Transition

| Item | Detail |
|------|--------|
| 社会保険 ends | On your last day of employment |
| Bridge coverage | If there is ANY gap between your last employment day and departure from Japan, you **must** enroll in 国民健康保険 (National Health Insurance) at your city hall. This is a legal obligation, not optional. |
| Strategy | Use 有給休暇 to stay employed as close to departure as possible. If your last employment day is October 25 and you depart November 1, the gap is ~1 week — still enroll for that period. |
| Cost | ~¥30,000–50,000/mo per person. Prorated for partial months. |
| Cancellation | 国民健康保険 is cancelled automatically when you submit 転出届. |

### National Pension (国民年金)

| Item | Detail |
|------|--------|
| After resignation | You are automatically switched from 厚生年金 (employee pension) to 国民年金 Category 1. |
| Cost | ~¥16,980/mo per person |
| Budget | 1–2 months × 2 people = ¥34,000–68,000 |
| 脱退一時金 | Not claiming. 2-year decision window preserved. See Module 1 for details. |

---

## 2 Weeks Before Departure (mid-Oct/Nov 2026)

### 転出届 (Moving-Out Notification)

| Item | Detail |
|------|--------|
| Where | Your city/ward office (区役所/市役所) |
| When | Can be submitted up to 14 days before your planned departure date |
| What it does | Removes you from the 住民登録 (resident register). This officially makes you a non-resident of Japan. |
| Bring | Passport, My Number card (マイナンバーカード), 印鑑 |
| Result | You receive a 転出届証明書. Keep this document — you may need it for various procedures. |
| My Number card | Will be returned/invalidated at this step. |

### The January 1 Rule (Critical)

住民税 is assessed based on where you live on **January 1** of each year.

- **Departing before January 1, 2027** → You will NOT be assessed 住民税 for any 2027 income. This saves ¥400,000–800,000+.
- **Departing after January 1, 2027** → You WILL be assessed 住民税 on all 2027 income, including income earned in Malaysia.

**Do not delay your departure past December 31, 2026 unless absolutely necessary.** If you must delay, leave by January 31 at the latest (see Module 1 for the delay cost analysis).

---

## Final Week Before Departure

### Cancel/Close Checklist

| Item | Action | Notes |
|------|--------|-------|
| Utilities (電気/ガス/水道) | Call each provider, set final date | 1–2 weeks notice usually sufficient |
| Internet | Cancel contract | Check for 解約金 (early termination fee). Budget ¥0–20,000. |
| Mobile phone | Switch to **povo2.0** (¥0 base, pay-as-you-go) | Preserves your JP phone number for SMS verification codes. Do NOT cancel — many JP services require a JP number. |
| NHK | Submit 解約届 | |
| JP subscriptions | Cancel all JP-only services | Make a complete list before cancellation week. Streaming, gym, magazines, etc. |
| Bank accounts | **Keep at least 1 JP bank account open** | Needed for: 住民税 payments via 納税管理人, potential 年金 refund, any future JP transactions. Set up online banking and international transfer capability BEFORE departure. |
| Credit cards | Keep 1–2 with no annual fee | Useful for JP online purchases, emergency backup. Make sure you can pay the bill from overseas (online banking). |
| Mail forwarding | Submit **転送届** at post office | Forwards mail to a JP address (納税管理人's address) for 1 year. Do this at your local post office. |
| Driver's license | Get **国際免許証** at your local 免許センター | Same-day issuance. Valid 1 year. Only needed if you plan to drive in Malaysia. |

---

## After Departure (From Malaysia)

### 確定申告 (Final Tax Return for 2026)

| Item | Detail |
|------|--------|
| Who files | Your 納税管理人 on your behalf. Alternative: you file via e-Tax if you set up access before departure. |
| Deadline | **March 15, 2027** |
| What's included | ALL 2026 income: salary from both employers + all freelance/side income |
| Side income rule | If total side income exceeds ¥200,000/year, filing is mandatory. You will cross this threshold based on the income plan. |
| Documents needed | 源泉徴収票 from both employers (request before last day), freelance invoices and payment records, any deductible expense receipts |
| Potential outcome | You may owe additional income tax if side income was not withheld at source. Budget ¥50,000–100,000 as contingency. |
| Recommendation | Set up e-Tax access before leaving Japan. Even with a 納税管理人, being able to check status online is valuable. |

---

## Complete Checklist

| # | Task | Priority | Deadline |
|---|------|----------|----------|
| E1 | Check 就業規則 for resignation notice period (both employers) | High | Aug 15, 2026 |
| E2 | Identify 納税管理人 (family member or 税理士) | High | Sep 15, 2026 |
| E3 | Submit 納税管理人届出書 to tax office + city hall | Critical | Oct 15, 2026 |
| E4 | Submit 退職届 (both) | Critical | Per notice period |
| E5 | Request 退職証明書 + 源泉徴収票 from employers | High | Last working day |
| E6 | Use remaining 有給休暇 | High | Last working day |
| E7 | Enroll in 国民健康保険 if gap between resignation and departure | High | Day after resignation |
| E8 | Submit 転出届 at city hall | Critical | 14 days before departure |
| E9 | Cancel utilities, NHK, internet | Medium | 1 week before departure |
| E10 | Set up mail forwarding (転送届) at post office | Medium | 1 week before departure |
| E11 | Keep JP bank account open + set up online banking | High | Before departure |
| E12 | Switch mobile to povo2.0 for JP number retention | Low | Before departure |
| E13 | Get 国際免許証 if needed | Low | Before departure |
| E14 | File 確定申告 for 2026 via 納税管理人 | Critical | Mar 15, 2027 |
| E15 | Set up e-Tax access before departure | Medium | Before departure |
```

- [ ] **Step 2: Commit**

```bash
git add docs/modules/02-japan-exit-procedures.md
git commit -m "docs: add Module 2 — Japan Exit Procedures (EN)"
```

---

### Task 4: Create Module 2 — Japan Exit Procedures (JA)

**Files:**
- Create: `docs/modules/02-japan-exit-procedures_ja.md`

- [ ] **Step 1: Write the Japanese Japan exit procedures document**

Create `docs/modules/02-japan-exit-procedures_ja.md` — a full Japanese translation of the EN version. Use the same structure and formatting.

Key translation notes:
- Title: `# モジュール2: 日本出国手続きプレイブック`
- Japanese government/legal terms should appear in their original Japanese (転出届, 納税管理人, etc.) — they already are in the EN version
- Where the EN version uses Japanese terms in parentheses, the JA version should use the Japanese term as the primary with English in parentheses only where helpful for clarity
- Match the tone of `MASTER_PLAN_JA.md`

Full content:

```markdown
# モジュール2: 日本出国手続きプレイブック

> [マレーシア作戦マスタープラン](../../MASTER_PLAN_JA.md)の一部 | 更新日: 2026年3月28日

---

## 概要

日本からの出国を漏れなく完了するためのステップバイステップガイド — 退職、行政手続き、社会保険・年金の移行、各種解約をカバー。出国日からの逆算で整理。

**2人とも:** 正社員、社会保険加入、日本国籍。

---

## 出国2〜3ヶ月前（2026年8〜9月）

### 退職

| 項目 | 詳細 |
|------|------|
| 退職予告期間 | 就業規則を確認。多くの企業は1〜3ヶ月前を想定。法的最低限は2週間前。 |
| タイミング | DE Rantauビザ承認後（9月中旬）すぐに退職届を提出。最終出勤日の目標: 10月末〜11月初旬。 |
| 2人の調整 | 最終給与が出国前に振り込まれるよう調整。予告期間が異なる場合はずらして対応。 |
| 退職届の提出 | 「退職願」ではなく「退職届」を提出。届は通知であり、願は許可を求めるもの。 |
| 有給休暇の活用 | 残っている有給休暇は法的に使う権利がある。退職前にまとめて取得を交渉 — 各10〜15日 = 2〜3週間の有給期間で引越し準備ができ、かつ社会保険が継続される。 |
| 取得すべき書類 | **退職証明書**と**源泉徴収票** — 確定申告に必要。最終出勤日までに必ず依頼すること。 |

### 納税管理人

| 項目 | 詳細 |
|------|------|
| 何か | 出国後に税務関連の通知を受け取り、代わりに納税する人 |
| 誰に頼むか | 家族（最もシンプルで無料）。代替: 税理士（¥30,000〜50,000） |
| 手続き | **納税管理人の届出書**を以下の両方に提出: 管轄の税務署 AND 区役所/市役所。2箇所への提出が必要。 |
| 期限 | 出国前。2026年10月15日までを推奨。 |
| 重要性 | これがないと住民税の通知が届かず、自治体が徴収手続きに入る可能性がある。**ファイナンシャルプラン全体がこの手続きに依存している** — 住民税の後払い戦略はこれが前提。 |

---

## 出国1ヶ月前（2026年10月）

### 賃貸住居

| 項目 | 詳細 |
|------|------|
| 退去通知 | 10月初旬に通知（1ヶ月前通知の契約条件）。10月末〜11月の退去を目指す。 |
| 敷金返還 | ハウスクリーニング費用差し引き後、¥0〜50,000程度の返還を見込む。退去時にタイムスタンプ付きの写真で部屋の状態を記録しておく。 |

### 健康保険の移行

| 項目 | 詳細 |
|------|------|
| 社会保険の終了 | 退職日に終了 |
| 空白期間の対応 | 退職日から出国日までに**1日でも空白がある場合**、国民健康保険への加入が**法的義務**。区役所/市役所で手続き。 |
| 戦略 | 有給休暇を活用して、できる限り出国日近くまで雇用状態を維持。退職日10月25日・出国日11月1日の場合、約1週間の空白 — それでも加入が必要。 |
| 費用 | 1人あたり月約¥30,000〜50,000。月の途中は日割り計算。 |
| 解約 | 転出届の提出時に自動的に解約される。 |

### 国民年金

| 項目 | 詳細 |
|------|------|
| 退職後 | 厚生年金から国民年金第1号に自動切替 |
| 費用 | 1人あたり月約¥16,980 |
| 予算 | 1〜2ヶ月 × 2人 = ¥34,000〜68,000 |
| 脱退一時金 | 請求しない。2年間の請求猶予期間を温存。詳細はモジュール1参照。 |

---

## 出国2週間前（10月/11月中旬）

### 転出届

| 項目 | 詳細 |
|------|------|
| 届出先 | 区役所/市役所 |
| 届出時期 | 出国予定日の14日前から提出可能 |
| 効果 | 住民登録から除かれ、公式に日本の非居住者となる |
| 持ち物 | パスポート、マイナンバーカード、印鑑 |
| 結果 | 転出届証明書を受け取る。保管しておくこと。 |
| マイナンバーカード | この手続きで返納/無効化される |

### 1月1日ルール（極めて重要）

住民税は、**毎年1月1日時点の住所地**で課税される。

- **2027年1月1日前に出国** → 2027年の所得に住民税はかからない。¥400,000〜800,000以上の節約。
- **2027年1月1日以降に出国** → マレーシアで稼いだ所得を含む、2027年の全所得に住民税が課税される。

**絶対に必要でない限り、2026年12月31日を過ぎて出国を延期しないこと。** やむを得ず延期する場合は、1月31日までに出国（延期コストの分析はモジュール1参照）。

---

## 出国直前の週

### 解約・手続きチェックリスト

| 項目 | アクション | 備考 |
|------|----------|------|
| 公共料金（電気/ガス/水道） | 各事業者に連絡、最終日を設定 | 1〜2週間前に連絡 |
| インターネット | 解約 | 解約金（¥0〜20,000）を確認 |
| 携帯電話 | **povo2.0**に切替（基本料¥0） | 日本の電話番号を維持。SMS認証に必要なので解約しない。 |
| NHK | 解約届を提出 | |
| 各種サブスクリプション | 日本限定サービスを全て解約 | 事前にリストアップ。動画配信、ジム等。 |
| 銀行口座 | **最低1口座は維持** | 住民税の支払い（納税管理人経由）、年金還付の可能性、将来の日本関連取引に必要。出国前にネットバンキングと海外送金の設定を完了。 |
| クレジットカード | 年会費無料のカードを1〜2枚維持 | 日本のオンライン購入や緊急時のバックアップ。海外からの支払い方法を確認。 |
| 郵便転送 | 郵便局で**転送届**を提出 | 納税管理人の住所宛に1年間転送。最寄りの郵便局で手続き。 |
| 運転免許 | 必要なら**国際免許証**を免許センターで取得 | 即日発行。有効期間1年。マレーシアで運転する場合のみ。 |

---

## 出国後（マレーシアから）

### 確定申告（2026年分）

| 項目 | 詳細 |
|------|------|
| 申告者 | 納税管理人が代理。代替: 出国前にe-Taxを設定しておけば自分で申告可能。 |
| 期限 | **2027年3月15日** |
| 対象所得 | 2026年の全所得: 2人分の給与所得 + フリーランス/副収入全て |
| 副収入のルール | 副収入の合計が年¥200,000を超えると申告義務あり。収入計画に基づけば確実に超過。 |
| 必要書類 | 源泉徴収票（退職時に取得済み）、フリーランスの請求書・入金記録、経費の領収書 |
| 想定結果 | 源泉徴収されていない副収入分の追加納税が必要になる可能性。¥50,000〜100,000を予備として確保。 |
| 推奨 | 出国前にe-Taxのアクセスを設定しておく。納税管理人がいても、オンラインで状況確認できると便利。 |

---

## 完全チェックリスト

| # | タスク | 優先度 | 期限 |
|---|--------|--------|------|
| E1 | 就業規則で退職予告期間を確認（2社とも） | 高 | 2026年8月15日 |
| E2 | 納税管理人を決める（家族または税理士） | 高 | 2026年9月15日 |
| E3 | 納税管理人届出書を税務署+区役所に提出 | 最重要 | 2026年10月15日 |
| E4 | 退職届を提出（2人とも） | 最重要 | 予告期間に応じて |
| E5 | 退職証明書+源泉徴収票を会社に依頼 | 高 | 最終出勤日 |
| E6 | 有給休暇を全て消化 | 高 | 最終出勤日 |
| E7 | 退職〜出国の空白期間がある場合、国民健康保険に加入 | 高 | 退職日の翌日 |
| E8 | 転出届を区役所/市役所に提出 | 最重要 | 出国14日前 |
| E9 | 公共料金、NHK、インターネットの解約 | 中 | 出国1週間前 |
| E10 | 郵便局で転送届を提出 | 中 | 出国1週間前 |
| E11 | 日本の銀行口座を維持+ネットバンキング設定 | 高 | 出国前 |
| E12 | 携帯をpovo2.0に切替（番号維持） | 低 | 出国前 |
| E13 | 必要なら国際免許証を取得 | 低 | 出国前 |
| E14 | 納税管理人経由で2026年分の確定申告 | 最重要 | 2027年3月15日 |
| E15 | 出国前にe-Taxアクセスを設定 | 中 | 出国前 |
```

- [ ] **Step 2: Commit**

```bash
git add docs/modules/02-japan-exit-procedures_ja.md
git commit -m "docs: add Module 2 — Japan Exit Procedures (JA)"
```

---

### Task 5: Create Module 3 — Malaysia Setup & Tax (EN)

**Files:**
- Create: `docs/modules/03-malaysia-setup-and-tax.md`

- [ ] **Step 1: Write the English Malaysia setup document**

Create `docs/modules/03-malaysia-setup-and-tax.md` with the following content:

```markdown
# Module 3: Malaysia Setup & Tax Obligations

> Part of [Malaysia Sakusen Master Plan](../../MASTER_PLAN.md) | Updated: 2026-03-28

---

## Overview

Comprehensive first-month playbook for arriving in Kuala Lumpur, plus tax obligations as a DE Rantau visa holder and business entity strategy for SaaS/digital product income.

---

## Week 1 in KL (November/December 2026)

| Action | Detail |
|--------|--------|
| Immigration | Complete any DE Rantau arrival formalities at immigration |
| SIM card | Hotlink or Digi at KLIA airport. ~MYR 30–50 for tourist SIM. Passport required. Convert to postpaid plan after getting a bank account. |
| Grab app | Set up immediately — this is your primary transport in KL. Link a credit/debit card or pay cash. |
| Touch 'n Go eWallet | Malaysia's dominant e-wallet. Download the app, load via convenience store (7-Eleven, etc.) or bank transfer later. Used for tolls, parking, many shops and restaurants. |
| Groceries | Nearest options in Mont Kiara: Village Grocer, Jaya Grocer, or 1 Mont Kiara mall. |
| Coworking (if needed) | Common Ground or WeWork in Mont Kiara/Publika area. Day passes available. Or work from condo facilities — many Mont Kiara condos have resident lounges. |

---

## Week 2–3: Bank Account

| Item | Detail |
|------|--------|
| Recommended bank | **Maybank** (largest, most ATMs nationwide) or **CIMB** |
| Requirements | Passport, DE Rantau visa approval letter, proof of address |
| Known challenge | Some branches require a utility bill for proof of address — catch-22 for newcomers who don't have a lease yet. Airbnb confirmation may or may not be accepted (depends on branch staff). |
| Backup options | **GXBank** (digital bank, easier process for foreigners) or **BigPay** (prepaid Mastercard with Malaysian IBAN) |
| Strategy | Try Maybank first with visa letter + Airbnb booking as address proof. If rejected at one branch, try a different branch — requirements vary by location. If traditional banks won't work, use GXBank as bridge. |
| Wise as bridge | Continue receiving USD/JPY income via Wise. Transfer to MY bank account only for local expenses. Wise typically offers better exchange rates than Malaysian banks. |

---

## Week 2–4: Housing Transition

| Item | Detail |
|------|--------|
| First month | Airbnb in Mont Kiara. Budget MYR 3,000–4,500/month for a furnished 1BR. |
| Apartment search | **iProperty.com.my** and **PropertyGuru** are the main listing sites. Local agents (check Facebook groups: "Mont Kiara Community", "KL Expat Housing") also useful. Always visit in person — photos can be misleading. |
| Typical lease terms | 1-year minimum. Upfront costs: **2 months deposit + 0.5 month utility deposit + 1 month advance rent = ~3.5x monthly rent.** |
| Example (MYR 3,000/mo) | MYR 10,500 upfront (~$2,270 USD / ~¥340,000). This is a significant cash outlay — budget for it. |
| Negotiation tips | Some landlords accept 1+1 deposit for shorter initial lease terms. Always worth asking. Furnished units are standard in Mont Kiara — don't pay extra for this. |
| What to check | Internet speed (ask for Speedtest screenshot), water pressure, air conditioning condition, building facilities (gym, pool, parking), distance to MRT/LRT station. |

---

## Tax Obligations in Malaysia

### Tax Residency

| Item | Detail |
|------|--------|
| Trigger | You become a Malaysian tax resident if you stay **182+ days** in a calendar year |
| 2026 | Arriving Nov/Dec = ~30–60 days. You are **NOT** tax resident for 2026. No Malaysian tax filing needed. |
| 2027 | If you stay all of 2027, you **ARE** tax resident. Malaysian tax year = calendar year (Jan–Dec). |

### What's Taxed

| Item | Detail |
|------|--------|
| Malaysian-sourced income | Always taxable if you're tax resident |
| Foreign-sourced income | Taxable **when remitted to Malaysia** (since 2022 rule change). This is the relevant rule for DE Rantau holders. |
| DE Rantau income | Your freelance/SaaS/annotation income is foreign-sourced (clients outside MY, work done remotely for non-MY companies). It becomes taxable when you transfer it to a Malaysian bank account. |
| Tax rates | Graduated: 0% on first MYR 5,000, scaling up to 30% at highest bracket. For combined income of ~$4,000/mo (~MYR 18,000/mo), effective rate would be approximately 8–14%. |
| Practical approach | Keep income in Wise or other foreign accounts. Transfer to Malaysian bank only what you need for local expenses. This legally reduces your taxable remittance. |

### Important Actions

| # | Action | Timeline |
|---|--------|----------|
| 1 | Consult a Malaysian tax advisor specializing in expat taxation | Before end of 2027 |
| 2 | Budget MYR 500–1,000 for the consultation | — |
| 3 | Keep records of all international transfers to Malaysian accounts | From day 1 |
| 4 | File Malaysian tax return if required | By April 30, 2028 (for 2027 income) |

**Note:** The rules around foreign-source remittance taxation are evolving and enforcement is increasing. Professional advice is not optional — it's a cost of doing business as an expat.

---

## Business Entity Strategy

| Stage | Entity | Reasoning |
|-------|--------|-----------|
| Pre-revenue / early revenue | **No entity** (sole proprietor) | Zero setup cost, zero complexity. Receive payments personally via Stripe/Gumroad → Wise. |
| SaaS revenue > $2,000/mo consistently | **US LLC** via Stripe Atlas | Clean separation of personal and business finances. ~$500 setup + $100+/yr registered agent fee. Enables proper Stripe merchant account. |
| Later (if local presence needed) | **Malaysian SDN BHD** | MYR 1,000–3,000 setup. Requires a local director (or nominee arrangement). Overkill for early stage — only consider if you need a Malaysian business presence for contracts or banking. |

**Do NOT** register as a Japan 個人事業主 (sole proprietor). You will have submitted 転出届 — operating a Japanese business as a non-resident adds tax complexity for no benefit.

---

## Checklist

| # | Task | Priority | Deadline |
|---|------|----------|----------|
| M1 | Download Grab + Touch 'n Go eWallet apps | Low | Arrival week |
| M2 | Get SIM card at KLIA | High | Arrival day |
| M3 | Open Malaysian bank account | High | Week 2–3 |
| M4 | Research Mont Kiara apartments in person | High | Week 2–3 |
| M5 | Budget MYR 10,500+ for apartment deposit | Critical | Before signing lease |
| M6 | Consult Malaysian tax advisor (expat specialist) | High | By Dec 2027 |
| M7 | Decide on business entity when SaaS revenue > $2K/mo | Medium | When applicable |
```

- [ ] **Step 2: Commit**

```bash
git add docs/modules/03-malaysia-setup-and-tax.md
git commit -m "docs: add Module 3 — Malaysia Setup & Tax (EN)"
```

---

### Task 6: Create Module 3 — Malaysia Setup & Tax (JA)

**Files:**
- Create: `docs/modules/03-malaysia-setup-and-tax_ja.md`

- [ ] **Step 1: Write the Japanese Malaysia setup document**

Create `docs/modules/03-malaysia-setup-and-tax_ja.md` — a full Japanese translation of the EN version.

Key translation notes:
- Title: `# モジュール3: マレーシア生活立ち上げ＆税務`
- Keep brand/service names in English (Grab, Touch 'n Go, Maybank, GXBank, Wise, Stripe Atlas, etc.)
- Keep MYR/USD amounts as-is
- Translate explanatory text, section headers, table headers

Full content:

```markdown
# モジュール3: マレーシア生活立ち上げ＆税務

> [マレーシア作戦マスタープラン](../../MASTER_PLAN_JA.md)の一部 | 更新日: 2026年3月28日

---

## 概要

クアラルンプール到着後の1ヶ月間の行動計画、DE Rantauビザ保持者としての税務義務、SaaS/デジタル商品収入のためのビジネス法人戦略。

---

## KL到着第1週（2026年11月/12月）

| アクション | 詳細 |
|-----------|------|
| 入国手続き | DE Rantauの入国関連手続きを完了 |
| SIMカード | KLIA空港でHotlinkまたはDigiを購入。ツーリストSIMで約MYR 30〜50。パスポート必要。銀行口座開設後にポストペイドに切替。 |
| Grabアプリ | すぐにセットアップ — KLでの主要交通手段。クレジット/デビットカード連携または現金払い。 |
| Touch 'n Go eWallet | マレーシアの主要電子決済。アプリをダウンロードし、コンビニ（7-Eleven等）でチャージ。高速道路料金、駐車場、多くの店舗で利用可能。 |
| 食料品 | モントキアラ最寄り: Village Grocer、Jaya Grocer、1 Mont Kiaraモール |
| コワーキング（必要な場合） | モントキアラ/Publika周辺のCommon GroundやWeWork。デイパスあり。またはコンドミニアムの共有スペース — モントキアラの多くのコンドにはラウンジがある。 |

---

## 第2〜3週: 銀行口座開設

| 項目 | 詳細 |
|------|------|
| 推奨銀行 | **Maybank**（最大手、ATM最多）または**CIMB** |
| 必要書類 | パスポート、DE Rantauビザ承認レター、住所証明 |
| よくある問題 | 住所証明として光熱費の請求書を求める支店がある — まだ賃貸契約していない新規到着者には矛盾。Airbnbの予約確認が認められるかは支店スタッフ次第。 |
| 代替手段 | **GXBank**（デジタル銀行、外国人でも手続きが簡単）または**BigPay**（プリペイドMastercardとマレーシアIBAN付き） |
| 戦略 | まずMaybankにビザレター+Airbnb予約で挑戦。1つの支店で断られたら別の支店へ — 基準は場所によって異なる。従来型銀行がダメならGXBankをつなぎに。 |
| Wiseの活用 | USD/JPYの受取はWiseを継続。マレーシアの銀行口座への送金は現地での支出分のみ。Wiseの方が銀行より為替レートが良い。 |

---

## 第2〜4週: 住居の移行

| 項目 | 詳細 |
|------|------|
| 初月 | モントキアラのAirbnb。家具付き1BRで月MYR 3,000〜4,500を予算化。 |
| 物件探し | **iProperty.com.my**と**PropertyGuru**が主要な物件サイト。現地エージェント（Facebookグループ「Mont Kiara Community」「KL Expat Housing」も有用）。必ず実際に内見 — 写真は実態と異なることが多い。 |
| 一般的な契約条件 | 最低1年契約。初期費用: **敷金2ヶ月分 + 光熱費保証金0.5ヶ月分 + 前家賃1ヶ月分 = 月額家賃の約3.5倍** |
| 例（月MYR 3,000の場合） | 初期費用MYR 10,500（約$2,270 / 約¥340,000）。大きな出費 — 必ず予算に組み込むこと。 |
| 交渉のコツ | 短期契約なら1+1デポジット（通常の2+1ではなく）を受け入れるオーナーもいる。聞いてみる価値あり。モントキアラでは家具付きが標準 — 追加料金を払う必要はない。 |
| チェックポイント | インターネット速度（Speedtestのスクリーンショットを要求）、水圧、エアコンの状態、共有設備（ジム、プール、駐車場）、MRT/LRT駅までの距離。 |

---

## マレーシアでの税務

### 税務上の居住者判定

| 項目 | 詳細 |
|------|------|
| 基準 | 暦年で**182日以上**滞在すると税務上の居住者に |
| 2026年 | 11月/12月到着 = 約30〜60日。2026年は税務上の**非居住者**。申告不要。 |
| 2027年 | 通年滞在なら税務上の**居住者**。マレーシアの課税年度 = 暦年（1月〜12月）。 |

### 課税対象

| 項目 | 詳細 |
|------|------|
| マレーシア国内源泉所得 | 居住者であれば常に課税 |
| 海外源泉所得 | **マレーシアに送金した場合**に課税（2022年からのルール変更）。DE Rantau保持者に関連するルール。 |
| DE Rantau収入 | フリーランス/SaaS/アノテーション収入は海外源泉（マレーシア国外のクライアント、非マレーシア企業向け）。マレーシアの銀行口座に送金した時点で課税対象に。 |
| 税率 | 累進課税: 最初のMYR 5,000は0%、最高税率30%。合計月約$4,000（約MYR 18,000）の場合、実効税率は約8〜14%。 |
| 実務的アプローチ | 収入はWise等の海外口座に保管。マレーシアの銀行には現地支出に必要な分だけ送金。これにより課税対象の送金額を合法的に抑えられる。 |

### 重要なアクション

| # | アクション | 時期 |
|---|----------|------|
| 1 | 駐在員税務に詳しいマレーシアの税理士に相談 | 2027年末まで |
| 2 | 相談料MYR 500〜1,000を予算に | — |
| 3 | マレーシア口座への全送金記録を保管 | 初日から |
| 4 | 必要に応じてマレーシアの確定申告 | 2028年4月30日まで（2027年所得分） |

**注:** 海外源泉所得への課税ルールは変化が続いており、執行も強化されている。専門家への相談は任意ではなく — 駐在生活の必要経費。

---

## ビジネス法人戦略

| 段階 | 法人形態 | 理由 |
|------|---------|------|
| 収益化前/初期 | **法人なし**（個人事業） | 設立コストゼロ、手間ゼロ。Stripe/Gumroad → Wiseで個人として受取。 |
| SaaS月収$2,000以上が安定 | **米国LLC**（Stripe Atlas経由） | 個人と事業の資金を明確に分離。設立約$500 + 年$100以上のRegistered Agent費。Stripeの正式なマーチャントアカウントが可能に。 |
| 将来（必要になれば） | **マレーシアSDN BHD** | 設立MYR 1,000〜3,000。現地取締役（またはノミニー）が必要。初期段階では過剰 — マレーシアでの法人プレゼンスが契約や銀行取引に必要な場合のみ検討。 |

日本で個人事業主として開業届を出しては**いけない**。転出届を提出した以上、非居住者として日本の事業を運営するのは税務が複雑になるだけでメリットがない。

---

## チェックリスト

| # | タスク | 優先度 | 期限 |
|---|--------|--------|------|
| M1 | Grab + Touch 'n Go eWalletアプリをダウンロード | 低 | 到着週 |
| M2 | KLIAでSIMカード購入 | 高 | 到着日 |
| M3 | マレーシアの銀行口座を開設 | 高 | 第2〜3週 |
| M4 | モントキアラの物件を実際に内見 | 高 | 第2〜3週 |
| M5 | 賃貸デポジットMYR 10,500以上を予算化 | 最重要 | 契約署名前 |
| M6 | マレーシアの税理士（駐在員専門）に相談 | 高 | 2027年12月まで |
| M7 | SaaS月収$2K超になったらビジネス法人を検討 | 中 | 該当時 |
```

- [ ] **Step 2: Commit**

```bash
git add docs/modules/03-malaysia-setup-and-tax_ja.md
git commit -m "docs: add Module 3 — Malaysia Setup & Tax (JA)"
```

---

### Task 7: Update MASTER_PLAN.md

**Files:**
- Modify: `MASTER_PLAN.md`

This task makes surgical edits to the existing master plan. Each step is one edit.

- [ ] **Step 1: Add module links after the profile summary section**

After the `---` separator following the "Your Profile Summary" table (after line 23), insert:

```markdown

### Deep-Dive Modules

> These modules expand on the plan with detailed financials, procedures, and setup guides.

- [Module 1: Revised Financial Model](docs/modules/01-revised-financial-model.md) — Conservative savings projections, all exit/setup costs, checkpoint gate, delay strategy
- [Module 2: Japan Exit Procedures](docs/modules/02-japan-exit-procedures.md) — Complete resignation, tax, insurance, and administrative playbook
- [Module 3: Malaysia Setup & Tax](docs/modules/03-malaysia-setup-and-tax.md) — First-month KL playbook, tax obligations, business entity strategy
```

- [ ] **Step 2: Replace the savings table**

Replace the savings table (lines 96–109) with the revised version:

```markdown
### Savings Target

> **See [Module 1: Revised Financial Model](docs/modules/01-revised-financial-model.md) for full details** including exit costs, KL setup costs, and delay scenarios.

| Month | Save from salary | Side income | Cumulative savings |
|-------|-----------------|-------------|-------------------|
| Apr | ¥60,000 | ¥0 | ¥60,000 |
| May | ¥60,000 | ¥15,000 | ¥135,000 |
| Jun | ¥60,000 | ¥30,000 | ¥225,000 |
| Jul | ¥60,000 | ¥60,000 | ¥345,000 |
| Aug | ¥60,000 | ¥90,000 | ¥495,000 |
| Sep | ¥60,000 | ¥120,000 | ¥675,000 |
| Oct | ¥60,000 | ¥150,000 | ¥885,000 |
| **Total** | | | **¥885,000 (~$5,900 USD)** |

Side income uses conservative estimates. ¥885,000 must cover exit costs (¥244K–688K) + KL setup (¥340K–545K). December 2026 is the realistic move target — see Module 1 for full analysis.

#### August Checkpoint Gate

| Metric | Minimum | If not met |
|--------|---------|------------|
| Savings | ¥400,000+ | Delay to December |
| Side income | ¥80,000+/mo | Delay to December |
| 納税管理人 | Identified | Must arrange before departure |
```

- [ ] **Step 3: Add Japan Exit Procedures section**

After the "Risks & Mitigation" table in section 1 (after line 119), insert a new section:

```markdown

### Japan Exit Procedures

> **See [Module 2: Japan Exit Procedures](docs/modules/02-japan-exit-procedures.md) for the complete playbook.**

Both partners must cleanly exit: resign (退職届), arrange a tax representative (納税管理人), submit moving-out notice (転出届), bridge health insurance, and file a final tax return. Critical timing: depart before January 1, 2027 to avoid 住民税 on 2027 income.
```

- [ ] **Step 4: Add new risk entries**

After the existing "Risks & Mitigation" table (line 119), add these rows to the table:

```markdown
| 住民税 lump-sum liability | Arrange 納税管理人 before departure, pay in installments from KL |
| 副業 policy violation discovered | Check 就業規則 before starting any side work; keep side work discreet |
| KL apartment deposit larger than expected | Budget MYR 10,500+ (3.5x rent); negotiate 1+1 deposit for shorter terms |
| Partner income ramp slower than projected | Partner focuses on move logistics (high-ROI unpaid work); reduce partner income assumptions |
```

- [ ] **Step 5: Update the income projection table with conservative estimates**

Replace the Combined Income Projection table (lines 262–275):

```markdown
### Combined Income Projection (Conservative)

| Month | Layer 1 | Layer 2 | Layer 3 | Total |
|-------|---------|---------|---------|-------|
| Apr 2026 | $0 | $0 | $0 | $0 |
| May | $70 | $30 | $0 | $100 |
| Jun | $130 | $70 | $0 | $200 |
| Jul | $270 | $130 | $0 | $400 |
| Aug | $400 | $200 | $0 | $600 |
| Sep | $530 | $270 | $0 | $800 |
| Oct | $670 | $330 | $0 | $1,000 |
| Nov (in MY) | $800 | $500 | $200 | $1,500 |
| Feb 2027 | $600 | $1,200 | $800 | $2,600 |
| May 2027 | $400 | $1,800 | $2,000 | $4,200 |

*Conservative estimates reflecting platform ramp-up realities. See Module 1 for assumptions.*
```

- [ ] **Step 6: Add new checklist items to the existing checklist sections**

Add to the **Visa & Legal** checklist (after V10):

```markdown
| V11 | Check 就業規則 for resignation notice period (both) | High | Aug 15, 2026 | — | Todo |
| V12 | Identify 納税管理人 (family or 税理士) | High | Sep 15, 2026 | — | Todo |
| V13 | Submit 納税管理人届出書 (tax office + city hall) | Critical | Oct 15, 2026 | V12 | Todo |
| V14 | Submit 退職届 (both) | Critical | Per notice period | V10,V11 | Todo |
| V15 | Request 退職証明書 + 源泉徴収票 from employers | High | Last working day | V14 | Todo |
| V16 | Use remaining 有給休暇 (both) | High | Last working day | V14 | Todo |
| V17 | Submit 転出届 at city hall | Critical | 14 days before departure | V14 | Todo |
| V18 | Cancel utilities, NHK, internet | Medium | 1 week before departure | — | Todo |
| V19 | Set up mail forwarding (転送届) | Medium | 1 week before departure | — | Todo |
| V20 | Switch mobile to povo2.0 | Low | Before departure | — | Todo |
| V21 | Keep JP bank account + set up online banking | High | Before departure | — | Todo |
| V22 | File 確定申告 for 2026 via 納税管理人 | Critical | Mar 15, 2027 | V13 | Todo |
```

Add to the **Life & Logistics** checklist (after L8):

```markdown
| L9 | Download Grab + Touch 'n Go apps | Low | Nov W1, 2026 | — | Todo |
| L10 | Get SIM card at KLIA on arrival | High | Arrival day | — | Todo |
| L11 | Open Malaysian bank account | High | Nov W3, 2026 | L10 | Todo |
| L12 | Budget MYR 10,500+ for apartment deposit | Critical | Before lease signing | — | Todo |
| L13 | Consult Malaysian tax advisor | High | Dec 2027 | — | Todo |
```

Add to the **Income** checklist — update I3:

Change I3 deadline from "Apr 15, 2026" to "Apr 1, 2026" (apply to all platforms simultaneously).

Add to the **Business** checklist (after B8):

```markdown
| B9 | Verify 副業 policy at both employers | Critical | Before starting any side work | — | Todo |
| B10 | SaaS validation gate: 5 interested users + 2 beta testers | High | Jun 15, 2026 | B1 | Todo |
| B11 | Partner: build portfolio of 3-5 writing samples | Medium | Jun 30, 2026 | — | Todo |
| B12 | Decide on business entity when SaaS > $2K/mo | Medium | When applicable | — | Todo |
```

- [ ] **Step 7: Update the backup plans section**

Replace the backup plans (lines 309–315):

```markdown
### Backup Plans

1. **If savings < ¥400,000 by August**: Delay move to December 2026 (still before Jan 1)
2. **If December still not viable**: Delay to January 2027, leave by Jan 31 (small 住民税 hit of ~¥30,000)
3. **If visa rejected**: Enter Malaysia visa-free (90 days for JP passport), reapply from KL
4. **If income drops below $1,500/mo in MY**: Activate emergency freelancing, reduce expenses to $1,500/mo
5. **年金 lump-sum withdrawal**: Emergency option — claim up to ¥600K–1.2M combined. 2-year window. Trade-off: erases pension years.
6. **Nuclear option**: Return to Japan, resume employment, try again in 6 months
```

- [ ] **Step 8: Commit**

```bash
git add MASTER_PLAN.md
git commit -m "docs: update MASTER_PLAN.md with revised financials, exit procedures, new checklists"
```

---

### Task 8: Update MASTER_PLAN_JA.md

**Files:**
- Modify: `MASTER_PLAN_JA.md`

Apply the same changes as Task 7 but in Japanese, matching the existing JA document's formatting and tone. Each step mirrors Task 7.

- [ ] **Step 1: Add module links after the profile summary**

After the `---` separator following the プロフィール概要 table, insert:

```markdown

### 詳細モジュール

> これらのモジュールは、詳細な財務計画、手続き、セットアップガイドで本計画を補完します。

- [モジュール1: 改訂版ファイナンシャルモデル](docs/modules/01-revised-financial-model_ja.md) — 保守的な貯蓄見積もり、全出国/セットアップ費用、チェックポイント、延期戦略
- [モジュール2: 日本出国手続きプレイブック](docs/modules/02-japan-exit-procedures_ja.md) — 退職、税務、保険、行政手続きの完全ガイド
- [モジュール3: マレーシア生活立ち上げ＆税務](docs/modules/03-malaysia-setup-and-tax_ja.md) — KL到着後1ヶ月の行動計画、税務、法人戦略
```

- [ ] **Step 2: Replace the savings table**

Replace the 貯蓄目標 table (lines 96–109 of JA file):

```markdown
### 貯蓄目標

> **詳細は[モジュール1: 改訂版ファイナンシャルモデル](docs/modules/01-revised-financial-model_ja.md)を参照** — 出国費用、KL費用、延期シナリオの全分析あり。

| 月 | 給与からの貯金 | 副収入 | 累計貯蓄 |
|----|--------------|--------|---------|
| 4月 | ¥60,000 | ¥0 | ¥60,000 |
| 5月 | ¥60,000 | ¥15,000 | ¥135,000 |
| 6月 | ¥60,000 | ¥30,000 | ¥225,000 |
| 7月 | ¥60,000 | ¥60,000 | ¥345,000 |
| 8月 | ¥60,000 | ¥90,000 | ¥495,000 |
| 9月 | ¥60,000 | ¥120,000 | ¥675,000 |
| 10月 | ¥60,000 | ¥150,000 | ¥885,000 |
| **合計** | | | **¥885,000（約$5,900 USD）** |

副収入は保守的な見積もり。¥885,000で出国費用（¥244K〜688K）+ KL費用（¥340K〜545K）をカバー。現実的な移住目標は2026年12月 — 詳細はモジュール1参照。

#### 8月チェックポイント

| 指標 | 最低条件 | 未達の場合 |
|------|---------|-----------|
| 貯蓄 | ¥400,000以上 | 12月に延期 |
| 副収入 | 月¥80,000以上 | 12月に延期 |
| 納税管理人 | 確保済み | 出国前に必ず手配 |
```

- [ ] **Step 3: Add Japan exit procedures summary section**

After the リスクと対策 table, insert:

```markdown

### 日本出国手続き

> **完全なプレイブックは[モジュール2: 日本出国手続き](docs/modules/02-japan-exit-procedures_ja.md)を参照。**

2人とも退職届の提出、納税管理人の手配、転出届の提出、健康保険の移行、確定申告が必要。重要: 2027年の所得に住民税がかからないよう、2027年1月1日前に出国すること。
```

- [ ] **Step 4: Add new risk entries to the JA risk table**

```markdown
| 住民税の一括請求 | 出国前に納税管理人を手配、KLから分割払い |
| 副業禁止規定の発覚 | 副業開始前に就業規則を確認、副業は目立たないように |
| KL賃貸デポジットが想定以上 | MYR 10,500以上（家賃の3.5倍）を予算化、短期契約で1+1デポジット交渉 |
| パートナーの収入が予測より遅い | パートナーは移住準備（高ROIの無償作業）に集中、収入見込みを下方修正 |
```

- [ ] **Step 5: Update the income projection table**

Replace the 合計収入予測 table with conservative Japanese version matching Task 7 Step 5.

```markdown
### 合計収入予測（保守的）

| 月 | レイヤー1 | レイヤー2 | レイヤー3 | 合計 |
|----|----------|----------|----------|------|
| 2026年4月 | $0 | $0 | $0 | $0 |
| 5月 | $70 | $30 | $0 | $100 |
| 6月 | $130 | $70 | $0 | $200 |
| 7月 | $270 | $130 | $0 | $400 |
| 8月 | $400 | $200 | $0 | $600 |
| 9月 | $530 | $270 | $0 | $800 |
| 10月 | $670 | $330 | $0 | $1,000 |
| 11月（MY） | $800 | $500 | $200 | $1,500 |
| 2027年2月 | $600 | $1,200 | $800 | $2,600 |
| 2027年5月 | $400 | $1,800 | $2,000 | $4,200 |

*プラットフォーム立ち上げの現実を反映した保守的見積もり。前提条件はモジュール1参照。*
```

- [ ] **Step 6: Add new checklist items to all JA checklist sections**

Add the same items as Task 7 Step 6, translated to Japanese:

To ビザ・法務 checklist:
```markdown
| V11 | 就業規則で退職予告期間を確認（2社とも） | 高 | 2026年8月15日 | — | Todo |
| V12 | 納税管理人を決める（家族または税理士） | 高 | 2026年9月15日 | — | Todo |
| V13 | 納税管理人届出書を提出（税務署+区役所） | 最重要 | 2026年10月15日 | V12 | Todo |
| V14 | 退職届を提出（2人とも） | 最重要 | 予告期間に応じて | V10,V11 | Todo |
| V15 | 退職証明書+源泉徴収票を会社に依頼 | 高 | 最終出勤日 | V14 | Todo |
| V16 | 有給休暇を全て消化（2人とも） | 高 | 最終出勤日 | V14 | Todo |
| V17 | 転出届を区役所/市役所に提出 | 最重要 | 出国14日前 | V14 | Todo |
| V18 | 公共料金、NHK、インターネットの解約 | 中 | 出国1週間前 | — | Todo |
| V19 | 郵便転送届を提出 | 中 | 出国1週間前 | — | Todo |
| V20 | 携帯をpovo2.0に切替 | 低 | 出国前 | — | Todo |
| V21 | 日本の銀行口座を維持+ネットバンキング設定 | 高 | 出国前 | — | Todo |
| V22 | 納税管理人経由で2026年分の確定申告 | 最重要 | 2027年3月15日 | V13 | Todo |
```

To 生活・ロジスティクス checklist:
```markdown
| L9 | Grab + Touch 'n Goアプリをダウンロード | 低 | 2026年11月第1週 | — | Todo |
| L10 | KLIAでSIMカード購入 | 高 | 到着日 | — | Todo |
| L11 | マレーシアの銀行口座を開設 | 高 | 2026年11月第3週 | L10 | Todo |
| L12 | 賃貸デポジットMYR 10,500以上を予算化 | 最重要 | 契約署名前 | — | Todo |
| L13 | マレーシアの税理士に相談 | 高 | 2027年12月 | — | Todo |
```

Update I3 deadline from 4月15日 to 4月1日.

To ビジネス checklist:
```markdown
| B9 | 副業規定を確認（2社とも） | 最重要 | 副業開始前 | — | Todo |
| B10 | SaaS検証ゲート: 興味ある5名+ベータテスター2名 | 高 | 2026年6月15日 | B1 | Todo |
| B11 | パートナー: ライティングサンプル3〜5本を作成 | 中 | 2026年6月30日 | — | Todo |
| B12 | SaaS月収$2K超でビジネス法人を検討 | 中 | 該当時 | — | Todo |
```

- [ ] **Step 7: Update backup plans**

Replace バックアッププラン:

```markdown
### バックアッププラン

1. **8月時点で貯蓄が¥400,000未満**: 2026年12月に延期（まだ1月1日前）
2. **12月でも厳しい場合**: 2027年1月に延期、1月31日までに出国（住民税の追加負担は約¥30,000）
3. **ビザ却下**: 日本パスポートで90日間ビザなし入国、KLから再申請
4. **MY収入が月$1,500以下に**: 緊急フリーランス案件を獲得、生活費を$1,500/月に圧縮
5. **年金脱退一時金**: 緊急時オプション — 2人で¥600K〜1.2M請求可能。2年間の猶予あり。トレードオフ: 年金加入年数が消える。
6. **最終手段**: 日本に帰国、再就職、6ヶ月後に再挑戦
```

- [ ] **Step 8: Commit**

```bash
git add MASTER_PLAN_JA.md
git commit -m "docs: update MASTER_PLAN_JA.md with revised financials, exit procedures, new checklists"
```

---

### Task 9: Final Review & Commit All

- [ ] **Step 1: Verify all files exist**

Run: `ls -la docs/modules/`

Expected output: 6 markdown files (3 EN, 3 JA)

- [ ] **Step 2: Verify module links work**

Skim each module file to confirm the relative links back to MASTER_PLAN.md / MASTER_PLAN_JA.md are correct:
- `../../MASTER_PLAN.md` from `docs/modules/` — correct (2 levels up)
- `docs/modules/01-...` from root — correct (relative from repo root)

- [ ] **Step 3: Verify no TODO/TBD/placeholder text remains**

Run: `grep -ri "TODO\|TBD\|FIXME\|placeholder" docs/modules/ MASTER_PLAN.md MASTER_PLAN_JA.md`

Expected: No matches (except existing checklist `[ ]` checkboxes which are intentional).

- [ ] **Step 4: Final commit with all files**

```bash
git add -A
git status
git commit -m "docs: complete master plan deep dive — 3 modules (EN+JA) + updated master plans"
```
