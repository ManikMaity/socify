/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { HomePost } from "@/config/interfaces";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Loader2, TrashIcon } from "lucide-react";
import { deletePostImage, updatePost } from "@/actions/post.action";
import { toast } from "react-toastify";

function EditPostModal({
  openEdit,
  onCloseEdit,
  postData,
}: {
  openEdit: boolean;
  onCloseEdit: () => void;
  postData: HomePost;
}) {
  const [data, setData] = useState({
    content: postData.content,
    imageUrl: postData.image,
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDeleteImage = async () => {
    setIsDeleting(true);
    const res = await deletePostImage(data.imageUrl as string);
    if (res.success) {
      setData((p) => ({ ...p, imageUrl: null }));
      toast.success("Image deleted successfully");
    }
    else {
      toast.error("Something went wrong while deleting image");
    }
    setIsDeleting(false);
  }


  async function handleSaveChanges () {
    setIsUpdating(true);
    try {
      const res = await updatePost(postData.id, data.content || "", data.imageUrl)
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      onCloseEdit();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch(error : any){
      console.log(error);
      toast.error(error?.message || "Error while updating the post")
    }
    finally{
      setIsUpdating(true);
    }
  }

  return (
    <Dialog open={openEdit} onOpenChange={onCloseEdit}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <div>
          <Textarea
            placeholder="What's on your mind?"
            className="min-h-[70px] resize-none border-none focus-visible:ring-0 p-0 text-base"
            value={data.content as string}
            onChange={(e) =>
              setData((p) => ({ ...p, content: e.target.value }))
            }
          />

          <Separator className="my-2" />
          {data.imageUrl && (
            <div className="w-24 h-24 rounded-md overflow-hidden relative">
              <img src={data.imageUrl} className="w-full h-full object-cover" />
              <Button variant="outline" size="sm" disabled={isDeleting} onClick={handleDeleteImage} className="z-10 absolute right-2 top-2 px-1 py-0.5" >
                        {isDeleting ? <Loader2 className="animate-spin"/> : <TrashIcon/>}
                </Button>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSaveChanges}
            disabled={
              (postData.content === data.content &&
              postData.image === data.imageUrl) || isUpdating
            }
          >
            {isUpdating ? <Loader2 className="animate-spin"/> :"Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditPostModal;
