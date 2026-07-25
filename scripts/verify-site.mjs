import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFile(resolve(root, path), "utf8");

const [home, privacy, styles, workflow] = await Promise.all([
  read("site/index.html"),
  read("site/privacy/index.html"),
  read("site/assets/styles.css"),
  read(".github/workflows/deploy-pages.yml"),
]);

for (const path of [
  "site/assets/icon128.png",
  "site/assets/product/work-board.png",
  "site/assets/product/logic-review.png",
  "site/assets/product/final-brief.png",
  "site/assets/product/blank-board-start.png",
  "site/404.html",
  "site/robots.txt",
  "site/sitemap.xml",
  "site/.nojekyll",
  "LICENSE",
]) {
  await access(resolve(root, path));
}

assert.match(home, /Think2Brief — Marketing/);
assert.match(home, /Chrome 웹스토어 출시 준비 중/);
assert.match(home, /href="\.\/privacy\/"/);
assert.match(home, /회원가입 없음/);
assert.doesNotMatch(home, /Google Drive 연결|Notion 연결|지금 설치/);

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
assert.match(home, /이 브라우저에만 저장되고/);

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
assert.match(privacy, /2026년 7월 24일/);
assert.match(privacy, /think2brief@gmail\.com/);
assert.match(privacy, /unlimitedStorage/);
assert.match(privacy, /개발자 서버 수집[\s\S]*없음/);
assert.match(privacy, /제3자 전송·판매[\s\S]*없음/);
assert.match(privacy, /Google Drive, Notion, LLM/);

assert.match(styles, /@media \(max-width: 720px\)/);
assert.match(styles, /@media print/);
assert.match(workflow, /actions\/checkout@v6/);
assert.match(workflow, /actions\/upload-pages-artifact@v4/);
assert.match(workflow, /actions\/deploy-pages@v4/);
assert.doesNotMatch(`${home}\n${privacy}`, /http:\/\//);

console.log("Think2Brief 사이트 검증 통과");
