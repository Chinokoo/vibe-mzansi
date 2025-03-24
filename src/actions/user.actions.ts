"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// connect user from clerk to neon database
export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return;

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""} `,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });

    return dbUser;
  } catch (error) {
    console.log("Error in syncUser", error);
  }
}

// getting user from the database by clerk id
export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}

//getting getting userid from  database :: this function will be used alot.
export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthenticated");

  const user = await getUserByClerkId(clerkId);

  if (!user) throw new Error("User not found");

  return user.id;
}

// get random users from the database
export async function getRandomUsers() {
  try {
    const userId = await getDbUserId();

    //get 3 random users from the database excluding ourselves and users we already follow
    const randomUsers = await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: userId } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: userId,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
      take: 3,
    });

    return randomUsers;
  } catch (error) {
    console.log("Error in the random users", error);
    return [];
  }
}

//function that executes the follow and the unfollow feature function.
export const toggleFollow = async (targetUserId: string) => {
  try {
    const userId = await getDbUserId();

    if (userId === targetUserId)
      throw new Error(
        "You can't hype yourself up, fam—go vibe with the squad! 💃✨"
      );

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      //unfollow
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      });
    } else {
      //follow
      await prisma.$transaction([
        prisma.follow.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          },
        }),

        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId, //user being followed
            creatorId: userId, //user following
          },
        }),
      ]);
    }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error in toggleFollow", error);

    return { success: false, error: "Error toggling follow" };
  }
};
