"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Link as LinkIcon, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("nodemailer", {
        email,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        toast.error("Failed to send login link", {
          description: res.error,
        });
      } else {
        toast.success("Magic link sent!", {
          description: "Check your inbox to securely sign in.",
        });
        setEmail("");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center p-4 sm:p-8 bg-muted/40">
      <div className="w-full max-w-[400px] flex flex-col gap-6">
        
        {/* Header / Branding */}
        <div className="flex flex-col items-center text-center gap-2 mb-2">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-xl mb-2 hover:opacity-80 transition-opacity">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
              <LinkIcon className="h-5 w-5" />
            </div>
            uss.
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your links
          </p>
        </div>

        {/* Card Form */}
        <Card className="shadow-lg border-muted">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Continue with Email
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Footer Links */}
        <p className="text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
}
