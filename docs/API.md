# API

## Auth
If `APP_TOKEN` is set, all `/api/*` require header `x-app-token`.

## GET /api/models
Returns `{ models: [{id,label}] }`.

## POST /api/helel
Request:
- `trigger`
- `intensity`
- `attempt?`
- `model?`
- `userStateSummary`
- `payload?`

Response:
- `message`
- `cta`
- `toneTag`
- `handoffHint`

## POST /api/ingest/task
Request: task draft + `withHelelLine?` + `model?`
Response: `{ task, helel? }`

## POST /api/ingest/question
- `mode=structured` + `questionDraft`
- `mode=raw` + `rawText` + `model?`

## POST /api/ingest/question-inbox
Request: `{ text, format, model? }`
Response: `{ questions, warnings, errors }`
# Phoenix 教材收件匣

### `GET /api/materials/remote`
- Uses the server-only GitHub Contents API configuration.
- Returns only `.phoenix-material.json` files that pass `phoenix.material.v1` validation.
- Missing `GITHUB_MATERIALS_TOKEN` returns setup guidance without affecting local materials.

### `POST /api/materials/remote/sync`
- Input: `{ paths: string[], localMaterials: { slug, version }[] }`.
- Re-fetches and validates selected remote packages, then classifies them as new, same-version, upgrade, or downgrade.
- The client writes the returned validated package to Dexie only after user confirmation.
