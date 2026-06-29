
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Heart, MessageCircle, Share2, Music2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoData {
  id: number;
  user_id: string;
  video_url: string;
  caption: string;
  created_at: string;
}

const FeedItem = ({ video }: { video: VideoData }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 9000) + 1000);
  const videoRef = useRef<HTMLVideoElement>(null);

  // In a real app, you'd use an Intersection Observer to play/pause
  // For this MVP, we'll use autoPlay and loop

  return (
    <div className="relative h-screen w-full snap-start flex items-center justify-center bg-black overflow-hidden">
      {/* Real Video Content */}
      <video
        ref={videoRef}
        src={video.video_url}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted
        autoPlay
        playsInline
      />

      {/* Overlay Gradients for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 pb-32">
        <div className="flex justify-between items-end">
          {/* Left Side: Info */}
          <div className="flex-1 max-w-[80%] space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden bg-white/10">
                <img 
                  src={`https://picsum.photos/seed/${video.user_id}/100/100`} 
                  className="w-full h-full object-cover" 
                  alt="avatar" 
                />
              </div>
              <h3 className="font-headline font-bold text-base text-white">@user_{video.user_id}</h3>
              <button className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-[10px] font-bold">Follow</button>
            </div>
            <p className="text-sm text-white/90 line-clamp-2 leading-relaxed">
              {video.caption}
            </p>
            <div className="flex items-center space-x-2 text-white/70">
              <Music2 className="w-3.5 h-3.5 animate-pulse-subtle" />
              <span className="text-xs font-medium truncate italic">Original Sound - TokSnap User</span>
            </div>
          </div>

          {/* Right Side: Actions */}
          <div className="flex flex-col items-center space-y-5">
            <button onClick={() => setLiked(!liked)} className="flex flex-col items-center space-y-1 group">
              <div className={cn(
                "w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all active:scale-90",
                liked ? "text-primary" : "text-white"
              )}>
                <Heart className={cn("w-6 h-6", liked && "fill-current")} />
              </div>
              <span className="text-xs font-bold text-white text-shadow-sm">{(likes/1000).toFixed(1)}k</span>
            </button>

            <button className="flex flex-col items-center space-y-1 group">
              <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center active:scale-90 text-white">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-white text-shadow-sm">{Math.floor(likes / 45)}</span>
            </button>

            <button className="flex flex-col items-center space-y-1 group">
              <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center active:scale-90 text-white">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-white text-shadow-sm">Share</span>
            </button>

            <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden animate-[spin_4s_linear_infinite] mt-2">
              <img src={`https://picsum.photos/seed/music-${video.id}/50/50`} className="w-full h-full object-cover" alt="vinyl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function VerticalFeed() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch('/api/videos');
        const data = await response.json();
        if (Array.isArray(data)) {
          setVideos(data);
        }
      } catch (error) {
        console.error("Failed to load videos", error);
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-white/40 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest">Loading Snaps...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
      {videos.length > 0 ? (
        videos.map((video) => (
          <FeedItem key={video.id} video={video} />
        ))
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-white/40 p-10 text-center space-y-4">
          <p className="text-lg font-headline font-bold text-white/60">No snaps found</p>
          <p className="text-sm">Be the first to share a moment with the community!</p>
        </div>
      )}
    </div>
  );
}
