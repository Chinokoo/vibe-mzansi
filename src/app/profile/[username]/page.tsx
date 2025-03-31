import {
  getProfileBUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from "@/actions/profile.actions";
import ProfilePageClient from "@/components/ProfilePageClient";
import { notFound } from "next/navigation";
import React from "react";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const user = await getProfileBUsername(params.username);
  if (!user) return;

  return {
    title: `${user.name ?? user.username}`,
  };
}

const ProfilePage = async ({ params }: { params: { username: string } }) => {
  const user = await getProfileBUsername(params.username);

  if (!user) return notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
};

export default ProfilePage;
