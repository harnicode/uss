import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, MousePointerClick, Globe, MonitorSmartphone } from "lucide-react";
import QRCode from "react-qr-code";
import { format } from "date-fns";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics: /{link.shortCode}</h1>
            <p className="text-muted-foreground">{link.originalUrl}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{link.clicks.length}</div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 md:col-span-1 lg:col-span-3 flex items-center p-6 gap-6">
          <div className="bg-white p-2 rounded-md">
            <QRCode value={fullUrl} size={80} />
          </div>
          <div>
            <h3 className="font-semibold text-lg">QR Code</h3>
            <p className="text-sm text-muted-foreground">Scan to visit the short link directly.</p>
            <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
              {fullUrl}
            </a>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> Top Referrers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topReferrers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No traffic yet.</p>
            ) : (
              <ul className="space-y-3">
                {topReferrers.map(([ref, count]) => (
                  <li key={ref} className="flex justify-between items-center text-sm">
                    <span className="truncate max-w-[200px]">{ref}</span>
                    <span className="font-medium">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MonitorSmartphone className="h-4 w-4" /> Devices (Estimated)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {deviceTypes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No traffic yet.</p>
            ) : (
              <ul className="space-y-3">
                {deviceTypes.map(([device, count]) => (
                  <li key={device} className="flex justify-between items-center text-sm">
                    <span>{device}</span>
                    <span className="font-medium">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Clicks</CardTitle>
          <CardDescription>The last 10 clicks on your link.</CardDescription>
        </CardHeader>
        <CardContent>
           {link.clicks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No clicks recorded.</p>
            ) : (
              <div className="space-y-4">
                {link.clicks.slice(0, 10).map((click) => (
                  <div key={click.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm py-2 border-b last:border-0">
                    <div className="text-muted-foreground">
                      {format(new Date(click.clickedAt), "PPp")}
                    </div>
                    <div className="truncate max-w-[300px]">
                      {click.referrer || "Direct"}
                    </div>
                  </div>
                ))}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
