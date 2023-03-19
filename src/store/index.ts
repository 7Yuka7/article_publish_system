import { createStore } from 'vuex'
// 从死数据中引入数据格式以及内容
import { ColumnProps, testData, PostProps, testPosts } from '../testData'

// 用户数据格式
interface UserProps {
  isLoading: boolean,
  name?: string,
  id?: number
  columnId?: number
}
export interface GlobalDataProps {
  colums: ColumnProps[],
  posts: PostProps[],
  user: UserProps
}

const store = createStore<GlobalDataProps>({
  actions: {
    //
  },
  mutations: {
    // 登录
    login (state) {
      state.user = { ...state.user, isLoading: true, name: 'yuka', columnId: 1 }
    },
    // 创建新的文章
    createPost (state, value) {
      state.posts.push(value)
    }
  },
  state: {
    colums: testData,
    posts: testPosts,
    user: { isLoading: false, name: 'yuka', columnId: 1 }
  },
  getters: {
    getColumById: (state) => (currentId:number) => {
      return state.colums.find(c => c.id === currentId)
    },
    getPostsById: (state) => (currentId:number) => {
      return state.posts.filter(item => item.columnId === currentId)
    }
  }
})

export default store
