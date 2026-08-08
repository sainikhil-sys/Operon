https://operon.cogniqa.systems
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Variables & Credentials Setup

To run **Operon** locally or in production, configure the environment variables in `.env.local` (or your deployment environment). Copy the template from `.env.example`:

```bash
cp .env.example .env.local
```

### Credentials & Where to Obtain Them

| Category | Variable | Where to Obtain |
|---|---|---|
| **App Config** | `NEXT_PUBLIC_SITE_URL` | Set to `http://localhost:3000` for local development or your domain in production. |
| **Supabase (Auth & DB)** | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL. |
| **Supabase (Auth & DB)** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → `anon` `public` key. |
| **Supabase (Auth & DB)** | `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API → `service_role` key (keep secret). |
| **Razorpay Payments** | `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Dashboard → Settings → API Keys → Key ID (`rzp_test_...` or `rzp_live_...`). |
| **Razorpay Payments** | `RAZORPAY_KEY_ID` | Razorpay Dashboard → Settings → API Keys → Key ID. |
| **Razorpay Payments** | `RAZORPAY_KEY_SECRET` | Razorpay Dashboard → Settings → API Keys → Key Secret. |
| **Razorpay Payments** | `RAZORPAY_WEBHOOK_SECRET` | Razorpay Dashboard → Settings → Webhooks → Secret. |
| **Groq AI** | `GROQ_API_KEY` | Groq Console → Create API Key (https://console.groq.com/keys). |



