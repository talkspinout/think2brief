import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFile(resolve(root, path), "utf8");

const [home, privacy, updates, enHome, enPrivacy, styles, workflow, i18n, i18nHome, i18nPrivacy, i18nUpdates, sitemap] = await Promise.all([
  read("site/index.html"),
  read("site/privacy/index.html"),
  read("site/updates/index.html"),
  read("site/en/index.html"),
  read("site/en/privacy/index.html"),
  read("site/assets/styles.css"),
  read(".github/workflows/deploy-pages.yml"),
  read("site/assets/i18n.js"),
  read("site/assets/i18n-home.js"),
  read("site/assets/i18n-privacy.js"),
  read("site/assets/i18n-updates.js"),
  read("site/sitemap.xml"),
]);

for (const path of [
  "site/assets/icon128.png",
  "site/assets/product/work-board.png",
  "site/assets/product/logic-review.png",
  "site/assets/product/final-brief.png",
  "site/assets/product/blank-board-start.png",
  "site/assets/product/work-board-en.png",
  "site/assets/product/logic-review-en.png",
  "site/assets/product/final-brief-en.png",
  "site/assets/product/blank-board-start-en.png",
  "site/assets/store/screenshot-1-start-en.png",
  "site/assets/store/screenshot-2-capture-en.png",
  "site/assets/store/screenshot-3-review-en.png",
  "site/assets/store/screenshot-4-finish-en.png",
  "site/404.html",
  "site/robots.txt",
  "site/sitemap.xml",
  "site/.nojekyll",
  "LICENSE",
]) {
  await access(resolve(root, path));
}

// 언어 토글이 있는 4장의 제품 화면은 각각 영문 스크린샷 짝(-en.png)을
// data-i18n-en-src로 참조해야 한다 — 토글을 영문으로 바꿨는데 화면만
// 한국어로 남는 조용한 회귀를 잡기 위한 고정.
for (const base of ["blank-board-start", "work-board", "logic-review", "final-brief"]) {
  assert.match(home, new RegExp(`data-i18n-en-src="\\./assets/product/${base}-en\\.png"`));
}

assert.match(home, /Think2Brief — Marketing/);
assert.match(home, /href="https:\/\/chromewebstore\.google\.com\/detail\/Think2Brief/);
assert.match(home, /Chrome 웹스토어에서 설치하기/);
assert.match(home, /href="\.\/privacy\/"/);
assert.match(home, /회원가입 없음/);
assert.doesNotMatch(home, /Google Drive 연결|Notion 연결|지금 설치/);
assert.doesNotMatch(home, /출시 준비 중/);

// 제품 화면 3장은 실제 앱 스크린샷(PNG)이어야 하며, 새 창으로 열리는
// 원본 보기 링크 없이 페이지 안에서 바로 보여야 한다.
assert.doesNotMatch(home, /\.svg"/);
assert.doesNotMatch(home, /target="_blank"/);
assert.doesNotMatch(home, /전체 화면 보기/);

// "기능 4카드" 섹션은 스크린샷 섹션과 내용이 중복되어 제거했다 — 되살아나지
// 않도록 고정한다.
assert.doesNotMatch(home, /FOUR WORKING VIEWS/);

// 지나치게 비장한 카피는 더 담백한 문구로 교체했다.
assert.doesNotMatch(home, /좋은 브리프는 생각의 흔적을 남깁니다/);
assert.doesNotMatch(home, /당신의 브리프는[\s\S]{0,20}당신의 브라우저에 머뭅니다/);
assert.doesNotMatch(home, /생각을 브리프로, 지금 바로 정리해 보세요/);
assert.match(home, /흩어진 생각을, 지금 브리프로 정리해 보세요/);
assert.match(home, /브라우저에만 저장되고/);
assert.match(home, /자신만의[\s\S]{0,20}논리로 이어지는지 확인합니다/);

// PRODUCT IN ACTION과 HOW IT WORKS는 내용이 겹쳐 하나로 합쳤다 —
// 별개 섹션으로 되돌아가지 않도록 고정한다.
assert.doesNotMatch(home, /PRODUCT IN ACTION/);
assert.equal((home.match(/HOW IT WORKS/g) || []).length, 1);
assert.match(home, /카드 한 장에서[\s\S]{0,20}네 단계입니다/);
for (const step of ["질문 구조 선택", "판단과 근거 기록", "연결 확인", "최종 브리프 완성"]) {
  assert.match(home, new RegExp(step));
}

// MORE TO KNOW는 큰 제목 없이 가벼운 보조 정보로만 노출되어야 한다.
assert.doesNotMatch(home, /id="features-title"/);

// "부가 기능" 3항목이 같은 비중으로 노출되어야 한다 (로컬 저장이 단독으로
// 강조되고 나머지가 배지로 딸려 붙는 구조로 되돌아가지 않도록 고정).
assert.match(home, /feature-strip/);
assert.match(home, /Markdown·PDF 내보내기/);
assert.match(home, /현재 모든 기능 무료/);
assert.doesNotMatch(home, /trust-list" aria-label="추가 제품 특성"/);

// 빈 보드 시작 화면도 스크린샷으로 보여줘야 한다.
assert.match(home, /blank-board-start\.png/);

// 화면 캡션은 이미지보다 먼저 나와야 한다(이미지 먼저 보여주고 나중에
// 설명하는 순서로 되돌아가지 않도록 고정).
assert.ok(home.indexOf("<figcaption>") < home.indexOf('src="./assets/product/work-board.png"'));

assert.match(privacy, /시행일/);
assert.match(privacy, /2026년 7월 25일/);
assert.match(privacy, /think2brief@gmail\.com/);
// unlimitedStorage는 localStorage에는 적용되지 않아 실효가 없고, 실제로
// 요청하는 권한도 아니므로(매니페스트에서 제거) 정책에서도 다시 등장하지
// 않아야 한다.
assert.doesNotMatch(privacy, /unlimitedStorage/);
assert.match(privacy, /추가 Chrome 권한을 요청하지 않습니다/);
assert.match(privacy, /개발자 서버 수집[\s\S]*없음/);
assert.match(privacy, /제3자 전송·판매[\s\S]*없음/);
assert.match(privacy, /Google Drive, Notion, LLM/);

assert.match(styles, /@media \(max-width: 720px\)/);
assert.match(styles, /@media print/);
assert.match(workflow, /actions\/checkout@v6/);
assert.match(workflow, /actions\/upload-pages-artifact@v4/);
assert.match(workflow, /actions\/deploy-pages@v4/);
assert.doesNotMatch(`${home}\n${privacy}\n${updates}`, /http:\/\//);

// 한국어가 실제로 렌더링되는 기본 언어여야 한다(검색엔진·No-JS 방문자
// 기준). 영어는 이 스크립트 위에서 JS로 얹는 토글이며, 페이지의 원문
// 한국어 텍스트를 그대로 유지해야 토글이 원래 문구로 복원할 수 있다.
for (const page of [home, privacy, updates]) {
  assert.match(page, /<html lang="ko">/);
  assert.match(page, /<script src="\.?\.?\/assets\/i18n\.js"><\/script>/);
}

// 언어 토글은 페이지마다 자기 사전 파일을 따로 로드한다 — 세 페이지가
// 서로 다른 사전을 쓰다가 한쪽만 갱신되고 잊히는 걸 막기 위해 각 페이지가
// 자신의 사전 스크립트를 참조하는지 고정해 둔다.
assert.match(home, /i18n-home\.js/);
assert.match(privacy, /i18n-privacy\.js/);
assert.match(updates, /i18n-updates\.js/);

// data-i18n(속성 포함) 키는 각 페이지와 그 페이지 전용 사전에 1:1로
// 있어야 한다. 키가 어긋나면 언어 전환 시 조용히 원문(한국어)으로
// 남아버리는 문제라 자동으로 못 알아채기 쉽다.
const extractI18nKeys = (html) => {
  const keys = new Set();
  const re = /data-i18n(?:-attr-[a-z-]+)?="([^"]+)"/g;
  let match;
  while ((match = re.exec(html))) keys.add(match[1]);
  return keys;
};
const extractDictKeys = (js) => {
  const keys = new Set();
  const re = /"([a-zA-Z0-9_.-]+)":/g;
  let match;
  while ((match = re.exec(js))) keys.add(match[1]);
  return keys;
};
for (const [label, pageHtml, dictJs] of [
  ["home", home, i18nHome],
  ["privacy", privacy, i18nPrivacy],
  ["updates", updates, i18nUpdates],
]) {
  const used = extractI18nKeys(pageHtml);
  const defined = extractDictKeys(dictJs);
  const missing = [...used].filter((key) => !defined.has(key));
  const unused = [...defined].filter((key) => !used.has(key));
  if (missing.length) assert.fail(`${label}: data-i18n key(s) missing from its EN dictionary: ${missing.join(", ")}`);
  if (unused.length) assert.fail(`${label}: EN dictionary has unused key(s): ${unused.join(", ")}`);
}

assert.match(i18n, /think2brief-site-language/);
assert.match(i18nHome, /Install from the Chrome Web Store/);
assert.match(i18nPrivacy, /think2brief — marketing currently uses no account/i);
assert.match(i18nPrivacy, /None/);

// 업데이트 노트는 구조만 먼저 만든 것으로 합의했다 — 웹스토어 심사 전까지는
// 검색 노출·sitemap·메인 내비게이션에 올리지 않는다. 이 결정이 조용히
// 되돌아가지 않도록 고정해 둔다. 실제로 공개할 때는 이 세 가지 조건을
// 함께 걷어내야 한다.
assert.match(updates, /<meta name="robots" content="noindex" \/>/);
assert.doesNotMatch(sitemap, /\/updates\//);
assert.doesNotMatch(home, /href="\.\/updates\/"/);
assert.doesNotMatch(privacy, /href="\.\.\/updates\/"/);

// <title>과 description/OG meta도 토글 대상이다. 크롤러 미리보기는 JS를
// 실행하지 않으므로 이 3장(home/privacy/updates)의 원문 자체는 계속
// 한국어로 남는다 — 크롤러용 진짜 영문 진입점은 site/en/(아래 별도 검증).
for (const [label, page] of [["home", home], ["privacy", privacy], ["updates", updates]]) {
  assert.match(page, /<title data-i18n="meta\.title">/, `${label}: <title> must be toggle-aware`);
  assert.match(
    page,
    /<meta\s+name="description"\s+data-i18n-attr-content="meta\.description"/,
    `${label}: meta description must be toggle-aware`,
  );
}

// site/en/ is scripts/build-en.mjs's output — a real, crawlable English
// snapshot with its own lang/canonical/og:locale, generated from the same
// Korean HTML + EN dictionaries the client-side toggle uses (single source
// of truth). `npm run verify` builds it first; see package.json.
for (const [label, page, base] of [["en/home", enHome, "https://talkspinout.github.io/think2brief/en/"], ["en/privacy", enPrivacy, "https://talkspinout.github.io/think2brief/en/privacy/"]]) {
  assert.match(page, /<html lang="en">/, `${label}: must render as lang="en"`);
  assert.doesNotMatch(page, /data-i18n/, `${label}: must not leak build-time data-i18n* directives`);
  assert.doesNotMatch(page, /<script[^>]*\/assets\/i18n/, `${label}: static snapshot needs no toggle script`);
  assert.doesNotMatch(page, /<!--/, `${label}: build comments must be stripped`);
  assert.match(page, new RegExp(`<link rel="canonical" href="${base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}">`), `${label}: canonical must point at itself`);
  assert.match(page, /<meta property="og:locale" content="en_US">/, `${label}: og:locale must be en_US`);
  assert.doesNotMatch(page, /\.\.\/\.\//, `${label}: asset paths must not be malformed (../.'/)`);
}
assert.match(enHome, /Install from the Chrome Web Store/);
assert.match(enHome, /product\/blank-board-start-en\.png/);
assert.match(enPrivacy, /Chrome extension\.<\/p>|Chrome extension\./);

// KO 원본과 EN 스냅샷은 서로 같은 hreflang 대체 링크 세트를 들고 있어야
// 한다 — 한쪽만 갱신되고 잊히는 걸 막기 위한 고정.
for (const [label, page] of [["home", home], ["en/home", enHome], ["privacy", privacy], ["en/privacy", enPrivacy]]) {
  assert.match(page, /hreflang="ko"/, `${label}: missing hreflang=ko`);
  assert.match(page, /hreflang="en"/, `${label}: missing hreflang=en`);
  assert.match(page, /hreflang="x-default"/, `${label}: missing hreflang=x-default`);
}

assert.doesNotMatch(`${enHome}\n${enPrivacy}`, /http:\/\//);

console.log("Think2Brief 사이트 검증 통과");
