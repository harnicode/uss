import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { format, subDays, eachDayOfInterval, isSameDay } from "date-fns";
import { AnalyticsClient } from "./analytics-client";

export default async function AnalyticsPage(
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { shortCode } = await params;

  const link = await prisma.link.findUnique({
    where: { shortCode },
    include: {
      clicks: {
        orderBy: { clickedAt: "desc" }
      }
    }
  });

  if (!link || link.userId !== session.user.id) {
    notFound();
  }

  // Aggregate Referrers
  const referrerMap = new Map<string, number>();
  // Aggregate OS/Browser roughly based on userAgent (Basic parsing)
  const agentMap = new Map<string, number>();

  link.clicks.forEach(click => {
    // Referrer
    const ref = click.referrer || "Direct";
    referrerMap.set(ref, (referrerMap.get(ref) || 0) + 1);

    // Agent (Very basic heuristic)
    let agentType = "Unknown";
    const ua = click.userAgent?.toLowerCase() || "";
    if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) agentType = "Mobile";
    else if (ua.includes("windows") || ua.includes("macintosh") || ua.includes("linux")) agentType = "Desktop";
    else if (ua.includes("bot")) agentType = "Bot";
    
    agentMap.set(agentType, (agentMap.get(agentType) || 0) + 1);
  });

  const topReferrers = Array.from(referrerMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const deviceTypes = Array.from(agentMap.entries()).sort((a, b) => b[1] - a[1]);

  const fullUrl = `${process.env.BASE_URL || "http://localhost:3000"}/${link.shortCode}`;

  // Chart Data: last 7 days
  const today = new Date();
  const last7Days = eachDayOfInterval({ start: subDays(today, 6), end: today });
  const chartData = last7Days.map(day => {
    const clicksOnDay = link.clicks.filter(c => isSameDay(new Date(c.clickedAt), day)).length;
    return {
      date: format(day, "MMM dd"),
      clicks: clicksOnDay
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">/{link.shortCode}</h1>
          <p className="text-muted-foreground truncate max-w-[300px] sm:max-w-[500px]">{link.originalUrl}</p>
        </div>
      </div>

      <AnalyticsClient 
        link={link}
        fullUrl={fullUrl}
        topReferrers={topReferrers}
        deviceTypes={deviceTypes}
        chartData={chartData}
      />
    </div>
  );
}
