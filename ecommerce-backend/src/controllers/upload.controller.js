"use strict";

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const {uploadImageFromLocal} = require("../services/upload.service");

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
}

module.exports = new UploadController();
