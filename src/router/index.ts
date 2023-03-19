import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeViewVue from '../views/HomeView.vue'

// 引入仓库判断用户登录与否
import store from '@/store'

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
    component: () => import('../views/LoginView.vue'),
    meta: { redirectAlreadyLogin: true }
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
    component: () => import('@/views/CreatePost.vue'),
    meta: { requireLogin: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// 此处可以设置路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requireLogin && !store.state.user.isLoading) {
    // 访问的页面需要登录，且目前没登陆，转跳到登录页面
    next('/login')
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLoading) {
    // 已经登录了，在进入login页面，直接跳转到首页
    next('/')
  } else {
    // 不符合其他规则直接放行
    next()
  }
})
// 导出
export default router
