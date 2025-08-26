import { fetchUserItemDatas , upUserItemDatas ,deleteUserItemDatas} from "@/app/lib/api";
import { NextResponse,NextRequest} from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const data = await fetchUserItemDatas(userId);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await upUserItemDatas(body);
    return NextResponse.json({ message: "Updated successfully" });
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
    await deleteUserItemDatas(body);
    return NextResponse.json({ message: "Deleted successfully" });
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

