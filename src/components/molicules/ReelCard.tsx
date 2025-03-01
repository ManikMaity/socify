"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Heart,
  LogInIcon,
  MessageCircle,
  SendIcon,
  Share2,
} from "lucide-react";
import { formatNumber } from "@/lib/utilFunc";
import { ReelType } from "@/config/interfaces";
import { toast } from "react-toastify";
import { toogleReelLike } from "@/actions/reel.action";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Textarea } from "../ui/textarea";
import { formatDistanceToNow } from "date-fns";

interface ReelCardProps {
  reel: ReelType;
  isActive: boolean;
  onVideoLoaded: () => void;
  userId: string;
}

export function ReelCard({
  reel,
  isActive,
  onVideoLoaded,
  userId,
}: ReelCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [liked, setLiked] = useState(
    reel.likes.some((like) => like.userId === userId)
  );
  const [showFullContent, setShowFullContent] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(
    reel._count.likes
  );
  const { user } = useUser();

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      setLiked(!liked);
      setOptimisticLikeCount(
        liked ? optimisticLikeCount - 1 : optimisticLikeCount + 1
      );
      await toogleReelLike(reel.id);
    } catch (error) {
      toast.error("Error while liking reel");
      console.log("Error while liking reel", error);
      setOptimisticLikeCount(reel._count.likes);
      setLiked(reel.likes.some((like) => like.userId === userId));
    } finally {
      setIsLiking(false);
    }
  };

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
            .catch((error) => {
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

  return (
    <div className="relative h-full w-full flex items-center justify-center bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        src={
          reel.videoUrl ||
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        }
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
                <AvatarImage
                  src={
                    reel.author.image ||
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80"
                  }
                  alt={reel.author.username}
                />
                <AvatarFallback>
                  {reel.author.username.substring(1, 3).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-white font-medium">
                {reel.author.username}
              </span>
            </div>
            <p className="text-white text-sm">{reel.content}</p>
          </div>

          {/* Action buttons */}
          <div className="absolute right-4 bottom-20 flex flex-col gap-4 pointer-events-auto">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
              onClick={handleLike}
            >
              <Heart
                className={`h-6 w-6 ${
                  liked ? "fill-red-500 text-red-500" : "text-white"
                }`}
              />
            </Button>
            <div className="text-white text-xs font-medium text-center">
              {formatNumber(optimisticLikeCount)}
            </div>

            <Button
              variant="ghost"
              onClick={() => setShowComments((prev) => !prev)}
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
        <Drawer open={showComments} onClose={() => setShowComments(false)}>
          <DrawerContent className="h-full w-full">
            <DrawerHeader>
              <DrawerTitle>Comments</DrawerTitle>
            </DrawerHeader>
            <div>
            {reel._count.comments > 0 ? reel.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <Avatar className="size-8 flex-shrink-0">
                      <AvatarImage src={comment.author.image ?? "/avatar.png"} />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-medium text-sm">{comment.author.name}</span>
                        <span className="text-xs text-muted-foreground">
                          @{comment.author.username}
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt))} ago
                        </span>
                      </div>
                      <p className="text-sm break-words">{comment.content}</p>
                    </div>
                  </div>
                )) : <p className="text-center mt-4 text-foreground">No comments</p>}
            </div>
            <DrawerFooter>
            {userId ? (
                <div className="flex space-x-3">
                  <Avatar className="size-8 flex-shrink-0">
                    <AvatarImage src={user?.imageUrl || "/avatar.png"} />
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="sm"
                        className="flex items-center gap-2"
                        disabled={!newComment.trim() || isCommenting}
                      >
                        {isCommenting ? (
                          "Posting..."
                        ) : (
                          <>
                            <SendIcon className="size-4" />
                            Comment
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center p-4 border rounded-lg bg-muted/50">
                  <SignInButton mode="modal">
                    <Button variant="outline" className="gap-2">
                      <LogInIcon className="size-4" />
                      Sign in to comment
                    </Button>
                  </SignInButton>
                </div>
              )}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
