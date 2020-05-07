import wenziService from '../models/wenzi';
// import { uploadWenziImg } from '../controller/upload'
const { InvalidQueryError } = require('../lib/error');
module.exports = {
    async sumbitwenzi (ctx, next) {
        let { name, traditionname, id, pic, backpic} = ctx.request.body;
        if (!name || !traditionname || !pic || !backpic) {
            throw new InvalidQueryError();
        };
        if (id && id!=null) {
            const result = await wenziService.update({'_id': id}, 
            {$set:{
                name,
                traditionname,
                pic,
                backpic
            }});
            ctx.result = {
                id: result._id,
                name: result.name,
                traditionname: result.traditionname,
                pic: result.pic,
                backpic: result.backpic
            };
            ctx.msg = '文字更新成功！',
            ctx.code = 200;
        } else {
            const result = await wenziService.save({ 
                name,
                traditionname,
                pic,
                backpic
             });
            ctx.result = {
                id: result._id,
                name: result.name,
                traditionname: result.traditionname,
                pic: result.pic,
                backpic: result.backpic
            };
            ctx.msg = `文字'${name}'添加成功！`,
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
        const result = await wenziService.deleteById(id);
        if (!result){
            ctx.error = '文字不存在';
            ctx.code = 1003;
        } else {
            ctx.msg = '删除成功！',
            ctx.code = 200;
        }
        return next();
    },
    async getwenzi (ctx, next) {
        const { pageNum, pageSize } = ctx.request.body;
        const result = await wenziService.findByPage({}, pageNum, pageSize);
        if (!result) {
            ctx.code = 1003;
            ctx.error = '获取列表失败'
        } else {
            ctx.result = result;
            ctx.code = 200;
        }
        return next();
    },
};
