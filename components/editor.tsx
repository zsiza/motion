"use client";

import { useEdgeStore } from "@/lib/edgestore";
import { createGroq } from "@ai-sdk/groq";
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { en } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  FloatingComposer,
  FormattingToolbar,
  FormattingToolbarController,
  getDefaultReactSlashMenuItems,
  getFormattingToolbarItems,
  SuggestionMenuController,
  useBlockNoteContext,
  useCreateBlockNote,
} from "@blocknote/react";
import {
  AIMenuController,
  AIToolbarButton,
  ClientSideTransport,
  createAIExtension,
  fetchViaProxy,
  getAIExtension,
  getAISlashMenuItems,
} from "@blocknote/xl-ai";
import "@blocknote/xl-ai/style.css";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useTheme } from "next-themes";
import {
  useCreateBlockNoteWithLiveblocks,
  FloatingThreads,
} from "@liveblocks/react-blocknote";
import { useThreads } from "@liveblocks/react";
import { useMediaQuery } from "usehooks-ts";
import { Spinner } from "./spinner";
import { en as aiEn } from "@blocknote/xl-ai/locales";

import {
  DefaultBlockSchema,
  DefaultInlineContentSchema,
  DefaultStyleSchema,
} from "@blocknote/core";
interface EditorProps {
  editable?: boolean;
}

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];
// We define the model directly in our app using the Vercel AI SDK
const model = createGroq({
  // We supply a custom fetch function so that requests are routed through our proxy server
  // (see `packages/xl-ai-server/src/routes/proxy.ts`)
  // this is needed to hide the API key of our LLM provider from the client,
  // and to prevent CORS issues
  fetch: fetchViaProxy(
    (url) => `$
    }/proxy?provider=groq&url=${encodeURIComponent(url)}`
  ),
  apiKey: "fake-api-key", // the API key is not used as it's actually added in the proxy server
})("llama-3.3-70b-versatile");

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
    dictionary: {
      ...en,
      ai: aiEn, // add default translations for the AI extension
    },
    // Register the AI extension
    extensions: [
      createAIExtension({
        transport: new ClientSideTransport({ model }),
        chatRequestOptions: {
          body: { model },
        },
      }),
    ],

    uploadFile: handleUpload,
  });

  if (!editor) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const existingContext = useBlockNoteContext();
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
        formattingToolbar={false}
        slashMenu={false}
      >
        <AIMenuController />
        <FormattingToolbarWithAI />
        <SuggestionMenuWithAI editor={editor} />
      </BlockNoteView>

      {/* <FloatingComposer editor={editor} className="w-[350px]" /> */}

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
  editor: BlockNoteEditor<any, any, any>;
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
