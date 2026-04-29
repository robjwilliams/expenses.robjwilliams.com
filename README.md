# expenses.robjwilliams.com

> **Deprecated** — This project is archived and preserved here as a portfolio showcase. It is no longer actively maintained or deployed.

A personal expense tracking web app with automated grocery receipt import from Carrefour. Built as a live personal project to automatically pull weekly shopping data and visualise spending over time.

## What it does

- Authenticates users via Supabase and displays a dashboard of personal expenses
- Runs a weekly Puppeteer bot (via GitHub Actions) that logs into Carrefour's website, downloads PDF receipts, and parses + uploads the line-item data to Supabase
- Visualises spending trends with interactive charts

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Auth & Database | Supabase |
| Styling | Tailwind CSS |
| UI Components | Radix UI, shadcn/ui |
| Charts | Recharts / Tremor |
| Scraping | Puppeteer |
| Automation | GitHub Actions (cron, now disabled) |

## Status

This was a working personal project. The Supabase backend and Vercel deployment have since been shut down. The cron-based GitHub Action has been disabled. The code is preserved here as a reference.
