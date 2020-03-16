// import { LinValidator, Rule } from '../cors/linValidator';
// 引入验证方法
import AsyncValidator from 'async-validator';
/**
 * 更新用户信息
 */
const userRule = {
  username: [
    {type: "string", required: true, min: 2, max: 10, message: '昵称长度必须在2~10之间'}
  ],
  phone: [
    {type: "string", required: true, len: 11, message: '手机号码必须11位'},
    {type: "string", required: true, len: 11, pattern: /^[1]([3-9])[0-9]{9}$/, message: '手机号码不符合规范，请输入正确的手机号'}
  ],
  password: [
    {type: "string", required: true, min: 6, max: 20, message: '密码至少6个字符，最多20个字符'},
    {type: "string", required: true, pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{6,20}$/, message: '密码必须由字母、数字组成，区分大小写'}
  ]
};
const RegisterValidator = function(ctx){
  return new Promise((resolve, reject) => {
    new AsyncValidator(userRule).validate(ctx.request.body, { first: true }).then(() => {
      resolve();
    }).catch((errors) =>{
      resolve(errors);
    });;
  });
};

/**
 * 验证诗词提交数据
 * */
const poemRule = {
  title: [
    {type: "string", required: true, min: 1, max: 20, message: '标题字符在1到20之间'}
  ],
  content: [
    {type: "string", required: true, min: 1, message: '数据不能为空'}
  ],
  auther: [
    {type: "string", required: true, min: 1, max: 20, message: '作者姓名长度在1到20之间'}
  ],
  descript: [
    {type: "string", required: true, min: 1, message: '描述不能为空'}
  ],
};
const PoemValidator = function(ctx){
  return new Promise((resolve, reject) => {
    new AsyncValidator(poemRule).validate(ctx.request.body, { first: true }).then(() => {
      resolve();
    }).catch((errors) =>{
      resolve(errors);
    });;
  });
};
module.exports = {
  RegisterValidator,
  PoemValidator
};