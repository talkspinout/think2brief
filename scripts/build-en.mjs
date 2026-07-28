// Generates a real, crawlable English snapshot of the site (site/en/,
// site/en/privacy/) from the same Korean source HTML + the same EN
// dictionaries the client-side toggle uses. Single source of truth: this
// script and site/assets/i18n.js apply the *same* data-i18n / data-i18n-en-src
// / data-i18n-attr-* directives, just once at build time instead of on every
// page load, so the generated HTML can carry a real lang="en", canonical URL,
// and og:locale for crawlers and social unfurlers (which never execute the
// client-side toggle's JS).
import { parseHTML } from "linkedom";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { en as homeEn } from "../site/assets/i18n-home.js";
import { en as privacyEn } from "../site/assets/i18n-privacy.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = "https://talkspinout.github.io/think2brief";

const PAGES = [
  {
    src: "site/index.html",
    dest: "site/en/index.html",
    dict: homeEn,
    koUrl: `${SITE_URL}/`,
    enUrl: `${SITE_URL}/en/`,
  },
  {
    src: "site/privacy/index.html",
    dest: "site/en/privacy/index.html",
    dict: privacyEn,
    koUrl: `${SITE_URL}/privacy/`,
    enUrl: `${SITE_URL}/en/privacy/`,
  },
];

const rebaseAssetPath = (value) => {
  if (value.startsWith("./assets/")) return `..${value.slice(1)}`;
  if (value.startsWith("../assets/")) return `../${value}`;
  return value;
};

const applyDictionary = (document, dict) => {
  document.documentElement.setAttribute("lang", "en");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  document.querySelectorAll("[data-i18n-en-src]").forEach((el) => {
    el.setAttribute("src", el.getAttribute("data-i18n-en-src"));
  });

  document.querySelectorAll("*").forEach((el) => {
    const directives = [...el.attributes]
      .map((attr) => attr.name)
      .filter((name) => name.startsWith("data-i18n-attr-"));
    directives.forEach((attrName) => {
      const targetAttr = attrName.replace("data-i18n-attr-", "");
      const key = el.getAttribute(attrName);
      if (dict[key] !== undefined) el.setAttribute(targetAttr, dict[key]);
    });
  });
};

const rebaseAssetPaths = (document) => {
  document.querySelectorAll("[href], [src]").forEach((el) => {
    for (const attr of ["href", "src"]) {
      const value = el.getAttribute(attr);
      if (value) el.setAttribute(attr, rebaseAssetPath(value));
    }
  });
};

const stripToggleChrome = (document, koUrl) => {
  document.getElementById("lang-banner")?.remove();

  document.querySelectorAll(".lang-toggle").forEach((toggle) => {
    toggle.innerHTML = "";
    const koLink = document.createElement("a");
    koLink.setAttribute("href", koUrl);
    koLink.textContent = "KO";
    const enCurrent = document.createElement("span");
    enCurrent.setAttribute("aria-current", "true");
    enCurrent.textContent = "EN";
    toggle.append(koLink, enCurrent);
  });

  // The client-side toggle engine has nothing left to do on a page that is
  // already statically English — every script tag it needs is dropped here.
  document.querySelectorAll('script[src*="/assets/i18n"]').forEach((el) => el.remove());
};

// hreflang alternates are already hand-authored (identically) on both the
// Korean source and this generated page — nothing to add here, just point
// this page's own canonical/og:url/og:locale at itself.
const setCanonicalAndLocale = (document, { enUrl }) => {
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute("href", enUrl);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute("content", enUrl);

  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.setAttribute("content", "en_US");
};

// Strip build-time-only markup so the shipped HTML doesn't carry dead
// data-i18n-* directives or comments written for the Korean source.
const stripBuildArtifacts = (document) => {
  document.querySelectorAll("*").forEach((el) => {
    [...el.attributes]
      .map((attr) => attr.name)
      .filter((name) => name.startsWith("data-i18n"))
      .forEach((name) => el.removeAttribute(name));
  });
};

const stripComments = (html) => html.replace(/<!--[\s\S]*?-->/g, "");

for (const page of PAGES) {
  const html = await readFile(resolve(root, page.src), "utf8");
  const { document } = parseHTML(html);

  applyDictionary(document, page.dict);
  rebaseAssetPaths(document);
  stripToggleChrome(document, page.koUrl);
  setCanonicalAndLocale(document, page);
  stripBuildArtifacts(document);

  const destPath = resolve(root, page.dest);
  await mkdir(dirname(destPath), { recursive: true });
  const output = stripComments(`<!doctype html>\n${document.documentElement.outerHTML}\n`);
  await writeFile(destPath, output);
  console.log(`Built ${page.dest}`);
}
