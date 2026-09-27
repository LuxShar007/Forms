# Music Experience Survey & Research Platform

A modern, fluid, mobile-friendly research survey and executive intelligence dashboard built with Next.js 16, React 19, Supabase, and Framer Motion.

---

## Features

- **Distraction-Free Form UX**: Clean, minimalist questionnaire interface without header clutter, offering 1-question-per-screen flow with animated fluid chromatic background.
- **Full Mobile Optimization**: Fully responsive layout tailored for all screen sizes (down to 375px), touch-optimized controls, auto-zoom prevention for iOS, and fluid typography.
- **Executive Admin Intelligence Dashboard (`/responses`)**:
  - Live Supabase connection indicator and real-time response counters.
  - Interactive multi-color gradient analytics charts (Recharts) with responsive sizing and tooltips.
  - Switchable view: Executive Dossier Cards and Tabular Data view.
  - Direct individual modal dossier viewer with full answer breakdowns.
  - Qualitative "Voices & Quotes" feed with instant clipboard copying.
  - Instant CSV export of all verified participant data.
- **Robust Supabase Backend**:
  - Anonymous submissions with email duplicate checking.
  - Service-role authenticated admin API routes.
  - Build-safe fallbacks for smooth zero-error Vercel deployments.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **UI & Animation**: [React 19](https://react.dev), [Framer Motion](https://www.framer.com/motion/), [Tailwind CSS v4](https://tailwindcss.com), [Lucide React](https://lucide.dev)
- **Data Visualization**: [Recharts](https://recharts.org)
- **Backend & Database**: [Supabase](https://supabase.com) (PostgreSQL, `@supabase/ssr`, `@supabase/supabase-js`)

---

## Deploying to Vercel

### Step 1: Push Repository to GitHub
Ensure all code is committed and pushed to your GitHub repository:
```bash
git push origin main
```

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** > **"Project"**.
3. Select your GitHub repository (`Forms`).
4. Framework Preset will be automatically detected as **Next.js**.

### Step 3: Configure Environment Variables
Under **Environment Variables**, add the following 4 keys:

| Key | Description | Example / Location |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | `https://xyzproject.supabase.co` (Supabase Project Settings > API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Anon/Public API Key | `ey...` (Supabase Project Settings > API) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Secret | `ey...` (Supabase Project Settings > API) |
| `ADMIN_PASSWORD` | Password for `/responses` admin dashboard | Your custom administrative password |

### Step 4: Deploy
Click **"Deploy"**. The build runs cleanly with Turbopack and zero errors.

---

## Local Development

1. Clone repository:
```bash
git clone https://github.com/LuxShar007/Forms.git
cd Forms
```

2. Install dependencies:
```bash
npm install
```

3. Configure `.env.local` using `.env.example`:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public survey, or [http://localhost:3000/responses](http://localhost:3000/responses) for the admin dashboard.
