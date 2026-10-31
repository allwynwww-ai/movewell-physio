# Physiotherapy Clinic Website (Basic + Pro)

A fast, mobile-first website template for physiotherapy clinics in India. One file —
`src/site.config.ts` — holds every clinic detail (name, contact, address, hours, services,
team, reviews, SEO), so a new clinic can be set up in under an hour.

The repository ships with a **neutral demo brand** ("Your Clinic Physiotherapy",
"Dr. Jane Doe (Demo)", placeholder phone/email/address) and **sample** reviews and figures
that are clearly labelled as samples.

Built with Next.js (App Router), React, TypeScript and Tailwind CSS. Deploys to Vercel with
zero configuration.

---

## Features by plan

### Basic — available now (this repository)

- Pages: Home, Services, About, Testimonials, Book, Contact, Privacy Policy, Terms of Use
- All clinic content in one config file (`src/site.config.ts`)
- **Appointment request form** delivered by email via [FormSubmit](https://formsubmit.co) (free, no backend)
  - Required consent checkbox linked to the Privacy Policy (DPDP Act 2023)
  - Spam honeypot field
  - Honest confirmation: "Request received – the clinic will contact you to confirm your appointment"
  - "Prefer WhatsApp? Send your request on WhatsApp" — pre-fills a WhatsApp message with the form details
- WhatsApp floating button, click-to-call, sticky mobile action bar
- Opening hours defined once and shown on Contact, Book, the footer and in structured data
- Privacy Policy and Terms of Use templates written for India's DPDP Act 2023
- SEO: per-page titles/descriptions, canonical URLs, Open Graph + Twitter cards, generated
  share image, `sitemap.xml`, `robots.txt`, JSON-LD (`MedicalClinic` / `Physiotherapy`, `FAQPage`)
- Sample-content notice for demo reviews/figures (one switch to turn off)
- Light/dark mode, accessible navigation, `prefers-reduced-motion` support
- Optimised local images with a credits file (`public/images/CREDITS.md`)

### Pro — available now

Each Pro feature has its own switch, so a clinic gets exactly what it pays for.

- **Online appointment booking** (off by default) — live calendar of free slots, instant
  confirmation, calendar invite (.ics), patient self-service cancel/reschedule, clinic admin at
  `/admin`. See [Online booking (Pro)](#online-booking-pro).
- **Google reviews badge** — "Rated 4.8 on Google · 120 reviews" on Home, plus a small badge on
  Contact and in the footer, linking to the clinic's Google listing. Figures are entered by hand
  (no Google API key or billing).
- **Therapist profiles** — a `/team` page and a "Meet our team" section on Home. Works with one
  therapist or many; initials avatar when there is no photo.
- **Vercel Web Analytics** — cookie-free page views plus click events for Book, Call and
  WhatsApp. Never loaded on `/admin`.
- **Exercise library** — `/exercises` with a body-area filter and a page per exercise
  (steps, sets/reps, tips, safety note, Book button). No blog.

See [Pro extras](#pro-extras-reviews-team-analytics-exercises) for setup.

### Premium — planned

- Online payments / deposits
- Multi-location clinics
- Patient reminders (WhatsApp / SMS / email)
- Custom design and copywriting

The `features` block in `site.config.ts` reserves flags for these; they have no effect yet.

---

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Next.js 16 (App Router, static pre-rendering) |
| UI | React 19, Tailwind CSS v4 |
| Language | TypeScript |
| Forms | FormSubmit AJAX endpoint (free) |
| Social images | `next/og` (`src/app/opengraph-image.tsx`) |
| Hosting | Vercel (recommended) — any Node host works |
| Lint | ESLint 9 + `eslint-config-next` |

No paid services or API keys are required.

---

## Quick start

Requires Node.js 20 or newer.

```bash
npm i && npm run dev
```

Open http://localhost:3000.

Other scripts:

```bash
npm run lint    # ESLint
npm run build   # production build (must pass before deploying)
npm start       # serve the production build
```

---

## Setting up a new clinic (under 1 hour)

### 1. Edit `src/site.config.ts` (≈30 min)

Everything the site displays comes from this file. Work through it top to bottom:

| Section | What to change |
|---------|----------------|
| `brand` | Clinic name, short name, tagline, optional logo path |
| `contact` | `phoneDisplay`, `phoneTel` (E.164, e.g. `+919876543210`), `whatsappNumber` (digits only, with country code), `email`. Set `isDemoNumber: false` |
| `booking` | `formSubmitEmail` — the inbox that receives appointment requests |
| `address` | Street lines, city, state, PIN, `geo` (lat/lng), `mapEmbedUrl` (Google Maps → Share → Embed a map → copy the `src` URL) |
| `openingHours` | Days and times (24-hour `HH:MM`). Days not listed are shown as Closed |
| `therapists` | Name, title, qualifications, bio, photo |
| `hero`, `philosophy`, `services`, `conditions`, `faq` | Page copy. Service prices (`priceINR`) and durations are optional |
| `stats`, `testimonials` | Replace with real figures and real reviews, and set `isSample: false` on each |
| `social` | Instagram / Facebook / Google Business links (empty = hidden) |
| `legal` | Legal entity name, grievance officer contact, retention period, jurisdiction city, `lastUpdated` |
| `seo` | `siteUrl` (e.g. `https://www.clinicname.in`), title, description, keywords |

Then search the project for any leftover demo text:

```bash
grep -rniE "your clinic|your city|jane doe|demo|\.example|98XXX|90000 00000" src
```

### 2. Replace the images (≈10 min)

Replace the files in `public/images/` (keep the same names and similar proportions):

- `hero.jpg` — 4:3 landscape
- `therapist.jpg` — 3:4 portrait of the real therapist
- `clinic-1.jpg`, `clinic-2.jpg` — 16:9 clinic photos

Update the `alt` text in `site.config.ts` and record the source and licence of every image in
`public/images/CREDITS.md`. The current images are AI-generated placeholders and must not be
presented as the clinic's real staff or premises.

### 3. Activate the booking form (FormSubmit) (≈5 min)

1. Set `booking.formSubmitEmail` to the clinic's inbox. While the address ends in `.example`
   the form runs in **demo mode**: it shows the success message but sends nothing.
2. Deploy, open `/book` on the live site and submit a test request.
3. FormSubmit emails an **activation link** to that inbox on the first submission — click it.
   Requests are not delivered until this is done.
4. Submit a second test and confirm the email arrives (check spam). Optionally, replace the
   email in the config with the random alias FormSubmit gives you after activation, so the real
   address is not visible in the page source.

### 4. Set the domain / `siteUrl` (≈5 min)

Set `seo.siteUrl` to the final domain (no trailing slash). It is used for canonical URLs,
the sitemap, robots.txt, Open Graph tags and structured data. If left empty, the site falls
back to `NEXT_PUBLIC_SITE_URL`, then the Vercel production URL, then `http://localhost:3000`.

### 5. Deploy to Vercel (≈10 min)

1. Push the repository to GitHub.
2. In Vercel: **Add New → Project**, import the repo, keep the defaults (Next.js is detected).
3. Add the clinic's domain under **Project → Settings → Domains** and follow the DNS steps.
4. Re-check `seo.siteUrl` matches the domain and redeploy.

---

## Removing the sample notice

When the clinic's real reviews and figures are in place:

1. Set `isSample: false` on every item in `stats` and `testimonials`.
2. Set `showSampleNotice: false` in `site.config.ts`.

Only publish genuine reviews from real patients, with their permission. Do not copy Google
reviews without consent, and don't claim ratings or patient numbers you can't back up.

---

## Online booking (Pro)

Off by default. When it's off (or not fully set up) the Book page shows the FormSubmit
request form exactly as before, so nothing breaks for Basic clinics.

**What patients get** (`/book`): pick a service → pick a day and a free time on a calendar
(all times IST) → enter name, phone, email, optional note and tick consent → the booking is
confirmed instantly with a reference number, an "Add to calendar" (.ics) file and a private
"Manage booking" link to reschedule or cancel up to `cancellationCutoffHours` before.
Two people can never grab the same slot — the database enforces it.

**What the clinic gets** (`/admin`, password-protected, hidden from search engines):
today / upcoming / week / past views, search by name, phone or reference, confirm, cancel,
reschedule, mark done / no-show, block leave days, CSV export and simple stats.

### Turn it on (on Vercel)

1. **Database:** Vercel project → *Storage* → *Create* → **Neon (Postgres)** → connect it to
   the project. This adds `DATABASE_URL` / `POSTGRES_URL` automatically.
2. **Environment variables** (Project → Settings → Environment Variables):
   | Name | Required | What it is |
   | --- | --- | --- |
   | `SESSION_SECRET` | yes | Random 32+ character secret. Generate: `openssl rand -base64 48` |
   | `ADMIN_PASSWORD` | yes | Password for `/admin` (use a long one) |
   | `FEATURE_ONLINE_BOOKING` (or `NEXT_PUBLIC_FEATURE_ONLINE_BOOKING`) | yes* | `true` to switch online booking on (*or set `features.onlineBooking: true` in `site.config.ts`) |
   | `RESEND_API_KEY` | optional | [Resend](https://resend.com) key for booking confirmation / change / cancellation emails. Without it, no emails are sent |
   | `RESEND_FROM_EMAIL` | optional | Sender on a domain verified in Resend |
   | `CLINIC_NOTIFY_EMAIL` | optional | Where new-booking alerts go (default: `contact.email`) |
3. **Create the tables:** locally with the production `DATABASE_URL`, run
   `npm run db:migrate`. (The app also creates the tables automatically on first use, but
   running the migration up front is cleaner.)
4. **Redeploy** — the flag is read at build time, so changing env vars needs a new deployment.
5. Test it: make a booking on `/book`, open the manage link, sign in to `/admin`, then
   cancel the test booking.

### Settings (`src/site.config.ts` → `onlineBooking`)

Slot length, bookable hours per weekday, breaks, holidays, how far ahead patients can book,
minimum notice, cancellation cut-off, instant vs. manual confirmation (`autoConfirm`) and a
per-phone limit on upcoming bookings. Extra leave days can be blocked any time in `/admin`.
Services and their durations come from `services` in the same file.

### Local development

```bash
cp .env.example .env.local   # fill in DATABASE_URL, SESSION_SECRET, ADMIN_PASSWORD
                             # and NEXT_PUBLIC_FEATURE_ONLINE_BOOKING=true
npm run db:migrate
npm run dev
```

Not included: Google Calendar sync, online payments, WhatsApp reminders.

---

## Pro extras (reviews, team, analytics, exercises)

### Switches (`src/site.config.ts` → `features`)

| Switch            | Default (demo) | Env override (optional)    | What it controls                                   |
| ----------------- | -------------- | -------------------------- | -------------------------------------------------- |
| `googleReviews`   | `true`         | `FEATURE_GOOGLE_REVIEWS`   | Rating section on Home, badge on Contact + footer  |
| `therapists`      | `true`         | `FEATURE_THERAPISTS`       | `/team` page, "Meet our team" on Home, nav link    |
| `analytics`       | `true`         | `FEATURE_ANALYTICS`        | Vercel Web Analytics + Book/Call/WhatsApp events   |
| `exerciseLibrary` | `true`         | `FEATURE_EXERCISE_LIBRARY` | `/exercises`, `/exercises/[slug]`, nav link        |

- Set a switch to `false` for a Basic clinic. A switched-off feature is **fully hidden**: no
  nav or footer links, no sitemap entries, and its pages return 404.
- An env var (`true` / `false`) wins over the config file, so one codebase can serve several
  clinics. Pages are pre-built, so **redeploy** after changing a switch or env var.

### Google reviews (`googleReviews`)

Copy the numbers by hand from the clinic's Google Business Profile and update them every month
or two:

```ts
googleReviews: {
  rating: 4.8,          // 1–5
  reviewCount: 120,
  url: "https://g.page/r/XXXX/review", // the clinic's Google listing or review link (https)
  isSample: false,      // true shows a "Sample rating" label while showSampleNotice is on
},
```

- Rating, count and URL set → full badge "Rated 4.8 on Google · 120 reviews" with
  "See our reviews on Google".
- Only `url` set (remove `rating` and `reviewCount`) → a simple "Find us on Google" link.
- `reviewCount: 0`, rating 0 or missing data → nothing is shown.
- No `AggregateRating` structured data is added: Google does not show review stars for a
  business's own reviews about itself, and copied ratings can go out of date.

### Team (`team`)

```ts
team: {
  heading: "Meet our team",
  intro: "…",
  homeLimit: 3,         // how many cards Home shows (max 4); the rest are on /team
  members: [
    {
      slug: "priya-sharma",           // unique, used as /team#priya-sharma
      name: "Dr. Priya Sharma (PT)",
      title: "Senior Physiotherapist",
      qualifications: "BPT, MPT (Ortho)",          // optional
      photo: "/images/team/priya.jpg",              // optional — initials avatar if missing
      photoAlt: "Dr. Priya Sharma",                 // optional
      specialties: ["Back pain", "Sports injuries"],
      languages: ["English", "Hindi"],              // optional
      yearsExperience: 8,                           // optional
      bio: "Two or three sentences…",
    },
  ],
},
```

Put photos in `public/images/team/` (square, at least 400×400) and list them in
`public/images/CREDITS.md`. The About page keeps using the separate `therapists` entry (the lead
therapist). Booking does not ask patients to choose a therapist.

### Exercise library (`src/content/exercises.ts`)

Each exercise is one object in that file: `slug`, `title`, `bodyArea` (Knee, Back, Neck,
Shoulder, Ankle, Hip), `difficulty`, `summary`, optional `equipment`, `steps`, `dosage`
(`sets`, `reps`, `hold`, `frequency`) and `tips`. The filter chips are built from the body areas
in use. Every page shows the same safety note (`EXERCISE_DISCLAIMER`). Keep wording general
("may help you move more comfortably"), not promises to cure a condition, and have a
physiotherapist review any new exercise.

**Pictures.** Each sample exercise has an original two-panel "Start / End" illustration created
for this project (`public/images/exercises/<slug>.webp`, 1280×720, plus a small JPG copy in
`public/images/exercises/og/` used for WhatsApp/Facebook link previews). It is shown large on the
exercise page and as the card image on `/exercises`. To use the clinic's own photo, drop the file
in `public/images/exercises/` and change the exercise's `image`:

```ts
image: {
  src: "/images/exercises/heel-slides-clinic.jpg",
  alt: "Heel slides: start lying flat with legs straight; end with one knee bent", // describe both positions
  width: 1600, height: 900,                // the photo's real pixel size (16:9 looks best)
  og: "/images/exercises/heel-slides-clinic.jpg", // optional share image (JPG/PNG)
},
```

Remove `image` and the page falls back to a simple line icon drawn in code. List any new photo in
`public/images/CREDITS.md`.

### Analytics (Vercel Web Analytics)

What the code does when `analytics` is on:

- Adds `<Analytics />` from `@vercel/analytics` to every public page. It is cookie-free, so no
  cookie banner is needed.
- Sends click events **Book click**, **Call click** (`tel:` links) and **WhatsApp click**, each
  with `location` (header, footer, mobile-bar, whatsapp-float, home…) and `page`.
- Never loads on `/admin` or on patients' private `/book/manage/…` links, and drops any event
  from those paths.

**Owner setup (one time, in Vercel):**

1. Vercel dashboard → the project → **Analytics** tab → **Enable**. Nothing is collected until
   this is done.
2. Redeploy. Vercel then serves the script at `/_vercel/insights/*`.
3. Page views work on every plan (Hobby includes 50,000 events a month). **Custom events (the
   Book/Call/WhatsApp clicks) need a Vercel Pro or Enterprise plan.** On Hobby the clicks are
   simply not recorded. On Pro they appear under Analytics → Events. Each event sends two
   properties (`location`, `page`), which is the Pro limit.

Locally and on non-Vercel hosts the script is not served, so nothing is tracked.

---

## Go-live checklist

- [ ] Clinic name, phone, WhatsApp, email and address are correct (`isDemoNumber: false`)
- [ ] No demo text remains (run the grep command above)
- [ ] Opening hours are correct
- [ ] Therapist names, qualifications and registration details are accurate
- [ ] Real photos are in place and listed in `public/images/CREDITS.md`
- [ ] Sample reviews/figures replaced with real ones, `showSampleNotice: false`
- [ ] FormSubmit activated and a test request received
- [ ] WhatsApp button opens a chat with the right number
- [ ] Map shows the clinic's location; `geo` coordinates set
- [ ] Privacy Policy and Terms reviewed by a lawyer; grievance officer details filled in
- [ ] `seo.siteUrl` set; `/sitemap.xml` and `/robots.txt` show the live domain
- [ ] Share preview checked (e.g. paste the URL into WhatsApp)
- [ ] If using online booking: database connected, `SESSION_SECRET` + `ADMIN_PASSWORD` set,
      migration run, a test booking made and cancelled, `/admin` login works
- [ ] `npm run lint` and `npm run build` pass
- [ ] Site tested on a phone, in light and dark mode
- [ ] Google Business Profile links to the new site
- [ ] Pro extras: switches set for this clinic's plan; Google rating/count/URL copied from
      the real listing (`isSample: false`); demo team replaced; Web Analytics enabled in Vercel

---

## Project structure

```
src/
  site.config.ts        ← all clinic data (edit this)
  app/                  ← pages (/, /about, /services, /team, /exercises, /testimonials, /book, /contact, /privacy, /terms)
    sitemap.ts, robots.ts, opengraph-image.tsx, twitter-image.tsx
  components/           ← header, footer, booking form, carousel, etc.
  lib/site.ts           ← helpers derived from the config (links, hours, site URL)
  lib/seo.ts            ← page metadata and JSON-LD helpers
  lib/features.ts       ← Pro feature switches, nav links, reviews/team helpers
  content/exercises.ts  ← exercise library content (Pro)
  components/analytics/ ← Vercel Analytics + click events (Pro)
  lib/booking/          ← online booking: slots, database, tokens, emails (Pro)
  app/admin/            ← clinic admin dashboard (Pro)
  app/api/booking/      ← booking API routes (Pro)
db/migrations/          ← SQL for the booking tables (`npm run db:migrate`)
public/images/          ← photos + CREDITS.md
```

---

## Licence

Copyright © 2026 Allwyn D'Souza. **All rights reserved.**

This is proprietary software. No part of it may be copied, modified, distributed, sublicensed
or used to build websites for third parties without a written licence granted by
Allwyn D'Souza. Clinics receive the right to use their delivered website under the terms of
their individual agreement.
