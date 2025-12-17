const uploadPhoto = require('./photo');
const axiosClient = require('../../clients/axios');

const { FACEBOOK_URL } = require('../../setting');

async function upload(config) {
  console.log('facebook publish post', 'post config', config);
  try {
    const {
      urls,
      description = '',
      isSchedule = false,
      scheduleTime,
      platformId,
      accessToken,
    } = config;

    let assetIds = [];
    if (urls.length) {
      assetIds = await uploadPhoto(platformId, accessToken, urls);
    }

    const params = {
      message: description,
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

    console.log('facebook publish post', 'post response', response.data);

    return response.data;
  } catch (error) {
    console.error('Facebook publish post failed', error);
    throw error;
  }
}

module.exports = upload;
