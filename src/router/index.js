import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/pages/Home/Home.vue'
import Work from "@/components/pages/work/Work";
import Bio from "@/components/pages/Bio/Bio";
import Contact from "@/components/pages/Contact/Contact";

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/work',
            name: 'work',
            component: Work
        },
        {
            path: '/bio',
            name: 'bio',
            component: Bio
        },
        {
            path: '/contact',
            name: 'contact',
            component: Contact
        }
    ]
})