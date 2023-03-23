<template>
  <div class="post-list">
    <article v-for="item in list" :key="item._id" class="card mb-3 shadow-sm">
      <div class="card-body">
        <router-link :to="`/posts/${item._id}`" class="my-2" style="text-decoration: none; color: gray;">
          <h4>{{ item.title }}</h4>
        </router-link>
        <div class="row my-3 align-items-center">
          <div v-if="item.image" class="col-3">
            <img :src="item.image && (item.image as ImageData).url" :alt="item.title" class="rounded-lg w-100">
          </div>

          <p :class="{'col-9': item.image}">
            <router-link :to="`/posts/${item._id}`" style="text-decoration: none; color: gray;">{{ item.excerpt }}</router-link>
          </p>
        </div>
        <span class="text-muted">{{ item.createAt }}</span>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
// 引入数据类型
import { IPostData, ImageData } from '@/store'

export default defineComponent({
  name: 'PostList',
  // 使用该组件需要传入数据list,数据结构类型已更新
  props: {
    list: {
      type: Array as PropType<IPostData[]>,
      required: true
    }
  },
  setup () {
    return {}
  }
})
</script>

<style scoped>

</style>
