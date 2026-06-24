"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreateLinkForm } from "./components/create-link-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Copy, BarChart2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
  };

  return (
    <>
      <CreateLinkForm onSuccess={fetchLinks} />
      
      <Card>
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading links...</div>
          ) : links.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No links created yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Short Link</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[120px] sm:max-w-[200px]">/{link.shortCode}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(link.shortCode)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[150px] sm:max-w-[300px] truncate">
                        <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-muted-foreground">
                          {link.originalUrl}
                        </a>
                      </TableCell>
                      <TableCell>{link._count.clicks}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/${link.shortCode}`} target="_blank">
                            <Button variant="outline" size="sm" className="h-8">
                              <ExternalLink className="h-3 w-3 sm:mr-2" />
                              <span className="hidden sm:inline">Visit</span>
                            </Button>
                          </Link>
                          <Link href={`/dashboard/analytics/${link.shortCode}`}>
                            <Button variant="secondary" size="sm" className="h-8">
                              <BarChart2 className="h-3 w-3 sm:mr-2" />
                              <span className="hidden sm:inline">Analytics</span>
                            </Button>
                          </Link>
                        </div>
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
