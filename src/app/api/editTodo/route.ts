import { NextRequest, NextResponse } from "next/server";
import { deleteSupplierList } from "@/app/lib/api";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supplierId = await body.supplierId;
  await deleteSupplierList(supplierId);
  // ページを再取得
  revalidatePath("/setting");

  return NextResponse.json({ success: true });
}
