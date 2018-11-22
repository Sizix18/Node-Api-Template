const collectionString = 'Apps';

exports.getApp = async (ctx, next) => {
  const collection = ctx.db.get(collectionString);
  const result = await collection.findOne();
  ctx.response.message = 200;
  ctx.response.body = result;
  await next();
};

exports.getApps = async (ctx, next) => {
  const collection = ctx.db.get(collectionString);
  const result = await collection.find({}, { limit: 10 });
  ctx.response.message = 200;
  ctx.response.body = result;
  await next();
};
