
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

interface FeedItemProps {
  image: typeof PlaceHolderImages[0];
  index: number;
}

const FeedItem = ({ image, index }: FeedItemProps) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 500));

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setLiked(!liked);
    setLikes(prev => liked ? prev - 1 : prev + 1);
    
    // Simulating haptic-like micro-reaction
    if (!liked && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  };

  return (
    <div 
      className={cn(
        "masonry-item relative group rounded-2xl overflow-hidden bg-card animate-slide-in",
        `stagger-${(index % 3) + 1}`
      )}
    >
      <div className="relative w-full overflow-hidden">
        <img
          src={image.imageUrl}
          alt={image.description}
          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
          data-ai-hint={image.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-3 bg-card border-t border-white/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              <img src={`https://picsum.photos/seed/${image.id}/50/50`} className="w-full h-full object-cover" />
            </div>
            <span className="text-[11px] font-medium text-foreground/80">user_{image.id}</span>
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-[11px] text-muted-foreground line-clamp-2 mb-3">
          {image.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleLike}
              className={cn(
                "flex items-center space-x-1 elastic-scale",
                liked ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <Heart className={cn("w-4 h-4", liked && "fill-current")} />
              <span className="text-[10px] font-bold">{likes}</span>
            </button>
            <button className="flex items-center space-x-1 text-muted-foreground hover:text-accent elastic-scale">
              <MessageCircle className="w-4 h-4" />
              <span className="text-[10px] font-bold">{Math.floor(likes/10)}</span>
            </button>
          </div>
          <button className="text-muted-foreground hover:text-accent elastic-scale">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export function MasonryFeed() {
  return (
    <div className="px-3 pt-4 pb-24">
      <div className="masonry-grid">
        {PlaceHolderImages.map((img, idx) => (
          <FeedItem key={img.id} image={img} index={idx} />
        ))}
        {/* Doubling for demo scroll depth */}
        {PlaceHolderImages.map((img, idx) => (
          <FeedItem key={`copy-${img.id}`} image={{...img, id: img.id + "_copy"}} index={idx + PlaceHolderImages.length} />
        ))}
      </div>
    </div>
  );
}
