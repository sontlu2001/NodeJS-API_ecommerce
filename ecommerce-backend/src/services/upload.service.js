'use strict'

const cloudinary = require("../configs/cloudinary");

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

module.exports={
  uploadImageFromLocal,
}