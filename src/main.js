// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import 'babel-polyfill'
import Vuex from 'vuex'
import store from './store'
import ElementUI from 'element-ui';
import md5 from 'js-md5'
import qs from 'qs'
import './permission'
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/css/base.scss";
import './assets/iconfont/iconfont.css';

Vue.use(ElementUI, {
  size: 'small' // set element-ui default size
})

Vue.prototype.$md5 = md5;
Vue.prototype.$qs = qs;

const errorHandler = (error, vm)=>{
  console.error('抛出全局异常');
  console.error(vm);
  console.error(error);
}

Vue.config.errorHandler = errorHandler;
Vue.prototype.$throw = (error)=> errorHandler(error,this);
// Vue.use(ElementUI)

axios.defaults.withCredentials = true
Vue.prototype.$ajax = axios

axios.defaults.headers.post['Content-Type'] = "application/x-www-form-urlencoded"

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
