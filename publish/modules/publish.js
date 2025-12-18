const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const mongoose = require('mongoose');

const { BUCKET_NAME } = require('../setting');
const uploadVideo = require('./uploads/video');
const uploadPost = require('./uploads/post');
const s3 = require('../clients/s3');

const UPLOAD_MATCHING = {
  video: uploadVideo,
  post: uploadPost,
};

async function publish({ collection, post, connector, notAvailablePlatform }) {
  const {
    _id: postId,
    files,
    title,
    description,
    customDescriptions,
    subtype: subtypePost,
    userId,
    uploadId,
  } = post;
  let { isSchedule, scheduleTime } = post;
  const { _id: connectorId, subtype: subtypeConnector, platformId, accessToken } = connector;

  let assetUrls = [];
  if (files.length) {
    assetUrls = await Promise.all(
      files.map(async (file, index) => {
        const { name, thumbOffset = 0 } = file;
        const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: `${userId}/${uploadId}/${name}` });
        const url = await getSignedUrl(s3, command, { expiresIn: 300 });

        return { assetUrl: url, index, thumbOffset };
      }),
    );
  }

  const message = customDescriptions && Object.keys(customDescriptions).length
    ? customDescriptions[connectorId.toString()] || customDescriptions[subtypeConnector]
    : description;

  if (notAvailablePlatform) {
    isSchedule = !isSchedule;
    scheduleTime = undefined;
  }

  const response = await UPLOAD_MATCHING[subtypePost]({
    urls: assetUrls,
    description: message,
    isSchedule,
    scheduleTime,
    platformId,
    accessToken,
    title,
  });

  const { id: platformPostId } = response;

  await collection.updateOne(
    { _id: new mongoose.Types.ObjectId(postId) },
    {
      $set: {
        [`connectors.${connectorId}.status`]: 'done',
        [`connectors.${connectorId}.platformPostId`]: platformPostId,
      },
    },
  );
}

module.exports = publish;
