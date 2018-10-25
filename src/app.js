import Koa from 'koa';
import Logger from 'koa-logger';
import Router from 'koa-router';
// const BodyParser = import('koa-bodyparser');
import fs from 'fs';
import pkg from '../package.json';

const app = new Koa();
app.pkg = pkg;

app.use(Logger());

const router = new Router({ prefix: `/v${app.pkg.version.split('.')[0]}`});

fs.readdirSync('./src/routes/').forEach( file => {
  require('./routes/' + file).default(router);
});

console.log(JSON.stringify(router));
// import('./routes')(router);
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
