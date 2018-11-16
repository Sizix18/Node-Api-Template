import Koa from 'koa';
import Logger from 'koa-logger';
import Router from 'koa-router';
import Monk from 'monk';
import BodyParser from 'koa-bodyparser';
import fs from 'fs';
import pkg from '../package.json';
import settings from '../settings';

const app = new Koa();
const db = new Monk(settings.mongoUri);
app.pkg = pkg;
app.settings = settings;
app.context.db = db;
app.use(Logger());
app.use(BodyParser());

const rootRouter = new Router();

rootRouter.get('/', async (ctx) => {
  ctx.body = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
  };
});

const appRouter = new Router({ prefix: `/v${app.pkg.version.split('.')[0]}` });

console.info('Adding the following files from routes:');
fs.readdirSync('./src/routes/').forEach((file) => {
  console.info(file);
  require(`./routes/${file}`).default(appRouter);
});

app.use(rootRouter.routes());
app.use(appRouter.routes());
app.use(appRouter.allowedMethods());

export default app;
