
'use client';

import React, { useState, useEffect, useRef } from "react";
import { Heart, MessageCircle, Share2, Music2, Loader2, AlertCircle, Play, Download, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface VideoData {
  id: number;
  user_id: string;
  video_url: string;
  caption: string;
  created_at: string;
  likes_count: number;
}

const FeedItem = ({ video }: { video: VideoData }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(video.likes_count || 0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHeart, setShowHeart] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideo = video.video_url.match(/\.(mp4|webm|ogg|mov)$/i) || !video.video_url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = async () => {
    const isAdding = !liked;
    setLiked(isAdding);
    const newCount = isAdding ? likes + 1 : Math.max(0, likes - 1);
    setLikes(newCount);

    if (isAdding) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }

    try {
      const { error } = await supabase
        .from('videos')
        .update({ likes_count: newCount })
        .eq('id', video.id);
      
      if (error) throw error;
    } catch (err) {
      console.error("Like update failed:", err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'TokSnap',
        text: video.caption,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(video.video_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `toksnap-${video.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Could not download video.");
    }
  };

  return (
    <div className="relative h-screen w-full snap-start flex items-center justify-center bg-black overflow-hidden group">
      {isVideo ? (
        <>
          <video
            ref={videoRef}
            src={video.video_url}
            className="absolute inset-0 w-full h-full object-cover"
            loop
            muted
            autoPlay
            playsInline
            onClick={togglePlay}
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
              <Play className="w-16 h-16 text-white/50 fill-white/20" />
            </div>
          )}
        </>
      ) : (
        <img 
          src={video.video_url} 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Snap content"
        />
      )}

      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <Heart className="w-32 h-32 text-primary fill-primary opacity-80 animate-ping" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />
      
      <div className="absolute inset-0 flex flex-col justify-end p-5 pb-32 pointer-events-none">
        <div className="flex justify-between items-end">
          <div className="flex-1 max-w-[80%] space-y-3 pointer-events-auto">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden bg-white/10">
                <img 
                  src={`https://picsum.photos/seed/${video.user_id}/100/100`} 
                  className="w-full h-full object-cover" 
                  alt="avatar" 
                />
              </div>
              <div>
                <h3 className="font-headline font-bold text-base text-white text-shadow-sm">@user_{video.user_id.slice(-4)}</h3>
                <div className="flex items-center space-x-1 text-primary">
                  <Music2 className="w-3 h-3 animate-spin-slow" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Original Sound - TokSnap</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-white/90 line-clamp-2 leading-relaxed text-shadow-sm font-medium">{video.caption}</p>
          </div>

          <div className="flex flex-col items-center space-y-5 pointer-events-auto">
            <button onClick={handleLike} className="flex flex-col items-center space-y-1 active:scale-90 transition-transform">
              <div className={cn(
                "w-12 h-12 rounded-full backdrop-blur-md border flex items-center justify-center transition-all",
                liked ? "bg-primary/30 border-primary text-primary" : "bg-black/40 border-white/20 text-white"
              )}>
                <Heart className={cn("w-6 h-6", liked && "fill-current")} />
              </div>
              <span className="text-[10px] font-bold text-white">{likes}</span>
            </button>

            <Sheet>
              <SheetTrigger asChild>
                <button className="flex flex-col items-center space-y-1 active:scale-90 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-white">0</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh] rounded-t-[2.5rem] bg-background border-t-0 p-0 overflow-hidden">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Comments</h3>
                    <X className="w-5 h-5 opacity-40" />
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-30">
                    <MessageCircle className="w-12 h-12" />
                    <p className="text-xs font-bold uppercase">No comments yet</p>
                  </div>
                  <div className="mt-auto pb-8 flex items-center space-x-3">
                    <input 
                      className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Add a comment..."
                    />
                    <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <button onClick={handleShare} className="flex flex-col items-center space-y-1 active:scale-90 transition-transform">
              <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-white">Share</span>
            </button>

            <button onClick={handleDownload} className="flex flex-col items-center space-y-1 active:scale-90 transition-transform opacity-70">
              <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white">
                <Download className="w-5 h-5" />
              </div>
              <span className="text-[8px] font-bold text-white uppercase tracking-tighter">Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function VerticalFeed() {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        const { data, error: sbError } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (sbError) throw sbError;
        setVideos(data || []);
      } catch (err: any) {
        setError(err.message || "Could not load feed.");
      } finally {
        setLoading(false);
      }
    }
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">TokSnap is loading...</p>
      </div>
    );
  }

  if (error || videos.length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black p-10 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Play className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl font-bold mb-2">No videos yet</h2>
        <p className="text-muted-foreground text-sm mb-8">Be the first to share a moment with the world!</p>
        <Button onClick={() => window.location.href = '/upload'} className="bg-primary px-8 rounded-full font-bold">Post Now</Button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
      {videos.map((video) => <FeedItem key={video.id} video={video} />)}
    </div>
  );
}
