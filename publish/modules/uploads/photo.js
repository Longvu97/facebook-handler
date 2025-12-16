const axiosClient = require('../../clients/axios');

const { FACEBOOK_URL } = require('../../setting');

/**
 *
 * @param {string} platformId
 * @param {string} accessToken
 * @param {object} config
 * @param {string} config.assetUrl
 * @param {number} config.index
 * @returns
 */
async function upload(platformId, accessToken, config) {
  console.log('Publish photo', 'config', config);
  const { assetUrl, index } = config;

  try {
    const response = await axiosClient.post(
      `${FACEBOOK_URL}/${platformId}/photos`,
      {
        url: assetUrl,
        published: false,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    console.log('Publish photo', 'photo response', response.data);

    return { id: response.data.id, index };
  } catch (error) {
    console.error('Facebook photo upload failed', error);
    throw error;
  }
}

module.exports = upload;
