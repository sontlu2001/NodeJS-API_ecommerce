"use strict";

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const {uploadImageFromLocal, uploadImageToS3} = require("../services/upload.service");

class UploadController {
  uploadThumb = async (req, res, next) => {
    const {file} = req;
    console.log('File uploaded:', file);
    
    if (!file) {
      throw new BadRequestError("No file uploaded");
    }

    new SuccessResponse({
      message: "Upload file success",
      metaData: await uploadImageFromLocal(file)
    }).send(res);
  };

  uploadImageToS3 = async (req, res, next) => {
    const {file} = req;
    console.log('File uploaded to S3:', file);
    
    if (!file) {
      throw new BadRequestError("No file uploaded");
    }

    new SuccessResponse({
      message: "Upload file to S3 success",
      metaData: await uploadImageToS3({file})
    }).send(res);
  };
}

module.exports = new UploadController();
