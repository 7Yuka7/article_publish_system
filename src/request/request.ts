// axios的二次封装
import axios from 'axios'

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
  // 交出经过处理的请求头
  return config
})

// 响应拦截器 -- 等会在设置
// requests.interceptors.response.use((res) => {
//   return res.data
// }, (err) =>{

// })

export default requests
