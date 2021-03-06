
import Router from 'koa-router';
import { publicDir } from '../config';
import path from 'path';
const router = new Router({
  prefix: '/api'
});

import user from '../controller/user';
import ceshi from '../controller/ceshi';
import upload from '../controller/upload'
import banner from '../controller/banner';
import poem from '../controller/poem';
import wenzi from '../controller/wenzi';
// 引用 user
router.post('/login', user.login);
router.post('/register', user.register);
// 引用 ceshi
router.post('/addceshi', ceshi.add);
router.post('/deleteceshi', ceshi.delete);
router.post('/listceshi', ceshi.list);
// 图片上传
// 上传banner
router.post('/uploadbanner', upload.uploadBannerImg);
// 上传文字
router.post('/uploadwenzi', upload.uploadWenziImg);
// 轮播图提交
router.post('/sumbitbanner', banner.sumbitbanner);
router.post('/getbanner', banner.getbanner);

// 引用诗词
router.post('/addpoem', poem.add);
router.post('/deletepoem', poem.delete);
router.post('/listpoem', poem.list);
router.post('/editpoem', poem.edit);

// 引用文字
router.post('/sumbitwenzi', wenzi.sumbitwenzi);
router.post('/getwenzi', wenzi.getwenzi);
router.post('/deletewenzi', wenzi.delete);
module.exports = router
