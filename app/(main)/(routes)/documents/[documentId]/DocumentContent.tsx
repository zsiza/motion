// app/(main)/(routes)/documents/[documentId]/DocumentContent.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";

export default function DocumentContent({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const document = useQuery(api.documents.getByID, { documentId });

  if (document === undefined) return <div>Loading...</div>;
  if (document === null) return <div>Document not found</div>;

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
      </div>
    </div>
  );
}
