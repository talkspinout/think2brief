export const en = {
    "meta.title": "Privacy Policy · Think2Brief — Marketing",
    "meta.description": "Privacy policy for the Think2Brief — Marketing Chrome extension.",
    "meta.ogTitle": "Privacy Policy · Think2Brief — Marketing",
    "skip-link": "Skip to content",
    "nav.brandAria": "Think2Brief home",
    "nav.menuAria": "Main menu",
    "nav.product": "Product",
    "nav.updates": "Updates",
    "nav.contact": "Contact",
    "summary.title": "Privacy<br />policy",
    "summary.subtitle": "Think2Brief — Marketing<br />Chrome extension",
    "summary.effectiveDateLabel": "Effective date",
    "summary.effectiveDateValue": "July 30, 2026",
    "summary.versionLabel": "Policy version",
    "summary.contactLabel": "Contact",
    "lead.title": "Summary",
    "lead.body":
      "The Chrome extension uses no developer account or server, analytics, or advertising trackers. It uses Google account authentication and Google Drive save/open features only when you choose them. Project data is never sent to the developer. Website visit analytics and the dedicated Drive file-picker page operate differently — see items 4 and 8.",
    "s01.title": "Scope and operator",
    "s01.body":
      'This privacy policy applies to the Chrome extension <b>Think2Brief — Marketing</b>, provided by Hongseok Ko (talkspinout). Questions about the product website go to <a href="mailto:think2brief@gmail.com">think2brief@gmail.com</a>.',
    "s02.title": "Information the extension processes",
    "s02.intro":
      "The extension processes the following information, entered or created by you, inside the browser in order to provide its features.",
    "s02.item1": "Project title and author display name",
    "s02.item2": "Campaign goal and audience",
    "s02.item3": "The content of decision, evidence, insight, strategy, activity, and measurement cards",
    "s02.item4": "Card status, whether a card is included in the brief, logic notes, and drafts in progress",
    "s02.item5": "Project identifiers, creation and update timestamps, and the data schema version",
    "s02.outro":
      "The author display name and free-text content may include personal or work-related information depending on what you choose to enter. We recommend not entering sensitive or unnecessary personal information.",
    "s03.title": "Purpose and storage location",
    "s03.intro": "The information above is used only to provide the following features.",
    "s03.item1": "Autosaving and recovering the project you're working on",
    "s03.item2": "The work board, strategy review, logic review, and final brief generation",
    "s03.item3": "JSON, Markdown, or print/PDF export that you request",
    "s03.outro":
      "Autosaved data is stored in <code>localStorage</code> scoped to the Chrome extension. Exported files are saved to a location you choose on your device, and you are responsible for managing them afterward.",
    "s04.title": "Collection, transmission, and third parties",
    "s04.fact1Label": "Collected on a developer server",
    "s04.fact1Value": "None",
    "s04.fact2Label": "Sent to an external service",
    "s04.fact2Value": "Google Drive, when you choose",
    "s04.fact3Label": "Analytics or ad tracking",
    "s04.fact3Value": "None",
    "s04.fact4Label": "Developer user accounts",
    "s04.fact4Value": "None",
    "s04.body":
      "This table describes the Chrome extension. When you choose to save to or open from Google Drive, a Google OAuth token and the selected project file are sent to Google. Access is limited to files this app creates or that you explicitly select. No data is sent to Notion, an LLM API, or a developer server, and the developer does not collect, view, or sell your projects. See item 8 for website analytics.",
    "s05.title": "Chrome permissions",
    "s05.body":
      "The extension uses Chrome's <code>identity</code> permission and Google Drive's <code>drive.file</code> scope for Google account authentication. Permission is requested when you use a Drive feature, and does not allow the extension to browse your entire Drive or arbitrarily read files created by other apps. It cannot access your browsing history or the content of other tabs.",
    "s06.title": "Retention and deletion",
    "s06.body1":
      "Autosaved data remains in that browser until you run <b>Clear saved data</b> inside the extension, or clear the extension's data through Chrome.",
    "s06.body2":
      "JSON, Markdown, or PDF files you save separately are not deleted by the extension's Clear saved data feature. Google Drive files are also not deleted when you disconnect Drive. You must delete those files yourself.",
    "s07.title": "Security and your choices",
    "s07.body":
      "Project files are transmitted to Google over encrypted HTTPS only when you choose a Google Drive feature. The OAuth token is never placed in a URL, web storage, or a developer server; it is handled temporarily in browser memory during file selection. You are responsible for securing access to your device account, Chrome profile, Google account, and exported files.",
    "s08.title": "Product website",
    "s08.body":
      'The product introduction and this privacy policy are hosted on GitHub Pages. While you\'re visiting the website, GitHub may process technical information such as access logs, which is subject to the <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub Privacy Statement</a>.',
    "s08.analytics":
      'This website uses Google Analytics 4 through <a href="https://policies.google.com/technologies/managing">Google Tag Manager</a> to understand visits and improve the site. This may process pages visited, feature-use events, device and browser information, an approximate region derived from the IP address, and cookies or similar identifiers. Project, card, and brief content entered in the Chrome extension is never included in website analytics. The information is sent to Google and is subject to the <a href="https://policies.google.com/privacy">Google Privacy Policy</a>. You can limit collection through your browser cookie settings or the Google Analytics opt-out browser add-on. You can decline analytics on the consent screen shown on your first visit and change your choice anytime through “Analytics settings” in the footer. Google Tag Manager and Google Analytics are not loaded before you consent.',
    "s08.appSeparate":
      "The Chrome extension operates separately from this website: it does not include Tag Manager and uses no analytics tools. The dedicated Drive file-picker page at <code>/drive-picker/</code> also has no Tag Manager or analytics. Its URL never contains an OAuth token, project content, or a unique project identifier. It receives only a one-time handshake value and the extension origin; the token is sent by browser messaging only after the origin, popup window, and handshake value are verified.",
    "s09.title": "Future features and policy changes",
    "s09.body1":
      "If our data practices change, we will disclose the changed data types and purposes in advance through this privacy policy and inside the extension. We will not process any newly collected or used data before you explicitly consent. We will also update the Chrome Web Store's privacy disclosures before shipping any such change.",
    "s09.body2": "Material changes are shown on this page with an updated effective date and policy version.",
    "s10.title": "Contact",
    "s10.body":
      'For questions about data processing or deletion, contact <a href="mailto:think2brief@gmail.com">think2brief@gmail.com</a>.',
    "footer.backToProduct": "← Back to product",
    "langBanner.text": "Read this page in English?",
    "langBanner.switch": "View in English",
    "langBanner.dismiss": "Dismiss",
  };

if (typeof window !== "undefined" && window.Think2BriefI18n) {
  window.Think2BriefI18n.init(en);
}
