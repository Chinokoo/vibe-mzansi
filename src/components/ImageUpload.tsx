"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@uploadthing/react";
import { XIcon } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadsProps {
  onChange: (url: string) => void;
  value: string;
  endpoint: "postImage";
}

function ImageUpload({ endpoint, onChange, value }: ImageUploadsProps) {
  if (value) {
    return (
      <div className="relative size-40">
        <img src={value} className="rounded-md size-40 object-cover" />
        <button
          onClick={() => onChange("")}
          className="absolute top-0 right-0 bg-red-500 rounded-full shadow-sm"
          type="button"
        >
          <XIcon className="size-4 text-white" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone<OurFileRouter, "postImage">
      endpoint={endpoint}
      onClientUploadComplete={(res: any) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
        toast.error("Failed to upload image");
      }}
    />
  );
}

export default ImageUpload;
