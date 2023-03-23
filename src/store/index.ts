import { createStore, Commit } from 'vuex'
// 引入接口
import requests from '@/request/request'
import { reqFetchColumn, reqFetchSingleColum, reqFetchPost, reqPutLogin, reqFetchUser, reqPostPaper, reqFetchPaper } from '@/request/index'
// 引入请求axios的实例 -- 后续在request的响应拦截器中统一设置了token的发送与否
// import requests from '@/request/request'

// 定义收到的数据格式 -- 全面去除死数据
// 一些基础的数据格式，被多次复用，可以被扩展
// avatar数据格式
export interface ImageData {
  url?: string,
  _id?: string,
  createdAt?: string
}
// interface BasicFormate {
//   author: string,
//   avatar: ImageData,
//   createdAt: string,
//   description: string,
//   featured: boolean,
//   title: string,
//   __v: number,
//   _id: string
// }
// ***************首页专栏数据********************

interface HomeColumData {
  author: string,
  avatar: ImageData,
  createdAt: string,
  description: string,
  featured: boolean,
  key: number,
  title: string,
  __v: number,
  _id: string
}
// 不确定哪些数据可以不用带，因此此处Partial一下
export type IHomeColumData = Partial<HomeColumData>

// ***************用户数据格式********************
export interface UserProps {
  isLogin: boolean,
  avatar?: ImageData,
  column?: string,
  description?: string,
  emial?: string,
  nickName?: string,
  _id?: string,
  createdAt?: string
}

// ***************个人专栏列表数据********************
interface PostData {
  author: string | UserProps,
  column: string,
  createAt: string,
  excerpt: string,
  image: ImageData | string,
  key: number,
  title: string,
  _id: string,
  content?: string,
  isHTML?: boolean
}
export type IPostData = Partial<PostData>

// ***************错误信息格式********************
interface ErrorProps {
  status: boolean,
  message?: string
}

// ***************上传图片响应格式********************
export interface ResponseType<P = object> {
  code: number,
  msg: string,
  data: P
}

// ***************设置仓库的数据格式*****************
export interface GlobalDataProps {
  error: ErrorProps,
  token: string, // 令牌
  isLoading: boolean, // 是否加载
  colums: IHomeColumData[], // 专栏卡片数据
  posts: IPostData[], // 文章数据列表
  user: UserProps // 用户数据
}
// 抽象的actions发送函数
// function getAndCommit = async (reqFunction:()=>Promise<AxiosResponse<any,any>>, mutationName:string, commit:Commit) => {
//   const { data } = await reqFunction()
//   commit(mutationName, data)
// }
const store = createStore<GlobalDataProps>({
  actions: {
    // 以下的actions代码可以抽象到一个函数中
    // ****异步获取首页专栏数据
    async fetchColumnData ({ commit }) {
      try {
        const result = await reqFetchColumn()
        commit('FETCHCOLUMNDATA', result.data)
      } catch (error) {
        console.error('获取首页专栏数据失败', error)
      }
    },
    // ****获取专栏列表数据
    // 个人专栏信息 -- 不用在此处定义传入参数的类型，因为在发送请求的函数上定义过了
    async fetchSingleColumn ({ commit }, id:string) {
      try {
        const result = await reqFetchSingleColum(id)
        commit('FETCHSINGLECOLUMN', result.data)
      } catch (error) {
        console.error('获取个人专栏信息失败', error)
      }
    },
    // 个人发表文章信息 id:string, currentPage:string, pageSize:string
    async fetchPost ({ commit }, value) {
      try {
        const result = await reqFetchPost(value)
        commit('FETCHPOST', result.data)
      } catch (error) {
        console.error('获取个人发表文章信息失败', error)
      }
    },
    // ****权限验证
    // 登录post请求
    async potLogin ({ commit }, value) {
      const result = await reqPutLogin(value)
      commit('POSTLOGIN', result.data)
    },
    // 根据token获取用户信息请求
    async fetchCurrentUser ({ commit }) {
      const result = await reqFetchUser()
      commit('FETCHCURRENTUSER', result.data)
    },

    // 这里联合action问题很大，因为我在每个action中都已经处理了错误，因此返回的都不是error --> 解决方法，在对应的actions中直接发送，而不是用try-catch包裹

    // 联合两个action -- 先登录，后转跳到首页需要获取信息
    // postAndFtechUser ({ dispatch }, value) {
    //   // 收到的value是登录的账号密码
    //   return dispatch('potLogin', value).then(() => {
    //     return dispatch('fetchCurrentUser')
    //   })
    // }
    async postAndFtechUser ({ dispatch }, value) {
      try {
        await dispatch('potLogin', value)
        await dispatch('fetchCurrentUser')
      } catch (error) {
        return error
      }
    },
    // ****发表文章
    async postPaper ({ commit }, value) {
      try {
        const result = await reqPostPaper(value)
        commit('POSTPAPER', result.data)
      } catch (error) {
        console.log('发表文章失败', error)
      }
    },
    // 请求文章详情
    async fetchPaper ({ commit }, value) {
      try {
        const result = await reqFetchPaper(value)
        console.log('文章详情', result.data.data)
        commit('FETCHPAPER', result.data.data)
      } catch (error) {
        console.error('请求文章详情失败', error)
      }
    }
  },

  mutations: {
    // 是否在加载中 -- 最好不要直接去store.state.isLoding直接去修改
    SETLOADING (state, status) {
      state.isLoading = status
    },
    // 首页专栏
    FETCHCOLUMNDATA (state, value) {
      state.colums = value.data.list
    },
    // 个人页专栏信息
    FETCHSINGLECOLUMN (state, value) {
      // 要转换成数组形式
      state.colums = [value.data]
    },
    // 个人发表文章信息
    FETCHPOST (state, value) {
      state.posts = value.data.list
    },
    // -------------------------------------------------------------
    // 登录信息获取token -- 并将token放置到本地存储，且设置到请求头中
    POSTLOGIN (state, value) {
      const { token } = value.data
      state.token = token
      localStorage.setItem('token', token)
      // 拿到token在axios中设置请求头(感觉这步应该在拦截器中进行)
      // requests.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    // 获取用户信息
    FETCHCURRENTUSER (state, value) {
      state.user = { isLogin: true, ...value.data }
    },
    // 响应全局获取错误信息
    SETERROR (state, value) {
      state.error = { ...value }
    },
    // 退出登录 & token信息过期
    LOGOUT (state) {
      localStorage.removeItem('token')
      state.token = ''
      delete requests.defaults.headers.common.Authorization
    },
    // 发表文章
    POSTPAPER (state, value) {
      state.posts.push(value)
    },
    // 请求单片文章详情
    FETCHPAPER (state, value) {
      state.posts.push(value)
    }
  },

  state: {
    error: { status: false },
    // 初始的token从本次存储中找找看
    token: localStorage.getItem('token') || '',
    isLoading: false,
    colums: [],
    posts: [],
    user: { isLogin: false }
  },

  getters: {
    getColumById: (state) => (currentId:string) => {
      return state.colums.find(c => c._id === currentId)
    },
    getPostsById: (state) => (currentId:string) => {
      return state.posts.filter(item => item.column === currentId) // colum是人
    },
    getPostById: (state) => (currentId:string) => {
      return state.posts.find(c => c._id === currentId)
    }
  }
})

export default store
