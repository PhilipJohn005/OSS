import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const headers = req.headers;

    const forwarded = headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0].trim() || (req as any).ip || "unknown";

    const geo = ((req as any).geo || {}) as {
      city?: string;
      region?: string;
      country?: string;
    };

    const country = geo.country || "unknown";
    const city = geo.city || "unknown";
    const region = geo.region || "unknown";

    const ua = headers.get("user-agent") || "unknown";
    const referer = headers.get("referer") || "none";

    const { path, user, email, uid } = await req.json();

    const content = [
      "**New Visitor!**",
      user ? `**Name:** ${user}` : "",
      email ? `**Email:** ${email}` : "",
      uid ? `**Visitor ID:** ${uid}` : "",
      `**IP:** ${ip}`,
      `**Location:** ${city}, ${region}, ${country}`,
      `**Path:** ${path}`,
      `**User-Agent:** ${ua}`,
      `**Referer:** ${referer}`,
      `**Time:** ${new Date().toLocaleString("en-IN")}`,
    ]
      .filter(Boolean)
      .join("\n");

    await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Track error:", err);
    return NextResponse.json(
      { ok: false, error: "Tracking failed" },
      { status: 500 }
    );
  }
}
