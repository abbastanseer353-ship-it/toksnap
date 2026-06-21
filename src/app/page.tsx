import { VerticalFeed } from "@/components/VerticalFeed";
import { BottomNav } from "@/components/BottomNav";
import { Search, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="h-screen bg-black max-w-md mx-auto relative overflow-hidden">
      {/* Immersive Header Overlay */}
      <header className="absolute top-0 left-0 right-0 z-40 px-6 py-8 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="w-4 h-4 text-black fill-current" />
          </div>
          <h1 className="text-lg font-headline font-black tracking-tighter text-white">
            Tok<span className="text-primary">Snap</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-6 text-sm font-bold pointer-events-auto">
          <button className="text-white border-b-2 border-white pb-1">Following</button>
          <button className="text-white/60 hover:text-white transition-colors">For You</button>
        </div>

        <button className="p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white pointer-events-auto">
          <Search className="w-5 h-5" />
        </button>
      </header>

      {/* Full Screen Scroll Snap Feed */}
      <VerticalFeed />

      <BottomNav />
    </main>
  );
}
