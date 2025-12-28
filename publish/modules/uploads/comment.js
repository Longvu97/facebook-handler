const axiosClient = require('../../clients/axios');
const { FACEBOOK_URL } = require('../../setting');

async function comment(platformId, accessToken, postId, comments) {
  console.log('Publish comments', 'comments', JSON.stringify(comments));

  const requests = comments.map(({ content }) => ({
    method: 'post',
    relative_url: `${postId}/comments`,
    body: `message=${content}`,
  }));

  try {
    const response = await axiosClient.post(
      `${FACEBOOK_URL}/${platformId}`,
      {
        batch: requests,
        access_token: accessToken,
      },
    );

    console.log('Publish comments', 'comments response', response.data);
  } catch (error) {
    console.error('Facebook comments upload failed', error);
    throw error;
  }
}

module.exports = comment;
