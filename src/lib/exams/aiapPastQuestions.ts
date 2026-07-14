import type { Question } from "@/types/question";

export const aiapPastQuestions = [
  {
    "questionId": "aiap-114-2-1-001",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "某電商企業希望利用自然語言處理（NLP）技術，分析顧客在社群平台與商品評論中的文字內容，以即時掌握顧客對產品的滿意度變化。 若採用情感分析（Sentiment Analysis）模型，其主要目的為何？",
    "options": [
      "A. 預測顧客使用的語言風格與語氣；",
      "B. 判斷文本中所表達的情感傾向；",
      "C. 將顧客留言自動翻譯成企業內部指定語言；",
      "D. 產生顧客評論的自動化摘要內容"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-002",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "某跨國金融科技公司導入 Transformer 架構開發多語客服系統，以提升長篇金融文件的自動翻譯品質。下列何者為該模型能顯著改善翻譯準確度的主要原因？",
    "options": [
      "A. 透過自注意力機制（Self-Attention Mechanism）捕捉長距離語境依賴關係；",
      "B. 透過卷積運算（Convolution Operation）加速訓練過程；",
      "C. 透過強化學習（Reinforcement Learning）自動調整語句生成策略；",
      "D. 透過資料增強（Data Augmentation）平衡多語語料比例"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-003",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "某企業計畫應用 BERT（Bidirectional Encoder Representations from Transformers）模型分析大量顧客意見，以強化客服自動回覆系統。在 BERT 的預訓練過程中， 「遮罩語言模型（Masked Language Model, MLM） 」的主要訓練策略為何？",
    "options": [
      "A. 依序遮罩句尾詞語，讓模型從左到右逐步生成完整句子；",
      "B. 隨機遮罩部分詞語，並讓模型根據雙向上下文（Bidirectional Context）預測被遮罩的詞；",
      "C. 透過對抗訓練（Adversarial Training）生成語意相似的擾動樣本以提升泛化性；",
      "D. 以未遮罩的詞為條件，使用解碼器（Decoder）結構重建整句內容"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-004",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "在詞向量（Word Embedding）訓練方法中，GloVe（Global Vectors for Word Representation）與 Word2Vec 的主要差異為何？",
    "options": [
      "A. Word2Vec 以詞頻權重訓練詞向量，而 GloVe 以隨機初始化向量進行學習；",
      "B. Word2Vec 以全局統計矩陣為基礎，而 GloVe 採用神經網路進行上下文預測；",
      "C. Word2Vec 為基於預測的模型，而 GloVe 為基於共現統計的模型；",
      "D. Word2Vec 僅能用於靜態文本語料，而 GloVe 可應用於即時語料更新"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-005",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "某企業以詞頻–逆文件頻率（Term Frequency–Inverse Document Frequency, TF-IDF）方法分析顧客意見內容，但發現模型在處理篇幅較長的回饋文本時，無法準確反映關鍵詞的重要性。下列何者為造成此現象的主要原因？",
    "options": [
      "A. 長文本中的詞頻偏高，導致常見詞權重被過度放大；",
      "B. 長文本中缺乏明確句子邊界，造成 TF-IDF 無法計算詞頻；",
      "C. TF-IDF 無法同時處理多份文件；",
      "D. 長文本會改變 IDF（Inverse Document Frequency）的計算，使所有詞權重趨於相近"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-006",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "某企業嘗試以 N-gram 語言模型（N-gram Language Model）建立客服自動回覆系統，但發現模型生成的句子雖在片段上合理，卻缺乏整體語意連貫性。此問題最可能源自 N-gram 模型的哪一項限制？",
    "options": [
      "A. N-gram 模型在訓練過程中需要龐大計算量，導致長句無法收斂；",
      "B. N-gram 模型僅根據固定長度的前序詞建立機率估計，難以捕捉長距離依賴關係（Long-range Dependencies）；",
      "C. N-gram 模型缺乏語意嵌入（Semantic Embedding）層，因此無法表徵詞語間的語意相似度；",
      "D. N-gram 模型假設詞與詞之間相互獨立，導致無法建構上下文語意關聯"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-007",
    "subject": "AIAP 中級 第一科",
    "topic": "生成式 AI 與應用架構",
    "type": "single",
    "stem": "在企業導入的智慧監控系統中，模型以物件偵測（Object Detection）方式自動辨識影像中的人物與車輛。若評估指標採用平均精確率（Mean Average Precision, mAP），其中 IoU （Intersection over Union）閾值設定較高時，代表下列哪一項意義？",
    "options": [
      "A. 預測邊界框與真實邊界框的重疊程度越高，模型偵測結果越精準；",
      "B. 預測邊界框與真實邊界框的誤差越大，導致 mAP 數值上升；",
      "C. 模型整體精確率（Precision）降低，但召回率（Recall）上升；",
      "D. 預測邊界框的評估結果不受真實框大小影響"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "生成式 AI 與應用架構"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-008",
    "subject": "AIAP 中級 第一科",
    "topic": "電腦視覺與深度學習",
    "type": "single",
    "stem": "關於 Softmax 與 Max-Pooling，下列敘述何者正確？",
    "options": [
      "A. Softmax 與 Max-Pooling 都會將特徵張量壓縮為單一最大值；",
      "B. Max-Pooling 會對輸入進行機率分佈的轉換；",
      "C. Softmax 會保留所有輸入資訊，但以比例表示；Max-Pooling 只保留區域最大值；",
      "D. Softmax 主要用於特徵降維，而Max-Pooling 用於分類輸出"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "電腦視覺與深度學習"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-009",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "某企業在訓練生成式 AI 模型時，導入資料增強（Data Augmentation）技術以擴充訓練資料，但觀察到模型效能反而下降。 下列哪一項最可能的原因與對應改善策略最為正確？",
    "options": [
      "A. 增強樣本未經隨機初始化，導致模型梯度更新不穩定，應重新設計訓練啟動流程；",
      "B. 增強後資料的特徵分佈與原始資料不一致，影響模型的泛化能力，應檢查並調整增強策略以維持語意一致性；",
      "C. 增強樣本的比例過高，造成模型對特定資料產生偏好，應適度提高增強比例並調整學習率；",
      "D. 增強後資料的標註可信度下降，導致訓練訊號偏差，應以半監督學習方式重新校正資料"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-010",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "如果希望同時兼顧「精確率（Precision） 」和「召回率（Recall）」， 下列哪一個指標可以作為綜合評估的標準？",
    "options": [
      "A. 準確率（Accuracy）；",
      "B. 均方根誤差（RMSE）；",
      "C. 均方誤差（MSE）；",
      "D. F1 分數（F1 Score）"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "模型訓練與評估"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-011",
    "subject": "AIAP 中級 第一科",
    "topic": "AI 技術綜合",
    "type": "single",
    "stem": "企業資料分析團隊使用 DBSCAN（Density-Based Spatial Clustering of Applications with Noise）演算法進行顧客行為分群，並希望模型能自動區分主要群集與雜訊資料。 在此演算法中，決定聚類結果的兩個主要超參數為下列何者？",
    "options": [
      "A. 特徵數與學習率；",
      "B. K 值與距離閾值；",
      "C. 鄰域半徑（Epsilon ε）與最小點數（MinPts）；",
      "D. 交叉熵（Cross Entropy）與權重初始化"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "AI 技術綜合"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-012",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "某金融科技公司建立房價預測模型，使用多項特徵（如建坪、房齡、 樓層、總價等）進行線性迴歸分析（Linear Regression Analysis）。資料分析師發現多個特徵之間存在高度相關性，導致模型係數不穩定、預測誤差上升。為解決此問題，下列哪一種方法最適合？",
    "options": [
      "A. 繼續保留所有特徵，不進行任何處理；",
      "B. 使用主成分分析（PCA）將相關特徵轉換為彼此獨立的主成分；",
      "C. 新增更多原始變數以提升模型表現；",
      "D. 改用分類模型進行預測"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "模型訓練與評估"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-013",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "下列何者為 Kubernetes 在 AI 模型部署與運行中的核心功能？",
    "options": [
      "A. 自動化管理模型的訓練流程與參數調校；",
      "B. 管理與協調模型服務的部署、擴展與運行環境；",
      "C. 提供 AI 模型的資料儲存與版本控管功能；",
      "D. 負責深度學習推論的 GPU 加速運算"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "模型訓練與評估"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-014",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "在調整模型超參數（Hyperparameters）時，若希望避免因過度調整參數而導致過擬合，下列哪一種做法最有效提升模型的泛化能力？",
    "options": [
      "A. 採用交叉驗證（Cross-Validation）於多組參數組合間反覆評估，選擇在驗證資料上表現最穩定的設定；",
      "B. 使用早期停止機制（Early Stopping）監控訓練誤差並在收斂前停止訓練，以防模型學習過度；",
      "C. 對輸入特徵進行標準化以減少特徵值差異帶來的過擬合風險；",
      "D. 提高模型複雜度並使用更多超參數搜尋範圍，以確保模型能充分學習資料特徵"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "模型訓練與評估"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-015",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "在企業導入的 MLOps（Machine Learning Operations）流程中， Model Registry 最常用於哪一個階段？",
    "options": [
      "A. 用於設定運算資源與執行環境以確保訓練穩定；",
      "B. 用於建立可重複使用的資料與特徵版本；",
      "C. 用於集中管理模型版本、訓練紀錄與部署狀態；",
      "D. 用於追蹤模型上線後的表現與漂移情況"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "模型訓練與評估"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-016",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "下列哪一種情境中最適合使用「序列到序列（Seq2Seq） 」模型？",
    "options": [
      "A. 預測銷售趨勢曲線，輸出未來數值序列；",
      "B. 辨識文本中出現的人名、地名與組織名稱等實體資訊；",
      "C. 對輸入文本中的關鍵字進行頻率統計與可視化；",
      "D. 將輸入文字轉換成語意等價的另一段文字，如自動翻譯或摘要生成"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-017",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "在自然語言處理中，檢索增強生成（Retrieval-Augmented Generation, RAG）是一種結合語言模型與向量搜尋的技術，可有效減少模型知識過時與產生幻覺的問題。若要建立一套高效能的 RAG 系統，下列何者為在「檢索階段」最關鍵的挑戰？",
    "options": [
      "A. 確保檢索到的文件能被完整納入語言模型的上下文視窗（Context Window）中進行生成；",
      "B. 選擇使用 Faiss 或ScaNN 等近似最近鄰搜尋函式庫；",
      "C. 降低嵌入模型（Embedding Model）在高維空間中的計算成本與記憶體占用；",
      "D. 避免向量檢索結果僅具語意相似但與查詢意圖無實質關聯的情況"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-018",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "當 Transformer 模型發生「注意力分布過於平均（Attention Collapse） 」的情形時，導致模型無法有效聚焦於關鍵資訊，下列哪一項策略可有效改善此問題？",
    "options": [
      "A. 提高 Query-Key 點積（Dot Product）的縮放常數；",
      "B. 在 Softmax 前加入高斯雜訊（Gaussian Noise）；",
      "C. 使用 ReLU 函數取代 Softmax；",
      "D. 對注意力權重施加稀疏化約束（Sparsity Constraint）"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-019",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "某研究團隊正在訓練一個針對低資源語言（如少數民族語言）的語言模型，但該語言僅有約 1 萬筆語料可用。在訓練過程中出現明顯的過擬合現象，若希望在不新增真實語料的前提下提升模型的泛化能力， 採用下列哪一種方法最為適合？",
    "options": [
      "A. 將 Transformer 的隱藏層維度擴增至 1024，以提升表徵能力；",
      "B. 採用反向翻譯（Back-Translation）技術，以生成額外目標語句的偽平行語料（Pseudo‑Parallel Corpus）；",
      "C. 對詞嵌入矩陣（Embedding Matrix），施加L1 正則化以壓縮模型參數；",
      "D. 將多語言 BERT（mBERT）中所有 Transformer 層全部凍結以保留預訓練知識"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-020",
    "subject": "AIAP 中級 第一科",
    "topic": "電腦視覺與深度學習",
    "type": "single",
    "stem": "在使用生成對抗網路（GAN）進行人臉影像生成時，若出現「模式崩潰」 （Mode Collapse）現象，下列哪一種方法最常被用來有效解決此問題？",
    "options": [
      "A. 在鑑別器中加入梯度懲罰（Gradient Penalty）以穩定訓練過程；",
      "B. 採用 Wasserstein 距離（WGAN 損失）替代原始的 GAN 損失函數；",
      "C. 對生成器輸入的潛在向量加入隨機擾動；",
      "D. 使用多尺度鑑別器架構以提高對多樣性的判別能力"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "電腦視覺與深度學習"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-021",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "在多模態 AI 模型訓練或推論過程中，遇到某一模態資料缺失（例如僅有影像資料但缺少文本說明），下列哪一種策略最有效維持模型效能？",
    "options": [
      "A. 以零向量或固定向量填充缺失模態輸入；",
      "B. 訓練具備模態缺失感知能力的模型，使其適應缺失狀況；",
      "C. 利用生成模型（如 GAN 或自迴歸模型）預測並補全缺失模態資料；",
      "D. 直接捨棄缺少模態的樣本，避免干擾訓練或推論"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-022",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "某電商平台開發的顧客流失預測模型在上線數月後，預測準確率明顯下降。專案團隊懷疑顧客行為模式改變，導致模型輸入特徵的分佈與原始訓練資料不同，出現典型的資料漂移（Data Drift）問題。為了偵測並確認資料分佈是否發生變化，下列哪一種作法最合適？",
    "options": [
      "A. 定期重新訓練模型以應對外部變化；",
      "B. 提升模型複雜度以捕捉更多資料變異性；",
      "C. 增加測試資料量以提高評估準確度；",
      "D. 計算輸入特徵分佈間的 KL 散度（KL Divergence）"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "模型訓練與評估"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-023",
    "subject": "AIAP 中級 第一科",
    "topic": "AI 導入規劃與治理",
    "type": "single",
    "stem": "某大型醫院即將部署一套輔助診斷的 AI 系統，為降低對臨床流程的衝擊，同時確保風險可控與回饋可收斂，應採取何種『漸進式部署』 （Phased Rollout）策略最為合適？",
    "options": [
      "A. 從單一專科（如放射科）或特定病房開始啟用，逐步擴展至全院；",
      "B. 先部署於病例量較高的急診單位，加速收集高頻使用回饋；",
      "C. 僅在夜班或離峰時段啟用，避免影響主要臨床工作負載；",
      "D. 在使用者界面啟用提示模式，讓全院同步體驗但不影響診斷流程"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "AI 導入規劃與治理"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-024",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "某金融機構的 AI 風控系統遭受對抗性攻擊，駭客透過對輸入特徵進行微小但惡意的擾動，成功欺騙了模型。為了從根本上解決模型自身對這類攻擊的脆弱性，下列何者並非針對此種攻擊型態的技術手段？",
    "options": [
      "A. 強化資料前處理，用以過濾掉格式不符或數值極端異常的輸入；",
      "B. 在模型訓練階段導入對抗樣本訓練，以提升模型對惡意特徵擾動的辨識與防禦能力；",
      "C. 於推論後階段使用規則引擎，以確保模型的預測結果不違反既有的業務硬性規定；",
      "D. 在模型部署環境中強化網路防火牆，以阻擋來自未授權來源的網路連線"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "模型訓練與評估"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-025",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "某企業部署生成式 AI 系統協助行銷與內容產出，但近期遭質疑部分生成內容可能涉及著作權侵權。為降低企業在法律層面的潛在責任與風險，下列哪一項策略最能有效預防侵權問題產生？",
    "options": [
      "A. 對生成內容進行語意相似度比對，自動標註可能涉及既有著作的輸出結果，以降低侵權風險；",
      "B. 建立訓練資料篩選與授權驗證機制，排除未授權或高風險資料來源；",
      "C. 在訓練與微調過程中採用差分隱私技術，避免模型記憶特定受著作權保護的樣本；",
      "D. 在模型輸出端嵌入浮水印（Watermarking）或數位指紋（Digital Fingerprint）技術，以確保生成內容可追溯"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-026",
    "subject": "AIAP 中級 第一科",
    "topic": "AI 技術綜合",
    "type": "single",
    "stem": "在房價預測任務中，若發現特徵如「房間數」與「坪數」存在高度多重共線性（Multicollinearity），為降低共線性對模型參數估計的負面影響，應優先選擇下列哪種模型？",
    "options": [
      "A. 不受多重共線性影響的決策樹模型；",
      "B. 傳統線性迴歸模型，不含正則化項；",
      "C. 支持向量機搭配線性核函數；",
      "D. 含 L1 正則化的 LASSO 迴歸模型"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "AI 技術綜合"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-027",
    "subject": "AIAP 中級 第一科",
    "topic": "AI 技術綜合",
    "type": "single",
    "stem": "某企業需分析半結構化的系統日誌（JSON 格式），以提取關鍵的時序特徵供故障預測模型使用。考量日誌結構複雜且包含巢狀欄位 （Nested Fields），下列哪一種策略最有效且實務可行？",
    "options": [
      "A. 先將 JSON 資料扁平化轉成CSV，再對欄位計算統計量（如均值、 次數）作為特徵；",
      "B. 使用遞歸神經網路（RNN）直接輸入原始 JSON 字串進行時序特徵抽取；",
      "C. 設計遞迴函式展開巢狀欄位，並基於時間窗口（Time Window）進行聚合與特徵萃取；",
      "D. 只保留時間戳記欄位，忽略其他巢狀內容以簡化特徵工程"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "AI 技術綜合"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-028",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "在一個同時包含連續型特徵與類別型特徵的資料集中，若希望透過適當的特徵工程流程來提升模型整體表現，下列哪一種作法最為合適？",
    "options": [
      "A. 將類別型特徵使用標籤編碼（Label Encoding）轉換後，與連續特徵直接合併進行模型訓練；",
      "B. 將連續特徵進行離散化（Discretization）或分桶（Binning）轉為類別型特徵，統一以類別方式處理；",
      "C. 對連續特徵做標準化（Standardization），類別特徵採用目標編碼（Target Encoding），並生成交互特徵提升模型表現；",
      "D. 只保留連續特徵，忽略類別型變量以簡化模型"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "模型訓練與評估"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-029",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "某 AI 開發團隊為提升模型開發效率及品質控制，計畫實施持續整合 （Continuous Integration, CI）流程。下列哪一項做法最符合 CI 的核心實踐，且能有效減少整合風險？",
    "options": [
      "A. 在主分支（Main Branch）每日固定時間手動合併並執行完整測試流程；",
      "B. 每次程式碼提交（Commit）後自動觸發建置、單元測試及靜態程式碼分析；",
      "C. 於模型訓練完成後，定期安排開發團隊回顧並合併程式碼；",
      "D. 透過自動化部署腳本，將模型在特定時間點批次釋出到測試環境"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "模型訓練與評估"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-030",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "某銀行計劃將 AI 詐欺偵測模組整合至核心交易系統，主管機關要求全流程必須符合金融監管對「不可否認性（Non-repudiation） 」的資訊安全規範，以確保日後能進行法務追蹤與稽核。下列哪一項措施最能確保此要求的落實？",
    "options": [
      "A. 為每筆 AI 模型推論記錄其輸入與輸出結果的加密雜湊值 （Hash），並簽署數位簽章以確保不可竄改性；",
      "B. 優化模型效能以降低平均推論延遲至 100ms 以下，提升使用者體驗；",
      "C. 增加主機備援數量，以確保系統在故障時持續可用；",
      "D. 將模型推論請求導入負載平衡器，避免單點壅塞導致服務延遲"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "模型訓練與評估"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-031",
    "subject": "AIAP 中級 第一科",
    "topic": "AI 導入規劃與治理",
    "type": "single",
    "stem": "某 AI 服務系統每次推論請求需約 1 秒完成，且必須支撐高達 10,000 次請求每秒（RPS）的流量。為確保系統具備高可用性且能穩定應付流量峰值，下列哪一種架構方案最為合適？",
    "options": [
      "A. 依賴單台超高效能伺服器進行垂直擴展，提升硬體規格；",
      "B. 採用容器化部署並水平擴展服務實例，結合自動彈性伸縮機制 （Auto Scaling）；",
      "C. 限制最大併發連線數，以避免系統過載；",
      "D. 增加批次處理大小，一次同時處理上千筆請求"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "AI 導入規劃與治理"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-032",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "某企業已將 AI 模型部署於生產環境，為確保系統持續穩定運作，並能提前偵測模型效能可能衰退，技術團隊希望透過監控指標進行預警。 下列哪一項監控指標最具預測效力，能提早發現模型效能下滑風險？",
    "options": [
      "A. 系統 CPU 與記憶體使用率波動幅度；",
      "B. 模型推論結果的置信度（Confidence）分佈變化趨勢；",
      "C. API 平均回應時間與延遲百分位數變化；",
      "D. 輸入特徵與訓練資料分布差異的 PSI（Population Stability Index）指數"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "模型訓練與評估"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-033",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "企業團隊在使用 Word2Vec 模型訓練客服文本語料時，若訓練資料量龐大且希望模型能更有效捕捉罕見詞的語意關聯，下列哪一種訓練策略最為適合？",
    "options": [
      "A. 採用 Skip-gram 模型，但以隨機初始化權重加快高頻詞的訓練收斂；",
      "B. 採用 CBOW 模型（Continuous Bag of Words Model）並結合 TF- IDF 權重以強化低頻詞表示；",
      "C. 採用 Skip-gram 模型，利用中心詞預測周圍詞語，能更有效學習低頻詞關係；",
      "D. 採用 CBOW 模型（Continuous Bag of Words Model），利用周圍詞預測中心詞，能提升罕見詞的語意穩定度"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-034",
    "subject": "AIAP 中級 第一科",
    "topic": "電腦視覺與深度學習",
    "type": "single",
    "stem": "在自駕車影像辨識系統中，開發團隊希望模型能同時辨識每個像素所屬的物件類別（例如道路、建築、行人），又能區分出同類物件的不同個體（例如多位行人）。此時最適合採用下列哪一項電腦視覺技術？",
    "options": [
      "A. 語義分割（Semantic Segmentation）；",
      "B. 物件偵測（Object Detection）；",
      "C. 實例分割（Instance Segmentation）；",
      "D. 全景分割（Panoptic Segmentation）"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "電腦視覺與深度學習"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-035",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "某媒體公司計畫導入 CLIP（Contrastive Language–Image Pre- training）模型，以協助大量影像自動標註與搜尋，並希望在無需新增標訓資料的情況下，僅透過文字提示（Text Prompt）即可識別影像內容。請問此應用情境中，CLIP 能夠達成的關鍵技術特性為何？",
    "options": [
      "A. 透過圖文對比式學習（Contrastive Learning）將影像與文字映射至共同嵌入空間（Shared Embedding Space），可直接以語意相似度進行零樣本分類；",
      "B. 透過影像增強與特徵擴散降低標訓資料需求；",
      "C. 以監督式學習結合多層感知器（Multilayer Perceptron, MLP） 進行影像特徵分類；",
      "D. 以自迴歸生成模型（Autoregressive Model）逐步生成文字標籤描述影像內容"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-036",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "某資料科學團隊在開發預測模型時，針對多種模型設定（如學習率、 樹深度、正則化係數等）進行系統化測試，希望找出在驗證資料上表現最穩定的組合。此過程最可能採用下列哪一種方法？",
    "options": [
      "A. 使用交叉驗證（Cross Validation）反覆評估模型以降低過擬合風險；",
      "B. 透過網格搜尋（Grid Search）在多組超參數設定中進行系統化搜尋與評估；",
      "C. 以隨機搜尋（Random Search）快速探索部分參數空間以提升搜尋效率；",
      "D. 採用貝葉斯優化（Bayesian Optimization）根據歷次結果動態調整搜尋方向"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "模型訓練與評估"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-037",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "某公司正在訓練一個大型語音合成模型，開發團隊使用多台 GPU 進行訓練，但經常出現 GPU 記憶體不足問題。由於模型架構已固定且無法更換硬體，團隊希望在維持模型效能與收斂品質的前提下，下列哪一種方法最有效降低單張 GPU 的記憶體壓力？",
    "options": [
      "A. 減少訓練資料量以降低記憶體使用；",
      "B. 採用較小的批次大小（Batch Size）並搭配資料分片（Data Sharding）分散訓練負載；",
      "C. 增加學習率（Learning Rate）以加快收斂速度；",
      "D. 改用測試資料集（Test Set）進行部分訓練以節省空間"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "模型訓練與評估"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-038",
    "subject": "AIAP 中級 第一科",
    "topic": "電腦視覺與深度學習",
    "type": "single",
    "stem": "某影像設計團隊在使用 Stable Diffusion 生成 4K 級產品圖時，發現影像邊緣與細節存在顆粒化與模糊現象。 若僅能在生成階段進行調整，希望提升畫面清晰度與紋理層次，同時避免過度平滑，下列哪一項作法最適合？",
    "options": [
      "A. 降低取樣步數，以縮短生成時間；",
      "B. 增加取樣步數並選擇高品質取樣器，以強化細節還原度；",
      "C. 提高 CFG（Classifier-Free Guidance）值，使生成結果更具創意與多樣性；",
      "D. 改用低解析度輸入以降低計算成本"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "電腦視覺與深度學習"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-039",
    "subject": "AIAP 中級 第一科",
    "topic": "生成式 AI 與應用架構",
    "type": "single",
    "stem": "某企業的資料科學團隊利用 ARIMA 模型（AutoRegressive Integrated Moving Average Model）預測每週產品銷售量。模型建立完成後，分析人員發現預測誤差隨時間呈現週期性波動，且自相關函數（ACF）顯示殘差在多個時滯（Lag）上仍顯著不為零。根據上述現象，最合理的模型診斷結論為何？",
    "options": [
      "A. 模型殘差符合白噪音（White Noise）假設，預測表現穩定；",
      "B. 模型殘差雖有輕微異常，但可視為隨機誤差忽略不計；",
      "C. 模型存在配適不足（Underfitting）問題，需重新調整 p 或 q 參數以捕捉時間依賴性；",
      "D. 殘差特性不影響預測結果，無須進一步修正"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "生成式 AI 與應用架構"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-040",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "下列哪一項最正確地描述了 VAE（Variational Autoencoder）、GAN （Generative Adversarial Network）與擴散模型（Diffusion Model）在多模態潛在空間對齊（Latent Alignment）與生成策略上的根本差異？",
    "options": [
      "A. VAE 透過顯式潛在變數建模實現跨模態對齊，適合捕捉整體語意結構但生成解析度有限；GAN 透過對抗損失（Adversarial Loss）在不同模態間學習分佈映射，生成品質高但穩定性差；擴散模型則以條件化噪聲反推（Conditional Denoising）方式實現高保真跨模態生成，兼具穩定性與多樣性；",
      "B. VAE 與 Diffusion Ｍodel 均屬隱式生成架構，主要依賴對抗式訓練實現跨模態對齊；GAN 則以顯式後驗估計方式提升樣本一致性；",
      "C. VAE 與 GAN 均使用馬爾可夫鏈（Markov Chain）進行跨模態轉換； Diffusion Model 則透過 KL 散度最小化學習語意對應。；",
      "D. 三者在多模態應用中皆依賴同一潛在表徵空間（Shared Latent Space），僅在解碼器結構不同而已"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-041",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "在進行超參數調校（Hyperparameter Tuning）時，若直接在 K-Fold 交叉驗證（Cross-Validation）的資料上同時調整模型參數並評估效能，最可能導致下列哪一種問題？",
    "options": [
      "A. 模型的交叉驗證結果出現過度樂觀偏差（Over-optimistic Bias），因測試摺資料間接參與參數選擇，造成資料洩漏（Data Leakage）；",
      "B. 模型會在每一摺（Fold）內反覆調整參數，導致訓練不穩與過度正則化；",
      "C. 因交叉驗證資料被重複使用，造成效能方差增大，無法獲得穩定估計；",
      "D. K-Fold 交叉驗證的假設與超參數搜尋相衝突，導致驗證過程失效"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "模型訓練與評估"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-042",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "若部署一個深度學習模型至金融風控系統，該模型採用鑑別式架構 （如 Transformer Classifier）。然而上線後，模型對新樣本的分類錯誤率顯著上升，經檢查發現，輸入資料分佈已與原訓練集明顯不同。針對此情形，下列哪一種應對策略最為適合？",
    "options": [
      "A. 改用生成對抗網路（GAN）生成新樣本並混入訓練集；",
      "B. 改用邏輯迴歸模型（Logistic Regression）以提升穩定性；",
      "C. 增加模型容量（Model Capacity），以學習更多樣本差異；",
      "D. 使用變分自編碼器（VAE）監控潛在空間分佈，偵測輸入資料偏移"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-043",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "某金融科技公司欲導入 AI 模型協助客服郵件自動分類（投訴、詢問、表揚）。團隊同時考慮兩種模型設計： 方案 A（生成式路徑） ：採用VAE 建構潛在語意空間，再結合下游分類器進行標籤預測； 方案 B（鑑別式路徑） ：採用BERT Classifier 直接根據輸入文本進行監督式分類。 現有標註資料約 2,000 筆，資料分佈均勻但擴充成本高。若團隊希望公平比較兩種模型的資料利用效率與泛化能力，下列哪一種實驗設計最能突顯兩者的本質差異？",
    "options": [
      "A. 在完整資料集上分別訓練兩者，並比較其分類準確率 （Accuracy）與推論時間；",
      "B. 在低資源情境（Low-resource Setting）下，逐步減少標註比例 （100%、50%、10%），比較其F1-score；",
      "C. 使用 GAN 自動生成文本樣本補足資料，觀察兩模型在資料增強後的精確率（Precision）差異；",
      "D. 在相同訓練資料上固定輸入維度，僅調整模型參數量，比較其對過擬合的敏感度"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-044",
    "subject": "AIAP 中級 第一科",
    "topic": "AI 技術綜合",
    "type": "single",
    "stem": "某電信公司希望建立一個模型來預測顧客是否即將流失，並進一步模擬不同促銷或服務策略下顧客的行為變化，以生成多樣化的虛擬樣本資料進行 A/B 測試與行銷策略評估。若要同時兼顧預測與資料生成的需求，最適合採用下列哪一種方法？",
    "options": [
      "A. 使用傳統隨機森林（Random Forest）；",
      "B. 使用邏輯迴歸（Logistic Regression）模型；",
      "C. 使用變分自編碼器（Variational Autoencoder, VAE）或生成對抗網路（Generative Adversarial Network, GAN）；",
      "D. 使用強化學習代理（Reinforcement Learning Agent）"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "AI 技術綜合"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-045",
    "subject": "AIAP 中級 第一科",
    "topic": "電腦視覺與深度學習",
    "type": "single",
    "stem": "進行影像分類任務時，研究團隊嘗試利用主成分分析（Principal Component Analysis, PCA）將輸入特徵從 1024 維降至 100 維，並將降維後的資料輸入支持向量機（Support Vector Machine, SVM）模型進行訓練。關於此作法，下列哪一項描述最為合理？",
    "options": [
      "A. PCA 保留的主成分必然能提升 SVM 的分類準確率；",
      "B. 使用原始高維資料通常更能保留資訊，因此 PCA 沒有實際意義；",
      "C. PCA 可讓 SVM 自動適用於非線性（Nonlinear）資料集；",
      "D. 降維後可降低訓練時間並減少過擬合（Overfitting）風險"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "電腦視覺與深度學習"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-046",
    "subject": "AIAP 中級 第一科",
    "topic": "模型訓練與評估",
    "type": "single",
    "stem": "某企業的 AI 模型已部署於線上服務環境中，用於即時預測顧客流失機率。近期團隊注意到模型預測準確率逐漸下降，但系統運作正常且未出現錯誤訊息。經分析發現，近期輸入資料的分布與模型訓練資料相比出現顯著偏移。若要在 MLOps 流程中主動偵測並預警此類問題， 最應採用下列哪項措施？",
    "options": [
      "A. 建立即時的資料漂移（Data Drift）與概念漂移（Concept Drift）監測機制；",
      "B. 將模型轉換為量化版本以降低延遲；",
      "C. 增加模型超參數調整次數以強化適應性；",
      "D. 使用固定隨機種子（Random Seed）確保訓練穩定"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "模型訓練與評估"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-047",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "某金融科技公司導入多任務學習架構，讓單一 Transformer 模型同時執行 OCR（Optical Character Recognition）後的文檔分類以及命名實體辨識（Named Entity Recognition, NER）任務， 以協助自動歸檔與抽取關鍵金融資訊。在部署初期，團隊發現當模型的 NER 準確率（Accuracy）提升時，文檔分類準確率反而下降。若模型架構正確且資料品質良好，下列哪一項最可能是造成此現象的原因？",
    "options": [
      "A. 模型架構無法同時支援文字分類與序列標註任務（Sequence Labeling）；",
      "B. 文檔分類任務不需要語意化表徵（Contextualized Representation）；",
      "C. 損失函數（Loss Function）未進行權重平衡，導致任務間競爭；",
      "D. 所使用的 BERT 模型無法支援多任務輸出頭（Multi-Head Outputs）"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-048",
    "subject": "AIAP 中級 第一科",
    "topic": "生成式 AI 與應用架構",
    "type": "single",
    "stem": "某數據工程師使用 DBSCAN 演算法對一份數百萬筆的高維顧客資料進行聚類分析，但發現程式執行速度極慢，甚至出現記憶體不足的情況。若要在不改變演算法核心邏輯的前提下，最有效提升其運算效率的作法為何？",
    "options": [
      "A. 改用以平均連結（Average Linkage）為基礎的階層式群集法 （Hierarchical Clustering）；",
      "B. 採用高效率的距離索引結構（Distance Index Structure），例如 KD-Tree 或 Ball Tree；",
      "C. 將 ε（Epsilon）參數調得極小，以減少鄰近點的數量；",
      "D. 在資料前處理時增加標準化後的特徵維度數"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "生成式 AI 與應用架構"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-049",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "某電商平台導入 AI 情感分析模型，用以自動偵測顧客評論中的負面情緒並觸發客服機制。然而，上線後發現模型在面對不同語言或族群書寫風格的評論時表現不一致，例如部分語氣強烈的正面評論被誤判為負面，而禮貌但含批評意圖的評論卻被判為中性。若從技術與資料治理的角度分析，下列哪一項描述不正確？",
    "options": [
      "A. 模型未啟用詞嵌入正規化（Embedding Normalization）可能造成語意距離不穩定，導致預測誤差；",
      "B. 訓練語料若偏向特定文化或語氣特徵，可能使模型產生內隱偏誤 （Implicit Bias）；",
      "C. 模型若訓練資料來源不平衡，容易導致對不同語言或族群風格的情緒判斷不準確；",
      "D. Transformer 架構能捕捉上下文語意，但若訓練資料偏差仍存在， 模型仍可能學習到偏誤判斷"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-1-050",
    "subject": "AIAP 中級 第一科",
    "topic": "NLP 與語言模型",
    "type": "single",
    "stem": "某設計師使用公司內部建置的生成式 AI 工具製作行銷素材，並輸入提示語（Prompt） ： 「請生成一張模特兒手持品牌飲料、背景為海邊夕陽的照片」。系統能正確生成主要主題與場景，但輸出的圖像中，品牌標誌顏色常有誤差，或人物手部姿勢顯得不自然。若從多模態生成模型的技術機制分析，此現象最可能是下列哪一項原因所造成？",
    "options": [
      "A. 擴散式生成模型的去雜訊過程出現隨機梯度漂移，導致影像像素錯誤；",
      "B. 提示語過長造成 Transformer 的位置編碼超出上下文限制，導致生成混亂；",
      "C. CLIP 模型中的文字編碼器與影像編碼器在語意嵌入空間未充分對齊，導致跨模態理解偏差；",
      "D. 模型未採用對比學習（Contrastive Learning）損失函數，無法建立多模態語意關聯"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "人工智慧技術應用與規劃",
      "NLP 與語言模型"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第一科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-001",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "若某數據點的 Z 分數（Z-Score）= 2，請問代表下列哪一種意涵？",
    "options": [
      "A. 代表該數據點之原始數值為 2；",
      "B. 該數據點比平均值低 2 個標準差；",
      "C. 代表數據為異常值；",
      "D. 該數據點比平均值高 2 個標準差"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "統計基礎與機率分佈"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-002",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "使用 Python 的 pandas 套件處理各商品銷售數據（變數為 df）時，若需計算「總銷售額」欄位的敘述性統計量（如平均值、標準差等），應使用下列哪一種語法？",
    "options": [
      "A. df['總銷售額'].sum()；",
      "B. df['總銷售額'].describe()；",
      "C. df['總銷售額'].sort_values()；",
      "D. df['總銷售額'].stats()"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料前處理與特徵工程"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-003",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "附圖為某資料之分佈圖，此圖資料之偏態（Skewness）值較有可能為下列哪個選項？",
    "options": [
      "A. Skewness < 0；",
      "B. Skewness > 0；",
      "C. Skewness = 0；",
      "D. 無法計算 Skewness"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "統計基礎與機率分佈",
      "含附圖"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-004",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "累積分佈函數（Cumulative Distribution Function, CDF）可用於描述隨機變數的機率分佈特性，其數學定義為下列何者？",
    "options": [
      "A. 機率密度函數（Probability Density Function, PDF）的平均值；",
      "B. 機率密度函數（Probability Density Function, PDF）的積分；",
      "C. 機率密度函數（Probability Density Function, PDF）的離散總和；",
      "D. 機率密度函數（Probability Density Function, PDF）的標準差"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "統計基礎與機率分佈"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-005",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "在進行資料前處理時，若使用 Label Encoding 將類別變數轉換為數字型態，下列何者為最常見的潛在風險？",
    "options": [
      "A. 無法處理缺值；",
      "B. 會引入類別之間的虛假順序關係；",
      "C. 無法擴展至新資料；",
      "D. 記憶體佔用過高"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料前處理與特徵工程"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-006",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "在進行資料分析時，會遇到類別型（Categorical）與數值型 （Numerical） 資料格式。關於這兩種資料格式的處理，下列敘述何者不正確？",
    "options": [
      "A. One-Hot 編碼（One-Hot Encoding）會將類別變數轉換為多維二元向量，適用於無序（Nominal）類別資料，但在高基數（High Cardinality）特徵下可能造成維度爆炸問題；",
      "B. 標籤編碼（Label Encoding）會以整數表示不同類別，若應用於無序 （Nominal）資料，可能導致模型誤將編碼值解讀為具數值大小關係的特徵；",
      "C. 標準化（Standardization）透過將資料平移與縮放，使其平均值為 0、標準差為 1，可在多數距離型演算法中改善收斂速度，並同時將數值範圍壓縮至 0 至 1 之間；",
      "D. 對連續變數進行分箱（Binning）可提升模型可解釋性，但若分段方式未依據資料分佈特性設計，可能導致資訊損失或邊界偏誤"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料前處理與特徵工程"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-007",
    "subject": "AIAP 中級 第二科",
    "topic": "大數據平台與資料管線",
    "type": "single",
    "stem": "在資料庫的 ACID 特性中，下列何者為「原子性（Atomicity） 」的正確定義？",
    "options": [
      "A. 所有資料欄位必須為相同型別；",
      "B. 每次交易需以批次方式執行；",
      "C. 交易不可分割，需完全成功或完全失敗；",
      "D. 系統會自動同步交易資料至所有節點"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "大數據平台與資料管線"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-008",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "資料科學家為分析顧客行為，利用現有欄位「銷售金額」與「瀏覽次數」，計算出新變數「銷售金額/瀏覽次數」。此動作屬於下列哪一類特徵工程方法？",
    "options": [
      "A. 特徵選擇（Feature Selection）；",
      "B. 特徵衍生（Feature Derivation）；",
      "C. 特徵轉換（Feature Transformation）；",
      "D. 分箱處理（Binning）"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料前處理與特徵工程"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-009",
    "subject": "AIAP 中級 第二科",
    "topic": "資料庫與資料治理",
    "type": "single",
    "stem": "在進行數值特徵的標準化（Normalization）時，若資料中存在極端值 （Outliers），下列哪一種方法最適合使用？",
    "options": [
      "A. Min-Max 正規化（Min-Max Scaling）；",
      "B. Z-score 標準化（Z-score Normalization）；",
      "C. 穩健縮放（Robust Scaling）；",
      "D. 標準分箱（Standard Binning）"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料庫與資料治理"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-010",
    "subject": "AIAP 中級 第二科",
    "topic": "資料庫與資料治理",
    "type": "single",
    "stem": "下列哪一種情境最適合應用異常偵測（Anomaly Detection）技術？",
    "options": [
      "A. 根據歷史銷售資料預測特定商品在旺季期間是否會出現供貨短缺，以提前調整庫存策略；",
      "B. 透過信用風險模型預測顧客是否可能發生違約，以輔助核貸決策；",
      "C. 即時分析金融交易資料流，偵測與平常交易行為明顯不同的可疑交易紀錄；",
      "D. 監控線上服務平台的使用者登入次數，預測次日的登入量變化趨勢"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料庫與資料治理"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-011",
    "subject": "AIAP 中級 第二科",
    "topic": "大數據平台與資料管線",
    "type": "single",
    "stem": "若一家公司需即時監控大量物聯網裝置的異常行為，下列哪一種組合最適合此應用？",
    "options": [
      "A. 傳統關聯式資料庫+圖形視覺化；",
      "B. 批次資料處理+雲端備份；",
      "C. 大數據平台+即時資料分析技術；",
      "D. Word 文件+手動標註"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "大數據平台與資料管線"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-012",
    "subject": "AIAP 中級 第二科",
    "topic": "分析建模與商業應用",
    "type": "single",
    "stem": "在處理分類問題時，若某一類樣本數明顯少於其他類別，研究人員可能採用隨機過採樣（Random Oversampling）以平衡資料比例，此方法最常造成下列哪一種問題？",
    "options": [
      "A. 增加過擬合風險；",
      "B. 降低模型的收斂速度；",
      "C. 減少資料總筆數數量；",
      "D. 導致訓練資料欄位缺失"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "分析建模與商業應用"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-013",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "下列何者為同態加密（Homomorphic Encryption）技術的核心特性？",
    "options": [
      "A. 將資料轉換為匿名識別碼以隱藏身分；",
      "B. 對資料進行標準化處理以提升模型精度；",
      "C. 自動偵測與排除異常值；",
      "D. 可直接在加密狀態下進行數據運算"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料前處理與特徵工程"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-014",
    "subject": "AIAP 中級 第二科",
    "topic": "資料庫與資料治理",
    "type": "single",
    "stem": "某組資料共 10 項標籤如下： A, A, A, A, A, B, B, B, B, B 若該標籤僅有 A、B 兩種，請問這組資料的「正規化吉尼不純度 （Normalized Gini impurity） 」為何？",
    "options": [
      "A. 0；",
      "B. 0.42；",
      "C. 0.84；",
      "D. 1"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料庫與資料治理"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-015",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "某家客服中心統計資料發現，平均每小時會接到約 20 通顧客來電，但每分鐘的來電數量不固定，可能為 0、1、2 通不等。這些來電事件彼此獨立，且在短時間內，發生的機率與時間長短成正比。若要以機率模型描述 「每分鐘接到幾通來電」的機率分佈，下列哪一種最適合使用？",
    "options": [
      "A. 均勻分佈（Uniform distribution）；",
      "B. 指數分佈（Exponential distribution）；",
      "C. 卜瓦松分佈（Poisson distribution）；",
      "D. 常態分佈（Normal distribution）"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "統計基礎與機率分佈"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-016",
    "subject": "AIAP 中級 第二科",
    "topic": "資料庫與資料治理",
    "type": "single",
    "stem": "某金融科技公司以 Z 分數（Z-Score）監控交易金額異常狀況。若交易金額平均為新台幣 2,000 元，標準差為 400 元，某筆交易金額為 3,200 元，且公司以|Z| ≥ 3 判定為異常值（Outlier），下列判斷何者最為正確？",
    "options": [
      "A. 該筆交易的 Z 分數為 3，應標記為異常值；",
      "B. 該筆交易的 Z 分數為 2.5，屬於合理變異範圍；",
      "C. 該筆交易的 Z 分數為 2，顯示模型標準差估計過高；",
      "D. 該筆交易的 Z 分數為 1.5，無須納入異常檢測"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料庫與資料治理"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-017",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "某電商公司欲利用顧客行為資料建立消費預測模型，其中「會員等級」欄位包含「一般、白金、黑卡」三種類別。若模型採用梯度提升樹 （Gradient Boosting Tree）演算法，資料科學家在進行特徵編碼時應特別注意下列何種情況？",
    "options": [
      "A. 應優先採用獨熱編碼（One-Hot Encoding），以減少類別之間的相依性與記憶體使用量；",
      "B. 直接使用標籤編碼（Label Encoding）可能使模型誤判類別間存在順序關係，導致特徵重要性偏誤；",
      "C. 使用目標編碼（Target Encoding）會自動消除過擬合 （Overfitting）風險；",
      "D. 若類別數量較少，建議先使用主成分分析（Principal Component Analysis, PCA）進行降維"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料前處理與特徵工程"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-018",
    "subject": "AIAP 中級 第二科",
    "topic": "大數據平台與資料管線",
    "type": "single",
    "stem": "某人工智慧團隊使用分散式資料庫（Distributed Database）儲存模型訓練資料，並在更新訓練樣本時啟用多節點交易。若其中一個節點在交易過程中發生錯誤，但系統仍確保整體資料不會出現部分更新、最終狀態維持一致，下列何者最能說明此現象？",
    "options": [
      "A. 系統透過原子性（Atomicity）確保交易必須全部成功或全部回復 （Rollback）；",
      "B. 系統透過一致性（Consistency）確保交易完成後資料符合完整性規則；",
      "C. 系統透過隔離性（Isolation）避免多筆交易同時存取或修改相同資料；",
      "D. 系統透過持久性（Durability）確保交易一旦提交，其結果將永久保留於資料庫中"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "大數據平台與資料管線"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-019",
    "subject": "AIAP 中級 第二科",
    "topic": "大數據平台與資料管線",
    "type": "single",
    "stem": "某製造企業導入上萬台物聯網（IoT）感測器以進行設備健康監測。系統需在毫秒級回應異常事件，並同時將完整資料保留於雲端供後續 AI 模型訓練與分析。若企業希望兼顧即時性、資料完整性與可擴展性，下列哪一種資料流程設計最符合此目標？",
    "options": [
      "A. 感測器 → 雲端 API Gateway → 分散式資料庫→ 批次特徵工程（→ 模型推論；",
      "B. 感測器 → MQTT Broker → 雲端資料倉儲→ 即時儀表板→ 模型再訓練；",
      "C. 感測器 → 邊緣運算節點→ 流式資料處理框架（Stream Processing Framework）→ 雲端資料湖→ 模型推論；",
      "D. 感測器 → 本地快取層→ RESTful API → 雲端報表系統）→ 模型批次更新"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "大數據平台與資料管線"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-020",
    "subject": "AIAP 中級 第二科",
    "topic": "資料庫與資料治理",
    "type": "single",
    "stem": "某銀行計畫將信用風險評估模型部署至雲端平台，以便即時分析客戶交易行為。由於涉及大量敏感金融資料，銀行要求雲端服務商在不解密原始資料的情況下仍能執行模型運算。為達成此目標，最適合採用下列哪一項技術？",
    "options": [
      "A. 在上傳資料前進行匿名化（Anonymization），僅保留可識別代碼供比對使用；",
      "B. 利用雜湊（Hash）函數轉換資料，以確保模型可追蹤但無法還原個資；",
      "C. 採用資料本地化（Data Localization）策略，將所有模型訓練限制於內部伺服器中；",
      "D. 透過同態加密（Homomorphic Encryption），讓雲端系統能直接在加密資料上執行運算，解密後結果與原始資料一致"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料庫與資料治理"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-021",
    "subject": "AIAP 中級 第二科",
    "topic": "分析建模與商業應用",
    "type": "single",
    "stem": "某資料分析師設計在業務績效報告時，希望單一頁面中同時呈現多區域、 不同產品線的銷售趨勢變化，並確保主管能在短時間內掌握整體資料走向。若依據 Edward Rolf Tufte 的數據密度（Data Density） 原則，下列哪一種設計方式最能符合該概念？",
    "options": [
      "A. 將每個區域的銷售資料分成多張獨立折線圖，以避免資訊重疊；",
      "B. 使用顏色區分產品線，於同一圖表中整合多區域趨勢線，保持比例一致且標註清晰；",
      "C. 移除所有輔助線與標籤，僅保留主要折線以凸顯趨勢；",
      "D. 將資料轉換為表格形式，確保數值精確呈現並取代圖表視覺化"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "分析建模與商業應用"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-022",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "某投資研究員希望分析四檔科技類股（A、B、C、D）每日報酬率的變化趨勢，以判斷這些股票之間是否存在高度相關性與共變動性，並評估投資組合分散風險的程度。若研究員希望以單一圖表快速呈現各股票間的關聯強度與方向，下列哪一種視覺化呈現方式最適合？",
    "options": [
      "A. 為每檔股票各自繪製直方圖（Histogram）以比較報酬率分佈；",
      "B. 針對任兩檔股票繪製散佈圖並加上趨勢線（Regression Line）；",
      "C. 使用雙軸折線圖（Dual-axis Line Chart）同時顯示四檔股價變化；",
      "D. 熱力圖（Heatmap）配合相關係數矩陣（Correlation Matrix）"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "統計基礎與機率分佈"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-023",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "某研究團隊以單樣本 t 檢定（one-sample t-test）檢驗「新行銷策略後的平均月銷售額是否與原本的 100 萬元不同」，顯著水準設定為 α =0.05。檢定結果顯示：p 值=0.08，且 95%信賴區間為 [95 萬元, 108 萬元]。根據上述結果，下列敘述何者正確？",
    "options": [
      "A. 因 p 值< 0.05，可拒絕虛無假設；",
      "B. 若顯著水準改為 0.10，仍不顯著；",
      "C. 因 100 萬元落在信賴區間內，無法拒絕虛無假設；",
      "D. 信賴區間寬度僅與顯著水準有關"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "統計基礎與機率分佈"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-024",
    "subject": "AIAP 中級 第二科",
    "topic": "大數據平台與資料管線",
    "type": "single",
    "stem": "某企業建置生成式 AI 系統，利用大量客服紀錄與產品評論資料訓練語言模型，以自動生成客服回覆與知識摘要。由於資料來源多樣，且包含非結構化文字、影像與表格資訊，團隊希望在不降低模型效能的前提下，提升資料處理效率與一致性，下列哪一種資料處理策略最適合？",
    "options": [
      "A. 建立資料湖（Data Lake）結構，並以 Apache Spark 或 Ray 進行分散式資料預處理與特徵抽取，再串接至模型訓練管線（Pipeline）；",
      "B. 採用單節點高效能伺服器搭配批次處理模式，集中執行資料清理與格式轉換；",
      "C. 將所有文字資料轉換為向量，並以資料庫索引方式直接餵入語言模型訓練；",
      "D. 使用生成式模型先行自動清理資料內容，再將結果輸入至下游訓練流程"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "大數據平台與資料管線"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-025",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "某電商資料團隊繪製顧客單筆消費金額的箱型圖後發現：四分位距 （IQR）範圍極小，但上鬚線拉得很長，且在高金額區域有多筆離群值。 若希望協助行銷部門依據消費層級設計分群策略，下列哪一種視覺化方式最有助於凸顯不同消費層級間的差異？",
    "options": [
      "A. 以對數刻度繪製箱型圖或長條圖，放大高金額消費族群的變化差異；",
      "B. 移除所有離群值，確保資料呈現集中分布；",
      "C. 採用等距分箱（Equal-Width Binning）方式分群；",
      "D. 改以折線圖（Line Chart）觀察時間變化趨勢"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料前處理與特徵工程"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-026",
    "subject": "AIAP 中級 第二科",
    "topic": "大數據平台與資料管線",
    "type": "single",
    "stem": "某串流影音平台運用關聯規則學習（Association Rule Learning）分析用戶的觀影行為，發現若使用者觀看了科幻影集，則有較高機率接著觀看超級英雄電影。分析顯示，同時觀看這兩種類型的使用者約佔全部觀影紀錄的 12%，而觀看科幻影集的使用者中，有 50%也觀看了超級英雄電影， 該規則的提升度（Lift）為 1.8。根據上述資訊，下列哪一項推論最為正確？",
    "options": [
      "A. 支持度（Support）過低，代表此規則不具任何商業價值；",
      "B. 提升度（Lift）大於 1 表示兩種類型內容無關，僅屬於隨機重疊；",
      "C. 信賴度（Confidence）為 50%，代表觀看科幻影集者有明顯傾向觀看超級英雄電影；",
      "D. 同時觀看比例僅 12%，代表兩種類型互相排斥"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "大數據平台與資料管線"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-027",
    "subject": "AIAP 中級 第二科",
    "topic": "大數據平台與資料管線",
    "type": "single",
    "stem": "某金融科技公司分析每日上億筆交易資料，以監控客戶轉帳金額分佈與異常波動。由於資料量極大，為兼顧效率與準確度，團隊決定採用「近似分位數（Approximate Quantile） 」方法進行資料摘要統計。下列何者最能正確反映該技術的核心目的？",
    "options": [
      "A. 確保每個分位值的結果完全精確，即使計算時間較長；",
      "B. 利用機器學習模型預測分位數位置，以減少統計計算量；",
      "C. 僅能對結構化資料進行批次處理，無法應用於即時資料流；",
      "D. 在可容忍誤差範圍內，快速估算分位值以支援即時分析"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "大數據平台與資料管線"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-028",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "若在高維度（>500 維）的資料上應用 DBSCAN（Density-Based Spatial Clustering of Applications with Noise）演算法，卻發現所有資料點皆被判定為雜訊（Noise），下列何者為最有可能的原因？",
    "options": [
      "A. 高維下距離變化趨同，導致 ε（Epsilon）閾值選擇失效；",
      "B. 使用錯誤的距離函數（Distance Function）；",
      "C. MinPts 參數設得太小；",
      "D. 資料過度標準化導致特徵消失"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料前處理與特徵工程"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-029",
    "subject": "AIAP 中級 第二科",
    "topic": "資料庫與資料治理",
    "type": "single",
    "stem": "某團隊在開發風險評估模型時，使用主成分分析（Principal Component Analysis, PCA）進行降維。輸入資料包含三個數值欄位： 「交易金額（單位：新台幣） 」、 「交易次數（次／月） 」與「年齡（歲） 」，其數值量級分別約為 10⁵、10¹與 10²。分析人員直接將原始數據帶入 PCA，結果第一主成分（PC1）幾乎完全由「交易金額」主導。下列哪一項作法或判斷最合理？",
    "options": [
      "A. 這是正常現象，金額本身變異較大，應主導主要成分；",
      "B. 若改用特徵選擇法，可自動解決變數量級問題；",
      "C. 可刪除「交易金額」欄位以平衡各主成分的影響；",
      "D. 在進行 PCA 前應先進行標準化（Standardization），以避免因數值尺度差異造成特徵偏誤"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料庫與資料治理"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-030",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "某行銷團隊想了解「廣告預算」與「銷售金額」之間的關聯程度。經繪製散佈圖後發現兩者呈現明顯線性趨勢，且資料中無明顯離群值 （Outliers）。若希望衡量兩者之間線性關係的強度與方向，下列哪一種方法最適合？",
    "options": [
      "A. 均方根誤差（Root Mean Squared Error, RMSE）；",
      "B. 共變異數（Covariance）；",
      "C. 皮爾森相關係數（Pearson Correlation Coefficient）；",
      "D. 平均絕對誤差（Mean Absolute Error, MAE）"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料前處理與特徵工程"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-031",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "某電商團隊觀察到，每位顧客對廣告推播的點擊行為可視為一次伯努利試驗（Bernoulli Trial），單次點擊成功機率為p=0.4。當推播對象擴增至 5,000 位顧客時，團隊想快速預估「成功點擊總數」的分佈情形，以進行模型效能模擬與預測。若希望以常態分佈（Normal Distribution）近似原始分佈，下列哪一項判斷最為合理？",
    "options": [
      "A. 因樣本數極大，可直接以常態分佈近似二項分佈（Binomial Distribution）；",
      "B. 只有當 np 與 n(1-p) 皆大於 5 時，才能以常態分佈作近似；",
      "C. 常態近似只適用於 p=0.5 的情況；",
      "D. 無論樣本數多大，二項分佈都不能以常態分佈近似"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "統計基礎與機率分佈"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-032",
    "subject": "AIAP 中級 第二科",
    "topic": "資料庫與資料治理",
    "type": "single",
    "stem": "某電信公司導入生成式 AI 客服系統，利用過去對話紀錄與用戶行為資料訓練語言模型，在資料治理與合規審查過程中，團隊發現模型可能會在回答中生成包含真實姓名、電話或交易資訊的內容。為確保系統符合個資法及生成式 AI 的安全與隱私要求，下列哪一項作法最符合實務可行及法規原則？",
    "options": [
      "A. 在訓練資料前進行資料匿名化（Anonymization）或偽匿名化 （Pseudonymization）處理，並建立輸出內容稽核機制；",
      "B. 改以強化學習（Reinforcement Learning）微調模型，使模型學習避免產出真實資訊；",
      "C. 採用同態加密（Homomorphic Encryption）以加密所有文字輸入，確保模型無法辨識任何個資；",
      "D. 僅設定模型回覆時不顯示用戶姓名，即可視為隱私防護完成"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料庫與資料治理"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-033",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "某金融機構的量化分析師在建立資產風險評估模型時，發現報酬率資料分佈明顯非對稱，且出現多次極端損失事件，使得傳統假設常態分佈的模型無法準確反映真實風險。若希望在不依賴常態分佈假設的前提下，採取更能捕捉資料極端情況的建模策略，下列哪一種方法最為合適？",
    "options": [
      "A. 採用線性迴歸模型（Linear Regression Model），以常態分佈殘差 （Residuals）為基礎進行推估；",
      "B. 使用平均數（Mean）與標準差（Standard Deviation）估計波動範圍；",
      "C. 將資料裁剪至 ±3σ 範圍內以排除異常值影響；",
      "D. 採用分位數回歸模型（Quantile Regression Model），聚焦於尾部分位（Tail Quantiles）以評估極端風險"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "統計基礎與機率分佈"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-034",
    "subject": "AIAP 中級 第二科",
    "topic": "資料庫與資料治理",
    "type": "single",
    "stem": "在圖形資料庫（Graph Database）中建模社群平台資料時，若每筆「按讚」行為都包含時間戳記（Timestamp）與裝置類型（Device Type）等資訊。若希望同時保留使用者與貼文之間的互動關係，並能有效查詢「按讚」的行為屬性，下列哪一種設計方式最為合適？",
    "options": [
      "A. 將「按讚」視為節點（Node），與使用者建立邊（Edge）；",
      "B. 將「按讚」資訊作為邊的屬性（Property）儲存，連結使用者與被按讚的貼文節點；",
      "C. 把「按讚」資訊直接寫入使用者節點中作為屬性；",
      "D. 建立「按讚紀錄表」並將資料存入關聯式資料庫"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料庫與資料治理"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-035",
    "subject": "AIAP 中級 第二科",
    "topic": "資料庫與資料治理",
    "type": "single",
    "stem": "某企業欲建構知識圖譜（Knowledge Graph），以整合內部的研究報告、專利資料與專家知識，並支援語意查詢與關聯推理。若希望模型能具備良好的語意擴展性與高效推理能力，下列哪一種圖模型設計最為合適？",
    "options": [
      "A. 僅以節點（Node）與邊（Edge）表示，所有資訊存放於節點屬性中；",
      "B. 將資料結構建為 RDF（Resource Description Framework）三元組 （Subject–Predicate–Object）；",
      "C. 使用文件型資料庫儲存內容，並以標籤（Tag）連接節點；",
      "D. 採用關聯式資料庫儲存對應關係，並搭配預建索引加速查詢"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料庫與資料治理"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-036",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "某研究人員欲使用線性迴歸模型（Linear Regression Model）分析變數 Y 與 X 之間的關係，但發現 Y 的分佈明顯右偏，且其變異數隨 X 的增大而增加。為滿足模型假設並提升配適效果，下列哪一種前處理方法最為合適？",
    "options": [
      "A. 對 X 進行標準化（Standardization）；",
      "B. 對 Y 進行 Box–Cox 轉換（Box–Cox Transformation）；",
      "C. 對資料進行一次差分（First Differencing）；",
      "D. 將 Y 中變異較大的樣本移除"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料前處理與特徵工程"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-037",
    "subject": "AIAP 中級 第二科",
    "topic": "分析建模與商業應用",
    "type": "single",
    "stem": "若開發一個用於罕見疾病自動診斷的分類模型，目前資料集中確診樣本僅佔不到 1%，且因為標註成本高，短期內無法取得更多資料。在此情況下，若希望提升模型對少數類的偵測能力，同時避免過擬合，下列哪一種策略最為合理？",
    "options": [
      "A. 對少數類進行隨機過採樣（Random Oversampling）；",
      "B. 對多數類進行欠採樣（Random Undersampling）；",
      "C. 使用 SMOTE（Synthetic Minority Over-sampling Technique）生成合成少數類樣本後再訓練分類模型；",
      "D. 僅使用現有資料調整模型決策閾值（Decision Threshold）以提升召回率"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "分析建模與商業應用"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-038",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "一家製造廠評估新生產線推出後，產品良率是否較原生產線提升。工程師分別從兩條生產線各抽樣 100 件產品，原生產線良率為 95%，新生產線為 97%。若欲檢定兩條生產線良率的差異是否具有統計意義，下列哪一種方法最為合適？",
    "options": [
      "A. 雙樣本平均數 t 檢定（Two-sample t-test）；",
      "B. 雙比例 Z 檢定（Two-proportion Z-test）；",
      "C. 卡方檢定（Chi-square test）；",
      "D. 變異數分析（ANOVA）"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "統計基礎與機率分佈"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-039",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "若評估一個新開發的腫瘤分類模型，其資料集中有 80%的樣本來自良性病例。若直接使用 5-fold 交叉驗證（Cross-Validation） 進行模型評估， 可能導致模型效能評估出現偏差，為避免此問題，下列哪一種作法最合適？",
    "options": [
      "A. 降低 K 值以減少交叉驗證次數；",
      "B. 改為使用拔靴法（Bootstrap）；",
      "C. 調整測試集使良性樣本比例更高，以模擬真實分佈；",
      "D. 使用分層交叉驗證（Stratified K-Fold Cross-Validation），以確保每折類別比例一致"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "統計基礎與機率分佈"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-040",
    "subject": "AIAP 中級 第二科",
    "topic": "分析建模與商業應用",
    "type": "single",
    "stem": "請參考附圖，下列虛擬程式碼（pseudocode）最可能是在描述何種驗證法？",
    "options": [
      "A. Hold-out 驗證（Hold-out Validation）；",
      "B. 留一交叉驗證 LOOCV（Leave-One-Out Cross Validation）；",
      "C. K-fold 交叉驗證（K-fold Cross Validation）；",
      "D. 拔靴法（Bootstrap）驗證"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "分析建模與商業應用",
      "含附圖"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-041",
    "subject": "AIAP 中級 第二科",
    "topic": "分析建模與商業應用",
    "type": "single",
    "stem": "請參考附圖，下列虛擬程式碼（pseudocode）最可能是在描述何種演算法？",
    "options": [
      "A. K-means 分群（K-means Clustering）；",
      "B. 高斯混合模型分群（Gaussian Mixture Model Clustering）；",
      "C. 階層式分群（Hierarchical Clustering）；",
      "D. DBSCAN 分群（Density-based Spatial Clustering of Applications with Noise Clustering）"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "分析建模與商業應用",
      "含附圖"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-042",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "考慮某生產線每小時出現瑕疵品的個數符合卜瓦松分佈（Poisson Distribution），已知平均每小時產生5 個瑕疵品，附圖程式碼展示資料處理，請問下列敘述何者正確？",
    "options": [
      "A. lambda_poisson = 5 表示每小時最多 5 個瑕疵品；",
      "B. poisson.pmf(5, lambda_poisson) 表示小於 5 個瑕疵品的機率；",
      "C. 卜瓦松分佈的適用條件為事件彼此獨立，且平均發生率固定；",
      "D. poisson.cdf(10, 5) 表示大於或等於 10 個瑕疵品的機率"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "統計基礎與機率分佈",
      "含附圖"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-043",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "題組情境：一間遊戲市場研究公司正在分析全球電子遊戲銷售情況，並準備建立一份 「熱銷遊戲銷售報告」。分析師取得了一份名為 vgsales.csv 的資料集， 內容包含了全球銷量超過 10 萬份的電子遊戲清單。研究團隊希望透過這份資料，了解不同年份、平台與地區的銷售趨勢。資料集的欄位說明如下，請根據下述資料情境回答以 43~47 題。 Name：遊戲名稱 Platform：遊戲平台（如 PS4、X360、Wii 等） Year：發售年份 Genre：遊戲類型（如 Action、Sports、Role-Playing 等） Publisher：發行商名稱 NA_Sales / EU_Sales / JP_Sales / Other_Sales：各地區銷售量（單位：百萬份） Global_Sales：全球總銷售量（單位：百萬份） 資料的欄位概觀如下：\n\n分析師在載入資料後，檢視 Year 欄位的資料型態，發現它是 float64， 而非一般年份常用的整數。他想了解這樣的情形為什麼會發生。請問下列哪些原因可能導致這種狀況？ 原因 A：CSV 檔中 Year 欄位有缺失值(NaN)，導致 Pandas 自動將整欄轉為浮點數。 原因 B：CSV 檔中的年份資料原本是字串(如 \"2006\")，Pandas 轉換時出錯而變成浮點數。 原因 C：Pandas 預設會將所有數值型態讀取為 float64，不論資料是否為整數。 原因 D：CSV 檔中的年份資料可能包含小數點(例如 2006.0)，因此被視為浮點數。",
    "options": [
      "A. 原因 B、原因 C；",
      "B. 原因 A、原因 D；",
      "C. 原因 A、原因 B、原因 D；",
      "D. 原因 C、原因 D"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料前處理與特徵工程"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-044",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "題組情境：一間遊戲市場研究公司正在分析全球電子遊戲銷售情況，並準備建立一份 「熱銷遊戲銷售報告」。分析師取得了一份名為 vgsales.csv 的資料集， 內容包含了全球銷量超過 10 萬份的電子遊戲清單。研究團隊希望透過這份資料，了解不同年份、平台與地區的銷售趨勢。資料集的欄位說明如下，請根據下述資料情境回答以 43~47 題。 Name：遊戲名稱 Platform：遊戲平台（如 PS4、X360、Wii 等） Year：發售年份 Genre：遊戲類型（如 Action、Sports、Role-Playing 等） Publisher：發行商名稱 NA_Sales / EU_Sales / JP_Sales / Other_Sales：各地區銷售量（單位：百萬份） Global_Sales：全球總銷售量（單位：百萬份） 資料的欄位概觀如下：\n\n研究團隊接下來想要將 Year 欄位轉換為整數型態，以便後續進行年份趨勢分析。考慮到資料中可能包含缺失值（NaN），請選出最合適的轉換方式。",
    "options": [
      "A. data['Year'] = data['Year'].astype(int)；",
      "B. data['Year'] = data['Year'].fillna(0).astype(int)；",
      "C. data['Year'] = data['Year'].fillna(1).astype(int)；",
      "D. data['Year'] = data['Year'].astype('Int64')；"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料前處理與特徵工程"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-045",
    "subject": "AIAP 中級 第二科",
    "topic": "分析建模與商業應用",
    "type": "single",
    "stem": "題組情境：一間遊戲市場研究公司正在分析全球電子遊戲銷售情況，並準備建立一份 「熱銷遊戲銷售報告」。分析師取得了一份名為 vgsales.csv 的資料集， 內容包含了全球銷量超過 10 萬份的電子遊戲清單。研究團隊希望透過這份資料，了解不同年份、平台與地區的銷售趨勢。資料集的欄位說明如下，請根據下述資料情境回答以 43~47 題。 Name：遊戲名稱 Platform：遊戲平台（如 PS4、X360、Wii 等） Year：發售年份 Genre：遊戲類型（如 Action、Sports、Role-Playing 等） Publisher：發行商名稱 NA_Sales / EU_Sales / JP_Sales / Other_Sales：各地區銷售量（單位：百萬份） Global_Sales：全球總銷售量（單位：百萬份） 資料的欄位概觀如下：\n\n為了觀察各遊戲平台的市場表現，分析師想要統計每個平台的全球銷售總額，並以長條圖呈現。請選出最能正確實現此分析的程式碼。",
    "options": [
      "A. data.groupby(\"Platform\")[\"Global_Sales\"].sum().plot(kind=\"bar\")；",
      "B. data.groupby(\"Platform\")[\"Global_Sales\"].count().plot(kind=\"bar\")；",
      "C. data[\"Platform\"].value_counts().plot(kind=\"bar\")；",
      "D. data.groupby(\"Platform\")[\"Global_Sales\"].mean().plot(kind=\"bar\")"
    ],
    "answer": "A",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "分析建模與商業應用"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-046",
    "subject": "AIAP 中級 第二科",
    "topic": "大數據平台與資料管線",
    "type": "single",
    "stem": "題組情境：一間遊戲市場研究公司正在分析全球電子遊戲銷售情況，並準備建立一份 「熱銷遊戲銷售報告」。分析師取得了一份名為 vgsales.csv 的資料集， 內容包含了全球銷量超過 10 萬份的電子遊戲清單。研究團隊希望透過這份資料，了解不同年份、平台與地區的銷售趨勢。資料集的欄位說明如下，請根據下述資料情境回答以 43~47 題。 Name：遊戲名稱 Platform：遊戲平台（如 PS4、X360、Wii 等） Year：發售年份 Genre：遊戲類型（如 Action、Sports、Role-Playing 等） Publisher：發行商名稱 NA_Sales / EU_Sales / JP_Sales / Other_Sales：各地區銷售量（單位：百萬份） Global_Sales：全球總銷售量（單位：百萬份） 資料的欄位概觀如下：\n\n團隊希望比較北美、歐洲、日本及其他地區的整體銷售比例，並使用 seaborn 套件以長條圖的形式進行可視化分析。請選出能正確顯示這些地區銷售總額比例的程式碼。",
    "options": [
      "A. sns.countplot(x=[\"NA_Sales\",\"EU_Sales\",\"JP_Sales\",\"Other_Sales\"], data=data)；",
      "B. sns.lineplot(x=\"Platform\", y=[\"NA_Sales\",\"EU_Sales\",\"JP_Sales\",\"Other_Sales\"], data=data)；",
      "C. sns.barplot(x=\"variable\", y=\"value\", data=pd.melt(data, value_vars=[\"NA_Sales\",\"EU_Sales\",\"JP_Sales\",\"Other_Sales\"]), estimator=sum)；",
      "D. sns.histplot(data[[\"NA_Sales\",\"EU_Sales\",\"JP_Sales\",\"Other_Sales\"]])"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "大數據平台與資料管線"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-047",
    "subject": "AIAP 中級 第二科",
    "topic": "分析建模與商業應用",
    "type": "single",
    "stem": "題組情境：一間遊戲市場研究公司正在分析全球電子遊戲銷售情況，並準備建立一份 「熱銷遊戲銷售報告」。分析師取得了一份名為 vgsales.csv 的資料集， 內容包含了全球銷量超過 10 萬份的電子遊戲清單。研究團隊希望透過這份資料，了解不同年份、平台與地區的銷售趨勢。資料集的欄位說明如下，請根據下述資料情境回答以 43~47 題。 Name：遊戲名稱 Platform：遊戲平台（如 PS4、X360、Wii 等） Year：發售年份 Genre：遊戲類型（如 Action、Sports、Role-Playing 等） Publisher：發行商名稱 NA_Sales / EU_Sales / JP_Sales / Other_Sales：各地區銷售量（單位：百萬份） Global_Sales：全球總銷售量（單位：百萬份） 資料的欄位概觀如下：\n\n研究團隊想要知道在北美地區（NA）銷售成績最好的遊戲前五名，並希望以 seaborn 的條狀圖呈現結果。請選出能正確完成這項分析的程式碼。",
    "options": [
      "A. sns.barplot(x=\"NA_Sales\", y=\"Name\", data=data.head(5))；",
      "B. sns.barplot(x=\"Name\", y=\"NA_Sales\", data=data.nlargest(5, \"NA_Sales\"))；",
      "C. sns.lineplot(x=\"Name\", y=\"NA_Sales\", data=data.nlargest(5, \"NA_Sales\"))；",
      "D. sns.countplot(x=\"Name\", y=\"NA_Sales\", data=data)"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "分析建模與商業應用"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-048",
    "subject": "AIAP 中級 第二科",
    "topic": "統計基礎與機率分佈",
    "type": "single",
    "stem": "題組情境：使用銷售資料集(marketing.csv)進行迴歸分析，附圖程式碼展示資料載入與處理，請回答後續 48~50 題。 下圖顯示資料集的前 5 筆資料與相關資訊。\n\n根據上述結果，下列何者正確？",
    "options": [
      "A. 資料集個數為 199 筆，變數個數為 4 個；",
      "B. sales 變數的中位數是 16.827；",
      "C. facebook 變數的第三四分位數(Q3)是 11.94；",
      "D. youtube 變數的第一四分位數(Q1)是 89.25"
    ],
    "answer": "D",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "統計基礎與機率分佈",
      "含附圖"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-049",
    "subject": "AIAP 中級 第二科",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "題組情境：使用銷售資料集(marketing.csv)進行迴歸分析，附圖程式碼展示資料載入與處理，請回答後續 48~50 題。 下圖顯示資料集的前 5 筆資料與相關資訊。\n\n參考下圖計算各變數的遺漏值(NaN)個數結果，下列何者正確？ 選項 A: df.isnull().sum() 選項 B: df.isNaN().sum() 選項 C: df.isna().sum() 選項 D: df.isnan().sum()",
    "options": [
      "A. 選項 D；",
      "B. 選項 B、選項 C、選項 D；",
      "C. 選項 A、選項 C；",
      "D. 選項 A、選項 B、選項 C"
    ],
    "answer": "C",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "資料前處理與特徵工程",
      "含附圖"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  },
  {
    "questionId": "aiap-114-2-2-050",
    "subject": "AIAP 中級 第二科",
    "topic": "分析建模與商業應用",
    "type": "single",
    "stem": "題組情境：使用銷售資料集(marketing.csv)進行迴歸分析，附圖程式碼展示資料載入與處理，請回答後續 48~50 題。 下圖顯示資料集的前 5 筆資料與相關資訊。\n\n考慮資料集已經填補遺漏值，參考下圖執行結果，下列何者正確？ A：空格 1 完整語法 reg = LinearRegression().fit(y, X) B：空格 1 完整語法 reg = LinearRegression().fit(X, y) C：print(reg.coef_) 結果為包括截距項等 4 個係數值 D：空格 2 完整語法 sm.OLS(X2, y).fit() E：model_sm 迴歸模型的所有迴歸係數在α=0.05 之下具有顯著的解釋力 F：截距項係數值為 3.5561",
    "options": [
      "A. B、C、F",
      "B. B、F",
      "C. A、C、D、F",
      "D. B、E"
    ],
    "answer": "B",
    "explanation": null,
    "tags": [
      "AIAP",
      "114第二梯次",
      "考古題",
      "大數據處理分析與應用",
      "分析建模與商業應用",
      "含附圖"
    ],
    "difficulty": 5,
    "source": "114 年第二梯次中級 AI 應用規劃師第二科公告試題"
  }
] satisfies Question[];
