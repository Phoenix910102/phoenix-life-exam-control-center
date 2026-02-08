# Data Formats

## Timezone
- All date keys are `YYYY-MM-DD` in `Asia/Taipei`.

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
