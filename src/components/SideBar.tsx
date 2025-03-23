import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import UnAuthenticatedSidebar from "./UnAuthenticatedSidebar";
import { getUserByClerkId } from "@/actions/user.actions";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "./ui/separator";
import { MapPinIcon } from "lucide-react";

const SideBar = async () => {
  const authUser = await currentUser();

  if (!authUser) return <UnAuthenticatedSidebar />;

  const user = await getUserByClerkId(authUser.id);
  if (!user) return null;

  return (
    <div className="sticky top-20 mt-5">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Link
              href={`/profile/${user.username}`}
              className="flex flex-col items-center justify-center"
            >
              <Avatar className="w-20 h-20 border-2 rounded-full overflow-hidden">
                <AvatarImage src={user.image ?? "/avatar.png"} />
              </Avatar>

              <div className="mt-4 space-y-1">
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.username}</p>
              </div>
            </Link>
            {user.bio && (
              <p className="mt-3 text-sm text-muted-foreground">{user.bio} </p>
            )}
          </div>
          <div className="w-full">
            <Separator className="my-4" />
            <div className="flex justify-between">
              <div>
                <p className="font-medium text-center">
                  {" "}
                  {user._count.following}
                </p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
              <Separator orientation="vertical" />
              <div>
                <p className="font-medium text-center">
                  {user._count.followers}
                </p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
            </div>
            <Separator className="my-4" />
          </div>

          <div className="w-full space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <MapPinIcon className="w-4 h-4 mr-2" />
              {user.location ?? "No location"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SideBar;
