const { MONGODB_URI, COLLECTION_NAME, ENV } = process.env;

const SUPPORT_IMAGES = [
  'image/png',
  'image/jpeg',
];

// const SUPPORT_VIDEOS = [
//   'video/mov',
//   'video/mpeg',
//   'video/mp4',
//   'video/mpg',
//   'video/avi',
//   'video/wmv',
//   'video/mpegps',
//   'video/flv',
// ];

const BASE_URL = 'https://graph.facebook.com';
const FACEBOOK_API_VERSION = 'v24.0';

const FACEBOOK_URL = `${BASE_URL}/${FACEBOOK_API_VERSION}`;

const BUCKET_NAME = `social-doors-post-${ENV}`;

module.exports = {
  MONGODB_URI,
  COLLECTION_NAME,
  BUCKET_NAME,
  FACEBOOK_URL,
  SUPPORT_IMAGES,
};
