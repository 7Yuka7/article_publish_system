<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50" />
          <h2 class="font-weight-light">山风专栏，分享您的故事</h2>
          <p>
            <router-link to="/create" class="btn btn-primary my-2">开始写文章</router-link>
          </p>
        </div>
      </div>
    </section>

    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <ColumnList :list="list"></ColumnList>
    <!-- 加载更多 -->
    <div class="loader-more-container text-center" >
      <button class="btn btn-outline-primary mt-2 mb-5 btn-block w-25 mx-auto" @click="loadMorePage" v-if="!isLastPage">
        加载更多
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ComputedRef } from 'vue'
// 引入组件
import ColumnList from '@/components/ColumnList.vue' // 卡片组件
// 引入store以及需要用到的数据结构
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/store'
import { objToArr } from '@/hooks/useDataStructure'
import useLoadMore from '@/hooks/useLoadMore'

export default defineComponent({
  name: 'HomeView',
  components: { ColumnList },
  setup () {
    // 加载更多相关
    const total = computed(() => {
      return store.state.colums.total
    })
    const currentPage = computed(() => store.state.colums.currentPage)

    const store = useStore<GlobalDataProps>()
    // 从store中获取专栏数据
    const list = computed(() => {
      return objToArr(store.state.colums.data)
    })
    // 挂载函数
    onMounted(() => {
      // 派发请求
      getData()
    })
    // 请求数据函数
    const getData = () => {
      const data = { pageSize: 3 }
      store.dispatch('fetchColumnData', data)
    }

    // 请求分页数据
    const { loadMorePage, isLastPage } = useLoadMore('fetchColumnData', total as ComputedRef<number>, { currentPage: currentPage.value ? currentPage.value + 1 : 2, pagaSize: 3 })

    // 返回数据
    return {
      list,
      loadMorePage,
      isLastPage
    }
  }
})
</script>

<style scoped lang="less">
</style>
