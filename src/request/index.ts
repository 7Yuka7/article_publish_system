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
