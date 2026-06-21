"use client";

import React, { useState } from "react";
import { Heart, MessageCircle, Share2, Music2, Plus } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const FeedItem = ({ image, index }: { image: any; index: number }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 9000) + 1000);

  return (
    <div className="relative h-screen w-full snap-start flex items-center justify-center bg-black overflow-hidden">
      {/* Background Content (Simulated Video) */}
      <img
        src={image.imageUrl}
        alt={image.description}
        className="absolute inset-0 w-full h-full object-cover brightness-[0.8]"
        data-ai-hint={image.imageHint}
      />

      {/* Overlay Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 pb-28">
        <div className="flex justify-between items-end">
          {/* Left Side: Info */}
          <div className="flex-1 max-w-[80%] space-y-3">
            <div className="flex items-center space-x-2">
              <h3 className="font-headline font-bold text-lg text-white">@user_{image.id}</h3>
              <button className="bg-primary text-black px-2 py-0.5 rounded text-[10px] font-bold">Follow</button>
            </div>
            <p className="text-sm text-white/90 line-clamp-2 leading-relaxed">
              {image.description} #vibe #trending #toksnap
            </p>
            <div className="flex items-center space-x-2 text-white/70">
              <Music2 className="w-3.5 h-3.5 animate-pulse-subtle" />
              <span className="text-xs font-medium truncate">Original Sound - artist_{image.id}</span>
            </div>
          </div>

          {/* Right Side: Actions */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative mb-2">
              <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-xl">
                <img src={`https://picsum.photos/seed/${image.id}/100/100`} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-white rounded-full p-0.5 shadow-lg">
                <Plus className="w-3 h-3" />
              </div>
            </div>

            <button onClick={() => setLiked(!liked)} className="flex flex-col items-center space-y-1 group">
              <div className={cn(
                "w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center transition-all group-active:scale-90",
                liked ? "text-primary" : "text-white"
              )}>
                <Heart className={cn("w-6 h-6", liked && "fill-current")} />
              </div>
              <span className="text-xs font-bold text-white text-shadow-sm">{(likes/1000).toFixed(1)}k</span>
            </button>

            <button className="flex flex-col items-center space-y-1 group">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-active:scale-90 text-white">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-white text-shadow-sm">{Math.floor(likes / 45)}</span>
            </button>

            <button className="flex flex-col items-center space-y-1 group">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-active:scale-90 text-white">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-white text-shadow-sm">Share</span>
            </button>

            <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden animate-spin-slow">
              <img src={`https://picsum.photos/seed/music-${image.id}/50/50`} className="w-full h-full object-cover opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function VerticalFeed() {
  const feedItems = [...PlaceHolderImages, ...PlaceHolderImages]; // Doubled for scroll depth

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
      {feedItems.map((img, idx) => (
        <FeedItem key={`${img.id}-${idx}`} image={img} index={idx} />
      ))}
    </div>
  );
}
