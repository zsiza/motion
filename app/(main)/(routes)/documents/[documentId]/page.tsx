// app/(main)/(routes)/documents/[documentId]/page.tsx
import { Id } from "@/convex/_generated/dataModel";
import DocumentContent from "./DocumentContent";

export default async function Page({
  params,
}: {
  params: Promise<{ documentId: Id<"documents"> }>;
}) {
  const { documentId } = await params;

  return <DocumentContent documentId={documentId} />;
}
