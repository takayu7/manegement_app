import { NextResponse } from "next/server";
import { fetchShift } from "@/app/lib/api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ targetDate: string }> }
) {
  try {
    const { targetDate } = await params;
    const shiftData = await fetchShift(targetDate);
    return NextResponse.json(shiftData);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database Error:", error.message);
    } else {
      console.error("Unknown Error:", error);
    }
    throw new Error("Failed to fetch shift data.");
  }
}
