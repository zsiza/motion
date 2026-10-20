import { createGroq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText, type ToolSet } from "ai";

export const maxDuration = 30;

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
});

type ToolDefinition = { name: string } & Record<string, unknown>;

function toolDefinitionsToToolSet(defs: ToolDefinition[]): ToolSet {
  if (!Array.isArray(defs)) return {};

  return defs.reduce<ToolSet>((acc, def) => {
    acc[def.name] = def as unknown as ToolSet[string];
    return acc;
  }, {});
}

export async function POST(req: Request) {
  console.log("🔑 GROQ KEY:", process.env.GROQ_API_KEY ? "LOADED" : "MISSING");

  try {
    const { messages, toolDefinitions } = await req.json();

    console.log("📥 Incoming messages:", messages);
    console.log("🛠 Tool definitions:", toolDefinitions);

    const result = streamText({
      model: groq("allam-2-7b"),
      messages: convertToModelMessages(messages),
      tools: toolDefinitionsToToolSet(toolDefinitions),
      toolChoice: "required",
    });

    console.log("📤 Stream result object:", result);

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("❌ Chat API error:", err);

    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
