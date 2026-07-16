# AIAP Native Phoenix Curriculum Audit

Audit date: 2026-07-16

## Inventory

| Dataset | Chapters | Terms | A | B | C | Categories | Questions | Image questions | Sources |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `aiap-battle-rose.html` | 15 | 305 | 95 | 67 | 143 | 17 | 90 embedded | 0 | 37 |
| `aiap-hyperlinked-glossary.html` | 15 | 305 | 95 | 67 | 143 | 17 | 90 embedded | 0 | 37 |
| `aiap-chapter-progress.html` | 15 | 305 | 95 | 67 | 143 | 17 | 90 embedded | 0 | 37 |
| `aiap-progress-fixed.html` | 15 | 305 | 95 | 67 | 143 | 17 | 90 embedded | 0 | 37 |
| `boss_quiz_bank.js` | - | - | - | - | - | - | 240 | 0 | - |
| `final_exam_bank.js` | - | - | - | - | - | - | 100 | 10 | - |
| Existing Phoenix v1 package | 15 | 305 copied blocks | 95 | 67 | 143 | 17 | 90 | 0 | 37 |
| Native Phoenix v2 package | 15 | 305 unique records | 95 | 67 | 143 | 17 | 340 | 10 | 37 |

The four HTML files are snapshots of the same curriculum, not four independent term libraries. Their chapter and glossary identities match.

## V1 losses and flattening

- The v1 converter copied all 305 complete term cards into chapter blocks.
- It kept only the 90 questions embedded in the HTML chapter flow.
- It omitted all 240 Boss Quiz questions.
- It omitted 10 Final Exam image questions and their assets.
- It flattened glossary category, chapter, related-term, question, and source relationships into display blocks.
- It had no first-class question banks, learning paths, or source library collection.

## V2 result

- One canonical record per glossary term, addressed by a stable term key.
- One canonical record per question, addressed by a stable question key.
- Chapters use `term-reference` and `question-bank-reference` blocks instead of duplicating complete cards.
- Twelve Boss banks contain 240 questions; one Final bank contains 100 questions.
- All ten image questions point to local assets under `/materials/aiap/questions/`.
- All chapter, term, question, bank, and source references pass schema validation.
- The package keeps the existing slug and advances to version `2.0.0`.

## Migration

- Chapter progress, active chapter, last-opened metadata, and accumulated active study time are preserved.
- Legacy quiz attempts are mapped to stable v2 question keys by exact normalized prompt where possible.
- Existing progress did not contain per-term or per-block completion records, so no such records existed to migrate or orphan.
- Unmappable historical attempts remain in the attempt history without a `questionKey`; they are not deleted.

Machine-readable pre-overwrite evidence is retained in `docs/aiap-content-audit-v1.json`.
