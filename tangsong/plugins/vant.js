import Vue from 'vue';
import Vant from 'vant';
import { Toast, Dialog  } from 'vant';
import 'vant/lib/index.css';
// import {
//     Style,
//     Scroll
// } from 'cube-ui'
Vue.use(Vant);
Vue.prototype.$toast = Toast;
Vue.prototype.$dialog = Dialog;