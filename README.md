# CodeClash

> **Where friends become rivals.**

A competitive coding challenge platform for developer groups. Create challenges, submit projects, vote on peer work, and climb the leaderboards.

![CodeClash](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Prisma](https://img.shields.io/badge/Prisma-5-indigo) ![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

## Features

- 🔐 **GitHub OAuth** - Sign in with your GitHub account
- 👥 **Groups** - Create private groups with invite codes
- ⚡ **Challenges** - Create coding challenges with custom scoring weights
- 📦 **Submissions** - Submit projects with GitHub repos and live demos
- 🗳️ **Peer Voting** - Vote on submissions across 4 categories
- 🏆 **Leaderboards** - Track rankings per challenge and overall
- 🤖 **AI Analysis** - Get code quality feedback (optional)

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Ant Design
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Auth**: NextAuth.js with GitHub OAuth
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (Supabase recommended)
- GitHub OAuth App

### 1. Clone and Install

```bash
cd "Code Clash"
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# GitHub OAuth
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key

# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

### 3. Database Setup

Push the Prisma schema to your database:

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── api/             # API routes
│   ├── auth/            # Auth pages
│   ├── dashboard/       # User dashboard
│   └── groups/          # Group pages
├── components/          # React components
│   ├── auth/           # Auth components
│   ├── challenges/     # Challenge components
│   └── layout/         # Layout components
├── lib/                 # Utilities
│   ├── auth.ts         # NextAuth config
│   ├── prisma.ts       # Prisma client
│   └── validations/    # Zod schemas
└── types/              # TypeScript types
```

## Scoring System

Each challenge has 4 scoring categories with configurable weights (must sum to 10):

- **Functionality** - Does it work as expected?
- **UI/Design** - Is it visually appealing?
- **Creativity** - Is it original?
- **Code Quality** - Is the code clean?

Voters rate each category from 0 to the max weight. Final scores are averages.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

Build command is already configured:
```bash
prisma generate && next build
```

## License

MIT

---

Built with ❤️ for developers who love friendly competition.
