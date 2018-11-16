const collectionString = 'Apps';

export default {
  getApp: async (ctx) => {
    const collection = ctx.db.get(collectionString);
    const result = await collection.findOne();
    ctx.response.message = 200;
    ctx.response.body = result;
  },
};
