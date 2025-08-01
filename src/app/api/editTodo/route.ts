import { NextRequest, NextResponse } from "next/server";
import { updateTodo } from "@/app/lib/api";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newTodo = await body.newTodo;
  await updateTodo(newTodo);
  // ページを再取得
  revalidatePath("/todolist");

  return NextResponse.json({ success: true });
}
