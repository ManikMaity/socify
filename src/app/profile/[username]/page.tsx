import { getBasicUserDataFromUsername, getProfileFromUsername, getUserLikedPosts, isFollowingUser } from "@/actions/profile.action"
import NotFound from "@/app/not-found";
import ProfilePageClientComponent from "@/components/organism/ProfilePageClientComponent";

export  async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {

  const param = await params;

  const userData = await getBasicUserDataFromUsername(param.username);

  return {
    title: userData?.name || param.username,
    description : userData?.bio || `Check out ${param.username}'s profile`,
  }
}

async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {

  const data = await getProfileFromUsername((await params).username);
  if (!data) return NotFound();

  const [likedPost, isCurrentlyFollowing] = await Promise.all([getUserLikedPosts(data.id), isFollowingUser(data.id)]);

  return (
    <ProfilePageClientComponent data={data} isCurrentlyFollowing={isCurrentlyFollowing} likedPost={likedPost} />
  )
}

export default ProfilePage
