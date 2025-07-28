import { NextResponse } from "next/server";
import { fetchSupplierList } from "@/app/lib/api";

export async function GET() {
  try {
    const suppliers = await fetchSupplierList();
    return NextResponse.json(suppliers);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database Error:", error.message);
    } else {
      console.error("Unknown Error:", error);
    }
    throw new Error("Failed to fetch product data.");
  }
}
