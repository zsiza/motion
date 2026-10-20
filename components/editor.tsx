"use client";

import { useEdgeStore } from "@/lib/edgestore";
import { createGroq } from "@ai-sdk/groq";
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { en } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  FormattingToolbar,
  FormattingToolbarController,
  getDefaultReactSlashMenuItems,
  getFormattingToolbarItems,
  SuggestionMenuController,
} from "@blocknote/react";
import {
  AIMenuController,
  AIToolbarButton,
  ClientSideTransport,
  createAIExtension,
  fetchViaProxy,
  getAISlashMenuItems,
} from "@blocknote/xl-ai";
import "@blocknote/xl-ai/style.css";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import {
  useCreateBlockNoteWithLiveblocks,
  FloatingThreads,
  FloatingComposer,
} from "@liveblocks/react-blocknote";
import { useThreads } from "@liveblocks/react/suspense";
import { useMediaQuery } from "usehooks-ts";
import { Spinner } from "./spinner";
import { en as aiEn } from "@blocknote/xl-ai/locales";

interface EditorProps {
  editable?: boolean;
}

const model = createGroq({
  fetch: fetchViaProxy(
    (url) => `$
    }/proxy?provider=groq&url=${encodeURIComponent(url)}`
  ),
  apiKey: "fake-api-key",
})("llama-3.3-70b-versatile");

const Editor = ({ editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ file });
    return response.url;
  };

  const editor = useCreateBlockNoteWithLiveblocks({
    dictionary: {
      ...en,
      ai: aiEn,
    },
    extensions: [
      createAIExtension({
        transport: new ClientSideTransport({ model }),
        chatRequestOptions: {
          body: { model },
        },
      }),
    ],
    tables: {
      splitCells: true,
      cellBackgroundColor: true,
      cellTextColor: true,
      headers: true,
    },

    uploadFile: handleUpload,
  });
  const { threads } = useThreads();
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!editor) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen flex flex-col"
      data-theme={resolvedTheme === "dark" ? "dark" : "light"}
    >
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        editable={editable}
        formattingToolbar={false}
        slashMenu={false}
      >
        <AIMenuController />
        <FormattingToolbarWithAI />
        <SuggestionMenuWithAI editor={editor} />
      </BlockNoteView>

      <FloatingComposer editor={editor} className="w-[350px]" />

      {threads &&
        (isMobile ? (
          <FloatingThreads editor={editor} threads={threads} />
        ) : (
          <FloatingThreads
            editor={editor}
            threads={threads}
            className="w-[350px]"
          />
        ))}
    </div>
  );
};

function FormattingToolbarWithAI() {
  return (
    <FormattingToolbarController
      formattingToolbar={() => (
        <FormattingToolbar>
          {...getFormattingToolbarItems()}
          <AIToolbarButton />
        </FormattingToolbar>
      )}
    />
  );
}

function SuggestionMenuWithAI(props: {
  editor: BlockNoteEditor;
}) {
  return (
    <SuggestionMenuController
      triggerCharacter="/"
      getItems={async (query) =>
        filterSuggestionItems(
          [
            ...getDefaultReactSlashMenuItems(props.editor),
            ...getAISlashMenuItems(props.editor),
          ],
          query
        )
      }
    />
  );
}
export default Editor;
