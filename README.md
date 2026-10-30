# BioMotion｜生物視界

以使用者提供的高中生物教材為範圍，製作可控制進度的 2D 互動圖解。

第一個單元為光合作用：光反應、卡爾文循環、兩種反應的連結。

## 使用與開發

無需安裝套件或建置。以 HTTP 伺服器提供 dist，例如：

```sh
python3 -m http.server 4173 --directory dist
```

開啟 http://localhost:4173。ES modules 不能以 file:// 直接開啟。

```sh
node --test tests/*.test.mjs
```

## 功能

- 播放／暫停、前後步驟、跳至指定步驟、進度拖曳、0.5–2 倍速。
- 知識深度與文字詳細程度獨立設定。
- 點選 SVG 構造與文字定位；鍵盤可操作互動物件。
- 縮放、橫向檢視、可收合解說，支援手機版面。
- 教材來源與疑義說明。

## 專案結構

- `dist/content.js`：教材文案、步驟、物件說明與來源。
- `dist/scenes.js`：各主題的獨立 SVG 繪圖；輸入步驟、階段進度、深度，輸出確定的畫面。
- `dist/app.js`：共用播放與操作介面。
- `dist/style.css`：響應式版面。
- `docs/content-audit.md`：教材邊界、查核及後續範圍。
- `.github/workflows/pages.yml`：測試後將 dist 發布至 GitHub Pages。

新增單元時先定義教材步驟與來源，再加入對應場景，不要求所有單元共用同一種動畫。靜態網站目前無帳號、後端或進度同步。

## 公開網站

預期網址為 https://harrylin0312.github.io/BioMotion/ 。只有 Pages 部署成功才代表網址已上線。

工作流程會嘗試啟用 Pages；若首次部署因權限失敗，請由儲存庫擁有者在 Settings → Pages → Source 選擇 GitHub Actions，再重新執行工作流程。

原始課本照片與個人手寫圖片未上傳；網站使用重新繪製的向量教學示意及整理後的說明。
