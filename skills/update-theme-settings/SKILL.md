---
name: update-theme-settings
description: >
  Validate and apply **global theme settings** only (Shopify
  `config/settings_data.json`, schema in `config/settings_schema.json`). Use when
  doing initial theme setup or updating theme-level options—not section or block
  settings in template JSON. Finds each setting’s schema, validates the value
  against its type (range steps, select options, checkbox booleans, etc.), and
  writes the validated value under `current` in `settings_data.json`.
---

# Global theme settings (Shopify)

## Overview

This guide covers **global** Shopify theme settings: read `config/settings_schema.json`, validate each value against its `type`, and write only to `config/settings_data.json` under `"current"`.

**Out of scope:** Section settings, block settings, and template JSON (e.g. `templates/index.json`)—use a different workflow.

## Predictable workflow

Use the **same tools and paths every time** so permissions stay predictable:

| Do | |
|----|--|
| Read schema | Workspace **read file** → `{themeRoot}/config/settings_schema.json` |
| Read / update saved settings | Workspace **read file** / **patch or search-replace** → `{themeRoot}/config/settings_data.json` only |
| Find an `id` in a huge schema | **`grep` / `rg` only** under `{themeRoot}/config/settings_schema.json` if needed |

| Do not | |
|--------|--|
| MCP tools, browser, or web fetch | Not needed for local JSON |
| Ad-hoc shell (`jq`, `python -c`, …) to edit files | Use editor patch/replace on `settings_data.json` instead |
| Touch paths outside the theme root | Keep edits scoped to the theme directory |

Resolve **`{themeRoot}`** once (workspace root if the theme is the project, or the path the user gave), then use only the two `config/*.json` paths above.

## Quick Reference

| Task | Allowed approach | Path |
|------|------------------|------|
| Read setting definitions | Workspace read | `{themeRoot}/config/settings_schema.json` |
| Read current theme values | Workspace read | `{themeRoot}/config/settings_data.json` |
| Apply a validated value | Patch / search-replace (minimal diff) | `{themeRoot}/config/settings_data.json` → `current` |

## Quick Start

1. Resolve `{themeRoot}`.
2. **Read** `{themeRoot}/config/settings_schema.json` and locate the setting object with the requested `id` (schema is an array of groups, each with a `settings` array).
3. **Validate** the requested value using the setting’s `type` — see [reference.md](reference.md) for full rules.
4. **Read** `{themeRoot}/config/settings_data.json` if you do not already have the latest `current` block.
5. **Edit** only `settings_data.json`: set the value under `current` (and nested structures such as `color_scheme_group` when your theme uses them).
6. **Report** what changed (see below).

## Parse the request

The user should provide:

- A **setting ID** (e.g. `section_rhythm_default`, `color_scheme`)
- A **value** to set
- That the target is **global theme settings** (not a section/block in a template)

If an ID might be section-only, still check `settings_schema.json` first—theme-level IDs for this skill live only there.

## Find the schema definition

Read `{themeRoot}/config/settings_schema.json` and find the setting object whose `id` matches.

## Validate the value

Using the schema entry’s `type`, validate the value before writing. Full rules for each type (`range`, `select`, `checkbox`, `color_scheme`, pickers, lists, etc.) are in **[reference.md](reference.md)**.

If you adjust a value (e.g. snap a `range` to the nearest step), note the original request and the final value in your report.

## Apply the value

Edit **`{themeRoot}/config/settings_data.json`**. Global settings live under `"current"`:

```json
{
  "current": {
    "section_rhythm_default": 60
  }
}
```

Nested structures (example—follow your theme’s actual shape):

```json
"current": {
  "color_scheme_group": {
    "scheme-default": {
      "settings": {
        "color_canvas": "#ffffff"
      }
    }
  }
}
```

Preserve unrelated keys and structure; change only what you were asked to set.

## Report what you did

Confirm:

- Setting **ID** and **type**
- Original requested value
- Validated or snapped value (if different)
- File updated: `config/settings_data.json` under `current`

If the value was adjusted (e.g. range step snap), explain briefly why.

## Example walkthrough

**Request:** Set `section_rhythm_default` to `64` (global theme setting).

1. In `config/settings_schema.json`, find:  
   `{"type": "range", "min": 10, "max": 200, "step": 5, "default": 60}`  
2. Validate: `64` is not on step from `min` with `step` 5 → nearest valid **65**.  
3. Patch `config/settings_data.json` → `current.section_rhythm_default` = `65`.  
4. Report: set `section_rhythm_default` to **65** (snapped from 64; step 5, valid values 10, 15, …, 200).

## Next steps

- **Validation rules by type:** [reference.md](reference.md)
