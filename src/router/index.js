import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: {requiresGuest: true}
    },
    {
        path: '/signup',
        name: 'signup',
        component: SignupView,
        meta: {requiresGuest: true}
    },
    {
        path: '/devstash', // inner project dashboard path
        name: 'devstash',
        component: () => import('../views/DevStashView.vue'),
        meta: {requiresAuth:true}
    }
]

const router = createRouter({
    history: createWebHistory(), routes
});

router.beforeEach((to, from, next) => {
    const hasToken = !!localStorage.getItem('auth_token');
    if(to.matched.some(record => record.meta['requiresAuth'])) {
        if(!hasToken) {
            next("/login");
        } else {
            next();
        }
    }

    else if(to.matched.some(record => record.meta['requiresGuest'])) {
        if(hasToken) {
           next('/devstash');
        } else {
            next();
        }
    }

    else {
        next();
    }
})

export default router;