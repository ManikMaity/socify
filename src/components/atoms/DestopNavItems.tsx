import { Button } from "../ui/button"
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
  } from '@clerk/nextjs'
  import { navLinks } from "@/config/clientConfig"
import { ThemeToggle } from "../atoms/ThemeToggle"
import Link from "next/link"

function DestopNavItems({notificationCount} : {notificationCount: number}) {
  return (
    <nav className="hidden md:flex items-center justify-end gap-4 md:gap-6 w-[50%]">
    <ThemeToggle/>
    <SignedIn>
    {navLinks.map((link, index) => (
        <Link key={index} href={link.href}>
            <Button variant="ghost">
                <link.icon/>
                {link.title}
                {link.title === "Notification" && notificationCount > 0 && <span className="text-xs w-4 h-4 grid place-content-center rounded-full bg-blue-500 text-white">{notificationCount}</span>}
            </Button>
        </Link>
    ))}
    </SignedIn>
    <div className="flex justify-center items-center">
        <SignedIn>
            <UserButton />
        </SignedIn>
        <SignedOut>
            <SignInButton mode="modal">
                <Button>Sign In</Button>
            </SignInButton>
        </SignedOut>
    </div>
  </nav>
  )
}

export default DestopNavItems
