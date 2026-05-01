# Section settings, blocks, and template JSON — reference

Use this with **`update-section-settings`**. Authoritative detail lives in Shopify docs (linked below).

## Official docs

| Topic | URL |
|--------|-----|
| Blocks overview (theme, section, app blocks) | [Blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks) |
| Section schema (`{% schema %}` keys) | [Section schema](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema) |
| Input setting types (`range`, `select`, resource pickers, etc.) | [Input settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings) |
| Static theme blocks | [Static blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks) |

## Section schema (high level)

Inside `{% schema %}` JSON, common top-level keys include:

- **`name`** — Section label in the editor.
- **`tag`**, **`class`** — HTML wrapper hooks.
- **`settings`** — Array of input settings (same `type` / `id` model as theme settings).
- **`blocks`** — Which block types are allowed (see below).
- **`max_blocks`** — Cap on dynamic blocks where applicable.
- **`presets`**, **`default`** — Editor insertion defaults.
- **`enabled_on`**, **`disabled_on`** — Template / resource constraints.

Validate each **section-level** setting using the entry’s `type` and `id` (see Input settings doc).

## Block allowlists (`blocks` array)

Each entry is typically `{ "type": "<block-type>" }` or uses shortcuts:

- **`{ "type": "@theme" }`** — Merchants can add **theme blocks** from `/blocks` (subject to compatibility rules in docs).
- **`{ "type": "@app" }`** — **App blocks** from installed apps.
- **`{ "type": "slide" }`** — A specific block (often a section-local block type defined in the same section file, or a theme block filename stem).

Only use block **`type`** values that appear in the extracted schema (and exist as Liquid files / definitions for theme blocks). When unsure, list `/blocks` and `sections/*.liquid` and match names.

## Static theme blocks

From [Static blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/static-blocks):

- Rendered in Liquid with  
  `{% content_for "block", type: "<type>", id: "<id>" %}`  
  where **`id`** is a **developer-chosen** string unique among siblings under the same parent.
- In JSON template data, static blocks use **`"static": true`**. They are **not** listed in `block_order` (merchants cannot reorder them).
- Presets may include static blocks with **`id`** + **`static": true`** to override settings.
- Do **not** remove static blocks from JSON unless the section Liquid no longer defines them (would break the layout).

When updating `templates/*.json`, preserve static blocks and their ids unless the user explicitly changes structure.

## Template JSON (`templates/*.json`)

- Top-level **`sections`** object maps **instance ids** (keys) to section instances.
- Each instance has **`type`** (filename stem under `sections/`, e.g. `hero` → `sections/hero.liquid`).
- **`settings`** — Section-level values validated against that section’s schema `settings`.
- **`blocks`** — Object keyed by **block instance id**; each value has **`type`**, **`settings`**, optional nested **`blocks`**, optional **`static`**.
- **`block_order`** — Array of **dynamic** block instance ids only (excludes static blocks).

Paths to edit are always under **`{themeRoot}/templates/`** for JSON templates (and JSON templates in subfolders if the theme uses them).

## Setting value validation

Rules mirror global theme settings: types like `range` (min/max/step), `select`/`radio` (allowed `options`), `checkbox`, resource pickers (handles), etc. Use the extracted schema for each setting definition and follow [Input settings](https://shopify.dev/docs/storefronts/themes/architecture/settings/input-settings).

For a concise type-by-type checklist, you can reuse the same validation mindset as in **`update-theme-settings`** ([reference.md](../update-theme-settings/reference.md)) — section `settings` use the same input setting model.
