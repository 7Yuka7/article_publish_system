<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4" >
    <router-link class="navbar-brand" to="/">山风专栏</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登录</router-link></li>
      <li class="list-inline-item"><router-link to="/columns/2" class="btn btn-outline-light my-2">注册</router-link></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <!-- 在DropDown和DropDownItem中的都是是slot，因此逐层传递到了DropDownItem中 -->
        <DropDown :title="`Hello,${user.nickName}`">
          <DropDownItem>
            <router-link to="/create" class="dropdown-item">新建文章</router-link>
          </DropDownItem>
          <DropDownItem :disabled="true">
            <a href="#" class="dropdown-item">编辑资料</a>
          </DropDownItem>
          <DropDownItem >
            <a href="#" class="dropdown-item">退出登录</a>
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
// 引入数据格式
import { UserProps } from '@/store'

export default defineComponent({
  name: 'GlobalHeader',
  components: { DropDown, DropDownItem },
  setup () {
    const store = useStore()
    const user = computed(():UserProps => {
      return store.state.user
    })
    // 挂载的时候发送请求查看是否有登录信息
    onMounted(() => {
      store.dispatch('fetchCurrentUser')
    })

    // 返回数据
    return { user }
  }
})
</script>

<style scoped>

</style>
