import { auth } from "@clerk/nextjs/server";
import { createUploadthing, FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  //define routes for different upload types
  postImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      //this code runs on the server before upload
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");

      // whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      //this code runs on the server after upload
      try {
        return { fileUrl: file.ufsUrl };
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
