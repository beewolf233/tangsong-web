
import Router from 'koa-router';
import { publicDir } from '../config';
import path from 'path';
const router = new Router({
  prefix: '/app'
});

import home from '../controller/app/home';
router.post('/home', home.home);
router.post('/poemlist', home.poemlist);
router.post('/poemdetail', home.poemDetail);
module.exports = router
