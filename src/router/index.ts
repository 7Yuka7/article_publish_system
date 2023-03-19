import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeViewVue from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeViewVue
  },
  // 登录界面
  {
    path: '/login',
    name: 'login',
    // 路由懒加载
    component: () => import('../views/LoginView.vue')
  },
  // 文章详情界面
  {
    path: '/colum/:id',
    name: 'colum',
    component: () => import('@/views/ColumDetail.vue')
  },
  // 发布文章界面
  {
    path: '/create',
    name: 'create',
    component: () => import('@/views/CreatePost.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// 此处可以设置路由守卫

// 导出
export default router
