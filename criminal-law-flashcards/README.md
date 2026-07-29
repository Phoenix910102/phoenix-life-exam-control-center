# 刑法考點星圖 111–114

司律一試刑法互動式詞卡與 114 年真題練習網站，收錄 397 張濃縮詞卡、18 個模組、熟練度、錯題、收藏、搜尋、到期複習與本機進度保存。

## 直接執行

此目錄的 `index.html` 會在 HTTP 環境中自動載入並重組完整網站：

```bash
cd criminal-law-flashcards
python3 -m http.server 8000
```

瀏覽器開啟 `http://localhost:8000/`。

## 重建原始單檔 HTML

不想透過 HTTP 執行時，可用 Python 標準函式庫重建原始離線檔：

```bash
cd criminal-law-flashcards
python3 rebuild.py
```

完成後直接開啟 `刑法考點星圖_111-114.html`。腳本會先驗證分段資料與重建檔案的 SHA-256；任一段異常就會停止，不會輸出損壞檔案。

## 完整性

| 項目 | 數值 |
|---|---:|
| 原始 HTML | 264,998 bytes |
| 原始 HTML SHA-256 | `3edd9601f5aef72c91f7bf8aec8322ea373f7c1a332eb7f6ac53969cdd2da25c` |
| Payload 段數 | 9 |
| Payload SHA-256 | `4110aaae6eb5ff6b485cfaf5361f23170bb0982a6d6f132a89bbf753fb8c50af` |

## 為何使用分段 Payload

本次透過 GitHub 文字檔連線上傳；為保留 264 KB 單檔網站的每一個位元，先以 gzip 壓縮、Base64 編碼並分成 9 個純文字檔。`index.html` 會在瀏覽器中自動解碼，`rebuild.py` 則可重建並驗證與原檔完全相同的 HTML。

## 資料保存

詞卡熟練度、錯題、收藏與作答紀錄儲存在瀏覽器 LocalStorage。清除網站資料或改用其他瀏覽器前，請先在網站的「來源與設定」匯出 JSON 備份。
