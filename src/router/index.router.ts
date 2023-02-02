import { createRouter, createWebHistory } from 'vue-router';

const routes = [{ path: '/', name: 'employee', component: () => import('../components/employee/Index.vue') }];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
