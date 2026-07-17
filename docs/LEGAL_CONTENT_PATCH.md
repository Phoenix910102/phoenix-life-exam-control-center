# Phoenix Legal Content Patch

`phoenix.content-patch.v1` 是司律題目與教材的增量交接格式。它讓 Chat 只提交新增或修訂的內容，不需要重建整份教材，也不會直接覆蓋個人作答、錯題或進度。

## 固定流程

1. 在 Chat 指定科目、目標資源與這次要新增或修訂的範圍。
2. Chat 只輸出一份 `phoenix.content-patch.v1` JSON。
3. 在 `/law/content-inbox` 貼上或選取檔案。
4. 收件匣檢查 schema、來源、穩定 key、答案引用與 Patch 內衝突。
5. Phoenix 查看差異後，匯出成待審 Patch。
6. 待審內容通過人工確認後，才由後續發布服務寫入正式題庫或教材版本。

## 不可破壞的規則

- 題目、教材區塊、名詞與來源都使用穩定 key。
- 官方題必須有 `sourceRefs`。
- AI 生成題只能先進入 `draft` 或 `machine-checked`，不能直接標成已人工審核或已發布。
- 修訂與退役操作必須帶 `expectedContentHash`，避免覆蓋後來的版本。
- 答案更正使用新的 answer revision，不覆寫歷史答案。
- 個人進度與正式內容分開保存；內容 Patch 不攜帶使用者作答紀錄。
- 同一 Patch 對同一資源重複操作時，收件匣必須標示衝突。

## Chat 請求範本

```text
請只替 Phoenix 司律系統製作一份增量內容 Patch，不要重做整份教材。

目標科目：刑法
目標教材：criminal-law-general-principles
基準版本：1.0.0
本次工作：新增 112 年司律一試刑法第 18 題，並連結到犯罪成立三階層章節。

要求：
1. 輸出合法的 phoenix.content-patch.v1 JSON。
2. 使用穩定的小寫 key。
3. 官方題附來源與答案版本。
4. 只列出這次新增或修訂的 operations。
5. 不包含個人進度、作答紀錄或整份教材內容。
6. 最終只輸出 JSON，不加 Markdown code fence。
```

## 目前完成範圍

第一階段已完成：

- Patch schema 與型別。
- JSON 解析與欄位錯誤路徑。
- 來源與發布閘門。
- Patch 內重複資源衝突偵測。
- 黑金罪責玫瑰收件匣。
- 羊皮紙差異預覽。
- 本機草稿保存與待審 Patch 匯出。

收件匣目前不會直接套用正式內容。這是刻意的安全邊界；後續 Apply/Publish 階段必須加入基準 hash 比對、完整差異確認、備份與可回滾版本提交。
