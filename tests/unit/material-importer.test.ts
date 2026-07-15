import { describe, expect, it } from "vitest";
import { calculateMaterialProgress, detectMaterialFormat, importStudyMaterial } from "@/lib/materials/importer";

describe("study material importer", () => {
  it("detects supported formats", () => {
    expect(detectMaterialFormat({ name: "book.html", type: "text/html" })).toBe("html");
    expect(detectMaterialFormat({ name: "paper.pdf", type: "application/pdf" })).toBe("pdf");
    expect(detectMaterialFormat({ name: "notes.md", type: "text/plain" })).toBe("markdown");
  });

  it("extracts headings from regular and data-driven HTML", async () => {
    const source = `<!doctype html><html><head><title>刑法教材</title></head><body>
      <h1>罪責之骨</h1>
      <script>window.CRL_DATA={chapters:[
        {id:"ch00",title:"刑法總則地圖"},
        {id:"ch01",title:"犯罪成立三階層"}
      ]}</script>
    </body></html>`;
    const material = await importStudyMaterial(new File([source], "preview.html", { type: "text/html" }));

    expect(material.title).toBe("刑法教材");
    expect(material.chapters.map((chapter) => chapter.title)).toEqual([
      "罪責之骨",
      "刑法總則地圖",
      "犯罪成立三階層",
    ]);
  });

  it("calculates average chapter progress", () => {
    expect(
      calculateMaterialProgress([
        { id: "a", title: "A", order: 0, progress: 100, completed: true },
        { id: "b", title: "B", order: 1, progress: 50, completed: false },
      ]),
    ).toBe(75);
  });
});
