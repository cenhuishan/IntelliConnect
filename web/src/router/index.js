import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
// import constantRoutes from './constantRoutes'
// import asyncRoutes from './asyncRoutes'
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/forgotPassword',
    name: 'forget', 
    component: () => import('@/views/forgotPassword/index.vue'),
  },
  {
    path: '/register',
    name: 'Register', 
    component: () => import('@/views/register/index.vue'),
  },
  // Catch-all must be present from app start so that beforeEach receives the
  // original navigation path (e.g. /knowledgeGraphic) before dynamic routes
  // are registered via GENERATE_ROUTES.  Without this, Vue Router warns
  // "No match found" and the navigation intent may be lost.
  {
    path: '/:pathMatch(.*)*',
    name: 'CatchAll',
    component: () => import('@/views/error/404NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory('/vue3-antd-manage/'),
  routes,
})

export { constantRoutes } from './constantRoutes'
export { asyncRoutes } from './asyncRoutes'

export default router


