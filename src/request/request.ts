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
  store.state.isLoading = true
  // 设置token -- 从本地取或者为undefined(undefined不会随着响应头发送)
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}` || undefined
  console.log(config)
  // 交出经过处理的请求头
  return config
})

// 响应拦截器 -- 等会在设置
requests.interceptors.response.use((res) => {
  store.state.isLoading = false
  return res
}, (err) => {
  // 错误信息给出
  return err
})

export default requests
