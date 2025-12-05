import { createGroq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText } from "ai";
import { fetchViaProxy } from "@blocknote/xl-ai";

export const maxDuration = 30;

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!, // correct env
});

const model = createGroq({
  fetch: fetchViaProxy(
    (url) =>
      `${"https://localhost:3000/ai"}/proxy?provider=groq&url=${encodeURIComponent(url)}`
  ),
  apiKey: process.env.GROQ_API_KEY!,
})("llama-3.3-70b-versatile");

function toolDefinitionsToToolSet(defs: any[]) {
  if (!Array.isArray(defs)) return {};

  return defs.reduce((acc: any, def: any) => {
    acc[def.name] = def;
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
