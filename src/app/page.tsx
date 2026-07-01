
'use client';

import { VerticalFeed } from "@/components/VerticalFeed";
import { BottomNav } from "@/components/BottomNav";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="h-screen w-full bg-black relative">
      {/* Top Branding Header */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-center z-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
      <div className="flex space-x-8 pointer-events-auto">
        <button className="text-white text-base font-black tracking-tight border-b-2 border-primary pb-1">Trending</button>
        <button className="text-white/60 text-base font-bold tracking-tight">Explore</button>
      </div>
    </div>


      {/* Main Video Feed */}
      <VerticalFeed />

      {/* Persistent Navigation */}
      <BottomNav />
    </main>
  );
}
