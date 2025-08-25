import { NextResponse} from "next/server";
import { fetchReviewAllDatas } from "@/app/lib/api";

export async function GET() {
  try {
    const allReview = await fetchReviewAllDatas();
    return NextResponse.json(allReview);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database Error:", error.message);
    } else {
      console.error("Unknown Error:", error);
    }
    throw new Error("Failed to fetch allReview data.");
  }
}
