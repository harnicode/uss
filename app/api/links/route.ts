import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { originalUrl, customShortCode } = body;

    if (!originalUrl) {
      return NextResponse.json({ error: "Original URL is required" }, { status: 400 });
    }

    // Validate URL
    try {
      new URL(originalUrl);
    } catch (e) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    let shortCode = customShortCode;

    if (!shortCode) {
      // Generate a random 6-character short code
      shortCode = Math.random().toString(36).substring(2, 8);
    }

    // Check if short code already exists
    const existing = await prisma.link.findUnique({
      where: { shortCode },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Short code already in use. Please try another one." },
        { status: 409 }
      );
    }

    const link = await prisma.link.create({
      data: {
        originalUrl,
        shortCode,
        userId: session.user.id,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const links = await prisma.link.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { clicks: true }
        }
      }
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
