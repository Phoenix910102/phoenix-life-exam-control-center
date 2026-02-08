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
