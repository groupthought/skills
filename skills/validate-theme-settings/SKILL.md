---
name: validate-theme-settings
description: >
  Runs `shopify theme check --fail-level error` from the Shopify theme root and
  reports whether the check passed. Use when validating a theme after editing
  `config/settings_data.json` or `config/settings_schema.json`, when the user
  asks to verify theme settings, or when running theme check at error severity
  only. Requires the Shopify CLI (`shopify`) and a theme directory (e.g.
  contains `config/`).
---

# Validate theme settings (Theme Check)

## Overview

This skill runs **Shopify Theme Check** at **error** severity: only issues at or above the `error` level fail the run. A **passing** exit code means there are no error-level findings for that run.

**Scope:** `shopify theme check` analyzes the **entire** theme (Liquid, JSON, etc.), not only setting files. Output may include issues outside `config/`. When reporting, call out any lines that reference `config/settings_data.json`, `config/settings_schema.json`, or other setting-related paths so the user can see whether **settings** look valid under this check.

**Prerequisite:** [Shopify CLI](https://shopify.dev/docs/api/shopify-cli) installed and on `PATH` (`shopify version`).

## Predictable workflow

| Do | |
|----|--|
| Run Theme Check | **One** terminal command, from the **theme root** (directory that contains `config/`) |
| Use this exact invocation | `shopify theme check --fail-level error` |

| Do not | |
|--------|--|
| Change flags ad hoc for this skill | Use only the command above unless the user explicitly asks for a different fail level |
| Rely on MCP or browser | Not needed |

Resolve the theme root: the **current working directory** for the command should be the theme folder (usually the workspace root, or `cd` to the path the user gives).

## Quick Reference

| Task | Command | Working directory |
|------|---------|-------------------|
| Validate theme (error level only) | `shopify theme check --fail-level error` | `{themeRoot}` |

## Quick Start

1. `cd` to `{themeRoot}` if the theme is not already the shell cwd.
2. Run:

```bash
shopify theme check --fail-level error
```

3. Interpret the **exit code**:
   - **0** — No error-level issues reported for this run; report **passed**.
   - **Non-zero** — Error-level issues remain; report **failed** and summarize.

## Report

Always include:

1. **Result:** **Passed** (exit 0) or **Failed** (non-zero).
2. **Command:** `shopify theme check --fail-level error` (and cwd used).
3. **Output:** If failed (or if stdout/stderr is useful), summarize or quote Theme Check messages. Prefer highlighting findings under `config/` or mentioning **settings** when the tool points at those files.
4. **Clarification:** If the run passed but the user only asked about “settings,” note that this check covers the **whole theme**; absence of error-level issues means nothing at that severity, including in config, for this run.

## Errors

- **Command not found (`shopify`)** — Tell the user to install the Shopify CLI and ensure it is on `PATH`.
- **Wrong directory** — If `config/settings_schema.json` is missing, cwd may not be the theme root; confirm `{themeRoot}` and rerun.

## Example

```bash
cd /path/to/my-theme
shopify theme check --fail-level error
```

**Passed:** Exit code 0 → report no error-level Theme Check issues.

**Failed:** Exit code 1 → paste key lines; if `config/settings_data.json` appears in the output, say so explicitly.
