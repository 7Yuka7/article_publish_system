<template>
  <div>
    <!-- 专栏作者信息 -->
    <div class="colum-detail-page w-75 mx-auto">
      <div class="cllum-info row mb-4 border-bottom pb-4 align-items-center" v-if="colum">
        <div class="col-3 text-center">
          <img :src="colum.avatar.url" :alt="colum.title" class="rounded-circle border w-100">
        </div>
        <div class="col-9">
          <h4>{{ colum.title }}</h4>
          <p class="text-muted">{{ colum.description }}</p>
        </div>
      </div>
    </div>
    <!-- 文章信息 -->
    <PostList :list="list"></PostList>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
// 引入路由信息
import { useRoute } from 'vue-router'
// 引入仓库以及数据格式
import { useStore } from 'vuex'
import { GlobalDataProps } from '../store'
// 引入文章组件
import PostList from '@/components/PostList.vue'

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
      // 不用简化也可以，因为使用后台接口数据本来就只会返回一条
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
      store.dispatch('fetchSingleColumn', currentId)
      store.dispatch('fetchPost', currentId)
    }
    // 返回参数
    return {
      colum,
      list
    }
  }
})
</script>

<style scoped></style>
