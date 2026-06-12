import { KnowledgeBaseDetailClient } from "./knowledge-base-detail-client";

export default async function KnowledgeBaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <KnowledgeBaseDetailClient id={id} />;
}
