
'use client';

import { VerticalFeed } from "@/components/VerticalFeed";
import { BottomNav } from "@/components/BottomNav";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="h-screen w-full bg-black relative">
      {/* Top Branding Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="w-8 h-8 bg-gradient-to-tr from-primary to-accent rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="w-5 h-5 text-black fill-current" />
          </div>
          <span className="text-xl font-headline font-black tracking-tighter italic">TOKSNAP</span>
        </div>
        <div className="flex space-x-6 pointer-events-auto">
          <button className="text-white/60 text-sm font-bold tracking-tight">Following</button>
          <button className="text-white text-sm font-bold tracking-tight border-b-2 border-primary pb-1">For You</button>
        </div>
      </div>

      {/* Main Video Feed */}
      <VerticalFeed />

      {/* Persistent Navigation */}
      <BottomNav />
    </main>
  );
}
