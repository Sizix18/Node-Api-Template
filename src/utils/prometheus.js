import { register, collectDefaultMetrics, Counter, Summary } from 'prom-client';

const numOfRequests = new Counter({
  name: 'numOfRequests',
  help: 'Number of requests made',
  labelNames: ['method'],
});

const pathsTaken = new Counter({
  name: 'pathsTaken',
  help: 'Paths taken in the app',
  labelNames: ['path'],
});

const responses = new Summary({
  name: 'responses',
  help: 'Response time in millis',
  labelNames: ['method', 'path', 'status'],
});

function startCollection() {
  collectDefaultMetrics();
}

async function requestCounters(ctx, next) {
  if (ctx.path !== '/metrics') {
    numOfRequests.inc({ method: ctx.method });
    pathsTaken.inc({ path: ctx.path });
  }
  await next();
}

async function responseCounters(ctx, next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  if (ctx.url !== '/metrics') {
    responses.labels(ctx.method, ctx.url, ctx.status).observe(ms);
  }
}

function injectMetricsRoute(Router) {
  Router.get('/metrics', async (ctx, next) => {
    ctx.body = register.metrics();
    await next();
  });
}

export default {
  startCollection,
  requestCounters,
  responseCounters,
  injectMetricsRoute,
};
