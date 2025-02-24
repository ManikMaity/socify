"use client";

import { updateUserData } from "@/actions/profile.action";
import { toogleFollow } from "@/actions/user.action";
import { LikedPostData, ProfileData } from "@/config/interfaces";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "react-toastify";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { CalendarIcon, EditIcon, FileTextIcon, HeartIcon, LinkIcon, MapPinIcon } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PostCard from "../molicules/PostCard";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";


function ProfilePageClientComponent({data, isCurrentlyFollowing = false, likedPost} : {data : ProfileData, isCurrentlyFollowing : boolean, likedPost : LikedPostData[]}) {

   const {user : currentUser} = useUser();
   const [showEditModal, setShowEditModal] = useState(false);
   const [isFollowing, setIsFollowing] = useState(isCurrentlyFollowing);
   const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

   const [userData, setUserData] = useState({
    name : data?.name || "",
    bio : data?.bio || "",
    location : data?.location || "",
    website : data?.website || "",
   });

  async function updateEditSubmit () {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => formData.append(key, value));
    const res = await updateUserData(formData);
    if (res?.success) {
      setShowEditModal(false);
      toast.success("Profile updated successfully");
   }
  };

  async function handleFollow() {
    setIsUpdatingFollow(true);
    try {
       const res =  await toogleFollow(data?.id || "");
        if (res?.type === "follow") {
          setIsFollowing(true);
          toast.success("Followed Successfully");
        }
        else {
          setIsFollowing(false);
          toast.success("Unfollowed Successfully");
        }
    }
    catch(err){
      console.log(err);
      toast.error("Failed to follow user");
    }
    finally{
      setIsUpdatingFollow(false);
    }
  }

  const isOwnProfile = currentUser?.id === data?.clerkId;
  const formatedDate = data?.createdAt ? format(new Date(data.createdAt), "MMMM yyyy") : "Unknown";

  return (
    <div className="max-w-3xl mx-auto">
    <div className="grid grid-cols-1 gap-6">
      <div className="w-full max-w-lg mx-auto">
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={data?.image ?? "/avatar.png"} />
              </Avatar>
              <h1 className="mt-4 text-2xl font-bold">{data?.name ?? data?.username}</h1>
              <p className="text-muted-foreground">@{data?.username}</p>
              <p className="mt-2 text-sm">{data?.bio}</p>

              {/* PROFILE STATS */}
              <div className="w-full mt-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <div className="font-semibold">{data?._count.following.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <div className="font-semibold">{data?._count.followers.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <Separator orientation="vertical" />
                  <div>
                    <div className="font-semibold">{data?._count.posts.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                </div>
              </div>

              {/* "FOLLOW & EDIT PROFILE" BUTTONS */}
              {!currentUser ? (
                <SignInButton mode="modal">
                  <Button className="w-full mt-4">Follow</Button>
                </SignInButton>
              ) : isOwnProfile ? (
                <Button className="w-full mt-4" onClick={() => setShowEditModal(true)}>
                  <EditIcon className="size-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <Button
                  className="w-full mt-4"
                  onClick={handleFollow}
                  disabled={isUpdatingFollow}
                  variant={isFollowing ? "outline" : "default"}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}

              {/* LOCATION & WEBSITE */}
              <div className="w-full mt-6 space-y-2 text-sm">
                {data?.location && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPinIcon className="size-4 mr-2" />
                    {data?.location}
                  </div>
                )}
                {data?.website && (
                  <div className="flex items-center text-muted-foreground">
                    <LinkIcon className="size-4 mr-2" />
                    <a
                      href={
                        data?.website.startsWith("http") ? data?.website : `https://${data?.website}`
                      }
                      className="hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data?.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center text-muted-foreground">
                  <CalendarIcon className="size-4 mr-2" />
                  Joined {formatedDate}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="posts"
            className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
             data-[state=active]:bg-transparent px-6 font-semibold"
          >
            <FileTextIcon className="size-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="likes"
            className="flex items-center gap-2 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary
             data-[state=active]:bg-transparent px-6 font-semibold"
          >
            <HeartIcon className="size-4" />
            Likes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          <div className="space-y-6">
            {data?.posts?.length ?? 0 > 0 ? (
              data?.posts?.map((post) => <PostCard key={post.id} postData={post} userId={data.id} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground">No posts yet</div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="likes" className="mt-6">
          <div className="space-y-6">
            {likedPost.length > 0 ? (
              likedPost.map((post, index) => <PostCard key={post.id} postData={post} userId={data?.id || `${index}`} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground">No liked posts to show</div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                name="name"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                name="bio"
                value={userData.bio}
                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                className="min-h-[100px]"
                placeholder="Tell us about yourself"
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                name="location"
                value={userData.location}
                onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                placeholder="Where are you based?"
              />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input
                name="website"
                value={userData.website}
                onChange={(e) => setUserData({ ...userData, website: e.target.value })}
                placeholder="Your personal website"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={updateEditSubmit}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  </div>
  )
}

export default ProfilePageClientComponent
