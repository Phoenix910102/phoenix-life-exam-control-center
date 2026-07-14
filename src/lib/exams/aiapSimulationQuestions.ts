import type { Question } from "@/types/question";

export const aiapSimulationQuestions = [
  {
    "questionId": "aiap-sim-1-001",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "某零售企業希望分析顧客在商品評論中對品牌的正負面態度，並即時偵測抱怨升高的商品。若採用情感分析（Sentiment Analysis），其主要輸出最接近下列何者？",
    "options": [
      "A. 評論自動翻譯後的目標語言文本",
      "B. 每則評論所屬的語言種類",
      "C. 顧客下一次購買的確切金額",
      "D. 評論中表達的情緒或情感傾向"
    ],
    "answer": "D",
    "explanation": "考點：NLP：情感分析",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型",
      "NLP：情感分析"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-002",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "某金融公司導入 Transformer 處理長篇合約摘要，發現比傳統 RNN 更能保留前後文關係。其主要原因為何？",
    "options": [
      "A. 卷積核會逐像素掃描文字並產生邊界框",
      "B. 自注意力機制可同時衡量序列中不同位置之間的重要性",
      "C. K-means 會先將句子分群再生成摘要",
      "D. 決策樹會自動建立語法剖析規則"
    ],
    "answer": "B",
    "explanation": "考點：Transformer／Self-Attention",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型",
      "Transformer／Self-Attention"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-003",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "在 BERT 預訓練中，遮罩語言模型（MLM）的核心做法為何？",
    "options": [
      "A. 將影像與文字對應到同一向量空間",
      "B. 隨機遮住部分詞，利用雙向上下文預測被遮住的詞",
      "C. 透過生成器與鑑別器互相對抗產生文本",
      "D. 只根據左側文字逐字生成下一個詞"
    ],
    "answer": "B",
    "explanation": "考點：BERT／MLM",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型",
      "BERT／MLM"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-004",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "企業內部客服機器人常回答過期政策。若公司已有最新 FAQ 與規章文件，且希望降低幻覺並讓模型依據最新文件作答，最適合優先採用何種架構？",
    "options": [
      "A. 改用 K-means 將顧客分群",
      "B. 使用 RAG，先檢索相關文件再交由語言模型生成答案",
      "C. 把所有資料先做 Min-Max 正規化",
      "D. 僅增加模型溫度以提升生成多樣性"
    ],
    "answer": "B",
    "explanation": "考點：RAG／幻覺降低",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型",
      "RAG／幻覺降低"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-005",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "某團隊希望讓大型語言模型依照固定格式輸出合約風險表，並提供三個範例給模型參考。此做法最接近下列何者？",
    "options": [
      "A. 資料庫正規化",
      "B. Few-shot Prompting",
      "C. 梯度裁剪",
      "D. 同態加密"
    ],
    "answer": "B",
    "explanation": "考點：Prompt Engineering",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型",
      "Prompt Engineering"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-006",
    "subject": "AIAP 中級 第一科",
    "topic": "AI 治理與安全",
    "type": "single",
    "stem": "生成式 AI 系統被要求回答法律與醫療相關問題。若要降低錯誤內容造成風險，下列哪一組控管最適合？",
    "options": [
      "A. 將所有使用者輸入直接存入訓練集",
      "B. 只使用更大的字型呈現結果",
      "C. 加入權威知識檢索、來源標註、人工審核與高風險拒答規則",
      "D. 提高輸出創意並關閉引用來源"
    ],
    "answer": "C",
    "explanation": "考點：GenAI 風險控管",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "AI 治理與安全",
      "GenAI 風險控管"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-007",
    "subject": "AIAP 中級 第一科",
    "topic": "電腦視覺與多模態",
    "type": "single",
    "stem": "影像分類模型使用 CNN 的主要理由是什麼？",
    "options": [
      "A. CNN 只能處理純文字序列，不適合影像",
      "B. CNN 專門處理交易 ACID 一致性",
      "C. CNN 會自動把類別資料轉成 One-Hot 編碼",
      "D. CNN 的卷積層擅長擷取局部空間特徵並保留影像結構"
    ],
    "answer": "D",
    "explanation": "考點：CNN／卷積",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "電腦視覺與多模態",
      "CNN／卷積"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-008",
    "subject": "AIAP 中級 第一科",
    "topic": "電腦視覺與多模態",
    "type": "single",
    "stem": "物件偵測任務以 mAP 評估模型，若 IoU 閾值提高，代表評估時更重視哪一項？",
    "options": [
      "A. 預測框與真實框的重疊程度必須更高",
      "B. 模型輸出文字的語意連貫性",
      "C. 分群中心是否固定為三群",
      "D. 資料庫交易是否完全成功"
    ],
    "answer": "A",
    "explanation": "考點：Object Detection／IoU／mAP",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "電腦視覺與多模態",
      "Object Detection／IoU／mAP"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-009",
    "subject": "AIAP 中級 第一科",
    "topic": "電腦視覺與多模態",
    "type": "single",
    "stem": "自駕車系統需判斷影像中每個像素屬於道路、天空、行人或車輛，但不需要分辨每一位行人是不同個體。此任務最接近下列何者？",
    "options": [
      "A. 情感分析（Sentiment Analysis）",
      "B. 實例分割（Instance Segmentation）",
      "C. 語意分割（Semantic Segmentation）",
      "D. 主題模型（Topic Modeling）"
    ],
    "answer": "C",
    "explanation": "考點：影像分割",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "電腦視覺與多模態",
      "影像分割"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-010",
    "subject": "AIAP 中級 第一科",
    "topic": "電腦視覺與多模態",
    "type": "single",
    "stem": "某媒體公司希望輸入文字查詢後找出語意相符的圖片，並支援零樣本影像分類。下列何者最符合 CLIP 的核心概念？",
    "options": [
      "A. 以對比學習將影像與文字投影到可比較的共同向量空間",
      "B. 以 TF-IDF 計算影像像素頻率",
      "C. 以 DBSCAN 強制指定圖片分成 K 群",
      "D. 以 ARIMA 預測圖片每日觀看量"
    ],
    "answer": "A",
    "explanation": "考點：CLIP／多模態",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "電腦視覺與多模態",
      "CLIP／多模態"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-011",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "Word2Vec 訓練時，若希望由中心詞預測周圍上下文，常見方法為何？",
    "options": [
      "A. Skip-gram",
      "B. Min-Max Scaling",
      "C. Box-Cox 轉換",
      "D. CBOW"
    ],
    "answer": "A",
    "explanation": "考點：Word2Vec：Skip-gram",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型",
      "Word2Vec：Skip-gram"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-012",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "某公司用 TF-IDF 分析客服長文本，發現長篇文件中常見詞權重偏高，難以精準代表關鍵概念。此問題較可能與下列何者有關？",
    "options": [
      "A. IDF 會讓所有詞權重完全相同",
      "B. 詞頻在長文本中容易被放大，需注意文本長度與正規化處理",
      "C. TF-IDF 只能處理圖片，不能處理文字",
      "D. TF-IDF 必須使用 GPU 才能計算"
    ],
    "answer": "B",
    "explanation": "考點：TF-IDF 限制",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型",
      "TF-IDF 限制"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-013",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "N-gram 語言模型生成句子時常出現局部片段合理、整體不連貫。最主要限制為何？",
    "options": [
      "A. 只依固定長度前文估計機率，難捕捉長距離依賴",
      "B. 會強制所有詞語具有相同權重",
      "C. 只適用於加密資料庫查詢",
      "D. 需要先計算影像邊界框"
    ],
    "answer": "A",
    "explanation": "考點：N-gram／長距離依賴",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型",
      "N-gram／長距離依賴"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-014",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "相較於一般 RNN，LSTM 或 GRU 在長序列任務中常較穩定，主因為何？",
    "options": [
      "A. 以卷積核取代所有文字向量",
      "B. 只能輸出二元分類結果",
      "C. 完全不需要訓練資料",
      "D. 以門控機制調節資訊保留與遺忘，緩解長距離依賴與梯度消失問題"
    ],
    "answer": "D",
    "explanation": "考點：LSTM／GRU／梯度消失",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型",
      "LSTM／GRU／梯度消失"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-015",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "下列哪一種情境最適合序列到序列（Seq2Seq）模型？",
    "options": [
      "A. 計算連續變數的四分位距",
      "B. 將顧客資料以 DBSCAN 分群",
      "C. 計算交易是否符合 ACID",
      "D. 把英文句子翻譯成中文句子"
    ],
    "answer": "D",
    "explanation": "考點：Seq2Seq",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型",
      "Seq2Seq"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-016",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "多分類模型最後一層常用 Softmax，其主要作用為何？",
    "options": [
      "A. 將文字切成固定長度 N-gram",
      "B. 只保留局部區域最大特徵值",
      "C. 對資料庫交易加上數位簽章",
      "D. 把多個類別分數轉成總和為 1 的機率分布"
    ],
    "answer": "D",
    "explanation": "考點：Softmax",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "模型訓練與評估",
      "Softmax"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-017",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "CNN 中的 Max-Pooling 主要效果為何？",
    "options": [
      "A. 讓生成器與鑑別器互相對抗",
      "B. 計算資料點離平均值幾個標準差",
      "C. 將輸出轉成所有類別機率總和為 1",
      "D. 在局部區域取最大值以降低特徵圖尺寸並保留顯著特徵"
    ],
    "answer": "D",
    "explanation": "考點：Max-Pooling",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "模型訓練與評估",
      "Max-Pooling"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-018",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "GAN 生成的人臉樣本看起來都很相似，缺乏多樣性，最可能是下列何種問題？",
    "options": [
      "A. 資料庫原子性失效",
      "B. Z 分數過低",
      "C. CDF 無法積分",
      "D. 模式崩潰（Mode Collapse）"
    ],
    "answer": "D",
    "explanation": "考點：GAN／Mode Collapse",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "模型訓練與評估",
      "GAN／Mode Collapse"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-019",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "VAE 與一般自編碼器相比，較明顯的生成式特徵為何？",
    "options": [
      "A. 只能做硬分群，不能重建資料",
      "B. 學習潛在空間的機率分布，使模型可從潛在空間取樣生成資料",
      "C. 完全不需要損失函數",
      "D. 只記錄每筆交易是否成功送出"
    ],
    "answer": "B",
    "explanation": "考點：VAE／潛在空間",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "模型訓練與評估",
      "VAE／潛在空間"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-020",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "擴散模型（Diffusion Model）生成影像的核心流程最接近下列何者？",
    "options": [
      "A. 從雜訊開始逐步去噪，學習還原資料分布",
      "B. 以 TF-IDF 將所有像素轉成詞頻",
      "C. 將資料庫交易拆成多個不可回復步驟",
      "D. 直接以 K-means 找出固定群中心"
    ],
    "answer": "A",
    "explanation": "考點：Diffusion／去噪",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "模型訓練與評估",
      "Diffusion／去噪"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-021",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "Latent Diffusion Model（LDM）相較於在像素空間直接擴散，主要優勢為何？",
    "options": [
      "A. 在壓縮後的潛在空間進行擴散，可降低計算成本並保留語意結構",
      "B. 只適用於表格資料的分箱",
      "C. 會完全避免所有生成偏差與幻覺",
      "D. 以交易日誌取代影像特徵"
    ],
    "answer": "A",
    "explanation": "考點：LDM／潛在空間",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "模型訓練與評估",
      "LDM／潛在空間"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-022",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "資料增強後模型表現反而下降，下列哪一項原因與改善方向最合理？",
    "options": [
      "A. 將所有增強樣本改成未標記資料即可",
      "B. 只要把學習率調到 1 即可解決",
      "C. 資料增強必然造成模型無法收斂，因此應永久停用",
      "D. 增強樣本破壞原始語意或分布，應檢查增強策略是否仍符合任務標籤"
    ],
    "answer": "D",
    "explanation": "考點：Data Augmentation",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "模型訓練與評估",
      "Data Augmentation"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-023",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "低資源語言只有少量標註語料，若要建立分類模型並降低過擬合風險，較適合採用何種策略？",
    "options": [
      "A. 從零開始訓練一個更深的模型且不做驗證",
      "B. 刪除所有語料中的罕見詞",
      "C. 改用 ACID 交易隔離級別處理文字",
      "D. 使用大型預訓練模型做遷移學習／微調，並搭配正則化與資料增強"
    ],
    "answer": "D",
    "explanation": "考點：低資源／Transfer Learning",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "模型訓練與評估",
      "低資源／Transfer Learning"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-024",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "模型在訓練集準確率很高，但驗證集表現明顯較差。下列哪一項最能降低此問題？",
    "options": [
      "A. 只回報訓練集分數",
      "B. 正則化、交叉驗證、早停或增加具代表性的資料",
      "C. 提高模型複雜度並刪除驗證流程",
      "D. 把測試集加入訓練集反覆調參"
    ],
    "answer": "B",
    "explanation": "考點：Overfitting／泛化",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "模型訓練與評估",
      "Overfitting／泛化"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-025",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "若團隊在同一份 K-Fold 交叉驗證結果上反覆挑選超參數，最後又用該分數當作最終泛化能力估計，主要風險為何？",
    "options": [
      "A. 模型完全無法學習任何特徵",
      "B. 所有類別標籤都會變成連續變數",
      "C. 對驗證資料過度調整而高估模型表現，應另留測試集或使用巢狀交叉驗證",
      "D. 資料庫將失去持久性"
    ],
    "answer": "C",
    "explanation": "考點：Hyperparameter Tuning／Nested CV",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "模型訓練與評估",
      "Hyperparameter Tuning／Nested CV"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-026",
    "subject": "AIAP 中級 第一科",
    "topic": "MLOps 與部署監控",
    "type": "single",
    "stem": "MLOps 中的 Model Registry 最主要用途為何？",
    "options": [
      "A. 管理模型版本、狀態、指標與部署紀錄",
      "B. 把 PDF 轉成 CDF",
      "C. 取代所有資料清理流程",
      "D. 計算影像 IoU"
    ],
    "answer": "A",
    "explanation": "考點：MLOps／Model Registry",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "MLOps 與部署監控",
      "MLOps／Model Registry"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-027",
    "subject": "AIAP 中級 第一科",
    "topic": "MLOps 與部署監控",
    "type": "single",
    "stem": "AI 團隊導入 CI 流程，下列哪一項最符合持續整合精神？",
    "options": [
      "A. 手動複製模型檔並覆蓋生產環境",
      "B. 刪除版本紀錄以避免混淆",
      "C. 只有正式上線後才第一次測試",
      "D. 每次程式或模型管線更新後自動執行測試、資料檢查與建置流程"
    ],
    "answer": "D",
    "explanation": "考點：MLOps／CI",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "MLOps 與部署監控",
      "MLOps／CI"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-028",
    "subject": "AIAP 中級 第一科",
    "topic": "MLOps 與部署監控",
    "type": "single",
    "stem": "顧客流失模型上線半年後，輸入特徵分布與訓練期不同，例如用戶使用 App 的頻率整體下降。此現象最接近下列何者？",
    "options": [
      "A. 資料漂移（Data Drift）",
      "B. 遮罩語言模型",
      "C. 資料庫原子性",
      "D. 圖片超解析"
    ],
    "answer": "A",
    "explanation": "考點：Data Drift",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "MLOps 與部署監控",
      "Data Drift"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-029",
    "subject": "AIAP 中級 第一科",
    "topic": "MLOps 與部署監控",
    "type": "single",
    "stem": "若實際顧客流失定義改變，或市場環境使同樣行為對流失機率的意義改變，較接近哪一種問題？",
    "options": [
      "A. 概念漂移（Concept Drift）",
      "B. IoU 閾值提高",
      "C. One-Hot 維度爆炸",
      "D. 文字斷詞失敗"
    ],
    "answer": "A",
    "explanation": "考點：Concept Drift",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "MLOps 與部署監控",
      "Concept Drift"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-030",
    "subject": "AIAP 中級 第一科",
    "topic": "MLOps 與部署監控",
    "type": "single",
    "stem": "模型已上線，系統沒有報錯，但預測品質逐漸下降。下列哪一項監控最能及早發現問題？",
    "options": [
      "A. 只監控伺服器背景顏色是否變更",
      "B. 只記錄模型檔案名稱，不保存任何指標",
      "C. 完全關閉日誌以降低成本",
      "D. 同時監控輸入特徵分布、預測分布、延遲與可取得標籤後的效能指標"
    ],
    "answer": "D",
    "explanation": "考點：Model Monitoring",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "MLOps 與部署監控",
      "Model Monitoring"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-031",
    "subject": "AIAP 中級 第一科",
    "topic": "MLOps 與部署監控",
    "type": "single",
    "stem": "醫院導入 AI 輔助診斷系統，為降低臨床風險與收集回饋，最合適的上線策略為何？",
    "options": [
      "A. 只在測試環境展示，不建立回饋流程",
      "B. 先在小範圍科別或低風險流程試行，逐步擴大並持續監控",
      "C. 全院一次性強制替代醫師判斷",
      "D. 不保留任何人工覆核機制"
    ],
    "answer": "B",
    "explanation": "考點：Phased Rollout",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "MLOps 與部署監控",
      "Phased Rollout"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-032",
    "subject": "AIAP 中級 第一科",
    "topic": "MLOps 與部署監控",
    "type": "single",
    "stem": "Kubernetes 在 AI 模型服務部署中最核心的功能為何？",
    "options": [
      "A. 直接提升模型訓練資料品質",
      "B. 管理容器化服務的部署、擴縮、故障恢復與資源調度",
      "C. 自動生成所有訓練標籤",
      "D. 計算語句情感分數"
    ],
    "answer": "B",
    "explanation": "考點：Kubernetes／部署",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "MLOps 與部署監控",
      "Kubernetes／部署"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-033",
    "subject": "AIAP 中級 第一科",
    "topic": "MLOps 與部署監控",
    "type": "single",
    "stem": "某 AI 推論服務需承受高流量並避免單點故障，下列架構較合適？",
    "options": [
      "A. 負載平衡、多副本部署、自動擴縮與健康檢查",
      "B. 單一伺服器手動重啟即可",
      "C. 把所有請求寫入 Word 文件後人工處理",
      "D. 關閉監控以降低延遲"
    ],
    "answer": "A",
    "explanation": "考點：高可用架構",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "MLOps 與部署監控",
      "高可用架構"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-034",
    "subject": "AIAP 中級 第一科",
    "topic": "AI 治理與安全",
    "type": "single",
    "stem": "金融風控模型遭受對抗性攻擊，攻擊者對輸入做微小擾動便造成錯判。下列哪一項屬於提升模型魯棒性的合理方向？",
    "options": [
      "A. 刪除所有驗證資料",
      "B. 只把輸出字體加粗",
      "C. 對抗訓練、輸入檢測、模型校準與異常監控",
      "D. 提高資料庫欄位長度"
    ],
    "answer": "C",
    "explanation": "考點：Adversarial Robustness",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "AI 治理與安全",
      "Adversarial Robustness"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-035",
    "subject": "AIAP 中級 第一科",
    "topic": "AI 治理與安全",
    "type": "single",
    "stem": "銀行需要解釋信用評分模型為何拒絕某申請。下列何者最適合作為模型解釋工具？",
    "options": [
      "A. CDF，用於累積機率",
      "B. ACID，用於資料庫交易",
      "C. SHAP 或 LIME，用於分析特徵對個別預測的貢獻",
      "D. Max-Pooling，用於取局部最大值"
    ],
    "answer": "C",
    "explanation": "考點：XAI／SHAP／LIME",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "AI 治理與安全",
      "XAI／SHAP／LIME"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-036",
    "subject": "AIAP 中級 第一科",
    "topic": "AI 治理與安全",
    "type": "single",
    "stem": "若模型在不同性別或族群的錯誤率明顯不一致，企業最應優先關注哪一類問題？",
    "options": [
      "A. 圖片解析度不足",
      "B. GPU 記憶體碎片",
      "C. 交易不可分割性",
      "D. 公平性與偏差評估"
    ],
    "answer": "D",
    "explanation": "考點：AI Fairness",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "AI 治理與安全",
      "AI Fairness"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-037",
    "subject": "AIAP 中級 第一科",
    "topic": "AI 治理與安全",
    "type": "single",
    "stem": "企業使用生成式 AI 產出行銷圖文，為降低著作權與資料來源風險，下列何者最合適？",
    "options": [
      "A. 建立授權資料來源紀錄、內容審核、相似度檢查與使用政策",
      "B. 只要輸出好看就不需要審核",
      "C. 要求模型隱藏所有來源資訊",
      "D. 將網路圖片任意抓取後直接訓練商用模型"
    ],
    "answer": "A",
    "explanation": "考點：GenAI 著作權風險",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "AI 治理與安全",
      "GenAI 著作權風險"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-038",
    "subject": "AIAP 中級 第一科",
    "topic": "AI 治理與安全",
    "type": "single",
    "stem": "金融交易系統要求不可否認性（Non-repudiation），主要是為了確保什麼？",
    "options": [
      "A. 模型一定不會過擬合",
      "B. 交易發起者事後不能否認曾執行該交易，通常需簽章、時間戳與稽核紀錄",
      "C. 所有圖片都能完成語意分割",
      "D. 資料一定會分成三群"
    ],
    "answer": "B",
    "explanation": "考點：資訊安全／不可否認性",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "AI 治理與安全",
      "資訊安全／不可否認性"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-039",
    "subject": "AIAP 中級 第一科",
    "topic": "電腦視覺與多模態",
    "type": "single",
    "stem": "多模態模型推論時缺少文本描述，只剩影像資料。若希望維持效能，下列哪一項策略較合理？",
    "options": [
      "A. 訓練時納入模態缺失情境，設計缺失模態處理或跨模態補全機制",
      "B. 要求 Softmax 自動補齊文字",
      "C. 直接刪除所有影像樣本",
      "D. 將影像檔名當成唯一標籤即可"
    ],
    "answer": "A",
    "explanation": "考點：Multimodal／模態缺失",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "電腦視覺與多模態",
      "Multimodal／模態缺失"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-040",
    "subject": "AIAP 中級 第一科",
    "topic": "人工智慧應用規劃",
    "type": "single",
    "stem": "多任務學習讓同一模型同時做文檔分類與欄位抽取，其主要好處較可能是什麼？",
    "options": [
      "A. 必然讓所有任務準確率達到 100%",
      "B. 只能用於影像，不可用於文字",
      "C. 共享表示可讓相關任務互相補強，但需注意任務衝突與權重平衡",
      "D. 不再需要資料標籤"
    ],
    "answer": "C",
    "explanation": "考點：Multi-task Learning",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "人工智慧應用規劃",
      "Multi-task Learning"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-041",
    "subject": "AIAP 中級 第一科",
    "topic": "MLOps 與部署監控",
    "type": "single",
    "stem": "若要把大型模型部署到邊緣裝置，且希望降低模型大小與推論延遲，下列哪一組技術較常見？",
    "options": [
      "A. 增加模型層數與參數量",
      "B. 提高輸出溫度並關閉快取",
      "C. 改用交易回滾機制",
      "D. 量化、剪枝、知識蒸餾"
    ],
    "answer": "D",
    "explanation": "考點：模型壓縮",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "MLOps 與部署監控",
      "模型壓縮"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-042",
    "subject": "AIAP 中級 第一科",
    "topic": "MLOps 與部署監控",
    "type": "single",
    "stem": "訓練大型語音模型時 GPU 記憶體不足，但不想更換硬體。下列何者最可能緩解記憶體壓力？",
    "options": [
      "A. 混合精度訓練、梯度累積或梯度檢查點",
      "B. 把 batch size 無限制提高",
      "C. 取消所有 checkpoint 並提高解析度",
      "D. 將標籤改成字串即可"
    ],
    "answer": "A",
    "explanation": "考點：訓練記憶體最佳化",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "MLOps 與部署監控",
      "訓練記憶體最佳化"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-043",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "使用 ARIMA 預測每週銷售量前，通常需注意時間序列是否具備哪一項性質或需做相應處理？",
    "options": [
      "A. 每筆資料都必須是圖片",
      "B. 所有資料點必須屬於同一群",
      "C. 平穩性，必要時進行差分",
      "D. 所有欄位必須為 One-Hot"
    ],
    "answer": "C",
    "explanation": "考點：ARIMA／平穩性",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "模型訓練與評估",
      "ARIMA／平穩性"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-044",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "PCA 用於影像分類前降維，最主要目的為何？",
    "options": [
      "A. 讓模型可以直接理解自然語言指令",
      "B. 將連續機率轉成資料庫交易",
      "C. 以線性組合保留主要變異方向，降低維度與雜訊",
      "D. 隨機產生更多少數類樣本"
    ],
    "answer": "C",
    "explanation": "考點：PCA",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "模型訓練與評估",
      "PCA"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-045",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "KNN 與 K-means 最容易混淆。下列敘述何者正確？",
    "options": [
      "A. KNN 是監督式分類／回歸方法，K-means 是非監督式分群方法",
      "B. K-means 會根據鄰居投票決定新樣本類別",
      "C. 兩者都一定需要類別標籤才能訓練",
      "D. 兩者都只能用於文字生成"
    ],
    "answer": "A",
    "explanation": "考點：KNN vs K-means",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "模型訓練與評估",
      "KNN vs K-means"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-046",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "DBSCAN 用於高維顧客資料時效果變差，主要原因之一為何？",
    "options": [
      "A. DBSCAN 必須先知道正確群數 K",
      "B. DBSCAN 會自動產生語言摘要",
      "C. 高維空間中距離度量辨識度下降，eps 與密度概念變得難設定",
      "D. DBSCAN 只能處理有標籤資料"
    ],
    "answer": "C",
    "explanation": "考點：DBSCAN／高維限制",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "模型訓練與評估",
      "DBSCAN／高維限制"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-047",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "以自編碼器做設備異常偵測時，最常見的判斷依據為何？",
    "options": [
      "A. 異常資料的重建誤差通常較高",
      "B. 異常資料會使 CDF 變成負值",
      "C. 異常資料一定具有較低交易隔離性",
      "D. 異常資料的 Softmax 總和大於 1"
    ],
    "answer": "A",
    "explanation": "考點：Autoencoder／Anomaly Detection",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "模型訓練與評估",
      "Autoencoder／Anomaly Detection"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-048",
    "subject": "AIAP 中級 第一科",
    "topic": "AI 治理與安全",
    "type": "single",
    "stem": "多家醫院希望共同訓練診斷模型，但不願直接交換原始病患資料。下列何者較符合此需求？",
    "options": [
      "A. 聯邦學習（Federated Learning）",
      "B. Max-Pooling",
      "C. N-gram 平滑",
      "D. K-means 分群"
    ],
    "answer": "A",
    "explanation": "考點：Federated Learning",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "AI 治理與安全",
      "Federated Learning"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-049",
    "subject": "AIAP 中級 第一科",
    "topic": "電腦視覺與多模態",
    "type": "single",
    "stem": "工廠需要在機台端即時判斷故障，雲端往返延遲太高。下列何者最符合此需求？",
    "options": [
      "A. 只使用生成式 AI 寫故事",
      "B. 把所有資料手動輸入試算表",
      "C. 只在月底批次產生報表",
      "D. 邊緣 AI，在裝置或近端閘道進行低延遲推論"
    ],
    "answer": "D",
    "explanation": "考點：Edge AI",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "電腦視覺與多模態",
      "Edge AI"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-1-050",
    "subject": "AIAP 中級 第一科",
    "topic": "AI 治理與安全",
    "type": "single",
    "stem": "企業導入 Agentic AI 讓系統自動查資料、呼叫工具、整理報告。為降低錯誤行動風險，最重要的設計為何？",
    "options": [
      "A. 明確工具權限、步驟紀錄、人工覆核與失敗回復機制",
      "B. 取消所有日誌以避免模型緊張",
      "C. 讓代理可以任意刪除資料庫以提高自主性",
      "D. 把所有工具密鑰寫在公開提示詞中"
    ],
    "answer": "A",
    "explanation": "考點：Agentic AI／Guardrails",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "人工智慧技術應用與規劃",
      "AI 治理與安全",
      "Agentic AI／Guardrails"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目一（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-001",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "某交易金額的 Z 分數為 -1.5，最正確的意義為何？",
    "options": [
      "A. 該數值比平均值高 1.5 個標準差",
      "B. 該數值等於 -1.5 元",
      "C. 該數值一定是負數",
      "D. 該數值比平均值低 1.5 個標準差"
    ],
    "answer": "D",
    "explanation": "考點：Z-Score",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "統計基礎與機率分佈",
      "Z-Score"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-002",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "使用 pandas 處理 df 中的「交易金額」欄位，若要一次取得平均值、標準差、四分位數等敘述性統計，應使用哪一種語法？",
    "options": [
      "A. df['交易金額'].sort_values()",
      "B. df['交易金額'].describe()",
      "C. df['交易金額'].dropna()",
      "D. df['交易金額'].encode()"
    ],
    "answer": "B",
    "explanation": "考點：pandas describe",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "資料前處理與特徵工程",
      "pandas describe"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-003",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "某收入資料大多集中在低收入區，但少數高收入者把右尾拉長。此分布最可能為何？",
    "options": [
      "A. 左偏，Skewness < 0",
      "B. 無法計算任何偏態",
      "C. 完全對稱，Skewness = 0",
      "D. 右偏，Skewness > 0"
    ],
    "answer": "D",
    "explanation": "考點：Skewness",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "統計基礎與機率分佈",
      "Skewness"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-004",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "關於 PDF 與 CDF，下列敘述何者正確？",
    "options": [
      "A. CDF 一定會隨 x 增加而下降",
      "B. PDF 一定等於所有資料的平均值",
      "C. PDF 與 CDF 都只能用於類別資料",
      "D. CDF 可視為 PDF 從左到某點累積起來的機率"
    ],
    "answer": "D",
    "explanation": "考點：PDF／CDF",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "統計基礎與機率分佈",
      "PDF／CDF"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-005",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "「城市」欄位有上千種不同城市名稱，若直接 One-Hot Encoding，最常見問題為何？",
    "options": [
      "A. 高基數造成維度爆炸與稀疏特徵",
      "B. 模型無法讀取任何欄位名稱",
      "C. 資料一定會完全沒有缺值",
      "D. 所有城市會自動變成連續數值"
    ],
    "answer": "A",
    "explanation": "考點：One-Hot／High Cardinality",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "資料前處理與特徵工程",
      "One-Hot／High Cardinality"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-006",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "對「血型」這種無序類別使用 Label Encoding，最主要風險為何？",
    "options": [
      "A. 資料筆數會自動減半",
      "B. 模型可能誤以為不同血型之間有大小或順序關係",
      "C. 模型一定無法收斂",
      "D. 所有缺值會自動補成平均數"
    ],
    "answer": "B",
    "explanation": "考點：Label Encoding 風險",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "資料前處理與特徵工程",
      "Label Encoding 風險"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-007",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "某資料含明顯極端值，若要縮放數值特徵並降低極端值影響，較適合使用何者？",
    "options": [
      "A. Min-Max Scaling",
      "B. 單純刪除欄位名稱",
      "C. Robust Scaling",
      "D. Label Encoding"
    ],
    "answer": "C",
    "explanation": "考點：Robust Scaling",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "資料前處理與特徵工程",
      "Robust Scaling"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-008",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "箱型圖中，上鬚很長且上方有多個點落在 Q3 + 1.5IQR 之外，通常代表什麼？",
    "options": [
      "A. 高值端可能存在離群值",
      "B. 平均數必然等於中位數",
      "C. 資料一定完全常態分布",
      "D. 資料沒有任何變異"
    ],
    "answer": "A",
    "explanation": "考點：IQR／Outlier",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "資料前處理與特徵工程",
      "IQR／Outlier"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-009",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "顧客年齡欄位有少量缺值。若缺值比例不高且年齡分布有極端值，較穩健的補值方法為何？",
    "options": [
      "A. 以欄位名稱補值",
      "B. 以最大值乘以 100 補值",
      "C. 以中位數補值",
      "D. 直接把缺值當成模型答案"
    ],
    "answer": "C",
    "explanation": "考點：缺失值補值",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "資料前處理與特徵工程",
      "缺失值補值"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-010",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "將連續年齡切成「18-25、26-35、36-45」等區間，主要屬於下列何種處理？",
    "options": [
      "A. 反向傳播",
      "B. 分箱（Binning）",
      "C. 同態加密",
      "D. 資料庫正規化"
    ],
    "answer": "B",
    "explanation": "考點：Binning",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "資料前處理與特徵工程",
      "Binning"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-011",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "資料團隊利用「消費金額」與「瀏覽次數」產生「每次瀏覽平均消費」。此動作屬於何者？",
    "options": [
      "A. 特徵衍生（Feature Derivation）",
      "B. 特徵刪除（Feature Deletion）",
      "C. 資料庫索引重建",
      "D. 模型壓縮"
    ],
    "answer": "A",
    "explanation": "考點：Feature Derivation",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "資料前處理與特徵工程",
      "Feature Derivation"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-012",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "在模型訓練前，分析師先用全體資料計算標準化參數，再切分訓練集與測試集。此流程最大風險為何？",
    "options": [
      "A. 資料一定會變成非結構化",
      "B. ACID 原子性會失效",
      "C. 模型一定無法輸出機率",
      "D. 資料洩漏，測試集資訊提前進入訓練流程"
    ],
    "answer": "D",
    "explanation": "考點：Data Leakage",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "資料前處理與特徵工程",
      "Data Leakage"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-013",
    "subject": "AIAP 中級 第二科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "資料集中詐欺樣本只佔 1%。若做交叉驗證，較適合採用何者避免某些折幾乎沒有詐欺樣本？",
    "options": [
      "A. 分層 K-Fold（Stratified K-Fold）",
      "B. 只用第一折訓練，不驗證",
      "C. 隨機刪除所有詐欺樣本",
      "D. 把標籤改成文字摘要"
    ],
    "answer": "A",
    "explanation": "考點：Stratified CV",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "模型訓練與評估",
      "Stratified CV"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-014",
    "subject": "AIAP 中級 第二科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "若醫療篩檢模型希望盡量不要漏掉真正患病者，最應優先關注哪個指標？",
    "options": [
      "A. 平均絕對誤差（MAE）",
      "B. 資料庫持久性",
      "C. 召回率（Recall）",
      "D. 影像解析度"
    ],
    "answer": "C",
    "explanation": "考點：Recall",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "模型訓練與評估",
      "Recall"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-015",
    "subject": "AIAP 中級 第二科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "在嚴重類別不平衡的詐欺偵測任務中，若要評估模型對少數正類的辨識品質，通常比 ROC-AUC 更敏感的指標為何？",
    "options": [
      "A. 交易隔離級別",
      "B. R²",
      "C. 像素密度",
      "D. PR-AUC"
    ],
    "answer": "D",
    "explanation": "考點：PR-AUC／Imbalanced Data",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "模型訓練與評估",
      "PR-AUC／Imbalanced Data"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-016",
    "subject": "AIAP 中級 第二科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "詐欺偵測中，將正常交易誤判為詐欺，屬於混淆矩陣中的哪一類？",
    "options": [
      "A. True Positive",
      "B. False Positive",
      "C. False Negative",
      "D. True Negative"
    ],
    "answer": "B",
    "explanation": "考點：Confusion Matrix",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "模型訓練與評估",
      "Confusion Matrix"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-017",
    "subject": "AIAP 中級 第二科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "邏輯斯迴歸常用於二元分類，其輸出通常可解讀為什麼？",
    "options": [
      "A. 資料庫交易是否可回滾",
      "B. 分群的樹狀圖高度",
      "C. 屬於正類的機率或分數",
      "D. 影像每個像素的 RGB 值"
    ],
    "answer": "C",
    "explanation": "考點：Logistic Regression",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "模型訓練與評估",
      "Logistic Regression"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-018",
    "subject": "AIAP 中級 第二科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "線性迴歸模型中，若殘差隨預測值變大而變得更分散，較可能出現何種問題？",
    "options": [
      "A. One-Hot 維度爆炸",
      "B. 資料庫原子性",
      "C. 梯度裁剪過度",
      "D. 異質變異（Heteroscedasticity）"
    ],
    "answer": "D",
    "explanation": "考點：Regression／Heteroscedasticity",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "模型訓練與評估",
      "Regression／Heteroscedasticity"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-019",
    "subject": "AIAP 中級 第二科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "PCA 結果顯示前 3 個主成分可解釋 92% 變異，較合理的解讀為何？",
    "options": [
      "A. 使用前三個主成分可保留大部分資料變異資訊",
      "B. 前三筆資料都是異常值",
      "C. 模型準確率必然是 92%",
      "D. 資料已被完全匿名化"
    ],
    "answer": "A",
    "explanation": "考點：PCA／Explained Variance",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "模型訓練與評估",
      "PCA／Explained Variance"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-020",
    "subject": "AIAP 中級 第二科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "以自編碼器偵測異常資料時，若某筆資料重建誤差遠高於多數正常資料，通常代表什麼？",
    "options": [
      "A. 該筆資料可能與正常模式差異較大",
      "B. 該筆資料的 CDF 必定為 0",
      "C. 該筆資料沒有任何分析價值",
      "D. 該筆資料一定是訓練標籤"
    ],
    "answer": "A",
    "explanation": "考點：Autoencoder／重建誤差",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "模型訓練與評估",
      "Autoencoder／重建誤差"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-021",
    "subject": "AIAP 中級 第二科",
    "topic": "分群與不平衡資料",
    "type": "single",
    "stem": "公司不知道顧客應分成幾群，且希望找出任意形狀群集與雜訊點。下列何者較合適？",
    "options": [
      "A. t 檢定",
      "B. 線性迴歸",
      "C. DBSCAN",
      "D. K-means"
    ],
    "answer": "C",
    "explanation": "考點：DBSCAN",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "分群與不平衡資料",
      "DBSCAN"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-022",
    "subject": "AIAP 中級 第二科",
    "topic": "分群與不平衡資料",
    "type": "single",
    "stem": "若分析師希望用樹狀圖觀察樣本逐步合併的群集關係，較適合使用何種分群方法？",
    "options": [
      "A. 單樣本 t 檢定",
      "B. 邏輯斯迴歸",
      "C. 同態加密",
      "D. 階層式分群（Hierarchical Clustering）"
    ],
    "answer": "D",
    "explanation": "考點：Hierarchical Clustering",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "分群與不平衡資料",
      "Hierarchical Clustering"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-023",
    "subject": "AIAP 中級 第二科",
    "topic": "分群與不平衡資料",
    "type": "single",
    "stem": "GMM 與 K-means 的一項重要差異為何？",
    "options": [
      "A. GMM 可給出樣本屬於各群的機率，屬於軟分群",
      "B. GMM 不需要任何資料即可分群",
      "C. K-means 一定會輸出機率分布",
      "D. GMM 只能處理文字資料"
    ],
    "answer": "A",
    "explanation": "考點：GMM／Soft Clustering",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "分群與不平衡資料",
      "GMM／Soft Clustering"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-024",
    "subject": "AIAP 中級 第二科",
    "topic": "分群與不平衡資料",
    "type": "single",
    "stem": "Silhouette Score 主要用於評估什麼？",
    "options": [
      "A. 模型是否具著作權風險",
      "B. 資料庫交易是否完整回滾",
      "C. 群內相似與群間分離程度",
      "D. PDF 是否可被積分"
    ],
    "answer": "C",
    "explanation": "考點：Silhouette",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "分群與不平衡資料",
      "Silhouette"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-025",
    "subject": "AIAP 中級 第二科",
    "topic": "分群與不平衡資料",
    "type": "single",
    "stem": "在少數類樣本很少的分類任務中，隨機過採樣最常見風險為何？",
    "options": [
      "A. 會自動刪除所有多數類資料",
      "B. 重複少數類樣本可能增加過擬合風險",
      "C. 會使資料庫無法儲存文字",
      "D. 會使 CDF 變成負數"
    ],
    "answer": "B",
    "explanation": "考點：Random Oversampling",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "分群與不平衡資料",
      "Random Oversampling"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-026",
    "subject": "AIAP 中級 第二科",
    "topic": "分群與不平衡資料",
    "type": "single",
    "stem": "SMOTE 與隨機過採樣相比，主要差異為何？",
    "options": [
      "A. SMOTE 是資料庫交易協定",
      "B. SMOTE 只會複製完全相同的樣本",
      "C. SMOTE 只能計算平均數",
      "D. SMOTE 透過少數類鄰近樣本插值產生合成樣本"
    ],
    "answer": "D",
    "explanation": "考點：SMOTE",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "分群與不平衡資料",
      "SMOTE"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-027",
    "subject": "AIAP 中級 第二科",
    "topic": "分群與不平衡資料",
    "type": "single",
    "stem": "罕見疾病分類中，確診樣本不到 1%，若希望提升少數類偵測能力，下列哪組作法較合理？",
    "options": [
      "A. 只追求 Accuracy 並忽略 Recall",
      "B. 把確診樣本全部刪除避免偏差",
      "C. 重抽樣、類別權重、適合不平衡資料的評估指標與閾值調整",
      "D. 只用平均值補所有標籤"
    ],
    "answer": "C",
    "explanation": "考點：Imbalanced Classification",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "分群與不平衡資料",
      "Imbalanced Classification"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-028",
    "subject": "AIAP 中級 第二科",
    "topic": "分群與不平衡資料",
    "type": "single",
    "stem": "即時監測大量 IoT 感測器，偵測突然偏離正常模式的設備行為，最適合哪類分析？",
    "options": [
      "A. 單樣本 t 檢定",
      "B. 字詞斷詞",
      "C. 關聯規則購物籃分析",
      "D. 異常偵測（Anomaly Detection）"
    ],
    "answer": "D",
    "explanation": "考點：Anomaly Detection",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "分群與不平衡資料",
      "Anomaly Detection"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-029",
    "subject": "AIAP 中級 第二科",
    "topic": "大數據平台與資料管線",
    "type": "single",
    "stem": "製造業需要毫秒級偵測機台異常，同時保留完整歷史資料供後續分析。較合理的資料架構為何？",
    "options": [
      "A. 即時串流處理搭配資料湖／雲端儲存",
      "B. 只每年匯出一次紙本報表",
      "C. 只在前端瀏覽器暫存資料",
      "D. 只用單機 Word 文件保存"
    ],
    "answer": "A",
    "explanation": "考點：Streaming／Data Lake",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "大數據平台與資料管線",
      "Streaming／Data Lake"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-030",
    "subject": "AIAP 中級 第二科",
    "topic": "大數據平台與資料管線",
    "type": "single",
    "stem": "資料湖（Data Lake）相較傳統資料倉儲常見特點為何？",
    "options": [
      "A. 可儲存大量原始、結構化與非結構化資料，供後續不同分析使用",
      "B. 必定不需要資料治理",
      "C. 只能儲存已高度整理的固定格式報表",
      "D. 不能存放文字或影像"
    ],
    "answer": "A",
    "explanation": "考點：Data Lake",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "大數據平台與資料管線",
      "Data Lake"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-031",
    "subject": "AIAP 中級 第二科",
    "topic": "大數據平台與資料管線",
    "type": "single",
    "stem": "ELT 與 ETL 的主要差異為何？",
    "options": [
      "A. ELT 先載入資料到目標平台再轉換，ETL 則先轉換再載入",
      "B. ELT 只適用於紙本資料",
      "C. ETL 不需要抽取資料",
      "D. 兩者皆代表模型評估指標"
    ],
    "answer": "A",
    "explanation": "考點：ETL／ELT",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "大數據平台與資料管線",
      "ETL／ELT"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-032",
    "subject": "AIAP 中級 第二科",
    "topic": "大數據平台與資料管線",
    "type": "single",
    "stem": "Spark 相較傳統單機 pandas，在大數據處理上較常被採用的原因為何？",
    "options": [
      "A. 只能處理小於 10 筆資料",
      "B. 可以自動保證所有模型公平無偏",
      "C. 會自動生成法律契約",
      "D. 可進行分散式運算，處理超出單機記憶體的大量資料"
    ],
    "answer": "D",
    "explanation": "考點：Spark／分散式運算",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "大數據平台與資料管線",
      "Spark／分散式運算"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-033",
    "subject": "AIAP 中級 第二科",
    "topic": "大數據平台與資料管線",
    "type": "single",
    "stem": "資料庫 ACID 中的 Atomicity 指的是什麼？",
    "options": [
      "A. 資料一定要分成四個群集",
      "B. 所有欄位都必須為數值型",
      "C. 交易不可分割，必須全部成功或全部失敗",
      "D. 查詢結果一定按字母排序"
    ],
    "answer": "C",
    "explanation": "考點：ACID／Atomicity",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "大數據平台與資料管線",
      "ACID／Atomicity"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-034",
    "subject": "AIAP 中級 第二科",
    "topic": "大數據平台與資料管線",
    "type": "single",
    "stem": "社群平台要表示「使用者 A 在某時間用手機按讚貼文 B」，且查詢人與貼文的多層關係，較適合何種資料庫？",
    "options": [
      "A. 圖形資料庫（Graph Database）",
      "B. 純文字提示詞",
      "C. PDF 檔案庫",
      "D. 單一 CSV 檔"
    ],
    "answer": "A",
    "explanation": "考點：Graph Database",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "大數據平台與資料管線",
      "Graph Database"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-035",
    "subject": "AIAP 中級 第二科",
    "topic": "大數據平台與資料管線",
    "type": "single",
    "stem": "知識圖譜通常以節點與關係表達語意，下列哪一種結構最接近其基本表示？",
    "options": [
      "A. 實體－關係－實體的三元組",
      "B. 像素－亮度－飽和度",
      "C. 平均值－標準差－Z 分數",
      "D. 訓練集－驗證集－測試集"
    ],
    "answer": "A",
    "explanation": "考點：Knowledge Graph",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "大數據平台與資料管線",
      "Knowledge Graph"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-036",
    "subject": "AIAP 中級 第二科",
    "topic": "大數據平台與資料管線",
    "type": "single",
    "stem": "關聯規則中，若「買咖啡」的人也常「買蛋糕」，Confidence 主要衡量什麼？",
    "options": [
      "A. 在已買咖啡的條件下也買蛋糕的比例",
      "B. 模型是否過擬合",
      "C. 資料庫是否可回滾",
      "D. 蛋糕價格是否高於平均值"
    ],
    "answer": "A",
    "explanation": "考點：Association Rule／Confidence",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "大數據平台與資料管線",
      "Association Rule／Confidence"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-037",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "若兩個連續變數大致呈線性關係且無明顯離群值，常用哪個指標衡量線性相關程度？",
    "options": [
      "A. Pearson 相關係數",
      "B. Jaccard 距離",
      "C. Gini 不純度",
      "D. 交易隔離性"
    ],
    "answer": "A",
    "explanation": "考點：Pearson Correlation",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "統計基礎與機率分佈",
      "Pearson Correlation"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-038",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "共變異數與相關係數的主要差異為何？",
    "options": [
      "A. 相關係數只能用於文字資料",
      "B. 共變異數一定介於 0 到 1",
      "C. 相關係數經標準化，通常介於 -1 到 1，較易比較強度",
      "D. 兩者都代表分類準確率"
    ],
    "answer": "C",
    "explanation": "考點：Covariance vs Correlation",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "統計基礎與機率分佈",
      "Covariance vs Correlation"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-039",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "單樣本 t 檢定得到 p-value = 0.03，顯著水準 α = 0.05。較正確的結論為何？",
    "options": [
      "A. 虛無假設為真的機率一定是 3%",
      "B. 必定接受虛無假設",
      "C. 樣本平均數一定等於母體平均數",
      "D. 在虛無假設成立下觀察到此結果或更極端結果的機率低於門檻，因此拒絕虛無假設"
    ],
    "answer": "D",
    "explanation": "考點：p-value／t-test",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "統計基礎與機率分佈",
      "p-value／t-test"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-040",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "若把實際有效的新藥誤判為無效，屬於下列哪種錯誤？",
    "options": [
      "A. 第二型錯誤（Type II Error）",
      "B. 資料洩漏",
      "C. 第一型錯誤（Type I Error）",
      "D. 維度爆炸"
    ],
    "answer": "A",
    "explanation": "考點：Type II Error",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "統計基礎與機率分佈",
      "Type II Error"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-041",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "客服中心平均每小時來電 20 通，關注固定時間內事件發生次數，且事件近似獨立。常用哪種分布建模？",
    "options": [
      "A. 均勻分布一定適用所有情況",
      "B. Poisson 分布",
      "C. 指數移動平均",
      "D. 常態分布一定適用所有情況"
    ],
    "answer": "B",
    "explanation": "考點：Poisson Distribution",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "統計基礎與機率分佈",
      "Poisson Distribution"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-042",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "一次廣告曝光只有點擊或未點擊兩種結果，且重複多次曝光統計點擊次數，較接近哪種分布？",
    "options": [
      "A. DBSCAN",
      "B. PCA",
      "C. ARIMA",
      "D. 二項分布（Binomial Distribution）"
    ],
    "answer": "D",
    "explanation": "考點：Binomial Distribution",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "統計基礎與機率分佈",
      "Binomial Distribution"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-043",
    "subject": "AIAP 中級 第二科",
    "topic": "資料治理與隱私保護",
    "type": "single",
    "stem": "主管儀表板需要在一頁呈現多區域、多產品線趨勢，又避免雜訊過多。依資料視覺化原則，下列何者較合理？",
    "options": [
      "A. 移除座標軸與標籤讓畫面更乾淨",
      "B. 減少非資料墨水，突出關鍵趨勢與比較關係",
      "C. 加入越多裝飾圖案越能提升理解",
      "D. 所有圖表都改成 3D 圓餅圖"
    ],
    "answer": "B",
    "explanation": "考點：Data Visualization／Tufte",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "資料治理與隱私保護",
      "Data Visualization／Tufte"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-044",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "箱型圖顯示 IQR 很小但上方離群點很多，若要理解高消費客群，可採取何種做法？",
    "options": [
      "A. 保留並分析高值離群點，必要時分群或分層觀察，而非一律刪除",
      "B. 把所有數值改成平均數",
      "C. 直接刪除所有高消費顧客",
      "D. 只看最小值即可"
    ],
    "answer": "A",
    "explanation": "考點：Boxplot／離群值解讀",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "資料前處理與特徵工程",
      "Boxplot／離群值解讀"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-045",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "每日上億筆交易資料需快速估計第 95 百分位數，若精確排序成本過高，可採用何種方法？",
    "options": [
      "A. 近似分位數演算法",
      "B. 把所有資料轉成圖片",
      "C. 手動逐筆排序",
      "D. 只取第一筆資料當代表"
    ],
    "answer": "A",
    "explanation": "考點：Approximate Quantile",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "資料前處理與特徵工程",
      "Approximate Quantile"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-046",
    "subject": "AIAP 中級 第二科",
    "topic": "資料治理與隱私保護",
    "type": "single",
    "stem": "銀行要求雲端平台在不解密原始資料的情況下仍能進行運算，最符合何種技術？",
    "options": [
      "A. 箱型圖",
      "B. Label Encoding",
      "C. Min-Max Scaling",
      "D. 同態加密（Homomorphic Encryption）"
    ],
    "answer": "D",
    "explanation": "考點：Homomorphic Encryption",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "資料治理與隱私保護",
      "Homomorphic Encryption"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-047",
    "subject": "AIAP 中級 第二科",
    "topic": "資料治理與隱私保護",
    "type": "single",
    "stem": "資料去識別化時，將姓名替換成代碼，但保留可由對照表還原的可能。此較接近何者？",
    "options": [
      "A. 完全匿名化且不可逆",
      "B. 標準化",
      "C. 分層抽樣",
      "D. 假名化（Pseudonymization）"
    ],
    "answer": "D",
    "explanation": "考點：Pseudonymization",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "資料治理與隱私保護",
      "Pseudonymization"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-048",
    "subject": "AIAP 中級 第二科",
    "topic": "資料治理與隱私保護",
    "type": "single",
    "stem": "企業要追蹤資料從來源系統、清理、轉換到模型訓練的全流程，以便稽核與除錯。此概念最接近何者？",
    "options": [
      "A. Softmax",
      "B. Max-Pooling",
      "C. 資料血緣（Data Lineage）",
      "D. Mode Collapse"
    ],
    "answer": "C",
    "explanation": "考點：Data Lineage",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "資料治理與隱私保護",
      "Data Lineage"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-049",
    "subject": "AIAP 中級 第二科",
    "topic": "資料治理與隱私保護",
    "type": "single",
    "stem": "資料品質檢查發現同一顧客有多筆重複資料、欄位格式不一致、部分日期不合理。此時最應優先進行何種工作？",
    "options": [
      "A. 直接部署模型上線",
      "B. 資料清理與品質控管",
      "C. 提高模型溫度產生更多答案",
      "D. 刪除所有稽核紀錄"
    ],
    "answer": "B",
    "explanation": "考點：Data Quality",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "資料治理與隱私保護",
      "Data Quality"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  },
  {
    "questionId": "aiap-sim-2-050",
    "subject": "AIAP 中級 第二科",
    "topic": "資料治理與隱私保護",
    "type": "single",
    "stem": "生成式 AI 客服系統可能在回答中洩漏訓練資料中的真實姓名與電話。資料治理上最應優先採取何者？",
    "options": [
      "A. 關閉所有日誌與審核",
      "B. 將所有個資公開以提升透明度",
      "C. 只要求模型回答得更流暢",
      "D. 個資遮蔽、敏感資料過濾、輸出檢查與權限控管"
    ],
    "answer": "D",
    "explanation": "考點：GenAI／隱私治理",
    "tags": [
      "AIAP",
      "模擬題",
      "非官方",
      "大數據處理分析與應用",
      "資料治理與隱私保護",
      "GenAI／隱私治理"
    ],
    "difficulty": 5,
    "source": "AIAP 中級模擬考 科目二（原創仿真，非官方）"
  }
] satisfies Question[];
