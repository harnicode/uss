"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MousePointerClick, Globe, MonitorSmartphone, Calendar, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

type ClickType = {
  id: string;
  clickedAt: Date;
  referrer: string | null;
  userAgent: string | null;
};

type AnalyticsClientProps = {
  link: {
    originalUrl: string;
    shortCode: string;
    createdAt: Date;
    clicks: ClickType[];
  };
  fullUrl: string;
  topReferrers: [string, number][];
  deviceTypes: [string, number][];
  chartData: { date: string; clicks: number }[];
};

export function AnalyticsClient({ link, fullUrl, topReferrers, deviceTypes, chartData }: AnalyticsClientProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="referrers">Referrers & Devices</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{link.clicks.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Lifetime clicks</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Created On</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{format(new Date(link.createdAt), "MMM dd, yyyy")}</div>
            </CardContent>
          </Card>
          <Card className="col-span-1 md:col-span-2 shadow-sm flex flex-col justify-center p-6 bg-muted/30">
             <div className="flex items-center gap-6">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <QRCode value={fullUrl} size={64} />
              </div>
              <div>
                <h3 className="font-semibold flex items-center gap-2"><QrCode className="w-4 h-4"/> QR Code</h3>
                <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline block mt-1">
                  {fullUrl}
                </a>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          <Card className="col-span-1 lg:col-span-4 shadow-sm">
            <CardHeader>
              <CardTitle>Clicks Over Time</CardTitle>
              <CardDescription>Last 7 days performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ clicks: { label: "Clicks", color: "hsl(var(--primary))" } }} className="h-[250px] w-full">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="clicks" fill="var(--color-clicks)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 lg:col-span-3 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest 5 clicks</CardDescription>
            </CardHeader>
            <CardContent>
              {link.clicks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No clicks recorded.</p>
              ) : (
                <div className="space-y-4">
                  {link.clicks.slice(0, 5).map((click) => (
                    <div key={click.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm py-2 border-b last:border-0">
                      <div className="text-muted-foreground text-xs">
                        {format(new Date(click.clickedAt), "MMM dd, p")}
                      </div>
                      <div className="truncate max-w-[200px] font-medium">
                        {click.referrer || "Direct"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="referrers" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> Top Referrers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topReferrers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No traffic yet.</p>
              ) : (
                <ul className="space-y-4">
                  {topReferrers.map(([ref, count]) => (
                    <li key={ref} className="flex justify-between items-center text-sm">
                      <span className="truncate max-w-[200px]">{ref}</span>
                      <span className="font-medium bg-muted px-2 py-1 rounded-md">{count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MonitorSmartphone className="h-4 w-4" /> Devices
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deviceTypes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No traffic yet.</p>
              ) : (
                <ul className="space-y-4">
                  {deviceTypes.map(([device, count]) => (
                    <li key={device} className="flex justify-between items-center text-sm">
                      <span>{device}</span>
                      <span className="font-medium bg-muted px-2 py-1 rounded-md">{count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
