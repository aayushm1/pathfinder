<div align="center">

# ✨ Pathfinder: HR Roadmap Copilot

### Workplace certification gives you a report card once a year. Pathfinder makes it useful all year round.

An AI copilot that turns a company's annual HR certification results into a living people strategy. It explains the gaps, builds a prioritised roadmap, tracks execution across countries, proves business impact, and pre-fills next year's certification.

[**▶ Live prototype**](https://aayushm1.github.io/hr-roadmap-copilot/) · [How it works (plain English)](HOW-IT-WORKS.md)

![Domain](https://img.shields.io/badge/domain-HR%20Tech%20%C2%B7%20Workplace%20Certification-5B4BF5)
![Role](https://img.shields.io/badge/role-Product%20Management-0EA5A4)
![Stack](https://img.shields.io/badge/stack-Vanilla%20JS%20%C2%B7%20no%20build-0B1129)
![Data](https://img.shields.io/badge/data-100%25%20fictional-16A34A)

</div>

> Independent product concept built as a PM exercise for the employer-certification space. **Northstar Workplace Institute**, **Helix Biosciences** and every person, company and number in the prototype are fictional. It is not affiliated with or endorsed by any certification body.

---

## TL;DR

| | |
|---|---|
| **Problem** | Certification runs as a yearly cycle: survey → audit → results PDF → nothing for 9 months. HR teams struggle to act on the insights, renewal gets harder to justify, and turning data into action needs a paid advisor for every engagement. |
| **Insight** | The certifier owns a unique asset: validated HR-practice data from ~2,500 organisations. What's missing is the workflow that turns it into decisions, execution and proof all year. |
| **Solution** | One loop: **Diagnose** (AI that answers from your results, with sources) → **Plan** (AI roadmap ranked by impact and your priorities) → **Execute** (initiatives, countries, nudges) → **Prove** (outcomes and a board report) → **Recertify** (survey pre-filled from evidence gathered during the year). |
| **Two sides** | The **client** (CPO view) improves faster and can prove it. The **certifier** (advisor view) gets churn and expansion signals from real usage. |
| **North-star metric** | Monthly active client accounts *outside* certification season |

## The demo story

**Maria Lindqvist** is CPO of **Helix Biosciences**: 8,400 people, 12 countries, pharma. Helix is certified at **76.6** (peer median 75.5, top quartile 85.1). It's July 2027, six months into the roadmap.

| Screen | What it shows |
|---|---|
| **Overview** | Score vs peers, journey stage (Fix → Maintain → Prove → Lead), KPIs, AI nudges for the week, roadmap timeline |
| **Results & Benchmarks** | 6 domains / 20 topics, radar chart, and a switchable peer group (4 benchmark sets) |
| **Ask Pathfinder** | AI analyst with visible reasoning steps, cited survey items, inline tables and charts, and one-click actions |
| **Roadmap** | Priority sliders that re-rank initiatives live, impact/effort matrix, timeline, projected score, and an "explain the order" panel |
| **Initiatives** | Owners, milestones you can tick off, country rollout, evidence, and an AI-drafted escalation for an at-risk item |
| **Countries** | Heatmap of gap topics by country. Pathfinder detects an acquisition (700 people) that no initiative covers yet |
| **Peer Practices** | Validated practices from peer companies, matched to your gaps |
| **Outcomes** | Pilot vs non-pilot attrition (−46%), eNPS, manager effectiveness, and a transparent €2.3M value calculation |
| **Board Report** | Builds 5 board slides from live data in one click, with PDF export |
| **Readiness** | 64% of next year's survey is already pre-filled. Drop in a file to see the AI map it to survey items |
| **Advisor view** | Certifier-side portfolio: client health, churn signals, expansion plays, and an auto-generated account brief |
| **Product vision** | Problem, users, metrics, packaging, rollout and risks |

A **3-minute guided demo** (top bar → *Guided demo*) walks through the whole story in 13 steps.

## Things to try
1. On the Overview, click **Why?** next to Onboarding and watch the AI trace the drop to three survey items.
2. On the Roadmap, drag **Cost discipline** to 100 and watch the quick wins move up the order.
3. On Countries, click **Create 100-day integration initiative**. It appears in Initiatives and the projected score rises.
4. On Initiatives, open **Wellbeing Framework 2.0** and click **Draft escalation to CFO**.
5. Switch to the **Advisor view** in the top bar to see the same data from the certifier's side.

## Product decisions

- **Grounded, cited AI.** In a business that sells credibility, a confident wrong answer costs more than a missing one. Every answer cites survey items and data sources, peer data is only shown for groups of 10+, and no individual employee data is shown.
- **Recommendations, not autopilot.** Pathfinder suggests and drafts. HR approves. This keeps accountability with the client and keeps advisors in the loop.
- **Recertification is built in.** Evidence captured during the year flows straight into next year's survey. That's the habit loop: users have a reason to log in every month.
- **Proof in euros.** Outcome analytics compare pilot and non-pilot countries and show the calculation. The CFO is the real renewal decision-maker.
- **Advisory gets leads, not competition.** Stuck initiatives and repeated questions become qualified leads for advisors.

## Run locally

No build step and no dependencies. Open `index.html`, or serve the folder:

```bash
npx serve .
```

## Structure

```
index.html              app shell
assets/css/styles.css   design system (tokens, components, layout)
assets/js/data.js       all fictional data (scores, initiatives, countries, peers)
assets/js/charts.js     dependency-free SVG charts + icon set
assets/js/app.js        state, router, layout, shared UI helpers
assets/js/views.js      every screen
assets/js/copilot.js    the scripted, grounded AI analyst
assets/js/tour.js       guided demo
```

The AI responses are scripted for the demo. In production they would come from an LLM using retrieval over the client's results, evidence vault and the aggregated benchmark, with the same citation format.
