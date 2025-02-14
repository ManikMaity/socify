import Link from "next/link";
import DestopNavItems from "../atoms/DestopNavItems";
import MobileNavItems from "../atoms/MobileNavItems";

function Navbar() {
  return (
    <header className="w-full sticky top-0 bg-background/95 backdrop-blur z-50 flex items-center justify-between py-2 border-b px-2 md:px-6">
      <div>
        <Link href="/">
          <h1 className="text-2xl font-bold">Socify</h1>
        </Link>
      </div>
      <DestopNavItems />
      <MobileNavItems />
    </header>
  );
}

export default Navbar;
