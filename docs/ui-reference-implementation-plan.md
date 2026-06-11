# UI Reference Implementation Plan

## Frontend location

- Main frontend lives in `frontend/`
- App router lives in `frontend/app`
- Shared components live in `frontend/components`
- Existing API wiring lives in `frontend/lib/api-client.ts`
- Existing session/auth helpers live in `frontend/lib/auth.ts`

## Current frontend stack

- Next.js App Router
- React 19
- Tailwind CSS 3
- Custom lightweight UI primitives in `frontend/components/ui`

## Reference folder contents

- `reference/app`: route wireframes and layout structure
- `reference/components`: app shell, navigation, cards, tables, and domain UI patterns
- `reference/app/globals.css`: reference tokens, typography intent, and theme variables
- `reference/public`: icons and placeholder assets
- `reference/components.json`: shadcn-style alias and token expectations

## Copy vs adapt strategy

## Files/components to copy conceptually

- app shell structure from `reference/components/app-shell.tsx`
- sidebar/topbar/page header patterns from reference navigation files
- stat cards, result cards, finding cards, upload dropzone, and empty-state composition
- design tokens and typography direction from `reference/app/globals.css`

## Files/components to adapt instead of copying verbatim

- `frontend/app/layout.tsx`: preserve project metadata and adapt reference typography/theme setup
- `frontend/app/globals.css`: port reference visual system into Tailwind v3-compatible CSS
- `frontend/components/app-shell.tsx`: rebuild around current route map and responsive behavior
- `frontend/components/ui/*`: replace current primitives with reference-style versions while keeping existing imports stable where possible
- `frontend/app/search/page.tsx`: preserve real `apiClient.search(...)`
- `frontend/app/documents/page.tsx`: preserve real `apiClient.listDocuments(...)`
- `frontend/app/documents/[id]/page.tsx`: preserve document route and chat handoff
- `frontend/app/uploads/page.tsx`: preserve upload batch creation via `apiClient.createUploadBatch(...)`
- `frontend/app/analysis/page.tsx`: preserve analysis run creation via `apiClient.createAnalysisRun(...)`
- `frontend/app/chat/chat-client.tsx`: preserve document-scoped chat via `apiClient.askDocument(...)`
- `frontend/app/login/page.tsx`: preserve sign-in flow and session storage contract

## Screens to replace

- Home
- Search
- Documents
- Document detail
- Uploads
- Analysis list
- Analysis detail
- Review
- Rulebooks
- Contracts
- Gap audits
- Reports
- Chat
- Admin
- Design system

## Screens to add or restyle

- `/dashboard`
- `/knowledge-base`
- `/settings`

## Dependency assessment

- Current app is missing the reference helper packages such as `clsx`, `tailwind-merge`, `class-variance-authority`, and `lucide-react`
- Migration can proceed without them by using plain Tailwind class composition if package installation is blocked
- If validation shows they are needed for maintainability, add the smallest required subset only

## Risks and missing assets

- Existing frontend is mostly placeholder UI, so many routes need full screen composition rather than simple restyling
- Current app uses Tailwind v3 while reference uses Tailwind v4-era CSS conventions; tokens must be translated, not pasted
- Existing backend coverage is partial, so several screens will need clearly labeled placeholder data sections without pretending real integration exists
- PDF/document viewer behavior is currently placeholder and must remain non-breaking rather than overpromised
- `reference/public` assets can be copied into the main frontend only if they are actually referenced by the adapted layout
