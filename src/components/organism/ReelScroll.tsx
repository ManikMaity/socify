"use client";

import { useState, useRef, useEffect } from "react";
import { ReelType } from "@/config/interfaces";
import { ReelCard } from "../molicules/ReelCard";


interface ReelScrollProps {
  reels: ReelType[];
  className?: string;
  userId : string;
}

export function ReelScroll({ reels, className = "", userId }: ReelScrollProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Handle scroll events to determine which reel is active
  const handleScroll = () => {
    if (!containerRef.current || isScrolling) return;

    const container = containerRef.current;
    const containerHeight = container.clientHeight;
    const scrollTop = container.scrollTop;
    
    // Find the reel that is most visible in the viewport
    let maxVisibleIndex = 0;
    let maxVisibleArea = 0;

    reelRefs.current.forEach((reelRef, index) => {
      if (!reelRef) return;
      
      const reelTop = reelRef.offsetTop;
      const reelHeight = reelRef.clientHeight;
      const reelBottom = reelTop + reelHeight;
      
      const visibleTop = Math.max(reelTop, scrollTop);
      const visibleBottom = Math.min(reelBottom, scrollTop + containerHeight);
      
      if (visibleBottom > visibleTop) {
        const visibleArea = visibleBottom - visibleTop;
        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          maxVisibleIndex = index;
        }
      }
    });

    if (maxVisibleIndex !== activeIndex) {
      setActiveIndex(maxVisibleIndex);
    }
  };

  // Scroll to a specific reel
  const scrollToReel = (index: number) => {
    if (!containerRef.current || !reelRefs.current[index]) return;
    
    setIsScrolling(true);
    
    containerRef.current.scrollTo({
      top: reelRefs.current[index]?.offsetTop || 0,
      behavior: "smooth"
    });
    
    // Set active index and reset scrolling state after animation
    setTimeout(() => {
      setActiveIndex(index);
      setIsScrolling(false);
    }, 500);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && activeIndex > 0) {
        scrollToReel(activeIndex - 1);
      } else if (e.key === "ArrowDown" && activeIndex < reels.length - 1) {
        scrollToReel(activeIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, reels.length]);


  return (
    <div 
      ref={containerRef}
      className={`h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide ${className}`}
      onScroll={handleScroll}
    >
      {reels.map((reel, index) => (
        <div 
          key={reel.id}
          ref={el => {reelRefs.current[index] = el}}
          className="h-full w-full snap-start snap-always"
        >
          <ReelCard 
            userId={userId}
            reel={reel} 
            isActive={index === activeIndex}
          />
        </div>
      ))}
    </div>
  );
}