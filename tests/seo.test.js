import assert from "node:assert/strict";
import test from "node:test";
import {
  buildStructuredData,
  formatBrowserTitle,
  getCanonicalUrl,
  getSectionFromPath,
  INDEXABLE_ROUTES,
} from "../src/lib/seo.js";

const testOrigin = "https://example.com";

test("browser titles preserve connectors, brand casing, acronyms, and units", () => {
  assert.equal(
    formatBrowserTitle("auroLab | Music production tools"),
    "auroLab | Music Production Tools",
  );
  assert.equal(
    formatBrowserTitle("auroLab | Herramientas de producción musical"),
    "auroLab | Herramientas de Producción Musical",
  );
  assert.equal(
    formatBrowserTitle("auroLab | Free music production tools for producers"),
    "auroLab | Free Music Production Tools for Producers",
  );
  assert.equal(
    formatBrowserTitle("auroLab | BPM delay calculator (ms & Hz)"),
    "auroLab | BPM Delay Calculator (ms & Hz)",
  );
  assert.equal(
    formatBrowserTitle("auroLab | Note to frequency & MIDI converter"),
    "auroLab | Note to Frequency & MIDI Converter",
  );
});

test("SEO routes use unique canonical paths with trailing slashes", () => {
  const paths = INDEXABLE_ROUTES.map((route) => route.path);
  assert.equal(new Set(paths).size, paths.length);

  for (const route of INDEXABLE_ROUTES) {
    assert.match(route.path, /^\/(?:[a-z0-9-]+\/)?$/);
    assert.equal(getCanonicalUrl(route.sectionId, testOrigin).href, `${testOrigin}${route.path}`);
    assert.equal(getSectionFromPath(route.path), route.sectionId);
    assert.ok(route.keywords.length >= 5);
    assert.equal(new Set(route.keywords).size, route.keywords.length);
  }
});

test("home structured data describes the tool collection", () => {
  const { "@graph": graph } = buildStructuredData("home", testOrigin);
  const page = graph.find((entity) => entity["@type"] === "CollectionPage");
  const toolList = graph.find((entity) => entity["@type"] === "ItemList");
  const website = graph.find((entity) => entity["@type"] === "WebSite");
  const image = graph.find((entity) => entity["@type"] === "ImageObject");

  assert.equal(page.url, `${testOrigin}/`);
  assert.equal(page.mainEntity["@id"], toolList["@id"]);
  assert.equal(toolList.numberOfItems, INDEXABLE_ROUTES.length - 1);
  assert.equal(toolList.itemListElement.length, INDEXABLE_ROUTES.length - 1);
  assert.deepEqual(website.alternateName, ["AuroLab", "aurolab.dhreian.com"]);
  assert.equal(page.primaryImageOfPage["@id"], image["@id"]);
  assert.match(image.contentUrl, /\/social-preview\.png$/);
});

test("tool structured data links the page, application, and breadcrumbs", () => {
  const { "@graph": graph } = buildStructuredData("metronome", testOrigin);
  const page = graph.find((entity) => entity["@type"] === "WebPage");
  const application = graph.find((entity) => entity["@type"] === "WebApplication");
  const breadcrumbs = graph.find((entity) => entity["@type"] === "BreadcrumbList");

  assert.equal(page.url, `${testOrigin}/metronome/`);
  assert.equal(page.mainEntity["@id"], application["@id"]);
  assert.equal(application.mainEntityOfPage["@id"], page["@id"]);
  assert.equal(application.applicationSuite, "auroLab");
  assert.deepEqual(application.keywords, [
    "online metronome",
    "free metronome",
    "metronome with tap tempo",
    "BPM metronome",
    "time signature metronome",
    "browser metronome",
  ]);
  assert.equal(page.breadcrumb["@id"], breadcrumbs["@id"]);
  assert.deepEqual(
    breadcrumbs.itemListElement.map(({ item }) => item),
    [`${testOrigin}/`, `${testOrigin}/metronome/`],
  );
});
