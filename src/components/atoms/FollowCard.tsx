import { WhoToFollow } from "@/config/interfaces"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import FollowBtn from "./FollowBtn"

function FollowCard({followUser} : {followUser : WhoToFollow}) {
  return (
    <div className="flex gap-4 text-xs py-2 px-3 items-center justify-between border rounded-md">
      <Avatar className="w-8 h-8">
        <AvatarImage src={followUser.image || "/avatar.png"} />
        <AvatarFallback>{followUser.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex text-[10px] flex-col gap-0.5 overflow-hidden">
        <h3>{followUser.name}</h3>
        <p className="text-muted-foreground">@{followUser.username}</p>
        <p className="text-muted-foreground">{followUser._count.following} followers</p>
      </div>
      <FollowBtn followerId={followUser.id}/>
    </div>
  )
}

export default FollowCard
