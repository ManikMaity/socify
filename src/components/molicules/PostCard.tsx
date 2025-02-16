"use client";
import { createComment, deletePost, toogleLike } from "@/actions/post.action";
import { HomePost } from "@/config/interfaces";
import { useState } from "react";
import { toast } from "react-toastify";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "../ui/avatar";
import { HeartIcon, Loader2, LogInIcon, MessageCircleIcon, SendIcon, TrashIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import {formatDistanceToNow} from "date-fns"
import DeleteAlertDialog from "../atoms/DeleteAlertDialog";

function PostCard({
  postData,
  userId,
}: {
  postData: HomePost;
  userId: string;
}) {
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(
    postData.likes.some((like) => like.userId === userId)
  );
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(
    postData._count.likes
  );

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      setLiked(!liked);
      setOptimisticLikeCount(
        liked ? optimisticLikeCount - 1 : optimisticLikeCount + 1
      );
      await toogleLike(postData.id);
    } catch (error) {
      toast.error("Error while liking post");
      setOptimisticLikeCount(postData._count.likes);
      setLiked(postData.likes.some((like) => like.userId === userId));
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async () => {
    if (isCommenting || !newComment.trim()) return;
    setIsCommenting(true);
    try {
      const result = await createComment(newComment, postData.id);
      if (result?.success) {
        setNewComment("");
        toast.success("Comment created successfully");
      } else {
        // @ts-expect-error
        toast.error(result.error.message || "Error while commenting on post");
      }
    } catch (error) {
      toast.error("Error while commenting on post");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const result = await deletePost(postData.id);
      if (result?.success) {
        toast.success("Post deleted successfully");
      } else throw new Error("Error while deleting post");
    } catch (error) {
      toast.error("Error while deleting post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
     <CardContent className="p-3 sm:p-6">
        <div className="space-y-4">
          <div className="flex space-x-3 sm:space-x-4">
            <Link href={`/profile/${postData.author.username}`}>
              <Avatar className="size-8 sm:w-10 sm:h-10">
                <AvatarImage src={postData.author.image ?? "/avatar.png"} />
              </Avatar>
            </Link>

            {/* POST HEADER & TEXT CONTENT */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                  <Link
                    href={`/profile/${postData.author.username}`}
                    className="font-semibold truncate"
                  >
                    {postData.author.name}
                  </Link>
                  <div className="flex items-center space-x-2 sm:text-sm text-muted-foreground text-xs">
                    <Link href={`/profile/${postData.author.username}`}>@{postData.author.username}</Link>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(postData.createdAt))} ago</span>
                  </div>
                </div>
                {/* Check if current user is the post author */}
                {userId === postData.author.id && (
                  <DeleteAlertDialog isDeleting={isDeleting} onDelete={handleDelete} >
                    <Button variant="ghost" size="sm" disabled={isDeleting}>
                        {isDeleting ? <Loader2 className="animate-spin"/> : <TrashIcon/>}
                    </Button>
                    </DeleteAlertDialog>
                )}
              </div>
              <p className="mt-2 text-sm text-foreground break-words">{postData.content}</p>
            </div>
          </div>

          {/* POST IMAGE */}
          {postData.image && (
            <div className="rounded-lg overflow-hidden">
              <Image src={postData.image} alt="Post content" className="w-full h-auto object-cover" />
            </div>
          )}

          
        </div>
      </CardContent>
    </Card>
  );
}

export default PostCard;
