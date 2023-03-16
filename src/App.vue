<template>
  <!-- container 是bootstrap的一个标识根组件，很多特性必须包裹在container中使用 -->
  <div class="container">
    <GlobalHeader :user="user"></GlobalHeader>
    <ColumnList :list="list"></ColumnList>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// 引入bootstrap库
import 'bootstrap/dist/css/bootstrap.min.css'
// 引入组件
import ColumnList, { ColumnProps } from './components/ColumnList.vue'
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'

// 声明死数据
const testData: ColumnProps[] = [
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是test1专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: '@/assets/logo.png'
  },
  {
    id: 2,
    title: 'test1的专栏',
    description: '这是test1专栏，有一段非常有意思的简介，可以更新一下欧'
  },
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是test1专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: '@/assets/logo.png'
  },
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是test1专栏，有一段非常有意思的简介，可以更新一下欧',
    avatar: '@/assets/logo.png'
  }
]
const CurrentUser: UserProps = {
  isLoading: false
}

export default defineComponent({
  name: 'App',
  components: {
    ColumnList,
    GlobalHeader
  },
  setup () {
    return {
      list: testData,
      user: CurrentUser
    }
  }

})
</script>

<style>

</style>
