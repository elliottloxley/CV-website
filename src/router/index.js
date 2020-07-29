import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/pages/Home/Home.vue'
import Websites from "@/components/pages/Websites/Websites";
import CV from "@/components/pages/CV/CV";
import Software from "@/components/pages/Software/Software";
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
            path: '/websites',
            name: 'websites',
            component: Websites
        },
        {
            path: '/about',
            name: 'about',
            component: CV
        },
        {
            path: '/software',
            name: 'software',
            component: Software
        },
        {
            path: '/contact',
            name: 'contact',
            component: Contact
        }
    ]
})