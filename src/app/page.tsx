import { getPosts } from "@/actions/post.action";
import { getDBUserId } from "@/actions/user.action";
import CreatePostCard from "@/components/molicules/CreatePostCard";
import PostCard from "@/components/molicules/PostCard";
import WhoToFollowContainer from "@/components/molicules/WhoToFollowContainer";
import { currentUser } from "@clerk/nextjs/server";


export default async function Home() {

  const user = await currentUser();
  const posts = await getPosts();
  const userId = await getDBUserId();

  return (
    <div className="grid grid-cols-10 gap-6">
      <div className="lg:col-span-7 ">
        {user && <CreatePostCard/>}
        {posts.success && posts.posts ? <div className="space-y-6">
          {posts.posts.map((post) => (
            <PostCard postData={post} key={post.id} userId={userId ?? ""} />
          ))}
        </div>
        : <p className="text-center">Something went wrong</p>
        }
      </div>
      <div className="lg:col-span-3 hidden lg:block sticky top-20">
        <WhoToFollowContainer/>
      </div>
    </div>
  );
}
