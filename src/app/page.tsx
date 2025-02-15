import CreatePostCard from "@/components/molicules/CreatePostCard";
import WhoToFollowContainer from "@/components/molicules/WhoToFollowContainer";
import { currentUser } from "@clerk/nextjs/server";


export default async function Home() {

  const user = await currentUser();

  return (
    <div className="grid grid-cols-10 gap-6">
      <div className="lg:col-span-7 ">
        {user && <CreatePostCard/>}
      </div>
      <div className="lg:col-span-3 hidden lg:block sticky top-20">
        <WhoToFollowContainer/>
      </div>
    </div>
  );
}
