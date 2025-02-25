"use client";
import { Loader2, SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import SearchContent from "../atoms/SearchContent";
import { getPostsByTextQuery } from "@/actions/post.action";
import { toast } from "react-toastify";
import { SearchPost } from "@/config/interfaces";

function Search() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);


 async function searchPosts(searchQuery : string) {
    setLoading(true);
    try {
        const res = await getPostsByTextQuery(searchQuery);
        if (res.success) setSearchResult(res.posts);
        console.log("Search result", res.posts);
    }
    catch (error) {
        toast.error("Error while searching posts");
      console.log("Error while searching posts", error);
    }
    finally{
        setLoading(false);
    }
  }

  useEffect(() => {
    if (searchQuery.trim() === "") {
        setSearchResult([]);
        return;
    };
    searchPosts(searchQuery);
  }, [searchQuery]);

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsSearchOpen(true)}
        className="w-[20%] flex justify-between items-center"
      >
        <p>Search here...</p>
        <SearchIcon />
      </Button>
      <Dialog open={isSearchOpen} onOpenChange={() => setIsSearchOpen(false)}>
        <DialogContent className="py-3 px-0 gap-0 w-[95%]">
          <DialogTitle className="hidden"></DialogTitle>
          <div className="h-10 py-1 px-3 flex items-center justify-between gap-3">
            <SearchIcon />
            <input
              type="text"
              value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages here"
              className="bg-transparent h-full w-full outline-none"
            />
          </div>
          <hr className="my-2" />
          {loading ? <div className="flex items-center justify-center"><Loader2 className="animate-spin text-center" /></div> : <SearchContent postSeachResult={searchResult}/>}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Search;
