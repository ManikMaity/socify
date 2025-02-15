import { getUserDataByClerkId } from "@/actions/user.action";
import UnauthUserCard from "./UnauthUserCard";
import { currentUser } from "@clerk/nextjs/server";
import UserSidebarCard from "./UserSidebarCard";

async function Sidebar() {
  const user = await currentUser();
  if (!user) return <UnauthUserCard/>;
  const userData = await getUserDataByClerkId(user.id);
  if (!userData) return <UnauthUserCard/>;

  console.log(userData);

  return (
    <UserSidebarCard userData={userData}/> 
  )
}

export default Sidebar
