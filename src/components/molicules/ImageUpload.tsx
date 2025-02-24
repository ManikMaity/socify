/* eslint-disable @next/next/no-img-element */
"use client";

import { ImageUploadProps } from "@/config/interfaces";
import { UploadDropzone } from "@/lib/uploadthing";
import { XIcon } from "lucide-react";



function ImageUpload({
  onChange,
  value,
  endpoint
} : ImageUploadProps) {

  if (value) {
    return (
      <div className="relative size-40">
      <img src={value} alt="Upload" className="rounded-md size-40 object-cover" />
      <button
        onClick={() => onChange("")}
        className="absolute top-0 right-0 p-1 bg-red-500 rounded-full shadow-sm"
        type="button"
      >
        <XIcon className="h-4 w-4 text-white" />
      </button>
    </div>
    )
  }

  return (
    <UploadDropzone endpoint={endpoint} 
    onClientUploadComplete={(url) => onChange(url?.[0].ufsUrl)}
    onUploadError={(error) => console.error(error)}

    />
  )
}

export default ImageUpload
