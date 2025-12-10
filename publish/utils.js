function resolveContentType(base64, providedType) {
  const match = base64.match(/^data:(.+);base64,/);
  return providedType || match?.[1] || 'application/octet-stream';
}

function decodeBase64File(base64) {
  const [, dataPart] = base64.split(',');
  return Buffer.from(dataPart ?? base64, 'base64');
}

module.exports = {
  resolveContentType,
  decodeBase64File,
};
