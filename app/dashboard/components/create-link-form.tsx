"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Link2, Loader2 } from "lucide-react";

export function CreateLinkForm({ onSuccess }: { onSuccess: () => void }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customShortCode, setCustomShortCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl, customShortCode: customShortCode || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create link");
      }

      setOriginalUrl("");
      setCustomShortCode("");
      toast.success("Link Created Successfully", {
        description: "Your new short URL is ready to be shared.",
      });
      onSuccess();
    } catch (err: any) {
      toast.error("Failed to create link", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 text-primary rounded-md">
            <Link2 className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Create New Link</CardTitle>
            <CardDescription>Shorten a long URL and optionally specify a custom code.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="space-y-2 flex-1 w-full">
            <Label htmlFor="url">Destination URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/very/long/path"
              required
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              disabled={loading}
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2 flex-1 w-full">
            <Label htmlFor="code">Custom Code (Optional)</Label>
            <Input
              id="code"
              type="text"
              placeholder="my-campaign"
              value={customShortCode}
              onChange={(e) => setCustomShortCode(e.target.value)}
              disabled={loading}
              pattern="[a-zA-Z0-9-]+"
              title="Only letters, numbers, and hyphens are allowed"
              className="bg-muted/50"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full md:w-auto h-10">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {loading ? "Creating..." : "Shorten URL"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
