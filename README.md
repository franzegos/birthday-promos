# Philippine Birthday Promos Database

Frontend app for browsing Philippine birthday promos and freebies. Built from the [solo-founder-starter](https://github.com/franzegos9/solo-founder-starter) app template — Vite + React, no backend required.

## Pre-requisites

| Tool    | Version / notes                             |
| ------- | ------------------------------------------- |
| Node.js | 20+                                         |
| pnpm    | 10 (see `packageManager` in `package.json`) |

## Local setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Run the dev server

```bash
pnpm dev
```

| URL                   | What               |
| --------------------- | ------------------ |
| http://localhost:5173 | App (Vite default) |

### 3. Verify before push

```bash
pnpm verify
```

## Data

| File                                            | Purpose               |
| ----------------------------------------------- | --------------------- |
| `Philippine_Birthday_Promos_Database_2026.xlsx` | Source spreadsheet    |
| `src/data/birthday-promos.json`                 | App data (108 promos) |

Re-convert after editing the spreadsheet:

```bash
pnpm data:convert
```

## Design

Airbnb-inspired layout with sticky header, pill search bar, category tabs, listing cards, and a detail modal. Brand tokens (Airbnb Cereal VF, accent `#da1249`, light theme) live in `src/index.css`.

### Brand logos

Cards load logos from the promo's official website domain when available (Clearbit → Google favicon). Facebook-only sources fall back to brand initials. Sorting options: brand A–Z/Z–A, highest value, category, verified first.

### Location & nearest branch

Click **Use location** in the header, then open any promo. The detail modal shows the nearest listed branch when branch names or addresses are specific enough (e.g. mall names, street addresses). Promos with vague copy like "SM branches nationwide" still show the branch text but cannot calculate distance until the data lists actual locations.

## Useful scripts

| Script          | Purpose                              |
| --------------- | ------------------------------------ |
| `pnpm verify`   | Format, lint, typecheck, test, build |
| `pnpm dev`      | Vite dev server                      |
| `pnpm build`    | Typecheck + production build         |
| `pnpm test:run` | Vitest once                          |
