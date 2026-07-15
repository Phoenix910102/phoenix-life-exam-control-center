import { newId } from "@/lib/utils/id";
import {
  studyMaterialSchema,
  type StudyMaterial,
  type StudyMaterialChapter,
  type StudyMaterialFormat,
} from "@/types/studyMaterial";

const CHAPTER_LIMIT = 160;

function cleanTitle(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function uniqueTitles(values: string[]) {
  const seen = new Set<string>();
  return values
    .map(cleanTitle)
    .filter((title) => {
      const key = title.toLocaleLowerCase();
      if (!title || title.length > 120 || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, CHAPTER_LIMIT);
}

function makeChapters(titles: string[]): StudyMaterialChapter[] {
  const normalized = uniqueTitles(titles);
  const source = normalized.length > 0 ? normalized : ["整份教材"];
  return source.map((title, order) => ({
    id: newId("chapter"),
    title,
    order,
    progress: 0,
    completed: false,
  }));
}

function extractScriptChapterTitles(text: string) {
  const titles: string[] = [];
  const pattern = /id\s*:\s*["'](?:ch[\w-]*|review)["'][\s\S]{0,280}?title\s*:\s*["']([^"']+)["']/gi;
  for (const match of text.matchAll(pattern)) titles.push(match[1]);
  return titles;
}

function parseHtml(text: string, fallbackTitle: string) {
  const doc = new DOMParser().parseFromString(text, "text/html");
  const title = cleanTitle(doc.querySelector("title")?.textContent || doc.querySelector("h1")?.textContent || fallbackTitle);
  let chapters = uniqueTitles(
    Array.from(doc.querySelectorAll("main h1, main h2, article h1, article h2, section h1, section h2, h1, h2"))
      .map((node) => node.textContent || ""),
  );
  if (chapters.length <= 1) chapters = uniqueTitles([...chapters, ...extractScriptChapterTitles(text)]);
  return { title, chapters: makeChapters(chapters) };
}

function parseMarkdown(text: string, fallbackTitle: string) {
  const headings = [...text.matchAll(/^#{1,3}\s+(.+)$/gm)].map((match) => match[1]);
  return { title: cleanTitle(headings[0] || fallbackTitle), chapters: makeChapters(headings) };
}

function parseText(text: string, fallbackTitle: string) {
  const chapterLines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^(?:ch(?:apter)?\s*\d+|第[一二三四五六七八九十百\d]+章|單元\s*\d+)/i.test(line));
  return { title: cleanTitle(fallbackTitle), chapters: makeChapters(chapterLines) };
}

function parseJson(text: string, fallbackTitle: string) {
  const value = JSON.parse(text) as unknown;
  const record = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
  const rawChapters = Array.isArray(record?.chapters) ? record.chapters : Array.isArray(value) ? value : [];
  const titles = rawChapters.map((chapter, index) => {
    if (typeof chapter === "string") return chapter;
    if (chapter && typeof chapter === "object") {
      const item = chapter as Record<string, unknown>;
      return String(item.title ?? item.name ?? item.label ?? `單元 ${index + 1}`);
    }
    return `單元 ${index + 1}`;
  });
  return {
    title: cleanTitle(typeof record?.title === "string" ? record.title : fallbackTitle),
    chapters: makeChapters(titles),
  };
}

function extensionOf(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

export function detectMaterialFormat(file: Pick<File, "name" | "type">): StudyMaterialFormat {
  const ext = extensionOf(file.name);
  if (file.type === "application/pdf" || ext === "pdf") return "pdf";
  if (file.type === "text/html" || ext === "html" || ext === "htm") return "html";
  if (ext === "md" || ext === "markdown") return "markdown";
  if (file.type === "application/json" || ext === "json") return "json";
  return "text";
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("檔案讀取失敗"));
    reader.readAsDataURL(file);
  });
}

function readAsText(file: File) {
  if (typeof file.text === "function") return file.text();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("檔案讀取失敗"));
    reader.readAsText(file);
  });
}

export async function importStudyMaterial(file: File): Promise<StudyMaterial> {
  const format = detectMaterialFormat(file);
  const fallbackTitle = file.name.replace(/\.[^.]+$/, "") || "未命名教材";
  const now = new Date().toISOString();
  let sourceContent: string;
  let contentEncoding: "text" | "data-url";
  let parsed: { title: string; chapters: StudyMaterialChapter[] };

  if (format === "pdf") {
    sourceContent = await readAsDataUrl(file);
    contentEncoding = "data-url";
    parsed = { title: fallbackTitle, chapters: makeChapters(["整份教材"]) };
  } else {
    sourceContent = await readAsText(file);
    contentEncoding = "text";
    if (format === "html") parsed = parseHtml(sourceContent, fallbackTitle);
    else if (format === "markdown") parsed = parseMarkdown(sourceContent, fallbackTitle);
    else if (format === "json") parsed = parseJson(sourceContent, fallbackTitle);
    else parsed = parseText(sourceContent, fallbackTitle);
  }

  return studyMaterialSchema.parse({
    id: newId("material"),
    title: parsed.title || fallbackTitle,
    format,
    sourceFileName: file.name,
    mimeType: file.type || "application/octet-stream",
    sourceContent,
    contentEncoding,
    chapters: parsed.chapters,
    activeChapterId: parsed.chapters[0]?.id,
    progressPercent: 0,
    isActive: false,
    tags: [],
    createdAt: now,
    updatedAt: now,
  });
}

export function calculateMaterialProgress(chapters: StudyMaterialChapter[]) {
  if (chapters.length === 0) return 0;
  return Math.round(chapters.reduce((sum, chapter) => sum + chapter.progress, 0) / chapters.length);
}
