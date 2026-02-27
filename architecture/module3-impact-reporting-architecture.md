# Module 3: AI Impact Reporting Generator — Architecture

## Overview

A post-order AI engine that automatically calculates environmental and sourcing impact metrics per order, generates a human-readable impact statement using an LLM, and stores the full report alongside the order record for customer-facing display, analytics, and audit.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Order Event Trigger                       │
│              (Order placed / fulfilled webhook or cron)          │
└───────────────────────────┬─────────────────────────────────────┘
                            │ POST /report/generate
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Report Generation API                         │
│   - Authenticate request (internal service token)               │
│   - Validate orderId exists                                     │
│   - Fetch OrderMetadata + SourcingProfile                       │
│   - Dispatch to Estimation Engine                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Estimation Engine (Core)                       │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐ │
│  │  Plastic Saved   │  │  Carbon Avoided  │  │    Local     │ │
│  │  Estimator       │  │  Calculator      │  │   Sourcing   │ │
│  │                  │  │                  │  │   Analyzer   │ │
│  └────────┬─────────┘  └────────┬─────────┘  └──────┬───────┘ │
│           │                     │                    │         │
│           └─────────────────────┴────────────────────┘         │
│                                 │                               │
│                                 ▼                               │
│                    ┌────────────────────────┐                  │
│                    │   Statement Generator   │                  │
│                    │   (LLM / AI Prompt)     │                  │
│                    └────────────────────────┘                  │
└──────┬──────────────────┬───────────────────┬───────────────────┘
       │                  │                   │
       ▼                  ▼                   ▼
┌────────────┐   ┌────────────────┐   ┌──────────────────┐
│  Feature 1 │   │   Feature 2    │   │   Feature 3      │
│  Plastic   │   │   Carbon       │   │   Local Sourcing │
│  Saved     │   │   Avoided      │   │   Impact         │
│  Estimator │   │   Calculator   │   │   Analyzer       │
└─────┬──────┘   └───────┬────────┘   └────────┬─────────┘
      │                  │                     │
      ▼                  ▼                     ▼
┌───────────┐   ┌────────────────┐   ┌──────────────────┐
│  Orders   │   │  Emissions     │   │  Supplier        │
│  Database │   │  Reference DB  │   │  Profile DB      │
│           │   │  (Static/API)  │   │                  │
└───────────┘   └────────────────┘   └──────────────────┘
       │                  │                   │
       └──────────────────┴───────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   Feature 4           │
              │   Statement Generator │
              │   (LLM + AI Prompt)   │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   ImpactReport Store  │
              │   (DB + Order Record) │
              └───────────────────────┘
```

---

## Feature Breakdown

### Feature 1 — Estimated Plastic Saved

**Goal:** Calculate the weight of plastic avoided per order compared to a conventional fulfilment baseline.

**Flow:**

```
Order fulfilled
        │
        ▼
Plastic Saved Estimator
  ├── Fetch packaging materials used (type, weight, quantity)
  ├── Fetch conventional baseline for equivalent order size
  ├── Compute: baselineWeight - actualPackagingWeight = plasticSaved
  └── Apply product-type multiplier (fragile items, multi-item orders)
        │
        ▼
Output → { plasticSavedGrams: 142, unit: "g", method: "baseline_comparison" }
```

**Calculation Logic:**

```js
const plasticSaved =
  conventionalBaselineGrams * quantity - actualPackagingGrams;

// Confidence: HIGH if material data present, MEDIUM if estimated from product type
```

**Components:**

- `PlasticEstimator` service
- `PackagingRepository` (material weights per product/SKU)
- `BaselineConfig` (conventional packaging benchmarks by category)

---

### Feature 2 — Carbon Avoided (Logic-Based Estimation)

**Goal:** Estimate CO₂ avoided per order by comparing actual fulfilment footprint against a conventional delivery baseline.

**Flow:**

```
Order fulfilled
        │
        ▼
Carbon Avoided Calculator
  ├── Fetch supplier distance to destination (km)
  ├── Fetch transport mode (road / rail / air / last-mile)
  ├── Apply emission factor: emissionFactor × distance × weight
  ├── Calculate conventional baseline (average courier, full distance)
  └── Compute: conventionalCO2 - actualCO2 = carbonAvoided
        │
        ▼
Output → { carbonAvoidedKg: 3.7, confidence: "medium", assumptions: [...] }
```

**Emissions Reference:**

```
emissions_reference/
├── transport_factors.json     # kg CO₂ per tonne-km by mode
├── energy_factors.json        # Grid intensity by region
└── baseline_benchmarks.json   # Average UK e-commerce delivery footprint
```

**Components:**

- `CarbonCalculator` service
- `EmissionsReferenceDB` (static JSON / third-party emissions API)
- `ConfidenceScorer` (HIGH / MEDIUM / LOW based on data completeness)

---

### Feature 3 — Local Sourcing Impact Summary

**Goal:** Calculate what percentage of the order was sourced locally and surface economic and environmental significance.

**Sourcing Thresholds:**

| Tier          | Radius    | Classification | Economic Impact |
| ------------- | --------- | -------------- | --------------- |
| Ultra-local   | < 25km    | Hyperlocal     | Very High       |
| Local         | 25–100km  | Regional       | High            |
| Domestic      | 100–500km | National       | Medium          |
| International | > 500km   | Global         | Low             |

**Flow:**

```
Order fulfilled
        │
        ▼
Local Sourcing Analyzer
  ├── Fetch supplier postcode for each line item
  ├── Calculate distance from supplier → fulfilment centre
  ├── Classify each supplier against threshold tiers
  ├── Compute: localItems / totalItems × 100 = localSourcingPercent
  ├── Identify dominant local region (e.g. "Yorkshire & Humber")
  └── Map to economic impact descriptor
        │
        ▼
Output → {
  localSourcingPercent: 74,
  suppliersWithinRadius: 3,
  economicLocalImpact: "high",
  regionHighlight: "Yorkshire & Humber"
}
```

**Components:**

- `LocalSourcingAnalyzer` service
- `SupplierProfileDB` (supplier postcodes, certifications, region tags)
- `GeoDistanceUtil` (postcode → coordinates → distance calculation)

---

### Feature 4 — Human-Readable Impact Statement

**Goal:** Compose a 2–3 sentence, customer-facing narrative from structured metric outputs and store it with the order record.

**Flow:**

```
Outputs from Features 1–3 collected
        │
        ▼
Statement Generator
  ├── Assemble structured payload: { plasticSaved, carbonAvoided, localSourcing }
  ├── Inject into LLM prompt template (impact_statement.prompt)
  ├── Call LLM (Claude) → generate natural language statement
  └── Validate output length and tone
        │
        ▼
ImpactReport assembled → saved to DB
        │
        ▼
impactStatement written back to Order record
```

**Prompt Template:**

```
prompts/impact_statement.prompt

Given the following impact data for an order:
- Plastic saved: {plasticSavedGrams}g
- Carbon avoided: {carbonAvoidedKg}kg CO₂
- Local sourcing: {localSourcingPercent}% within {radius}km ({regionHighlight})
- Suppliers supported: {suppliersWithinRadius}

Write a 2–3 sentence, friendly, customer-facing impact statement.
Tone: warm, factual, encouraging. Do not use marketing hyperbole.
```

**Example Output:**

```
"Your order saved an estimated 142g of plastic and avoided 3.7kg of CO₂
compared to conventional fulfilment. 74% of your items were sourced within
100km, directly supporting 3 local suppliers in the Yorkshire region."
```

**Components:**

- `StatementGenerator` service
- `impact_statement.prompt` template
- LLM integration (Claude / Anthropic API)
- `ImpactReportRepository` (write to DB + order record)

---

## ImpactReport Schema

```json
{
  "report_id": "uuid-v4",
  "orderId": "ORD-00421",
  "generatedAt": "2026-02-26T10:30:00Z",
  "plasticSavedGrams": 142,
  "carbonAvoidedKg": 3.7,
  "localSourcing": {
    "percent": 74,
    "suppliersWithinRadius": 3,
    "regionHighlight": "Yorkshire & Humber",
    "economicImpact": "high"
  },
  "impactStatement": "Your order saved an estimated 142g of plastic...",
  "confidence": "medium",
  "assumptions": [
    "Transport mode assumed: road (not confirmed)",
    "Packaging baseline: standard e-commerce average"
  ],
  "report_metadata": {
    "module_version": "1.0.0",
    "model": "claude-sonnet-4",
    "generation_ms": 340
  }
}
```

**Storage Strategy:**

```
Primary    → PostgreSQL (structured report, queryable, linked to orderId)
Order sync → Order record updated with impactStatement field
Archive    → S3 / BigQuery (batch analytics, sustainability reporting)
```

---

## Technology Stack

| Layer                 | Technology                                           |
| --------------------- | ---------------------------------------------------- |
| Trigger               | Order webhook (internal event bus) or scheduled cron |
| Backend               | Node.js / Python (FastAPI)                           |
| AI / LLM              | OpenAI API / Anthropic API                           |
| Emissions Reference   | Static JSON config or Carbon Interface API           |
| Supplier & Order Data | PostgreSQL / MySQL                                   |
| Geo Distance          | Google Maps API / PostGIS                            |
| Report Storage        | PostgreSQL + S3 / BigQuery                           |
| Hosting               | AWS / GCP / Azure                                    |

---

## Data Flow Summary

```
Order Fulfilled Event
     │
     ▼
[1] Report Generation API → validate orderId, fetch metadata
     │
     ▼
[2] Estimation Engine → run 3 calculators in parallel
     │
     ├──▶ PlasticEstimator     → plasticSavedGrams
     ├──▶ CarbonCalculator     → carbonAvoidedKg
     └──▶ LocalSourcingAnalyzer → sourcingSummary
     │
     ▼
[3] StatementGenerator → LLM prompt → impactStatement string
     │
     ▼
[4] ImpactReport assembled → saved to PostgreSQL → written to Order record → archived to S3
```
