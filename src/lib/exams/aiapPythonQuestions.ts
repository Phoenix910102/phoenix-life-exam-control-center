import type { Question } from "@/types/question";

export const aiapPythonQuestions = [
  {
    "questionId": "aiap-python-001",
    "subject": "AIAP 中級 Python",
    "topic": "Python 資料操作",
    "type": "single",
    "stem": "[讀取資料] 要用 pandas 讀取 CSV 檔案成為 DataFrame，下列何者正確？",
    "options": [
      "A. pd.open_csv(\"data.csv\")",
      "B. pd.read_csv(\"data.csv\")",
      "C. pd.load(\"data.csv\")",
      "D. pd.csv(\"data.csv\")"
    ],
    "answer": "B",
    "explanation": "讀取資料：pandas 讀取 CSV 的標準函式是 read_csv。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "Python 資料操作"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-002",
    "subject": "AIAP 中級 Python",
    "topic": "Python 資料操作",
    "type": "single",
    "stem": "[前幾筆資料] 要查看資料表前 10 筆資料，應使用哪個指令？",
    "options": [
      "A. df.top(10)",
      "B. df.head(10)",
      "C. df.first(10)",
      "D. df.sample_top(10)"
    ],
    "answer": "B",
    "explanation": "前幾筆資料：head(n) 是取原資料排序下的前 n 筆，不代表最大。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "Python 資料操作"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-003",
    "subject": "AIAP 中級 Python",
    "topic": "Python 資料操作",
    "type": "single",
    "stem": "[Top N] 要找出 NA_Sales 最大的前 5 筆資料，最適合使用哪個指令？",
    "options": [
      "A. data.head(5)",
      "B. data.tail(5)",
      "C. data.nlargest(5, \"NA_Sales\")",
      "D. data.value_counts(\"NA_Sales\")"
    ],
    "answer": "C",
    "explanation": "Top N：看到最高、最大、Top N，優先想到 nlargest(n, 欄位)。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "Python 資料操作"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-004",
    "subject": "AIAP 中級 Python",
    "topic": "Python 資料操作",
    "type": "single",
    "stem": "[排序] 要依照 Score 由大到小排序，下列何者正確？",
    "options": [
      "A. df.sort_values(\"Score\", ascending=False)",
      "B. df.sort_values(\"Score\", ascending=True)",
      "C. df.order_by(\"Score\", desc=True)",
      "D. df.sort(\"Score\", reverse=True)"
    ],
    "answer": "A",
    "explanation": "排序：sort_values 搭配 ascending=False 表示由大到小。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "Python 資料操作"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-005",
    "subject": "AIAP 中級 Python",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "[缺失值檢查] 要統計每個欄位有多少缺失值，最常用哪個指令？",
    "options": [
      "A. df.isna().sum()",
      "B. df.na_count()",
      "C. df.missing()",
      "D. df.dropna().sum()"
    ],
    "answer": "A",
    "explanation": "缺失值檢查：isna() 產生 True/False，sum() 會把 True 當 1 加總。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "資料前處理與特徵工程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-006",
    "subject": "AIAP 中級 Python",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "[刪除缺失列] 要刪除含有缺失值的資料列 row，下列何者正確？",
    "options": [
      "A. df.dropna(axis=0)",
      "B. df.dropna(axis=1)",
      "C. df.fillna(axis=0)",
      "D. df.remove_na(columns=True)"
    ],
    "answer": "A",
    "explanation": "刪除缺失列：axis=0 是列方向；axis=1 是刪欄位。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "資料前處理與特徵工程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-007",
    "subject": "AIAP 中級 Python",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "[刪除缺失欄] 若某欄缺失太多，要刪除含 NaN 的欄位 column，應使用哪個方向？",
    "options": [
      "A. df.dropna(axis=0)",
      "B. df.dropna(axis=1)",
      "C. df.dropna(axis=\"rows\")",
      "D. df.fillna(axis=1)"
    ],
    "answer": "B",
    "explanation": "刪除缺失欄：dropna(axis=1) 是刪除含缺失值的欄。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "資料前處理與特徵工程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-008",
    "subject": "AIAP 中級 Python",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "[補值] 要用 Age 欄位的平均數補 Age 的缺失值，下列何者正確？",
    "options": [
      "A. df[\"Age\"].fillna(df[\"Age\"].mean())",
      "B. df[\"Age\"].dropna(df[\"Age\"].mean())",
      "C. df[\"Age\"].replace_na(\"mean\")",
      "D. df[\"Age\"].astype(\"mean\")"
    ],
    "answer": "A",
    "explanation": "補值：fillna(平均數) 是數值欄常見補值方法。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "資料前處理與特徵工程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-009",
    "subject": "AIAP 中級 Python",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "[可空整數] Year 欄位有 NaN，但仍希望保留整數年份語意，應用哪個 pandas 型別？",
    "options": [
      "A. df[\"Year\"].astype(int)",
      "B. df[\"Year\"].astype(\"Int64\")",
      "C. df[\"Year\"].astype(str).mean()",
      "D. df[\"Year\"].dropna(axis=1)"
    ],
    "answer": "B",
    "explanation": "可空整數：大寫 Int64 是 pandas nullable integer，可容納 <NA>。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "資料前處理與特徵工程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-010",
    "subject": "AIAP 中級 Python",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "[One-hot] 要將 City 這種名目類別欄位轉成 one-hot 欄位，最常用哪個 pandas 指令？",
    "options": [
      "A. pd.get_dummies(df[\"City\"])",
      "B. pd.to_numeric(df[\"City\"])",
      "C. df[\"City\"].mean()",
      "D. df.label(df[\"City\"])"
    ],
    "answer": "A",
    "explanation": "One-hot：get_dummies 會把類別展開成 0/1 欄位。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "資料前處理與特徵工程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-011",
    "subject": "AIAP 中級 Python",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "[Label Encoding] 若將類別 A/B/C 編成 0/1/2，最需要注意什麼？",
    "options": [
      "A. 模型可能誤以為類別有大小順序",
      "B. 會自動消除資料洩漏",
      "C. 只能用於圖片資料",
      "D. 會把所有資料變成常態分布"
    ],
    "answer": "A",
    "explanation": "Label Encoding：Label Encoding 對無序類別可能產生假順序。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "資料前處理與特徵工程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-012",
    "subject": "AIAP 中級 Python",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "[標準化] 要把數值特徵轉成平均約 0、標準差約 1，應使用哪個 sklearn 工具？",
    "options": [
      "A. MinMaxScaler",
      "B. StandardScaler",
      "C. OneHotEncoder",
      "D. LabelEncoder"
    ],
    "answer": "B",
    "explanation": "標準化：StandardScaler 對應 z-score 標準化。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "資料前處理與特徵工程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-013",
    "subject": "AIAP 中級 Python",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "[正規化] 要把數值縮放到 0 到 1 範圍，常用哪個工具？",
    "options": [
      "A. StandardScaler",
      "B. MinMaxScaler",
      "C. RobustScaler",
      "D. CountVectorizer"
    ],
    "answer": "B",
    "explanation": "正規化：MinMaxScaler 會依最小最大值縮放到指定範圍，常見為 0~1。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "資料前處理與特徵工程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-014",
    "subject": "AIAP 中級 Python",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "[Robust Scaling] 資料有明顯離群值時，哪個 scaling 方法通常較不容易被離群值拉歪？",
    "options": [
      "A. RobustScaler",
      "B. MinMaxScaler",
      "C. LabelEncoder",
      "D. train_test_split"
    ],
    "answer": "A",
    "explanation": "Robust Scaling：RobustScaler 使用中位數與 IQR，對離群值較穩。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "資料前處理與特徵工程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-015",
    "subject": "AIAP 中級 Python",
    "topic": "sklearn 建模流程",
    "type": "single",
    "stem": "[資料切分] 要將 X, y 切成訓練集與測試集，常用哪個函式？",
    "options": [
      "A. train_test_split(X, y, test_size=0.2)",
      "B. fit_split(X, y)",
      "C. split_train_test(y, X)",
      "D. cross_val_score(X, y)"
    ],
    "answer": "A",
    "explanation": "資料切分：train_test_split 是 sklearn 常用切分函式。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "sklearn 建模流程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-016",
    "subject": "AIAP 中級 Python",
    "topic": "sklearn 建模流程",
    "type": "single",
    "stem": "[模型訓練] sklearn 訓練模型的標準格式是什麼？",
    "options": [
      "A. model.fit(y, X)",
      "B. model.predict(X, y)",
      "C. model.train(y)",
      "D. model.fit(X, y)"
    ],
    "answer": "D",
    "explanation": "模型訓練：fit(X, y) 代表用特徵 X 和答案 y 訓練模型。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "sklearn 建模流程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-017",
    "subject": "AIAP 中級 Python",
    "topic": "sklearn 建模流程",
    "type": "single",
    "stem": "[模型預測] sklearn 已訓練模型要對 X_test 做預測，標準寫法為何？",
    "options": [
      "A. model.predict(X_test)",
      "B. model.fit(X_test)",
      "C. model.score(y_test)",
      "D. model.transform(y_test, X_test)"
    ],
    "answer": "A",
    "explanation": "模型預測：predict 只放特徵 X，因為預測時不應知道答案。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "sklearn 建模流程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-018",
    "subject": "AIAP 中級 Python",
    "topic": "sklearn 建模流程",
    "type": "single",
    "stem": "[線性迴歸] 要建立線性迴歸模型，最可能使用哪個類別？",
    "options": [
      "A. LinearRegression",
      "B. LogisticRegression",
      "C. KMeans",
      "D. DBSCAN"
    ],
    "answer": "A",
    "explanation": "線性迴歸：LinearRegression 用於連續數值預測，也就是回歸任務。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "sklearn 建模流程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-019",
    "subject": "AIAP 中級 Python",
    "topic": "sklearn 建模流程",
    "type": "single",
    "stem": "[邏輯斯迴歸] 要做二元分類，例如是否流失，常用哪個模型？",
    "options": [
      "A. LinearRegression",
      "B. LogisticRegression",
      "C. PCA",
      "D. MinMaxScaler"
    ],
    "answer": "B",
    "explanation": "邏輯斯迴歸：LogisticRegression 常用於二元分類，可輸出類別或機率。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "sklearn 建模流程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-020",
    "subject": "AIAP 中級 Python",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "[訓練資料洩漏] 使用 StandardScaler 時，為避免資料洩漏，正確流程是？",
    "options": [
      "A. 先 fit 全部資料再切 train/test",
      "B. 只在 X_train fit，再 transform X_train 和 X_test",
      "C. 只 transform y_test",
      "D. 先看測試集平均值再調整訓練集"
    ],
    "answer": "B",
    "explanation": "訓練資料洩漏：前處理器只能從訓練集學參數，再套用到測試集。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "資料前處理與特徵工程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-021",
    "subject": "AIAP 中級 Python",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "[Pipeline] sklearn Pipeline 的主要好處是什麼？",
    "options": [
      "A. 把前處理與模型訓練串成一致流程，降低洩漏與重複程式",
      "B. 讓模型不用資料也能訓練",
      "C. 把分類問題變成回歸問題",
      "D. 只能用來畫圖"
    ],
    "answer": "A",
    "explanation": "Pipeline：Pipeline 可把 scaler/imputer/model 串起來，交叉驗證時更安全。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "資料前處理與特徵工程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-022",
    "subject": "AIAP 中級 Python",
    "topic": "資料前處理與特徵工程",
    "type": "single",
    "stem": "[ColumnTransformer] 若數值欄要標準化、類別欄要 One-hot，最適合用什麼整合？",
    "options": [
      "A. ColumnTransformer",
      "B. LinearRegression",
      "C. plt.show()",
      "D. df.head()"
    ],
    "answer": "A",
    "explanation": "ColumnTransformer：ColumnTransformer 可對不同欄位套用不同前處理。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "資料前處理與特徵工程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-023",
    "subject": "AIAP 中級 Python",
    "topic": "模型評估與交叉驗證",
    "type": "single",
    "stem": "[混淆矩陣] 要計算分類模型的混淆矩陣，常用哪個函式？",
    "options": [
      "A. confusion_matrix(y_true, y_pred)",
      "B. mean_squared_error(y_true, y_pred)",
      "C. LinearRegression().fit(X, y)",
      "D. pd.read_csv(y_true)"
    ],
    "answer": "A",
    "explanation": "混淆矩陣：confusion_matrix 產生 TP/FP/FN/TN 的矩陣資訊。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "模型評估與交叉驗證"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-024",
    "subject": "AIAP 中級 Python",
    "topic": "模型評估與交叉驗證",
    "type": "single",
    "stem": "[Accuracy] 要計算分類正確率，常用哪個函式？",
    "options": [
      "A. accuracy_score(y_true, y_pred)",
      "B. precision_score(X, y)",
      "C. roc_auc_score(X_train)",
      "D. mean_absolute_error(y_true, y_pred)"
    ],
    "answer": "A",
    "explanation": "Accuracy：Accuracy 是整體預測正確比例。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "模型評估與交叉驗證"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-025",
    "subject": "AIAP 中級 Python",
    "topic": "模型評估與交叉驗證",
    "type": "single",
    "stem": "[Precision / Recall] 若題目重視「被模型判為正類的人，有多少真的為正」，對應哪個指標？",
    "options": [
      "A. Recall",
      "B. Precision",
      "C. MSE",
      "D. R2"
    ],
    "answer": "B",
    "explanation": "Precision / Recall：Precision = TP / (TP + FP)，管的是預測為正的純度。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "模型評估與交叉驗證"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-026",
    "subject": "AIAP 中級 Python",
    "topic": "模型評估與交叉驗證",
    "type": "single",
    "stem": "[Recall] 若題目重視「所有真正正類中，模型抓到了多少」，對應哪個指標？",
    "options": [
      "A. Precision",
      "B. Recall",
      "C. Silhouette",
      "D. Support"
    ],
    "answer": "B",
    "explanation": "Recall：Recall = TP / (TP + FN)，管的是漏抓多少。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "模型評估與交叉驗證"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-027",
    "subject": "AIAP 中級 Python",
    "topic": "模型評估與交叉驗證",
    "type": "single",
    "stem": "[F1] 資料不平衡時，想同時考慮 Precision 與 Recall，常用哪個指標？",
    "options": [
      "A. F1-score",
      "B. R2",
      "C. MAE",
      "D. Explained variance of PCA"
    ],
    "answer": "A",
    "explanation": "F1：F1 是 Precision 與 Recall 的調和平均。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "模型評估與交叉驗證"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-028",
    "subject": "AIAP 中級 Python",
    "topic": "Python 資料操作",
    "type": "single",
    "stem": "[ROC AUC] 計算 ROC AUC 時，通常應給模型的什麼輸出？",
    "options": [
      "A. 類別名稱字串",
      "B. 正類機率或 decision score",
      "C. DataFrame 欄位名稱",
      "D. 模型訓練時間"
    ],
    "answer": "B",
    "explanation": "ROC AUC：AUC 評估不同 threshold 下排序能力，通常用機率或分數。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "Python 資料操作"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-029",
    "subject": "AIAP 中級 Python",
    "topic": "模型評估與交叉驗證",
    "type": "single",
    "stem": "[迴歸評估] 若要評估房價預測誤差的平均絕對差距，常用哪個指標？",
    "options": [
      "A. MAE",
      "B. Accuracy",
      "C. Recall",
      "D. Lift"
    ],
    "answer": "A",
    "explanation": "迴歸評估：MAE 是 Mean Absolute Error，數值越小誤差越小。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "模型評估與交叉驗證"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-030",
    "subject": "AIAP 中級 Python",
    "topic": "模型評估與交叉驗證",
    "type": "single",
    "stem": "[MSE / RMSE] 若希望較大誤差被懲罰得更重，常用哪種迴歸誤差？",
    "options": [
      "A. MSE / RMSE",
      "B. Accuracy",
      "C. Support",
      "D. One-hot Encoding"
    ],
    "answer": "A",
    "explanation": "MSE / RMSE：MSE 會平方誤差，大誤差影響較大。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "模型評估與交叉驗證"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-031",
    "subject": "AIAP 中級 Python",
    "topic": "模型評估與交叉驗證",
    "type": "single",
    "stem": "[K-fold] K-fold cross validation 的主要目的為何？",
    "options": [
      "A. 只用一次切分估計模型",
      "B. 多次切分訓練/驗證，較穩定評估模型表現",
      "C. 刪除所有缺失值",
      "D. 只用於圖片卷積"
    ],
    "answer": "B",
    "explanation": "K-fold：K-fold 讓每一份輪流當驗證集，評估更穩。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "模型評估與交叉驗證"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-032",
    "subject": "AIAP 中級 Python",
    "topic": "模型評估與交叉驗證",
    "type": "single",
    "stem": "[StratifiedKFold] 分類資料類別比例不平衡時，若希望每折維持類別比例，應用哪個方法？",
    "options": [
      "A. KMeans",
      "B. StratifiedKFold",
      "C. PCA",
      "D. MinMaxScaler"
    ],
    "answer": "B",
    "explanation": "StratifiedKFold：StratifiedKFold 會盡量保持各 fold 的類別比例。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "模型評估與交叉驗證"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-033",
    "subject": "AIAP 中級 Python",
    "topic": "模型評估與交叉驗證",
    "type": "single",
    "stem": "[GridSearchCV] 要用交叉驗證搜尋多組超參數組合，常用哪個工具？",
    "options": [
      "A. GridSearchCV",
      "B. read_csv",
      "C. countplot",
      "D. dropna"
    ],
    "answer": "A",
    "explanation": "GridSearchCV：GridSearchCV 會測試參數網格並用 CV 評估。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "模型評估與交叉驗證"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-034",
    "subject": "AIAP 中級 Python",
    "topic": "sklearn 建模流程",
    "type": "single",
    "stem": "[隨機森林] RandomForestClassifier 常見特性為何？",
    "options": [
      "A. 由多棵決策樹集成，分類時投票或平均機率",
      "B. 只能處理文字摘要",
      "C. 必須先指定神經元數量",
      "D. 只是一種資料視覺化工具"
    ],
    "answer": "A",
    "explanation": "隨機森林：隨機森林是 bagging 類集成模型，由多棵樹組成。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "sklearn 建模流程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-035",
    "subject": "AIAP 中級 Python",
    "topic": "sklearn 建模流程",
    "type": "single",
    "stem": "[predict_proba] 若要取得分類模型對各類別的預測機率，常用哪個方法？",
    "options": [
      "A. predict_proba(X)",
      "B. fit_proba(y)",
      "C. drop_proba(X)",
      "D. score_proba(y)"
    ],
    "answer": "A",
    "explanation": "predict_proba：支援機率輸出的分類器可用 predict_proba。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "sklearn 建模流程"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-036",
    "subject": "AIAP 中級 Python",
    "topic": "分群與降維",
    "type": "single",
    "stem": "[KMeans] KMeans 進行分群時，通常需要事先指定什麼？",
    "options": [
      "A. n_clusters",
      "B. y_test",
      "C. 類別標籤名稱",
      "D. 混淆矩陣"
    ],
    "answer": "A",
    "explanation": "KMeans：KMeans 要先指定分成幾群。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "分群與降維"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-037",
    "subject": "AIAP 中級 Python",
    "topic": "分群與降維",
    "type": "single",
    "stem": "[DBSCAN] DBSCAN 與 KMeans 相比，哪個敘述較正確？",
    "options": [
      "A. DBSCAN 一定要指定群數",
      "B. DBSCAN 透過密度概念找群，較能標出離群點",
      "C. DBSCAN 只能做迴歸",
      "D. DBSCAN 是影像池化層"
    ],
    "answer": "B",
    "explanation": "DBSCAN：DBSCAN 使用 eps 與 min_samples，不需直接指定群數，能標示噪聲點。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "分群與降維"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-038",
    "subject": "AIAP 中級 Python",
    "topic": "分群與降維",
    "type": "single",
    "stem": "[Silhouette] 要評估分群結果「群內相似、群間分離」程度，常用哪個分數？",
    "options": [
      "A. silhouette_score",
      "B. accuracy_score",
      "C. roc_auc_score",
      "D. mean_squared_error"
    ],
    "answer": "A",
    "explanation": "Silhouette：Silhouette 常用於分群品質評估。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "分群與降維"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-039",
    "subject": "AIAP 中級 Python",
    "topic": "分群與降維",
    "type": "single",
    "stem": "[PCA] PCA 在資料分析中主要用於什麼？",
    "options": [
      "A. 降維並保留主要變異方向",
      "B. 補缺失值",
      "C. 把文字翻譯成英文",
      "D. 計算分類 Recall"
    ],
    "answer": "A",
    "explanation": "PCA：PCA 是線性降維方法，常看 explained variance ratio。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "分群與降維"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-040",
    "subject": "AIAP 中級 Python",
    "topic": "Python 資料操作",
    "type": "single",
    "stem": "[NumPy axis] 對二維陣列 arr 使用 np.mean(arr, axis=0)，通常是在算什麼？",
    "options": [
      "A. 每一欄 column 的平均",
      "B. 每一列 row 的平均",
      "C. 最大前 5 筆",
      "D. 刪除欄位"
    ],
    "answer": "A",
    "explanation": "NumPy axis：axis=0 是沿列方向往下聚合，結果通常是各欄平均。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "Python 資料操作"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-041",
    "subject": "AIAP 中級 Python",
    "topic": "Python 資料操作",
    "type": "single",
    "stem": "[merge] 要依照 user_id 把 users 表與 orders 表合併，最常用哪個 pandas 函式？",
    "options": [
      "A. pd.merge(users, orders, on=\"user_id\")",
      "B. pd.concat(users, orders, key=\"user_id\")",
      "C. users.head(orders)",
      "D. orders.sort_values(users)"
    ],
    "answer": "A",
    "explanation": "merge：merge 是依 key 做類似 SQL JOIN 的合併。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "Python 資料操作"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-042",
    "subject": "AIAP 中級 Python",
    "topic": "Python 資料操作",
    "type": "single",
    "stem": "[groupby] 要計算每個 Genre 的平均 NA_Sales，應使用哪個寫法？",
    "options": [
      "A. data.groupby(\"Genre\")[\"NA_Sales\"].mean()",
      "B. data[\"Genre\"].mean(\"NA_Sales\")",
      "C. data.mean_by(\"Genre\", \"NA_Sales\")",
      "D. data.nlargest(\"Genre\", \"NA_Sales\")"
    ],
    "answer": "A",
    "explanation": "groupby：groupby(類別欄)[數值欄].mean() 是典型分組平均。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "Python 資料操作"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-043",
    "subject": "AIAP 中級 Python",
    "topic": "Python 資料操作",
    "type": "single",
    "stem": "[value_counts] 要統計 Genre 欄位每個類別出現幾次，應使用？",
    "options": [
      "A. data[\"Genre\"].value_counts()",
      "B. data[\"Genre\"].mean()",
      "C. data.value_count_by(\"Genre\")",
      "D. data[\"Genre\"].barplot()"
    ],
    "answer": "A",
    "explanation": "value_counts：value_counts 用來算單一類別欄位的次數分布。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "Python 資料操作"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-044",
    "subject": "AIAP 中級 Python",
    "topic": "Python 資料操作",
    "type": "single",
    "stem": "[corr] 要計算數值欄位間的相關係數矩陣，常用哪個指令？",
    "options": [
      "A. df.corr()",
      "B. df.countplot()",
      "C. df.get_dummies()",
      "D. df.fit(X, y)"
    ],
    "answer": "A",
    "explanation": "corr：corr 會計算數值欄位間的 correlation matrix。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "Python 資料操作"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-045",
    "subject": "AIAP 中級 Python",
    "topic": "資料視覺化",
    "type": "single",
    "stem": "[seaborn barplot] 要畫類別與數值大小比較，例如各 Genre 平均銷售額，常用哪個圖？",
    "options": [
      "A. sns.barplot()",
      "B. sns.countplot()",
      "C. sns.scatterplot()",
      "D. sns.heatmap()"
    ],
    "answer": "A",
    "explanation": "seaborn barplot：barplot 用於比較類別對應的數值。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "資料視覺化"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-046",
    "subject": "AIAP 中級 Python",
    "topic": "資料視覺化",
    "type": "single",
    "stem": "[seaborn countplot] 要畫 Genre 每個類別出現次數，常用哪個圖？",
    "options": [
      "A. sns.countplot(x=\"Genre\", data=data)",
      "B. sns.barplot(x=\"Genre\", y=\"NA_Sales\", data=data)",
      "C. sns.lineplot(x=\"Genre\", data=data)",
      "D. sns.heatmap(data[\"Genre\"])"
    ],
    "answer": "A",
    "explanation": "seaborn countplot：countplot 直接計算類別出現次數。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "資料視覺化"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-047",
    "subject": "AIAP 中級 Python",
    "topic": "資料視覺化",
    "type": "single",
    "stem": "[seaborn scatterplot] 要看兩個數值欄位之間是否有關係，例如廣告費與銷售額，常用哪個圖？",
    "options": [
      "A. sns.scatterplot(x=\"ad\", y=\"sales\", data=df)",
      "B. sns.countplot(x=\"ad\", data=df)",
      "C. sns.boxplot(x=\"sales\", data=df)",
      "D. sns.get_dummies(df)"
    ],
    "answer": "A",
    "explanation": "seaborn scatterplot：scatterplot 用來看兩個數值變數的關係與分布。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "資料視覺化"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-048",
    "subject": "AIAP 中級 Python",
    "topic": "模型評估與交叉驗證",
    "type": "single",
    "stem": "[heatmap] 要將相關係數矩陣或混淆矩陣視覺化，常用哪個 seaborn 圖？",
    "options": [
      "A. sns.heatmap(matrix, annot=True)",
      "B. sns.lineplot(matrix)",
      "C. sns.countplot(matrix)",
      "D. sns.read_csv(matrix)"
    ],
    "answer": "A",
    "explanation": "heatmap：heatmap 適合顯示矩陣資料，annot=True 可顯示數字。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "模型評估與交叉驗證"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-049",
    "subject": "AIAP 中級 Python",
    "topic": "深度學習基礎",
    "type": "single",
    "stem": "[Max-pool] 在 CNN 中，max-pooling 的主要功能是什麼？",
    "options": [
      "A. 保留局部區域最大反應，縮小特徵圖尺寸",
      "B. 把所有像素轉成文字 token",
      "C. 直接計算分類 Accuracy",
      "D. 把類別欄位做 One-hot"
    ],
    "answer": "A",
    "explanation": "Max-pool：Max-pooling 取每個小視窗最大值，保留最強特徵並降維。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "深度學習基礎"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  },
  {
    "questionId": "aiap-python-050",
    "subject": "AIAP 中級 Python",
    "topic": "深度學習基礎",
    "type": "single",
    "stem": "[Keras MaxPooling2D] 若使用 Keras 建立 CNN，哪個層最像「2x2 max-pooling」？",
    "options": [
      "A. MaxPooling2D(pool_size=(2, 2))",
      "B. Dense(2, activation=\"max\")",
      "C. Dropout(pool_size=2)",
      "D. StandardScaler(pool_size=2)"
    ],
    "answer": "A",
    "explanation": "Keras MaxPooling2D：Keras 的 MaxPooling2D 可指定 pool_size，例如 2x2。",
    "tags": [
      "AIAP",
      "Python",
      "pandas",
      "sklearn",
      "seaborn",
      "模擬題",
      "非官方",
      "深度學習基礎"
    ],
    "difficulty": 4,
    "source": "AIAP 中級 Python 練習題（DOCX，非官方）"
  }
] satisfies Question[];
