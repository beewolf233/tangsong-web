import bannerService from '../models/banner';
const { InvalidQueryError } = require('../lib/error');
module.exports = {
    async sumbitbanner (ctx, next) {
        let { banner, id } = ctx.request.body;
        if (!banner) {
            throw new InvalidQueryError();
        };
        if (id && id!=null) {
            const result = await bannerService.update({'_id': id}, 
            {$set:{banner}});
            console.log()
            ctx.result = {
                id: result._id,
                banner: result.banner
            };
            ctx.msg = '首页轮播图更新成功！',
            ctx.code = 200;
        } else {
            const result = await bannerService.save({ banner });
            ctx.result = {
                id: result._id,
                banner: result.banner
            };
            ctx.msg = '首页轮播图添加成功！',
            ctx.code = 200;
        };
        return next();
    },
    async getbanner (ctx, next) {
        let result =  await bannerService.model.find();
        if (!result) {
            ctx.code = 1003;
            ctx.error = '获取列表失败'
        } else {
            if (result.length == 0){
                ctx.result = result
            } else {
                ctx.result = {
                    banner: JSON.parse(result[0].banner),
                    id: result[0].id
                };
            }
            ctx.code = 200;
        }
        return next();
    },
};
