import Link from "next/link";
import DestopNavItems from "../atoms/DestopNavItems";
import MobileNavItems from "../atoms/MobileNavItems";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";
import { getUnreadNotificationsCount } from "@/actions/notification";
import Search from "./Search";

async function Navbar() {

  const user = await currentUser();
  if (user) await syncUser()
  const notificationCount = await getUnreadNotificationsCount();

  return (
    <header className="w-full sticky top-0 bg-background/95 backdrop-blur z-50 flex items-center justify-between py-2 border-b px-2 md:px-6">
      <div>
        <Link href="/">
          <h1 className="text-2xl font-bold">Soci<span className="text-blue-500">fy</span></h1>
        </Link>
      </div>
      <Search/>
      <DestopNavItems username = {notificationCount.data?.username || ""} notificationCount={notificationCount.data?.count || 0} />
      <MobileNavItems />
    </header>
  );
}

export default Navbar;
