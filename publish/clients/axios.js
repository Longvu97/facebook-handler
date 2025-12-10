const axios = require('axios');
const axiosRetry = require('axios-retry').default;

const axiosClient = axios.create();

axiosRetry(axiosClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

module.exports = axiosClient;
