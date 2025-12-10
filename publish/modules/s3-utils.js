const { buffer } = require('node:stream/consumers');
const { GetObjectCommand } = require('@aws-sdk/client-s3/');

const s3 = require('../clients/s3');
const { BUCKET_NAME } = require('../setting');

async function getFileToBase64(filename) {
  const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: filename });
  const response = await s3.send(command);
  if (!response.Body) {
    throw new Error('No response body received from S3');
  }

  const responseBuffer = await buffer(response.Body);

  return responseBuffer.toString('base64');
}

module.exports = {
  getFileToBase64,
};
