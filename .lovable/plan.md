
# Facility Performance Review — Sylhet District

A mobile-first review tool for hypertension program managers. Goal: open the app → know which facility to visit and what to check, in under 10 minutes.

## Audit of the uploaded prototype

**What it gets right (keep)**
- Two-color (red/green) signaling on neutral grays — calm, scannable.
- Compact comparison table grouped by indicator family.
- Per-facility "insights + investigation steps + data basis" pattern — directly supports the falsifiability requirement.
- "How to use this report" accountability note framing the tool as "where to look," not "what to conclude."
- Field-context input to suppress known issues.

**What falls short (fix)**
1. **No temporal layer.** No persistent-vs-anomaly distinction, no 6-month baseline shown, no "stagnation" or "recovery" framing in the UI.
2. **Mobile is an afterthought.** A 920px-wide table that horizontally scrolls is the worst possible mobile experience for the primary use case.
3. **"Priority focus" cards are weak.** They don't explain *why* this facility beats the next one, or what changed since last month.
4. **Information hierarchy at the facility level is flat.** Every insight bullet looks equally important. The "one thing to check first" gets lost.
5. **No way to see a single indicator's trend** — managers can't tell a 4-month decline from a one-month blip.
6. **No "what changed since last month"** narrative — managers re-orient from scratch every time.
7. **Improving facilities are tagged but their replicable practice isn't surfaced** at the district level (the manual PDF does this better with "Activity spotlight").

## Information architecture (revised)

Three layers, designed so a manager can stop after layer 1 if time-pressed:

**1. District pulse** (above the fold, mobile screen 1)
- Headline: BP control, gap to 63% goal, months remaining.
- 4 compact stats with sparkline trend behind each (12 months).
- "What changed this month" — 3 bullets max, separated into **negative shifts** and **wins worth replicating** (drawn from improving facilities).

**2. This month's priorities** (mobile screen 2)
- 3–5 ranked facility cards. Each card answers: *Why this one? What's new? What to verify first?*
- Each card carries a **temporal badge**: `New drop`, `Persistent — month 3`, `Stagnating`, `Anomaly`, or `Recovering`.
- Each card shows a 6-month baseline contrast for the headline indicator (e.g. "BP control 42% — 6-mo avg 63%").
- One-tap "Open investigation" expands the full detail in place.

**3. Full facility list** (collapsed by default; chevron to expand)
- Filter pills: All · Action needed · At risk · On target · Improving · Persistent · Anomalies.
- **Mobile**: card-per-facility list with 3 key chips (BP ctrl, missed 3m, status). Tap to expand.
- **Desktop**: dense comparison table (as in v2) with added columns for `monthsFlagged` and 6-mo baseline delta.

## Facility detail (drives the "10-minute" goal)

Inside an expanded facility:

- **Status header**: status tag + temporal label + months flagged + field-context badge if present.
- **The story in one line** (auto-generated from data): e.g. *"Persistent low titration — flagged 3 months. Previous approach is not working."*
- **Trend strip**: 6 small sparklines (BP ctrl, missed 3m, titration, statins, fudging, stock) with current value, 6-mo avg, and arrow.
- **Why it's flagged** — ranked insight bullets (top one is the strongest signal, not just first).
- **Verify on the ground** — investigation steps as a checkable list, each tied to the indicator it tests.
- **Data basis** — small italic line listing the indicators the AI used, reinforcing falsifiability.
- **Field context** — saved notes shown inline; textarea to add new context, with quick-tag chips ("Known stock issue", "Staff turnover", "Seasonal migration") that auto-suppress recurring flags.
- **Action**: "Mark as visited / log outcome" stub — closes the loop and feeds next month's stagnation detection.

## Sample data

20 facilities covering the required temporal mix:
- **Persistent patterns (3)**: Osmaninagar (3 mo), Kacuya Bohor (4 mo, with field context already noted), Lamagangapur (2 mo).
- **Anomalies (2)**: Chhatrish (was stable ~58%, dropped to 40% this month), one previously-on-target facility with a sudden missed-visits spike.
- **Stagnation (1)**: Osmaninagar — flagged repeatedly, no improvement, with explicit "previous approach not working" framing.
- **Recovery (1)**: a facility that was flagged 2 months ago and is now back to on-target.
- **Improving with replicable practice (3)**: Gungadiya, Paton, Rajnagor — each surfaces the specific practice (overdue-call med reminders, titration push, radio outreach) into the district "wins" panel.
- Mix of large (Sylhet Sadar 5,252; UHC Bishwanath 3,195) and small (100–250) facilities; mix of full/partial/low stock; one high-fudging facility (Osmaninagar 18%) where the headline number itself is unreliable.
- Each facility carries 12 months of indicator history to power sparklines and baseline math.

## Mobile-first specifics

- Single-column flow throughout — no horizontal table scroll.
- 16px+ touch targets, sticky filter pills, collapsed-by-default detail panels.
- District pulse + top 3 priorities fit one phone viewport.
- Works offline once loaded (static data + localStorage for field context).

## Risk mitigations baked into the UI

- **Against false confidence**: every insight shows its data basis; investigation steps are required verification language ("Pull 15 patients…", "Check stock register…"), never "do X."
- **Against stagnation/noise**: persistent flags visually de-emphasize when field context is logged; stagnation flag explicitly says "previous approach not working — consider a different intervention."
- **Against overload**: priorities surface 3–5; full list is one tap away; on-target facilities collapse to a single line.
- **Against mobile failure**: card list, no pinch-zoom, thumb-reachable controls.

## Visual direction

- IBM Plex Sans + Plex Mono (as in v2). Neutral warm-gray surfaces (#F5F5F3 / #FFFFFF). Red `#C53030`, green `#276749`. No other accent colors. Sparklines in single-tone gray with red/green endpoint dot to signal direction.

## Tech

- Single-page React app, static sample data in TypeScript (`src/data/facilities.ts`) including 12-month series.
- Pattern-detection helpers (`src/lib/patterns.ts`) compute baseline, anomaly, persistence from the series so the logic is transparent and testable.
- No backend needed for this prototype; field-context notes persisted to `localStorage`.
