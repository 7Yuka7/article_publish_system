<template>
  <!-- 文章内容区域 -->
  <div class="post-detail-page">
    <article class="w-75 mx-auto mb-5 pb-3" v-if="currentPost">
      <img :src="currentPost.image && (currentPost.image as ImageData).url" :alt="currentPost.title" class="rounded w-100 mb-4">
      <h2 class="mb-4">{{ currentPost.title }}</h2>
      <div class="user-profile-component border-top border-bottom py-3 mb-4 row">
        <div class="col">
          <div>
            <UserProfile :author="(currentPost.author as UserProps)" > </UserProfile>
          </div>
        </div>
        <span class="text-muted col text-right font-italic">发表于：{{ currentPost.createdAt }}</span>
      </div>
      <div v-html="currentHTML"></div>
      <!-- 编辑选项按钮 -->
      <div v-if="showEidtArea" class="btn-group mt-5">
        <router-link :to="{name: 'create', query: {id:currentPost._id}}" type="button" class="btn btn-success">编辑</router-link>
        <button type="button" class="btn btn-danger">删除</button>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
// 引入路由和仓库
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
// 引入数据格式
import { IPostData, UserProps, ImageData } from '@/store'
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
    // markdown实例
    const md = new MarkDownIt()
    // 路由和仓库
    const route = useRoute()
    const store = useStore()
    // 获取当前路径
    const currentId = route.params.id as string
    // 获取数据
    const currentPost = computed<IPostData >(() => {
      const data = store.state.postDetail
      return data
    })
    // 挂载的时候请求数据
    onMounted(() => {
      store.dispatch('fetchPaper', currentId)
    })

    // 判断文章是否为当前用户所写 -- 若是，则显示编辑与删除按钮
    const showEidtArea = computed<boolean>(() => {
      // 获取当前用户信息
      const { isLogin, _id } = store.state.user
      // 当前文章信息
      if (currentPost.value && currentPost.value.author && isLogin) {
        const postAuthor = currentPost.value.author as UserProps
        return postAuthor._id === _id
      } else {
        return false
      }
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
      currentHTML,
      showEidtArea
    }
  }
})
</script>

<style scoped>

</style>
