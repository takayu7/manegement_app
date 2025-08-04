import { NextResponse, NextRequest } from "next/server";
import { fetchBuyAllHistory, createPurchaseHistory,updateBuyProduct } from "@/app/lib/api";

export async function GET() {
  try {
    const history = await fetchBuyAllHistory();
    return NextResponse.json(history);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database Error:", error.message);
    } else {
      console.error("Unknown Error:", error);
    }
    throw new Error("Failed to fetch user buy history.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // const result =
    await createPurchaseHistory(body);
    // return NextResponse.json(result);
    return NextResponse.json({
      success: true,
      message: "Purchase history created successfully",
    }, { status: 201 });

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

// 購入時の更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await updateBuyProduct(body);
    return NextResponse.json(result);
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
