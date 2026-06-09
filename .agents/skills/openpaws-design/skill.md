---
name: openpaws-design
description: >
  OpenPaws Animal Welfare Compliance Checker — brand and UI design system for all frontend work.
  ALWAYS read this skill before generating any UI component, screen, layout, copy, or design token
  for the OpenPaws platform. Triggers on any request involving: components, pages, dashboards,
  modals, tables, forms, badges, drawers, buttons, copy, colour, typography, spacing, or any
  visual/frontend element for OpenPaws. Also triggers for review queues, finding cards, document
  viewers, audit trails, compliance UI, or any animal welfare compliance interface work.
  If you are about to write a single line of UI code or copy for this platform — read this first.
---

# OpenPaws Design System

## Platform Design Philosophy

Build every interface as a **high-trust, evidence-first compliance workspace** for animal welfare professionals. The product must feel authoritative, calm, compassionate, and technically precise. It is not a consumer pet app, not a flashy AI demo, and not a legal-verdict machine.

Every screen must reinforce that the system provides **AI-assisted, citation-grounded decision support** — it surfaces potential risks, possible gaps, and research observations for human review. It never makes legal determinations.

The visual identity is **retro-futuristic monochrome/teal** — restrained enough for legal and regulatory work, distinctive enough to signal that this is not another generic SaaS tool.

> Core design tension to hold: **brand drama vs. professional restraint.** Resolve it toward restraint on every functional screen. Reserve drama for landing pages and brand moments only.

---

## Brand Character

| Trait                                | What it means in practice                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------ |
| Purposeful                           | Every element earns its place. No decoration for its own sake.                 |
| Grounded                             | Evidence and citations visible. No vague or hype-driven claims.                |
| Human                                | Warm language. Animals referred to as `they`. People visible in imagery.       |
| Courageous                           | Direct. Does not soften findings with weasel words.                            |
| Evidence-first                       | Claims always tied to sources. Confidence always contextualised.               |
| Compassionate without sentimentality | Cares about welfare. Does not use suffering imagery or emotional manipulation. |
| Technical without coldness           | Precision in data display. Warmth in copy tone.                                |
| Urgent without sensationalism        | High-risk findings are clear. Never alarmist or performatively dramatic.       |

---

## Core Design Tokens

### Colour Palette

| Token                  | Hex       | Usage                                                                    |
| ---------------------- | --------- | ------------------------------------------------------------------------ |
| `--color-black`        | `#000000` | Primary dark background, logo, authority anchor                          |
| `--color-white`        | `#FFFFFF` | Reading background, report surface, high-contrast text                   |
| `--color-teal`         | `#006C67` | Primary CTA, links, active states, citation highlights, focus rings      |
| `--color-mid-grey`     | `#888888` | Secondary text, quiet metadata, disabled labels                          |
| `--color-coral`        | `#FF8552` | Light-theme urgency/campaign fill **only** — not in core app UI          |
| `--color-gold`         | `#D19900` | Warning, review-needed, data highlight, recognition                      |
| `--color-peach`        | `#FFE1D1` | Soft light-theme callouts — use sparingly                                |
| `--color-teal-glow`    | `#00D7C8` | Glow, scanline, focus aura, decorative effect **only** — never body text |
| `--color-dark-surface` | `#070909` | Dark app shell surfaces                                                  |
| `--color-dark-card`    | `#101414` | Dark cards and panels                                                    |
| `--color-dark-border`  | `#1E2B2A` | Dark dividers and borders                                                |

**Colour hierarchy rule:** Black + white + teal is the base system. One warm accent maximum per light-mode layout. Never use coral, gold, and teal at equal visual strength in the same view.

### Typography

| Role      | Font               | Usage                                                                |
| --------- | ------------------ | -------------------------------------------------------------------- |
| Display   | `DM Serif Display` | Hero headings, report covers, major editorial statements             |
| Interface | `Space Grotesk`    | All app UI, body text, navigation, forms, buttons                    |
| Utility   | `JetBrains Mono`   | Labels, metadata, citations, timestamps, confidence, IDs, audit logs |

### Type Scale

| Token        | Size    | Font                              | Weight  |
| ------------ | ------- | --------------------------------- | ------- |
| `display-xl` | 72–96px | DM Serif Display                  | 400     |
| `h1`         | 40–56px | DM Serif Display                  | 400     |
| `h2`         | 28–36px | DM Serif Display or Space Grotesk | 400/600 |
| `h3`         | 22–24px | Space Grotesk                     | 600     |
| `body`       | 15–16px | Space Grotesk                     | 400     |
| `body-sm`    | 13–14px | Space Grotesk                     | 400/500 |
| `label`      | 11–12px | JetBrains Mono                    | 500/600 |
| `micro`      | 10–11px | JetBrains Mono                    | 500     |

**Rule:** Use `DM Serif Display` for major editorial hierarchy only — not in dense UI. Use `Space Grotesk` for all standard app interface. Use `JetBrains Mono` for anything that is a system value: IDs, timestamps, citations, confidence scores, audit events, jurisdiction codes.

### Spacing (8px base grid)

| Token     | Value |
| --------- | ----- |
| `space-1` | 4px   |
| `space-2` | 8px   |
| `space-3` | 12px  |
| `space-4` | 16px  |
| `space-5` | 24px  |
| `space-6` | 32px  |
| `space-7` | 48px  |
| `space-8` | 64px  |

### Radius

| Component           | Radius                                 |
| ------------------- | -------------------------------------- |
| Panels / app shell  | 0–4px                                  |
| Cards               | 6px                                    |
| Buttons             | 4–6px                                  |
| Badges              | 4px, or pill for compact metadata only |
| Modals              | 8px max                                |
| Tables              | 0–4px                                  |
| Document highlights | 2px                                    |

### Elevation

- Prefer **borders over shadows** on all surfaces.
- Dark surfaces: use border contrast, not drop shadows.
- Light modals: very subtle shadow only.
- Teal glow: reserved for active, focused, or branded moments only.
- Never apply glow to every card or every table row.

---

## Risk Level Encoding

Risk levels describe **review priority**, not legal guilt. Never use verdict language.

| Level    | Colour    | Icon type         | Label                     | Safe copy pattern                                   |
| -------- | --------- | ----------------- | ------------------------- | --------------------------------------------------- |
| Critical | `#B42318` | Octagon alert     | `CRITICAL POTENTIAL RISK` | "This item should be reviewed before external use." |
| High     | `#D92D20` | Triangle alert    | `HIGH POTENTIAL RISK`     | "This may indicate a significant welfare concern."  |
| Medium   | `#D19900` | Diamond caution   | `MEDIUM POTENTIAL RISK`   | "This may need reviewer attention."                 |
| Low      | `#006C67` | Circle info-check | `LOW POTENTIAL RISK`      | "This is a lower-priority review item."             |
| Info     | `#475467` | Info circle       | `INFORMATIONAL NOTE`      | "This may provide useful context."                  |

**Rules:**

- Always pair risk level with human review status.
- Always show jurisdiction and source basis.
- Never use `Violation`, `Confirmed`, `Illegal`, `Non-compliant`, or `Compliant` as system-generated labels.
- Status must be communicated with colour + icon + text label — never colour alone.

---

## AI & Compliance Trust Patterns

### Required Fields on Every Finding Card

Every AI-assisted finding card must include all of:

- Finding type
- Risk level badge
- Human review status
- Trigger passage or missing-protection explanation
- Applicable standard or source citation
- Jurisdiction
- Document date (or "date unknown")
- Calibrated confidence
- Explanation text
- Counterfactual where available
- Reviewer controls (accept / dismiss / comment / sign off)
- Audit/history link

### Required Labels — Use These

```
AI-assisted draft          Needs human review       Potential risk
Possible gap               Cited standard           Citation validation passed
Jurisdiction scoped        Human reviewed           Signed off
```

### Forbidden Labels — Never Use These

```
AI verdict                 Violation found          Legally non-compliant
Confirmed breach           Automatically approved   Guaranteed issue
Fully compliant            No issues found
```

### Confidence Copy

**Use:**

> Calibrated confidence estimates how likely this finding is to be useful for human review. It is not a legal certainty.

**Never use:**

> The AI is 82% sure this is a violation.

### Citation Display

Every citation chip must include: citation label, source type, rule/document version, jurisdiction, effective date range if applicable, open/link action, and a brief "why this applies" note.

---

## Component Checklists

Run the relevant checklist before generating any component.

### Button

- [ ] Is this primary / secondary / ghost / destructive / disabled?
- [ ] Is the label action-specific? (No `Click here`, no `Submit`)
- [ ] Does the label avoid hype language?
- [ ] Does the colour match semantic meaning?
- [ ] Is the focus state visible at 3:1 contrast?
- [ ] Is the destructive action confirmed before execution?
- [ ] Is loading state explicit?
- [ ] Is disabled state accessible with explanation?
- [ ] Is it keyboard-reachable?
- [ ] Is an icon paired with text unless space is critically constrained?

**Button rules:**

- Primary: teal fill, white text
- Secondary: transparent, neutral or teal border
- Ghost: text-only, restrained
- Destructive: red only for destructive user actions — not for risk states
- Sign-off: formal wording — `Sign off report`, not `Publish now`

### Card (Finding Card)

- [ ] Clear title present?
- [ ] Content hierarchy obvious?
- [ ] Border-based separation, not heavy shadows?
- [ ] Density appropriate for workflow?
- [ ] No unnecessary decorative imagery?
- [ ] Metadata and status labels in JetBrains Mono?
- [ ] Citations and evidence links visible?
- [ ] Adequate whitespace for scanning?
- [ ] All required finding fields present? (see AI Trust Patterns above)

### Table

- [ ] Does this table need sorting?
- [ ] Does it need filtering?
- [ ] Does it need sticky headers?
- [ ] Are long values truncatable with expansion?
- [ ] Are row actions keyboard-accessible?
- [ ] Are status badges text-labelled?
- [ ] Are IDs, dates, citations in JetBrains Mono?
- [ ] Is there a compact/comfortable density option?
- [ ] Is there a clear empty state?
- [ ] Is the table usable without colour?

**Standard compliance tables:** Review Queue, Audit Trail, Uploaded Documents, Rule Versions, Regulatory Knowledge Base, Analysis Runs, Export History.

### Badge

- [ ] Is the state it encodes explicit in the label?
- [ ] Does it include an icon?
- [ ] Does it avoid colour-only meaning?
- [ ] Is the colour semantically correct?
- [ ] Is it readable at small sizes?
- [ ] Is it visually subordinate to primary content?

**Badge vocabulary:**
`NEEDS REVIEW` · `AI-ASSISTED DRAFT` · `CITED STANDARD` · `JURISDICTION: US-FED` · `CONFIDENCE: CALIBRATED` · `SIGNED OFF` · `DRAFT EXPORT` · `RULE VERSION ACTIVE`

### Modal

Use a modal **only** for: destructive confirmation, sign-off attestation, export confirmation, permission-sensitive action, irreversible workflow transition.

- [ ] Title explicit?
- [ ] Consequence clearly stated?
- [ ] Primary action label specific?
- [ ] Cancel is safe and clearly visible?
- [ ] Focus is trapped inside the modal?
- [ ] Escape closes the modal when safe?
- [ ] Focus returns to trigger on close?
- [ ] Accessible to screen readers?
- [ ] Body copy brief and formal?

### Drawer

Use a drawer for: finding details, citation details, reviewer notes, audit timeline, metadata inspector, rule version preview.

- [ ] Preserves user's place in the workflow?
- [ ] Supports keyboard close?
- [ ] Title is specific?
- [ ] Sections collapsible only when genuinely useful?
- [ ] Citations and evidence clearly separated?
- [ ] Does not hide critical actions?

### Form

- [ ] Labels visible above fields (never placeholder-as-label)?
- [ ] Helper text present where needed?
- [ ] Required fields marked in text?
- [ ] Errors inline and actionable?
- [ ] Jurisdiction and date scope explicit?
- [ ] Sensitive fields clearly marked?
- [ ] Long legal/regulatory inputs supported?
- [ ] Submit disabled only with explanation?
- [ ] Keyboard navigation natural?

### Document Viewer

- [ ] Readable in light mode?
- [ ] Page numbers visible?
- [ ] Highlights clearly mapped to findings?
- [ ] User can open related citation?
- [ ] User can compare passage, rule, and explanation side by side?
- [ ] Low OCR confidence shown with warning?
- [ ] Right-side finding inspector present?
- [ ] Navigation by finding, page, and section?
- [ ] Annotations keyboard-accessible?

---

## Tone & Copy Rules

**Voice:** Purposeful. Grounded. Human. Courageous. Clear before clever. Evidence before claims.

**Language rules:**

- British English: `colour`, `organisation`, `recognise`, `behaviour`
- Oxford commas
- Active voice
- Use `animals`, not `animal resources`
- Refer to animals as `they` or by species — never `it`
- Attribute all claims to sources
- State explicitly when something is unknown
- Keep UI copy short and specific

### Copy Examples by Context

**Onboarding:**

- ✅ `Upload animal welfare documents, search applicable standards, and review AI-assisted potential risks with citations and human sign-off.`
- ❌ `Let AI instantly detect violations in your documents.`

**Empty state:**

- ✅ `No findings yet. Run an analysis to generate AI-assisted potential risks for human review.`
- ❌ `Nothing here! Let the AI work its magic.`

**Error state:**

- ✅ `Analysis could not be completed because the document jurisdiction is missing. Add a jurisdiction to apply the correct rules.`
- ❌ `Something went wrong.`

**High-risk finding:**

- ✅ `This passage may indicate a high-priority welfare concern. Review the cited standard and supporting passage before taking action.`
- ❌ `This is a serious violation.`

**Export / report:**

- ✅ `This report contains reviewed decision-support findings. It is not legal advice or a legal determination.`
- ❌ `Certified compliance report.`

---

## Layout System

### App Shell Structure

```
┌─────────────────────────────────────────────────┐
│  Top utility bar                                │
├───────────┬─────────────────────────┬───────────┤
│  Left     │                         │  Right    │
│  sidebar  │   Central workspace     │  inspector│
│  nav      │                         │  drawer   │
├───────────┴─────────────────────────┴───────────┤
│  Sticky workflow actions (where needed)         │
└─────────────────────────────────────────────────┘
```

Avoid: floating decorative cards, marketing-style layouts inside dense workflows, bottom mobile nav as primary structure.

### Screen Layout Patterns

| Screen            | Layout pattern                                     |
| ----------------- | -------------------------------------------------- |
| Search            | Filters left, results centre, preview right        |
| Document Analyzer | Document viewer left, findings/citations right     |
| Review Queue      | Dense table/list with triage drawer                |
| Contract Analysis | Clause list, document viewer, missing clause panel |
| Rulebook Editor   | Rule editor, preview/test panel, version history   |
| Audit Trail       | Dense chronological table + event drawer           |
| Report Export     | White background, print-safe, formal hierarchy     |

### Dark vs Light Mode

| Use dark mode for     | Use light mode for               |
| --------------------- | -------------------------------- |
| Landing pages         | Long document reading            |
| Dashboards            | Reports and PDF exports          |
| Search shell          | Legal/compliance review text     |
| Brand moments         | Dense tables needing readability |
| High-level navigation | Forms and data entry             |

---

## Imagery Rules

**Use imagery for:** landing pages, campaign/marketing modules, subtle empty states, report covers.

**Never use imagery for:** finding cards, dense tables, audit logs, legal review modals, citation drawers.

**Imagery style:**

- High-contrast black and white
- Heavy analogue grain
- Group animals — not solitary, isolated animals
- People and animals together where possible
- Teal as glow, signal, network line, or atmosphere element
- No graphic suffering imagery
- No generic happy pet stock photography
- No full-colour animal photography unless intentionally converted to monochrome

---

## Accessibility Requirements

- WCAG AA minimum. Target AAA for long-form reading surfaces where practical.
- Normal text contrast: ≥ 4.5:1
- Large text contrast: ≥ 3:1
- UI component/icon contrast: ≥ 3:1
- Never encode status by colour alone — always colour + icon + text label
- Every interactive element needs a visible focus state
- Every icon-only button needs an accessible `aria-label`
- Modals must trap focus and restore it on close
- Drawers must be fully keyboard-operable
- Tables must support keyboard navigation and screen-reader-friendly headers
- Background job status updates must be announced accessibly
- Minimum body text: 16px on reading surfaces
- Minimum dense UI text: 13–14px

---

## Do / Do Not

### Do

1. Use black / white / teal as the core visual system
2. Use `--color-teal` (`#006C67`) for all durable UI actions, links, and active states
3. Use `DM Serif Display` for major editorial headings only
4. Use `Space Grotesk` for all interface and body copy
5. Use `JetBrains Mono` for metadata, citations, IDs, timestamps, confidence, and audit events
6. Show evidence and citation beside every AI-assisted finding
7. Label all AI output as draft until human-reviewed
8. Show human review status clearly on every finding
9. Make jurisdiction and date scope visible on every finding and citation
10. Write precise, source-aware copy in British English
11. Use groups of animals in brand imagery — never isolated, solitary animals
12. Keep core app screens restrained and readable
13. Provide keyboard and screen reader support on all interactive components
14. Make every component earn its place — no decoration without function

### Do Not

1. Say the system found a legal violation
2. Present AI confidence as legal certainty
3. Use uncited AI claims in findings
4. Hide human review status
5. Use graphic suffering imagery
6. Use playful mascots or cute pet stock photography
7. Overuse neon teal (`--color-teal-glow`) — it is a decorative effect only
8. Use multiple warm accents (coral, gold, peach) in one layout
9. Use consumer-app rounded bubbly styling
10. Use corporate buzzwords or hype language
11. Refer to animals as `it`
12. Rely on red/green colour alone to communicate status
13. Use text below 13px in dense UI or below 16px in reading surfaces
14. Bury audit trail details or make citations hard to find
15. Make the product feel like an AI gimmick or marketing demo

---

## Drift Detection

The design is drifting off-brand if any of these appear:

**Visual drift signals:**

- Screen looks like a generic SaaS dashboard
- Teal is used everywhere and no longer signals action or focus
- Warm accent colours (coral, gold) compete with teal at equal strength
- Components are overly rounded, bubbly, or playful
- Animal mascots or cute pet imagery appear in the product UI
- Grain, glow, or sci-fi styling interferes with usability on functional screens

**Copy and content drift signals:**

- AI outputs sound definitive instead of review-oriented
- Citations are hidden or optional on finding cards
- Confidence scores appear without contextual explanation
- The interface uses `violation`, `illegal`, `confirmed`, or `compliant` as a system-generated verdict
- Copy is corporate, vague, or hype-driven
- Animals referred to as `it`
- American English spellings used

**Accessibility and structure drift signals:**

- Long documents are difficult to read because the design is too dark
- Dense data views lack keyboard accessibility
- Status communicated by colour only with no icon or text label
- Required finding card fields are missing

**When drift is detected — apply in this order:**

1. Remove unnecessary colour first
2. Reduce glow and decorative effects
3. Restore black / white / teal hierarchy
4. Replace hype language with evidence-based language
5. Add citation, jurisdiction, confidence, and review status where missing
6. Prefer simple bordered surfaces over stylised cards
7. Check accessibility contrast and keyboard behaviour
8. Reframe AI outputs as potential risks for human review
9. Return to core tone: purposeful, grounded, human, courageous
10. If uncertain — choose clarity and trust over visual drama

---

## Pre-Output Final Check

Before outputting **any** UI code or copy for OpenPaws, verify all of:

- [ ] Component uses correct design tokens (colours, fonts, spacing, radius)
- [ ] Typography roles are correct: Display → DM Serif, UI → Space Grotesk, metadata → JetBrains Mono
- [ ] Component meets WCAG AA contrast minimums
- [ ] Component does not imply a legal determination
- [ ] AI outputs are framed as potential risks for human review — not verdicts
- [ ] Citations and evidence are shown where relevant
- [ ] Colour usage is restrained — single accent, teal for actions
- [ ] Component works correctly in the appropriate dark or light context
- [ ] Copy is British English, source-aware, and free of hype
- [ ] Status is communicated with colour + icon + text — never colour alone
- [ ] All required finding card fields are present if this is a finding component
- [ ] Component is keyboard-accessible and screen-reader compatible
