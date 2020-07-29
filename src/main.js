import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from "vue-axios";
import PerfectScrollbar from "vue2-perfect-scrollbar";
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'

Vue.use(VueAxios, axios)
Vue.use(PerfectScrollbar);

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    router
}).$mount('#app')
