<template>
  <!-- container 是bootstrap的一个标识根组件，很多特性必须包裹在container中使用 -->
  <div class="container">
    <GlobalHeader :user="user"></GlobalHeader>
    <HomeView></HomeView>
    <LoginView></LoginView>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// 引入bootstrap库
import 'bootstrap/dist/css/bootstrap.min.css'
// 引入组件
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'
import LoginView from './views/LoginView.vue'
import HomeView from './views/HomeView.vue'

const CurrentUser: UserProps = {
  isLoading: true,
  name: 'yuka',
  id: 1
}

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    HomeView,
    LoginView
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
