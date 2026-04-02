# 🏈 NFL Draft Challenge

A social prediction game for the NFL Draft — like ESPN's March Madness bracket challenge, but for the draft.

## Features

- **Mock Draft Builder** — Predict all 32 first-round picks (optional Round 2)
- **Trade Predictions** — Predict which teams will trade picks (400 pts for correct trade + players)
- **Confidence Points** — Assign 1–32 confidence values to weight your best predictions
- **Private Leagues** — Create or join leagues with invite codes (up to 20 players)
- **Draft Night Live** — Real-time scoring, animated leaderboards, and trash talk chat
- **Push Notifications** — Get alerts when picks are announced on draft night
- **PWA** — Install to home screen, offline support, mobile-first design

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Firebase (Firestore + Auth + Cloud Messaging)
- **State:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **PWA:** manifest.json + Service Worker + FCM

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Firestore, Auth, and Cloud Messaging enabled

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/mhbnathanielo81/NFL-Draft-Challenge.git
   cd NFL-Draft-Challenge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` from the template:
   ```bash
   cp .env.example .env.local
   ```

4. Add your Firebase config values to `.env.local`

5. Deploy Firestore security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

6. Run the dev server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Login & signup routes
│   ├── (main)/            # Authenticated app routes
│   │   ├── dashboard/     # Home dashboard
│   │   ├── draft/         # Mock draft builder
│   │   ├── leagues/       # League management
│   │   ├── leaderboard/   # Standings
│   │   └── live/          # Draft Night Live mode
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components
│   ├── draft/             # Draft-specific components
│   ├── league/            # League components
│   └── layout/            # Navigation, headers
├── lib/
│   ├── firebase.ts        # Firebase initialization
│   ├── auth.ts            # Auth functions
│   ├── db.ts              # Firestore operations
│   └── utils.ts           # Utilities
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── data/                  # Static data (prospects, draft order)
```

## Scoring

| Prediction | Points |
|---|---|
| Correct player at exact pick | 100 |
| Correct trade (teams + both players) | 400 |
| Correct trade (teams only) | 100 |

Confidence points multiply your score for each pick.

## 2026 NFL Draft

- **Round 1:** Thursday, April 23, 8:00 PM ET
- **Rounds 2–3:** Friday, April 24, 7:00 PM ET
- **Rounds 4–7:** Saturday, April 25, 12:00 PM ET
- **Location:** Pittsburgh, PA (Acrisure Stadium)

## License

Private project. All rights reserved.
