# Module 4: AI WhatsApp Support Bot — Architecture

## Overview

A WhatsApp-integrated AI support bot capable of answering order queries from live database data, handling return policies, escalating critical issues, and logging all conversations.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         WhatsApp Cloud API                      │
│                  (Incoming & Outgoing Messages)                  │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Webhook (POST /webhook)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API Gateway / Webhook Handler              │
│   - Verify webhook token                                        │
│   - Parse incoming message payload                              │
│   - Route to Bot Engine                                         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Bot Engine (Core)                        │
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌─────────────────────┐ │
│  │  Intent      │   │  Dialogue    │   │  Response           │ │
│  │  Classifier  │──▶│  Manager     │──▶│  Generator (LLM)    │ │
│  └──────────────┘   └──────────────┘   └─────────────────────┘ │
│         │                  │                                     │
│         ▼                  ▼                                     │
│   ┌───────────┐     ┌────────────┐                             │
│   │  NLP /    │     │  Session / │                             │
│   │  Prompt   │     │  Context   │                             │
│   │  Templates│     │  Store     │                             │
│   └───────────┘     └────────────┘                             │
└──────┬──────────────────┬───────────────────┬───────────────────┘
       │                  │                   │
       ▼                  ▼                   ▼
┌────────────┐   ┌────────────────┐   ┌──────────────────┐
│  Feature 1 │   │   Feature 2    │   │   Feature 3      │
│  Order     │   │   Return       │   │   Escalation     │
│  Status    │   │   Policy       │   │   Engine         │
│  Handler   │   │   Handler      │   │                  │
└─────┬──────┘   └───────┬────────┘   └────────┬─────────┘
      │                  │                     │
      ▼                  ▼                     ▼
┌───────────┐   ┌────────────────┐   ┌──────────────────┐
│  Orders   │   │  Policy KB     │   │  CRM / Ticketing │
│  Database │   │  (Static/CMS)  │   │  System          │
└───────────┘   └────────────────┘   └──────────────────┘
       │                  │                   │
       └──────────────────┴───────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   Feature 4           │
              │   Conversation Logger │
              │   (DB / Data Lake)    │
              └───────────────────────┘
```

---

## Feature Breakdown

### Feature 1 — Order Status Queries

**Goal:** Answer "Where is my order?" and related queries using real-time database data.

**Flow:**

```
User: "What's the status of order #10234?"
        │
        ▼
Intent Classifier → ORDER_STATUS intent
        │
        ▼
Order Status Handler
  ├── Extract order ID from message (regex / NLP entity extraction)
  ├── Validate order ID format
  ├── Query Orders Database → SELECT * FROM orders WHERE id = ?
  └── Format response with: status, estimated delivery, carrier, tracking link
        │
        ▼
Response Generator → WhatsApp Message
```

**Database Query Example:**

```sql
SELECT
  order_id, customer_name, status,
  estimated_delivery, carrier, tracking_number
FROM orders
WHERE order_id = :order_id
  AND customer_phone = :phone_number;  -- Phone-based auth
```

**Components:**

- `OrderStatusHandler` service
- `OrderRepository` (DB abstraction layer)
- Phone number ↔ customer verification middleware

---

### Feature 2 — Return Policy Questions

**Goal:** Answer return/refund policy FAQs without hitting the database.

**Flow:**

```
User: "Can I return a product after 30 days?"
        │
        ▼
Intent Classifier → RETURN_POLICY intent
        │
        ▼
Return Policy Handler
  ├── Match question to Policy Knowledge Base (vector search or keyword match)
  ├── Retrieve relevant policy section
  └── Feed to LLM with policy context → Generate natural language answer
        │
        ▼
Response Generator → WhatsApp Message
```

**Knowledge Base Structure:**

```
policy_kb/
├── return_window.md         # Time limits for returns
├── eligible_items.md        # What can/cannot be returned
├── refund_methods.md        # Store credit vs original payment
├── process_steps.md         # How to initiate a return
└── exceptions.md            # Sale items, opened products, etc.
```

**Components:**

- `PolicyHandler` service
- Policy KB (Markdown / CMS / Vector DB like Pinecone)
- LLM prompt with injected policy context (RAG pattern)

---

### Feature 3 — Escalation Engine

**Goal:** Detect high-priority or refund-related issues and route to a human agent.

**Escalation Triggers:**
| Trigger Type | Examples | Priority |
|---|---|---|
| Refund request | "I want a refund", "charge me back" | HIGH |
| Complaint keywords | "fraud", "stolen", "lawsuit", "unacceptable" | CRITICAL |
| Order issue + frustration | "still not arrived" + negative sentiment | HIGH |
| Repeated failed intents | 3+ unresolved turns | MEDIUM |
| Explicit agent request | "speak to a human", "manager" | HIGH |

**Flow:**

```
Bot Engine → Escalation Checker (runs on every turn)
        │
        ├── Sentiment Analysis (negative threshold breached?)
        ├── Keyword Flagging (refund/fraud/legal terms?)
        ├── Intent Failure Count (> N unresolved?)
        └── Explicit Escalation Request?
                │
              YES ▼
        Create Support Ticket (CRM API)
          ├── Attach conversation history
          ├── Set priority level
          └── Notify agent via Slack / Email / CRM dashboard
                │
                ▼
        Send user: "Connecting you to a support agent..."
        Lock bot for this session (human takeover mode)
```

**Components:**

- `EscalationDetector` service (rules + sentiment scoring)
- CRM integration (Zendesk / Freshdesk / HubSpot)
- Agent notification service
- Session lock mechanism (prevent bot from responding mid-handoff)

---

### Feature 4 — Conversation Logger

**Goal:** Log all AI conversations for analytics, compliance, and model improvement.

**Log Schema:**

```json
{
  "log_id": "uuid-v4",
  "session_id": "whatsapp-session-id",
  "customer_phone": "+91xxxxxxxxxx",
  "timestamp_start": "ISO-8601",
  "timestamp_end": "ISO-8601",
  "messages": [
    {
      "turn": 1,
      "role": "user",
      "content": "Where is my order?",
      "timestamp": "ISO-8601",
      "intent_detected": "ORDER_STATUS",
      "confidence": 0.97
    },
    {
      "turn": 2,
      "role": "assistant",
      "content": "Your order #10234 is out for delivery...",
      "timestamp": "ISO-8601",
      "feature_used": "order_status",
      "escalated": false
    }
  ],
  "resolution_status": "resolved | escalated | abandoned",
  "escalation_reason": null,
  "session_metadata": {
    "bot_version": "1.0.0",
    "model": "claude-sonnet-4",
    "total_turns": 4,
    "duration_seconds": 82
  }
}
```

**Storage Strategy:**

```
Hot Path  → Redis (active session context, TTL: 24h)
Warm Path → PostgreSQL (structured logs, queryable, 90 days)
Cold Path → S3 / BigQuery (long-term archival, analytics, compliance)
```

**Components:**

- `ConversationLogger` middleware (logs every turn async)
- `SessionStore` (Redis for active context)
- `LogRepository` (PostgreSQL write)
- `ArchiveJob` (nightly cron → S3/BigQuery)

---

## Technology Stack

| Layer                 | Technology                              |
| --------------------- | --------------------------------------- |
| Messaging API         | WhatsApp Cloud API (Meta)               |
| Backend               | Node.js / Python (FastAPI)              |
| AI / LLM              | OpenAI API / Anthropic API              |
| Intent Classification | LLM-based or Rasa / Dialogflow          |
| Database (Orders)     | PostgreSQL / MySQL                      |
| Policy Knowledge Base | Pinecone (Vector DB) or static Markdown |
| Session Store         | Redis                                   |
| CRM / Ticketing       | Zendesk / Freshdesk                     |
| Logging / Analytics   | PostgreSQL + S3 / BigQuery              |
| Hosting               | AWS / GCP / Azure                       |

---

## Data Flow Summary

```
WhatsApp User
     │
     ▼
[1] Webhook Handler → validate & parse
     │
     ▼
[2] Intent Classifier → detect user goal
     │
     ├──▶ ORDER_STATUS   → Query DB → Return order details
     ├──▶ RETURN_POLICY  → Query KB → Generate policy answer
     ├──▶ ESCALATION     → Create ticket → Notify agent
     └──▶ UNKNOWN        → Clarification prompt / fallback
     │
     ▼
[3] Response Generator → format & send via WhatsApp API
     │
     ▼
[4] Conversation Logger → async log to Redis → PostgreSQL → S3
```
