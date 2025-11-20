"use client";

import useSWRMutation from "swr/mutation";

interface ChatRequest {
  messages: any[];
  toolDefinitions: any[];
}

// Function to POST to your server route
async function fetchChat(url: string, { arg }: { arg: ChatRequest }) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });

  if (!res.ok) throw new Error("Chat API request failed");
  return res.json();
}

export default function ChatClient() {
  const { trigger, data, isMutating, error } = useSWRMutation(
    "/api/chat",
    fetchChat
  );

  const handleSend = async () => {
    await trigger({
      messages: [{ role: "user", content: "Hello AI" }],
      toolDefinitions: [], // add your tools if needed
    });
  };

  return (
    <div>
      <button onClick={handleSend} disabled={isMutating}>
        {isMutating ? "Sending..." : "Send"}
      </button>

      {error && <p className="text-red-500">Error: {error.message}</p>}

      <pre>{data ? JSON.stringify(data, null, 2) : "No response yet"}</pre>
    </div>
  );
}
