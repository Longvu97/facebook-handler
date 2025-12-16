// const AWSXRay = require('aws-xray-sdk');

// AWSXRay.captureAWS(require('aws-sdk'));
// AWSXRay.captureHTTPsGlobal(require('http'));
// AWSXRay.captureHTTPsGlobal(require('https'));

const { eventHandler, main } = require('./main');

exports.handler = eventHandler(main);
