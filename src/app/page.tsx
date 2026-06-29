
'use client';

import { VerticalFeed } from "@/components/VerticalFeed";
import { BottomNav } from "@/components/BottomNav";

export default function HomePage() {
  return (
    <main className="h-screen w-full bg-black relative">
      {/* Top Overlay Branding */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-center items-center z-40 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <div className="flex space-x-6">
          <button className="text-white/60 text-sm font-bold tracking-tight pointer-events-auto">Following</button>
          <button className="text-white text-sm font-bold tracking-tight border-b-2 border-primary pb-1 pointer-events-auto">For You</button>
        </div>
      </div>

      {/* Main Video Feed */}
      <VerticalFeed />

      {/* Persistent Navigation */}
      <BottomNav />
    </main>
  );
}
