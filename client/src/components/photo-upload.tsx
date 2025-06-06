"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/constants";
import { Upload, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "lucide-react";
import { getBaseUrl } from "@/lib/get-base-url";

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  householdId: string;
  onPhotoUpdate: (newPhotoUrl: string) => void;
}

export function PhotoUpload({ currentPhotoUrl, householdId, onPhotoUpdate }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const baseUrl = getBaseUrl();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please upload an image file",
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("File too large", {
        description: "Maximum file size is 5MB",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setIsImageLoading(true); // Reset loading state for new image
    };
    reader.readAsDataURL(file);

    // Upload file
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${baseUrl}${API_CONFIG.ENDPOINTS.HOUSEHOLDS}/${householdId}/focal-point-photo`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }

      const data = await response.json();
      onPhotoUpdate(data.data.s3Path);
      toast.success("Photo uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload photo", {
        description: error instanceof Error ? error.message : "Please try again",
      });
      setPreviewUrl(currentPhotoUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setPreviewUrl(null);
    toast.error("Failed to load image", {
      description: "Please try uploading again",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Profile Photo</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => document.getElementById("photo-upload")?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {isUploading ? "Uploading..." : "Upload Photo"}
        </Button>
      </div>

      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
      />

      {previewUrl && (
        <div className="relative w-32 h-32">
          <Avatar className="h-32 w-32">
            {isUploading ? (
              <div className="h-full w-full flex items-center justify-center bg-primary/10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <AvatarImage
                  src={previewUrl}
                  alt="Profile preview"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                <AvatarFallback className="bg-primary/10">
                  {isImageLoading ? (
                    <div className="animate-pulse bg-gray-200 h-full w-full rounded-full" />
                  ) : (
                    <User className="h-8 w-8 text-muted-foreground" />
                  )}
                </AvatarFallback>
              </>
            )}
          </Avatar>
        </div>
      )}
    </div>
  );
} 