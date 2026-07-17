import { QuestionSessionController } from "@/components/law/question-engine/QuestionSessionController";

export default async function LegalPracticeSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <QuestionSessionController requestedSessionId={decodeURIComponent(sessionId)} />;
}
