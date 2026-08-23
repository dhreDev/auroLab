import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import test from "node:test";
import { DOCUMENTATION_BY_LANGUAGE } from "../src/lib/documentation.js";
import { COPY_BY_LANGUAGE, SUPPORTED_LANGUAGES } from "../src/lib/translations.js";
import { SPANISH_SOURCE_FINGERPRINT } from "../src/lib/translationCoverage.js";

const JSX_ROOTS = ["src/components", "src/features"];
const ALLOWED_INLINE_TEXT = new Set(["auroLab", "dhreian", "BPM", "Hz = 1000 / ms"]);

function listJsxFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listJsxFiles(path) : extname(path) === ".jsx" ? [path] : [];
  });
}

function assertMatchingStructure(source, translation, path = "catalog") {
  if (Array.isArray(source)) {
    assert.ok(Array.isArray(translation), `${path} must remain an array`);
    assert.equal(translation.length, source.length, `${path} must translate every item`);
    source.forEach((item, index) =>
      assertMatchingStructure(item, translation[index], `${path}[${index}]`),
    );
    return;
  }

  if (source && typeof source === "object") {
    assert.ok(translation && typeof translation === "object", `${path} must remain an object`);
    assert.deepEqual(
      Object.keys(translation).sort(),
      Object.keys(source).sort(),
      `${path} must contain the same translation keys`,
    );
    Object.entries(source).forEach(([key, value]) =>
      assertMatchingStructure(value, translation[key], `${path}.${key}`),
    );
    return;
  }

  assert.equal(typeof translation, typeof source, `${path} must preserve its value type`);
  if (typeof source === "string") {
    assert.ok(translation.trim(), `${path} must not have an empty translation`);
  }
}

test("Spanish catalogs cover every English UI and documentation entry", () => {
  assert.deepEqual(SUPPORTED_LANGUAGES, ["en", "es"]);
  assertMatchingStructure(COPY_BY_LANGUAGE.en, COPY_BY_LANGUAGE.es, "copy.es");
  assertMatchingStructure(
    DOCUMENTATION_BY_LANGUAGE.en,
    DOCUMENTATION_BY_LANGUAGE.es,
    "documentation.es",
  );
});

test("English copy changes require an explicit Spanish translation review", () => {
  const englishSource = JSON.stringify({
    copy: COPY_BY_LANGUAGE.en,
    documentation: DOCUMENTATION_BY_LANGUAGE.en,
  });
  const currentFingerprint = createHash("sha256").update(englishSource).digest("hex");

  assert.equal(
    currentFingerprint,
    SPANISH_SOURCE_FINGERPRINT,
    "English text changed. Update the Spanish catalogs and then refresh SPANISH_SOURCE_FINGERPRINT.",
  );
});

test("visible component copy stays in the translation catalogs", () => {
  const violations = [];
  const jsxTextPattern = />\s*([^<>{}\n]*[A-Za-z][^<>{}\n]*)\s*</g;
  const visibleAttributePattern = /\b(?:aria-label|title|placeholder|alt|label)="([^"{}]+)"/g;

  JSX_ROOTS.flatMap(listJsxFiles).forEach((file) => {
    const source = readFileSync(file, "utf8");
    [jsxTextPattern, visibleAttributePattern].forEach((pattern) => {
      for (const match of source.matchAll(pattern)) {
        const text = match[1].replace(/\s+/g, " ").trim();
        if (text && !ALLOWED_INLINE_TEXT.has(text)) {
          violations.push(`${relative(".", file)}: ${text}`);
        }
      }
    });
  });

  assert.deepEqual(
    violations,
    [],
    "Move new visible component text into the EN/ES translation catalogs.",
  );
});
