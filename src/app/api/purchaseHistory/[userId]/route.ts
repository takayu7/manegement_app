import { fetchPurchaseHistory } from "@/app/lib/api";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { userId: string } }
) {
  const data = await fetchPurchaseHistory(context.params.userId);
  return NextResponse.json(data);
}
