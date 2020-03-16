import Koa from 'koa';
const app = new Koa()
import views from 'koa-views';
import json from 'koa-json';
import onerror from 'koa-onerror';
import koaBody from 'koa-body';
import logger from 'koa-logger';

import index from './routes/index';
import users from './routes/users';
import approuter from './routes/app';
import mongoConf from './lib/mongo';
import { errorHandler, responseHandler } from './middleware/response';
mongoConf.connect();
// error handler
onerror(app)
app.use(errorHandler);

app.use(koaBody({
  multipart: true,
  formidable: {
    keepExtensions: true,
    maxFieldsSize: 10 * 1024 * 1024
  }
}));
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}));
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(approuter.routes(), approuter.allowedMethods())
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});
// Response
app.use(responseHandler);
module.exports = app
