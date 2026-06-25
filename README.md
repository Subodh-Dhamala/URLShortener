# URL Shortener

A full-stack URL shortener built with TSOA, TypeORM, TypeScript, Next.js, Supabase, and Upstash Redis.

## Features

- Shorten any URL instantly — no login required
- Register / login to save links to your account
- QR code generation with PNG download
- Click tracking per link
- Redis caching for fast redirects
- Dashboard showing all your saved links

## Tech Stack

**Backend:** Node.js, Express, TSOA, TypeORM, PostgreSQL (Supabase), Redis (Upstash), JWT, bcryptjs

**Frontend:** Next.js, TypeScript, Tailwind CSS, Axios

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/shorten` | Optional | Shorten a URL |
| GET | `/:code` | None | Redirect to original URL |
| GET | `/:code/stats` | None | Get link stats |
| POST | `/auth/register` | None | Register |
| POST | `/auth/login` | None | Login |
| GET | `/urls/my-links` | Required | Get your links |

## Running Locally

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

## Environment Variables

**Backend `.env`:**
DATABASE_URL=

UPSTASH_REDIS_REST_URL=

UPSTASH_REDIS_REST_TOKEN=

JWT_SECRET=

BASE_URL=

**Frontend `.env.local`:**
NEXT_PUBLIC_API_URL=http://localhost:4500

API_URL=http://localhost:4500

## Deployment

- Backend deployed on [Render](https://render.com)
- Frontend deployed on [Vercel](https://vercel.com)
- Database on [Supabase](https://supabase.com)
- Redis on [Upstash](https://upstash.com)
