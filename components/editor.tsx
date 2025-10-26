"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useEffect, useMemo } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import {
  BlockNoteEditorOptions,
  BlockNoteEditor,
  BlockSchema,
  InlineContentSchema,
  StyleSchema,
  PartialBlock,
} from "@blocknote/core";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";
import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import { Cursor } from "./cursor";
import {
  useCreateBlockNoteWithLiveblocks,
  FloatingComposer,
  AnchoredThreads,
  FloatingThreads,
} from "@liveblocks/react-blocknote";
import { useThreads } from "@liveblocks/react";
import { useMediaQuery } from "usehooks-ts";
import NotificationsPopover from "./notifications-popover";
import VersionsDialog from "./version-history-dialog";
import {
  DefaultBlockSchema,
  DefaultInlineContentSchema,
  DefaultStyleSchema,
} from "@blocknote/core";

interface EditorProps {
  onChange?: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();
  const userCount = others.length;

  function handlePointerMove(e: React.PointerEvent) {
    const cursor = { x: Math.floor(e.clientX), y: Math.floor(e.clientY) };
    updateMyPresence({ cursor });
  }

  function handlePointerLeave(e: React.PointerEvent) {
    updateMyPresence({ cursor: null });
  }

  const handleUpload = async (file: File): Promise<string> => {
    const response = await edgestore.publicFiles.upload({ file });
    return response.url;
  };

  const editor = useCreateBlockNoteWithLiveblocks<
    DefaultBlockSchema,
    DefaultInlineContentSchema,
    DefaultStyleSchema
  >(
    {
      initialContent: initialContent
        ? (JSON.parse(initialContent) as PartialBlock[])
        : undefined,
      uploadFile: handleUpload,
    },
    { mentions: true }
  );

  const stableEditor = useMemo(() => editor, []);

  useEffect(() => {
    if (!stableEditor || !onChange) return;

    const unsubscribe = stableEditor.onChange(() => {
      const content = JSON.stringify(stableEditor.document);
      onChange(content);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [stableEditor, onChange]);

  function Threads({ editor }: { editor: BlockNoteEditor | null }) {
    const { threads } = useThreads();
    const isMobile = useMediaQuery("(max-width: 768px)");

    if (!threads || !stableEditor) {
      return null;
    }

    return isMobile ? (
      <FloatingThreads threads={threads} editor={stableEditor} />
    ) : (
      <FloatingThreads
        threads={threads}
        editor={stableEditor}
        className="w-[350px] xl:mr-[100px] mr-[50px]"
      />
    );
  }
  return (
    <div
      className="relative min-h-screen flex flex-col"
      data-theme={resolvedTheme === "dark" ? "dark" : "light"}
    >
      <VersionsDialog editor={stableEditor} /> <NotificationsPopover />
      <BlockNoteView
        editor={stableEditor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        editable={editable}
      />
      <FloatingComposer editor={stableEditor} className="w-[350px]" />
      <div className="hidden xl:flex absolute right-[100px] top-0">
        <Threads editor={stableEditor} />
      </div>
    </div>
  );
};

export default Editor;
