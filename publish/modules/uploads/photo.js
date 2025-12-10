const axiosClient = require('../../clients/axios');
const { resolveContentType, decodeBase64File } = require('../../utils');

const { FACEBOOK_URL } = require('../../setting');

async function upload(platformId, accessToken, photo) {
  const { base64, type } = photo;

  const bodyFormData = new FormData();
  const contentType = resolveContentType(base64, type);
  const buffer = decodeBase64File(base64);
  const extension = contentType.split('/')[1] || 'bin';

  bodyFormData.append(
    'source',
    new Blob([buffer], { type: contentType }),
    `upload.${extension}`,
  );
  bodyFormData.append('access_token', accessToken);
  bodyFormData.append('published', 'false');

  try {
    const response = await axiosClient({
      method: 'post',
      url: `${FACEBOOK_URL}/${platformId}/photos`,
      data: bodyFormData,
      headers: bodyFormData.getHeaders ? bodyFormData.getHeaders() : {},
      maxBodyLength: Infinity,
    });

    return { id: response.data.id, index: photo.index };
  } catch (error) {
    console.error('Facebook photo upload failed', error);
    throw error;
  }
}

module.exports = upload;
