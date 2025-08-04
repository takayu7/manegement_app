import { NextResponse, NextRequest } from "next/server";
import { fetchProductDatas, createProduct,updateProduct,  deleteProduct} from "@/app/lib/api";

export async function GET() {
  try {
    const products = await fetchProductDatas();
    return NextResponse.json(products);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database Error:", error.message);
    } else {
      console.error("Unknown Error:", error);
    }
    throw new Error("Failed to fetch product data.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createProduct(body);
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

// 編集時の更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await updateProduct(body);
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

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    // Assuming deleteProduct is a function that handles product deletion
    const result = await deleteProduct(body.id);
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