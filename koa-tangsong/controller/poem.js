import poemService from '../models/poem';
import { PoemValidator } from '../validator/validator';
const { InvalidQueryError } = require('../lib/error');
module.exports = {
    // 分页查询
    async list(ctx, next) {
        const { pageNum, pageSize } = ctx.request.body;
        const result = await poemService.findByPage({}, pageNum, pageSize);
        if (!result) {
            ctx.code = 1003;
            ctx.error = '获取列表失败'
        } else {
            ctx.result = result;
            ctx.code = 200;
        }
        return next();
    },
    // 添加
    async add(ctx, next) {
        const { title, content, auther, descript, book, traditionTitle, traditionContent, traditionAuther, traditionBook, isFan = 0} = ctx.request.body;
        if (!title || !content || !auther || !descript || !traditionContent) {
            throw new InvalidQueryError();
        };
        let errors = await PoemValidator(ctx);
        if (errors && errors.errors){
            ctx.error = errors.errors[0].message;
            ctx.code = 1003;
            return next();
        };
        if (await poemService.findOne({ title })) {
            ctx.error = '诗词已存在';
            ctx.code = 1003;
        } else {
            const result = await poemService.save({
                title, content, auther, descript, book,
                traditionTitle, traditionContent, traditionAuther, traditionBook, isFan});
            ctx.result = result;
            ctx.msg = '添加成功！',
            ctx.code = 200;
        };
        return next();
    },
    // 删除
    async delete(ctx, next) {
        const { id } = ctx.request.body;
        if (!id) {
            throw new InvalidQueryError();
        };
        const result = await poemService.deleteById(id);
        if (!result){
            ctx.error = '诗词不存在';
            ctx.code = 1003;
        } else {
            ctx.msg = '删除成功！',
            ctx.code = 200;
        }
        return next();
    },
    // 编辑
    async edit(ctx, next) {
        const { title, content, auther, descript, book, id, traditionTitle = '', traditionContent = '', traditionAuther = '', traditionBook = '',isFan = 0 } = ctx.request.body;
        if (!title || !content || !auther || !descript || !id || !traditionContent) {
            throw new InvalidQueryError();
        };
        let errors = await PoemValidator(ctx);
        if (errors && errors.errors){
            ctx.error = errors.errors[0].message;
            ctx.code = 1003;
            return next();
        };
        const result = await poemService.update({'_id': id},
        {$set:{
            title, content, auther, descript, book,
            traditionTitle, traditionContent, traditionAuther, traditionBook, isFan}});
        ctx.result = result;
        ctx.msg = '修改诗歌成功！',
        ctx.code = 200;
        return next();
    },
};