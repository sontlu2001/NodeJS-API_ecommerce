'use strict'

const cloudinary = require("../configs/cloudinary");
const { s3, PutObjectCommand, GetObjectCommand } = require("../configs/s3.config");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");

const uploadImageFromLocal = async ({
  path,
  folderName = 'products',
}) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      folder: folderName,
      public_id: 'thumb',
    });
    return {
      image_url: result.secure_url,
      thumb_url: await cloudinary.url(result.public_id, {
        height: 150,
        width: 150,
        format: 'jpg',
      })
    }
  } catch (error) {
    console.error("Error uploading image from local:", error);
    throw error;
  }
}

const uploadImageToS3 = async ({
  file
}) => {

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);
    // export public url
    const singedUrl = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: file.originalname,
    })
  
    const url = await getSignedUrl(s3, singedUrl, { expiresIn: 3600 });
    return url;

  } catch (error) { 
    console.log("Error uploading image to S3:", error);
  }

}

module.exports = {
  uploadImageFromLocal,
  uploadImageToS3
}