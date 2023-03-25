<template>
  <div>
    <!-- 专栏作者信息 -->
    <div class="colum-detail-page w-75 mx-auto">
      <div class="cllum-info row mb-4 border-bottom pb-4 align-items-center" v-if="colum">
        <div class="col-3 text-center">
          <img :src="colum.avatar && colum.avatar.url" :alt="colum.title" class="rounded-circle border w-100">
        </div>
        <div class="col-9">
          <h4>{{ colum.title }}</h4>
          <p class="text-muted">{{ colum.description }}</p>
        </div>
      </div>
    </div>
    <!-- 文章信息 -->
    <PostList :list="list"></PostList>
    <!-- 加载更多 -->
    <div class="loader-more-container text-center" v-if="!isLastPage">
      <button class="btn btn-outline-primary mt-2 mb-5 btn-block w-25 mx-auto" @click="loadMorePage">
        加载更多
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ComputedRef } from 'vue'
// 引入路由信息
import { useRoute } from 'vue-router'
// 引入仓库以及数据格式
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
// 引入文章组件
import PostList from '@/components/PostList.vue'
// 引入加载更多
import useLoadMore from '@/hooks/useLoadMore'
import { is } from '@babel/types'

export default defineComponent({
  name: 'ColumDetail',
  components: { PostList },
  setup () {
    // 路由和仓库
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    // 获取当前params携带的id
    const currentId = route.params.id

    // 从store中获取要展示的数据
    const colum = computed(() => {
      return store.getters.getColumById(currentId)
    })
    const list = computed(() => {
      return store.getters.getPostsById(currentId)
    })

    // 挂载发送请求
    onMounted(() => {
      getData()
    })
    const getData = () => {
      // 这些操作都会进行，具体发不发送请求由store中判断
      store.dispatch('fetchSingleColumn', currentId)
      const data = { id: currentId, currentPage: 1, pageSize: 3 }
      store.dispatch('fetchPost', data)
    }

    // 加载更多
    const total = computed(() => {
      return store.state.posts.count
    })
    const currentPage = computed(() => store.state.colums.currentPage)

    const { loadMorePage, isLastPage } = useLoadMore('fetchPost', total as ComputedRef<number>, { currentPage: currentPage.value ? currentPage.value + 1 : 2, pagaSize: 3 }, currentId as string)

    // 返回参数
    return {
      colum,
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>

<style scoped></style>
