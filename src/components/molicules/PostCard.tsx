/* eslint-disable @next/next/no-img-element */
"use client";
import { createComment, deletePost, toogleLike } from "@/actions/post.action";
import { HomePost } from "@/config/interfaces";
import { useState } from "react";
import { toast } from "react-toastify";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "../ui/avatar";
import { HeartIcon, Loader2, LogInIcon, MessageCircleIcon, SendIcon, Share2, TrashIcon } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {formatDistanceToNow} from "date-fns"
import DeleteAlertDialog from "../atoms/DeleteAlertDialog";
import ShareDialog from "../atoms/ShareDialog";

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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [liked, setLiked] = useState(
    postData.likes.some((like) => like.userId === userId)
  );
  const [showFullContent, setShowFullContent] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(
    postData._count.likes
  );
  const {user} = useUser();

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
      console.log("Error while liking post", error);
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
        toast.error("Error while commenting on post");
      }
    } catch (error) {
      toast.error("Error while commenting on post");
      console.log("Error while commenting on post", error);
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
      console.log("Error while deleting post", error);
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

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col truncate">
                  <div className="flex items-center space-x-1">
                  <Link
                    href={`/profile/${postData.author.username}`}
                    className="font-semibold truncate"
                  >
                    {postData.author.name}
                  </Link>
                  {(postData.taggedUser && postData.taggedUser.length > 0) && (
                    <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                      <span className="text-muted-foreground"> - with </span>
                      {postData.taggedUser.map((user, index) => <Link key={user.user.id} href={`/profile/${user.user.username}`} className="text-primary font-semibold">{user.user.name}{index !== postData.taggedUser.length - 1 && ","}</Link>)}
                    </div>
                  )}
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground text-xs">
                    <Link href={`/profile/${postData.author.username}`}>@{postData.author.username}</Link>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(postData.createdAt))} ago</span>
                  </div>
                </div>
                <div>
                {/* Check if current user is the post author */}
                {userId === postData.author.id && (
                  <DeleteAlertDialog isDeleting={isDeleting} onDelete={handleDelete} >
                    <Button variant="ghost" size="sm" disabled={isDeleting}>
                        {isDeleting ? <Loader2 className="animate-spin"/> : <TrashIcon/>}
                    </Button>
                    </DeleteAlertDialog>
                )}
                <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setIsShareModalOpen(true)}>
                  <Share2/>
                </Button>
                <ShareDialog url={`${window.location.origin}/post/${postData.id}`} open={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} title="Share the post"/>
                </div>
              </div>
              <p className={`mt-2 text-sm text-foreground ${showFullContent ? "" : "line-clamp-5"}`} onClick={() => setShowFullContent(!showFullContent)}>{postData.content}</p>
              
            </div>
          </div>

          {/* POST IMAGE */}
          {postData.image && (
            <div className="rounded-lg overflow-hidden">
              <img src={postData.image} alt="Post content" className="w-full h-auto object-cover" />
            </div>
          )}

           {/* LIKE & COMMENT BUTTONS */}
           <div className="flex items-center pt-2 space-x-4">
            {userId ? (
              <Button
                variant="ghost"
                size="sm"
                className={`text-muted-foreground gap-2 ${
                  liked ? "text-red-500 hover:text-red-600" : "hover:text-red-500"
                }`}
                onClick={handleLike}
              >
                {liked ? (
                  <HeartIcon className="size-5 fill-current" />
                ) : (
                  <HeartIcon className="size-5" />
                )}
                <span>{optimisticLikeCount}</span>
              </Button>
            ) : (
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
                  <HeartIcon className="size-5" />
                  <span>{optimisticLikeCount}</span>
                </Button>
              </SignInButton>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-2 hover:text-blue-500"
              onClick={() => setShowComments((prev) => !prev)}
            >
              <MessageCircleIcon
                className={`size-5 ${showComments ? "fill-blue-500 text-blue-500" : ""}`}
              />
              <span>{postData.comments.length}</span>
            </Button>
          </div>

          {showComments && (
            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-4">
                {/* DISPLAY COMMENTS */}
                {postData.comments.map((comment) => (
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
                ))}
              </div>
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
                        onClick={handleComment}
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
              </div>)}
              

        </div>
      </CardContent>
    </Card>
  );
}

export default PostCard;
