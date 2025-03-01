import { getReels } from "@/actions/reel.action";
import { getDBUserId } from "@/actions/user.action";
import { ReelScroll } from "@/components/organism/ReelScroll";

async function Reels() {

  const reels = await getReels();
  const userId = await getDBUserId();

  return (
    <main className="flex justify-center items-center h-[calc(100vh-4rem)] absolute top-13 left-0 right-0 bottom-0">
      {reels.success && <ReelScroll reels={reels.reels} userId={userId ?? ""}/>}
    </main>
  )
}

export default Reels;
