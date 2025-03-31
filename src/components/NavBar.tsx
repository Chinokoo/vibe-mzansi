import Link from "next/link";
import React from "react";
import DesktopNav from "./DesktopNav";
import Image from "next/image";
import MobileNav from "./MobileNav";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.actions";

const NavBar = async () => {
  const user = await currentUser();
  if (!user) return;

  const userId = user.id;
  const username = user.emailAddresses[0].emailAddress.split("@")[0];
  // user.emailAddresses[0].emailAddress.split("@")[0]
  //console.log();

  if (user) await syncUser();

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blu supports-[backdrop-filter]:bg-background/60 z-50">
      {/* container inside the nav*/}
      <div className="max-w-7xl mx-auto px-4">
        {/* two containers */}
        <div className="flex items-center justify-between h-16">
          {/* first container for image */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <Link href={"/"}>
              <Image
                src="/assets/sa-rounded.png"
                fill
                alt="south african flag"
                className="object-contain"
              />
            </Link>
          </div>
          {/* second container for navigation either desktop or mobile */}
          <DesktopNav />
          <MobileNav username={username} userId={userId} />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
