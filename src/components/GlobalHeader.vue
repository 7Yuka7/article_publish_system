<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4" >
    <a class="navbar-brand" href="#">山风专栏</a>
    <ul v-if="!user.isLoading" class="list-inline mb-0">
      <li class="list-inline-item"><a href="#" class="btn btn-outline-light my-2">登录</a></li>
      <li class="list-inline-item"><a href="#" class="btn btn-outline-light my-2">注册</a></li>
    </ul>
    <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <!-- 在DropDown和DropDownItem中的都是是slot，因此逐层传递到了DropDownItem中 -->
        <DropDown :title="`Hello,${user.name}`">
          <DropDownItem>
            <a href="#" class="dropdown-item">新建文章</a>
          </DropDownItem>
          <DropDownItem>
            <a href="#" class="dropdown-item">编辑资料</a>
          </DropDownItem>
          <DropDownItem :disabled="true">
            <a href="#" class="dropdown-item">退出登录</a>
          </DropDownItem>
        </DropDown>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

// 引入下拉菜单组件
import DropDown from './DropDown.vue'
import DropDownItem from './DropDownItem.vue'

// 定义数据格式
export interface UserProps {
  isLoading: boolean,
  name?: string,
  id?: number
}

export default defineComponent({
  name: 'GlobalHeader',
  components: { DropDown, DropDownItem },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  }
  // setup () {

  //   return { }
  // }
})
</script>

<style scoped>

</style>
