#!/usr/bin/env node
/**
 * Extracts the JSON inside {% schema %} ... {% endschema %} from a Shopify
 * section or block Liquid file and prints it to stdout.
 *
 * Usage:
 *   node extract-section-schema.mjs <path-to-file.liquid> [--compact]
 *
 * Exit codes:
 *   0 — OK (JSON printed to stdout)
 *   1 — Missing argument or unreadable file
 *   2 — No schema block found
 *   3 — JSON parse error
 */

import fs from "node:fs";
import path from "node:path";

const SCHEMA_RE = /\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/gi;

function main() {
  const args = process.argv.slice(2).filter((a) => a !== "--compact");
  const compact = process.argv.includes("--compact");

  const filePath = args[0];
  if (!filePath) {
    console.error(
      "Usage: node extract-section-schema.mjs <path-to-file.liquid> [--compact]",
    );
    process.exit(1);
  }

  const resolved = path.resolve(filePath);
  let raw;
  try {
    raw = fs.readFileSync(resolved, "utf8");
  } catch (err) {
    console.error(`Cannot read file: ${resolved}`);
    console.error(err.message);
    process.exit(1);
  }

  const matches = [...raw.matchAll(SCHEMA_RE)];
  if (matches.length === 0) {
    console.error(`No {% schema %} ... {% endschema %} block in: ${resolved}`);
    process.exit(2);
  }

  const inner = matches[matches.length - 1][1].trim();

  let schema;
  try {
    schema = JSON.parse(inner);
  } catch (err) {
    console.error(`JSON parse error in schema for: ${resolved}`);
    console.error(err.message);
    process.exit(3);
  }

  const out = compact ? JSON.stringify(schema) : JSON.stringify(schema, null, 2);
  process.stdout.write(`${out}\n`);
}

main();
