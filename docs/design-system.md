# OpenPaws Design System

## Overview

The frontend now uses a light, reference-aligned workspace shell designed for dense review workflows. The design system keeps the product looking consistent while preserving review-safe language and backend integrations.

## Token locations

- Theme extension: `frontend/tailwind.config.ts`
- Global base styles and shared component classes: `frontend/app/globals.css`
- Shared shell and page header: `frontend/components/app-shell.tsx`, `frontend/components/page-header.tsx`
- Reusable primitives: `frontend/components/ui/*`
- Domain components: `frontend/components/domain/*`

## Palette

- Background: `app-bg` `#F4F6F4`
- Panel: `app-panel` `#FFFFFF`
- Border: `app-line` `#D7E0E6`
- Strong border: `app-line-strong` `#A8B6C1`
- Primary accent: `app-teal` `#1F6B63`
- Deep accent: `app-teal-deep` `#153D39`
- Secondary accent: `app-mint` `#DCEDE7`
- Warning surface: `app-gold-soft` `#F6E9C9`
- Warning text: `app-gold` `#A9751A`
- Destructive surface: `app-coral-soft` `#F5E0DA`
- Destructive text: `app-coral` `#B45D45`
- Success text: `app-success` `#295E45`
- Risk low: `risk-low`
- Risk medium: `risk-medium`
- Risk high: `risk-high`
- Risk critical: `risk-critical`

## Typography

- Display: `DM Serif Display`
- Interface/body: `Space Grotesk`
- Utility/metadata: `JetBrains Mono`

## Layout rules

- Use the app shell for all main routes
- Keep primary actions in the page header action slot
- Use `Card` surfaces for content groupings
- Keep dense metadata in monospace labels or chips
- Use `Notice` for governance disclaimers and error summaries
- Use `EmptyState` whenever a route has no content to show
- Keep tables horizontally scrollable on narrower screens

## Component list

- Layout: `AppShell`, `PageHeader`
- Primitives: `Button`, `Card`, `Badge`, `Input`, `Textarea`, `Select`, `StatusPill`, `Notice`, `EmptyState`, `Skeleton`
- Data display: `MetricCard`, table primitives in `frontend/components/ui/table.tsx`
- Domain: `SearchResultCard`, `FindingCard`, `CitationChip`, `DocumentMetadataPanel`, `UploadDropzone`, `ReviewActionBar`

## Route coverage

- `/`
- `/dashboard`
- `/search`
- `/documents`
- `/documents/[id]`
- `/uploads`
- `/analysis`
- `/analysis/[id]`
- `/review`
- `/knowledge-base`
- `/rulebooks`
- `/contracts`
- `/gap-audits`
- `/reports`
- `/chat`
- `/admin`
- `/settings`
- `/design`
- `/login`

## Reference adaptation notes

- The reference shell and wireframe structure were adapted into the existing Next.js app router layout
- Tailwind v4-era reference CSS was translated into the project’s Tailwind v3 setup instead of being copied verbatim
- The existing API client remains active on search, documents, document detail, uploads, analysis creation, analysis detail retrieval, login, and document chat
- Placeholder content remains on routes where backend payloads are not yet fully wired, but those screens now use the same production-facing shell and design language

## Review-safe language

Use:

- potential risk
- possible gap
- candidate concern
- needs human review
- cited finding
- reviewed finding
- decision-support output

Avoid:

- violation
- illegal
- guilty
- liable
- enforcement recommended
- definitive noncompliance
