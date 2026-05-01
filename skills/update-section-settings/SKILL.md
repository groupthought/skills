---
name: update-section-settings
description: >
  Updates **section and nested block** settings in Shopify **template JSON** using
  only values allowed by each section’s `{% schema %}` and allowed block types.
  Resolves `{themeRoot}/sections/<type>.liquid`, extracts schema JSON via the
  bundled script, validates settings against [Input
  settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings),
  respects **static blocks** and `block_order` rules, and writes to the correct
  `templates/*.json` file. Use when editing template JSON for a section instance,
  adding/removing blocks within allowlists, or aligning JSON with section schema.
---

# Update section settings (Shopify)

## Overview

This skill applies **valid** section `settings` and **valid** block trees to template JSON (`templates/**/*.json`). It uses:

1. **`{themeRoot}/sections/`** — Confirm the section **type** exists (`<type>.liquid`).
2. **Extracted schema** — Parsed JSON from `{% schema %}...{% endschema %}` via the dedicated script (fast, no hand-copy).
3. **Shopify rules** — [Blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks), [Section schema](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema), [Input settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings), [Static blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks).

Domain summary and links: **[reference.md](reference.md)**.

## Predictable workflow

| Do | |
|----|--|
| Confirm section file exists | List `{themeRoot}/sections/*.liquid` or check `{themeRoot}/sections/<type>.liquid` |
| **Extract schema JSON** | Run **`extract-section-schema.mjs`** (below)—do not paste megabytes of Liquid into chat |
| Read / edit template JSON | Workspace read + patch **`{themeRoot}/templates/...json`** (and nested template dirs if present) |
| Validate setting values | Use schema `settings[]` entries (`type`, `id`, options, min/max/step, etc.) |

| Do not | |
|--------|--|
| Invent block `type` strings | Only types allowed in schema `blocks` (and definitions that exist in `/blocks` or the section for section blocks) |
| Put static blocks in `block_order` | Static blocks use `"static": true` and are omitted from `block_order` ([Static blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks)) |
| Edit `config/settings_data.json` for section instances | That file is **global** theme settings—use **`update-theme-settings`** |

## Extract schema script (required)

From your machine, run Node with the script shipped next to this skill:

```bash
node skills/update-section-settings/scripts/extract-section-schema.mjs "{themeRoot}/sections/<type>.liquid"
```

- **Stdout:** Parsed schema JSON (pretty-printed).
- **Exit 2:** No `{% schema %}` block.
- **Exit 3:** JSON parse error (non-JSON schema body, or Liquid inside schema—fix theme or use compiled output if your pipeline preprocesses schema).

Optional: `--compact` for one-line JSON.

If the repo layout differs, use the **absolute path** to `extract-section-schema.mjs` and to the `.liquid` file.

## Quick Reference

| Task | Approach |
|------|----------|
| List installable section types | Files under `{themeRoot}/sections/*.liquid` (stem = `type`) |
| Get section schema as JSON | `node .../extract-section-schema.mjs <path-to-section.liquid>` |
| Know allowed blocks | Schema **`blocks`** array; `@theme` / `@app` / concrete `type` strings |
| Know section setting ids | Schema **`settings`** array (`id`, `type`, constraints) |
| Persist changes | Edit **`templates/<template>.json`** → `sections` → instance → `settings` / `blocks` / `block_order` |

## Quick Start

1. Resolve **`{themeRoot}`** (workspace root or path the user gives).
2. From the user request, determine **template file** (e.g. `templates/index.json`) and **section instance** key inside `sections` (or add a new instance following existing patterns).
3. Read that template JSON; note **`type`** on the section instance (e.g. `"type": "slideshow"` → `sections/slideshow.liquid`).
4. Verify **`{themeRoot}/sections/<type>.liquid`** exists.
5. Run **`extract-section-schema.mjs`** on that file; keep the parsed schema available for validation.
6. **Section settings:** For each change, find the **`settings`** entry with matching **`id`** and validate value per **`type`** (see [Input settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings) and [reference.md](reference.md)).
7. **Blocks:** Only add/update blocks whose **`type`** is allowed by schema **`blocks`**. Respect **`max_blocks`** for dynamic blocks. For **static** blocks, keep `"static": true`, preserve **`id`** strings expected by Liquid `content_for`, and **do not** add static ids to **`block_order`**.
8. **Nested blocks:** If a block defines nested blocks in schema/data, mirror the structure already used in the theme JSON.
9. Write changes with a **minimal diff** to the template JSON file.
10. Optionally run **`shopify theme check --fail-level error`** from `{themeRoot}` (see **`validate-theme-settings`** skill).

## Block model (must know)

- **Theme blocks** — Liquid in `/blocks`; reusable across sections ([Blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks)).
- **Section blocks** — Defined in the section’s schema; only for that section.
- **App blocks** — From apps; schema often includes `{ "type": "@app" }`.
- **Theme blocks vs snippets** — Blocks expose settings in the editor; snippets do not ([Blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks)).

## Static blocks (must know)

When the section uses static theme blocks:

- Liquid: `{% content_for "block", type: "...", id: "..." %}` ([Static blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks)).
- JSON: `"static": true` on that block instance; **omit from `block_order`**.
- Do not duplicate or reorder static blocks like dynamic blocks.

## Report

After editing, confirm:

- **`{themeRoot}`**, template path, section **instance key**, section **`type`**
- Which **setting ids** changed and final validated values
- Which **blocks** were added/updated/removed (types allowed by schema)
- Note if any value was snapped/clamped to satisfy schema (e.g. `range` step)

## Next steps

- **Schema / blocks / static rules:** [reference.md](reference.md)
- **Input setting types:** [Input settings (Shopify)](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings)
- **Shared type validation examples:** [update-theme-settings/reference.md](../update-theme-settings/reference.md)
