<template>
  <!-- container 是bootstrap的一个标识根组件，很多特性必须包裹在container中使用 -->
  <div class="container">
    <LoaderView v-if="isLoading" text="内容正在加载中..." background="rgba(0,0,0,0.8)"></LoaderView>
    <GlobalHeader></GlobalHeader>
    <MessageView type="error" :message="error.message"></MessageView>
    <router-view></router-view>
    <FooterArea></FooterArea>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onMounted } from 'vue'
// 引入bootstrap库
import 'bootstrap/dist/css/bootstrap.min.css'
// 引入组件
import GlobalHeader from '@/components/GlobalHeader.vue' // 头部导航
import FooterArea from '@/components/FooterArea.vue' // 底部信息栏
import LoaderView from '@/components/LoaderView.vue' // 加载中组件
import createMessage from '@/components/createMessage' // 引入创建消息栏组件的方法
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
    // 判断请求是否还在加载
    const isLoading = computed(() => {
      return store.state.isLoading
    })
    const error = computed(() => {
      return store.state.error
    })

    // 使用watch监视是否有错误，有错误-->弹出message组件
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      // 存在error.message的时候才弹出
      if (status && message) {
        createMessage(message, 'error', 2000)
      }
    })
    // 挂载的时候检查以下登录状态
    onMounted(() => {
      // if (localStorage.getItem('token')) {
      //   store.dispatch('fetchCurrentUser')
      // }
    })
    // 返回数据
    return {
      isLoading,
      error
    }
  }

})
</script>

<style lang="less" scoped></style>
