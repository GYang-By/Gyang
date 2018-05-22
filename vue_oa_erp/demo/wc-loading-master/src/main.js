import Vue from 'vue'
import App from './App'

import Loading from './wc-loading'
Vue.use(Loading);

new Vue({
    el: '#app',
    template: '<App/>',
    components: {App}
})
