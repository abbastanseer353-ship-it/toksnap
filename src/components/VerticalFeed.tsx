
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Share2, Music2, Loader2, AlertCircle, Play, Bookmark, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

interface VideoData {
  id: number;
  user_id: string;
  video_url: string;
  caption: string;
  created_at: string;
  likes_count: number;
  profiles: {
    username: string;
    avatar_url: string;
  } | null;
}

const FeedItem = ({ video }: { video: VideoData }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(video.likes_count || 0);
  const [isPlaying, setIsPlaying] = useState(true);
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

    try {
      const { error } = await supabase
        .from('videos')
        .update({ likes_count: newCount })
        .eq('id', video.id);
      
      if (error) throw error;
    } catch (err) {
      console.error("Like update failed:", err);
      setLiked(!isAdding);
      setLikes(likes);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'TokSnap',
        text: video.caption,
        url: window.location.href,
      }).catch(console.error);
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
            autoPlay
            playsInline
            onClick={togglePlay}
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none z-10">
              <Play className="w-20 h-20 text-white/50 fill-white/20" />
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
      
      <div className="absolute bottom-0 left-0 right-0 p-5 pb-24 flex justify-between items-end z-20">
          <div className="max-w-[70%] space-y-3">
            <h3 className="font-bold text-lg text-white text-shadow-md">@{video.profiles?.username || `user_${video.user_id.slice(0,5)}`}</h3>
            <p className="text-sm text-white/95 line-clamp-3 leading-relaxed text-shadow-sm">{video.caption}</p>
            <div className="flex items-center space-x-2">
              <Music2 className="w-5 h-5 text-white" />
              <p className="text-sm font-semibold text-white text-shadow-sm">{isVideo ? 'Original Sound' : 'Snap Moment'}</p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <Link href={`/profile/${video.user_id}`} className="relative block group">
              <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden bg-white/10 shadow-lg transition-transform duration-300 group-hover:scale-110">
                <img 
                  src={video.profiles?.avatar_url || `https://picsum.photos/seed/${video.user_id}/100/100`} 
                  className="w-full h-full object-cover" 
                  alt="avatar" 
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-black group-hover:bg-white transition-colors duration-300">
                <Plus className="w-4 h-4 text-white group-hover:text-primary transition-colors duration-300" strokeWidth={3} />
              </div>
            </Link>

            <button onClick={handleLike} className="flex flex-col items-center space-y-1 group">
              <div className={cn(
                "w-12 h-12 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300 transform group-hover:scale-110",
                liked 
                  ? "bg-rose-500/80 border-rose-400 text-white" 
                  : "bg-black/20 border-white/10 text-white"
              )}>
                <Heart className={cn("w-6 h-6", liked && "fill-current")} />
              </div>
              <span className="text-xs font-bold text-white text-shadow-sm">{likes}</span>
            </button>

            <button className="flex flex-col items-center space-y-1 group">
              <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-white text-shadow-sm">0</span>
            </button>

            <button className="flex flex-col items-center space-y-1 group">
              <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
                <Bookmark className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-white text-shadow-sm">Save</span>
            </button>

            <button onClick={handleShare} className="flex flex-col items-center space-y-1 group">
              <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
                <Share2 className="w-6 h-6" />
              </div>
               <span className="text-xs font-bold text-white text-shadow-sm">Share</span>
            </button>
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
        setError(null);
        
        const { data, error: sbError } = await supabase
          .from('videos')
          .select('*, profiles(username, avatar_url)')
          .order('created_at', { ascending: false });
        
        if (sbError) throw sbError;
        setVideos(data || []);
      } catch (err: any) {
        console.error("Supabase fetch error:", err);
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
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-white/40 text-sm font-medium">Loading TokSnap...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black p-10 text-center">
        <AlertCircle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Error loading feed</h2>
        <p className="text-muted-foreground text-sm mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold">Try Again</button>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black p-10 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <Music2 className="w-10 h-10 text-white/20" />
        </div>
        <h2 className="text-xl font-bold mb-2">No snaps found</h2>
        <p className="text-muted-foreground text-sm mb-8">Be the first to post a snap!</p>
        <button onClick={() => window.location.href = '/upload'} className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold">Post Something</button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
      {videos.map((video) => <FeedItem key={video.id} video={video} />)}
    </div>
  );
}
