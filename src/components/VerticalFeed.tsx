
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Heart, MessageCircle, Share2, Music2, Loader2, AlertCircle, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

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
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if the URL is an image or video
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

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
      
      <div className="absolute inset-0 flex flex-col justify-end p-5 pb-32 pointer-events-none">
        <div className="flex justify-between items-end">
          <div className="flex-1 max-w-[80%] space-y-3 pointer-events-auto">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden bg-white/10 shadow-lg">
                <img 
                  src={`https://picsum.photos/seed/${video.user_id}/100/100`} 
                  className="w-full h-full object-cover" 
                  alt="avatar" 
                />
              </div>
              <div>
                <h3 className="font-headline font-bold text-base text-white text-shadow-sm">@user_{video.user_id.slice(0, 5)}</h3>
                <div className="flex items-center space-x-1 text-primary">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{isVideo ? 'Original Sound' : 'Snap Moment'}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-white/90 line-clamp-2 leading-relaxed text-shadow-sm">{video.caption}</p>
          </div>

          <div className="flex flex-col items-center space-y-6 pointer-events-auto">
            <button onClick={handleLike} className="flex flex-col items-center space-y-1 group">
              <div className={cn(
                "w-12 h-12 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-300",
                liked 
                  ? "bg-primary/20 border-primary text-primary scale-110" 
                  : "bg-black/20 border-white/10 text-white"
              )}>
                <Heart className={cn("w-6 h-6", liked && "fill-current")} />
              </div>
              <span className="text-xs font-bold text-white text-shadow-sm">{likes}</span>
            </button>

            <button className="flex flex-col items-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-white text-shadow-sm">0</span>
            </button>

            <button onClick={handleShare} className="flex flex-col items-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
                <Share2 className="w-6 h-6" />
              </div>
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
        setError(null);
        
        const { data, error: sbError } = await supabase
          .from('videos')
          .select('*')
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
