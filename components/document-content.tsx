"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { useStorage } from "@liveblocks/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import Editor from "@/components/editor";

interface DocumentContentProps {
  document: Doc<"documents">;
  params: { documentId: Id<"documents"> };
}

export const DocumentContent = ({ document, params }: DocumentContentProps) => {
  const update = useMutation(api.documents.update);
  const content = useStorage((root) => root.content);

  useEffect(() => {
    if (!content) return;
    const interval = setInterval(() => {
      update({
        id: params.documentId,
        content: JSON.stringify(content),
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [content, update, params.documentId]);

  return (
    <>
      <Toolbar initialData={document} />
      <Editor editable />
    </>
  );
};
