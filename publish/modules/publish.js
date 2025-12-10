const sortBy = require('lodash.sortby');

const { getFileToBase64 } = require('./s3-utils');
const uploadPhoto = require('./uploads/photo');
const axiosClient = require('../clients/axios');

const { SUPPORT_IMAGES, FACEBOOK_URL } = require('../setting');

async function publish({ collection, post, connector }) {
  const {
    _id: postId,
    files,
    userId,
    uploadId,
    description,
    customDescriptions,
    isSchedule,
    scheduleTime,
  } = post;
  const { _id: connectorId, platformId, accessToken, subtype } = connector;
  const filesWithBase64 = await Promise.all(
    files.map(async (file, index) => {
      const { name } = file;
      const filePath = `${userId}/${uploadId}/${name}`;
      const base64 = await getFileToBase64(filePath);

      return { ...file, base64, index };
    }),
  );

  const photos = filesWithBase64.filter(({ type }) => SUPPORT_IMAGES.includes(type));

  const assets = await Promise.all(
    photos
      .map((file) => uploadPhoto(platformId, accessToken, file)),
  );

  const assetIds = sortBy(assets, ['index']).map(({ id }) => ({ media_fbid: id }));

  const message = customDescriptions && Object.keys(customDescriptions).length
    ? customDescriptions[connectorId.toString()] || customDescriptions[subtype]
    : description;

  const params = {
    message,
    published: !isSchedule,
    scheduled_publish_time: scheduleTime,
    access_token: accessToken,
    attached_media: assetIds,
  };

  const response = await axiosClient({
    method: 'post',
    url: `${FACEBOOK_URL}/${platformId}/feed`,
    params,
  });

  console.log('facebook publish', 'post response', response.data);

  const { data } = response;

  const platformPostId = data.id;

  await collection.updateOne(
    { _id: postId },
    {
      $set: {
        [`connectors.${connectorId}.status`]: 'DONE',
        [`connectors.${connectorId}.platformPostId`]: platformPostId,
      },
    },
  );
}

module.exports = publish;
