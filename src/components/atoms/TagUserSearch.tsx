import { getUserBySearchQuery } from "@/actions/post.action";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SearchUser } from "@/config/interfaces";
import useDebounce from "@/hooks/useDebounce";
import { SearchIcon } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

function TagUserSearch({
  open,
  onOpenChange,
  taggedUsers,
  setTaggedUsers,
}: {
  open: boolean;
  onOpenChange: () => void;
  taggedUsers: SearchUser[];
  setTaggedUsers :  Dispatch<SetStateAction<SearchUser[]>>
}) {
  const [searchUserResult, setSearchUserResult] = useState<SearchUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const debounceSearchQuery = useDebounce(searchQuery, 1000);

  function handleTagUser(user: SearchUser) {
    if (taggedUsers.find(u => u.id === user.id)){
      toast.info("User already tagged");
      return;
    }
    setTaggedUsers([...taggedUsers, user]);
    onOpenChange();
  }


  async function searchUser(searchQuery: string) {
    setLoading(true);
    try {
      const users = await getUserBySearchQuery(searchQuery);
      if (users.success) {
        setSearchUserResult(users.users);
      }
      console.log("Search result", users.users);
    } catch (error) {
      toast.error("Error while searching posts");
      console.log("Error while searching posts", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (debounceSearchQuery.trim() === "") {
      setSearchUserResult([]);
      return;
    }
    searchUser(debounceSearchQuery);
  }, [debounceSearchQuery]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="py-3 px-2  gap-0 w-[95%]">
        <DialogTitle className="hidden"></DialogTitle>
        <div className="h-10 py-1 px-3 flex items-center justify-between gap-3">
          <SearchIcon />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users here"
            className="bg-transparent h-full w-full outline-none"
          />
        </div>
        <hr className="my-2" />
        <ScrollArea className="h-72 w-full rounded-md">
          <div className="flex flex-col gap-4">
            {loading && <p>Loading...</p>}
            {!loading && searchUserResult.length === 0 && <p>No user found</p>}
            {!loading &&
              searchUserResult.length > 0 &&
              searchUserResult.map((user) => (
                <Card
                  key={user.id}
                  className="p-1 md:p-3 shadow-md border rounded-xl w-full"
                >
                  <CardContent className="flex items-center p-2 md:p-4 gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={user.image || ""}
                        alt={user.name || ""}
                      />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold truncate">
                        {user.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        @{user.username}
                      </p>
                      <p className="text-xs text-gray-400">
                        {user._count.followers} Followers |{" "}
                        {user._count.following} Following
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => handleTagUser(user)}>Tag</Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default TagUserSearch;
