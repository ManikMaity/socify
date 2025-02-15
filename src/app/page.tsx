import CreatePostCard from "@/components/molicules/CreatePostCard";
import { currentUser } from "@clerk/nextjs/server";


export default async function Home() {

  const user = await currentUser();

  return (
    <div className="grid grid-cols-10">
      <div className="lg:col-span-7 ">
        {user && <CreatePostCard/>}
      </div>
      <div className="lg:col-span-3 hidden lg:block sticky top-20">

      </div>
    </div>
  );
}
