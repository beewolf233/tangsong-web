import bannerService from '../../models/banner';
import poemService from '../../models/poem';
// const { InvalidQueryError } = require('../lib/error');
module.exports = {
    async home (ctx, next) {
        let result1 =  await bannerService.model.find();
        let result2 = await poemService.findByPage({}, 1, 2);
        let result3 = await poemService.findById('5e6cd8cef9ee7d13e90dff68');
        if (!result1 || !result2 || !result3){
            ctx.code = 1003;
            ctx.error = '获取列表失败'
        } else {
            ctx.code = 200;
            let banner = result1.length == 0? [] : JSON.parse(result1[0].banner);
            ctx.result = {
                banner: banner,
                poemintro: result2.list || [],
                poemDay: [result3] || []
            }
        }
        return next();
    },

    // 分页查询
    async poemlist(ctx, next) {
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
    // 诗词详情
    async poemDetail(ctx, next) {
        const { id } = ctx.request.body;
        const result = await poemService.findById(id);
        if (!result) {
            ctx.code = 1003;
            ctx.error = '获取诗词失败'
        } else {
            ctx.result = result;
            ctx.code = 200;
        }
        return next();
    },
};
