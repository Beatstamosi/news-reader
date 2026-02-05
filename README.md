// ...existing code...

# News-reader

A minimal React + TypeScript + Vite app for reading Atom/RSS feeds. Provides a small server-side utility that fetches and parses feeds and returns a typed list of items with title, link and summary. Each article's title and summary can be synthesized to speech using the ElevenLabs API.

## Features

- Fetch and parse Atom/RSS feeds (returns title, link and summary per entry)
- Serverless API (rss.ts) that returns JSON FeedItem[]
- Client UI that displays title + summary and a link to the original article
- Text-to-speech using ElevenLabs (reads out title + summary)
- TypeScript types and tests
- Vite dev server for frontend; Vercel recommended for serverless functions

## Requirements

- Node.js 18+
- npm, pnpm or yarn
- ElevenLabs API Key (VITE_ELEVENLABS_API_KEY)
- Vercel CLI / account (recommended, for serverless function runtime and deployment)

## Environment variables

Create a local `.env.local` (do not commit this file) with at least:

```
VITE_ELEVENLABS_API_KEY="your-elevenlabs-key"
```

Notes:

- ELEVENLABS_API_KEY: used to synthesize speech for each entry (title + summary).
- FEED_URL: Atom/RSS feed URL to fetch and parse inside rss.ts

Keep the API key secret. For production, set the secret in Vercel (or your hosting provider) rather than committing it.

## Local development

1. Install dependencies

```bash
npm install
```

2a. Run frontend only (Vite)

```bash
npm run dev
```

2b. Run serverless function locally (recommended)

```bash
# start Vercel dev which serves serverless functions and static assets locally
npx vercel dev
```

- The serverless function (e.g., api/rss.ts) returns an array of objects:
  { title: string, link: string, summary: string }
- The UI displays title and summary. When a user requests it, the app calls ElevenLabs to read the concatenated "title + summary" aloud. The original article link remains visible and clickable.

## API / Usage

Fetch articles from the serverless endpoint (example):

```ts
const res = await fetch("/api/rss");
const items: { title: string; link: string; summary: string }[] =
  await res.json();
```

Each item:

- title — article title (string)
- link — canonical URL to the article (string)
- summary — short HTML/text summary (string)

## Deployment

Vercel is recommended because rss.ts is implemented as a serverless function and Vercel provides a compatible runtime.

1. Install and log in:

```bash
npx vercel login
```

2. Add env vars to Vercel:

```bash
# interactive; replace 'production' with the target environment
vercel env add ELEVENLABS_API_KEY production
```

3. Deploy:

```bash
npx vercel --prod
```

## Security & privacy

- Do not commit ELEVENLABS_API_KEY or other secrets to source control.
- The app sends title + summary to ElevenLabs to synthesize speech. Consider privacy and consent for the content you process.

## Tests & linting

- Run tests:

```bash
npm run test
```

- Type checks & lint:

```bash
npm run typecheck
npm run lint
```

## Contributing

Issues and PRs welcome. Run tests and linters before submitting changes.
