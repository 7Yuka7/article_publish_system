<template>
  <div class="post-detail-page">
    <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
      这是文章详情界面
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
// 引入路由和仓库
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'PostDetial',
  setup () {
    let currentId = ''
    // 路由和仓库
    const route = useRoute()
    const store = useStore()
    // 获取数据
    const currentPost = computed(() => {
      return store.getters.getPostById(currentId)
    })
    // 挂载的时候请求数据
    onMounted(() => {
      currentId = route.params.id as string
      store.dispatch('fetchPaper', currentId)
    })
    // 返回数据
    return {
      currentPost
    }
  }
})
</script>

<style scoped>

</style>
