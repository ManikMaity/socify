import { UserWithCount } from "@/config/interfaces";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { LinkIcon, MapPinIcon } from "lucide-react";

function UserSidebarCard({ userData }: { userData: UserWithCount }) {
  return (
    <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${userData.username}`}
              className="flex flex-col items-center justify-center"
            >
              <Avatar className="w-20 h-20 border-2 ">
                <AvatarImage src={userData.image || "/avatar.png"} />
                <AvatarFallback>{userData.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="mt-4 space-y-1">
                <h3 className="font-semibold">{userData.name}</h3>
                <p className="text-sm text-muted-foreground">{userData.username}</p>
              </div>
            </Link>

            {userData.bio && <p className="mt-3 text-sm text-muted-foreground">{userData.bio}</p>}

            <div className="w-full">
              <Separator className="my-4" />
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{userData._count.followers}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <p className="font-medium">{userData._count.following}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>
              <Separator className="my-4" />
            </div>

            <div className="w-full space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPinIcon className="w-4 h-4 mr-2" />
                {userData.location || "No location"}
              </div>
              <div className="flex items-center text-muted-foreground">
                <LinkIcon className="w-4 h-4 mr-2 shrink-0" />
                {userData.website ? (
                  <a href={`${userData.website}`} className="hover:underline truncate" target="_blank">
                    {userData.website}
                  </a>
                ) : (
                  "No website"
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}

export default UserSidebarCard;
