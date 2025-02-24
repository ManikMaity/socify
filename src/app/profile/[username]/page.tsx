import { getBasicUserDataFromUsername, getProfileFromUsername, getUserLikedPosts, isFollowingUser } from "@/actions/profile.action"
import NotFound from "@/app/not-found";
import ProfilePageClientComponent from "@/components/organism/ProfilePageClientComponent";

export  async function generateMetadata({ params }: { params: { username: string } }) {
  const userData = await getBasicUserDataFromUsername(params.username);

  return {
    title: userData?.name || params.username,
    description : userData?.bio || `Check out ${params.username}'s profile`,
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
