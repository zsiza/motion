import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const provider = req.nextUrl.searchParams.get("provider");
    const targetUrl = req.nextUrl.searchParams.get("url");

    if (!provider || !targetUrl) {
      return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const apiKey = provider === "groq" ? process.env.GROQ_API_KEY : null;

    if (!apiKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 400 });
    }

    // Forward request to Groq
    const groqResponse = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: await req.text(),
    });

    const buffer = await groqResponse.arrayBuffer();

    console.log("Proxy forwarding to:", targetUrl);

    return new NextResponse(buffer, {
      status: groqResponse.status,
      headers: groqResponse.headers,
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
