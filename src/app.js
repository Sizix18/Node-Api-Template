import Koa from 'koa';
import Logger from 'koa-logger';
import Router from 'koa-router';
import Serve from 'koa-static';
import Mount from 'koa-mount';
import Cors from '@koa/cors';
import Favicon from 'koa-favicon';
import Monk from 'monk';
import BodyParser from 'koa-bodyparser';
import Fs from 'fs';

import pkg from './package';
import settings from './settings';

const app = new Koa();

const db = new Monk(settings.mongoUri);

// Add relevent information to the Koa App for easy access
app.pkg = pkg;
app.settings = settings;

const majorVersion = app.pkg.version.split('.')[0];
// Add relevent info, and objects to the context that is accessable in every route
app.context.db = db;

if (settings.logging === true) app.use(Logger());
app.use(BodyParser());
app.use(Cors());
// Add Favicon
app.use(Favicon('favicon.ico'));
// Mount Api-Doc to version route
app.use(Mount(`/v${majorVersion}`, Serve('./doc')));

// Create Router for service infomation at root url
const rootRouter = new Router();
rootRouter.get('/', async (ctx, next) => {
  ctx.body = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
  };
  await next();
});

// Create router for all service endpoints
const appRouter = new Router({ prefix: `/v${majorVersion}` });

// appRouter.use(Mount('/', Static('./doc')));
// appRouter.get('/', Static('./doc'));
// done = await send(ctx, ctx.path, opts)
// ctx.path = "/v0/";
// "ENOENT: no such file or directory, stat 'C:\Users\Jeff Einspahr\Repositories\Node-Api-Template\src\doc\v0\index.html'"
//
console.info('Adding routes from the following files:');
Fs.readdirSync('./routes/').forEach((file) => {
  console.info(file);
  try {
    require(`./routes/${file}`).default(appRouter);
  } catch (err) {
    console.error(`Unable to add routes from ${file}`);
    console.error(err);
  }
});

app.use(rootRouter.routes());
app.use(appRouter.routes());
app.use(appRouter.allowedMethods());

export default app;
