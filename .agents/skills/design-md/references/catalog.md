# DESIGN.md catalogue — VoltAgent/awesome-design-md

Two parts. **Matching tables** (hand-maintained: edit them when a pick worked well or badly) and the
**generated list** at the bottom (rebuilt by `node scripts/design-md.mjs refresh`; never edit by hand).
`folder` is the exact name to pass to `show` / `get`.

## Matching by project archetype

Pick from the first column that describes the product, preview 2–3 with `show <folder>`, then apply the
constraint modifiers below as tie-breakers.

| Project archetype | Pick first | Then consider |
|---|---|---|
| Business app, CRM, back-office, admin, ERP: light, forms + tables | `cal` (clean neutral, plain) · `intercom` (friendly blue) · `airtable` (colourful structured data) | `notion` · `zapier` · `wise` · `slack` |
| Business app / dashboard: dark, data-dense, technical users | `linear.app` (ultra-minimal, one purple accent) · `sentry` (dense dark dashboard) · `kraken` (purple dark, data-dense) | `posthog` · `supabase` · `warp` · `superhuman` |
| Developer tool, API product, SDK, documentation site | `vercel` (black/white, Geist) · `mintlify` (reading-optimised docs) · `supabase` (dark emerald, code-first) | `resend` · `replicate` · `expo` · `mongodb` · `clickhouse` · `hashicorp` · `composio` |
| AI product, chat, agent or model UI | `claude` (warm terracotta, editorial) · `cursor` (sleek dark, gradients) · `voltagent` (void black, emerald, terminal) | `cohere` · `mistral.ai` · `ollama` · `together.ai` · `x.ai` · `minimax` · `opencode.ai` · `elevenlabs` (voice/audio) · `runwayml` (creative AI) |
| SaaS marketing site / landing page | `stripe` (gradient hero, weight-300 elegance) · `framer` (bold, motion-first) · `webflow` (blue, polished) | `linear.app` · `vercel` · `lovable` (playful) · `miro` · `sanity` |
| Fintech, banking, payments, invoicing, accounting | `stripe` · `revolut` (dark, gradient cards) · `wise` (green, plain-spoken) | `coinbase` (institutional trust) · `mastercard` (warm cream) · `binance` / `kraken` (trading urgency) |
| E-commerce, retail, marketplace, booking | `shopify` (dark cinematic, neon green) · `airbnb` (warm coral, photo-led, rounded) · `nike` (monochrome, huge uppercase, full-bleed photos) | `starbucks` · `meta` · `apple` · `pinterest` |
| Local services / trades business (landscaping, cleaning, repairs, care): site or app | `airbnb` (warm, rounded, approachable) · `wise` (clear, friendly green) · `intercom` (conversational blue) | `cal` · `zapier` · `starbucks` (earth-green, warm cream) |
| Consumer product / hardware showcase | `apple` (white space, cinematic imagery) · `tesla` (radical subtraction) · `hp` (white canvas, electric blue) | `nvidia` · `playstation` · `uber` · `spacex` |
| Editorial, magazine, blog, newsletter, long-form content | `theverge` (acid-mint + ultraviolet, display type) · `wired` (paper-white broadsheet, serif) · `notion` (warm minimal, serif headings) | `mintlify` · `clay` · `claude` |
| Media, music, gaming, entertainment | `spotify` (green on dark, album art) · `playstation` (three-surface, cyan hover) · `pinterest` (masonry, image-first) | `nintendo-2001` (retro) · `nvidia` |
| Luxury, automotive, premium brand | `ferrari` (chiaroscuro, Ferrari red) · `lamborghini` (true black, gold) · `bugatti` (cinema black, monumental type) | `bmw` · `bmw-m` · `renault` (vivid gradients, zero-radius) · `tesla` |
| Enterprise, corporate, telecom, IT services | `ibm` (Carbon, structured blue) · `hashicorp` (enterprise-clean) · `vodafone` (monumental uppercase, red bands) | `hp` · `mastercard` · `coinbase` |
| Productivity, collaboration, workspace, whiteboard | `notion` · `miro` (yellow accent, infinite canvas) · `figma` (vibrant multi-colour) | `slack` · `airtable` · `raycast` · `superhuman` |
| Terminal / CLI / hacker aesthetic | `warp` (block-based command UI) · `ollama` (monochrome, terminal-first) · `voltagent` | `x.ai` · `raycast` · `expo` |
| Retro / nostalgia / period piece | `dell-1996` (1996 catalogue web) · `nintendo-2001` (Y2K console chrome) | — |

## Constraint modifiers (tie-breakers, in this order)

| Constraint | Prefer | Avoid |
|---|---|---|
| Forms-heavy business app | Light canvases: `cal`, `intercom`, `airtable`, `notion`, `wise`, `stripe` | Dark-only templates unless the users are technical and screens are read-mostly |
| Product is dark by choice | `linear.app`, `sentry`, `supabase`, `cursor`, `revolut`, `shopify`, `spotify` | Templates whose identity is white space (`apple`, `notion`, `wired`) |
| Project already has a brand colour | Single-accent systems where one token swap re-brands: `linear.app`, `vercel`, `cal`, `stripe`, `supabase`, `wise`, `claude`, `mintlify` | Multi-colour identities (`figma`, `airtable`, `renault`, `pinterest`, `miro`) unless the rainbow is the point |
| Data density | Dense: `linear.app`, `sentry`, `kraken`, `airtable`, `clickhouse`, `binance` · Airy: `apple`, `notion`, `claude`, `stripe`, `elevenlabs` | — |
| Fonts must ship without a licence | Open fonts or a named open substitute: `vercel` (Geist), `notion`, `mintlify`, `supabase`, `claude`, `cal`, `linear.app` (Inter fallback), `sanity` (IBM Plex) | Proprietary display faces (`stripe` Sohne, `apple` SF Pro, `nike` Futura, `starbucks` SoDoSans, `lamborghini`, `renault`, `vodafone`): usable, but follow the file's "Note on Font Substitutes" |
| No photography available | Type-led: `linear.app`, `vercel`, `notion`, `cal`, `stripe`, `wired` | Photo-dependent: `airbnb`, `nike`, `apple`, `tesla`, `spacex`, `pinterest`, `meta` |
| Need machine-readable tokens (`tokens` command) | Any entry with Stitch frontmatter (64 of 74) | Older prose-only entries: `kraken`, `lamborghini`, `lovable`, `mastercard`, `runwayml`, `sanity`, `spotify`, `starbucks`, `tesla`, `theverge` (tokens copied by hand) |

## Full list (generated)

<!-- catalog:start -->
Generated 2026-09-02 from https://github.com/VoltAgent/awesome-design-md (74 entries). Regenerate with `node scripts/design-md.mjs refresh`.

| folder | Name | Category | Style in one line |
|---|---|---|---|
| `claude` | Claude | AI & LLM Platforms | Anthropic's AI assistant. Warm terracotta accent, clean editorial layout |
| `cohere` | Cohere | AI & LLM Platforms | Enterprise AI platform. Vibrant gradients, data-rich dashboard aesthetic |
| `elevenlabs` | ElevenLabs | AI & LLM Platforms | AI voice platform. Dark cinematic UI, audio-waveform aesthetics |
| `minimax` | Minimax | AI & LLM Platforms | AI model provider. Bold dark interface with neon accents |
| `mistral.ai` | Mistral AI | AI & LLM Platforms | Open-weight LLM provider. French-engineered minimalism, purple-toned |
| `ollama` | Ollama | AI & LLM Platforms | Run LLMs locally. Terminal-first, monochrome simplicity |
| `opencode.ai` | OpenCode AI | AI & LLM Platforms | AI coding platform. Developer-centric dark theme |
| `replicate` | Replicate | AI & LLM Platforms | Run ML models via API. Clean white canvas, code-forward |
| `runwayml` | Runway | AI & LLM Platforms | AI creative-tools platform with an editorial film-festival aesthetic — cinematic dark heroes, paper-white reading bands, single proprietary sans, and pure black pill CTAs. |
| `together.ai` | Together AI | AI & LLM Platforms | Open-source AI infrastructure. Technical, blueprint-style design |
| `voltagent` | VoltAgent | AI & LLM Platforms | AI agent framework. Void-black canvas, emerald accent, terminal-native |
| `x.ai` | xAI | AI & LLM Platforms | Elon Musk's AI lab. Stark monochrome, futuristic minimalism |
| `cursor` | Cursor | Developer Tools & IDEs | AI-first code editor. Sleek dark interface, gradient accents |
| `expo` | Expo | Developer Tools & IDEs | React Native platform. Dark theme, tight letter-spacing, code-centric |
| `lovable` | Lovable | Developer Tools & IDEs | AI full-stack builder. Playful gradients, friendly dev aesthetic |
| `raycast` | Raycast | Developer Tools & IDEs | Productivity launcher. Sleek dark chrome, vibrant gradient accents |
| `superhuman` | Superhuman | Developer Tools & IDEs | Fast email client. Premium dark UI, keyboard-first, purple glow |
| `vercel` | Vercel | Developer Tools & IDEs | Frontend deployment platform. Black and white precision, Geist font |
| `warp` | Warp | Developer Tools & IDEs | Modern terminal. Dark IDE-like interface, block-based command UI |
| `clickhouse` | ClickHouse | Backend, Database & DevOps | Fast analytics database. Yellow-accented, technical documentation style |
| `composio` | Composio | Backend, Database & DevOps | Tool integration platform. Modern dark with colorful integration icons |
| `hashicorp` | HashiCorp | Backend, Database & DevOps | Infrastructure automation. Enterprise-clean, black and white |
| `mongodb` | MongoDB | Backend, Database & DevOps | Document database. Green leaf branding, developer documentation focus |
| `posthog` | PostHog | Backend, Database & DevOps | Product analytics. Playful hedgehog branding, developer-friendly dark UI |
| `sanity` | Sanity | Backend, Database & DevOps | Headless content platform with a dark-first editorial marketing surface — 112px display type, IBM Plex Mono technical eyebrows, and a single coral-red accent reserved for the highest-priority CTA. |
| `sentry` | Sentry | Backend, Database & DevOps | Error monitoring. Dark dashboard, data-dense, pink-purple accent |
| `supabase` | Supabase | Backend, Database & DevOps | Open-source Firebase alternative. Dark emerald theme, code-first |
| `cal` | Cal.com | Productivity & SaaS | Open-source scheduling. Clean neutral UI, developer-oriented simplicity |
| `intercom` | Intercom | Productivity & SaaS | Customer messaging. Friendly blue palette, conversational UI patterns |
| `linear.app` | Linear | Productivity & SaaS | Project management for engineers. Ultra-minimal, precise, purple accent |
| `mintlify` | Mintlify | Productivity & SaaS | Documentation platform. Clean, green-accented, reading-optimized |
| `notion` | Notion | Productivity & SaaS | All-in-one workspace. Warm minimalism, serif headings, soft surfaces |
| `resend` | Resend | Productivity & SaaS | Email API for developers. Minimal dark theme, monospace accents |
| `zapier` | Zapier | Productivity & SaaS | Automation platform. Warm orange, friendly illustration-driven |
| `airtable` | Airtable | Design & Creative Tools | Spreadsheet-database hybrid. Colorful, friendly, structured data aesthetic |
| `clay` | Clay | Design & Creative Tools | Creative agency. Organic shapes, soft gradients, art-directed layout |
| `figma` | Figma | Design & Creative Tools | Collaborative design tool. Vibrant multi-color, playful yet professional |
| `framer` | Framer | Design & Creative Tools | Website builder. Bold black and blue, motion-first, design-forward |
| `miro` | Miro | Design & Creative Tools | Visual collaboration. Bright yellow accent, infinite canvas aesthetic |
| `webflow` | Webflow | Design & Creative Tools | Visual web builder. Blue-accented, polished marketing site aesthetic |
| `binance` | Binance | Fintech & Crypto | Crypto exchange. Bold Binance Yellow on monochrome, trading-floor urgency |
| `coinbase` | Coinbase | Fintech & Crypto | Crypto exchange. Clean blue identity, trust-focused, institutional feel |
| `kraken` | Kraken | Fintech & Crypto | Crypto trading platform. Purple-accented dark UI, data-dense dashboards |
| `mastercard` | Mastercard | Fintech & Crypto | Global payments network. Warm cream canvas, orbital pill shapes, editorial warmth |
| `revolut` | Revolut | Fintech & Crypto | Digital banking. Sleek dark interface, gradient cards, fintech precision |
| `stripe` | Stripe | Fintech & Crypto | Payment infrastructure. Signature purple gradients, weight-300 elegance |
| `wise` | Wise | Fintech & Crypto | International money transfer. Bright green accent, friendly and clear |
| `airbnb` | Airbnb | E-commerce & Retail | Travel marketplace. Warm coral accent, photography-driven, rounded UI |
| `meta` | Meta | E-commerce & Retail | Tech retail store. Photography-first, binary light/dark surfaces, Meta Blue CTAs |
| `nike` | Nike | E-commerce & Retail | Athletic retail. Monochrome UI, massive uppercase Futura, full-bleed photography |
| `shopify` | Shopify | E-commerce & Retail | E-commerce platform. Dark-first cinematic, neon green accent, ultra-light display type |
| `starbucks` | Starbucks | E-commerce & Retail | Coffee retail flagship. Four-tier earth-green system, warm cream canvas, proprietary SoDoSans typography |
| `apple` | Apple | Media & Consumer Tech | Consumer electronics. Premium white space, SF Pro, cinematic imagery |
| `hp` | HP | Media & Consumer Tech | PC and printer maker. Pure white canvas, HP Electric Blue signal CTA, geometric Forma DJR Micro, blue chevron decorations |
| `ibm` | IBM | Media & Consumer Tech | Enterprise technology. Carbon design system, structured blue palette |
| `nvidia` | NVIDIA | Media & Consumer Tech | GPU computing. Green-black energy, technical power aesthetic |
| `pinterest` | Pinterest | Media & Consumer Tech | Visual discovery platform. Red accent, masonry grid, image-first |
| `playstation` | PlayStation | Media & Consumer Tech | Gaming console retail. Three-surface channel layout, cyan hover-scale interaction |
| `spacex` | SpaceX | Media & Consumer Tech | Space technology. Stark black and white, full-bleed imagery, futuristic |
| `spotify` | Spotify | Media & Consumer Tech | Music streaming. Vibrant green on dark, bold type, album-art-driven |
| `theverge` | The Verge | Media & Consumer Tech | Tech editorial media. Acid-mint and ultraviolet accents, Manuka display type |
| `uber` | Uber | Media & Consumer Tech | Mobility platform. Bold black and white, tight type, urban energy |
| `vodafone` | Vodafone | Media & Consumer Tech | Global telecom brand. Monumental uppercase display, Vodafone Red chapter bands |
| `wired` | WIRED | Media & Consumer Tech | Tech magazine. Paper-white broadsheet density, custom serif, ink-blue links |
| `bmw` | BMW | Automotive | Luxury automotive. Dark premium surfaces, precise German engineering aesthetic |
| `bmw-m` | BMW M | Automotive | Performance automotive. Motorsport-inspired contrast, M color accents, precision-driven layout |
| `bugatti` | Bugatti | Automotive | Luxury hypercar. Cinema-black canvas, monochrome austerity, monumental display type |
| `ferrari` | Ferrari | Automotive | Luxury automotive. Chiaroscuro black-white editorial, Ferrari Red with extreme sparseness |
| `lamborghini` | Lamborghini | Automotive | Luxury automotive. True black cathedral, gold accent, LamboType custom Neo-Grotesk |
| `renault` | Renault | Automotive | French automotive. Vivid aurora gradients, NouvelR proprietary typeface, zero-radius buttons |
| `tesla` | Tesla | Automotive | Electric vehicles. Radical subtraction, cinematic full-viewport photography, Universal Sans |
| `dell-1996` | Dell (1996) | Retro Web | Catalog-era enterprise web. Literal black page frame, flat color-block "ribbon cards", chunky Helvetica-Black titles over Times Roman body, and hand-cut GIF stickers (NEW! bursts, award seals, beveled product photos). |
| `nintendo-2001` | Nintendo.com (2001) | Retro Web | Y2K "console chrome" web. Brushed-periwinkle beveled metal panels, a halftone-dotted carbon nav glowing amber, outlined Arial-Black box-art wordmarks over circuit-board hero fields, and a pixel Mario welcome bubble. |
| `slack` | slack | Uncategorised (not in README) | a workplace messaging brand built on a deep aubergine primary, with cream-lavender hero gradients, blue inline links, and pill CTAs. |
<!-- catalog:end -->
