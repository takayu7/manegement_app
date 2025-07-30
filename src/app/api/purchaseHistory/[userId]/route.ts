import { fetchPurchaseHistory } from "@/app/lib/api";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const data = await fetchPurchaseHistory(params.userId);
  return NextResponse.json(data);
}