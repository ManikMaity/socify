"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { formatNumber } from "@/lib/utilFunc";
import { ReelType } from "@/config/interfaces";

interface ReelCardProps {
  reel: ReelType;
  isActive: boolean;
  onVideoLoaded: () => void;
}

export function ReelCard({ reel, isActive, onVideoLoaded }: ReelCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video playback based on active state
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isActive) {
      try {
        videoElement.currentTime = 0;
        const playPromise = videoElement.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Playback started successfully
            })
            .catch(error => {
              console.error("Error playing video:", error);
            });
        }
      } catch (error) {
        console.error("Error playing video:", error);
      }
    } else {
      try {
        videoElement.pause();
      } catch (error) {
        console.error("Error pausing video:", error);
      }
    }
  }, [isActive]);

  // Handle video loaded
  const handleVideoLoaded = () => {
    setIsLoading(false);
    onVideoLoaded();
  };

  // Toggle like state
  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
        className="h-full w-full object-contain"
        loop
        playsInline
        muted
        onLoadedData={handleVideoLoaded}
      />



      {/* Content overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative h-full w-full flex flex-col justify-between p-4">
          {/* Caption and username */}
          <div className="mt-auto mb-2 max-w-[80%]">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-8 w-8 border border-white">
                <AvatarImage src={reel.author.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80"} alt={reel.author.username} />
                <AvatarFallback>{reel.author.username.substring(1, 3).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-white font-medium">{reel.author.username}</span>
            </div>
            <p className="text-white text-sm">{reel.content}</p>
          </div>

          {/* Action buttons */}
          <div className="absolute right-4 bottom-20 flex flex-col gap-4 pointer-events-auto">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
              onClick={toggleLike}
            >
              <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`} />
            </Button>
            <div className="text-white text-xs font-medium text-center">
              {formatNumber(reel._count.likes)}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
            >
              <MessageCircle className="h-6 w-6 text-white" />
            </Button>
            <div className="text-white text-xs font-medium text-center">
              {formatNumber(reel._count.comments)}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
            >
              <Share2 className="h-6 w-6 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}