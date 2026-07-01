"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Share2, Music2, Loader2, AlertCircle, Play, Bookmark, Plus } from "lucide-react";
import supabase from "@/lib/supabaseClient";

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

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
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
      console.error("Like error:", err);
      setLiked(!isAdding);
      setLikes(likes);
    }
  };

  return (
    <div className="relative h-screen w-full max-w-[450px] mx-auto snap-start flex items-center justify-center bg-black overflow-hidden group border-x border-zinc-800">
      <video
        ref={videoRef}
        src={video.video_url}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        autoPlay
        playsInline
        muted
        onClick={togglePlay}
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none z-10">
          <Play className="w-20 h-20 text-white/50 fill-white/20" />
        </div>
      )}
      <div className="absolute bottom-24 left-6 text-white z-30">
        <h3 className="font-bold text-lg">@user</h3>
        <p className="text-sm">{video.caption || 'TokSnap Content'}</p>
      </div>
      <div className="absolute bottom-28 right-4 flex flex-col items-center space-y-6 z-30 text-white">
        <button onClick={handleLike} className="flex flex-col items-center">
          <Heart className={`w-8 h-8 ${liked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
          <span className="text-xs font-semibold">{likes}</span>
        </button>
        <button className="flex flex-col items-center">
          <MessageCircle className="w-8 h-8 text-white" />
          <span className="text-xs font-semibold">0</span>
        </button>
        <button className="flex flex-col items-center">
          <Share2 className="w-8 h-8 text-white" />
        </button>
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
        <div className="w-10 h-10 border-4 border-t-primary border-r-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white/40 text-sm font-medium">Loading TokSnap...</p>
      </div>
    );
  }

  if (error || videos.length === 0) {
    return (
      <div className="h-screen w-full max-w-[450px] mx-auto flex flex-col items-center justify-center bg-black p-10 text-center border-x border-zinc-800">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-white/20" />
        </div>
        <h2 className="text-xl font-bold mb-2 text-white">No snaps found</h2>
        <p className="text-muted-foreground text-sm mb-8">Be the first to post a snap!</p>
        <button onClick={() => window.location.href = '/upload'} className="bg-primary text-black px-8 py-3 rounded-full font-bold">Post Something</button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black scrollbar-none">
      {videos.map((video) => (
        <FeedItem key={video.id} video={video} />
      ))}
    </div>
  );
}
