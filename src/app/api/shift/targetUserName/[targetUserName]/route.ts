import { NextResponse, NextRequest } from "next/server";
import { createShift, fetchShiftByUserName } from "@/app/lib/api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ targetUserName: string }> }
) {
  try {
    const { targetUserName } = await params;
    const shiftData = await fetchShiftByUserName(targetUserName);
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ targetUserName: string }> }
) {
  try {
    const body = await request.json();
    const { targetUserName } = await params;
    await createShift(body, targetUserName);
    return NextResponse.json(
      {
        success: true,
        message: "Shift created successfully",
        data: body,
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
