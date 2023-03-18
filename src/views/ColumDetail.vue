<template>
  <div>
    <!-- 专栏作者信息 -->
    <div class="colum-detail-page w-75 mx-auto">
      <div class="cllum-info row mb-4 border-bottom pb-4 align-items-center" v-if="colum">
        <div class="col-3 text-center" >
          <img :src="colum.avatar" :alt="colum.title" class="rounded-circle border">
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
import { defineComponent } from 'vue'
// 引入路由信息
import { useRoute } from 'vue-router'
// 引入死数据
import { testData, testPosts } from '../testData'
// 引入文章组件
import PostList from '@/components/PostList.vue'

export default defineComponent({
  name: 'ColumDetail',
  components: { PostList },
  setup () {
    const route = useRoute()
    // 获取当前params携带的id
    const currentId = +route.params.id
    // 从死数据中获取要展示的数据
    const colum = testData.find(c => c.id === currentId)
    const list = testPosts.filter(item => item.columnId === currentId)
    return {
      colum,
      list
    }
  }
})
</script>

<style scoped>

</style>
