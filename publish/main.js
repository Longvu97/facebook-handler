const mongoose = require('mongoose');

const getCollection = require('./get-collection');
const { MONGODB_URI } = require('./setting');
const publish = require('./modules/publish');

let connect;

async function main(event) {
  console.log('main', 'event', event);

  let { postId, connectorId } = event;
  postId = new mongoose.Types.ObjectId(postId);
  connectorId = new mongoose.Types.ObjectId(connectorId);

  const collection = getCollection();
  const post = await collection.findOne({ _id: new mongoose.Types.ObjectId(postId) });
  if (!post) {
    console.log('main', 'post not found');
    return;
  }

  const connector = await collection.findOne({ _id: new mongoose.Types.ObjectId(connectorId) });
  if (!connector) {
    console.log('main', 'connector not found');
    return;
  }

  await publish({ collection, post, connector });
}

async function connectToMongo() {
  if (!connect) {
    connect = mongoose.connect(MONGODB_URI);
    await connect;
  }
}

function eventHandler(handler) {
  return async (event) => {
    console.log('handler', 'event', event);

    const messages = event.Records?.map(({ body }) => JSON.parse(body)) ?? [event];

    if (!messages.length) return;

    await connectToMongo();

    try {
      for (const message of messages) {
        await handler(message);
      }
    } finally {
      if (connect) {
        await mongoose.connection.close();
        connect = null;
      }
    }
  };
}

module.exports = {
  eventHandler,
  main,
};
