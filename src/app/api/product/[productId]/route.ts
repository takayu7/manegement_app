import { NextResponse} from "next/server";
import { fetchProductSingleData } from "@/app/lib/api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const reviews = await fetchProductSingleData(productId);
  return NextResponse.json(reviews);
}
