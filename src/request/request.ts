// axios的二次封装
import axios from 'axios'
// 引入isLoading判断
import store from '@/store'

const requests = axios.create({
  baseURL: 'http://apis.imooc.com/api/',
  timeout: 5000
})

// 请求拦截器
requests.interceptors.request.use((config) => {
  // 在每个接口后面接上一个params -- 授课api要求
  config.params = { ...config.params, icode: '30009341E6B96885' }
  if (config.data instanceof FormData) {
    config.data.append('icode', '30009341E6B96885')
  } else {
    config.data = { ...config.data, icode: '30009341E6B96885' }
  }
  // isLoding设置为true -- 加载动画开启
  store.commit('SETLOADING', true)

  // 在每次请求前都重置错误
  store.commit('SETERROR', { status: false, message: '' })

  // 设置token -- 从本地取或者为undefined(undefined不会随着响应头发送)
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // 交出经过处理的请求头
  return config
})

// 响应拦截器
requests.interceptors.response.use((res) => {
  // 关闭加载动画
  store.commit('SETLOADING', false)
  return res
}, (err) => {
  // 将错误信息存储到store中，后续在message组件中给出提示
  store.commit('SETERROR', { status: true, message: err.response.data.error })
  // 将是否在加载改为false --> 取消加载动画
  store.commit('SETLOADING', false)

  // 返回错误信息
  return Promise.reject(err.response.data.error)
})

export default requests
