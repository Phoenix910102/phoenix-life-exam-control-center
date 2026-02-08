# Phoenix Life & Exam Control Center — Agent Guide

## Project Goals
- Build a local-first Next.js app for life logging, tasks, meds, exams, mini-games, achievements, and export/backup.
- Keep OpenAI usage server-only via API routes.
- Support model switching for Helel messaging and raw question parsing.
- Provide a `/console` page for direct ingest and API testing.

## Non-Goals
- Real multi-user auth/account system.
- Cloud sync and remote persistence.
- Advanced adaptive tutoring engine beyond MVP rules.
- Production-grade push notification infra (in-app toast only in MVP).

## Directory Structure
- `src/app/*`: pages and API routes.
- `src/components/*`: reusable UI sections and cards.
- `src/lib/db/*`: Dexie schema and repository.
- `src/lib/export/*`: snapshot/full backup builders.
- `src/lib/exams/*`: exam grading and wrong-index derivation helpers.
- `src/lib/games/*`: game metrics and index computation.
- `src/lib/notifications/*`: in-app toast notification helper.
- `src/lib/helel/*`: model allowlist, API helpers, prompt/schema definitions.
- `src/types/*`: zod + TS data contracts.
- `docs/*`: product and technical docs.
- `data/templates/question_inbox.md`: batch import template.

## Data Models (Source of Truth)
- `DailyLog`, `Task`, `Question`, `ExamAttempt`, `WrongQuestionIndex`, `GameSession`, `Achievement`, `ExportData`, `AppSettings`.
- Timezone is fixed to `Asia/Taipei`; day key is `YYYY-MM-DD` in that timezone.
- All ingest and export payloads are validated with zod.

## API Contracts

### `POST /api/helel`
- Input: `{ trigger, intensity, attempt?, model?, userStateSummary, payload? }`
- Behavior: validates requested model against `/api/models` allowlist; fallback to default model.
- Output (structured): `{ message, cta, toneTag, handoffHint }`
- Constraints: Traditional Chinese, 1-3 sentences, <= 60 chars, safe content.

### `GET /api/models`
- Returns curated model list from OpenAI list-models API.
- 5-minute in-memory cache.
- Filters to `gpt-*` models emphasizing GPT-5/5.1/5.2 and optional 4.1.
- On upstream failure, fallback to static allowlist.

### `POST /api/ingest/task`
- Input task draft.
- Normalizes into canonical `Task` (id/defaults/dueTime parsing).
- Optional `withHelelLine` calls Helel generator.
- Output: `{ task, helel? }`.

### `POST /api/ingest/question`
- Mode A: structured question draft -> canonical `Question`.
- Mode B: raw text parsed via structured outputs.
- Critical rule: if answer not explicit, set `answer=null` and return warnings.

### `POST /api/ingest/question-inbox`
- Input: `{ text, format }` where format in `md|csv|auto`.
- Splits into candidate items and parses each using raw parser schema.
- Output: `{ questions[], warnings[], errors[{index,message}] }`.

### Auth Guard for `/api/*`
- If `APP_TOKEN` exists, require `x-app-token` header match.

## Export Naming Rules
- Snapshot filename: `phoenix-snapshot-YYYYMMDD-HHMM.json`.
- Full backup filename: `phoenix-backup-YYYYMMDD-HHMM.json`.
- Time formatting uses `Asia/Taipei` local datetime.

## Notification Engine (MVP)
- In-app only (toast) notifications.
- Sources: task publish, med reminders, study prompts, life prompts.
- Uses user intensity setting (`gentle|standard|strict`) to tune copy severity.

## Model Switching Rules
- User chooses two models in Settings:
  - `models.helelModel` for Helel messages.
  - `models.parserModel` for raw question parsing.
- Persist settings locally in Dexie `settings` table.
- Server validates incoming `model` against cached `/api/models` allowlist.
- Invalid or unavailable model auto-falls back to:
  - `OPENAI_MODEL_DEFAULT` for Helel.
  - `OPENAI_MODEL_PARSER_DEFAULT` for parser when relevant.
