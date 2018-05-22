
import Vue from 'vue'
import App from './App'
import router from './router'
// 公共全局样式
import './assets/commin.css/commom.css'
// 配合适配使用样式表
// import './assets/commin.css/commomBeifen.css'

// loading
import Loading from './assets/wc-loading'
Vue.use(Loading);
// 引入全局变量
import gBasturl from '../static/config/urlGlobal'
Vue.prototype.global = gBasturl;

//引入JQ
import $ from 'jquery'

// 淘宝适配
// import "./assets/commom.js/flexible_css.debug"
// import "./assets/commom.js/flexible.debug"

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
// 拦截器里边添加对响应状态码的判断，来决定是跳转到登录页面还是留在当前页面继续获取数据
//eg: https://blog.csdn.net/lucky_lxg/article/details/70847168?utm_source=itdadao&utm_medium=referral
// Vue.http.interceptors.push(function(request,next){
Vue.http.interceptors.push((request, next) => {
  console.log(this)//此处this为请求所在页面的Vue实例
  // modify request
  request.method = 'POST';//在请求之前可以进行一些预处理和配置

  // continue to next interceptor
  next((response) => {//在响应之后传给then之前对response进行修改和逻辑判断。对于token时候已过期的判断，就添加在此处，页面中任何一次http请求都会先调用此处方法

    response.body = '...';
    return response;

  });
});

// 导航守卫
// router.beforeEach((to, from, next) => {
//   if (this.mag) {
//     next()
//   } else {
//   }
// })


