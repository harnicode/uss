import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;

  try {
    const link = await prisma.link.findUnique({
      where: { shortCode },
    });

    if (!link) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Extract analytics data asynchronously
    const referrer = req.headers.get("referer") || req.headers.get("referrer") || "Direct";
    const userAgent = req.headers.get("user-agent") || "Unknown";

    // Non-blocking click recording
    prisma.linkClick
      .create({
        data: {
          linkId: link.id,
          referrer,
          userAgent,
        },
      })
      .catch((err) => console.error("Error recording click:", err));

    return NextResponse.redirect(link.originalUrl);
  } catch (error) {
    console.error("Error in redirection:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
