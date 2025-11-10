"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { useMemo, useEffect } from "react";
import { useStorage } from "@liveblocks/react";
import { LiveObject, LiveList } from "@liveblocks/client";

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
  useRoom,
} from "@liveblocks/react/suspense";
import { useUser } from "@clerk/nextjs";

interface DocumentIdPageProps {
  params: { documentId: Id<"documents"> };
}

export const DocumentContent = ({ document, params }: any) => {
  const room = useRoom();
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

  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  return (
    <>
      <Toolbar initialData={document} />
      <Editor editable />
    </>
  );
};

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const { user } = useUser();

  const document = useQuery(api.documents.getByID, {
    documentId: params.documentId,
  });

  if (document === undefined) return <Skeleton className="h-screen" />;

  if (document === null) return <div>Document not found</div>;

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <LiveblocksProvider
          resolveUsers={async ({ userIds }) => {
            const { users } = await fetch("/api/liveblocks/resolve-users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userIds }),
            }).then((res) => res.json());

            return users;
          }}
          authEndpoint="/api/liveblocks-auth"
        >
          <RoomProvider
            id={params.documentId}
            initialPresence={{ cursor: null }}
            initialStorage={{
              content: new LiveList(
                document.content ? JSON.parse(document.content) : []
              ),
            }}
          >
            <ClientSideSuspense fallback={<div>Loading…</div>}>
              <DocumentContent document={document} params={params} />
            </ClientSideSuspense>
          </RoomProvider>
        </LiveblocksProvider>
      </div>
    </div>
  );
};

export default DocumentIdPage;
