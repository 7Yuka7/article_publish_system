import { createStore, Commit } from 'vuex'
// 引入接口
import { reqFetchColumn, reqFetchSingleColum, reqFetchPost, reqPutLogin, reqFetchUser } from '@/request/index'
// 引入请求axios的实例
import requests from '@/request/request'

// 定义收到的数据格式 -- 全面去除死数据
// 一些基础的数据格式，被多次复用，可以被扩展
// avatar数据格式
interface ImageData {
  url: string,
  _id: string
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

// ***************个人专栏列表数据********************
interface PostData {
  author: string,
  column: string,
  createAt: string,
  excerpt: string,
  image: ImageData,
  key: number,
  title: string,
  _id: string,
  content?: string
}
export type IPostData = Partial<PostData>
//

// 用户数据格式
export interface UserProps {
  isLogin: boolean,
  avatar?: ImageData,
  column?: string,
  description?: string,
  emial?: string,
  nickName?: string,
  _id?: number
}
// 设置仓库的数据格式
export interface GlobalDataProps {
  token: string, // 令牌
  isLoading: boolean, // 是否加载
  colums: IHomeColumData[], // 专栏卡片数据
  posts: IPostData[], // 文章数据
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
      try {
        const result = await reqPutLogin(value)
        commit('POSTLOGIN', result.data)
      } catch (error) {
        console.log('登录请求失败', error)
      }
    },
    // 根据token获取用户信息请求
    async fetchCurrentUser ({ commit }) {
      try {
        const result = await reqFetchUser()
        console.log(result)
        commit('FETCHCURRENTUSER', result.data)
      } catch (error) {
        console.error('获取用户信息失败', error)
      }
    },
    // 联合两个action -- 先登录，后转跳到首页需要获取信息
    // postAndFtechUser ({ dispatch }, value) {
    //   // 收到的value是登录的账号密码
    //   return dispatch('potLogin', value).then(() => {
    //     return dispatch('fetchCurrentUser')
    //   })
    // }
    async postAndFtechUser ({ dispatch }, value) {
      await dispatch('potLogin', value)
      await dispatch('fetchCurrentUser')
    }
  },

  mutations: {
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
    // 以下为test ------------------------
    // 创建新的文章
    createPost (state, value) {
      state.posts.push(value)
    }
  },

  state: {
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
      return state.posts.filter(item => item.column === currentId)
    }
  }
})

export default store
