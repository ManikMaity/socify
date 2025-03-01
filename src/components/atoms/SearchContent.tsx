/* eslint-disable @next/next/no-img-element */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchPost, SearchUser } from "@/config/interfaces";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "../ui/scroll-area";
import FollowCard from "./FollowCard";

function SearchContent({
  postSeachResult,
  searchUserResult,
}: {
  postSeachResult: SearchPost[];
  searchUserResult: SearchUser[];
}) {
  return (
    <div className="p-3">
      <Tabs defaultValue="account" className="">
        <TabsList>
          <TabsTrigger value="account">Posts</TabsTrigger>
          <TabsTrigger value="password">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <ScrollArea className="h-72 w-full rounded-md">
            <div className="flex flex-col gap-4">
              {postSeachResult.length > 0 ? postSeachResult.map((post) => (
                <Card
                  key={post.id}
                  className="p-4 shadow-md border rounded-2xl"
                >
                  <CardContent className="flex flex-col space-y-4">
                    {/* Author Info */}
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={post.author.image || ""}
                          alt={post.author.name || ""}
                        />
                        <AvatarFallback>
                          {post?.author?.name ? post.author.name[0].toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {post.author.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          @{post.author.username}
                        </p>
                        <p className="text-xs text-gray-400">
                          {post.author._count.followers} Followers
                        </p>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-sm text-gray-700">{post.content}</p>
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    )}

                    {/* Timestamp */}
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </p>
                  </CardContent>
                </Card>
              )) : <div className="text-center text-gray-500">No posts found</div>}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="password">
          <ScrollArea className="h-72 w-full rounded-md">
            <div className="flex flex-col gap-4">
                {searchUserResult.length > 0 ? searchUserResult.map(user => (
                    <FollowCard followUser={user} key={user.id}/>
                )) : <div className="text-center text-gray-500">No users found</div>}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SearchContent;
