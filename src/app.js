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
import Prometheus from './utils/prometheus';

import pkg from './package';
import settings from './settings';

const app = new Koa();

// Add relevent information to the Koa App for easy access
app.pkg = pkg;
app.settings = settings;

const db = new Monk(settings.mongoUri);
const majorVersion = app.pkg.version.split('.')[0];

// Add relevent info, and objects to the context that is accessable in every route
app.context.db = db;

app.use(Prometheus.responseCounters);
app.use(Prometheus.requestCounters);

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

Prometheus.injectMetricsRoute(rootRouter);

// Create router for all service endpoints
const appRouter = new Router({ prefix: `/v${majorVersion}` });

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

Prometheus.startCollection();
app.use(rootRouter.routes());
app.use(appRouter.routes());
app.use(appRouter.allowedMethods());

export default app;
