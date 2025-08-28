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
          meta: {
            name: '主页'
          }
        },
        {
          path: 'admin',
          name: 'admin',
          component: () => import('../views/Admin.vue'),
          meta: {
            name: '管理员信息'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
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
