import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { JSDOM } from "jsdom";

const root = process.cwd();
const legacyRoot = path.join(root, "materials/legacy/aiap-original");
const currentPath = path.join(root, "materials/generated/aiap-intermediate-complete-guide.phoenix-material.json");

const htmlFiles = [
  "aiap-battle-rose.html",
  "aiap-hyperlinked-glossary.html",
  "aiap-chapter-progress.html",
  "aiap-progress-fixed.html",
];

function loadBank(file, globalName) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(legacyRoot, "quiz", file), "utf8"), context);
  const value = context.window[globalName];
  if (!Array.isArray(value)) throw new Error(`${file} did not expose ${globalName}`);
  return value;
}

function inspectHtml(file) {
  const document = new JSDOM(fs.readFileSync(path.join(legacyRoot, file), "utf8")).window.document;
  const terms = [...document.querySelectorAll(".term-card")];
  const categories = [...new Set(terms.map((term) => term.dataset.cat).filter(Boolean))];
  const levels = { A: 0, B: 0, C: 0 };
  for (const term of terms) {
    const level = term.dataset.level?.slice(0, 1);
    if (level in levels) levels[level] += 1;
  }
  return {
    file,
    chapters: document.querySelectorAll("section.chapter").length,
    terms: terms.length,
    levels,
    categories,
    sources: document.querySelectorAll(".source-mini").length,
  };
}

const html = htmlFiles.map(inspectHtml);
const boss = loadBank("boss_quiz_bank.js", "AIAP_BOSS_QUIZ_BANK");
const final = loadBank("final_exam_bank.js", "AIAP_FINAL_EXAM_BANK");
const bossQuestions = boss.flatMap((chapter) => chapter.questions ?? []);
const allQuestions = [...bossQuestions, ...final];
const current = JSON.parse(fs.readFileSync(currentPath, "utf8"));
const currentBlocks = current.chapters.flatMap((chapter) => chapter.blocks);
const currentQuestions = currentBlocks.flatMap((block) => block.type === "quiz" ? block.questions : []);
const source = html[0];

const audit = {
  generatedAt: new Date().toISOString(),
  originals: {
    snapshots: html,
    canonical: source.file,
    chapters: source.chapters,
    glossaryTerms: source.terms,
    glossaryLevels: source.levels,
    glossaryCategories: source.categories.length,
    categoryNames: source.categories,
    bossBanks: boss.length,
    bossQuestions: bossQuestions.length,
    finalQuestions: final.length,
    totalQuestions: allQuestions.length,
    imageQuestions: allQuestions.filter((question) => question.imageRef).length,
    sources: source.sources,
  },
  currentPackage: {
    version: current.version,
    chapters: current.chapters.length,
    termCards: currentBlocks.filter((block) => block.type === "term-card").length,
    quizQuestions: currentQuestions.length,
    imageQuestions: currentQuestions.filter((question) => question.imageAsset).length,
    sources: current.sources?.length ?? 0,
  },
  findings: {
    missingGlossaryTerms: Math.max(0, source.terms - currentBlocks.filter((block) => block.type === "term-card").length),
    duplicatedGlossaryStorage: currentBlocks.filter((block) => block.type === "term-card").length,
    missingQuestions: Math.max(0, allQuestions.length - currentQuestions.length),
    missingImageQuestions: allQuestions.filter((question) => question.imageRef).length,
    unmappedBossQuestions: bossQuestions.length,
    notes: [
      "The v1 package duplicates every glossary term inside chapter blocks.",
      "The v1 converter skips every question with imageRef.",
      "The v1 package only maps the final exam bank and does not preserve the boss-bank grouping.",
      "Glossary category, chapter, question, related-term, and source relationships are flattened or absent.",
    ],
  },
};

const output = path.join(root, "docs/aiap-content-audit-v1.json");
fs.writeFileSync(output, `${JSON.stringify(audit, null, 2)}\n`);
console.log(JSON.stringify({ output, ...audit }, null, 2));
