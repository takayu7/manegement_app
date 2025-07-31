import { fetchPurchaseHistory } from "@/app/lib/api";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const data = await fetchPurchaseHistory(userId);
  return NextResponse.json(data);
};
