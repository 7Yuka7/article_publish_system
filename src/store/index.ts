import { createStore, Commit } from 'vuex'
// 引入接口
import requests from '@/request/request'
import { reqFetchColumn, reqFetchSingleColum, reqFetchPost, reqPutLogin, reqFetchUser, reqPostPaper, reqFetchPaper, reqPatchPaper, reqDeletePaper } from '@/request/index'
// 引入请求axios的实例 -- 后续在request的响应拦截器中统一设置了token的发送与否
// import requests from '@/request/request'

// 引入数据转换方法
import { arrToObj, objToArr } from '@/hooks/useDataStructure'

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
  createdAt: string,
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

// 优化colums和posts的数据格式
interface ListProps<T> {
  [id: string]: T
}

// ***************设置仓库的数据格式*****************
export interface GlobalDataProps {
  error: ErrorProps,
  token: string, // 令牌
  isLoading: boolean, // 是否加载
  colums: { data: ListProps<IHomeColumData>, currentPage: number, total: number }, // 专栏卡片数据
  posts: { data: ListProps<IPostData>, currentPage: number, count: number, loadedColumns:string[] }, // 文章数据列表
  user: UserProps, // 用户数据
  postDetail: IPostData
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
    async fetchColumnData ({ state, commit }, value = {}) {
      const { currentPage = 1, pageSize = 6 } = value
      try {
        // 仓库中的页数小于当前页就发送请求 或者 用户在个人专栏页刷新导致数据丢失，然后返回首页的时候，即长度小于一个pageSize时需要发送请求
        if (state.colums.currentPage as number < currentPage || Object.keys(state.colums.data).length < pageSize) {
          const result = await reqFetchColumn(currentPage, pageSize)
          commit('FETCHCOLUMNDATA', result.data)
        }
      } catch (error) {
        console.error('获取首页专栏数据失败', error)
      }
    },
    // ****获取专栏列表数据 -- 可以直接从总的专栏上去取
    // 个人专栏信息 -- 不用在此处定义传入参数的类型，因为在发送请求的函数上定义过了
    async fetchSingleColumn ({ state, commit }, id:string) {
      try {
        // 只有当仓库中没有数据，才发送请求
        if (state.colums.total === 0) {
          const result = await reqFetchSingleColum(id)
          commit('FETCHSINGLECOLUMN', result.data)
        }
      } catch (error) {
        console.error('获取个人专栏信息失败', error)
      }
    },

    // 个人发表文章信息 id:string, currentPage:string, pageSize:string
    async fetchPost ({ state, commit }, value) {
      const { id, currentPage = 1, pageSize = 5 } = value
      try {
        if (!state.posts.loadedColumns.includes(id) || state.posts.currentPage as number < currentPage) { // 当仓库中已经存在当前个人的id的时候(即已请求过)，则不发送请求；或者页数发生变化的时候则也需要发送请求
          const result = await reqFetchPost(id, currentPage, pageSize)
          const rawData = result.data
          commit('FETCHPOST', { rawData, id })
        }
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
        commit('FETCHPAPER', result.data.data)
      } catch (error) {
        console.error('请求文章详情失败', error)
      }
    },

    // 修改文章
    async patchPaper ({ commit }, value) {
      const { id, data } = value
      try {
        const result = await reqPatchPaper(id, data)
        commit('PATCHPAPER', result.data)
      } catch (error) {
        console.error('更新文章失败', error)
      }
    },

    // 删除文章
    async deletePaper ({ commit }, id:string) {
      try {
        const result = await reqDeletePaper(id)
        commit('DELETEPAPER', result.data)
      } catch (error) {
        console.error('删除文章失败', error)
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
      const { currentPage, count } = value.data
      const data = arrToObj(value.data.list)
      state.colums = { data: { ...state.colums.data, ...data }, currentPage: +currentPage, total: count }
    },
    // 个人页专栏信息
    FETCHSINGLECOLUMN (state, value) {
      // 进入此处说明，此时的专栏信息已丢失，因此需要单独发送请求来获取信息，该信息没有currentPage和total, 但在此处指定了，意为让其重头再来
      const data = arrToObj([value.data])
      state.colums = { data: { ...state.colums.data, ...data }, currentPage: 0, total: 0 }
    },

    // 个人发表文章信息
    FETCHPOST (state, value) {
      const { rawData, id } = value
      const { currentPage, count } = rawData.data
      const data = arrToObj(rawData.data.list)
      state.posts.data = { ...state.posts.data, ...data }
      state.posts.currentPage = currentPage
      state.posts.count = count
      state.posts.loadedColumns.push(id)
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
      state.posts.data[value._id] = value
    },
    // 请求单片文章详情
    FETCHPAPER (state, value) {
      state.postDetail = { ...value }
    },
    // 更新文章
    PATCHPAPER (state, value) {
      state.postDetail = { ...value }
    },
    // 删除文章
    DELETEPAPER (state, value) {
      delete state.posts.data[value._id]
    }
  },

  state: {
    error: { status: false },
    // 初始的token从本次存储中找找看
    token: localStorage.getItem('token') || '',
    isLoading: false,
    colums: { data: {}, currentPage: 0, total: 0 },
    posts: { data: {}, currentPage: 0, count: 0, loadedColumns: [] },
    user: { isLogin: false },
    postDetail: {}
  },

  getters: {
    getColumById: (state) => (currentId:string) => {
      return state.colums.data[currentId]
    },
    getPostsById: (state) => (currentId:string) => {
      return objToArr(state.posts.data).filter(item => item.column === currentId) // colum是人
    }
  }
})

export default store
