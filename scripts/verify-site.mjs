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
