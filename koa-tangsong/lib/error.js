class CommonError extends Error {
    constructor (message = '未知错误', code = -1) {
      super(message)
      this.code = code
    }
  }
  
  module.exports = {
    CommonError,
    /**
     * 拒绝访问构造函数
     */
    ForbiddenError: class ForbiddenError extends CommonError {
      constructor(message = '拒绝访问') {
        super(message, 403)
      }
    },
    /**
     * 无效的参数构造函数
     */
    InvalidQueryError: class InvalidQueryError extends CommonError {
      constructor(message = '无效的参数') {
        super(message, 400)
      }
    },
  /**
   * 资源未找到构造函数
   */
    NotFoundError: class NotFoundError extends CommonError {
      constructor(message = '资源未找到') {
        super(message, 404)
      }
    }
  }
  