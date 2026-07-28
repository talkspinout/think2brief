/*
 * Client-side language toggle for the Think2Brief site.
 * Korean is the language actually rendered in the HTML (so search engines,
 * social previews, and no-JS visitors always get Korean). This script swaps
 * text for `en` on top of that baseline and remembers the choice.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "think2brief-site-language";
  var SUPPORTED = ["ko", "en"];

  var originals = new Map();

  function captureOriginal(el) {
    if (!originals.has(el)) originals.set(el, el.innerHTML);
  }

  function getStoredLanguage() {
    try {
      var saved = window.localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.indexOf(saved) === -1 ? null : saved;
    } catch {
      return null;
    }
  }

  function setStoredLanguage(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Preference stays in-memory only for this page view.
    }
  }

  function detectBrowserLanguage() {
    var lang = (navigator.language || "ko").toLowerCase();
    return lang.indexOf("ko") === 0 ? "ko" : "en";
  }

  function applyLanguage(lang, dictionary) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      captureOriginal(el);
      var key = el.getAttribute("data-i18n");
      if (lang === "en" && dictionary[key] !== undefined) {
        el.innerHTML = dictionary[key];
      } else {
        el.innerHTML = originals.get(el);
      }
    });

    document.querySelectorAll("[data-i18n-en-src]").forEach(function (el) {
      var enSrc = el.getAttribute("data-i18n-en-src");
      var koSrc = el.getAttribute("data-i18n-ko-src") || el.getAttribute("src");
      el.setAttribute("data-i18n-ko-src", koSrc);
      el.setAttribute("src", lang === "en" ? enSrc : koSrc);
    });

    document.querySelectorAll("*").forEach(function (el) {
      for (var i = 0; i < el.attributes.length; i += 1) {
        var attr = el.attributes[i];
        if (attr.name.indexOf("data-i18n-attr-") !== 0) continue;
        var targetAttr = attr.name.replace("data-i18n-attr-", "");
        var originalKey = "data-i18n-attr-" + targetAttr + "-original";
        if (!el.hasAttribute(originalKey)) {
          el.setAttribute(originalKey, el.getAttribute(targetAttr) || "");
        }
        var key = attr.value;
        if (lang === "en" && dictionary[key] !== undefined) {
          el.setAttribute(targetAttr, dictionary[key]);
        } else {
          el.setAttribute(targetAttr, el.getAttribute(originalKey));
        }
      }
    });

    document.querySelectorAll("[data-lang-switch]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang-switch") === lang));
    });

    var banner = document.getElementById("lang-banner");
    if (banner && (lang === "en" || getStoredLanguage())) banner.hidden = true;
  }

  function init(dictionary) {
    var stored = getStoredLanguage();
    var initial = stored || "ko";
    applyLanguage(initial, dictionary);

    if (!stored && detectBrowserLanguage() === "en") {
      var banner = document.getElementById("lang-banner");
      if (banner) banner.hidden = false;
    }

    document.querySelectorAll("[data-lang-switch]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-lang-switch");
        setStoredLanguage(lang);
        applyLanguage(lang, dictionary);
      });
    });

    var dismiss = document.querySelector("[data-lang-dismiss]");
    if (dismiss) {
      dismiss.addEventListener("click", function () {
        setStoredLanguage("ko");
        var banner = document.getElementById("lang-banner");
        if (banner) banner.hidden = true;
      });
    }
  }

  window.Think2BriefI18n = { init: init };
})();
