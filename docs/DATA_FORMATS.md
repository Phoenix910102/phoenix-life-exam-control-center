# Data Formats

## Timezone
- All date keys are `YYYY-MM-DD` in `Asia/Taipei`.

## Study materials
- Imported HTML, PDF, Markdown, text, and JSON files are stored locally in IndexedDB.
- Each material keeps its chapter list, active chapter, per-chapter progress, overall progress, and active-mainline flag.
- Phoenix package definitions and reading progress are exported separately as `materialDefinitions` and `materialProgress`.
- Legacy `studyMaterials` remains in backups during the v3 migration window so older local data is never discarded.
- PDF content is stored as a data URL so it remains available after refresh and is included in full backup.

### Campaign presentation

Phoenix packages may define a dual-layer campaign presentation:

```json
{
  "presentation": {
    "layout": "immersive-academy",
    "shellTheme": "criminal-rose",
    "readingTheme": "ivory-archive",
    "defaultMode": "reading",
    "availableModes": ["reading", "immersive", "night"]
  }
}
```

- `shellTheme` controls the campaign scene, navigation, characters, battlefield, and interaction frame.
- `readingTheme` controls the long-form content surface rendered by the shared Campaign Engine.
- `reading`, `immersive`, and `night` are the supported reading modes. The user's latest selection is stored once in application settings and reused across all Phoenix materials.
- The legacy `presentation.theme` field remains supported as the shell fallback for existing packages.
- Imported HTML remains a legacy material format. Formal campaigns render Phoenix Material blocks directly and never use an iframe as the campaign engine.

## Learning battlefield and care
- Dexie v4 adds `domainEvents`, `achievementProgress`, and the singleton `careState` table.
- Battlefield regions are derived from `materialProgress` and quiz attempts; battlefield visuals are not stored as a second source of truth.
- `domainEvents` records material, chapter, quiz, achievement, and care actions used by the achievement engine.
- `careState` stores hydration, meal, and bounded-rest records independently from any material slug.

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
- `questions`（完整題庫本體）
- `examAttempts`
- `wrongIndex`
- `gameSessions`
- `achievements`
- `achievementProgress`
- `careState`
- `domainEvents`
- `studyMaterials`
- `materialDefinitions`
- `materialProgress`
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
