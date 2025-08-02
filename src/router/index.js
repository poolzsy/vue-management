import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/manager/home'
    },
    {
      path: '/manager',
      name: 'manager',
      component: () => import('../views/Manager.vue'),
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('../views/Home.vue')
        },
        {
          path: 'user',
          name: 'user',
          children: [
            {
              path: 'employee',
              name: 'employee',
              component: () => import('../views/Employee.vue')
            },
            {
              path: 'admin',
              name: 'admin',
              component: () => import('../views/AdminUser.vue')
            }
          ]
        },
        {
          path: 'data',
          name: 'data',
          component: () => import('../views/Data.vue')
        },
      ]
    },
    {
      path: '/:catchAll(.*)',
      name: '404',
      component: () => import('../views/404.vue')
    }
  ]
})

export default router
