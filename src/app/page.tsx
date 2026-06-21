
import { MasonryFeed } from "@/components/MasonryFeed";
import { BottomNav } from "@/components/BottomNav";
import { Bell, Search, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background max-w-md mx-auto relative shadow-2xl border-x border-white/5">
      {/* TokSnap App Bar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-5 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="w-5 h-5 text-primary-foreground fill-current" />
          </div>
          <h1 className="text-xl font-headline font-bold tracking-tight text-foreground">
            Tok<span className="text-primary">Snap</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-white/5 text-foreground transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-white/5 text-foreground transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-background animate-pulse" />
          </div>
        </div>
      </header>

      {/* Discovery Content */}
      <div className="py-4 px-5">
        <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar pb-2">
          <button className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-bold whitespace-nowrap">
            For You
          </button>
          <button className="px-4 py-1.5 rounded-full bg-white/5 text-muted-foreground text-xs font-bold whitespace-nowrap hover:bg-white/10 transition-colors">
            Trending
          </button>
          <button className="px-4 py-1.5 rounded-full bg-white/5 text-muted-foreground text-xs font-bold whitespace-nowrap hover:bg-white/10 transition-colors">
            Vibe
          </button>
          <button className="px-4 py-1.5 rounded-full bg-white/5 text-muted-foreground text-xs font-bold whitespace-nowrap hover:bg-white/10 transition-colors">
            Global
          </button>
        </div>
      </div>

      <MasonryFeed />

      <BottomNav />
    </main>
  );
}
