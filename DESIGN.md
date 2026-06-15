# Design

## Theme

Institutional legal-tech. The structural chrome (top bar, side nav, footer, hero panels) is **drenched in deep navy** — the "established chamber" feel — while content sits on a near-pure cool-white paper so the brand color does the work. The deliberate accent is **bordô / oxblood** (the credibility seal, primary actions, active states). Brass appears only on validation seals. Committed color strategy: navy carries ~35–45% of the surface area through the chrome.

Scene sentence: *a senior advocate's chambers at dusk — oxblood leather, navy bound volumes, brass desk lamp, paper catching the last cool light.*

## Color (OKLCH)

Defined as CSS custom properties in `src/index.css` under `@theme`. Key roles:

- `--color-bg` `oklch(0.984 0.004 258)` — faint cool paper (NOT cream). App background.
- `--color-surface` `oklch(1 0 0)` — pure white cards/panels.
- `--color-ink` `oklch(0.234 0.026 263)` — body text, ~13:1 on bg.
- `--color-muted` `oklch(0.508 0.020 263)` — secondary text, ≥4.5:1 on bg (no washed-out gray).
- `--color-navy-{50..950}` — primary ramp; `--color-primary = navy-700` `oklch(0.322 0.068 262)`.
- `--color-bordo-{50..900}` — accent ramp (seed hue 27°); `--color-accent = bordo-600` `oklch(0.464 0.158 26)`.
- `--color-brass-{300..600}` — seals only, used sparingly.
- Status: `success` green 158°, `warning` amber 74°, `danger` red 27°, `info` navy-blue 248°, each with `-soft` (tint) and `-ink` (text-on-tint) pairs.
- High-contrast a11y theme via `[data-contrast="high"]` overrides the neutrals to pure black/white with chroma 0.

Text-on-fill rule: white text on navy and bordô fills; dark `-ink` text only on the pale `-soft` tints.

## Typography

Contrast-axis pairing (serif display + humanist sans), both chosen for legibility and an institutional/government feel:

- **Display / headings:** `Spectral` (transitional serif, weights 400–700) — `--font-serif`. Used on h1–h4, hero, key numbers. `letter-spacing: -0.012em`, `text-wrap: balance`.
- **UI / body:** `Public Sans` (the US federal accessibility sans, weights 400–700) — `--font-sans`. All controls, tables, body copy. Line-height 1.6, body length capped 65–75ch.
- **Mono:** `JetBrains Mono` — process numbers (CNJ), OAB numbers, code-like data.

Type scale via `clamp()`; hero max ≤ 3.5rem (sober, not shouting).

## Components

Hand-built primitives in `src/components/ui/` (no generic component library, to keep the bespoke institutional look):

- `Button` — variants: `primary` (navy), `accent` (bordô), `outline`, `ghost`, `subtle`, `danger`; sizes sm/md/lg; loading + icon support.
- `Card` — flat by default, 1px `--color-line` border, `--radius-lg`, optional `--shadow-sm`. No nested cards.
- `Badge` / `StatusPill` — semantic status (validado/pendente/divergente, demand states, priority).
- `Field` / `Input` / `Textarea` / `Select` / `Toggle` — labeled, error-aware, focus-ring.
- `Avatar`, `Rating` (1–5 stars), `Stat`, `Progress`, `Stepper`, `Modal` (native `<dialog>`/portal), `Tabs`, `Tooltip`, `EmptyState`, `Skeleton`, `Seal` (credibility badge), `AINotice` (labels AI-generated content).
- App shell: `AppLayout` (navy side nav + top bar), `PersonaSwitcher` (demo role switch), `AccessibilityToolbar` (contrast + font-size + Libras), `NotificationCenter`.

## Layout

- App shell: fixed navy sidebar (collapses to a bottom/sheet nav < 1024px), sticky top bar with search, notifications, persona switch.
- Content max-width ~1180px, 24–32px gutters, 12-col mental grid via flex/`auto-fit` minmax for card rows.
- Public marketing (landing) uses full-bleed navy hero, then paper sections with asymmetric rhythm — not identical stacked card grids.

## Motion

`framer-motion` + CSS. Ease-out curves only (`--ease-out-quart/expo`), no bounce except a restrained spring on toggles. Page/section content uses `fade-up` with list stagger; AI "typing" uses a 3-dot keyframe; matching reveal staggers candidate cards. Every effect has a `prefers-reduced-motion` fallback (crossfade/instant). Reveals enhance already-visible defaults — content is never gated on a transition.

## Iconography

`lucide-react`, 1.5–1.75px stroke, sized to text. Scales-of-justice mark for the brand. Status icons (shield-check for validado, clock for pendente, triangle-alert for divergente) reinforce color, never replace it.
