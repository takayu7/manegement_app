import { NextRequest, NextResponse } from "next/server";
import { fetchUserDatasById } from "@/app/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = await body.userId;
    const users = await fetchUserDatasById(userId);
    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Database Error:", error.message);
    } else {
      console.error("Unknown Error:", error);
    }
    throw new Error("Failed to fetch product data.");
  }
}
