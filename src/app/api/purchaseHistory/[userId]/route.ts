import { fetchPurchaseHistory } from "@/app/lib/api";
import { NextResponse } from "next/server";

// Next.jsのRoute Handlerの型に合わせて修正
export async function GET(
  req: Request,
  context: { params: { userId: string } }
) {
  const data = await fetchPurchaseHistory(context.params.userId);
  return NextResponse.json(data);
}
