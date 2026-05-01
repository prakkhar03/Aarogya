# 🏥 Aarogya AI - Your Autonomous Health Advocate

> **A multi-agent healthcare orchestration platform where specialist AI agents collaborate, reason, and act on a patient's behalf - from understanding a symptom to booking a doctor appointment, with a real doctor verifying the AI's output before any clinical action is taken.**

[![Veersa Hackathon 2027](https://img.shields.io/badge/Veersa%20Hackathon-2027-blue)](https://forms.office.com/r/wax7a55k6n)
[![Theme](https://img.shields.io/badge/Theme-Agentic%20AI%20Systems-teal)](/)
[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20LangGraph%20%7C%20Node.js-green)](/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](/)

---

## 📌 Table of Contents

1. [One-Line Pitch](#one-line-pitch)
2. [Problem Statement](#problem-statement)
3. [Solution Overview](#solution-overview)
4. [Core USP](#core-usp)
5. [Feature Set](#feature-set)
6. [System Architecture](#system-architecture)
7. [Agent Specifications](#agent-specifications)
8. [Tech Stack](#tech-stack)
9. [Data Flow](#data-flow)
10. [Project Structure](#project-structure)
11. [Setup & Installation](#setup--installation)
12. [Environment Variables](#environment-variables)
13. [Running the Project](#running-the-project)
14. [Prompt Configuration](#prompt-configuration)
15. [API Documentation](#api-documentation)
16. [Testing](#testing)
17. [Deployment](#deployment)
18. [Future Additions](#future-additions)
19. [Team](#team)

---

## One-Line Pitch

> Upload your medical report → get a doctor-grade AI analysis → get matched to a specialist → have the AI report **verified by that doctor** → book the appointment in one tap.

---

## Problem Statement

Indian patients today juggle paper prescriptions, lab reports, and follow-up bookings across **4–6 disconnected systems**. Critical signals - drug interactions, chronic pattern development - fall through the cracks because no single system has the full picture.

Three core failure modes this project solves:

| Failure | Description |
|---|---|
| **Missed signals** | Drug interactions and chronic patterns go undetected because no system sees all the data |
| **Administrative burden** | Clinicians spend ~30% of their time on coordination that requires no medical judgment |
| **Patient helplessness** | Patients lack tools to understand complex reports or navigate specialist referrals |

---

## Solution Overview

Aarogya AI is a **multi-agent orchestration system** that accepts any medical input, routes it to the right specialist AI agent, synthesises the findings, and takes real-world action - all within a single pipeline under 30 seconds.

```
Patient Input (report / symptoms / voice)
        │
        ▼
┌──────────────────────────────┐
│       Orchestrator Agent     │  ← LangGraph state machine
│  classify → dispatch → merge │
└──────────────┬───────────────┘
               │  parallel dispatch
    ┌──────────┼──────────┬──────────────┐
    ▼          ▼          ▼              ▼
Report      Triage     Booking      Doctor
Analysis    Agent      Agent        Verification
Agent                               Portal
    │          │          │              │
    └──────────┴──────────┴──────────────┘
                          │
                          ▼
              Human-in-Loop Gate
              (confirm before action)
                          │
                          ▼
                  Real-World Action
           (appointment booked / alert sent)
```

---

## Core USP

### 🔁 The Closed AI-to-Doctor Feedback Loop

Aarogya AI is the **only system** where the AI-generated medical report analysis is directly shareable with the appointed doctor for verification before any clinical action is taken.

```
AI generates report analysis
          │
          ▼
Patient shares via secure link
          │
          ▼
Doctor reviews → annotates → approves or flags
          │
          ▼
Verified output stored in patient record
          │
          ▼
Patient proceeds with confirmed, clinician-backed plan
```

This creates a **trust layer** that pure-AI systems cannot offer and purely human systems cannot scale.

### Additional Differentiators

- **Contextual doctor matching** - Triage Agent recommends specific bookable doctors based on specialisation and the nature of detected symptoms, not just a generic list
- **Parallel agent execution** - all specialist agents run simultaneously via the orchestrator, reducing pipeline time from hours (manual) to under 30 seconds
- **Externally configurable prompts** - all agent prompts accessible via UI config panel, no code changes needed (satisfies Veersa's explicit requirement)
- **Live reasoning panel** - real-time stream of each agent's thought process, tool calls, and conclusions - auditable, not a black box
- **Human-in-loop gate** - any real-world action (booking, alert) requires explicit user confirmation

---

## Feature Set

### ✅ Core Features (Hackathon Scope)

#### Feature 1 - Medical Report Analysis Agent
The flagship feature. User uploads any medical test report (blood work, imaging, pathology PDF). The Report Analysis Agent:
- Extracts text via OCR (Tesseract / Google Vision)
- Maps every value against clinical reference ranges from PubMed and MedlinePlus RAG corpus
- Generates a **structured, doctor-style narrative** in plain language with citations
- Flags abnormalities with severity levels
- Produces a shareable verification card for doctor review

#### Feature 2 - Symptom Interpretation Agent (Triage)
User describes symptoms in text or Hindi voice. The Triage Agent:
- Classifies severity on an ESI-like **5-level scale**
- Identifies likely diagnostic categories
- Recommends **specific, bookable specialist doctors** matched to the symptom profile
- Feeds recommendations directly into the Booking Agent with pre-filled context

#### Feature 3 - Appointment Booking Agent
After symptom analysis or report review, the Booking Agent:
- Presents matched doctors with available slots
- Places a **real outbound Twilio Voice call** to book the appointment
- Sends the booked doctor the AI-generated report analysis for pre-consultation review
- Completes the closed feedback loop

#### Feature 4 - Doctor Verification Portal ⭐ (USP)
A lightweight portal for the appointed doctor:
- Receives a secure shareable link with the AI-generated analysis + original report
- Can annotate, approve, or flag specific sections
- Verified output stored in patient record and visible on the patient dashboard
- Directly addresses the clinical safety concern of AI-only systems

#### Feature 5 - Agent Reasoning Panel
Real-time UI panel that streams:
- Which agents are currently running
- Tool calls made by each agent
- Intermediate conclusions and confidence levels
- Any inter-agent disagreements
- Override controls before any action executes

#### Feature 6 - Prompt Configuration Panel
Admin panel exposing all agent system prompts:
- Stored in `config/prompts.yaml`
- Editable via UI without touching source code
- Changes reflected immediately on next agent run
- Required by Veersa hackathon brief

---

### 🔮 Future Additions (Post-Hackathon Roadmap)

These features are fully designed and documented but deferred from the hackathon build to ensure core features are delivered with depth:

| Feature | Description |
|---|---|
| **Prescription Decoding Agent** | OCR prescription upload, RxNorm drug lookup, interaction check against patient history, patient-friendly medication guide |
| **Insurance Claim Navigation Agent** | Rejected claim upload, IRDAI guidelines RAG, appeal grounds identification, evidence-backed appeal letter with policy clause citations |
| **Longitudinal Health Timeline** | HistoryAgent queries past records, visualises 5-year risk trajectory for chronic conditions |
| **WhatsApp Medication Reminders** | GuardianAgent schedules reminders via WhatsApp Business API in patient's preferred language |
| **On-Device Inference Mode** | Ollama-powered fallback for privacy-sensitive operations, keeping PHI off cloud servers |
| **Wearable Integration** | Google Fit / Apple Health feed for vitals-aware triage |

---

## System Architecture

### High-Level Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│              React + Vite + Tailwind + shadcn/ui                │
│   ┌──────────┐  ┌───────────────┐  ┌──────────────────────┐    │
│   │  Upload  │  │    Action     │  │   Agent Reasoning    │    │
│   │   View   │  │   Dashboard   │  │       Panel (SSE)    │    │
│   └──────────┘  └───────────────┘  └──────────────────────┘    │
└─────────────────────────┬───────────────────────────────────────┘
                          │ REST / WebSocket / SSE
┌─────────────────────────▼───────────────────────────────────────┐
│                    API GATEWAY (Express.js / Node)               │
│         Auth (JWT) │ File Uploads │ SSE Bridge │ Twilio Webhooks │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Internal REST
┌─────────────────────────▼───────────────────────────────────────┐
│               ORCHESTRATION LAYER (Python / FastAPI)            │
│                                                                 │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │              LangGraph Orchestrator                      │  │
│   │  input_ingest → classify → dispatch → parallel_agents   │  │
│   │  → blackboard_merge → contradiction_resolver            │  │
│   │  → action_planner → human_in_loop_gate → executor       │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│   │  Report  │ │  Triage  │ │ Booking  │ │  Doctor Verify   │  │
│   │  Agent   │ │  Agent   │ │  Agent   │ │     Module       │  │
│   └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
└──────┬───────────────┬──────────────────────────────────────────┘
       │               │
┌──────▼──────┐  ┌──────▼────────────────────────────────────────┐
│   Neo4j     │  │              External Services                 │
│  (Patient   │  │  Pinecone │ Postgres │ Redis │ Twilio │ RxNorm │
│   Graph)    │  │  PubMed RAG │ ICD-10 │ Bhashini │ FHIR       │
└─────────────┘  └───────────────────────────────────────────────┘
```

### LangGraph State Machine Nodes

```
input_ingest
    │
    ▼
classify_intent          ← determines: report | symptom | booking | claim
    │
    ▼
dispatch_to_orchestrator
    │
    ▼
parallel_agent_execution ← all relevant agents fire simultaneously
    │
    ▼
blackboard_merge         ← agents publish findings to Redis blackboard
    │
    ▼
contradiction_resolver   ← orchestrator resolves conflicting agent outputs
    │
    ▼
action_planner           ← constructs prioritised action list
    │
    ▼
human_in_loop_gate       ← REQUIRED for any real-world action
    │
    ▼
executor                 ← fires confirmed actions (Twilio, booking, alerts)
    │
    ▼
response_synthesiser     ← builds final patient-facing output
```

---

## Agent Specifications

> Each agent is a tool-using LLM with scoped system instructions loaded from `config/prompts.yaml`.

### 🧠 Orchestrator Agent

| Property | Detail |
|---|---|
| **Role** | Central coordinator. Classifies intent, dispatches tasks, merges findings, resolves contradictions, synthesises final response |
| **Model** | Claude Sonnet (complex reasoning) |
| **Inputs** | Raw user input, patient ID, session context |
| **Outputs** | Dispatch instructions, synthesised action plan, FHIR-formatted summary |
| **Tools** | LangGraph state machine, intent classifier, Redis blackboard read/write |

### 🔬 Report Analysis Agent

| Property | Detail |
|---|---|
| **Role** | Processes medical test reports. Generates structured doctor-style narrative with flagged values and action plan |
| **Model** | Claude Sonnet |
| **Inputs** | Lab PDF / image (OCR-extracted text), patient history from Neo4j |
| **Outputs** | Structured findings card, flagged abnormalities with severity, doctor-verification share link |
| **Tools** | PDF/OCR extraction, PubMed RAG (Pinecone), MedlinePlus API, ICD-10 lookup, Neo4j patient graph read |
| **Prompt File** | `config/prompts.yaml` → `report_analysis_agent` |

### 🚨 Triage Agent (Symptom Interpretation)

| Property | Detail |
|---|---|
| **Role** | Classifies symptom severity, identifies diagnostic categories, recommends specialist doctors |
| **Model** | Llama 3.1 8B via Groq (speed-optimised) |
| **Inputs** | Natural language / Hindi symptom description, patient age and history |
| **Outputs** | ESI-level triage score (1–5), diagnostic category, recommended doctor list with availability |
| **Tools** | Symptom-to-diagnosis RAG, doctor availability API, severity classification |
| **Prompt File** | `config/prompts.yaml` → `triage_agent` |

### 📅 Booking Agent

| Property | Detail |
|---|---|
| **Role** | Books appointments with recommended doctors. Passes AI analysis to doctor pre-consultation |
| **Model** | Llama 3.1 8B via Groq |
| **Inputs** | Doctor selection, available slots, patient context, AI report analysis output |
| **Outputs** | Confirmed appointment, doctor-facing pre-consultation summary, booking confirmation |
| **Tools** | Twilio Voice API, web booking integration, WhatsApp notification |
| **Prompt File** | `config/prompts.yaml` → `booking_agent` |

### 👨‍⚕️ Doctor Verification Module

| Property | Detail |
|---|---|
| **Role** | Provides the appointed doctor a view to review, annotate, and verify AI-generated analyses |
| **Model** | N/A (rule-based module with secure link generation) |
| **Inputs** | Shareable report analysis link, doctor authentication token |
| **Outputs** | Annotated analysis with doctor sign-off, flagged sections, verified status in patient record |
| **Tools** | Secure share-link generator, annotation storage (Postgres), Neo4j patient graph write |

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React + Vite + Tailwind CSS + shadcn/ui | UI, component system |
| **Charts** | Recharts | Health timeline visualisation |
| **Animations** | Framer Motion | Agent collaboration visualisation |
| **Real-time** | SSE (Server-Sent Events) | Live agent reasoning stream |
| **API Gateway** | Express.js / Node.js | Auth, file uploads, WebSocket/SSE bridge |
| **Orchestration** | Python FastAPI + LangGraph | Agent state machine, RAG retrieval |
| **Agent Framework** | CrewAI (collaboration patterns) | Agent-to-agent coordination |
| **Patient Graph** | Neo4j | Longitudinal patient data, Cypher queries |
| **Vector DB** | Pinecone | Medical RAG (PubMed, MedlinePlus, ICD-10) |
| **Relational DB** | PostgreSQL | Users, audit logs, doctor verification records |
| **Cache / Blackboard** | Redis | Agent intermediate findings, SSE pub-sub |
| **LLM (complex)** | Claude Sonnet | Orchestrator, Report Analysis Agent |
| **LLM (fast)** | Llama 3.1 8B via Groq | Triage Agent, Booking Agent |
| **OCR** | Tesseract + Google Vision API | PDF and handwritten document extraction |
| **Voice** | Twilio Voice API | Real outbound appointment booking calls |
| **Translation** | Sarvam AI / Bhashini | Hindi input and output |
| **Voice Transcription** | OpenAI Whisper | Hindi voice-to-text |
| **Health Standards** | HAPI FHIR test server | Clinician-compatible structured output |
| **Containerisation** | Docker + Docker Compose | One-command local setup |

### RAG Corpus Sources

```
Pinecone Index: aarogya-medical-rag
├── PubMed (open-access subset)       ← clinical evidence, reference ranges
├── MedlinePlus                        ← patient-friendly drug/condition info
├── RxNorm                             ← drug nomenclature and interactions
├── ICD-10                             ← diagnosis codes
├── Indian Pharmacopoeia               ← India-specific drug standards
└── IRDAI Claim Guidelines             ← insurance policy clauses (future use)
```

---

## Data Flow

### Report Upload → Doctor Verification Flow

```
1. Patient uploads lab PDF via React frontend
        │
2. Express Gateway stores file, triggers FastAPI orchestrator
        │
3. Orchestrator classifies intent → "report_analysis"
        │
4. Report Analysis Agent fires:
   ├── OCR text extraction (Tesseract / Google Vision)
   ├── Pinecone RAG query (clinical context for each flagged value)
   └── Neo4j query (patient's existing conditions and medication history)
        │
5. Agent publishes findings to Redis blackboard
        │
6. Orchestrator synthesises → human_in_loop_gate
        │
7. Frontend renders findings card
   ├── Flagged values with severity
   ├── Plain-language explanation
   ├── Action plan
   └── "Share with Doctor" button
        │
8. Patient clicks Share → secure link generated (JWT-signed, 48hr expiry)
        │
9. Doctor opens link → Doctor Verification Portal
   ├── Views AI analysis alongside original report
   ├── Annotates flagged sections
   └── Clicks Approve / Flag for Review
        │
10. Verification stored in Postgres + Neo4j
    Patient dashboard updates: ✅ Verified by Dr. [Name]
```

### Symptom → Booking Flow

```
1. Patient describes symptoms (text or Hindi voice via Whisper)
        │
2. Orchestrator dispatches to Triage Agent
        │
3. Triage Agent:
   ├── Classifies severity (ESI level 1–5)
   ├── Identifies diagnostic category
   └── Queries doctor availability → top 3 recommendations
        │
4. Frontend displays:
   ├── Triage level with explanation
   ├── Likely concern category
   └── Doctor cards (name, specialisation, rating, next available slot)
        │
5. Patient selects doctor
        │
6. human_in_loop_gate → Patient confirms booking
        │
7. Booking Agent fires:
   ├── Twilio Voice outbound call to doctor's clinic
   └── Sends pre-consultation AI summary to Doctor Verification Portal
        │
8. Booking confirmation → patient dashboard + WhatsApp notification
```

---

## Project Structure

```
aarogya-ai/
│
├── frontend/                          # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Upload/                # File upload view
│   │   │   ├── Dashboard/             # Action dashboard with confirm gates
│   │   │   ├── ReasoningPanel/        # Live agent reasoning SSE stream
│   │   │   ├── DoctorPortal/          # Doctor verification view
│   │   │   └── PromptConfig/          # Admin prompt editor panel
│   │   ├── hooks/
│   │   │   ├── useSSE.js              # Server-Sent Events hook for live stream
│   │   │   └── useAgentStatus.js      # Agent running state management
│   │   ├── pages/
│   │   │   ├── PatientView.jsx
│   │   │   └── DoctorView.jsx
│   │   └── App.jsx
│   ├── .env.example
│   └── package.json
│
├── gateway/                           # Express.js API Gateway (Node)
│   ├── routes/
│   │   ├── auth.js                    # JWT auth routes
│   │   ├── upload.js                  # File upload (multer)
│   │   ├── sse.js                     # SSE bridge to React frontend
│   │   └── webhooks.js                # Twilio + WhatsApp webhooks
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── validateInput.js           # Input sanitisation
│   ├── .env.example
│   └── package.json
│
├── orchestration/                     # Python FastAPI + LangGraph
│   ├── main.py                        # FastAPI app entry point
│   ├── orchestrator/
│   │   ├── graph.py                   # LangGraph state machine definition
│   │   ├── nodes.py                   # All LangGraph node functions
│   │   ├── blackboard.py              # Redis blackboard read/write helpers
│   │   └── contradiction_resolver.py  # Inter-agent conflict resolution logic
│   ├── agents/
│   │   ├── base_agent.py              # Base class: loads prompt from YAML, exposes tools
│   │   ├── report_agent.py            # Report Analysis Agent
│   │   ├── triage_agent.py            # Symptom Triage Agent
│   │   └── booking_agent.py           # Appointment Booking Agent
│   ├── rag/
│   │   ├── pinecone_client.py         # Pinecone index queries
│   │   ├── seed_corpus.py             # Script to seed Pinecone with medical data
│   │   └── fhir_converter.py          # Convert agent output to FHIR JSON
│   ├── tools/
│   │   ├── ocr_tool.py                # Tesseract + Google Vision OCR
│   │   ├── rxnorm_tool.py             # RxNorm API wrapper
│   │   ├── icd10_tool.py              # ICD-10 API wrapper
│   │   └── twilio_tool.py             # Twilio Voice call wrapper
│   ├── db/
│   │   ├── neo4j_client.py            # Neo4j connection + Cypher helpers
│   │   └── postgres_client.py         # Postgres connection + ORM models
│   ├── tests/
│   │   ├── test_report_agent.py       # Unit tests for Report Agent
│   │   ├── test_triage_agent.py       # Unit tests for Triage Agent
│   │   └── test_orchestrator.py       # Integration tests for full pipeline
│   └── requirements.txt
│
├── config/
│   └── prompts.yaml                   # ⭐ ALL agent prompts - editable via UI
│
├── docs/
│   ├── architecture.png               # Architecture diagram
│   ├── api_collection.json            # Postman collection
│   └── figma_wireframes.pdf           # UI wireframes
│
├── docker-compose.yml                 # One-command full stack setup
├── .env.example                       # All required environment variables
└── README.md                          # This file
```

---

## Setup & Installation

### Prerequisites

```bash
# Required
Node.js >= 18.x
Python >= 3.11
Docker + Docker Compose (recommended)

# Accounts / API Keys needed
- Anthropic API key (Claude Sonnet)
- Groq API key (Llama 3.1 8B)
- Twilio account (Voice + WhatsApp)
- Pinecone account
- Neo4j Aura (free tier works)
- Google Cloud (Vision API for OCR)
- Sarvam AI / Bhashini (Hindi translation)
```

### Option A - Docker (Recommended)

```bash
# 1. Clone the repo
git clone https://github.com/your-team/aarogya-ai.git
cd aarogya-ai

# 2. Copy and fill environment variables
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section)

# 3. Seed the Pinecone RAG corpus (one-time setup, ~5 mins)
docker compose run --rm orchestration python rag/seed_corpus.py

# 4. Start all services
docker compose up

# 5. Open the app
# Frontend:      http://localhost:5173
# API Gateway:   http://localhost:3000
# Orchestration: http://localhost:8000
# API Docs:      http://localhost:8000/docs
```

### Option B - Manual Setup

```bash
# ── Frontend ──────────────────────────────────
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173

# ── API Gateway ───────────────────────────────
cd gateway
npm install
node index.js
# Runs at http://localhost:3000

# ── Orchestration ─────────────────────────────
cd orchestration
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Runs at http://localhost:8000

# ── Neo4j (local) ─────────────────────────────
# Or use Neo4j Aura free tier - paste connection URI in .env
docker run -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/yourpassword neo4j:latest

# ── Redis ─────────────────────────────────────
docker run -p 6379:6379 redis:alpine
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in all values. **Never commit `.env` to the repository.**

```env
# ── LLMs ──────────────────────────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-...          # Claude Sonnet - orchestrator + report agent
GROQ_API_KEY=gsk_...                  # Llama 3.1 8B - triage + booking agents

# ── Vector DB ─────────────────────────────────────────────────────
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX_NAME=aarogya-medical-rag

# ── Patient Graph ─────────────────────────────────────────────────
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=yourpassword

# ── Relational DB ─────────────────────────────────────────────────
POSTGRES_URI=postgresql://user:password@localhost:5432/aarogya

# ── Cache / Blackboard ────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ── Communication ─────────────────────────────────────────────────
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
WHATSAPP_BUSINESS_NUMBER=whatsapp:+91...

# ── OCR ───────────────────────────────────────────────────────────
GOOGLE_VISION_API_KEY=...             # Primary OCR for handwritten docs

# ── Translation ───────────────────────────────────────────────────
SARVAM_API_KEY=...                    # Hindi translation (Bhashini fallback)

# ── Auth ──────────────────────────────────────────────────────────
JWT_SECRET=your-long-random-secret
JWT_EXPIRY=24h
DOCTOR_LINK_EXPIRY=48h               # Doctor verification link lifetime

# ── App ───────────────────────────────────────────────────────────
FRONTEND_URL=http://localhost:5173
GATEWAY_URL=http://localhost:3000
ORCHESTRATION_URL=http://localhost:8000
NODE_ENV=development
```

---

## Running the Project

### Seed the RAG Corpus (First Time Only)

```bash
cd orchestration
python rag/seed_corpus.py
# Fetches and indexes ~100 medical documents into Pinecone
# Expected time: 3–5 minutes
# Pre-warm before demo to avoid cold-start latency
```

### Demo Flow (Practice This)

```
1. Open http://localhost:5173
2. Upload sample_blood_report.pdf (in /docs/sample_data/)
3. Watch Agent Reasoning Panel - 3 agents fire in parallel
4. See flagged values on the Report Analysis card
5. Click "Share with Doctor" → copy the verification link
6. Open the link in a new tab (Doctor Portal view)
7. Annotate one value → click Approve
8. Return to patient view - see "Verified by Dr. Demo" status
9. Click "Book Appointment" on a recommended doctor
10. Confirm in the Human-in-Loop gate
11. Watch Twilio call fire (teammate's phone rings)
12. Open Prompt Config panel → edit Triage Agent prompt → re-run
```

---

## Prompt Configuration

All agent system prompts are stored in `config/prompts.yaml` and exposed through the **Prompt Configuration Panel** in the admin UI.

```yaml
# config/prompts.yaml

orchestrator_agent: |
  You are the central orchestrator of Aarogya AI, a healthcare coordination system.
  Your role is to classify the user's intent, dispatch tasks to specialist agents,
  merge their findings, resolve contradictions, and synthesise a final action plan.
  
  INTENT CATEGORIES: report_analysis | symptom_triage | appointment_booking | general_query
  
  RULES:
  - Never make a clinical diagnosis. Route to the Report Analysis Agent for any uploaded document.
  - Any action with real-world consequence (booking, alert) must pass through human_in_loop_gate.
  - Always cite the source agent for every finding in the synthesised output.
  - If agents contradict each other, present both findings with confidence scores.

report_analysis_agent: |
  You are a medical report analysis specialist. You receive OCR-extracted text from
  patient lab reports and generate a structured, doctor-style analysis.
  
  OUTPUT FORMAT:
  1. Summary (2–3 sentences, plain language)
  2. Flagged Values (table: parameter | value | reference range | severity: normal/elevated/critical)
  3. Clinical Context (RAG-grounded explanation for each flagged value, with citation)
  4. Action Plan (numbered list of recommended next steps)
  5. Disclaimer: always end with the standard medical disclaimer
  
  RULES:
  - Every clinical claim MUST have a RAG citation. Do not make unsupported assertions.
  - Use plain language. Avoid jargon unless followed immediately by a plain-language explanation.
  - Severity levels: normal | mildly elevated | elevated | critical
  - Always append: "This analysis is AI-generated and requires verification by a qualified
    medical professional before any clinical action is taken."

triage_agent: |
  You are a medical triage specialist. Classify the severity of described symptoms
  and recommend appropriate specialist doctors.
  
  ESI SEVERITY LEVELS:
  Level 1 - Immediate (life-threatening): recommend emergency services / ambulance
  Level 2 - Emergent (high risk): recommend ER visit within 15 minutes
  Level 3 - Urgent: recommend specialist within 24–48 hours
  Level 4 - Less Urgent: recommend GP / clinic visit this week
  Level 5 - Non-Urgent: recommend scheduled appointment or teleconsult
  
  OUTPUT FORMAT:
  1. Severity Level (1–5) with brief justification
  2. Likely Diagnostic Category (e.g., "Metabolic - possible HbA1c elevation")
  3. Recommended Specialist Type (e.g., "Endocrinologist")
  4. Doctor Recommendations (pass to Booking Agent for slot lookup)
  
  RULES:
  - When in doubt, escalate the severity level, never downgrade.
  - For Level 1–2, always recommend emergency services FIRST before any booking.

booking_agent: |
  You are an appointment booking specialist. Your job is to confirm doctor selection
  and coordinate the booking via Twilio Voice or web booking.
  
  RULES:
  - Always confirm the patient's choice before initiating any call or booking.
  - Pass the AI-generated report analysis summary to the doctor's pre-consultation portal.
  - Booking confirmation must include: doctor name, clinic, date, time, and a preparation note.
  - If Twilio call fails, fall back to web booking silently - do not expose the failure.
```

### Editing Prompts via UI

1. Navigate to `http://localhost:5173/admin/prompts`
2. Select the agent from the dropdown
3. Edit the prompt in the text editor
4. Click **Save & Reload** - changes take effect on the next agent run
5. Use **Reset to Default** to restore the original prompt

> **Note for reviewers:** The prompt configuration panel is intentionally exposed so you can inspect and modify agent behaviour without touching the codebase. This is a core architectural decision, not an afterthought.

---

## API Documentation

Full Postman collection available at `/docs/api_collection.json`. Import into Postman to test all endpoints.

### Key Endpoints

#### Orchestration (FastAPI - port 8000)

```
POST   /api/v1/analyse          Upload document and trigger agent pipeline
GET    /api/v1/stream/{job_id}  SSE stream of agent reasoning for a job
GET    /api/v1/report/{id}      Fetch completed report analysis
POST   /api/v1/triage           Submit symptom description for triage
GET    /api/v1/doctors          Get recommended doctors from triage result
POST   /api/v1/book             Confirm and initiate appointment booking
```

#### Doctor Verification (FastAPI - port 8000)

```
GET    /api/v1/verify/{token}   Doctor opens verification link
POST   /api/v1/verify/{token}/annotate   Doctor saves annotations
POST   /api/v1/verify/{token}/approve    Doctor approves the analysis
POST   /api/v1/verify/{token}/flag       Doctor flags concerns
```

#### Gateway (Express - port 3000)

```
POST   /auth/login              Patient / doctor login
POST   /auth/refresh            Refresh JWT token
POST   /upload                  Upload medical document (multipart/form-data)
GET    /health                  Service health check
```

#### Interactive Docs

```
http://localhost:8000/docs       FastAPI Swagger UI
http://localhost:8000/redoc      FastAPI ReDoc
```

---

## Testing

### Run All Tests

```bash
# Python unit + integration tests
cd orchestration
pytest tests/ -v --cov=. --cov-report=term-missing

# API tests (requires services running)
# Import /docs/api_collection.json into Postman
# Or run with Newman:
npx newman run docs/api_collection.json --env-var "base_url=http://localhost:8000"
```

### Test Coverage

```
tests/
├── test_report_agent.py       Unit tests for OCR extraction, RAG grounding, output format
├── test_triage_agent.py       Unit tests for severity classification, doctor matching
├── test_booking_agent.py      Unit tests for Twilio integration (mocked)
├── test_orchestrator.py       Integration test - full pipeline with sample PDF
└── test_doctor_verify.py      Unit tests for share link generation and annotation storage
```

### Sample Test Data

```
docs/sample_data/
├── sample_blood_report.pdf         # Synthetic blood report for demo
├── sample_symptoms.json            # Sample symptom descriptions (English + Hindi)
└── sample_doctor_list.json         # Mock doctor availability data
```

> **All test data is fully synthetic. No real patient data is used anywhere in this project.**

---

## Deployment

Deployment is not mandatory but earns bonus points. The project is Docker-ready.

### Deploy to Render (Recommended)

```bash
# Frontend → Render Static Site
# Gateway → Render Web Service (Node)
# Orchestration → Render Web Service (Python)
# Neo4j → Neo4j Aura Free Tier
# Postgres → Render Postgres
# Redis → Render Redis
# Pinecone → Pinecone cloud (already managed)
```

1. Push repo to GitHub
2. Connect each service directory to Render
3. Set all environment variables in Render dashboard
4. Seed Pinecone: `python rag/seed_corpus.py` (run once via Render shell)
5. Live URL added here once deployed: `[LIVE_URL]`

### Docker Compose (Local Full Stack)

```bash
docker compose up --build
# All 6 services start: frontend, gateway, orchestration, neo4j, postgres, redis
```

---

## Future Additions

The following features are designed and documented, ready for the next build sprint:

### Prescription Decoding Agent
- Upload handwritten or printed prescriptions
- OCR extraction → RxNorm drug lookup → patient-friendly medication guide
- Drug interaction check against patient's stored medication history in Neo4j
- Dangerous interaction alert with severity rating

### Insurance Claim Navigation Agent
- Upload rejected claim document
- Claim Agent cross-references rejection reason against IRDAI guidelines (Pinecone RAG)
- Identifies appeal grounds with policy clause citations
- Generates ready-to-submit appeal letter as downloadable PDF

---

## AI Context Guide

> **This section is written specifically for AI coding assistants (Cursor, GitHub Copilot, Claude Code, etc.) to understand the project architecture before generating code.**

### What This Project Is

Aarogya AI is a **multi-agent healthcare orchestration system**. It is NOT a chatbot. It is NOT a single-model prompt chain. It is a LangGraph state machine that dispatches tasks to multiple specialist LLM agents running in parallel, merges their outputs via a Redis blackboard, and executes real-world actions (Twilio calls, database writes) only after explicit human confirmation.

### Critical Architectural Decisions to Respect

**1. All agent prompts live in `config/prompts.yaml` - never hardcode prompts in agent files.**
```python
# ✅ CORRECT
class ReportAgent(BaseAgent):
    def __init__(self):
        self.prompt = load_prompt("report_analysis_agent")  # reads from prompts.yaml

# ❌ WRONG
class ReportAgent(BaseAgent):
    PROMPT = "You are a medical report analyst..."
```

**2. Every agent inherits from `BaseAgent` in `agents/base_agent.py`.**
```python
# Every new agent must follow this pattern
class NewAgent(BaseAgent):
    def __init__(self):
        super().__init__(prompt_key="new_agent")  # key in prompts.yaml
    
    async def run(self, input: AgentInput) -> AgentOutput:
        # 1. Call tools
        # 2. Write to blackboard
        # 3. Return structured output
```

**3. Inter-agent communication happens ONLY via the Redis blackboard - agents do not call each other directly.**
```python
# ✅ CORRECT - agent writes to blackboard
await blackboard.publish(job_id, agent_name="report_agent", findings=result)

# ❌ WRONG - agents calling each other
triage_result = await triage_agent.run(report_agent.output)
```

**4. The `human_in_loop_gate` node in the LangGraph graph MUST be hit before any of these actions:**
- Twilio Voice calls
- WhatsApp messages
- Any write to an external system
- Any action with financial cost

**5. No API keys in source code - ever.**
```python
# ✅ CORRECT
import os
api_key = os.getenv("ANTHROPIC_API_KEY")

# ❌ WRONG
api_key = "sk-ant-..."
```

**6. The LangGraph graph definition lives entirely in `orchestration/orchestrator/graph.py`. All node functions are in `nodes.py`. Do not define graph nodes inline in other files.**

**7. The Doctor Verification Portal is a separate React page (`/pages/DoctorView.jsx`) that receives a JWT-signed token via URL parameter. It must work without the patient being logged in - doctors access it via the shared link only.**

### Data Models

```python
# Core data models (use these shapes consistently)

class PatientInput(BaseModel):
    patient_id: str
    input_type: Literal["report_pdf", "symptom_text", "symptom_voice", "prescription_pdf"]
    content: str | bytes                # text for symptoms, base64 for files
    language: str = "en"               # "en" or "hi"
    session_id: str

class AgentOutput(BaseModel):
    agent_name: str
    job_id: str
    confidence: float                  # 0.0 – 1.0
    findings: dict                     # agent-specific structured output
    citations: list[str]               # RAG source URLs/IDs
    timestamp: datetime
    requires_confirmation: bool        # triggers human_in_loop_gate if True

class ReportFinding(BaseModel):
    parameter: str
    value: str
    reference_range: str
    severity: Literal["normal", "mildly_elevated", "elevated", "critical"]
    clinical_context: str              # RAG-grounded explanation
    citation: str

class DoctorRecommendation(BaseModel):
    doctor_id: str
    name: str
    specialisation: str
    clinic: str
    next_available: datetime
    rating: float
    booking_method: Literal["twilio_call", "web_booking"]
```

### Common Pitfalls to Avoid

- **Do not use `asyncio.run()` inside FastAPI routes** - use `async def` and `await` throughout
- **Pinecone queries should always include a `top_k` limit** - default to `top_k=5` to control latency
- **Neo4j Cypher queries must be parameterised** - never f-string patient data into queries
- **SSE events must be newline-terminated** - `data: {json}\n\n` format required by EventSource API
- **The LangGraph state object is immutable within a node** - always return a new state dict, never mutate in place
- **Redis blackboard keys follow this pattern** - `blackboard:{job_id}:{agent_name}` - never deviate

---

## Team

| Member | GitHub | Module Ownership |
|---|---|---|
| [Name 1] | @handle | Orchestrator + LangGraph state machine |
| [Name 2] | @handle | Report Analysis Agent + RAG pipeline |
| [Name 3] | @handle | Frontend + Agent Reasoning Panel + Doctor Portal |
| [Name 4] | @handle | Triage Agent + Booking Agent + Twilio integration |

---

## Disclaimer

> Aarogya AI is a prototype built for the Veersa Hackathon 2027. It does **not** replace qualified medical advice, diagnosis, or treatment. All AI-generated analyses are explicitly labelled as unverified until reviewed by a qualified clinician. All test data used in this project is fully synthetic. No real patient health information was used in development or demonstration.

---

<p align="center">
  Built with depth. Explained with clarity. Demonstrated with confidence.<br/>
  <strong>Aarogya AI - Veersa Hackathon 2027</strong>
</p>