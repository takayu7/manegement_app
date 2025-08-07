import { NextResponse, NextRequest } from "next/server";
import { fetchReviewDatas, createReview } from "@/app/lib/api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const reviews = await fetchReviewDatas(productId);
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await createReview(body);
    return NextResponse.json(
      {
        success: true,
        message: "Review created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Unknown Error:", error);
      return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
  }
}
