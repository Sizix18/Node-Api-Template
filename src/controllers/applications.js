export default {
  get_app: async (ctx) => {
    ctx.response.status = 200;
    ctx.response.message = 'We Did It!';
  },
};
