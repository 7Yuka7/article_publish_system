import requests from './request'

// 请求首页专栏信息接口
export const reqFetchColumn = () => {
  return requests({
    url: '/columns',
    method: 'get'
  })
}

// 个人详情页面 -- 专栏信息展示
export const reqFetchSingleColum = (id:string) => {
  return requests({
    url: `/columns/${id}`,
    method: 'get'
  })
}
// 个人详情页面 -- 文章展示
export const reqFetchPost = (id:string, currentPage?:string, pageSize?:string) => {
  return requests({
    url: `/columns/${id}/posts`,
    method: 'get',
    params: {
      currentPage,
      pageSize
    }
  })
}

// 发送登录信息
export const reqPutLogin = (playLoad:{email:string, password: string}) => {
  return requests({
    url: '/user/login',
    method: 'post',
    data: {
      // 记得解构，因为后端接口需要的是emial和password
      ...playLoad
    }
  })
}

// 获取当前用户信息
export const reqFetchUser = () => {
  return requests({
    url: '/user/current',
    method: 'get'
  })
}

// 注册
export const reqPostSignup = (playLoad:{email:string, nickName:string, password:string}) => {
  return requests({
    url: '/users',
    method: 'post',
    data: {
      ...playLoad
    }
  })
}

// 上传文件
export const reqPostFile = (url:string, fileData:FormData) => {
  return requests({
    url,
    method: 'post',
    data: fileData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 发布文章
export const reqPostPaper = (data:object) => {
  return requests({
    url: '/posts',
    method: 'post',
    data
  })
}

// 请求特定文章
export const reqFetchPaper = (id:string) => {
  return requests({
    url: `/posts/${id}`,
    method: 'get'
  })
}
