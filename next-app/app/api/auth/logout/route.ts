import { NextRequest, NextResponse } from "next/server";
import { SupabaseAuthService } from "@/lib/supabaseAuthService";

// ログアウト
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization") || "";
  const accessToken =
    authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  // Supabase のレスポンスは無視して常に成功扱い
  try {
    if (accessToken) {
      await SupabaseAuthService.logout(accessToken);
    }
  } catch (_) {
    // エラー無視（Python 版と同じ）
  }

  return NextResponse.json(
    { message: "Logout successful." },
    { status: 200 }
  );
}
