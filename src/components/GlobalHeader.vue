<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4" >
    <router-link class="navbar-brand" to="/">山风专栏</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登录</router-link></li>
      <li class="list-inline-item"><router-link to="/singup" class="btn btn-outline-light my-2">注册</router-link></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <!-- 在DropDown和DropDownItem中的都是是slot，因此逐层传递到了DropDownItem中 -->
        <DropDown :title="`Hello,${user.nickName}`">
          <DropDownItem>
            <!-- 点击新建文章转跳至 -->
            <router-link to="/create" class="dropdown-item">新建文章</router-link>
          </DropDownItem>
          <DropDownItem :disabled="true">
            <a class="dropdown-item">编辑资料</a>
          </DropDownItem>
          <DropDownItem >
            <!-- 退出登录，清空本地存储token -->
            <button class="dropdown-item" @click.prevent="logOut">退出登录</button>
          </DropDownItem>
        </DropDown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
// 引入下拉菜单组件
import DropDown from './DropDown.vue'
import DropDownItem from './DropDownItem.vue'
// 引入store
import { useStore } from 'vuex'
// 引入路由
import { useRouter } from 'vue-router'
// 引入数据格式
import { UserProps } from '@/store'

export default defineComponent({
  name: 'GlobalHeader',
  components: { DropDown, DropDownItem },
  setup () {
    const store = useStore()
    const router = useRouter()
    const user = computed(():UserProps => {
      return store.state.user
    })
    // 挂载的时候，若本地有token则发送请求验证Token
    // onMounted(() => {
    //   if (localStorage.getItem('token')) {
    //     store.dispatch('fetchCurrentUser')
    //   }
    // })

    // 退出登录 1.清空本地token 2.转跳至首页并刷新(取消)
    const logOut = () => {
      localStorage.removeItem('token')
      router.go(0)
    }

    // 返回数据
    return { user, logOut }
  }
})
</script>

<style scoped>

</style>
