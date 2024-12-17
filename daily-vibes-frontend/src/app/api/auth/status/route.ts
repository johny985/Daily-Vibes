import { NextResponse } from "next/server";

export async function GET(request: any) {
  const accessToken = request.cookies.get("access_token")?.value;
  const tempUser = request.cookies.get("tempUser")?.value;

  if (!accessToken && !tempUser) {
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }

  return NextResponse.json({ loggedIn: true }, { status: 200 });
}
