const axiosClient = require('../../clients/axios');

const { FACEBOOK_URL } = require('../../setting');

async function upload(config) {
  console.log('facebook publish video', 'video config', config);
  const {
    urls,
    description = '',
    isSchedule,
    scheduleTime,
    platformId,
    accessToken,
    title,
  } = config;
  const { assetUrl, thumbOffset = 0 } = urls[0];
  try {
    const response = await axiosClient.post(
      `${FACEBOOK_URL}/${platformId}/videos`,
      {
        file_url: assetUrl,
        title,
        description,
        published: !isSchedule,
        scheduled_publish_time: scheduleTime,
        thumb_offset: thumbOffset,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    console.log('facebook publish video', 'video response', response.data);

    return response.data;
  } catch (error) {
    console.error('Facebook video upload failed', error);
    throw error;
  }
}

module.exports = upload;
