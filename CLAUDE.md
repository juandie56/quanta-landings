# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Quanta Landing Pages** — static HTML/CSS/JS landing pages for lead capture. Zero build step, zero dependencies. Hosted on GitHub Pages, auto-deployed via GitHub Actions on push to `main`.

## Local Development

No build tools. Use any static file server:

```bash
# Python (recommended)
python3 -m http.server 8080

# Then open: http://localhost:8080/campaigns/manufactura-general/
```

Or use VS Code Live Server extension.

## Deployment

Push to `main` triggers auto-deploy to GitHub Pages. Branching flow:

```
campaign/[slug] → PR → dev → PR → main → auto-deploy
```

The GitHub Actions workflow (`.github/workflows/deploy.yml`) validates HTML, form-data.json, and tokens.css before deploying.

## Architecture

### Campaign Structure

Each campaign lives in `campaigns/[slug]/` with:
- `index.html` — self-contained landing page (inline styles + CONFIG object)
- `campaign.json` — metadata (not loaded by browser; for developer reference)

### Shared Resources

- `shared/css/tokens.css` — all design tokens (CSS vars prefixed `--q-`)
- `shared/js/utils.js` — UTM capture, session ID, validation helpers, pixel firing
- `shared/js/form-handler.js` — form population, validation, submission (depends on utils.js)
- `shared/data/form-data.json` — dropdown data (countries, industries, company sizes); loaded dynamically at runtime

### Script Load Order (in index.html)

1. `utils.js` loads first
2. `form-handler.js` loads second
3. Inline script on `DOMContentLoaded` calls: `persistUTMs()`, `loadFormOptions()`, `initForm()`

### Form Submission Flow

UTM capture → session ID → `loadFormOptions()` populates selects → user submits → client-side validation → payload built to schema v1.0 → POST to `CONFIG.FORM_ENDPOINT` → fire Meta/Google pixels. On failure: backup to `localStorage`, show error.

### Standardized Payload (schema v1.0)

```json
{
  "schema_version": "1.0",
  "source": "landing_quanta",
  "campaign": { "utm_source": "", "utm_medium": "", "utm_campaign": "", "gclid": "", "fbclid": "" },
  "lead": { "nombre": "", "empresa": "", "indicativo": "", "telefono": "", "email": "", "industria": "", "tamano_empresa": "", "operarios": "" },
  "metadata": { "landing_url": "", "referrer": "", "user_agent": "", "session_id": "", "ip_hash": "" }
}
```

## Code Conventions

- **CSS**: BEM-light naming (`.bloque__elemento--modificador`); all design tokens use `--q-` prefix
- **JS**: strict mode (`'use strict'`), ES2020+, named functions, no modules (global scope)
- **Comments**: in Spanish; sections delimited with `// ====`
- **Form field IDs**: kebab-case Spanish (`nombre`, `tamano_empresa`, `operarios`)
- **Important**: `CONFIG.DEBUG_MODE` must be `false` before deploying to production

## Brand Tokens (key values)

| Token | Value |
|-------|-------|
| `--q-pink` | `#E91E8C` (primary brand) |
| `--q-bg` | `#0A0A0A` |
| `--q-surface` | `#1A1A1A` |
| `--q-text` | `#FFFFFF` |
| Button radius | `50px` (pill) |
| Card radius | `16px` |
| Font | Poppins (Google Fonts) |

## Creating a New Campaign

See `docs/NEW_CAMPAIGN.md` for the full 8-step checklist. In short:
1. Copy `campaigns/manufactura-general/` → `campaigns/[new-slug]/`
2. Edit `campaign.json` with the new campaign's metadata
3. Customize `index.html` copy, UTM values, and `CONFIG` object
4. Update `shared/data/form-data.json` if new dropdown options are needed
5. Branch as `campaign/[slug]`, PR into `dev` first

## Key Documentation

- `docs/ARCHITECTURE.md` — design decisions, data flow, payload spec, roadmap
- `docs/BRAND.md` — full design token reference and visual identity guide
- `docs/DEPLOY.md` — deployment checklist and branch strategy
- `docs/NEW_CAMPAIGN.md` — step-by-step campaign creation checklist
