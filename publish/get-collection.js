const mongoose = require('mongoose');

const { COLLECTION_NAME } = require('./setting');

let collection;

module.exports = function getCollection() {
  if (collection) {
    return collection;
  }

  collection = mongoose.connection.collection(COLLECTION_NAME);

  return collection;
};
