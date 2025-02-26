"use client"
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "../ui/card"
import { useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ImageIcon, Loader2Icon, SendIcon, User } from "lucide-react";
import { createPost } from "@/actions/post.action";
import { toast } from "react-toastify";
import ImageUpload from "./ImageUpload";
import TagUserSearch from "../atoms/TagUserSearch";
import { SearchUser } from "@/config/interfaces";
import TooltipProv from "../atoms/TooltipProv";

function CreatePostCard() {

  const { user } =  useUser();
  const [content , setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showTagUserInput, setShowTagUserInput] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState<SearchUser[]>([]);

  

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) {
      toast.info("Please enter some text or upload an image");
      return;
    };
    setIsLoading(true);
    try {
      const result = await createPost(content, imageUrl, taggedUsers.map(u => u.id));
      if (result?.success){
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);
        toast.success("Post created successfully");
      }
      else {
        toast.error("Something went wrong");
      }
    }
    catch(error){
      console.log(error);
      toast.error("Something went wrong");
    }
    finally {
      setIsLoading(false)
    }
  }


  return (
    <Card className="mb-6">
    <CardContent className="p-4 md:p-6">
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
        {taggedUsers.length > 0 && (
          <div className="flex space-x-2">
            {taggedUsers.map((user) => (
              <TooltipProv key={user.id} text={"Click to remove"}>
              <Button
                onClick={() => {
                  setTaggedUsers(taggedUsers.filter(u => u.id !== user.id))
                }}
                variant="ghost"
                size="sm" 
                className="text-muted-foreground hover:text-primary p-1 rounded-full"
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={user.image || "/avatar.png"} />
                </Avatar>
                <p>{user.name}</p>
              </Button>
              </TooltipProv>
            ))}
          </div>
        )}

        {(showImageUpload || imageUrl) && (
          <div className="border rounded-lg p-4">
            <ImageUpload endpoint="postImage" value={imageUrl} onChange={(url) => {
              setImageUrl(url);
              setShowImageUpload(false)
            }} />
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
              onClick={() => setShowTagUserInput(!showTagUserInput)}
              disabled={isLoading}
            >
              <User className="size-4 mr-2" />
              Tag
            </Button>
            <TagUserSearch taggedUsers={taggedUsers} setTaggedUsers={setTaggedUsers} open={showTagUserInput} onOpenChange={() => setShowTagUserInput(false)}/>
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
