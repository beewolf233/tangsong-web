// const { logger } = require('./logger')

// 这个middleware用于将ctx.result中的内容最终回传给客户端
// 回传遵循这样的格式：{ code: 0, msg: string, data: any }
const responseHandler = (ctx) => {
  if (ctx.result !== undefined || ctx.code==200) { //处理成功
    ctx.type = 'json'
    ctx.body = {
      recode: ctx.code || 200,
      msg: ctx.msg || 'success',
      data: ctx.result || null
    }
  } else if (ctx.error !== undefined) { //处理失败
    ctx.type = 'json'
    ctx.body = {
      recode: ctx.code || -1,
      msg: ctx.error,
      data: null
    }
  }
}

// 这个middleware处理在其它middleware中出现的异常
// 并将异常消息回传给客户端：{ code: '错误代码', msg: '错误信息' }
const errorHandler = (ctx, next) => {
  return next().catch(err => {
    if (err.name === 'UnauthorizedError') { // 身份验证失败返回 401
      ctx.status = 401
      ctx.body = err.originalError || 'Authentication Error'
    } else {
      if (err.code == null) {
        // logger.error(err.stack)
      }
      ctx.status = 200 // 保证返回状态是 200, 这样前端不会抛出异常
      ctx.body = {
        recode: err.code || -1,
        data: null,
        msg: err.message.trim()
      }
    }
    return Promise.resolve()
  })
}

module.exports = {
  responseHandler,
  errorHandler
}
