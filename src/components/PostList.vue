<template>
  <div class="post-list">
    <article v-for="item in list" :key="item.id" class="card mb-3 shadow-sm">
      <div class="card-body">
        <h4>{{ item.title }}</h4>
        <div class="row my-3 align-items-center">
          <div v-if="item.image" class="col-3">
            <img :src="item.image" :alt="item.title" class="rounded-lg w-100">
          </div>
          <p :class="{'col-9': item.image}">{{ item.content }}</p>
        </div>
        <span class="text-muted">{{ item.createdAt }}</span>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
// 引入数据类型
import { PostProps } from '../testData'

export default defineComponent({
  name: 'PostList',
  // 使用该组件需要传入数据list
  props: {
    list: {
      type: Array as PropType<PostProps[]>,
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
