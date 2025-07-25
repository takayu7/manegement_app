import { NextRequest, NextResponse } from "next/server";
import { deleteUser } from "@/app/lib/api";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const userId = await body.userId;
  await deleteUser(userId);
  // ページを再取得
  revalidatePath("/setting");

  return NextResponse.json({ success: true });
}
