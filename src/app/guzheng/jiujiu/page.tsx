import Link from "next/link";
import { ArrowLeft, Music2 } from "lucide-react";
import { JiujiuElectronicScore } from "@/components/guzheng/jiujiu-electronic-score";
import { JiujiuScoreReader } from "@/components/guzheng/jiujiu-score-reader";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export default function JiujiuPracticePage() {
  return (
    <main className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-[#70582c] bg-[#14201b] px-4 py-4 text-[#f6ecd2] shadow-[0_12px_36px_rgba(20,32,27,0.18)] sm:px-5">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-medium text-[#d6b15c]">
            <Music2 className="h-4 w-4" />
            墨韻隨步搖版 · 歌詞對照
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-[#fff8e8]">《九九八十一》古箏專用譜</h1>
          <div className="mt-3 flex gap-2 text-xs text-[#b9c4be]">
            <span className="rounded-md border border-[#4d5f56] px-2 py-1">原譜 1=B</span>
            <span className="rounded-md border border-[#4d5f56] px-2 py-1">收音可選 D / B 調</span>
            <span className="rounded-md border border-[#4d5f56] px-2 py-1">六頁</span>
            <span className="rounded-md border border-[#4d5f56] px-2 py-1">OCR 電子譜</span>
            <span className="rounded-md border border-[#4d5f56] px-2 py-1">逐音指法</span>
          </div>
        </div>
        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-[#6b755d] bg-[#1c2923] text-[#eee3c6] hover:bg-[#29382f]",
          )}
          href="/guzheng"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回聽音練習
        </Link>
      </div>

      <JiujiuElectronicScore />

      <div className="border-l-2 border-[#a88338] px-4 py-2">
        <p className="text-sm font-medium text-[#32463c]">原手寫雙手譜對照</p>
        <p className="mt-1 text-xs leading-5 text-[#617068]">電子譜先練主旋律；熟悉後，再從原譜加入左手伴奏、滑奏與特殊技巧。</p>
      </div>

      <JiujiuScoreReader />
    </main>
  );
}
