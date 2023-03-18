<template>
  <!-- container 是bootstrap的一个标识根组件，很多特性必须包裹在container中使用 -->
  <div class="container">
    <GlobalHeader :user="user"></GlobalHeader>
    <router-view></router-view>
    <FooterArea></FooterArea>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// 引入bootstrap库
import 'bootstrap/dist/css/bootstrap.min.css'
// 引入组件
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue' // 头部导航
import FooterArea from '@/components/FooterArea.vue' // 底部信息栏

const CurrentUser: UserProps = {
  isLoading: false
  // name: 'yuka',
  // id: 1
}

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    FooterArea
  },
  setup () {
    return {
      user: CurrentUser
    }
  }

})
</script>

<style>

</style>
