"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, Heart, MessageCircle, Share2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumber } from "@/lib/utilFunc";
import { ReelType } from "@/config/interfaces";


interface ReelScrollProps {
  reels: ReelType[];
  className?: string;
}

export function ReelScroll({ reels, className }: ReelScrollProps) {
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState<boolean[]>(Array(reels.length).fill(false));
  const [videosLoaded, setVideosLoaded] = useState<boolean[]>(Array(reels.length).fill(false));
  const reelContainerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, reels.length);
  }, [reels]);

  useEffect(() => {
    const handleScroll = () => {
      if (!reelContainerRef.current) return;
      
      const container = reelContainerRef.current;
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;
      
      // Calculate which reel is most visible
      const reelIndex = Math.round(scrollTop / containerHeight);
      
      if (reelIndex !== currentReelIndex && reelIndex >= 0 && reelIndex < reels.length) {
        setCurrentReelIndex(reelIndex);
        
        // Update playing state for all videos
        const newPlayingState = Array(reels.length).fill(false);
        newPlayingState[reelIndex] = true;
        setIsPlaying(newPlayingState);
        
        // Attempt to play the current video
        const currentVideo = videoRefs.current[reelIndex];
        if (currentVideo) {
          // Only try to play if the video is loaded
          if (currentVideo.readyState >= 2) {
            currentVideo.play().catch(err => {
              console.log("Video play prevented:", err.message);
              // Don't show error in console for autoplay restrictions
            });
          }
          
          // Pause all other videos
          videoRefs.current.forEach((video, idx) => {
            if (video && idx !== reelIndex && !video.paused) {
              video.pause();
              video.currentTime = 0;
            }
          });
        }
      }
    };

    const container = reelContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [currentReelIndex, reels.length]);

  // Handle video loaded metadata
  const handleVideoLoaded = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      // Mark this video as loaded
      const newLoadedState = [...videosLoaded];
      newLoadedState[index] = true;
      setVideosLoaded(newLoadedState);
      
      // Try to play the video if it's the current one
      if (index === currentReelIndex) {
        video.play().catch(err => {
          console.log("Video play prevented:", err.message);
          // Don't show error in console for autoplay restrictions
        });
      }
    }
  };

  // Handle manual video play
  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (video.paused) {
      video.play().catch(err => {
        console.log("Video play prevented:", err.message);
      });
      
      // Update playing state
      const newPlayingState = [...isPlaying];
      newPlayingState[index] = true;
      setIsPlaying(newPlayingState);
    } else {
      video.pause();
      
      // Update playing state
      const newPlayingState = [...isPlaying];
      newPlayingState[index] = false;
      setIsPlaying(newPlayingState);
    }
  };

  const scrollToReel = (index: number) => {
    if (index >= 0 && index < reels.length && reelContainerRef.current) {
      reelContainerRef.current.scrollTo({
        top: index * reelContainerRef.current.clientHeight,
        behavior: "smooth"
      });
    }
  };

  const handleNext = () => {
    scrollToReel(currentReelIndex + 1);
  };

  const handlePrevious = () => {
    scrollToReel(currentReelIndex - 1);
  };

  return (
    <div className={cn("relative h-full w-full max-w-md mx-auto", className)}>
      {/* Main reel container */}
      <div 
        ref={reelContainerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reels.map((reel, index) => (
          <div 
            key={reel.id}
            className="h-full w-full snap-start snap-always relative flex items-center justify-center"
          >

            
            {/* Video */}
            <video
              ref={e => {videoRefs.current[index] = e}}
              src={reel.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
              className="h-full w-full object-cover"
              loop
              muted
              playsInline
              preload="metadata"
              poster={reel.author.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80"} 
              onClick={() => handleVideoClick(index)}
              onLoadedData={() => handleVideoLoaded(index)}
            />
            
            {/* Play/Pause overlay - only show if video is loaded but paused */}
            {videosLoaded[index] && !isPlaying[index] && (
              <div 
                className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
                onClick={() => handleVideoClick(index)}
              >
                <div className="bg-black/30 rounded-full p-4 backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
            )}
            
            {/* Overlay content */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />
            
            {/* Caption and username */}
            <div className="absolute bottom-8 left-4 right-12 text-white z-10">
              <h3 className="font-bold text-lg">{reel.author.username}</h3>
              <p className="text-sm mt-1 line-clamp-2">{reel.content}</p>
            </div>
            
            {/* Right side actions */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10">
              <div className="flex flex-col items-center">
                <Button variant="ghost" size="icon" className="rounded-full bg-black/20 text-white hover:bg-black/40">
                  <Heart className="h-6 w-6" />
                </Button>
                <span className="text-white text-xs mt-1">{formatNumber(reel._count.likes)}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <Button variant="ghost" size="icon" className="rounded-full bg-black/20 text-white hover:bg-black/40">
                  <MessageCircle className="h-6 w-6" />
                </Button>
                <span className="text-white text-xs mt-1">{formatNumber(reel._count.comments)}</span>
              </div>
              
              <Button variant="ghost" size="icon" className="rounded-full bg-black/20 text-white hover:bg-black/40">
                <Share2 className="h-6 w-6" />
              </Button>
              
              <Button variant="ghost" size="icon" className="rounded-full bg-black/20 text-white hover:bg-black/40">
                <MoreVertical className="h-6 w-6" />
              </Button>
            </div>
            
            {/* User avatar */}
            <div className="absolute right-4 bottom-96 z-10">
              <Avatar className="h-12 w-12 border-2 border-white">
               <AvatarImage src={reel.author.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80"} alt={reel.author.username} />
               <AvatarFallback>{reel.author.username[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        ))}
      </div>
      
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "rounded-full bg-black/20 text-white hover:bg-black/40",
            currentReelIndex === 0 && "opacity-50 cursor-not-allowed"
          )}
          onClick={handlePrevious}
          disabled={currentReelIndex === 0}
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "rounded-full bg-black/20 text-white hover:bg-black/40",
            currentReelIndex === reels.length - 1 && "opacity-50 cursor-not-allowed"
          )}
          onClick={handleNext}
          disabled={currentReelIndex === reels.length - 1}
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Current reel indicator */}
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-center">
        <div className="flex gap-1">
          {reels.map((_, index) => (
            <div 
              key={index} 
              className={cn(
                "h-1 w-6 rounded-full",
                index === currentReelIndex ? "bg-white" : "bg-white/30"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}