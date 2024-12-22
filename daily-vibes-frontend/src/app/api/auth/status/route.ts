import { NextResponse } from "next/server";

export async function GET(request: any) {
  const tempUser = request.cookies?.get("tempUser")?.value;

  if (tempUser) {
    return NextResponse.json(
      { loggedIn: true, user: "Temp User" },
      { status: 200 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
      {
        method: "GET",
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      return NextResponse.json(
        { loggedIn: true, user: data.username },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { loggedIn: false, user: null },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error verifying token with NestJS:", error);
    return NextResponse.json({ loggedIn: false, user: null }, { status: 500 });
  }
}
