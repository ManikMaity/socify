import { getProfileFromUsername } from "@/actions/profile.action"

async function ProfilePage({ params }: { params: { username: string } }) {

  const data = await getProfileFromUsername(params.username);

  return (
    <div>
     <p>{params.username}</p>
    </div>
  )
}

export default ProfilePage
