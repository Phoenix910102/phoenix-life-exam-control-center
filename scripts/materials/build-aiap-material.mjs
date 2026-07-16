import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { JSDOM } from "jsdom";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) args.set(process.argv[index], process.argv[index + 1]);
const htmlPath = args.get("--html");
const examBankPath = args.get("--exam-bank");
const bossBankPath = args.get("--boss-bank") ?? path.join(path.dirname(examBankPath ?? ""), "boss_quiz_bank.js");
const outputPath = args.get("--output");
if (!htmlPath || !examBankPath || !outputPath) throw new Error("Usage: node build-aiap-material.mjs --html <html> --exam-bank <final.js> [--boss-bank <boss.js>] --output <json>");

const clean = (value) => (value ?? "").replace(/\s+/g, " ").trim();
const slugify = (value) => clean(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";
const generatedAt = new Date().toISOString();
const document = new JSDOM(fs.readFileSync(htmlPath, "utf8")).window.document;

function loadBank(file, name) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, "utf8"), context);
  if (!Array.isArray(context.window[name])) throw new Error(`找不到 ${name}`);
  return context.window[name];
}
const finalBank = loadBank(examBankPath, "AIAP_FINAL_EXAM_BANK");
const bossBank = loadBank(bossBankPath, "AIAP_BOSS_QUIZ_BANK");

const categoryChapterMap = new Map([
  ["00 基礎骨架", "ch-01"], ["01 學習型態", "ch-02"], ["01 任務類型", "ch-02"],
  ["02 資料處理", "ch-04"], ["03 訓練與驗證", "ch-06"], ["04 傳統模型", "ch-05"],
  ["05 評估指標", "ch-06"], ["06 深度學習", "ch-07"], ["07 LLM", "ch-07"],
  ["08 生成式 AI", "ch-08"], ["SP 微調與持續學習", "ch-08"], ["10 部署與壓縮", "ch-11"],
  ["10 MLOps", "ch-11"], ["11 治理與安全", "ch-12"], ["12 統計與分布", "ch-09"],
  ["13 大數據工程", "ch-10"], ["14 視覺化與分析工具", "ch-09"],
]);
const sourceChapterMap = new Map([
  ["ch03", "ch-02"], ["ch05", "ch-04"], ["ch06", "ch-05"], ["ch07", "ch-06"],
  ["ch08", "ch-07"], ["ch09-rag", "ch-08"], ["ch09-agent", "ch-08"], ["ch10", "ch-09"],
  ["ch11", "ch-10"], ["ch12", "ch-11"], ["ch13", "ch-12"],
]);

function sourceKind(code, url) {
  if (/^[GE]\d+$/i.test(code) || /gov|nist|europa\.eu|oecd/i.test(url ?? "")) return "official";
  if (/arxiv|doi\.org|pnas/i.test(url ?? "")) return "paper";
  return "documentation";
}
const sourceLibrary = [...document.querySelectorAll(".source-mini")].map((node, index) => {
  const code = clean(node.querySelector("b")?.textContent) || `source-${index + 1}`;
  const url = node.querySelector("a[href]")?.href;
  return { key: slugify(code), title: clean(node.querySelector("strong")?.textContent) || code, citation: clean(node.querySelector("p")?.textContent) || undefined, ...(url ? { url } : {}), kind: sourceKind(code, url) };
});
const sources = sourceLibrary.map((source) => ({ id: source.key, title: source.title, type: source.kind, ...(source.url ? { url: source.url } : {}), ...(source.citation ? { citation: source.citation } : {}), accessedAt: generatedAt, freshness: source.kind === "paper" ? "stable" : "review-needed" }));

const termCards = [...document.querySelectorAll(".term-card")];
const categoryNames = [...new Set(termCards.map((card) => card.dataset.cat ?? "00 基礎骨架"))];
const categories = categoryNames.map((title, order) => ({ key: `cat-${String(order + 1).padStart(2, "0")}`, title, order }));
const categoryKeyByName = new Map(categories.map((category) => [category.title, category.key]));
const allSourceKeys = sourceLibrary.map((source) => source.key);

function field(card, label) {
  const value = [...card.querySelectorAll(".term-fields p")].map((node) => clean(node.textContent)).find((text) => text.startsWith(label));
  return clean(value?.replace(new RegExp(`^${label}[：:]\\s*`), "")) || "原始教材未另外標註";
}
const glossaryTerms = termCards.map((card) => {
  const category = card.dataset.cat ?? "00 基礎骨架";
  const sourceLevel = card.dataset.level ?? "C級索引";
  return {
    key: card.id,
    term: clean(card.querySelector("h3")?.childNodes[0]?.textContent) || clean(card.querySelector("h3")?.textContent),
    ...(clean(card.querySelector(".en")?.textContent) ? { english: clean(card.querySelector(".en")?.textContent) } : {}),
    categoryKey: categoryKeyByName.get(category),
    level: sourceLevel.startsWith("A") ? "core" : sourceLevel.startsWith("B") ? "frequent" : "index",
    oneLiner: field(card, "一句話"), questionSignal: field(card, "判題信號"), application: field(card, "應用情況"),
    examExample: field(card, "考題例子"), confusion: field(card, "容易混"),
    chapterRefs: [categoryChapterMap.get(category) ?? "ch-01"],
    relatedTermRefs: [...new Set([...card.querySelectorAll('a[href^="#term-"]')].map((link) => link.getAttribute("href")?.slice(1)).filter((key) => key && key !== card.id))],
    sourceRefs: [],
  };
});
const glossaryKeySet = new Set(glossaryTerms.map((term) => term.key));
for (const term of glossaryTerms) term.relatedTermRefs = term.relatedTermRefs.filter((key) => glossaryKeySet.has(key));
const termByText = new Map();
for (const term of glossaryTerms) for (const name of [term.term, term.english].filter(Boolean)) termByText.set(clean(name).toLowerCase(), term.key);

function termRefsForQuestion(question) {
  const haystack = clean([question.prompt, ...(question.weaknessTags ?? [])].join(" ")).toLowerCase();
  return glossaryTerms.filter((term) => [term.term, term.english].filter(Boolean).some((name) => haystack.includes(clean(name).toLowerCase()))).map((term) => term.key).slice(0, 8);
}
function chapterRefsForQuestion(question, fallback) {
  const refs = (question.chapterLinks ?? []).map((key) => sourceChapterMap.get(key)).filter(Boolean);
  return [...new Set(refs.length ? refs : [fallback])];
}
function convertQuestion(question, fallbackChapter, sourceRef) {
  const choiceKeys = Object.keys(question.choices).sort();
  const imageAsset = question.imageRef ? `/materials/aiap/questions/${question.id}.png` : undefined;
  return {
    key: question.id,
    prompt: clean(question.prompt),
    options: choiceKeys.map((key) => clean(question.choices[key])),
    answer: choiceKeys.indexOf(question.answer),
    explanation: clean(question.explanation),
    chapterRefs: chapterRefsForQuestion(question, fallbackChapter),
    termRefs: termRefsForQuestion(question),
    sourceRefs: sourceRef ? [sourceRef] : [],
    ...(imageAsset ? { imageAsset } : {}),
  };
}

const questions = [];
const questionBanks = [];
for (const bank of bossBank) {
  const chapterKey = sourceChapterMap.get(bank.chapterId) ?? "ch-01";
  const converted = bank.questions.map((question) => convertQuestion(question, chapterKey));
  questions.push(...converted);
  questionBanks.push({ key: `boss-${bank.chapterId}`, title: `${bank.chapterTitle} · ${bank.bossName}`, kind: "boss", questionRefs: converted.map((question) => question.key) });
}
const convertedFinal = finalBank.map((question) => convertQuestion(question, sourceChapterMap.get(question.chapterLinks?.[0]) ?? "ch-01", "g1"));
questions.push(...convertedFinal);
questionBanks.push({ key: "final-official-114-2", title: "114 年第二梯次公告題 Final Exam", kind: "final", questionRefs: convertedFinal.map((question) => question.key) });

function parseTable(table, key) {
  return { key, type: "comparison", title: "情境判斷與高頻陷阱", columns: [...table.querySelectorAll("thead th")].map((cell) => clean(cell.textContent)), rows: [...table.querySelectorAll("tbody tr")].map((row) => [...row.querySelectorAll("td")].map((cell) => clean(cell.textContent))), importance: "critical", examWeight: 8, includeInQuickReview: true, estimatedMinutes: 5 };
}
function parseChapterBody(element) {
  const body = element.querySelector(".chapter-body");
  if (!body) return [];
  const blocks = [];
  [...body.children].forEach((child, index) => {
    const key = `section-${String(index + 1).padStart(2, "0")}`;
    if (child.matches(":scope > p")) blocks.push({ key, type: "concept", title: "本章核心", body: clean(child.textContent), importance: "core", examWeight: 6, includeInQuickReview: true, estimatedMinutes: 3 });
    else if (child.matches(".table-wrap") && child.querySelector("table")) blocks.push(parseTable(child.querySelector("table"), key));
    else if (child.matches(".note")) {
      const title = clean(child.querySelector("h4")?.textContent || "章節提示");
      let bodyText = clean(child.textContent); if (bodyText.startsWith(title)) bodyText = clean(bodyText.slice(title.length));
      blocks.push({ key, type: "callout", tone: child.classList.contains("dark") ? "warning" : child.classList.contains("accent") ? "important" : "info", title, body: bodyText || title, importance: "core", examWeight: 6, includeInQuickReview: !child.classList.contains("soft"), estimatedMinutes: 2 });
    } else if (child.matches(".qa-list")) {
      [...child.querySelectorAll("details")].forEach((detail, detailIndex) => {
        const prompt = clean(detail.querySelector("summary")?.textContent); let answer = clean(detail.textContent); if (answer.startsWith(prompt)) answer = clean(answer.slice(prompt.length));
        blocks.push({ key: `example-${detailIndex + 1}`, type: "example", prompt, reasoningSteps: ["圈出任務、限制與錯誤成本", "連回本章核心詞與判題信號"], answer, importance: "core", examWeight: 7, includeInQuickReview: true, estimatedMinutes: 2 });
      });
    }
  });
  return blocks;
}

const chapterElements = [...document.querySelectorAll("section.chapter")];
const chapters = chapterElements.map((element, index) => {
  const key = element.id;
  const terms = glossaryTerms.filter((term) => term.chapterRefs.includes(key));
  const bankRefs = questionBanks.filter((bank) => bank.questionRefs.some((ref) => questions.find((question) => question.key === ref)?.chapterRefs.includes(key))).map((bank) => bank.key);
  const title = clean(element.querySelector("h2")?.textContent);
  const content = parseChapterBody(element);
  return {
    key, title, summary: clean(element.querySelector(".subtitle")?.textContent) || title,
    estimatedMinutes: Math.max(10, content.reduce((sum, block) => sum + (block.estimatedMinutes ?? 1), 0) + Math.min(12, terms.length)),
    objectives: [`掌握${title}的資訊位置與用途`, "辨認高頻題幹信號與混淆選項", "能從名詞庫與題庫回到本章脈絡"],
    blocks: [
      { key: "chapter-position", type: "position", category: "AIAP 中級", before: index ? clean(chapterElements[index - 1].querySelector("h2")?.textContent) : "全科戰役入口", current: title, after: index < chapterElements.length - 1 ? clean(chapterElements[index + 1].querySelector("h2")?.textContent) : "Final Exam", importance: "core", examWeight: 6, includeInQuickReview: true, estimatedMinutes: 2 },
      ...content,
      ...(terms.length ? [{ key: "featured-terms", type: "term-reference", title: "本章核心名詞", termRefs: terms.filter((term) => term.level !== "index").slice(0, 12).map((term) => term.key), display: "featured", importance: "critical", examWeight: 8, includeInQuickReview: true, estimatedMinutes: 5 }] : []),
      ...(bankRefs.length ? [{ key: "question-banks", type: "question-bank-reference", title: "本章相關題庫", bankRefs, importance: "critical", examWeight: 10, includeInQuickReview: true, estimatedMinutes: 1 }] : []),
    ],
  };
});

const material = {
  schema: "phoenix.material.v1", slug: "aiap-intermediate-complete-guide", version: "2.0.0",
  title: "AIAP 中級：情境判題與應用全科戰役", description: clean(document.querySelector(".cover .lead")?.textContent) || "AIAP 中級完整課程、名詞庫與題庫戰役。",
  subject: "人工智慧技術應用與規劃 × 大數據處理分析與應用", exam: { name: "AI 應用規劃師", level: "中級", session: "114 年第二梯次公告試題整合版" },
  language: "zh-TW", tags: ["AIAP", "人工智慧", "大數據", "中級", "情境判題", "官方公告試題"], generatedAt,
  generator: { name: "Phoenix AIAP Native Curriculum Builder", version: "2.0.0" },
  presentation: { layout: "immersive-academy", theme: "neural-rose", shellTheme: "criminal-rose", readingTheme: "ivory-archive", defaultMode: "reading", availableModes: ["reading", "immersive", "night"], moduleSurfaces: { home: "rose-parchment", reader: "rose-parchment", lesson: "rose-parchment", glossary: "rose-parchment", "question-bank": "adaptive", "source-library": "rose-dossier", "quick-review": "rose-parchment", duel: "immersive-dark", diagnostic: "immersive-dark", "trap-field": "rose-dossier", quiz: "adaptive", battlefield: "immersive-dark" }, renderOrder: "authored", modules: ["home", "battlefield", "roadmap", "reader", "lesson", "duel", "diagnostic", "trap-field", "quiz", "glossary", "question-bank", "source-library", "quick-review", "achievements", "floating-console"], battlefield3d: { enabled: true, mapStyle: "neural-network", layout: "radial", seed: "aiap-intermediate-complete-guide-v2", cameraPreset: "war-room", environment: "neural-void", quality: "auto", allowCinematics: true } },
  difficulty: "deep", prerequisites: [], sources,
  quickReview: { summary: "先判斷任務，再看資料、模型、指標、部署與治理。", coreBlockKeys: chapters.flatMap((chapter) => chapter.blocks.filter((block) => block.importance === "critical").map((block) => `${chapter.key}:${block.key}`)).slice(0, 40), finalQuestionCount: questions.length },
  generationProfile: "phoenix-aiap-native-curriculum-v2",
  collections: { glossary: { terms: glossaryTerms, categories }, questions, questionBanks, sourceLibrary, learningPaths: [{ key: "full-curriculum", title: "AIAP 中級完整主線", chapterRefs: chapters.map((chapter) => chapter.key), termRefs: glossaryTerms.filter((term) => term.level === "core").map((term) => term.key), questionBankRefs: questionBanks.map((bank) => bank.key) }] },
  chapters,
};

const unique = (items, label) => { if (new Set(items).size !== items.length) throw new Error(`${label} 包含重複 key`); };
unique(glossaryTerms.map((term) => term.key), "glossary"); unique(questions.map((question) => question.key), "questions");
if (glossaryTerms.length !== 305 || categories.length !== 17 || questions.length !== 340) throw new Error(`內容稽核失敗 terms=${glossaryTerms.length} categories=${categories.length} questions=${questions.length}`);
if (questions.filter((question) => question.imageAsset).length !== 10) throw new Error("圖片題未完整保留");
if (chapters.some((chapter) => chapter.blocks.some((block) => block.type === "term-card"))) throw new Error("章節不得複製完整詞卡");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(material, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ output: outputPath, version: material.version, chapters: chapters.length, glossaryTerms: glossaryTerms.length, categories: categories.length, questions: questions.length, imageQuestions: questions.filter((question) => question.imageAsset).length, questionBanks: questionBanks.length, sources: sourceLibrary.length, bytes: fs.statSync(outputPath).size }, null, 2));
