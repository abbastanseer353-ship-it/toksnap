
"use client";

import { useState, useEffect } from "react";
import { Grid, Settings, Share2, MapPin, Link as LinkIcon, Edit3, Heart, Loader2, Play } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

interface UserSnap {
  id: number;
  video_url: string;
  caption: string;
  likes_count: number;
}

export default function ProfilePage() {
  const [snaps, setSnaps] = useState<UserSnap[]>([]);
  const [loading, setLoading] = useState(true);
  const mockUserId = "user_786"; // In a real app, this would be from Auth

  useEffect(() => {
    async function fetchUserSnaps() {
      try {
        setLoading(true);
        // We are fetching all videos for now, in real app filter by user_id
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSnaps(data || []);
      } catch (err) {
        console.error("Error fetching user snaps:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserSnaps();
  }, []);

  return (
    <main className="min-h-screen bg-background max-w-md mx-auto relative shadow-2xl border-x border-white/5 pb-24">
      <header className="p-5 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-40 border-b border-white/5">
        <h1 className="text-lg font-headline font-bold">My Studio</h1>
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
                  src={`https://picsum.photos/seed/${mockUserId}/200/200`} 
                  className="w-full h-full object-cover" 
                  alt="Profile Avatar"
                />
              </div>
            </div>
            <button className="absolute -bottom-1 -right-1 p-2 bg-primary text-primary-foreground rounded-full border-4 border-background shadow-lg active:scale-90 transition-transform">
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-headline font-bold tracking-tight">Content Creator</h2>
            <p className="text-sm text-primary font-bold">@{mockUserId}</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
            Sharing my life moments, one snap at a time. 🎥✨
          </p>

          <div className="flex items-center space-x-4 pt-2">
            <div className="flex items-center space-x-1 text-[11px] text-muted-foreground font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>Global City</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mt-10 py-6 border-y border-white/5">
          <div className="text-center">
            <p className="text-lg font-headline font-bold">{snaps.length}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Snaps</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-headline font-bold">
              {snaps.reduce((acc, curr) => acc + (curr.likes_count || 0), 0)}
            </p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Likes</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-headline font-bold">1.2k</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Fans</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-center space-x-12 mt-4 py-2">
          <button className="flex flex-col items-center space-y-2 relative">
            <Grid className="w-6 h-6 text-primary" />
            <div className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full" />
          </button>
        </div>

        {/* My Snaps Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Loading your memories...</p>
          </div>
        ) : snaps.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 mt-8">
            {snaps.map((snap) => (
              <div 
                key={snap.id} 
                className="aspect-[4/5] rounded-2xl overflow-hidden bg-card relative group"
              >
                {snap.video_url.match(/\.(mp4|webm|mov)$/i) ? (
                   <div className="w-full h-full bg-black flex items-center justify-center">
                      <video src={snap.video_url} className="w-full h-full object-cover opacity-80" />
                      <Play className="absolute w-6 h-6 text-white/50" />
                   </div>
                ) : (
                  <img src={snap.video_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                )}
                
                <div className="absolute bottom-2 left-2 flex items-center space-x-1 text-white text-[10px] font-bold bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                  <Heart className="w-3 h-3 fill-primary text-primary" />
                  <span>{snap.likes_count || 0}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-sm text-muted-foreground">No snaps yet. Start creating!</p>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
