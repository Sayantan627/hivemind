import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = async (req: NextRequest) => {
  const token = await getToken({ req });
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
};

export const config = {
  matcher: ["/r/:path*/submit", "/r/create"],
};
