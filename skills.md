# Skills And Operating Notes

This document tracks the project-specific skills, workflows, commands, and conventions Codex should preserve while working on PixelPirates.

## Collaboration Rules

- Keep `implementation.md`, `architecture.md`, and `skills.md` updated as the project changes.
- Prefer direct implementation over long discussion when requirements are clear.
- Surface blockers early, especially missing credentials, unclear scope, or failing setup commands.
- Protect user changes: do not revert edits unless explicitly asked.
- During the hackathon, bias toward the smallest reliable implementation that supports the demo.

## Project Context

- Project: PixelPirates
- Location: `C:\Summer Hacks\PixelPirates`
- Current state: empty repository except `.git` and initial documentation.
- Timeline: 24-hour hackathon.
- Track: Fintech.
- Problem statement: "The Financial Mirror."
- Product direction: analyze spending, income, and financial behavior to provide a clear, brutally honest financial checkup with actionable next steps.
- Current state: full-stack MVP implemented and awaiting verification/tuning.

## Selected Tech Stack

| Layer | Stack |
| --- | --- |
| Backend | Python + FastAPI |
| Data processing | `pandas`, `pdfplumber`, `tabula-py` |
| Categorization | Rule engine, dictionary-based rules, OpenAI `gpt-4o-mini` fallback |
| Insight generation | OpenAI GPT-4o or Gemini 1.5 Flash |
| Frontend | React + Recharts + Tailwind CSS |
| Auth | None or `localStorage` mock |
| Deployment | Vercel frontend + Railway or Render backend |
| Database | SQLite local or in-memory during demo |

## Product Interpretation Notes

- The product should not stop at charts, categories, or passive reporting.
- Insights should explain what happened, why it matters, and what should change.
- The tone can be direct, but should remain useful and understandable.
- Preserve the original problem framing when making future feature and architecture decisions.

## Known Commands

| Purpose | Command | Notes |
| --- | --- | --- |
| Inspect root | `Get-ChildItem -Force` | Confirms repository contents on Windows PowerShell. |
| Backend install | `python -m pip install -r backend/requirements.txt` | Installs FastAPI, pandas, PDF parsers, and optional AI SDKs. |
| Backend dev | `python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000` | Run from `backend/`. |
| Frontend install | `npm install` | Run from `frontend/`. |
| Frontend dev | `npm run dev` | Run from `frontend/`; default URL is `http://localhost:5173`. |
| Frontend build | `npm run build` | Production build verification. |

## Coding Conventions

- Backend should follow FastAPI service/router separation once scaffolded.
- Prefer `pandas` for transaction aggregation and structured financial calculations.
- Prefer deterministic rules before LLM calls for categorization to keep cost, latency, and demo risk low.
- Frontend should use React components, Tailwind utility classes, and Recharts for simple financial visuals.
- Keep auth out of the critical path unless explicitly required.
- Keep financial data session-only unless the user explicitly changes the privacy model.
- Prefer deterministic fallback behavior for demo-critical AI features.
- Use `Rs` instead of currency symbols in generated UI/output unless final branding requires otherwise.

## Documentation Update Checklist

When making meaningful changes:

1. Update `implementation.md` with what changed, why, commands run, and remaining blockers.
2. Update `architecture.md` when project structure, services, data models, routing, or deployment shape changes.
3. Update `skills.md` when project commands, conventions, workflows, or recurring constraints become known.

## Open Inputs Needed

- Required features.
- Judging criteria.
- Team skill set and preferred stack.
- Required APIs, datasets, or sponsor technologies.
- Deployment target and demo expectations.
- Expected user persona.
- Available OpenAI/Gemini API keys and credits.
