export type JiujiuFinger = "托" | "抹" | "勾" | "連托" | "按 7" | "休止";

export type JiujiuElectronicNote = {
  id: string;
  degree: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
  octave: 0 | 1;
  lyric: string;
  finger: JiujiuFinger;
  duration: number;
};

export type JiujiuElectronicPhrase = {
  id: string;
  title: string;
  lyric: string;
  sourceMeasure: string;
  practiceTip: string;
  notes: JiujiuElectronicNote[];
};

export const JIUJIU_FINGER_GUIDE: Record<JiujiuFinger, string> = {
  托: "右手大指戴義甲，從掌心方向向外撥弦；撥完立即放鬆，不要抬高手腕。",
  抹: "右手食指向掌心方向撥弦；指根穩定，只讓指節自然收回。",
  勾: "右手中指向掌心方向撥弦；觸弦後俐落離弦，避免碰到旁弦。",
  連托: "同音連續出現時，用大指連續向外托；每一下都先回到弦旁，再開始下一音。",
  "按 7": "先找同音區的 6 弦。左手在雁柱左側向下按弦，把 6 升高到 7，再用右手托弦；先慢慢校準音高。",
  休止: "這一拍不彈。手留在琴弦附近，心裡繼續數拍，準備下一個音。",
};

const FINGER_PATTERN: JiujiuFinger[] = ["托", "抹", "托", "勾"];

function makePhrase(
  id: string,
  title: string,
  lyric: string,
  sourceMeasure: string,
  practiceTip: string,
  tokens: string[],
  lyricParts: string[],
): JiujiuElectronicPhrase {
  const notes = tokens.map((token, index) => {
    const degree = token.replace("+", "") as JiujiuElectronicNote["degree"];
    const previousDegree = index > 0 ? tokens[index - 1].replace("+", "") : null;
    let finger: JiujiuFinger = FINGER_PATTERN[index % FINGER_PATTERN.length];

    if (degree === "0") finger = "休止";
    else if (degree === "7") finger = "按 7";
    else if (degree === previousDegree) finger = "連托";

    return {
      id: `${id}-n${index + 1}`,
      degree,
      octave: (token.endsWith("+") ? 1 : 0) as JiujiuElectronicNote["octave"],
      lyric: lyricParts[index] ?? "",
      finger,
      duration: degree === "0" ? 0.8 : index === tokens.length - 1 ? 1.25 : 1,
    };
  });

  return { id, title, lyric, sourceMeasure, practiceTip, notes };
}

// OCR is used to locate the printed measures; these melody digits were then checked
// against the uploaded printed score. Fingering is a separate beginner suggestion.
export const JIUJIU_ELECTRONIC_PHRASES: JiujiuElectronicPhrase[] = [
  makePhrase(
    "verse-01",
    "上路鞏州",
    "上路，鞏州",
    "主歌第 1 行 · 第 1 小節",
    "第一個低音 6 不加高音點，後面四音移到高音區。先只練換弦位置。",
    ["6", "6+", "6+", "2+", "1+"],
    ["上", "路", "鞏", "州", ""],
  ),
  makePhrase(
    "verse-02",
    "遇虎熊",
    "遇虎熊，五百年",
    "主歌第 1 行 · 第 2 小節",
    "三個高音 3 要平均，不要因連托而加速。",
    ["2+", "1+", "3+", "3+", "3+", "2+", "1+"],
    ["遇", "虎", "熊", "五", "百", "年", ""],
  ),
  makePhrase(
    "verse-03",
    "一場瘋",
    "前一場瘋，騰霄",
    "主歌第 1 行 · 第 3 小節",
    "2、1 之間保持手型不變，讓手指輪流完成撥弦。",
    ["2+", "2+", "1+", "2+", "2+", "1+"],
    ["前", "一", "場", "瘋", "騰", "霄"],
  ),
  makePhrase(
    "verse-04",
    "孫悟空",
    "又是孫悟空",
    "主歌第 1 行 · 第 4 小節",
    "到高音 5 時手臂向右平移，不要伸直手指硬搆琴弦。",
    ["2+", "3+", "5+", "5+", "2+", "3+"],
    ["又", "是", "孫", "悟", "空", ""],
  ),
  makePhrase(
    "verse-05",
    "失馬鷹愁",
    "失馬，鷹愁",
    "主歌第 1 行 · 第 5 小節",
    "6 回到 2 的跨度較大，眼睛先看下一條弦，再移動右手。",
    ["3+", "6+", "6+", "2+", "1+"],
    ["失", "馬", "鷹", "愁", ""],
  ),
  makePhrase(
    "verse-06",
    "澗飛白龍",
    "澗飛白龍，沙河阻",
    "主歌第 2 行 · 第 1 小節",
    "0 是休止。停音時仍要數拍，下一個 3 才不會搶拍。",
    ["2+", "3+", "5+", "3+", "0", "3+", "2+", "1+"],
    ["澗", "飛", "白", "龍", "", "沙", "河", "阻"],
  ),
  makePhrase(
    "verse-07",
    "路難通",
    "斷路難通，福陵",
    "主歌第 2 行 · 第 2 小節",
    "先用固定慢速把六個音彈平均，再跟著歌詞加重「通」字。",
    ["2+", "2+", "1+", "2+", "2+", "1+"],
    ["斷", "路", "難", "通", "福", "陵"],
  ),
  makePhrase(
    "verse-08",
    "收天蓬",
    "山中收天蓬",
    "主歌第 2 行 · 第 3 小節",
    "2 到 6 是大跳，整隻右手移位，手腕高度保持不變。",
    ["3+", "2+", "6+", "6+", "5+", "6+"],
    ["山", "中", "收", "天", "蓬", ""],
  ),
  makePhrase(
    "verse-09",
    "嶺上前行",
    "嶺上前行",
    "主歌第 2 行 · 第 4 小節",
    "三個 6 要像說話一樣清楚分開，最後的 2、1 再自然收句。",
    ["6+", "6+", "6+", "2+", "1+"],
    ["嶺", "上", "前", "行", ""],
  ),
  makePhrase(
    "verse-10",
    "逆黃風",
    "逆黃風，七星不",
    "主歌第 2 行 · 第 5 小節",
    "休止前的 3 要乾淨離弦；休止後重新以托起句。",
    ["2+", "1+", "3+", "0", "3+", "2+", "1+"],
    ["逆", "黃", "風", "", "七", "星", "不"],
  ),
  makePhrase(
    "verse-11",
    "波月洞",
    "照波月洞，千年",
    "主歌第 3 行 · 第 1 小節",
    "連續 2 用相同音量，句尾 1 稍微收輕。",
    ["2+", "2+", "1+", "2+", "2+", "1+"],
    ["照", "波", "月", "洞", "千", "年"],
  ),
  makePhrase(
    "verse-12",
    "白骨陰風",
    "白骨化陰風",
    "主歌第 3 行 · 第 2 小節",
    "高音 5 連奏時，大指每次都回到弦旁，不要用手臂上下敲弦。",
    ["2+", "3+", "5+", "5+", "2+", "3+"],
    ["白", "骨", "化", "陰", "風", ""],
  ),
  makePhrase(
    "verse-13",
    "魚籃網",
    "魚籃網通天一尾",
    "主歌第 3 行 · 第 3 小節",
    "6 的同音連奏先分開，回到 2、1 時手臂整體左移。",
    ["3+", "6+", "6+", "2+", "1+"],
    ["魚籃", "網", "通天", "一", "尾"],
  ),
  makePhrase(
    "verse-14",
    "紫金葫蘆",
    "紅，紫金葫蘆二道童",
    "主歌第 3 行 · 第 4 小節",
    "中間的休止要完整留下；不要把前後兩句連成一串。",
    ["2+", "3+", "5+", "3+", "0", "3+", "2+", "1+"],
    ["紅", "紫", "金", "葫", "", "蘆", "二", "道童"],
  ),
  makePhrase(
    "verse-15",
    "九尾老狐",
    "九尾老狐",
    "主歌第 3 行 · 第 5 小節",
    "這一型與第 3 小節相同，利用熟悉的手型，不要重新找弦。",
    ["2+", "2+", "1+", "2+", "2+", "1+"],
    ["九", "尾", "老", "狐", "", ""],
  ),
  makePhrase(
    "verse-16",
    "敢壓龍",
    "敢壓龍",
    "主歌第 4 行 · 第 1 小節",
    "先看準 2 到 6 的跨距，最後一個 6 稍微延長，完成第一課。",
    ["3+", "2+", "6+", "6+", "5+", "6+"],
    ["敢", "壓", "龍", "", "", ""],
  ),
  makePhrase(
    "verse-17",
    "白虹墜",
    "白虹墜",
    "主歌第 4 行 · 第 2 小節",
    "7 不是基本空弦音：先按住高音 6 弦，把音高推到 7，再用右手托。左手不要一次壓到底。",
    ["6+", "1+", "7+", "6+"],
    ["白", "虹", "墜", ""],
  ),
  makePhrase(
    "verse-18",
    "雪浪擊石碎",
    "雪浪擊石碎",
    "主歌第 4 行 · 第 3 小節",
    "5、6 反覆時用固定手型輪指，音量要平均，不要讓連托特別突出。",
    ["6+", "5+", "5+", "6+", "5+", "6+"],
    ["雪", "浪", "擊", "石", "碎", ""],
  ),
  makePhrase(
    "verse-19",
    "思歸難歸",
    "思歸難歸，墮回",
    "主歌第 4 行 · 第 4 小節",
    "只在相鄰兩條弦間移動，保持手掌圓弧，不要跟著每個音左右搖腕。",
    ["6+", "5+", "6+", "5+", "6+", "5+"],
    ["思", "歸", "難", "歸", "墮", "回"],
  ),
  makePhrase(
    "verse-20",
    "輪回月滿",
    "輪回，月滿一",
    "主歌第 4 行 · 第 5 小節",
    "最後的 1、2 向右移位，手臂帶著手掌一起走，指尖仍維持相同角度。",
    ["5+", "6+", "5+", "6+", "1+", "2+"],
    ["輪", "回", "月", "滿", "一", ""],
  ),
  makePhrase(
    "verse-21",
    "江水莫追",
    "江水前世莫追",
    "主歌第 5 行 · 第 1 小節",
    "把六個音當成一個完整收句；最後的 3 稍微延長，但手腕仍要放鬆。",
    ["3+", "2+", "3+", "2+", "2+", "3+"],
    ["江", "水", "前", "世", "莫", "追"],
  ),
];
