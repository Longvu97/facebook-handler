const axiosClient = require('../../clients/axios');

const { FACEBOOK_URL } = require('../../setting');

/**
 *
 * @param {string} platformId
 * @param {string} accessToken
 * @param {Array} configs
 * @param {string} config.assetUrl
 * @param {number} config.index
 * @returns
 */
async function upload(platformId, accessToken, configs) {
  console.log('Publish photos', 'configs', JSON.stringify(configs));

  const requests = configs.map(({ assetUrl }) => ({
    method: 'post',
    relative_url: `${platformId}/photos`,
    body: `url=${encodeURIComponent(assetUrl)}&published=false`,
  }));

  try {
    const response = await axiosClient.post(
      `${FACEBOOK_URL}/${platformId}`,
      {
        batch: requests,
        access_token: accessToken,
      },
    );

    console.log('Publish photos', 'photos response', response.data);

    return response.data
      .filter(({ code }) => code === 200)
      .map(({ body }) => ({ media_fbid: JSON.parse(body).id }));
  } catch (error) {
    console.error('Facebook photos upload failed', error);
    throw error;
  }
}

module.exports = upload;
