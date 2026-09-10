import { NextResponse, type NextRequest } from "next/server";

import { getAvailability } from "@/lib/appointments";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "A valid `date` query parameter (YYYY-MM-DD) is required." },
      { status: 400 },
    );
  }

  try {
    const result = await getAvailability(date);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Could not load availability. Please try again." },
      { status: 500 },
    );
  }
}
