---
name: design-md
description: Pick and apply a ready-made DESIGN.md design system before doing any UI / frontend design work. Use whenever a project needs a look — building or restyling pages, dashboards, landing pages, forms, components or mockups; "make it look good / professional / modern"; choosing colours, fonts, spacing, a design system, design tokens or a style guide; or when the user names a site to imitate ("make it look like Linear / Stripe / Notion"). Fetches the catalogue of 70+ DESIGN.md files extracted from real websites (github.com/VoltAgent/awesome-design-md), picks the one whose product type and mood best match the project, copies it into the project root as DESIGN.md, adapts it (name, brand colours, loadable fonts) and generates the tokens the frontend builds from.
version: 1.0.0
---

# design-md — a real design system for every frontend, picked from awesome-design-md

Never invent a visual language from scratch. **VoltAgent/awesome-design-md** holds 70+ `DESIGN.md`
files (Google Stitch format) extracted from real sites: Stripe, Linear, Notion, Vercel, Airbnb,
Revolut, Apple… Each one is a complete design system in markdown: colour roles with hex values,
a type hierarchy, spacing and radius scales, component specs with states, layout rules, do's and
don'ts, responsive behaviour. This skill picks the entry that **roughly corresponds to the project**,
drops it into the project root, adapts it, and makes every UI task build from it.

- Source: `https://github.com/VoltAgent/awesome-design-md/tree/main/design-md` (MIT; files are
  "inspired interpretations", brand names deliberately misspelt inside: Stripi, Slacc, Supabaze).
- Raw file: `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/<folder>/DESIGN.md`
- Preview pages (swatches, type scale, dark variant): `https://getdesign.md/<folder>/design-md`
- Engine: `node <this skill's folder>/scripts/design-md.mjs <cmd>` (Node ≥ 18, no dependencies). The folder is
  `~/.claude/skills/design-md/` for a user install, `.claude/skills/design-md/` for a project install, or
  `${CLAUDE_PLUGIN_ROOT}/skills/design-md/` when installed as a plugin. Below, `design-md.mjs` means that path.
- Catalogue: `references/catalog.md` in the same folder: the archetype → entry matching tables (curated) + the full list.

---

## Step 0: does the project already have a look? (precedence)

1. **`DESIGN.md` already in the project root** → read it and build from it. Do not re-pick unless the
   user asks for a different look. (A provenance comment near the top means a previous design-md fetch.)
   **Exception — an inherited file**: if the provenance, the notes or the git history show the file was copied
   from another project (a donor repo, a template, a sibling product), it is *that* project's pick, not this
   one's. Run Steps 1–3 anyway and say in one line whether the inherited pick still matches ; keep it only
   when it does. (Learned on a landscaping app that inherited an IBM Carbon file from an electrical-contractor
   app : the catalogue row for its archetype pointed elsewhere, and the user had to notice.)
2. **A house design-system skill is loaded** (a client-deliverable style guide, a company brand skill) → it wins
   for whatever it covers. design-md is for **product frontends**: the app or site the end users see.
3. **User names a site** ("make it look like Linear") → skip matching, go straight to Step 3 with that folder.
4. Otherwise → Step 1.

## Step 1: brief the project in one line

Read what exists (CLAUDE.md, README, package.json / csproj, existing styles, logo or brand assets) and the
ask. Write one line, e.g. *"B2B back-office CRM for a landscaping firm, non-technical staff, light,
forms + tables, brand green #2E7D32, French UI, no photography"*. Capture:

- **archetype**: business app / dashboard / dev tool / AI product / landing page / e-commerce / editorial /
  luxury / consumer product / retro … (the first column of the archetype table)
- **audience** (technical vs general) and **density** (data-dense vs airy)
- **light or dark**; **existing brand colour**; **fonts** the project can actually load; **photography** available or not

## Step 2: shortlist 2–3 entries from the catalogue

Open `references/catalog.md`. Take the archetype row that matches the brief, then apply the constraint
modifiers as tie-breakers, in order. Helpers:

```
node design-md.mjs search crm dashboard light     # archetype hints + rows containing any term
node design-md.mjs list                           # live names; flags NEW entries not in the catalogue
```

If `list` shows NEW entries or the brief fits nothing in the tables, run `refresh` and `show` the newcomers
before deciding. If the catalogue can't be reached at all, fall back to WebFetch on the README and raw URLs above.

## Step 3: preview and decide

```
node design-md.mjs show linear.app                # description, key characteristics, font family, don'ts
node design-md.mjs show cal
```

Decide yourself; don't ask, unless the user explicitly wants to choose or the brief is missing a fact that
flips the pick (e.g. light vs dark for a consumer app). Tie-breakers, in order: light/dark matches the product
→ single-accent system if the project has its own brand colour → density matches → fonts shippable → has token
frontmatter (64 of 74 do) → imagery the project actually has. State the pick and the runner-up in one line.

## Step 4: fetch it into the project root

```
node design-md.mjs get linear.app                           # -> ./DESIGN.md (refuses to overwrite)
node design-md.mjs get linear.app --dest docs/DESIGN.md     # only when the project keeps docs elsewhere
node design-md.mjs get cal --force                          # replace an earlier design-md fetch on request
```

`get` inserts a provenance comment (source URL, date) and appends a `## Project adaptations` log.
Commit `DESIGN.md` with the project: it is the design source of truth for every future session and agent.

## Step 5: adapt it (the minimum, logged)

The file describes another company's brand. Make it this project's, editing `DESIGN.md` in place:

1. Frontmatter `name:` → `<Project> design system (inspired by <Site>)`; replace the misspelt brand name in
   the prose with the project name.
2. **Colours**: if the project has brand colours, swap the *accent* roles (`primary`, `primary-*`) and keep the
   template's neutrals, surfaces and text inks: that is where the look actually lives. Check contrast of the new
   primary against `on-primary`. No brand colour → keep the template's.
3. **Fonts**: the file's "Note on Font Substitutes" says what to load when the original is proprietary. Pin the
   choice in the frontmatter `fontFamily` values so the generated tokens are right.
4. **Drop what makes no sense** for this product (a gradient-mesh marketing hero in a back-office CRM, a
   full-bleed photography grid with no photos). Delete the component and its mention in "Signature Components".
5. Append every change under `## Project adaptations` (date, what, why). Keep the "Do's and Don'ts" section
   intact: it is the guardrail future sessions will read.

## Step 6: wire the tokens into the stack

```
node design-md.mjs tokens DESIGN.md --css --out src/styles/tokens.css          # CSS custom properties
node design-md.mjs tokens DESIGN.md --css --components --out src/styles/dm.css # + one starter class per component
node design-md.mjs tokens DESIGN.md --tailwind --out tailwind.design.cjs       # theme.extend for Tailwind
node design-md.mjs tokens DESIGN.md --json                                     # raw token tree
```

One source of truth: import the generated file once at the app root and reference `var(--color-primary)`,
`font: var(--font-body-md)`, `var(--space-lg)`, `var(--radius-md)` everywhere; never hard-code a hex or a px
that the tokens already define. Regenerate after every frontmatter edit. Older prose-only entries (no frontmatter,
see the catalogue) need the Colors / Typography / Spacing sections copied into the token file by hand.

## Step 7: build from it, every time

Before each UI task: re-read `DESIGN.md` (Overview, Components, Layout, Do's and Don'ts). Component specs and
states come from the Components section; page rhythm from Layout and Elevation; breakpoints and touch targets
from Responsive Behavior. Before finishing, walk the **Don't** list against what you built. Any renderer
downstream (React/Vue/Blazor views, plain HTML, an Artifact, the `design` canvas skill) gets the same tokens.

## Step 8: report

One line to the user: *"Using **Linear**'s DESIGN.md (dark, dense, single accent → your brand purple swapped
in); runner-up Cal.com. Adapted: name, primary colour, Inter instead of the Linear custom sans. Tokens in
`src/styles/tokens.css`."*

---

## Command reference

| Command | Does |
|---|---|
| `list [--json]` | Live entry names from GitHub; marks NEW (not in catalogue) and REMOVED |
| `search <terms…>` | Archetype hints + catalogue rows matching any term, best first |
| `show <folder> [--full]` | Description, key characteristics, font family, don'ts; `--full` prints the file |
| `get <folder> [--dest f] [--force]` | Download into the project with provenance + adaptations log |
| `tokens [file] [--css\|--json\|--tailwind] [--components] [--out f]` | Frontmatter → tokens |
| `refresh` | Rebuild the generated list in `references/catalog.md` from the live repo |

Flags go after the positional arguments. `GITHUB_TOKEN` in the environment lifts the 60/h anonymous API
limit (only `list`/`refresh` use the API; downloads use raw.githubusercontent).

## Gotchas

- **Two formats upstream.** 64 entries have Stitch YAML frontmatter (`colors`, `typography`, `rounded`,
  `spacing`, `components`) + prose; 10 older ones are prose-only with numbered sections. `show` tells you which.
- **Proprietary fonts** (Sohne, SF Pro, Futura, SoDoSans…) can't be shipped; use the substitute the file names,
  and record it in the adaptations log.
- **Dark templates and long forms** don't mix well for non-technical users. Either pick a light template or add
  a light surface set for form screens and log it.
- **Never rebrand into the source company.** The template supplies structure, tokens and rules; the project's
  own name, colour and voice go on top. Don't copy a site's logo, wordmark or copywriting.
- **Strict YAML in the frontmatter.** The bundled parser is lenient, but the project's own tooling (the `yaml` npm package,
  PyYAML, YamlDotNet) is not : a plain scalar containing `: ` (colon-space) or starting with `*`, `&`, `!` breaks the
  build. When you rewrite `name:` / `description:` in Step 5, keep them free of `: ` or quote the whole value.
- **Catalogue drift.** `list` flags new entries; run `refresh` when it does, and update the matching tables by
  hand if a newcomer fits an archetype better. The curated tables are yours to improve after each real use.
