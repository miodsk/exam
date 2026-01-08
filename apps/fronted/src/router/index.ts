import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/',
      name: 'layout',
      redirect: '/examList',
      component: () => import('@/layout/Layout.vue'),
      children: [
        {
          path: 'user',
          name: 'user',
          component: () => import('@/views/user/User.vue'),
        },
        {
          path: 'edit/:id',
          name: 'edit',
          component: () => import('@/views/exam/Edit.vue'),
        },
        {
          path: 'examList',
          name: 'examList',
          component: () => import('@/views/exam/List.vue'),
        },
      ],
    },
  ],
})

export default router
