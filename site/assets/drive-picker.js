(() => {
  "use strict";

  const BRIDGE_SOURCE = "think2brief-picker-bridge";
  const APP_SOURCE = "think2brief-app";
  const EXTENSION_ORIGIN_PATTERN = /^chrome-extension:\/\/[a-p]{32}$/;
  const STATE_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const status = document.querySelector("#picker-status");
  const closeButton = document.querySelector("#close-picker");
  const query = new URLSearchParams(window.location.search);
  const state = query.get("state");
  const extensionOrigin = query.get("extension_origin");
  let finished = false;
  let initialized = false;
  let accessToken = null;
  let readyInterval = null;

  history.replaceState(null, "", window.location.pathname);

  const setStatus = (message) => {
    status.textContent = message;
  };

  const postToExtension = (type, detail = {}) => {
    if (!window.opener || !extensionOrigin) return;
    window.opener.postMessage({
      source: BRIDGE_SOURCE,
      type,
      state,
      ...detail,
    }, extensionOrigin);
  };

  const finish = (type, detail) => {
    if (finished) return;
    finished = true;
    accessToken = null;
    if (readyInterval) window.clearInterval(readyInterval);
    postToExtension(type, detail);
    window.setTimeout(() => window.close(), 80);
  };

  const fail = (code, message) => {
    setStatus(message);
    finish("error", { code });
  };

  const loadPickerScript = () => new Promise((resolve, reject) => {
    if (window.gapi) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("PICKER_SCRIPT_LOAD_FAILED"));
    document.head.appendChild(script);
  });

  const loadPickerModule = () => new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error("PICKER_MODULE_TIMEOUT")), 15000);
    window.gapi.load("picker", {
      callback: () => {
        window.clearTimeout(timeout);
        resolve();
      },
      onerror: () => {
        window.clearTimeout(timeout);
        reject(new Error("PICKER_MODULE_LOAD_FAILED"));
      },
    });
  });

  const openPicker = async ({ developerKey, appId, mode }) => {
    setStatus("Google Drive 탐색기를 여는 중입니다…");
    await loadPickerScript();
    await loadPickerModule();

    const isFolderMode = mode === "folders";
    const view = isFolderMode
      ? new window.google.picker.DocsView(window.google.picker.ViewId.FOLDERS)
        .setSelectFolderEnabled(true)
        .setMode(window.google.picker.DocsViewMode.LIST)
      : new window.google.picker.DocsView(window.google.picker.ViewId.DOCS)
        .setIncludeFolders(true)
        .setMode(window.google.picker.DocsViewMode.LIST);

    const picker = new window.google.picker.PickerBuilder()
      .setOAuthToken(accessToken)
      .setDeveloperKey(developerKey)
      .setAppId(appId)
      .addView(view)
      .setCallback((data) => {
        if (data.action === window.google.picker.Action.PICKED && data.docs?.[0]?.id) {
          const file = data.docs[0];
          finish("picked", { fileId: file.id, name: file.name || "" });
        } else if (data.action === window.google.picker.Action.CANCEL) {
          finish("cancelled");
        }
      })
      .build();

    picker.setVisible(true);
    setStatus(isFolderMode
      ? "Google Drive에서 저장할 폴더를 선택하세요."
      : "Google Drive에서 Think2Brief 프로젝트 파일을 선택하세요.");
  };

  closeButton.addEventListener("click", () => finish("cancelled"));

  if (
    !window.opener
    || !STATE_PATTERN.test(state || "")
    || !EXTENSION_ORIGIN_PATTERN.test(extensionOrigin || "")
  ) {
    setStatus("Think2Brief 확장 프로그램에서 다시 열어 주세요.");
    closeButton.focus();
    return;
  }

  window.addEventListener("message", (event) => {
    const data = event.data;
    if (
      initialized
      || event.source !== window.opener
      || event.origin !== extensionOrigin
      || data?.source !== APP_SOURCE
      || data?.type !== "initialize"
      || data?.state !== state
    ) return;

    if (
      typeof data.token !== "string"
      || data.token.length < 20
      || typeof data.developerKey !== "string"
      || typeof data.appId !== "string"
      || (data.mode !== undefined && data.mode !== "files" && data.mode !== "folders")
    ) {
      fail("INVALID_INITIALIZATION", "인증 정보를 확인하지 못했습니다. 창을 닫고 다시 시도해 주세요.");
      return;
    }

    initialized = true;
    if (readyInterval) window.clearInterval(readyInterval);
    accessToken = data.token;
    openPicker(data).catch((error) => {
      const allowedCodes = new Set([
        "PICKER_SCRIPT_LOAD_FAILED",
        "PICKER_MODULE_TIMEOUT",
        "PICKER_MODULE_LOAD_FAILED",
      ]);
      const code = allowedCodes.has(error?.message) ? error.message : "PICKER_OPEN_FAILED";
      fail(code, "Google Drive 탐색기를 열지 못했습니다. 잠시 후 다시 시도해 주세요.");
    });
  });

  window.setTimeout(() => {
    if (!initialized && !finished) {
      fail("INITIALIZATION_TIMEOUT", "확장 프로그램과 연결하지 못했습니다. 창을 닫고 다시 시도해 주세요.");
    }
  }, 15000);

  postToExtension("ready");
  readyInterval = window.setInterval(() => {
    if (!initialized && !finished) postToExtension("ready");
  }, 500);
})();
