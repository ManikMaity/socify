"use client"
import { toogleLike } from "@/actions/post.action";
import { HomePost } from "@/config/interfaces"
import { useState } from "react"
import { toast } from "react-toastify";

function PostCard({postData, userId} : {postData : HomePost, userId : string}) {
    const [isLiking, setIsLiking] = useState(false);
    const [isCommenting, setIsCommenting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [liked, setLiked] = useState(postData.likes.some(like => like.userId === userId));
    const [optimisticLikeCount, setOptimisticLikeCount] = useState(postData._count.likes);

    const handleLike = async () => {
        if (isLiking) return;
        setIsLiking(true);
        try {
            setLiked(!liked);
            setOptimisticLikeCount(liked ? optimisticLikeCount - 1 : optimisticLikeCount + 1);
            await toogleLike(postData.id);
        }
        catch (error) {
         toast.error("Error while liking post");  
         setOptimisticLikeCount(postData._count.likes);
         setLiked(postData.likes.some(like => like.userId === userId)); 
        }
        finally{
            setIsLiking(false);
        }
    }

    const handleComment = async () => {
        setIsCommenting(true);
        try {}
        catch (error) {
         toast.error("Error while commenting on post");   
        }
        finally{
            setIsCommenting(false);
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        try {}
        catch (error) {
         toast.error("Error while deleting post");   
        }
        finally{
            setIsDeleting(false);
        }
    }

  return (
    <div>
      Post Card
    </div>
  )
}

export default PostCard
