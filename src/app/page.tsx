
import { MasonryFeed } from "@/components/MasonryFeed";
import { BottomNav } from "@/components/BottomNav";
import { Bell, Search, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background max-w-md mx-auto relative shadow-2xl border-x border-white/5">
      {/* TokSnap App Bar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
            <Zap className="w-5 h-5 text-primary-foreground fill-current" />
          </div>
          <h1 className="text-xl font-headline font-extrabold tracking-tight text-foreground">
            Tok<span className="text-primary">Snap</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-1">
          <button className="p-2.5 rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all">
            <Search className="w-5 h-5" />
          </button>
          <div className="relative">
            <button className="p-2.5 rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all">
              <Bell className="w-5 h-5" />
            </button>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
          </div>
        </div>
      </header>

      {/* Discovery Content */}
      <div className="py-5 px-6">
        <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar pb-1">
          <button className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-[11px] font-bold whitespace-nowrap shadow-md shadow-primary/10">
            For You
          </button>
          <button className="px-5 py-2 rounded-full bg-white/5 text-muted-foreground text-[11px] font-bold whitespace-nowrap hover:bg-white/10 transition-colors border border-white/5">
            Trending
          </button>
          <button className="px-5 py-2 rounded-full bg-white/5 text-muted-foreground text-[11px] font-bold whitespace-nowrap hover:bg-white/10 transition-colors border border-white/5">
            Vibe
          </button>
          <button className="px-5 py-2 rounded-full bg-white/5 text-muted-foreground text-[11px] font-bold whitespace-nowrap hover:bg-white/10 transition-colors border border-white/5">
            Global
          </button>
        </div>
      </div>

      <MasonryFeed />

      <BottomNav />
    </main>
  );
}
