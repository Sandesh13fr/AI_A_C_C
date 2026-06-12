import { AnalysisRunClient } from "./analysis-detail-client";

export default async function AnalysisRunPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AnalysisRunClient id={id} />;
}
