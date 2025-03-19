import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Button } from "../ui/button"
import { AlignJustify, LogOutIcon } from "lucide-react"
import { navLinks } from "@/config/clientConfig"
import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from "@clerk/nextjs"

function MobileNavItems({username} : {username : string}) {
  return (
    <Sheet>
    <SheetTrigger asChild className="block md:hidden">
      <Button variant="outline">
        <AlignJustify/>
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Menu</SheetTitle>
        <SheetDescription></SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 py-4">
      <SignedIn>
      {navLinks.map((link, index) => (
        <Link key={index} href={link.title == "Profile" ? link.href+=`/${username}` : link.href}>
            <Button variant="ghost" className="w-full justify-start">
                <link.icon/>
                {link.title}
            </Button>
        </Link>
    ))}
    <SignOutButton>
        <Button variant="destructive" >
            <LogOutIcon/>
            Logout
        </Button>
    </SignOutButton>
    </SignedIn>
    <div className="px-3 w-full flex justify-between">
        <ThemeToggle/>
        <div className="">
        <SignedIn>
            <UserButton />
        </SignedIn>
        <SignedOut>
            <SignInButton>
                <Button>Sign In</Button>
            </SignInButton>
        </SignedOut>
    </div>
    </div>
    </div>
    </SheetContent>
  </Sheet>
  )
}

export default MobileNavItems
