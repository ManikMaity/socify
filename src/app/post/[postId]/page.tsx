import { getPostById } from "@/actions/post.action";
import { getDBUserId } from "@/actions/user.action";
import PostCard from "@/components/molicules/PostCard";

async function PostPage({ params } : { params: Promise<{ postId: string }> }) {

  const id = (await params).postId;

  const post = await getPostById(id);
  const userId = await getDBUserId();

  if (!post.success) {
    return <p>Post not found</p>;
  }


  return (
    <div>
     {post.success && post.post && <PostCard postData={post.post} userId={userId ?? ""} />}
    </div>
  )
}

export default PostPage;
