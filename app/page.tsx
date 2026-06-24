import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Link as LinkIcon, BarChart2, Zap } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 blur-[100px] bg-primary rounded-full pointer-events-none" />

      <main className="z-10 max-w-5xl w-full flex flex-col items-center text-center space-y-8 mt-12 mb-24">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium tracking-tight mb-4 bg-muted/50">
          <Zap className="mr-2 h-4 w-4 text-primary" /> 
          Now with built-in analytics
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-balance">
          Shorten URLs. <br />
          <span className="text-muted-foreground">Expand your reach.</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl text-balance leading-relaxed">
          The ultimate self-hosted URL shortener. Create clean, memorable links, track every click, and scale your brand effortlessly.
        </p>

        <div className="flex gap-4 mt-8">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/login">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </Button>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="w-full max-w-4xl mt-20 p-2 rounded-xl bg-gradient-to-b from-muted/50 to-muted/10 border shadow-2xl">
          <Card className="flex flex-col h-[400px] w-full overflow-hidden border-0 shadow-none bg-background rounded-lg">
            <div className="h-12 border-b flex items-center px-4 gap-2 bg-muted/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto w-1/2 max-w-sm h-6 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                <LinkIcon className="h-3 w-3 mr-2" /> my-url-shortener.local
              </div>
            </div>
            <div className="flex flex-1">
              <div className="w-48 border-r bg-muted/10 p-4 hidden sm:flex flex-col gap-2">
                <div className="h-8 rounded bg-muted/50 w-full" />
                <div className="h-8 rounded bg-primary/10 text-primary w-full flex items-center px-3 text-sm font-medium">Links</div>
                <div className="h-8 rounded bg-muted/30 w-full" />
              </div>
              <div className="flex-1 p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-8 w-32 bg-muted rounded-md" />
                  <div className="h-8 w-24 bg-primary/20 rounded-md" />
                </div>
                <div className="h-16 w-full border rounded-lg flex items-center px-4 gap-4">
                   <div className="w-8 h-8 rounded bg-muted flex items-center justify-center"><BarChart2 className="w-4 h-4 text-muted-foreground"/></div>
                   <div className="flex-1 space-y-2"><div className="h-3 w-1/4 bg-muted rounded" /><div className="h-2 w-1/2 bg-muted/50 rounded" /></div>
                </div>
                <div className="h-16 w-full border rounded-lg flex items-center px-4 gap-4">
                   <div className="w-8 h-8 rounded bg-muted flex items-center justify-center"><BarChart2 className="w-4 h-4 text-muted-foreground"/></div>
                   <div className="flex-1 space-y-2"><div className="h-3 w-1/3 bg-muted rounded" /><div className="h-2 w-1/2 bg-muted/50 rounded" /></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
