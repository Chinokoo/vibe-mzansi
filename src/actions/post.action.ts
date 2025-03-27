"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.actions";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, imageUrl: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    const post = await prisma.post.create({
      data: {
        content,
        image: imageUrl,
        authorId: userId,
      },
    });

    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.error("Failed to create post:", error);
    return { success: false, error: "Failed to create post !" };
  }
}

//get all the posts
export const getPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.log("Error in getPosts:", error);
    throw new Error("Failed to fetch posts!");
  }
};

//toggle like

export const toggleLike = async (postId: string) => {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    //check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    //find the post
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not Found");

    if (existingLike) {
      //unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      //like and create notification
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.authorId, //owner of the post
                  creatorId: userId, //person who liked the post
                  postId,
                },
              }),
            ]
          : []),
      ]);

      revalidatePath("/");
      return { success: true };
    }
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return {
      success: false,
      error: "Like switch glitch! 🔄 Can't toggle the vibes, fam. 🚫✨",
    };
  }
};

//create a comment function
export const createComment = async (postId: string, content: string) => {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    if (!content)
      throw new Error("Don't leave 'em hanging, fam—drop that content! 🚨✨");

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found!");

    //creating a post and notification
    const [comment] = await prisma.$transaction(async (tx) => {
      //create comment first
      const newComment = await tx.comment.create({
        data: {
          content,
          authorId: userId,
          postId,
        },
      });

      //create notification
      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: "COMMENT",
            userId: post.authorId,
            creatorId: userId,
            postId,
            commentId: newComment.id,
          },
        });
      }
      return [newComment];
    });
    revalidatePath(`/posts/${postId}`);
    return { success: true, comment };
  } catch (error) {
    console.error("Error in the Create Comment Function:", error);
    return {
      success: false,
      error: "Comment flop alert! 🚨 Retry the vibes, fam!",
    };
  }
};

//delete post function
export const deletePost = async (postId: string) => {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) throw new Error("Post not found!");
    if (post.authorId !== userId)
      throw new Error(
        "Hands off, fam—you can't undo someone else's vibes! 🚫✨"
      );

    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return {
      success: false,
      error: "Post delete flop! 🚫 Can't undo those vibes, fam.",
    };
  }
};
