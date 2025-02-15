"use client"
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "../ui/card"
import { useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { createPost } from "@/actions/post.action";
import { toast } from "react-toastify";

function CreatePostCard() {

  const { user } =  useUser();
  const [content , setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!content.trim() && !imageUrl) {
      toast.info("Please enter some text or upload an image");
      return;
    };
    setIsLoading(true);
    setIsError(false);
    try {
      const result = await createPost(content, imageUrl);
      if (result?.success){
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);
        setIsError(false);
        toast.success("Post created successfully");
      }
      else {
        setIsError(true);
        toast.error("Something went wrong");
      }
    }
    catch(error){
      console.log(error);
      setIsError(true);
      toast.error("Something went wrong");
    }
    finally {
      setIsLoading(false)
    }
  }


  return (
    <Card className="mb-6">
    <CardContent className="pt-6">
      <div className="space-y-4">
        <div className="flex space-x-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.imageUrl || "/avatar.png"} />
          </Avatar>
          <Textarea
            placeholder="What's on your mind?"
            className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {(showImageUpload || imageUrl) && (
          <div className="border rounded-lg p-4">
            
          </div>
        )}

        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              onClick={() => setShowImageUpload(!showImageUpload)}
              disabled={isLoading}
            >
              <ImageIcon className="size-4 mr-2" />
              Photo
            </Button>
          </div>
          <Button
            className="flex items-center"
            onClick={handleSubmit}
            disabled={(!content.trim() && !imageUrl) || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2Icon className="size-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <SendIcon className="size-4 mr-2" />
                Post
              </>
            )}
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
  )
}

export default CreatePostCard
