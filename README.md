# JobMatch

JobMatch is a Next.js app that helps you find jobs that fit your background. Upload a PDF resume, and the app uses **Claude** to extract a skill profile, **Adzuna** to search live job listings, and **Claude again** to score each job against your profile. Results are ranked by match score and saved so you can revisit them from the dashboard.

## How it works

1. **Upload** — Drop a PDF CV (max 5MB) and enter a location plus comma-separated keywords (e.g. `React, TypeScript, Node`).
2. **Analyse** — Text is extracted from the PDF; Claude builds a structured skill profile (title, seniority, skills, experience, summary).
3. **Search** — Adzuna returns up to 20 US job listings for your keywords and location.
4. **Match** — Claude scores each listing and explains which skills align.
5. **Results** — View ranked jobs on `/results`; past uploads and searches appear on `/dashboard`.

Authentication is not implemented yet — the app uses a demo guest account (`demo@jobmatch.local`). The login page links straight to upload.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Prisma 7](https://www.prisma.io) + PostgreSQL
- [Anthropic Claude API](https://docs.anthropic.com) — CV analysis and job matching
- [Adzuna Jobs API](https://developer.adzuna.com) — job search (US listings)

## Prerequisites

- **Node.js 20+** and npm
- **PostgreSQL** (local install, Docker, or a hosted provider)
- **Anthropic API key** — [console.anthropic.com](https://console.anthropic.com)
- **Adzuna API credentials** — register at [developer.adzuna.com](https://developer.adzuna.com) (free tier available)

## Setup (start to finish)

### 1. Clone and install dependencies

```bash
git clone <your-repo-url> jobmatch
cd jobmatch
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Claude API key |
| `ADZUNA_APP_ID` | Adzuna application ID |
| `ADZUNA_API_KEY` | Adzuna API key |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_APP_URL` | App URL (use `http://localhost:3000` locally) |

Example `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jobmatch?schema=public"
```

### 3. Start PostgreSQL

**Option A — Docker**

```bash
docker run --name jobmatch-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=jobmatch -p 5432:5432 -d postgres:16
```

Use a `DATABASE_URL` that matches the user, password, host, port, and database name you configured.

**Option B — Local or hosted Postgres**

Create an empty database named `jobmatch` (or any name — update `DATABASE_URL` accordingly).

### 4. Run database migrations

Apply the schema and generate the Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

`migrate dev` creates tables for users, resumes, job searches, and scored job results. `generate` outputs the client to `lib/generated/prisma/`.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Run a job search

1. Go to **Upload Your CV** (home page or `/upload`).
2. Select a PDF resume.
3. Enter a **location** (e.g. `San Francisco, CA`) and **keywords** (comma-separated).
4. Click **Find Matching Jobs** and wait for upload → analysis → search → matching (this can take a minute while Claude runs).
5. You are redirected to **Results** with jobs sorted by match score.
6. Open **Dashboard** (`/dashboard`) to see past CVs and re-open previous searches.

> **Note:** Job search uses Adzuna’s US API (`/jobs/us/`). Listings are US-focused; location strings should match what Adzuna expects for US searches.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Run production server (after `build`) |
| `npm run lint` | Run ESLint |

## Production build

```bash
npm run build
npm run start
```

Set the same environment variables on your host. Run migrations against the production database before deploying:

```bash
npx prisma migrate deploy
```

## Project structure

```
app/
  page.tsx              # Landing page
  upload/               # CV upload flow
  results/              # Matched jobs (by jobSearchId)
  dashboard/            # History of uploads and searches
  api/
    upload-cv/          # PDF → text → save resume
    analyse-cv/         # Claude skill profile
    search-jobs/        # Adzuna search + save JobSearch
    match-jobs/         # Claude scoring + save JobResults
components/             # UI (CvUpload, JobList, etc.)
lib/
  claude.ts             # Anthropic integration
  adzuna.ts             # Job search API
  db.ts                 # Prisma client
prisma/
  schema.prisma         # Data model
```

## Troubleshooting

- **Database errors on upload** — Check `DATABASE_URL`, that Postgres is running, and that you ran `npx prisma migrate dev`.
- **Analysis or matching fails** — Verify `ANTHROPIC_API_KEY` and that your account has API access/credits.
- **No jobs or search errors** — Verify `ADZUNA_APP_ID` and `ADZUNA_API_KEY`; confirm your Adzuna app is approved for the jobs API.
- **Empty dashboard** — The dashboard reads from the database; without Postgres and migrations, it shows an empty state even if other steps partially work.

## License

Private project — see repository settings for license details if applicable.
