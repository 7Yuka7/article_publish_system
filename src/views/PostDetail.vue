<template>
  <div class="post-detail-page">
    <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
      <img :src="currentPost.image.url" :alt="currentPost.title" class="rounded w-100 mb-4">
      <h2 class="mb-4">{{ currentPost.title }}</h2>
      <div class="user-profile-component border-top border-bottom py-3 mb-4 row">
        <div class="col">
          <div>
            <UserProfile :author="currentPost.author"></UserProfile>
          </div>
        </div>
        <span class="text-muted col text-right font-italic">发表于：{{ currentPost.createdAt }}</span>
      </div>
      <div v-html="currentHTML"></div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
// 引入路由和仓库
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
// 引入组件
import UserProfile from '@/components/UserProfile.vue'
// 引入markdown转换库
import MarkDownIt from 'markdown-it'
export default defineComponent({
  name: 'PostDetial',
  components: {
    UserProfile
  },
  setup () {
    let currentId = ''
    // markdown实例
    const md = new MarkDownIt()
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

    // 获取需要转换成MarkDown的数据
    const currentHTML = computed(() => {
      if (currentPost.value && currentPost.value.content) {
        return currentPost.value.isHTML ? currentPost.value.content : md.render(currentPost.value.content)
      } else {
        return ''
      }
    })

    // 返回数据
    return {
      currentPost,
      currentHTML
    }
  }
})
</script>

<style scoped>

</style>
