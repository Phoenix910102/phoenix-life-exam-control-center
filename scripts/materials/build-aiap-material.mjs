import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { JSDOM } from "jsdom";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}

const htmlPath = args.get("--html");
const examBankPath = args.get("--exam-bank");
const outputPath = args.get("--output");

if (!htmlPath || !examBankPath || !outputPath) {
  throw new Error(
    "Usage: node scripts/materials/build-aiap-material.mjs --html <教材.html> --exam-bank <final_exam_bank.js> --output <教材包.json>",
  );
}

const clean = (value) => (value ?? "").replace(/\s+/g, " ").trim();
const stripLabel = (value, label) => clean(value).replace(new RegExp(`^${label}[：:]\\s*`, "i"), "");
const generatedAt = new Date().toISOString();

const html = fs.readFileSync(htmlPath, "utf8");
const document = new JSDOM(html).window.document;

const examContext = { window: {} };
vm.createContext(examContext);
vm.runInContext(fs.readFileSync(examBankPath, "utf8"), examContext);
const examBank = examContext.window.AIAP_FINAL_EXAM_BANK;
if (!Array.isArray(examBank)) throw new Error("找不到 AIAP_FINAL_EXAM_BANK");

const categoryChapterMap = new Map([
  ["00 基礎骨架", "ch-01"],
  ["01 學習型態", "ch-02"],
  ["01 任務類型", "ch-02"],
  ["02 資料處理", "ch-04"],
  ["03 訓練與驗證", "ch-06"],
  ["04 傳統模型", "ch-05"],
  ["05 評估指標", "ch-06"],
  ["06 深度學習", "ch-07"],
  ["07 LLM", "ch-07"],
  ["08 生成式 AI", "ch-08"],
  ["SP 微調與持續學習", "ch-08"],
  ["10 部署與壓縮", "ch-11"],
  ["10 MLOps", "ch-11"],
  ["11 治理與安全", "ch-12"],
  ["12 統計與分布", "ch-09"],
  ["13 大數據工程", "ch-10"],
  ["14 視覺化與分析工具", "ch-09"],
]);

const examChapterMap = new Map([
  ["ch03", "ch-02"],
  ["ch05", "ch-04"],
  ["ch06", "ch-05"],
  ["ch07", "ch-06"],
  ["ch08", "ch-07"],
  ["ch09-rag", "ch-08"],
  ["ch09-agent", "ch-08"],
  ["ch10", "ch-09"],
  ["ch11", "ch-10"],
  ["ch12", "ch-11"],
  ["ch13", "ch-12"],
]);

function parseTermCard(card) {
  const fields = [...card.querySelectorAll(".term-fields p")].map((node) => clean(node.textContent));
  const findField = (label) => stripLabel(fields.find((field) => field.startsWith(label)) ?? "未提供", label);
  const sourceLevel = card.dataset.level ?? "C級索引";
  const level = sourceLevel.startsWith("A") ? "core" : sourceLevel.startsWith("B") ? "frequent" : "index";
  const category = card.dataset.cat ?? "00 基礎骨架";

  return {
    chapterKey: categoryChapterMap.get(category) ?? "ch-01",
    block: {
      key: card.id,
      type: "term-card",
      term: clean(card.querySelector("h3")?.textContent),
      english: clean(card.querySelector(".en")?.textContent) || undefined,
      category,
      level,
      oneLiner: findField("一句話"),
      questionSignal: findField("判題信號"),
      application: findField("應用情況"),
      examExample: findField("考題例子"),
      confusion: findField("容易混"),
      importance: level === "core" ? "critical" : level === "frequent" ? "core" : "supporting",
      examWeight: level === "core" ? 8 : level === "frequent" ? 5 : 2,
      includeInQuickReview: level !== "index",
      estimatedMinutes: level === "core" ? 3 : 2,
    },
  };
}

const termsByChapter = new Map();
for (const card of document.querySelectorAll(".term-card")) {
  const { chapterKey, block } = parseTermCard(card);
  const terms = termsByChapter.get(chapterKey) ?? [];
  terms.push(block);
  termsByChapter.set(chapterKey, terms);
}

function parseTable(table, key, fallbackTitle) {
  const columns = [...table.querySelectorAll("thead th")].map((cell) => clean(cell.textContent));
  const rows = [...table.querySelectorAll("tbody tr")].map((row) =>
    [...row.querySelectorAll("td")].map((cell) => clean(cell.textContent)),
  );
  return {
    key,
    type: "comparison",
    title: fallbackTitle,
    columns,
    rows,
    importance: "critical",
    examWeight: 8,
    includeInQuickReview: true,
    estimatedMinutes: Math.max(4, rows.length),
  };
}

function parseNote(note, key) {
  const heading = clean(note.querySelector("h4")?.textContent || note.querySelector("b")?.textContent || "章節提示");
  const items = [...note.querySelectorAll("li")].map((item) => clean(item.textContent));
  let body = clean(note.textContent);
  if (body.startsWith(heading)) body = clean(body.slice(heading.length));

  if (items.length >= 2) {
    return {
      key,
      type: "flow",
      title: heading,
      steps: items,
      importance: note.classList.contains("accent") ? "critical" : "core",
      examWeight: note.classList.contains("accent") ? 8 : 5,
      includeInQuickReview: note.classList.contains("accent"),
      estimatedMinutes: Math.max(3, items.length),
    };
  }

  if (note.classList.contains("accent") && /一句|一行|總結|背|壓縮|五句/.test(heading)) {
    return {
      key,
      type: "memory",
      anchor: heading,
      explanation: body || heading,
      importance: "critical",
      examWeight: 9,
      includeInQuickReview: true,
      estimatedMinutes: 2,
    };
  }

  return {
    key,
    type: "callout",
    tone: note.classList.contains("dark") ? "warning" : note.classList.contains("accent") ? "important" : "info",
    title: heading,
    body: body || heading,
    importance: note.classList.contains("dark") ? "critical" : "core",
    examWeight: note.classList.contains("dark") ? 8 : 5,
    includeInQuickReview: !note.classList.contains("soft"),
    estimatedMinutes: 2,
  };
}

function parseChapterBody(chapterElement, chapterIndex) {
  const blocks = [];
  const body = chapterElement.querySelector(".chapter-body");
  if (!body) return blocks;

  [...body.children].forEach((child, childIndex) => {
    const keyPrefix = `section-${String(childIndex + 1).padStart(2, "0")}`;
    if (child.matches(":scope > p")) {
      blocks.push({
        key: keyPrefix,
        type: "concept",
        title: chapterIndex === 0 ? "教材使用方式" : "本章核心",
        body: clean(child.textContent),
        importance: "core",
        examWeight: 6,
        includeInQuickReview: true,
        estimatedMinutes: 3,
      });
      return;
    }
    if (child.matches(".table-wrap")) {
      blocks.push(parseTable(child.querySelector("table"), keyPrefix, "情境判斷與高頻陷阱"));
      return;
    }
    if (child.matches(".note")) {
      blocks.push(parseNote(child, keyPrefix));
      return;
    }
    if (child.matches(".qa-list")) {
      [...child.querySelectorAll("details")].forEach((detail, detailIndex) => {
        const prompt = clean(detail.querySelector("summary")?.textContent);
        let answer = clean(detail.textContent);
        if (answer.startsWith(prompt)) answer = clean(answer.slice(prompt.length));
        blocks.push({
          key: `practice-${String(detailIndex + 1).padStart(2, "0")}`,
          type: "example",
          prompt,
          reasoningSteps: ["先圈出題幹的任務、限制詞與錯誤成本", "再從本教材的判題信號選擇對應概念"],
          answer,
          importance: "core",
          examWeight: 7,
          includeInQuickReview: true,
          estimatedMinutes: 2,
        });
      });
    }
  });
  return blocks;
}

function quizQuestion(question) {
  const keys = Object.keys(question.choices).sort();
  return {
    question: clean(question.prompt),
    options: keys.map((key) => clean(question.choices[key])),
    answer: keys.indexOf(question.answer),
    explanation: clean(question.explanation),
    tags: [...new Set([question.subjectName, question.difficulty, ...(question.weaknessTags ?? [])])],
  };
}

const questionsByChapter = new Map();
let skippedImageQuestions = 0;
for (const question of examBank) {
  if (question.imageRef) {
    skippedImageQuestions += 1;
    continue;
  }
  const chapterKey = examChapterMap.get(question.chapterLinks?.[0]);
  if (!chapterKey) continue;
  const questions = questionsByChapter.get(chapterKey) ?? [];
  questions.push(quizQuestion(question));
  questionsByChapter.set(chapterKey, questions);
}

const chapterElements = [...document.querySelectorAll("section.chapter")];
const chapters = chapterElements.map((chapterElement, chapterIndex) => {
  const key = chapterElement.id;
  const title = clean(chapterElement.querySelector("h2")?.textContent);
  const summary = clean(chapterElement.querySelector(".subtitle")?.textContent) || title;
  const tags = [...chapterElement.querySelectorAll(".chapter-tags span")].map((tag) => clean(tag.textContent));
  const before = clean(chapterElements[chapterIndex - 1]?.querySelector("h2")?.textContent) || "AIAP 全科使用方式";
  const after = clean(chapterElements[chapterIndex + 1]?.querySelector("h2")?.textContent) || "整合複習與模擬作答";
  const contentBlocks = parseChapterBody(chapterElement, chapterIndex);
  const termBlocks = termsByChapter.get(key) ?? [];
  const questions = questionsByChapter.get(key) ?? [];
  const quizBlocks = [];
  for (let index = 0; index < questions.length; index += 8) {
    quizBlocks.push({
      key: `official-quiz-${String(index / 8 + 1).padStart(2, "0")}`,
      type: "quiz",
      title: `114 年第二梯次公告試題 ${index + 1}-${Math.min(index + 8, questions.length)}`,
      questions: questions.slice(index, index + 8),
      importance: "critical",
      examWeight: 10,
      includeInQuickReview: true,
      estimatedMinutes: Math.max(8, Math.ceil(questions.slice(index, index + 8).length * 1.5)),
    });
  }

  const blocks = [
    {
      key: "chapter-position",
      type: "position",
      category: tags.join(" / ") || "AIAP 中級",
      before,
      current: title,
      after,
      importance: "core",
      examWeight: 6,
      includeInQuickReview: true,
      estimatedMinutes: 2,
    },
    ...contentBlocks,
    ...termBlocks,
    ...quizBlocks,
  ];

  return {
    key,
    title,
    summary,
    estimatedMinutes: blocks.reduce((sum, block) => sum + (block.estimatedMinutes ?? 1), 0),
    objectives: [
      `掌握${tags.length ? tags.join("、") : "本章核心概念"}在 AIAP 題目中的位置與用途`,
      `能從題幹信號辨認本章概念，並排除常見混淆選項`,
      questions.length > 0 ? `完成 ${questions.length} 題可獨立作答的官方公告試題` : "用例題與高頻陷阱完成本章理解檢查",
    ],
    blocks,
  };
});

function sourceType(code, url) {
  if (/^[GE]\d+$/i.test(code)) return "official";
  if (/arxiv|doi\.org|pnas/i.test(url ?? "")) return "paper";
  if (/gov|nist|europa\.eu|oecd/i.test(url ?? "")) return "official";
  return "documentation";
}

const sources = [...document.querySelectorAll(".source-mini")].map((source, index) => {
  const code = clean(source.querySelector("b")?.textContent) || `source-${index + 1}`;
  const url = source.querySelector("a[href]")?.href;
  return {
    id: code.toLowerCase().replace(/[^a-z0-9-]/g, "-") || `source-${index + 1}`,
    title: clean(source.querySelector("strong")?.textContent),
    type: sourceType(code, url),
    ...(url ? { url } : {}),
    citation: clean(source.querySelector("p")?.textContent),
    accessedAt: generatedAt,
    freshness: sourceType(code, url) === "paper" ? "stable" : "review-needed",
  };
});

const coreBlockKeys = chapters
  .flatMap((chapter) => chapter.blocks)
  .filter((block) => block.includeInQuickReview && block.importance === "critical")
  .map((block) => block.key)
  .slice(0, 40);

const material = {
  schema: "phoenix.material.v1",
  slug: "aiap-intermediate-complete-guide",
  version: "1.0.0",
  title: "AIAP 中級：情境判題與應用全科戰役",
  description: clean(document.querySelector(".cover .lead")?.textContent),
  subject: "人工智慧技術應用與規劃 × 大數據處理分析與應用",
  exam: {
    name: "AI 應用規劃師",
    level: "中級",
    session: "114 年第二梯次公告試題整合版",
  },
  language: "zh-TW",
  tags: ["AIAP", "人工智慧", "大數據", "中級", "情境判題", "官方公告試題"],
  generatedAt,
  generator: {
    name: "Phoenix AIAP Material Converter",
    version: "1.0.0",
  },
  presentation: {
    layout: "immersive-academy",
    theme: "neural-rose",
    shellTheme: "criminal-rose",
    readingTheme: "ivory-archive",
    defaultMode: "reading",
    availableModes: ["reading", "immersive", "night"],
    renderOrder: "authored",
    modules: ["battlefield", "roadmap", "reader", "lesson", "duel", "diagnostic", "trap-field", "quiz", "achievements", "floating-console"],
    battlefield3d: {
      enabled: true,
      mapStyle: "neural-network",
      layout: "radial",
      seed: "aiap-intermediate-complete-guide-v1",
      cameraPreset: "war-room",
      environment: "neural-void",
      quality: "auto",
      allowCinematics: true,
    },
  },
  difficulty: "deep",
  prerequisites: [],
  sources,
  quickReview: {
    summary: "先判斷任務，再看資料、模型、指標、部署與治理；長題幹一律壓回輸入、輸出與錯誤成本。",
    coreBlockKeys,
    finalQuestionCount: examBank.length - skippedImageQuestions,
  },
  generationProfile: "phoenix-aiap-scenario-textbook-v1",
  chapters,
};

const allBlocks = chapters.flatMap((chapter) => chapter.blocks);
const allQuestions = allBlocks
  .filter((block) => block.type === "quiz")
  .flatMap((block) => block.questions);
const allKeys = chapters.flatMap((chapter) => chapter.blocks.map((block) => `${chapter.key}:${block.key}`));
if (new Set(allKeys).size !== allKeys.length) throw new Error("教材包含重複 block key");
if (allQuestions.some((question) => question.answer < 0 || question.answer >= question.options.length)) {
  throw new Error("教材包含超出選項範圍的答案");
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(material, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  output: outputPath,
  chapters: chapters.length,
  termCards: allBlocks.filter((block) => block.type === "term-card").length,
  quizQuestions: allQuestions.length,
  skippedImageQuestions,
  sources: sources.length,
  bytes: fs.statSync(outputPath).size,
}, null, 2));
