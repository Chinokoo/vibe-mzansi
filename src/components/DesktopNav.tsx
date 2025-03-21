import React from "react";
import { ModeToggle } from "./theme_button";
import { Button } from "./ui/button";
import Link from "next/link";
import { BellIcon, Home, UserIcon } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";

const DesktopNav = async () => {
  const user = await currentUser();

  return (
    <div className="hidden md:flex items-center space-x-4">
      <ModeToggle />
      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <Home className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      {user ? (
        <>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/notifications">
              <BellIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Notifictions</span>
            </Link>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link
              href={`/profile/${
                user.id ?? user?.emailAddresses[0].emailAddress.split("@")[0]
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>
          <UserButton />
        </>
      ) : (
        <SignInButton mode="modal">
          <Button variant="default">Sign In</Button>
        </SignInButton>
      )}
    </div>
  );
};

export default DesktopNav;
