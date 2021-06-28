import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/pages/Home/Home.vue'
import Work from "@/components/pages/work/Work";
import Contact from "@/components/pages/Contact/Contact";

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {pagePosition: [0,0], loaded: {page: false, sections: {}}}
        },
        {
            path: '/work',
            name: 'work',
            component: Work,
            meta: {pagePosition: [1,0], loaded: {page: false, sections: {}}}
        },
        {
            path: '/contact',
            name: 'contact',
            component: Contact,
            meta: {pagePosition: [-1,0], loaded: {page: false, sections: {}}}
        }
    ]
})