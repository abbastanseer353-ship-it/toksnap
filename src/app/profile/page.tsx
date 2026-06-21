
"use client";

import { Grid, Settings, Share2, MapPin, Link as LinkIcon, Edit3 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const userSnaps = PlaceHolderImages.slice(0, 4);

  return (
    <main className="min-h-screen bg-background max-w-md mx-auto relative shadow-2xl border-x border-white/5 pb-24">
      <header className="p-5 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-40 border-b border-white/5">
        <h1 className="text-lg font-headline font-bold">Profile</h1>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="p-6">
        {/* Profile Info */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary via-accent to-primary p-[3px] shadow-2xl shadow-primary/20 rotate-3 transition-transform hover:rotate-0">
              <div className="w-full h-full rounded-[1.85rem] bg-background flex items-center justify-center overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/profile/200/200" 
                  className="w-full h-full object-cover" 
                  alt="Profile Avatar"
                />
              </div>
            </div>
            <button className="absolute -bottom-1 -right-1 p-2 bg-primary text-primary-foreground rounded-full border-4 border-background shadow-lg elastic-scale">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-headline font-bold tracking-tight">Alex Rivera</h2>
            <p className="text-sm text-primary font-bold">@alex_snaps</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
            Capturing the neon pulse of the city one snap at a time. 🏙️✨
          </p>

          <div className="flex items-center space-x-4 pt-2">
            <div className="flex items-center space-x-1 text-[11px] text-muted-foreground font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>San Francisco, CA</span>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-accent font-bold">
              <LinkIcon className="w-3.5 h-3.5" />
              <span>toksnap.me/alex</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-10 py-6 border-y border-white/5">
          <div className="text-center">
            <p className="text-lg font-headline font-bold">42</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Snaps</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-headline font-bold">12.5k</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Reactions</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-headline font-bold">890</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Following</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center space-x-12 mt-4 py-2">
          <button className="flex flex-col items-center space-y-2 relative">
            <Grid className="w-6 h-6 text-primary" />
            <div className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full" />
          </button>
          <button className="flex flex-col items-center space-y-2 opacity-30">
            <Zap className="w-6 h-6" />
          </button>
          <button className="flex flex-col items-center space-y-2 opacity-30">
            <Heart className="w-6 h-6" />
          </button>
        </div>

        {/* My Snaps Grid */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          {userSnaps.map((img, idx) => (
            <div 
              key={img.id} 
              className={cn(
                "aspect-[4/5] rounded-2xl overflow-hidden bg-card relative group animate-slide-in",
                `stagger-${(idx % 3) + 1}`
              )}
            >
              <img src={img.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex items-center space-x-1 text-white text-xs font-bold">
                  <Heart className="w-4 h-4 fill-white" />
                  <span>{Math.floor(Math.random() * 200)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}

function Heart(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.71 12 2v10h8l-8 12.71V14H4z" />
    </svg>
  );
}
