const mongoose = require('mongoose');

const getCollection = require('./get-collection');
const { MONGOOSE_URL } = require('./setting');
const publish = require('./modules/publish');

let connect;

async function main(event) {
  console.log('main', 'event', event);

  const { postId, connectorId, notAvailablePlatform } = event;

  const collection = getCollection();
  const post = await collection.findOne({ _id: new mongoose.Types.ObjectId(postId) });
  if (!post) {
    console.log('main', 'post not found');
    return;
  }

  const isExistConnPost = Object.keys(post.connectors).find((key) => key === connectorId);
  if (!isExistConnPost) {
    console.log('main', 'connector does not exist in post');
    return;
  }

  const connector = await collection.findOne({ _id: new mongoose.Types.ObjectId(connectorId) });
  if (!connector) {
    console.log('main', 'connector not found');
    return;
  }

  try {
    await publish({ collection, post, connector, notAvailablePlatform });
  } catch (error) {
    await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(postId) },
      {
        $set: {
          [`connectors.${connectorId}.status`]: 'failed',
          [`connectors.${connectorId}.error`]: error?.message ?? String(error),
        },
      },
    );
  }
}

async function connectToMongo() {
  if (!connect) {
    connect = mongoose.connect(MONGOOSE_URL);
    await connect;
  }
}

function eventHandler(handler) {
  return async (event) => {
    console.log('handler', 'event', event);

    if (event.detail) {
      event = event.detail;
    }

    const messages = event.Records?.map(({ body }) => JSON.parse(body)) ?? [event];

    if (!messages.length) return;

    await connectToMongo();

    for (const message of messages) {
      await handler(message);
    }
  };
}

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing MongoDB connection');
  if (connect) {
    await mongoose.connection.close();
    connect = null;
  }
});

module.exports = {
  eventHandler,
  main,
};
