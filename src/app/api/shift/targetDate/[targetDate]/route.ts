import { NextResponse, NextRequest } from "next/server";
import { fetchShiftByMonth, createShift } from "@/app/lib/api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ targetDate: string }> }
) {
  try {
    const { targetDate } = await params;
    const shiftData = await fetchShiftByMonth(targetDate);
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
  { params }: { params: Promise<{ targetDate: string }> }
) {
  try {
    const body = await request.json();
    const { targetDate } = await params;
    await createShift(body, targetDate);
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
