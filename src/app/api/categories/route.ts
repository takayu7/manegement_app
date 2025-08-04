import { NextResponse } from "next/server";
import { fetchCategoryList } from "@/app/lib/api";

export async function GET() {
  try {
    const categories = await fetchCategoryList();
    return NextResponse.json(categories);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database Error:", error.message);
    } else {
      console.error("Unknown Error:", error);
    }
    throw new Error("Failed to fetch category data.");
  }
}
