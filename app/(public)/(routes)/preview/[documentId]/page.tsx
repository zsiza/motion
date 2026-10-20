"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react";
import { LiveList } from "@liveblocks/client";
import { DocumentContent } from "@/components/document-content";
import CollaborativeCursors from "@/components/collaborative-cursors";

interface DocumentIdPageProps {
  params: Promise<{ documentId: Id<"documents"> }>;
}

const DocumentIdPage = (props: DocumentIdPageProps) => {
  const params = use(props.params);
  const document = useQuery(api.documents.getByID, {
    documentId: params.documentId,
  });

  if (document === undefined)
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );

  if (document === null) return <div>Document not found</div>;

  return (
    <div className="pb-40">
      <Cover preview url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <LiveblocksProvider
          authEndpoint="/api/liveblocks-auth"
          resolveUsers={async ({ userIds }) => {
            const { users } = await fetch("/api/liveblocks/resolve-users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userIds }),
            }).then((res) => res.json());

            return users;
          }}
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
              <CollaborativeCursors />
            </ClientSideSuspense>
          </RoomProvider>
        </LiveblocksProvider>
      </div>
    </div>
  );
};

export default DocumentIdPage;
