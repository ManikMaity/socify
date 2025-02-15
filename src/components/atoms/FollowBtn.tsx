"use client"
import { useState } from "react"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { toogleFollow } from "@/actions/user.action"

function FollowBtn({followerId} : {followerId : string}) {

    const [isFollowing, setIsFollowing] = useState(false)

    async function handleFollow() {
        setIsFollowing(true);
        try {
           const data =  await toogleFollow(followerId);
            toast.success(data.type === "follow" ? "Followed Successfully" : "Unfollowed Successfully");
        }
        catch(error) {
            console.log(error);
            toast.error("Something went wrong");
        }
        finally{
            setIsFollowing(false);
        }
    }


  return (
    <Button variant={"outline"} size={"sm"} disabled={isFollowing} onClick={handleFollow}>
      {isFollowing ? <Loader2 className="h-4 w-4 animate-spin"/> : "Follow"}
    </Button>
  )
}

export default FollowBtn
