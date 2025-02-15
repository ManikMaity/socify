import { getThreeRandomUsers } from "@/actions/user.action"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import FollowCard from "../atoms/FollowCard";

async function WhoToFollowContainer() {

    const follow = await getThreeRandomUsers();
    if (!follow.success || !follow.users) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who to follow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
        {follow?.users?.map((user) => (
            <FollowCard followUser={user} key={user.id}/>
        ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default WhoToFollowContainer
