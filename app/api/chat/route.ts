import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";
import { toolDefinitionsToToolSet } from "@blocknote/xl-ai";

export const maxDuration = 30; // optional, max streaming duration in seconds

export async function POST(req: Request) {
  try {
    const { messages, toolDefinitions } = await req.json();

    const result = streamText({
      model: openai("gpt-4.1"), // AI SDK server function
      messages: convertToModelMessages(messages),
      tools: toolDefinitionsToToolSet(toolDefinitions),
      toolChoice: "required",
    });

    // Returns a streaming response
    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("Chat API error:", err);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
