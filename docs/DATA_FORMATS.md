# Data Formats

## Timezone
- All date keys are `YYYY-MM-DD` in `Asia/Taipei`.

## Study materials
- Imported HTML, PDF, Markdown, text, and JSON files are stored locally in IndexedDB.
- Each material keeps its chapter list, active chapter, per-chapter progress, overall progress, and active-mainline flag.
- PDF content is stored as a data URL so it remains available after refresh and is included in full backup.

## Snapshot
- `dailyLogs` last 3 days
- `todayTaskSummary`
- `latestExam`
- `todayGameSummary`

## Full backup
Follows `ExportData` schema:
- `meta`
- `dailyLogs`
- `tasks`
- `questionBankMeta`
- `examAttempts`
- `wrongIndex`
- `gameSessions`
- `achievements`
- `studyMaterials`
- `settings`

## Example
```json
{
  "meta": {
    "timezone": "Asia/Taipei",
    "appVersion": "0.1.0",
    "createdAt": "2026-02-08T12:00:00.000Z"
  }
}
```
