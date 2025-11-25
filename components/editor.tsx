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
import { en } from "@blocknote/core/locales";
import { en as aiEn } from "@blocknote/xl-ai/locales";
import { BlockNoteEditor, filterSuggestionItems } from "@blocknote/core";
import { DefaultChatTransport } from "ai";
import {
  AIMenuController,
  AIToolbarButton,
  createAIExtension,
  getAISlashMenuItems,
  getAIExtension,
} from "@blocknote/xl-ai";
import {
  FormattingToolbar,
  FormattingToolbarController,
  getDefaultReactSlashMenuItems,
  getFormattingToolbarItems,
  SuggestionMenuController,
  useBlockNoteContext,
} from "@blocknote/react";

import {
  defaultInlineContentSchema,
  defaultStyleSchema,
  DefaultBlockSchema,
  DefaultInlineContentSchema,
  DefaultStyleSchema,
} from "@blocknote/core";
import { useEffect, useState } from "react";
interface EditorProps {
  editable?: boolean;
}

const Editor = ({ editable }: EditorProps) => {
  const [model, setModel] = useState<string>(
    "groq.chat/llama-3.3-70b-versatile"
  );

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
      ai: aiEn,
    },
    extensions: [
      createAIExtension({
        transport: new DefaultChatTransport({
          api: `/api/chat `,
        }),
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

  const ai = getAIExtension(editor);

  useEffect(() => {
    // update the default model in the extension
    // Add the model string to the request body
    ai.options.setState({
      chatRequestOptions: {
        body: {
          model,
        },
      },
    });
  }, [model, ai.options]);

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
