"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreateLinkForm } from "./components/create-link-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Copy, BarChart2, MoreHorizontal, MousePointerClick, Link as LinkIcon, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type LinkItem = {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  _count: { clicks: number };
};

export default function DashboardPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/links");
      if (res.ok) {
        const data = await res.json();
        setLinks(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const copyToClipboard = (code: string) => {
    const url = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard", {
      description: `URL copied: ${url}`,
    });
  };

  const totalClicks = links.reduce((acc, curr) => acc + curr._count.clicks, 0);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-12" /> : links.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active short links</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-12" /> : totalClicks}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all your links</p>
          </CardContent>
        </Card>
      </div>

      <CreateLinkForm onSuccess={fetchLinks} />
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Links</CardTitle>
          <CardDescription>Manage your shortened URLs and view their performance.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : links.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="p-4 bg-muted rounded-full mb-4">
                <LinkIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No links created yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Use the form above to shorten your first URL.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Short Link</TableHead>
                    <TableHead className="hidden md:table-cell">Destination</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[120px] sm:max-w-[200px]">/{link.shortCode}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px] lg:max-w-[300px] truncate">
                        <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-muted-foreground">
                          {link.originalUrl}
                        </a>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="font-normal text-xs">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{link._count.clicks}</TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => copyToClipboard(link.shortCode)}>
                              <Copy className="mr-2 h-4 w-4" /> Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`/${link.shortCode}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="mr-2 h-4 w-4" /> Visit Link
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/analytics/${link.shortCode}`}>
                                <BarChart2 className="mr-2 h-4 w-4" /> View Analytics
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
