import { navLinks } from "@/config/clientConfig"
import { ThemeToggle } from "../atoms/ThemeToggle"
import Link from "next/link"
import { Button } from "../ui/button"
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
  } from '@clerk/nextjs'

function Navbar() {


    
  return (
    <header className="w-full flex items-center justify-between py-2 border-b px-2 md:px-6">
      <div>
        <Link href="/">
            <h1 className="text-2xl font-bold">Socify</h1>
        </Link>
      </div>
      <nav className="flex items-center justify-between w-[38%]">
        <ThemeToggle/>
        {navLinks.map((link, index) => (
            <Link key={index} href={link.href}>
                <Button variant="ghost">
                    <link.icon/>
                    {link.title}
                </Button>
            </Link>
        ))}
        <div>
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
    </header>
  )
}

export default Navbar
