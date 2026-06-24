"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function CreateLinkForm({ onSuccess }: { onSuccess: () => void }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customShortCode, setCustomShortCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Link</CardTitle>
        <CardDescription>Shorten a long URL and optionally specify a custom code.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Destination URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/very/long/path"
              required
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">Custom Short Code (Optional)</Label>
            <Input
              id="code"
              type="text"
              placeholder="my-campaign"
              value={customShortCode}
              onChange={(e) => setCustomShortCode(e.target.value)}
              disabled={loading}
              pattern="[a-zA-Z0-9-]+"
              title="Only letters, numbers, and hyphens are allowed"
            />
          </div>
          {error && <div className="text-sm text-destructive">{error}</div>}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Shorten URL"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
