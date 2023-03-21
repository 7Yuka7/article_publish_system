<template>
  <teleport to='#message'>
    <div class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between mt-2" :class="classObject" v-if="isVisible">
      <span>{{ message }}</span>
      <button type="button" class="btn-close"  aria-label="Close" @click.prevent="hide"></button>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
// 创建DOM元素钩子函数
import useDOMCreate from '@/hooks/useDOMCreate'
// 组件数据函数
export type MessageType = 'success' | 'error' | 'default'

export default defineComponent({
  name: 'MessageView',
  // 使用该组件需要传入两个参数：message以及type（对应不同颜色）
  props: {
    message: String,
    type: {
      type: String as PropType<MessageType>,
      default: 'default'
    }
  },
  // 组件传入一个回调函数，可以用来扩展组件关闭后的一些事件
  emits: ['close-message'],
  setup (props, context) {
    // 创建对应的teleport节点
    useDOMCreate('message')
    // 初始化数据
    const isVisible = ref(true)
    const classObject = {
      'alert-success': props.type === 'success',
      'alert-danger': props.type === 'error',
      'alert-primary': props.type === 'default'
    }
    // 关闭组件
    const hide = () => {
      isVisible.value = false
      // 触发自定义事件
      context.emit('close-message', true)
    }

    // 返回数据
    return {
      isVisible,
      classObject,
      hide
    }
  }
})
</script>

<style scoped></style>
