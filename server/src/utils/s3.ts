import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
} from "@aws-sdk/client-s3";

import sharp from "sharp";
import { ErrorResponse } from "../middleware/error";
import { NextFunction } from "express";
import { Model, Document } from "mongoose";

const reduceImageQuality = async (imageFile: any, next: NextFunction) => {
  // reduce image quality
  let qualityPercentageToKeep;
  let newBinaryData;
  if (imageFile.size >= 3000000) {
    qualityPercentageToKeep = 40;
  } else if (imageFile.size >= 2000000) {
    qualityPercentageToKeep = 45;
  } else if (imageFile.size >= 1000000) {
    qualityPercentageToKeep = 50;
  } else if (imageFile.size >= 1000000) {
    qualityPercentageToKeep = 50;
  } else if (imageFile.size >= 200000 || imageFile.size <= 500000) {
    qualityPercentageToKeep = 75;
  } else {
    qualityPercentageToKeep = null;
  }

  try {
    // Will not reduce image quality if image size too small or image is from type of gif
    if (qualityPercentageToKeep && imageFile.mimetype !== "image/gif") {
      const metadata = await sharp(imageFile.data, { limitInputPixels: 500000000 }).metadata();

      const sharpInstance = sharp(imageFile.data, { limitInputPixels: 500000000 });

      if (metadata.width > 8000 || metadata.height > 8000) {
        sharpInstance.resize(8000, 8000, { fit: "inside" }); // Resize the image to fit within 8000x8000 pixels
      }

      newBinaryData = await sharpInstance
        .rotate() // Adjusts the image based on the Orientation tag, if present.  function reads the Orientation tag, if present, and adjusts the image accordingly. Once rotated, the tag is no longer needed, and the image will display correctly without EXIF data.
        .toFormat(imageFile.mimetype.split("/")[1]) // Use the input image's format
        .jpeg({ quality: qualityPercentageToKeep })
        .toBuffer();

      return newBinaryData;
    }
  } catch (err: any) {
    console.error(err);
    if (err.message === "Input image exceeds pixel limit") {
      return next(
        new ErrorResponse(
          err + ". Try to resize the image or reduce it's quality before upload",
          500
        )
      );
    } else {
      return next(new ErrorResponse(err, 500));
    }
  }
};

export const uploadPhotoToS3 = async <T extends Document>({
  accessKeyId,
  secretAccessKey,
  region,
  s3PhotoUploadPath,
  bucketName,
  file,
  dbRecordInstance,
  imagePath,
  next,
  doReduceImageQuality,
}: {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  s3PhotoUploadPath: string;
  bucketName: string;
  file: any;
  dbRecordInstance: T;
  imagePath: string;
  next: NextFunction;
  doReduceImageQuality: boolean;
}) => {
  const s3Config = {
    accessKeyId,
    secretAccessKey,
    region,
  };

  const s3Client = new S3Client(s3Config);

  const fileKeyNew = `${s3PhotoUploadPath}/${file.name}`;

  const s3PathNew = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKeyNew}`;

  // reduce image quality
  const newBinaryData = doReduceImageQuality ? await reduceImageQuality(file, next) : file.data;

  const bucketParamsNew = {
    Bucket: bucketName,
    Key: fileKeyNew,
    Body: newBinaryData,
  };

  // Delete old photo from S3
  const currentImageUrl = imagePath
    .split(".")
    .reduce((obj, key) => obj?.[key], dbRecordInstance as any);
  const isPhotoInDbSavedOnS3 =
    currentImageUrl?.includes(".amazonaws.com/") && currentImageUrl?.includes(".s3.");

  // Check if photo was saved on same S3 environment as the NODE_ENV before deleting the saved object
  const environmentMatchingMap = {
    production: "prod-census-surveyor-0",
    staging: "staging-census-surveyor-0",
    development: "dev-census-surveyor-0",
  };
  const isBucketAndEC2EnvMatch =
    environmentMatchingMap[process.env.NODE_ENV as keyof typeof environmentMatchingMap] ===
    bucketName;

  if (isPhotoInDbSavedOnS3 && isBucketAndEC2EnvMatch && currentImageUrl === s3PathNew) {
    const pattern = /\.amazonaws\.com\/(.*)/;
    const matches = currentImageUrl.match(pattern);

    const fileKeyOld = matches ? matches[1] : null;

    const bucketParamsOld = {
      Bucket: bucketName,
      Key: fileKeyOld,
    };

    await s3Client.send(new DeleteObjectCommand(bucketParamsOld as DeleteObjectCommandInput));
  }

  // Put a new photo into S3
  const putToS3Res = await s3Client.send(new PutObjectCommand(bucketParamsNew));

  return { data: putToS3Res, s3Path: s3PathNew };
};
