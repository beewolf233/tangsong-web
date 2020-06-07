// const app = getApp()
// import wepy from '@wepy/core'
const request = (url, options) => {
  return new Promise((resolve, reject) => {
    let token = {}
    let header = Object.assign({}, {
      'Content-Type': 'application/json; charset=UTF-8'
    }, token, options.header || {})
    wx.request({
      url: url, // 域名接口地址
      method: options.method, // 配置method方法
      data: options.data,
      header: header, // header中可以添加token值等
      timeout: 20000,
      success(request) { // 监听成功后的操作
        if (request.statusCode === 200) {
          // 登陆失效
          if (request.data.recode === 301) {
            // 清除token缓存
            return
          }
          resolve(request.data)
        } else {
          reject(request.data)
        }
      },
      fail(error) {  // 返回失败也同样传入reject()方法
        wx.hideLoading()
        console.log(error)
        reject(error.data)
      }
    })
  })
}

// 封装get方法
const get = (url, options = {}) => {
  return request(url, {
    method: 'GET',
    data: options
  })
}

// 封装post方法
const post = (url, options = {}) => {
  return request(url, {
    method: 'POST',
    data: options
  })
}
// const post = (url, options = {}) => {
//   return request(url, {
//     method: 'POST',
//     data: options,
//     header: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     }
//   })
// }

// 封装put方法
const put = (url, options) => {
  return request(url, {
    method: 'PUT',
    data: options
  })
}
// 封装remove方法，DELETE关键字不能声明
const remove = (url, options = {}) => {
  return request(url, {
    method: 'DELETE',
    data: options
  })
}

module.exports = {
  get,
  post,
  put,
  remove
}
