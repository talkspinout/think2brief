(() => {
  const STORAGE_KEY = "think2brief-analytics-consent-v1";
  const GTM_ID = "GTM-TVM9224X";
  const COPY = {
    ko: {
      title: "사이트 이용 통계에 동의하시겠어요?",
      body: "제품 사이트 개선을 위해 Google 애널리틱스 4로 방문 페이지와 기능 이용 정보를 수집합니다. 확장 프로그램에 작성한 프로젝트·카드·브리프 내용은 수집하지 않습니다.",
      accept: "동의",
      reject: "동의하지 않음",
      settings: "분석 설정",
      privacy: "자세히 보기",
    },
    en: {
      title: "Allow website analytics?",
      body: "We use Google Analytics 4 to understand visits and improve this product website. Project, card, and brief content entered in the Chrome extension is never collected.",
      accept: "Allow analytics",
      reject: "Do not allow",
      settings: "Analytics settings",
      privacy: "Learn more",
    },
  };

  const readChoice = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  };

  const saveChoice = (choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // A blocked storage API must not prevent the visitor from using the site.
    }
  };

  const language = () => (document.documentElement.lang.toLowerCase().startsWith("en") ? "en" : "ko");
  const privacyUrl = () => {
    const path = location.pathname;
    if (path.includes("/en/privacy/") || path.includes("/privacy/")) return location.href;
    if (path.includes("/en/")) return "../en/privacy/";
    if (path.includes("/updates/")) return "../privacy/";
    return "./privacy/";
  };

  const consentCommand = (state) => {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag() {
        window.dataLayer.push(arguments);
      };
    window.gtag("consent", state === "default" ? "default" : "update", {
      analytics_storage: state === "granted" ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  };

  const loadTagManager = () => {
    if (document.querySelector(`script[data-gtm-id="${GTM_ID}"]`)) return;
    consentCommand("granted");
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.async = true;
    script.dataset.gtmId = GTM_ID;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.append(script);
  };

  const removeAnalyticsCookies = () => {
    document.cookie.split(";").forEach((item) => {
      const name = item.split("=")[0].trim();
      if (name === "_ga" || name.startsWith("_ga_")) {
        document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      }
    });
  };

  const closeDialog = () => document.getElementById("analytics-consent")?.remove();

  const choose = (choice) => {
    saveChoice(choice);
    closeDialog();
    if (choice === "granted") {
      loadTagManager();
      return;
    }
    consentCommand("denied");
    removeAnalyticsCookies();
    if (document.querySelector(`script[data-gtm-id="${GTM_ID}"]`)) location.reload();
  };

  const showDialog = () => {
    closeDialog();
    const copy = COPY[language()];
    const dialog = document.createElement("section");
    dialog.id = "analytics-consent";
    dialog.className = "analytics-consent";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "analytics-consent-title");
    dialog.innerHTML = `
      <div class="analytics-consent__copy">
        <strong id="analytics-consent-title">${copy.title}</strong>
        <p>${copy.body} <a href="${privacyUrl()}">${copy.privacy}</a></p>
      </div>
      <div class="analytics-consent__actions">
        <button type="button" data-analytics-choice="denied">${copy.reject}</button>
        <button type="button" class="is-primary" data-analytics-choice="granted">${copy.accept}</button>
      </div>
    `;
    dialog.querySelectorAll("[data-analytics-choice]").forEach((button) => {
      button.addEventListener("click", () => choose(button.dataset.analyticsChoice));
    });
    document.body.append(dialog);
    dialog.querySelector("[data-analytics-choice]")?.focus();
  };

  const addSettingsControl = () => {
    const copy = COPY[language()];
    const container = document.querySelector(".footer-links, .footer-bottom");
    if (!container || container.querySelector("[data-analytics-settings]")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "analytics-settings";
    button.dataset.analyticsSettings = "";
    button.textContent = copy.settings;
    button.addEventListener("click", showDialog);
    container.append(button);
  };

  const start = () => {
    const choice = readChoice();
    if (choice === "granted") loadTagManager();
    if (!choice) showDialog();
    addSettingsControl();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
