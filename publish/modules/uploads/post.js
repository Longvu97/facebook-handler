const sortBy = require('lodash.sortby');

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
      const assets = await Promise.all(
        urls
          .map((item) => uploadPhoto(platformId, accessToken, item)),
      );

      assetIds = sortBy(assets, ['index']).map(({ id }) => ({ media_fbid: id }));
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

// upload({
//   post: {
//     files: [{
//       name: 'background.jpeg',
//     }, {
//       name: 'Share Selection - square.jpg',
//     }],
//     userId: '693bc8292fc8f26fdc3b9587',
//     uploadId: '759e8f44-0e4c-4a6d-a75a-1d7d35fd9b13',
//     description: 'This is a test upload',
//   },
//   connector: {
//     platformId: '842384928966975',
//     accessToken: 'EAALwCEqw38sBQM1NiEGBJc7wgHkzBJTWDFWlZB7oNpQ9uLXH8k80l7BIQ18mkJLT2eb8BqHvTEZADSR3C1Vy3S7nJeixCAY0ndvjkqFdvQ93QtaYi3IhSpS83KEX1xAdaJnh1sWx0rng7NQZCYgeyfKcUhbNm1eVz8YrELHPzUAEoZAb1ZBRaQiEuV9mZA08KAbQeT',
//   },
// });

module.exports = upload;
