"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import { LiveList } from "@liveblocks/client";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react";
import CollaborativeCursors from "@/components/collaborative-cursors";
import { DocumentContent } from "@/components/document-content";
import { Spinner } from "@/components/spinner";

interface DocumentIdPageProps {
  params: Promise<{ documentId: Id<"documents"> }>;
}

const DocumentIdPage = (props: DocumentIdPageProps) => {
  const params = use(props.params);
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
            <ClientSideSuspense
              fallback={
                <div className="min-h-screen  flex items-center justify-center">
                  <Spinner size="lg" />
                </div>
              }
            >
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
