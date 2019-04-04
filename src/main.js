import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import touch from './plugings/directive/directive.js'
import VueTouch from 'vue-touch'

import MuseUI from 'muse-ui'
//import Loading from 'muse-ui-loading'
import 'muse-ui/dist/muse-ui.css'
//import 'muse-ui-loading/dist/muse-ui-loading.css';
import "../public/common.css";
//import 'muse-ui-progress/dist/muse-ui-progress.css';
import NProgress from 'muse-ui-progress';
require('vue2-animate/dist/vue2-animate.min.css');

//import touch from "./plugings/directive/directive"

Vue.use(NProgress);
Vue.use(MuseUI);
//Vue.use(Loading);
Vue.use(VueTouch, {name: 'v-touch'});
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
