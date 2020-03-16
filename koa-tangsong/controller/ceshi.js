import ceshiService from '../models/ceshi';
const { InvalidQueryError } = require('../lib/error');
module.exports = {
    // 分页查询
    async list(ctx, next) {
        const { pageNum, pageSize } = ctx.request.body;
        const result = await ceshiService.findByPage({}, pageNum, pageSize);
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
        const { title, body } = ctx.request.body;
        if (!title || !body) {
            throw new InvalidQueryError();
        };
        if (await ceshiService.findOne({ title })) {
            ctx.error = '文章已存在';
            ctx.code = 1003;
        } else {
            const article = await ceshiService.save({ title, body });
            ctx.result = {
                id: article._id,
                title: article.title,
                body: article.body
            };
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
        const result = await ceshiService.deleteById(id);
        if (!result){
            ctx.error = '文章不存在';
            ctx.code = 1003;
        } else {
            ctx.msg = '删除成功！',
            ctx.code = 200;
        }
        return next();
    },
    // 编辑

};