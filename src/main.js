import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'

import store from './store'
import axios from 'axios'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
import qs from "qs";
Vue.config.productionTip = false
axios.defaults.withCredentials = true
Vue.prototype.$qs = qs;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
