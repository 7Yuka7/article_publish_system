<template>
  <div class="dropdown" ref="dropdownRef">
    <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">{{ title }}</a>
    <ul class="dropdown-menu" :style="{ display: 'block' }" v-if="isOpen">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

// 引入下拉框菜单钩子
import useClickOutside from '@/hooks/useClickOutside'

export default defineComponent({
  name: 'DropDown',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup () {
    // 下拉菜单点击展开收缩事件
    const isOpen = ref(false)
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }
    // 点击别的地方，下拉菜单消失
    // dropdownRef.value即为整个下拉框的HTML结构
    // 取得下拉菜单的html 加上当前的isOpen状态直接传入钩子函数中进行判断，返回的是修改后的isOpen具有响应式
    const dropdownRef = ref<null | HTMLElement>(null)
    useClickOutside(dropdownRef, isOpen)

    return { isOpen, toggleOpen, dropdownRef }
  }
})
</script>

<style scoped></style>
