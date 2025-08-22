import { NextResponse } from "next/server";
import { fetchUserDatasByUserName } from "@/app/lib/api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ targetUserName: string }> }
) {
  try {
    const { targetUserName } = await params;
    const shiftData = await fetchUserDatasByUserName(targetUserName);
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
