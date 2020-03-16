import userService from '../models/user';
import { RegisterValidator } from '../validator/validator';
import jwt from 'jsonwebtoken';
import { tokenConfig } from '../config';
const { InvalidQueryError } = require('../lib/error');
module.exports = {
    // 登陆
    async login(ctx, next) {
        const { username, password } = ctx.request.body;
        if (!username || !password) {
            throw new InvalidQueryError()
        }
        const user = await userService.findOne({ username });
        if (!user) {
            ctx.error = '用户不存在';
            ctx.code = 1003;
        } else if (user.password !== password) {
            ctx.error = '密码错误';
            ctx.code = 1003;
        } else {
            ctx.msg = '用户登陆成功！',
            ctx.code = 200;
            ctx.result = {
                userInfo: {
                    id: user._id,
                    username: user.username,
                },
                token: jwt.sign({
                    data: user._id,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 3), //设置 token 过期时间: 3d
                }, tokenConfig.secret)
            }
        }
        return next()
    },
    // 注册
    async register(ctx, next) {
        const {username, phone, password} = ctx.request.body;
        let errors = await RegisterValidator(ctx);
        if (errors && errors.errors){
            ctx.error = errors.errors[0].message;
            ctx.code = 1003;
            return next();
        };
        if (!username || !phone || !password) {
            throw new InvalidQueryError()
        };
        if (await userService.findOne({ username }) || await userService.findOne({ phone })) {
            ctx.error = '用户已存在';
            ctx.code = 1003;
        } else {
            const user = await userService.save({ username, phone, password});
            ctx.msg = '用户注册成功！';
            ctx.code = 200;
            ctx.result = {
                username: user.username,
                id: user.id
            };
        };
        return next();
    }
};
