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

function DestopNavItems() {
  return (
    <nav className="hidden md:flex items-center justify-end gap-4 md:gap-6 w-[50%]">
    <ThemeToggle/>
    {navLinks.map((link, index) => (
        <Link key={index} href={link.href}>
            <Button variant="ghost">
                <link.icon/>
                {link.title}
            </Button>
        </Link>
    ))}
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
