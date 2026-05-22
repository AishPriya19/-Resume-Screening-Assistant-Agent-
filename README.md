# TalentOps Agent

An AI recruiting co-pilot that reads candidate resumes against a job description and structured evaluation checklist, then produces decision-ready interview packs for the hiring panel.

> **Hard rule:** TalentOps never produces numeric scores, percentages, or rankings. Candidates are rated with **Meets / Partially Meets / Does Not Meet** only, each backed by a justification grounded in the resume text.

---

## What it produces, per slate

| Artefact | Format | Audience |
|---|---|---|
| Interactive dashboard | Live web UI + downloadable HTML | Hiring panel and recruiters |
| Fitment matrix | `.xlsx` (traffic-light cells, frozen header) | Hiring manager |
| Feedback pack (one per candidate) | `.docx` (ratings table, compliance, question bank, sign-off) | Interview panellists |

Per candidate, the dashboard surfaces:
- **Overview** — strengths, gaps, skills, red flags
- **Fitment** — must-have / nice-to-have matrix, each row with rating + expandable justification
- **Questions** — 10–14 tailored questions across four categories (Technical Depth, Behavioural Scenarios, Gap Probing, Situational)
- **Compliance** — checklist items marked Referenced / Unverified

---

## Architecture

```
┌────────────────────────┐         ┌──────────────────────────────┐
│ React + Vite frontend  │         │ FastAPI backend              │
│ (port 5173)            │  HTTP   │ (port 8000)                  │
│  - shadcn-style UI     │ ──────► │  - /api/health               │
│  - Tailwind + Framer   │         │  - /api/sample-data          │
│  - TanStack Query      │  JSON   │  - /api/analyse              │
│                        │ ◄────── │  - /api/runs/{id}/dashboard  │
└────────────────────────┘         │  - /api/runs/{id}/matrix     │
                                   │  - /api/runs/{id}/feedback/i │
                                   └──────────────┬───────────────┘
                                                  │
              ┌───────────────────────────────────┼───────────────────────────┐
              ▼                                   ▼                           ▼
     ┌────────────────┐                  ┌────────────────┐         ┌────────────────┐
     │ agent/         │                  │ outputs/       │         │ Groq LLM       │
     │ profiler       │                  │ html_dashboard │         │ llama-3.3-70b- │
     │ llm_client     │ ──────────────► │ excel_export   │         │ versatile      │
     │ parser         │                  │ word_template  │         │ (or demo data) │
     │ fitment        │                  └────────────────┘         └────────────────┘
     │ questions      │
     │ compliance     │
     │ comparison     │
     │ feedback       │
     │ demo_data      │
     └────────────────┘
```

**Demo mode** auto-engages when `GROQ_API_KEY` is missing or blank — three hand-crafted analyses (Anjali / Marcus / Sophia) plus a keyword-coverage heuristic for any other resume. No external calls; pytest can run anywhere.

---

## Tech stack

**Backend** — Python 3.11+, FastAPI, uvicorn, Groq SDK, pdfplumber, python-docx, openpyxl, python-dotenv, pytest

**Frontend** — React 18, Vite 5, TypeScript 5, Tailwind CSS 3, Framer Motion, TanStack Query, react-dropzone, Zustand (theme), lucide-react, sonner

---

## Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- (Optional) A Groq API key for live LLM mode. Without one, demo mode runs automatically.

### Backend

```bash
python -m pip install -r requirements.txt
cp .env.example .env        # then add GROQ_API_KEY if you have one
python -m uvicorn backend.main:app --reload --port 8000
```

Health check:
```bash
curl http://127.0.0.1:8000/api/health
# {"status":"ok","demo_mode":true,"model":"llama-3.3-70b-versatile"}
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# → http://127.0.0.1:5173
```

Open the page and click **"Try with sample data"** for a one-click demo.

---

## Running the tests

```bash
python -m pytest tests/ -v
```

Seven deterministic tests cover:
1. Demo mode engages without an API key
2. Rating normalisation handles every label variant
3. Question bank always covers four categories (auto-fills missing)
4. Compliance scanner marks Referenced / Unverified
5. Word feedback payload shape
6. HTML dashboard renders without any numeric scores
7. Excel and Word renderers produce valid non-empty files

---

## API surface

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/health` | GET | Liveness + demo-mode + model |
| `/api/sample-data` | GET | Bundled JD, checklist, sample resume filenames |
| `/api/analyse` | POST (multipart) | `job_description`, `checklist` (JSON string), optional `files[]`, optional `use_samples=true` |
| `/api/runs/{run_id}/dashboard.html` | GET | Standalone HTML dashboard |
| `/api/runs/{run_id}/matrix.xlsx` | GET | Excel fitment matrix |
| `/api/runs/{run_id}/feedback/{i}.docx` | GET | Word feedback pack for candidate `i` |

Runs are kept in memory with an LRU cap of 32; restarting the server clears them.

---

## Constraints / non-goals

- Runs are **ephemeral** (in-memory, LRU). Restart loses them by design.
- **No authentication** — meant to run locally during a hackathon / demo session.
- **No ATS or M365 integration** — feedback packs are produced and downloaded, not pushed.
- **Max 5 MB per resume**; reject larger uploads with HTTP 413.
- **No numeric scoring ever** — this is a panel-decision tool, not a ranking engine.

---

## Repo layout

```
.
├── agent/             # per-candidate pipeline modules
├── outputs/           # HTML / Excel / Word renderers
├── backend/main.py    # FastAPI app
├── frontend/          # React + Vite + Tailwind app
├── schemas/           # JSON checklist sample
├── sample_data/       # bundled JD + resumes
├── tests/             # pytest suite
└── README.md          # this file (plus claude.md, plan.md, prompts.md, projectbrief.md)
```
