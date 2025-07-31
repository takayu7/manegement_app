import { NextResponse } from "next/server";
import { fetchTodo } from "@/app/lib/api";

export async function GET() {
  try {
    const users = await fetchTodo();
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
