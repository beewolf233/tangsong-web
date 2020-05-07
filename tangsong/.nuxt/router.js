import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _30840160 = () => interopDefault(import('../pages/poemdetail.vue' /* webpackChunkName: "pages/poemdetail" */))
const _1d3b610d = () => interopDefault(import('../pages/poemList.vue' /* webpackChunkName: "pages/poemList" */))
const _0a820120 = () => interopDefault(import('../pages/poemwrite.vue' /* webpackChunkName: "pages/poemwrite" */))
const _b26c08cc = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _30840160,
    name: "poemdetail"
  }, {
    path: "/poemList",
    component: _1d3b610d,
    name: "poemList"
  }, {
    path: "/poemwrite",
    component: _0a820120,
    name: "poemwrite"
  }, {
    path: "/",
    component: _b26c08cc,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
