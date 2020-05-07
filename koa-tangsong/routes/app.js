
import Router from 'koa-router';
import { publicDir } from '../config';
import path from 'path';
const router = new Router({
  prefix: '/app'
});

import home from '../controller/app/home';
import wenzi from '../controller/app/wenzi';
router.post('/home', home.home);
router.post('/poemlist', home.poemlist);
router.post('/poemdetail', home.poemDetail);
router.post('/wenziSearch',  wenzi.wenziSearch);
module.exports = router
