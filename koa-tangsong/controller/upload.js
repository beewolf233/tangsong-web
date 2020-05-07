import ImgUploadService from '../lib/imgUploadService';
// const { InvalidQueryError } = require('../lib/error');
module.exports = {
    async uploadBannerImg (ctx, next) {
        const uploadPath = `/tangsongimg/banner`;
        const imgUploadService = new ImgUploadService(uploadPath);
        imgUploadService.execute(ctx);
        return next();
    },
    async uploadWenziImg (ctx, next) {
        const uploadPath = `/tangsongimg/wenzi`;
        const imgUploadService = new ImgUploadService(uploadPath, false);
        imgUploadService.execute(ctx);
        return next();
    },
};
