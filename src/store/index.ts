import { createStore } from 'vuex'
// 从死数据中引入数据格式以及内容
import { ColumnProps, testData, PostProps, testPosts } from '../testData'

// 用户数据格式
interface UserProps {
  isLoading: boolean,
  name?: string,
  id?: number
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
    login (state) {
      state.user = { ...state.user, isLoading: true, name: 'yuka' }
    }
  },
  state: {
    colums: testData,
    posts: testPosts,
    user: { isLoading: false }
  }
})

export default store
