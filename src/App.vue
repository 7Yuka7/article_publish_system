<template>
  <!-- container 是bootstrap的一个标识根组件，很多特性必须包裹在container中使用 -->
  <div class="container">
    <LoaderView v-if="isLoading" text="内容正在加载中..." background="rgba(0,0,0,0.8)"></LoaderView>
    <GlobalHeader></GlobalHeader>
    <router-view></router-view>
    <FooterArea></FooterArea>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
// 引入bootstrap库
import 'bootstrap/dist/css/bootstrap.min.css'
// 引入组件
import GlobalHeader from './components/GlobalHeader.vue' // 头部导航
import FooterArea from '@/components/FooterArea.vue' // 底部信息栏
import LoaderView from './components/LoaderView.vue' // 加载中组件
// 引入仓库 -- 主要是为了isLoading
import store from './store'
export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    FooterArea,
    LoaderView
  },
  setup () {
    const isLoading = computed(() => {
      return store.state.isLoading
    })
    return {
      isLoading
    }
  }

})
</script>

<style>

</style>
