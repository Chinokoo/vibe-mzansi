"use server";
import { getRandomUsers } from "@/actions/user.actions";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import FollowButton from "./FollowButton";

const WhoToFollow = async () => {
  const users = await getRandomUsers();

  if (users.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggested Followers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex gap-1 items-center justify-between"
            >
              <div className="flex items-center gap-1">
                <Link href={`/profile/${user.username}`}>
                  <Avatar className="">
                    <AvatarImage
                      src={user.image ?? "/avatar.png"}
                      className="w-10 h-10 rounded-full overflow-hidden"
                    />
                  </Avatar>
                </Link>
                <div className="text-xs">
                  <Link
                    href={`/profile/${user.username}`}
                    className="font-medium cursor-pointer"
                  >
                    {user.name}
                  </Link>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <div className="flex justify-start gap-3">
                    <p className="text-muted-foreground">
                      {user._count.followers} followers
                    </p>
                    <p className="text-muted-foreground">
                      {user._count.following} following
                    </p>
                  </div>
                </div>
              </div>
              <FollowButton userId={user.id} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WhoToFollow;
