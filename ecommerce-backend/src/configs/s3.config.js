'use strict';
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteBucketCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

module.exports = {
  s3,
  PutObjectCommand,
  GetObjectCommand,
  DeleteBucketCommand
}