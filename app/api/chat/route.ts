import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";

export const maxDuration = 30;

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // <--- HERE
});

function toolDefinitionsToToolSet(defs: any[]) {
  if (!Array.isArray(defs)) return {};

  return defs.reduce((acc: any, def: any) => {
    acc[def.name] = def;
    return acc;
  }, {});
}

export async function POST(req: Request) {
  try {
    const { messages, toolDefinitions } = await req.json();

    const result = streamText({
      model: openai("gpt-4.1"),
      messages: convertToModelMessages(messages),
      tools: toolDefinitionsToToolSet(toolDefinitions),
      toolChoice: "required",
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.log("API KEY?", process.env.OPENAI_API_KEY ? "loaded" : "missing");
    console.error("Chat API error:", err);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
