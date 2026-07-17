import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sourceDirectory = path.join(projectRoot, "tmp/pdfs/aiap-junior");
const outputPath = path.join(projectRoot, "src/lib/exams/aiapJuniorPastQuestions.ts");

const subjects = [
  {
    file: "subject1.html",
    code: "1",
    subject: "AIAP 初級 第一科",
    topic: "人工智慧基礎概論",
    source: "114 年第四次初級 AI 應用規劃師第一科公告試題",
  },
  {
    file: "subject2.html",
    code: "2",
    subject: "AIAP 初級 第二科",
    topic: "生成式 AI 應用與規劃",
    source: "114 年第四次初級 AI 應用規劃師第二科公告試題",
  },
];

function normalizeText(value) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([；，。？：])/g, "$1")
    .trim();
}

function parseQuestionText(text, questionNumber) {
  const optionMatches = [...text.matchAll(/\(([A-D])\)/g)];
  if (optionMatches.length !== 4) {
    throw new Error(`Question ${questionNumber} has ${optionMatches.length} options`);
  }

  const stem = normalizeText(text.slice(0, optionMatches[0].index));
  const options = optionMatches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = optionMatches[index + 1]?.index ?? text.length;
    return `${match[1]}. ${normalizeText(text.slice(start, end))}`;
  });

  if (!stem || options.some((option) => option.length <= 3)) {
    throw new Error(`Question ${questionNumber} contains empty text`);
  }

  return { stem, options };
}

async function parseSubject(config) {
  const html = await readFile(path.join(sourceDirectory, config.file), "utf8");
  const document = new JSDOM(html).window.document;
  const blocks = [...document.querySelectorAll("#page-container .c")];
  const numberBlocks = blocks.filter((block) => /^\d+\.$/.test(normalizeText(block.textContent ?? "")));

  return numberBlocks.map((numberBlock, index) => {
    const number = Number.parseInt(normalizeText(numberBlock.textContent ?? ""), 10);
    const blockIndex = blocks.indexOf(numberBlock);
    const nextBlockIndex = numberBlocks[index + 1] ? blocks.indexOf(numberBlocks[index + 1]) : blocks.length;
    const answer = normalizeText(blocks[blockIndex - 1]?.textContent ?? "");
    const questionText = blocks
      .slice(blockIndex + 1, nextBlockIndex)
      .filter((block) => block.classList.contains("xc"))
      .map((block) => normalizeText(block.textContent ?? ""))
      .join(" ");

    if (!/^[A-D]$/.test(answer)) {
      throw new Error(`${config.file} question ${number} has invalid answer: ${answer}`);
    }

    const { stem, options } = parseQuestionText(questionText, `${config.code}-${number}`);
    return {
      questionId: `aiap-junior-114-4-${config.code}-${String(number).padStart(3, "0")}`,
      subject: config.subject,
      topic: config.topic,
      type: "single",
      stem,
      options,
      answer,
      explanation: null,
      tags: ["AIAP", "初級", "114年第四次", "考古題", config.topic],
      difficulty: 3,
      source: config.source,
    };
  });
}

const questions = (await Promise.all(subjects.map(parseSubject))).flat();
const ids = new Set(questions.map((question) => question.questionId));

if (questions.length !== 100 || ids.size !== questions.length) {
  throw new Error(`Expected 100 unique questions, received ${questions.length} questions and ${ids.size} IDs`);
}

const output = `import type { Question } from "@/types/question";\n\nexport const aiapJuniorPastQuestions = ${JSON.stringify(questions, null, 2)} satisfies Question[];\n`;
await writeFile(outputPath, output, "utf8");
console.log(`Wrote ${questions.length} junior official questions to ${path.relative(projectRoot, outputPath)}`);
