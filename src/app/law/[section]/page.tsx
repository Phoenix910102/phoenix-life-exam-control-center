import { LawSectionPlaceholder } from "@/components/law/LawSectionPlaceholder";

export default async function LawSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return <LawSectionPlaceholder section={decodeURIComponent(section)} />;
}
