import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _4f922bb1 = () => interopDefault(import('../pages/poemdetail.vue' /* webpackChunkName: "pages/poemdetail" */))
const _787c28c4 = () => interopDefault(import('../pages/poemList.vue' /* webpackChunkName: "pages/poemList" */))
const _ebe63aae = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/poemdetail",
    component: _4f922bb1,
    name: "poemdetail"
  }, {
    path: "/poemList",
    component: _787c28c4,
    name: "poemList"
  }, {
    path: "/",
    component: _ebe63aae,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
