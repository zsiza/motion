"use client";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";
import {
  useCreateBlockNoteWithLiveblocks,
  FloatingComposer,
  FloatingThreads,
} from "@liveblocks/react-blocknote";
import { useThreads } from "@liveblocks/react";
import { useMediaQuery } from "usehooks-ts";
import NotificationsPopover from "./notifications-popover";
import VersionsDialog from "./version-history-dialog";
import { Spinner } from "./spinner";

import {
  defaultBlockSchema,
  defaultInlineContentSchema,
  defaultStyleSchema,
  DefaultBlockSchema,
  DefaultInlineContentSchema,
  DefaultStyleSchema,
} from "@blocknote/core";
interface EditorProps {
  editable?: boolean;
}

const Editor = ({ editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ file });
    return response.url;
  };

  const editor = useCreateBlockNoteWithLiveblocks<
    DefaultBlockSchema,
    DefaultInlineContentSchema,
    DefaultStyleSchema
  >({
    uploadFile: handleUpload,
  });

  if (!editor) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const { threads } = useThreads();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div
      className="relative min-h-screen flex flex-col"
      data-theme={resolvedTheme === "dark" ? "dark" : "light"}
    >
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        editable={editable}
      />

      <FloatingComposer editor={editor} className="w-[350px]" />

      {threads &&
        (isMobile ? (
          <FloatingThreads threads={threads} editor={editor} />
        ) : (
          <FloatingThreads
            threads={threads}
            editor={editor}
            className="w-[350px] xl:mr-[100px] mr-[50px]"
          />
        ))}
    </div>
  );
};

export default Editor;
