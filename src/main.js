import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from "vue-axios";
import ColourTheme from "@/themes/ColourTheme";

Vue.use(VueAxios, axios)

Vue.config.productionTip = false
new Vue({
    data: {
        blobStatic: false,
        currentTheme: ColourTheme.light
    },
    render: h => h(App),
    router
}).$mount('#app')
