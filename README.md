# Phoenix Life & Exam Control Center

Local-first personal control center for daily logs, tasks, medication reminders, exams, mini-games, achievements, data export, and guzheng practice. Browser data is stored locally with IndexedDB; OpenAI requests run only through server-side API routes.

## Technology

- Next.js 15 App Router
- React 19 and TypeScript
- Tailwind CSS 3
- Dexie / IndexedDB for local persistence
- Zod for runtime validation
- OpenAI Node SDK for server-side AI features
- Vitest for unit tests
- Playwright for end-to-end tests

## Requirements

- Node.js 20 LTS or newer
- npm, using the committed `package-lock.json`

## Installation

```bash
git clone <your-private-repository-url>
cd phoenix-life-exam-control-center
npm ci
cp .env.example .env.local
```

Add local secrets to `.env.local`. Environment files are ignored by Git and must be configured separately on each Mac.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To let another device on the same network open the development server:

```bash
npm run dev -- --hostname 0.0.0.0
```

Use the Mac's local network IP address from the other device. Microphone access requires a secure HTTPS context except on `localhost`.

## Build And Start

```bash
npm run build
npm run start
```

## Tests

```bash
npm test
npm run lint
npm run test:e2e
```

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | For AI features | Server-side OpenAI API access. Never expose this as a `NEXT_PUBLIC_*` variable. |
| `OPENAI_MODEL_DEFAULT` | No | Overrides the default Helel response model. |
| `OPENAI_MODEL_PARSER_DEFAULT` | No | Overrides the raw-question parser model. |
| `APP_TOKEN` | No | When set, all `/api/*` requests must include the matching `x-app-token` header. |

Copy `.env.example` to `.env.local` and enter real values only in `.env.local`. Do not commit environment files, credentials, certificates, or private keys.

## Main Structure

```text
src/app/                 Next.js pages and server API routes
src/components/          Reusable UI and guzheng practice components
src/lib/db/              Dexie schema and local repositories
src/lib/exams/           Exam grading and question-bank helpers
src/lib/export/          Snapshot and backup builders
src/lib/games/           Game metrics and index calculations
src/lib/guzheng/         Jianpu, score, and pitch-detection logic
src/lib/helel/           OpenAI server helpers and model handling
src/types/               Zod schemas and TypeScript data contracts
public/                  Static web assets
data/templates/          Import templates
docs/                    Product and API documentation
scripts/                 Local maintenance and OCR utilities
tests/unit/              Vitest unit tests
tests/e2e/               Playwright browser tests
```

## Local Data And Migration

Application records live in the browser's IndexedDB and are not stored in Git. Use the application's export/backup functions before moving to another computer, then import that data on the new Mac. Source code, static assets, tests, and documentation can be synchronized through the private GitHub repository.

## Security Notes

- Keep the GitHub repository private.
- Store real secrets only in ignored environment files such as `.env.local`.
- Review `git status` and staged files before every push.
- Rotate a credential immediately if it is ever committed, even if the commit is later removed.
