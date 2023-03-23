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
    path: '/columns/:id',
    name: 'columns',
    component: () => import('@/views/ColumDetail.vue')
  },
  // 发布文章界面
  {
    path: '/create',
    name: 'create',
    component: () => import('@/views/CreatePost.vue'),
    meta: { requireLogin: true }
  },
  // 注册界面
  {
    path: '/singup',
    name: 'singup',
    component: () => import('@/views/SingUp.vue'),
    meta: { redirectAlreadyLogin: true } // 已经登录了就不需要注册了
  },
  // 上传界面
  {
    path: '/upload',
    name: 'upload',
    component: () => import('@/components/UploaderView.vue'),
    meta: { requireLogin: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 此处可以设置路由守卫
router.beforeEach(async (to, from, next) => {
  // 解构数据
  const { token } = store.state
  const { isLogin } = store.state.user
  const { requireLogin, redirectAlreadyLogin } = to.meta

  // 按照流程图
  if (isLogin) {
    // 已登录
    if (redirectAlreadyLogin) {
      // 登录状态下不需要再进入的页面,eg: 注册页面
      next('/')
    } else {
      next()
    }
  } else {
    // 未登录
    if (token) {
      // 本地存在token -- 验证token的有效性 -- try-catch中就和if-esle相同
      try {
        // 请求成功
        await store.dispatch('fetchCurrentUser')
        if (redirectAlreadyLogin) {
          // 不需要再进注册页面
          next('/')
        } else {
          next()
        }
      } catch (error) {
        // 请求失败 -- 弹出提示,并跳转到登录界面
        store.commit('LOGOUT')
        store.commit('SETERROR', error)
        next('/login')
      }
    } else {
      // 本地没有存储token
      if (requireLogin) {
        // 没登陆但是想去的需要权限 -- 转到登录页
        next('/login')
      } else {
        // 不需要权限就直接进入
        next()
      }
    }
  }

  if (to.meta.requireLogin && !store.state.user.isLogin) {
    // 访问的页面需要登录，且目前没登陆，转跳到登录页面
    next('/login')
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    // 已经登录了，在进入login页面，直接跳转到首页
    next('/')
  } else {
    // 不符合其他规则直接放行
    next()
  }
})
// 导出
export default router
