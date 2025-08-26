import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'manager',
      component: () => import('../views/Manager.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('../views/Home.vue'),
        },
      ]
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('../views/error/404.vue'),
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/error'
    }
  ],
})

export default router
