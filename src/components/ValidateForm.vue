<template>
  <form class="validate-form-container">
    <slot></slot>
    <div class="submit-area" @click="submitForm">
      <slot name="submit">
        <button type="submit" class="btn btn-primary">登录</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
// 引入监听器,并创建对象
import mitt from 'mitt'
// 监听函数的类型
type ValidateFunc = () => boolean
// 监听事件的类型
type Events = {
  'form-item-created':ValidateFunc
}
export const emitter = mitt<Events>()

export default defineComponent({
  name: 'ValidateForm',
  // 自定义事件的传入
  emits: ['form-submit'],
  setup (props, context) {
    let funcArr:ValidateFunc[] = []
    // 点击提交的时候，循环调用数组中的方法
    const submitForm = () => {
      const result = funcArr.map(func => func()).every(result => result)
      context.emit('form-submit', result)
    }
    // 监听器发布事件以及组件消失时取消事件的监听
    const callback = (func:ValidateFunc) => {
      funcArr.push(func)
    }
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      // 取消挂载的时候清空数组
      funcArr = []
    })

    return { submitForm }
  }
})
</script>

<style scoped></style>
