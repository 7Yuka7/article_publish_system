<template>
  <div class="row">
    <div v-for="colum in columnList" :key="colum._id" class="col-4 mb-4">
      <div class="card h-100 shadow-sm">
        <!-- 类型守卫 -->
        <img :src="colum.avatar && colum.avatar.url" :alt="colum.title" class="rounded-circle mx-auto border border-light w-25 my-3">
        <div class="acrd-body text-center">
          <h5 class="card-text">{{ colum.title }}</h5>
          <p class="card-text text-left">{{ colum.description }}</p>
          <router-link :to="`/columns/${colum._id}`" class="btn btn-outline-primary">进入专栏</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
// 引入数据的接口定义
import { IHomeColumData } from '@/store'

export default defineComponent({
  name: 'CloumList',
  props: {
    list: {
      type: Array as PropType<IHomeColumData[]>,
      // 这个list props是必须要从父组件中传入的
      required: true
    }
  },
  setup (props) {
    // 如果list的参数没有传入图片，那么就使用默认图片
    const columnList = computed(() => {
      return props.list.map(column => {
        // 如果没有avatar项就会补充
        if (!column.avatar) {
          column.avatar = require('@/assets/logo.png')
        } else {
          column.avatar.url = column.avatar.url + '?x-oss-process=/resize,m_pad,h_50,w_50'
        }
        return column
      })
    })
    return { columnList }
  }
})
</script>

<style scoped lang="less">
</style>
